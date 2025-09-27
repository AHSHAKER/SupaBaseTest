import { useEffect, useState } from "react";
import { getTransactions } from "../hooks/useTransactions";
import type { transaction } from "../hooks/useTransactions";
import LoadingSpinner from "../Components/Randoms/LoadingSpinner";

const Transactions = () => {
    const [transactions, setTransactions] = useState<transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

useEffect(() => {
    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await getTransactions();
        if (error) { setError(error.message); }
        else { setTransactions(data ?? []);}
        setLoading(false);
    };
    fetchTransactions();

  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{
      maxWidth: 1000,
      margin: "32px auto",
      padding: 20,
      fontFamily: "Inter, Roboto, system-ui, -apple-system, 'Segoe UI', Arial",
      color: "#0f172a"
    }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Transactions</h1>
          <div style={{ marginTop: 6, color: "#64748b", fontSize: 13 }}>
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} • Total:{" "}
            {transactions
              .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
              .toLocaleString(undefined, { style: "currency", currency: "USD" })}
          </div>
        </div>
      </header>

      <div style={{
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f8fafc" }}>
              <th style={{ padding: "14px 18px", fontSize: 12, color: "#475569" }}>Description</th>
              <th style={{ padding: "14px 18px", fontSize: 12, color: "#475569", width: 200 }}>Date</th>
              <th style={{ padding: "14px 18px", fontSize: 12, color: "#475569", textAlign: "right", width: 140 }}>Amount</th>
              <th style={{ padding: "14px 18px", fontSize: 12, color: "#475569", width: 120 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => {
              const key = tx.transaction_id ?? i;
              const rawDate = tx.created_at;
              const date = rawDate ? new Date(rawDate) : null;
              const amount = Number(tx.amount) || 0;
              const positive = amount >= 0;
              const status = (tx.status ?? (positive ? "credit" : "debit")).toString().toLowerCase();
              const badgeBg = status === "pending" ? "#fff7ed" : status === "failed" ? "#fff1f2" : "#ecfdf5";
              const badgeColor = status === "pending" ? "#92400e" : status === "failed" ? "#9f1239" : "#065f46";

              return (
                <tr key={key} style={{ borderTop: "1px solid #eef2f7" }}>
                  <td style={{ padding: "14px 18px", verticalAlign: "middle" }}>
                    <div style={{ fontWeight: 600 }}>{tx.description ?? "—"}</div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
                      {tx.event_type ?? "Unknown"}
                    </div>
                  </td>

                  <td style={{ padding: "14px 18px", verticalAlign: "middle", fontSize: 13, color: "#475569" }}>
                    {date ? date.toLocaleString() : "—"}
                  </td>

                  <td style={{ padding: "14px 18px", verticalAlign: "middle", textAlign: "right" }}>
                    <div style={{ color: positive ? "#065f46" : "#991b1b", fontWeight: 700 }}>
                      {(amount).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>
                      {tx.payment_type_id ? `Payment Type: ${tx.payment_type_id}` : tx.external_reference ?? "—"}
                    </div>
                  </td>

                  <td style={{ padding: "14px 18px", verticalAlign: "middle", textAlign: "center" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: badgeBg,
                      color: badgeColor,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "capitalize"
                    }}>{status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#94a3b8" }}>
            No transactions yet. Connect an account or create a transaction to get started.
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions;