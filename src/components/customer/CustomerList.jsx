// src/components/customer/CustomerList.jsx
import React from 'react';
import DataTable from 'react-data-table-component';
import dayjs from 'dayjs';
import { useCustomerContext } from '../../contexts/CustomerContext';

const fmtDate = (d) => (d ? dayjs(d).format('YYYY-MM-DD') : '—');

export default function CustomerList() {
  const { items, loading } = useCustomerContext();

  const columns = [
    { name: 'Tipo', selector: r => r.type_person, sortable: true, width: '130px' },
    { name: 'Doc.', selector: r => `${r.document_type}-${r.document_number}`, sortable: true, grow: 1 },
    { name: 'Nombre / Razón social', selector: r => r.name, sortable: true, grow: 2, wrap: true },
    { name: 'Celular', selector: r => r.cellphone || '—', sortable: false, width: '140px' },
    { name: 'Email', selector: r => r.email || '—', sortable: false, grow: 1, wrap: true },
    { name: 'Dirección', selector: r => r.address || '—', sortable: false, grow: 2, wrap: true },
    {
      name: 'Estado',
      selector: r => r.state,
      width: '110px',
      cell: r => <span className={`badge ${r.state ? 'bg-success' : 'bg-danger'}`}>{r.state ? 'Activo' : 'Inactivo'}</span>
    },
    { name: 'Creado', selector: r => fmtDate(r.date_created || r.dateCreated), width: '120px' },
  ];

  return (
    <div className="card shadow-sm border-success">
      <div className="card-header bg-success text-white">
        <h5 className="card-title mb-0">Clientes</h5>
      </div>
      <div className="card-body p-2">
        <DataTable
          columns={columns}
          data={items}
          progressPending={loading}
          highlightOnHover
          dense
          striped
          pagination
          noDataComponent={<div className="text-muted py-4">No hay clientes.</div>}
        />
      </div>
    </div>
  );
}
