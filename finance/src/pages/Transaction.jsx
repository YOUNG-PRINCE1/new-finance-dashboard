import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import TransactionList from "../components/TransactionList";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();

        const res = await fetch("https://finance-backend-2jsm.onrender.com/api/transactions/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        } else {
          console.error("Failed to fetch transactions");
        }
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-white mb-3">Your Transactions</h2>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default Transactions;
