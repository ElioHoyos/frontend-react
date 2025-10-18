// src/components/article/ArticleList.jsx
import React, { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import DataTable from 'react-data-table-component';
import ArticleEditModal from './ArticleEditModal';
import { useArticleContext } from '../../contexts/ArticleContext';
import { showConfirmDialog } from '../../utils/alertHelper';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// helpers para mapear snake/camel
const pick = (r, ...keys) => keys.find(k => r[k] !== undefined) && r[keys.find(k => r[k] !== undefined)];

const badge = (state) => (
  <span className={`badge ${state ? 'bg-success' : 'bg-danger'}`}>{state ? 'Activo' : 'Inactivo'}</span>
);

const fmtDate = (d) => (d ? dayjs(d).format('YYYY-MM-DD') : '—');
const money = (n) => `S/ ${Number(n ?? 0).toFixed(2)}`;

// Debounce simple
const useDebounce = (val, delay=500) => {
  const [v, setV] = useState(val);
  useEffect(() => { const t = setTimeout(() => setV(val), delay); return () => clearTimeout(t); }, [val, delay]);
  return v;
};

const ArticleList = () => {
  const {
    items, loading, error,
    currentPage, pageSize, totalPages, totalElements,
    sortField, sortDirection, searchTerm,
    setCurrentPage, setPageSize, setSortField, setSortDirection, setSearchTerm,
    removeArticle, toggleArticleState
  } = useArticleContext();

  const [editingArticle, setEditingArticle] = useState(null);
  const debounced = useDebounce(searchTerm, 500);
  useEffect(() => { setCurrentPage(0); }, [debounced, setCurrentPage]);

  // XS detector
  const [isXs, setIsXs] = useState(typeof window !== 'undefined' ? window.innerWidth < 576 : false);
  useEffect(() => {
    const onR = () => setIsXs(window.innerWidth < 576);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  const onDelete = async (row) => {
    const res = await showConfirmDialog('¿Eliminar artículo?', `Se eliminará "${row.name}".`);
    if (res.isConfirmed) removeArticle(row.id);
  };

  const onToggle = async (row) => {
    const action = row.state ? 'desactivar' : 'activar';
    const res = await showConfirmDialog('Confirmar', `¿Deseas ${action} "${row.name}"?`);
    if (res.isConfirmed) toggleArticleState(row.id);
  };

  // columnas completas
  const allColumns = useMemo(() => ([
  { name: 'Código', selector: r => r.code, sortable: true, sortField: 'code', width: '130px', wrap: true },

  {
    name: 'Nombre',
    sortable: true,
    sortField: 'name',
    grow: 2,
    wrap: true,
    cell: r => (
      <div title={`Creado: ${fmtDate(r.date_created ?? r.dateCreated)} | Modificado: ${fmtDate(r.date_modified ?? r.dateModified)}`}>
        <div className="fw-600">{r.name}</div>
        {!!r.description && <small className="text-muted">{r.description}</small>}
      </div>
    )
  },

  { name: 'Categoría', selector: r => r.category_name ?? r.categoryName, sortable: true, sortField: 'categoryName', width: '140px', wrap: true },

  { name: 'Cant.', selector: r => r.amount, sortable: true, sortField: 'amount', width: '90px', right: true },

  {
    name: 'Compra',
    selector: r => (r.purchase_price ?? r.purchasePrice ?? 0),
    sortable: true,
    sortField: 'purchasePrice',
    width: '110px',
    right: true,
    cell: r => money(r.purchase_price ?? r.purchasePrice)
  },

  {
    name: 'Venta',
    selector: r => (r.sale_price ?? r.salePrice ?? 0),
    sortable: true,
    sortField: 'salePrice',
    width: '110px',
    right: true,
    cell: r => money(r.sale_price ?? r.salePrice)
  },

  {
    name: 'Vence',
    selector: r => r.expiration_date ?? r.expirationDate ?? '',
    sortable: true,
    sortField: 'expirationDate',
    width: '120px',
    cell: r => {
      const d = r.expiration_date ?? r.expirationDate;
      const past = d && dayjs(d).isBefore(dayjs(), 'day');
      const soon = d && !past && dayjs(d).isBefore(dayjs().add(30, 'day'));
      const cls = past ? 'bg-danger'
                 : soon ? 'bg-warning text-dark'
                 : 'bg-secondary';
      return <span className={`badge ${cls}`}>{fmtDate(d)}</span>;
    }
  },

  {
    name: 'Estado',
    selector: r => r.state,
    sortable: true,
    sortField: 'state',
    width: '110px',
    cell: r => <span className={`badge px-3 ${r.state ? 'bg-success' : 'bg-danger'}`}>{r.state ? 'Activo' : 'Inactivo'}</span>
  },

  {
    name: 'Acciones',
    button: true,
    width: '170px',
    cell: r => (
      <div className="d-flex gap-2">
        <button className="btn btn-sm btn-info text-white" title="Editar" onClick={() => setEditingArticle(r)}><FaEdit /></button>
        <button className={`btn btn-sm ${r.state ? 'btn-warning' : 'btn-success'}`} title={r.state ? 'Desactivar' : 'Activar'} onClick={() => onToggle(r)}>
          {r.state ? <FaToggleOn /> : <FaToggleOff />}
        </button>
        <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => onDelete(r)}><FaTrash /></button>
      </div>
    ),
  },
]), [setEditingArticle]);

  const columns = useMemo(() => {
    if (!isXs) return allColumns;
    // en XS mostramos lo esencial
    return allColumns.filter(c => ['Código','Nombre','Estado'].includes(c.name));
  }, [isXs, allColumns]);

  const Expand = ({ data }) => (
    <div className="p-2 small">
      <div className="row g-2">
        <div className="col-6"><div className="text-muted">Categoría</div><div>{data.category_name ?? data.categoryName ?? '—'}</div></div>
        <div className="col-6"><div className="text-muted">Cantidad</div><div>{data.amount ?? 0}</div></div>
        <div className="col-6"><div className="text-muted">Compra</div><div>{`S/ ${(data.purchase_price ?? data.purchasePrice ?? 0).toFixed(2)}`}</div></div>
        <div className="col-6"><div className="text-muted">Venta</div><div>{`S/ ${(data.sale_price ?? data.salePrice ?? 0).toFixed(2)}`}</div></div>
        <div className="col-6"><div className="text-muted">Vence</div><div>{data.expiration_date ?? data.expirationDate ?? '—'}</div></div>
        <div className="col-6"><div className="text-muted">Creado</div><div>{data.date_created ?? data.dateCreated ?? '—'}</div></div>
      </div>
      <div className="d-flex flex-wrap gap-2 mt-2">
        <button className="btn btn-sm btn-info text-white" onClick={() => setEditingArticle(data)}><FaEdit className="me-1" /> Editar</button>
        <button className={`btn btn-sm ${data.state ? 'btn-warning' : 'btn-success'}`} onClick={() => onToggle(data)}>
          {data.state ? <FaToggleOn className="me-1" /> : <FaToggleOff className="me-1" />} {data.state ? 'Desactivar' : 'Activar'}
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(data)}><FaTrash className="me-1" /> Eliminar</button>
      </div>
    </div>
  );

  const customStyles = {
    headCells: { style: { fontWeight: 700, backgroundColor: '#212529', color: '#fff' } },
    rows: { style: { minHeight: isXs ? '40px' : '46px' } }
  };

  const handleSort = (column, direction) => {
    if (!column.sortField) return;
    setSortField(column.sortField);
    setSortDirection(direction.toUpperCase());
    setCurrentPage(0);
  };
  const handleChangePage = (p) => setCurrentPage(p - 1);
  const handleChangeRows = (n) => { setPageSize(n); setCurrentPage(0); };

  /* EXPORT */
  const exportCSV = () => {
    const header = ['Código','Nombre','Categoría','Cantidad','Compra','Venta','Vence','Estado','Creado','Modificado'];
    const body = items.map(r => [
      r.code ?? '',
      `"${(r.name||'').replace(/"/g,'""')}"`,
      r.category_name ?? r.categoryName ?? '',
      r.amount ?? 0,
      r.purchase_price ?? r.purchasePrice ?? 0,
      r.sale_price ?? r.salePrice ?? 0,
      r.expiration_date ?? r.expirationDate ?? '',
      r.state ? 'Activo':'Inactivo',
      r.date_created ?? r.dateCreated ?? '',
      r.date_modified ?? r.dateModified ?? '',
    ].join(','));
    const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'articulos.csv');
  };
  const exportXLSX = () => {
    const data = items.map(r => ({
      Código: r.code ?? '',
      Nombre: r.name ?? '',
      Categoría: r.category_name ?? r.categoryName ?? '',
      Cantidad: r.amount ?? 0,
      Compra: r.purchase_price ?? r.purchasePrice ?? 0,
      Venta: r.sale_price ?? r.salePrice ?? 0,
      Vence: r.expiration_date ?? r.expirationDate ?? '',
      Estado: r.state ? 'Activo':'Inactivo',
      Creado: r.date_created ?? r.dateCreated ?? '',
      Modificado: r.date_modified ?? r.dateModified ?? ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Artículos');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'articulos.xlsx');
  };

  const conditionalRowStyles = [
  {
    when: r => Number(r.amount) <= 5,                 // bajo stock
    style: { backgroundColor: 'rgba(255,193,7,.12)' }
  },
  {
    when: r => {
      const d = r.expiration_date ?? r.expirationDate;
      return d && dayjs(d).isBefore(dayjs(), 'day');   // vencido
    },
    style: { backgroundColor: 'rgba(220,53,69,.10)' }
  }
];

  const exportPDF = () => {
    const doc = new jsPDF('l','pt','a4');
    doc.setFontSize(14);
    doc.text('Listado de Artículos', 40, 40);
    const head = [['Código','Nombre','Categoría','Cantidad','Compra','Venta','Vence','Estado','Creado','Modificado']];
    const body = items.map(r => [
      r.code ?? '',
      r.name ?? '',
      r.category_name ?? r.categoryName ?? '',
      r.amount ?? 0,
      r.purchase_price ?? r.purchasePrice ?? 0,
      r.sale_price ?? r.salePrice ?? 0,
      r.expiration_date ?? r.expirationDate ?? '',
      r.state ? 'Activo':'Inactivo',
      r.date_created ?? r.dateCreated ?? '',
      r.date_modified ?? r.dateModified ?? ''
    ]);
    autoTable(doc, { head, body, startY: 60, headStyles: { fillColor: [33,37,41] }, styles: { fontSize: 9 } });
    doc.save('articulos.pdf');
  };

  return (
    <div className="card shadow-sm border-success">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Listado de Productos</h5>

        <div className="d-flex align-items-center gap-2">
          {/* Export */}
          <div className="btn-group">
            <button className="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">Exportar</button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" onClick={exportCSV}>CSV</button></li>
              <li><button className="dropdown-item" onClick={exportXLSX}>Excel (.xlsx)</button></li>
              <li><button className="dropdown-item" onClick={exportPDF}>PDF</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="px-3 pt-3">
        <div className="input-group w-100 w-lg-50 mb-2">
          <span className="input-group-text"><FaSearch /></span>
          <input
            className="form-control"
            placeholder="Buscar por nombre o código…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card-body p-2">
        {error ? (
          <div className="alert alert-danger text-center m-0">{error}</div>
        ) : (
          <DataTable
            columns={columns}
  data={items}
  progressPending={loading}
  dense
  highlightOnHover
  striped
  customStyles={customStyles}
  conditionalRowStyles={conditionalRowStyles}
  responsive
  wrap
  fixedHeader={!isXs}
  fixedHeaderScrollHeight={!isXs ? '60vh' : undefined}
  expandableRows={isXs}
  expandableRowsComponent={({ data }) => Expand({ data })}
  pagination
  paginationServer
  paginationPerPage={pageSize}
  paginationTotalRows={totalElements}
  paginationDefaultPage={currentPage + 1}
  onChangePage={(p) => setCurrentPage(p - 1)}
  onChangeRowsPerPage={(n) => { setPageSize(n); setCurrentPage(0); }}
  sortServer
  onSort={handleSort}
  defaultSortFieldId={columns.findIndex(c => c.sortField === sortField) + 1}
  defaultSortAsc={sortDirection !== 'DESC'}
  noDataComponent={<div className="text-muted py-4">No hay productos.</div>}
          />
        )}
      </div>

      {/* Modal editar */}
      {editingArticle && (
        <ArticleEditModal
    article={editingArticle}
    onClose={() => setEditingArticle(null)}
  />
      )}
    </div>
  );
};

export default ArticleList;
