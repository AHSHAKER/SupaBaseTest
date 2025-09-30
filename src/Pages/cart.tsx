import React, { useEffect, useState } from "react";
import { getPendingSubscriptions } from "../hooks/useProfile";
import { activateSubscription, deleteSubscription, type Plan } from "../hooks/usePlans";
import { toast } from "react-toastify";
import LoadingSpinner from "../Components/Randoms/LoadingSpinner";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
  pending: { bg: "bg-orange-100", text: "text-orange-700", label: "Pending" },
  error: { bg: "bg-red-100", text: "text-red-700", label: "Error" },
  info: { bg: "bg-blue-100", text: "text-blue-700", label: "Info" },
};

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [cartItem, setCartItem] = useState<any>(null);
  const [planData, setPlanData] = useState<Plan | null>(null); // <-- use null, not undefined
  const [error, setError] = useState<string | null>(null);
  const notify = (message: string) => toast(message);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setCartItem(null);
    setPlanData(null);

    getPendingSubscriptions()
      .then((res) => {
        if (res.errorS) {
          setError(res.errorS);
        } else {
          setCartItem(res.data);
          setPlanData(res.planData ?? null); // <-- ensure null if missing
        }
      })
      .catch((err) => setError(err.message || "Failed to fetch cart"))
      .finally(() => setLoading(false));
  }, [open]);

  const handleDelete = async () => {
    if (!cartItem) return;
    const { errorC } = await deleteSubscription(cartItem.subscription_id);
    if (errorC) {
      notify("Error deleting subscription: " + errorC);
    } else {
      notify("Subscription deleted.");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl border border-slate-200 flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="font-bold text-blue-700 text-lg tracking-tight">Your Cart</div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-full p-2 transition"
            aria-label="Close"
          >
            ✖
          </button>
        </div>
        <div className="p-6 overflow-y-auto min-h-[180px]">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-500">{error}</div>
          ) : !cartItem ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-slate-400 text-lg font-medium">
                Your cart is empty. Add some subscriptions!
              </span>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm font-medium">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Upload Speed</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-4 py-4 font-semibold text-slate-700">
                    {planData?.name || "Unknown Plan"}
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {planData ? `${planData.upload_mbps} Mbps` : "No description"}
                  </td>
                  <td className="px-4 py-4 text-slate-800">
                    {planData ? `$${planData.price_amount}` : "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[cartItem.status]?.bg || "bg-slate-100"} ${statusStyles[cartItem.status]?.text || "text-slate-700"}`}
                    >
                      {statusStyles[cartItem.status]?.label || cartItem.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                      disabled={!cartItem}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button
            onClick={() => {
              if (!cartItem || !planData) {
                notify("Missing subscription or plan data.");
                return;
              }
              activateSubscription(cartItem.subscription_id, planData).then(({ errorS }) => {
                if (errorS) {
                  notify("Error activating subscription: " + errorS);
                } else {
                  notify("Subscription activated successfully!");
                  onClose();
                }
              });
            }}
            className="rounded-md px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition"
            disabled={!cartItem || !planData}
          >
            Checkout
          </button>
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 bg-slate-100 text-slate-700 font-medium border border-slate-200 hover:bg-slate-200 focus:ring-2 focus:ring-blue-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;