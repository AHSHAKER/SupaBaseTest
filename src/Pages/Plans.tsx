import { useState, useEffect } from "react";
import { usePlans, createSubscription, cancelSubscription } from "../hooks/usePlans";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";
import { getPendingSubscriptions, setProfile } from "../hooks/useProfile";
import { toast } from "react-toastify";
import LoadingSpinner from "../Components/Randoms/LoadingSpinner";

const Plans = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const profile = useAuthStore((state) => state);
  const activePlanId = profile?.plan?.id;
  const notify = (message: string) => toast(message);
  const [autoRenew, setAutoRenew] = useState(false);
  const navigate = useNavigate();
  const [hasPending, setHasPending] = useState(false);

  const { plans,  error, refresh } = usePlans();
  useEffect(() => {
    setLoading(true);
    getPendingSubscriptions().then((res) => {
      setHasPending(!!res.data);
    }).finally(() => {
      setLoading(false);
  });
}, []);
  

const ConfirmToast = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <div>
    <p>Are you sure you want to cancel your subscription?</p>
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => {
          onConfirm();
          toast.dismiss();
        }}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Yes, Cancel
      </button>
      <button
        onClick={() => {
          onCancel();
          toast.dismiss();
        }}
        className="px-3 py-1 bg-gray-300 text-black rounded"
      >
        No
      </button>
    </div>
  </div>
);


  /** Subscribe to plan */
  const handleSubscribe = async (planID: string) => {
    const { errorS } = await createSubscription(planID, autoRenew);
    if (errorS) {
      notify("Error subscribing to plan: " + errorS);
      return;
    }
    notify("Subscribed successfully!");
    setProfile();
    navigate("/");
  };

  /** Cancel subscription */
  const handleCancel = (planName: string) => {
  toast(
    <ConfirmToast
      onConfirm={async () => {
        const { errorC } = await cancelSubscription(planName);
        if (errorC) {
          notify("Error canceling subscription: " + errorC);
          return;
        }
        setProfile();
        navigate("/");
      }}
      onCancel={() => {}}
    />,
    { autoClose: false }
  );
};
if (loading) {return (<LoadingSpinner />);}
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Available Plans</h1>
      {hasPending && (
        <div className="mb-6 text-orange-600 text-lg font-semibold text-center">
          You have a pending subscription. Please activate or cancel it before subscribing to a new plan.
        </div>
      )}
      {error && (
        <div className="text-red-600 mb-4">
          Error loading plans: {error}
          <button
            className="ml-4 px-3 py-1 bg-white text-blue-700 rounded-md border border-slate-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onClick={refresh}
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {plans.map((plan) => {
          const isCurrent = plan.plan_id === activePlanId;

          return (
            <div
              key={plan.plan_id}
              className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border border-slate-200 ${
                isCurrent ? "ring-2 ring-blue-300 border-blue-600" : ""
              }`}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {plan.name}
              </h2>
              <p className="text-sm text-slate-500 mb-2">{plan.code}</p>

              <PlanDetail label="Price" value={`${plan.price_amount} ${plan.price_currency}`} />
              <PlanDetail label="Billing Period" value={plan.billing_period} />
              <PlanDetail label="Download" value={`${plan.download_mbps} Mbps`} />
              <PlanDetail label="Upload" value={`${plan.upload_mbps} Mbps`} />
              <PlanDetail
                label="Data Cap"
                value={plan.data_cap_gb ? `${plan.data_cap_gb} GB` : "Unlimited"}
              />
              <PlanDetail label="Active" value={plan.is_active ? "Yes" : "No"} />

              {isCurrent ? (
                <>
                  <div className="mt-4 py-2 text-blue-700 rounded font-semibold">
                    Currently Subscribed
                  </div>
                  <button
                    onClick={() => handleCancel(plan.name)}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                  >
                    Cancel Subscription
                  </button>
                </>
              ) : (
                !activePlanId && !hasPending && (
                  <button
                    onClick={() =>handleSubscribe(plan.plan_id)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  >
                    Subscribe
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Only show auto-renew toggle when subscribing (not while already subscribed or pending) */}
      {!activePlanId && !hasPending && (
        <button
          className="mt-8 px-4 py-2 mx-auto bg-slate-100 text-slate-700 rounded-md border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition"
          onClick={() => setAutoRenew((prev) => !prev)}
        >
          Auto renew is <span className="font-semibold">{autoRenew ? "on" : "off"}</span>
        </button>
      )}
    </div>
  );
};

/** Small helper for plan info rows */
const PlanDetail = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2 text-slate-600">
    <span className="font-bold text-slate-800">{label}:</span> {value}
  </div>
);

export default Plans;