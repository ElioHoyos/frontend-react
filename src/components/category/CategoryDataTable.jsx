// src/components/category/CategoryDataTable.jsx
import React, { useMemo, useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const badge = (state) => (
    <span className={`badge ${state ? 'bg-success' : 'bg-danger'}`}>
        {state ? 'Activo' : 'Inactivo'}
    </span>
);

const CategoryDataTable = ({
    rows,
    loading,
    error,
    // server-side
    currentPage,
    pageSize,
    totalElements,
    sortField,
    sortDirection,
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    // actions
    onEdit,
    onToggle,
    onDelete,
}) => {
    /* === Responsive XS detector (≤576px) === */
    const [isXs, setIsXs] = useState(typeof window !== 'undefined' ? window.innerWidth < 576 : false);
    useEffect(() => {
        const onResize = () => setIsXs(window.innerWidth < 576);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    /* === Columnas completas (desktop) === */
    const allColumns = useMemo(() => [
        { name: 'ID', selector: r => r.id, sortable: true, sortField: 'id', width: '90px' },
        { name: 'Nombre', selector: r => r.name, sortable: true, sortField: 'name', grow: 2, wrap: true },
        { name: 'Estado', selector: r => r.state, sortable: true, sortField: 'state', cell: r => badge(r.state), width: '140px' },
        { name: 'Fecha Creación', selector: r => r.dateCreated, sortable: true, sortField: 'dateCreated', width: '170px', wrap: true },
        { name: 'Última Modificación', selector: r => r.dateModified, sortable: true, sortField: 'dateModified', width: '190px', wrap: true },
        {
            name: 'Acciones',
            button: true,
            width: '170px',
            cell: r => (
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-info text-white" title="Editar" onClick={() => onEdit(r)}><FaEdit /></button>
                    <button className={`btn btn-sm ${r.state ? 'btn-warning' : 'btn-success'}`} title={r.state ? 'Desactivar' : 'Activar'} onClick={() => onToggle(r)}>
                        {r.state ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => onDelete(r)}><FaTrash /></button>
                </div>
            ),
        },
    ], [onEdit, onToggle, onDelete]);

    /* === En XS solo mostramos columnas clave; el resto va en expandible === */
    const columns = useMemo(() => {
        if (!isXs) return allColumns;
        return allColumns.filter(c => ['ID', 'Nombre', 'Estado'].includes(c.name));
    }, [isXs, allColumns]);

    /* === Fila expandible (móvil) con detalles + acciones === */
    const Expand = ({ data }) => (
        <div className="p-2">
            <div className="row g-2 small">
                <div className="col-6">
                    <div className="text-muted">Creación</div>
                    <div>{data.dateCreated || '—'}</div>
                </div>
                <div className="col-6">
                    <div className="text-muted">Modificación</div>
                    <div>{data.dateModified || '—'}</div>
                </div>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-2">
                <button className="btn btn-sm btn-info text-white" onClick={() => onEdit(data)}>
                    <FaEdit className="me-1" /> Editar
                </button>
                <button className={`btn btn-sm ${data.state ? 'btn-warning' : 'btn-success'}`} onClick={() => onToggle(data)}>
                    {data.state ? <FaToggleOn className="me-1" /> : <FaToggleOff className="me-1" />} {data.state ? 'Desactivar' : 'Activar'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(data)}>
                    <FaTrash className="me-1" /> Eliminar
                </button>
            </div>
        </div>
    );

    const customStyles = {
        headCells: { style: { fontWeight: 700, backgroundColor: '#212529', color: '#fff' } },
        rows: { style: { minHeight: isXs ? '40px' : '46px' }, highlightOnHoverStyle: { backgroundColor: 'rgba(13,110,253,.06)' } },
        pagination: { style: { borderTop: '1px solid #e9ecef' } },
    };

    const handleSort = (column, direction) => {
        if (column.sortField) {
            setSortField(column.sortField);
            setSortDirection(direction.toUpperCase());
            setCurrentPage(0);
        }
    };

    const handleChangePage = (page) => setCurrentPage(page - 1);       // DataTable 1-based
    const handleChangeRows = (n) => { setPageSize(n); setCurrentPage(0); };

    /* ---------- EXPORTS ---------- */
    const csv = () => {
        const header = ['ID', 'Nombre', 'Estado', 'Fecha Creación', 'Última Modificación'];
        const body = rows.map(r => [
            r.id,
            `"${(r.name || '').replace(/"/g, '""')}"`,
            r.state ? 'Activo' : 'Inactivo',
            r.dateCreated || '',
            r.dateModified || ''
        ].join(','));
        const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'categorias.csv');
    };

    const excel = () => {
        const data = rows.map(r => ({
            ID: r.id,
            Nombre: r.name,
            Estado: r.state ? 'Activo' : 'Inactivo',
            'Fecha Creación': r.dateCreated || '',
            'Última Modificación': r.dateModified || ''
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Categorías');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'categorias.xlsx');
    };

    const pdf = () => {
        const doc = new jsPDF('l', 'pt', 'a4'); // landscape
        doc.setFontSize(14);
        doc.text('Listado de Categorías', 40, 40);
        const head = [['ID', 'Nombre', 'Estado', 'Fecha Creación', 'Última Modificación']];
        const body = rows.map(r => [r.id, r.name, r.state ? 'Activo' : 'Inactivo', r.dateCreated || '', r.dateModified || '']);
        autoTable(doc, {
            head, body, startY: 60,
            headStyles: { fillColor: [33, 37, 41] }, styles: { fontSize: 9 }
        });
        doc.save('categorias.pdf');
    };

    return (
        <div className="card shadow-sm border-primary">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Listado de Categorías</h5>

                {/* Botón Exportar con opciones */}
                <div className="btn-group">
                    <button className="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Exportar
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item" onClick={csv}>CSV</button></li>
                        <li><button className="dropdown-item" onClick={excel}>Excel (.xlsx)</button></li>
                        <li><button className="dropdown-item" onClick={pdf}>PDF</button></li>
                    </ul>
                </div>
            </div>

            <div className="card-body p-2">
                {error ? (
                    <div className="alert alert-danger text-center m-0" style={{ contain: 'layout size' }}>{error}</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={rows}
                        progressPending={loading}
                        dense
                        highlightOnHover
                        striped
                        customStyles={customStyles}
                        responsive
                        wrap
                        fixedHeader={!isXs}
                        fixedHeaderScrollHeight={isXs ? '60vh' : undefined}
                        /* Expandible solo en XS */
                        expandableRows={isXs}
                        expandableRowsComponent={Expand}
                        pagination
                        paginationServer
                        paginationPerPage={pageSize}
                        paginationTotalRows={totalElements}
                        paginationDefaultPage={currentPage + 1}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRows}
                        sortServer
                        onSort={handleSort}
                        defaultSortFieldId={columns.findIndex(c => c.sortField === sortField) + 1}
                        defaultSortAsc={sortDirection !== 'DESC'}
                        noDataComponent={<div className="text-muted py-4">No hay categorías registradas.</div>}
                    />
                )}
            </div>
        </div>
    );
};

export default CategoryDataTable;
