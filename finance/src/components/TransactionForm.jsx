import React, { useState } from 'react';
import { createTransaction } from '../services/transactionService'; // Use helper

const TransactionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    is_recurring: false,
    frequency: 'monthly',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, category } = formData;
    if (!title || !amount || !category) return;

    try {
      const created = await createTransaction(formData);
      if (onAdd) onAdd(created);

      // Reset form
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        is_recurring: false,
        frequency: 'monthly',
      });
    } catch (error) {
      console.error('Failed to submit transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
      <h5 className="mb-3">Add Transaction</h5>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        className="form-control mb-2"
        placeholder="Amount"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <select
        className="form-select mb-2"
        name="type"
        value={formData.type}
        onChange={handleChange}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="is_recurring"
          name="is_recurring"
          checked={formData.is_recurring}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="is_recurring">
          Recurring Transaction
        </label>
      </div>

      {formData.is_recurring && (
        <select
          className="form-select mb-2"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      )}

      <button type="submit" className="btn btn-primary w-100">
        Add
      </button>
    </form>
  );
};

export default TransactionForm;
