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
  const handleCancel = async (subscriptionId: string) => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;

    const { errorC } = await cancelSubscription(subscriptionId);
    if (errorC) {
      alert("Error canceling subscription: " + errorC);
      return;
    }
    alert("Subscription canceled!");
    setProfile();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Available Plans</h1>

      {loading && <p className="text-white/90">Loading plans...</p>}
      {error && (
        <div className="text-red-200 mb-4">
          Error loading plans: {error}
          <button
            className="ml-4 px-3 py-1 bg-white text-yellow-700 rounded"
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
              className={`bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-start ${
                isCurrent ? "border-2 border-yellow-500" : ""
              }`}
            >
              <h2 className="text-2xl font-semibold text-yellow-700 mb-2">
                {plan.name}
              </h2>
              <p className="text-sm text-yellow-900 mb-2">{plan.code}</p>

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
                  <div className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded font-semibold">
                    Currently Subscribed
                  </div>
                  <button
                    onClick={() => handleCancel(plan.plan_id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
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
          className="mt-8 px-4 py-2 mx-auto bg-white text-yellow-700 rounded hover:bg-yellow-100"
          onClick={() => setAutoRenew((prev) => !prev)}
        >
          Auto renew is {autoRenew ? "on" : "off"}
        </button>
      )}
    </div>
  );
};

/** Small helper for plan info rows */
const PlanDetail = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2">
    <span className="font-bold">{label}:</span> {value}
  </div>
);

export default Plans;