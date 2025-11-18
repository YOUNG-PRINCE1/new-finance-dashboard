import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ChartPanel from '../components/ChartPanel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/axios';

const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showAll, setShowAll] = useState(false);
  const TRANSACTION_LIMIT = 5;

  const fetchTransactions = async () => {
    try {
      const res = await api.get('transactions/');
      console.log("Fetched data:", res.data);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = () => {
    fetchTransactions(); // Refresh from DB
    toast.success("Transaction added ✅");
  };

  const downloadCSV = (data) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data
      .map((txn) =>
        Object.values(txn)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.info("CSV downloaded");
  };

  const filteredTransactions = transactions.filter((t) => {
    const txnMonth = new Date(t.date).toISOString().slice(0, 7);
    return txnMonth === selectedMonth;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const balance = totalIncome - totalExpenses;

  const categoryData = {};
  filteredTransactions.forEach(t => {
    if (t.type === 'expense') {
      categoryData[t.category] = (categoryData[t.category] || 0) + parseFloat(t.amount || 0);
    }
  });

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Dashboard</h4>
          <input
            type="month"
            className="form-control w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Summary Cards */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 bg-success text-white">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 text-uppercase">Income</h6>
                <h3>₦{totalIncome.toLocaleString()}</h3>
              </div>
              <i className="bi bi-cash-coin fs-1"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 bg-danger text-white">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 text-uppercase">Expenses</h6>
                <h3>₦{totalExpenses.toLocaleString()}</h3>
              </div>
              <i className="bi bi-cart-dash fs-1"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 bg-dark text-white">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 text-uppercase">Balance</h6>
                <h3>₦{balance.toLocaleString()}</h3>
              </div>
              <i className="bi bi-wallet2 fs-1"></i>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="col-md-4">
          <TransactionForm onAdd={handleAddTransaction} />
        </div>

        {/* Transaction List */}
        <div className="col-md-4">
          <div className="card shadow-sm" style={{ maxHeight: '500px' }}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Recent Transactions</h5>

              <div className="mb-3">
                <button
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  onClick={() => downloadCSV(filteredTransactions)}
                >
                  <i className="bi bi-download me-2"></i>Download CSV
                </button>
              </div>

              <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '350px' }}>
                <TransactionList
                  transactions={
                    showAll
                      ? filteredTransactions
                      : filteredTransactions.slice(0, TRANSACTION_LIMIT)
                  }
                  onUpdate={fetchTransactions}
                  key={transactions.length}
                />
              </div>

              {filteredTransactions.length > TRANSACTION_LIMIT && (
                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? 'View Less' : 'View More'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="col-md-4">
          <ChartPanel categoryData={categoryData} />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
