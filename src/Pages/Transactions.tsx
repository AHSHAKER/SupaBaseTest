import { useEffect, useState } from "react";
import { getTransactions } from "../hooks/useTransactions";
import type { transaction } from "../hooks/useTransactions";
import LoadingSpinner from "../Components/Randoms/LoadingSpinner";

const statusColors: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-700",
  succeeded: "bg-green-100 text-green-700",
  refunded: "bg-blue-100 text-blue-700",
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await getTransactions();
      if (error) { setError(error.message); }
      else { setTransactions(data ?? []); }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center mt-10">Error: {error}</div>;

  return (
    <div className="flex flex-col min-h-[80vh] bg-slate-50">
      <main className="flex-1 flex flex-col items-center justify-start pt-8 pb-12">
        <div className="w-full max-w-4xl px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transactions</h1>
            <div className="mt-2 text-slate-500 text-sm font-medium">
              {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} • Total:{" "}
              {transactions
                .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
                .toLocaleString(undefined, { style: "currency", currency: "USD" })}
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {transactions.map((tx, i) => {
                  const key = tx.transaction_id ?? i;
                  const rawDate = tx.created_at;
                  const date = rawDate ? new Date(rawDate) : null;
                  const amount = Number(tx.amount) || 0;
                  const positive = amount >= 0;
                  const status = (tx.status ?? (positive ? "credit" : "debit")).toString().toLowerCase();
                  const badgeClass = statusColors[status] || "bg-slate-100 text-slate-700";

                  return (
                    <tr key={key}>
                      <td className="px-6 py-4 align-middle">
                        <div className="font-medium text-slate-800">{tx.description ?? "—"}</div>
                        <div className="mt-1 text-xs text-slate-400">{tx.event_type ?? "Unknown"}</div>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-slate-600">
                        {date ? date.toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <div className={`font-bold ${positive ? "text-blue-700" : "text-red-700"}`}>
                          {(amount).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {tx.payment_type_id ? `Payment Type: ${tx.payment_type_id}` : tx.external_reference ?? "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-blue-300 ${badgeClass}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-lg">
                No transactions yet. create a transaction to get started. 🚀
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;