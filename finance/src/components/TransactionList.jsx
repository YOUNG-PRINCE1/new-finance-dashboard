// src/components/TransactionList.jsx
import React from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const groupByMonth = (transactions) => {
  return transactions.reduce((groups, txn) => {
    const date = new Date(txn.date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groups[month]) groups[month] = [];
    groups[month].push(txn);
    return groups;
  }, {});
};

const TransactionList = ({ transactions = [], onUpdate }) => {
  const handleDelete = async (id) => {
    try {
      await api.delete(`transactions/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Transaction deleted ✅');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Delete failed ❌');
    }
  };

  const grouped = groupByMonth(transactions);
  const months = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="mt-4">
      {months.length === 0 ? (
        <p className="text-center">No transactions yet.</p>
      ) : (
        months.map((month) => (
          <div key={month} className="card mb-3 shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">{month}</div>
            <ul className="list-group list-group-flush">
              {grouped[month].map((txn) => (
                <li
                  key={txn.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{txn.title || txn.description}</strong>
                    <div className="small text-muted">
                      {txn.category} • {new Date(txn.date).toLocaleDateString()}
                    </div>
                    {txn.is_recurring && (
                      <span className="badge bg-warning text-dark mt-1">Recurring</span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className={`fw-bold ${
                        txn.type === 'income' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {txn.type === 'income' ? '+' : '-'}₦{Number(txn.amount).toLocaleString()}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(txn.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;
