import React, { useEffect, useState, useRef } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getAuth } from "firebase/auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Report = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const chartRef = useRef();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User not authenticated");
        }

        const token = await user.getIdToken();

        const [monthlyRes, categoryRes] = await Promise.all([
          fetch("https://finance-backend-2jsm.onrender.com/api/reports/monthly/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://finance-backend-2jsm.onrender.com/api/reports/category/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monthlyRes.ok || !categoryRes.ok) {
          throw new Error("Failed to load reports");
        }

        const monthlyJson = await monthlyRes.json();
        const categoryJson = await categoryRes.json();

        setMonthlyData(monthlyJson);
        setCategoryData(categoryJson);
      } catch (err) {
        console.error("Report error:", err);
        setError("Unable to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const barData = {
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        label: "Expenses",
        data: monthlyData.map((m) => m.expense),
        backgroundColor: "#dc3545",
      },
      {
        label: "Income",
        data: monthlyData.map((m) => m.income),
        backgroundColor: "#198754",
      },
    ],
  };

  const doughnutData = {
    labels: categoryData.map((c) => c.category),
    datasets: [
      {
        label: "Spending Breakdown",
        data: categoryData.map((c) => c.total),
        backgroundColor: [
          "#0d6efd", "#6f42c1", "#20c997",
          "#ffc107", "#fd7e14", "#6610f2",
          "#198754", "#dc3545", "#0dcaf0"
        ],
      },
    ],
  };

  const downloadCSV = () => {
    const headers = ["Month,Income,Expense"];
    const rows = monthlyData.map(m =>
      `${m.month},${m.income},${m.expense}`
    );
    const csv = [...headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monthly_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const input = chartRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("finance_report.pdf");
    });
  };

  if (loading) return <div className="text-center py-5">Loading reports...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Monthly Report</h2>

      <div className="d-flex justify-content-end gap-2 mb-3">
        <button className="btn btn-outline-primary" onClick={downloadCSV}>
          Download CSV
        </button>
        <button className="btn btn-outline-danger" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <div ref={chartRef}>
        <div className="row g-4">
          {/* Bar Chart */}
          <div className="col-md-8">
            <div className="card shadow-sm p-3">
              <h5>Income vs Expenses</h5>
              <Bar data={barData} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>Spending by Category</h5>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
