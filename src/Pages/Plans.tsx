import { useState } from "react";
import { usePlans, subscribeToPlan, cancelSubscription } from "../hooks/usePlans";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";
import { setProfile } from "../hooks/useProfile";

interface PlanDetail {
  planId: string;
  plan_duration: string;
  plan_price: number;
  plan_name: string;
  plan_code: string;
}

const Plans = () => {
  const { plans, loading, error, refresh } = usePlans();
  const profile = useAuthStore((state) => state);
  const activePlanId = profile?.plan?.id;

  const [autoRenew, setAutoRenew] = useState(false);
  const navigate = useNavigate();

  /** Subscribe to plan */
  const handleSubscribe = async (planDetail: PlanDetail) => {
    const { errorS } = await subscribeToPlan(planDetail, autoRenew);
    if (errorS) {
      alert("Error subscribing: " + errorS);
      return;
    }
    alert("Subscribed successfully!");
    setProfile();
    navigate("/");
  };

  /** Cancel subscription */
  const handleCancel = async (planName: string) => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;

    const { errorC } = await cancelSubscription(planName);
    if (errorC) {
      alert("Error canceling subscription: " + errorC);
      return;
    }
    setProfile();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Available Plans</h1>

      {loading && <p className="text-slate-500">Loading plans...</p>}
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
                !activePlanId && (
                  <button
                    onClick={() =>
                      handleSubscribe({
                        planId: plan.plan_id,
                        plan_duration: plan.billing_period,
                        plan_price: plan.price_amount,
                        plan_name: plan.name,
                        plan_code: plan.code,
                      })
                    }
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

      {/* Only show auto-renew toggle when subscribing (not while already subscribed) */}
      {!activePlanId && (
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