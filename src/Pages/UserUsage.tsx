import { useEffect, useState } from "react";
import { fetchUsage } from "../hooks/DataUsage";
import type { UsageSummary } from "../hooks/DataUsage";
import LoadingSpinner from "../Components/Randoms/LoadingSpinner";

const UserUsage = () => {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsage = async () => {
      try {
        const data = await fetchUsage();
        setUsage(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch usage");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadUsage();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="flex items-center justify-center bg-slate-50">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );

  // case: no active subscription / free user
  const isFreeAccount = !usage?.planName;

  return (
    <div className="min-h-100 flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Current Plan</h2>

        <div className="mb-4 text-blue-700 font-semibold">
          {isFreeAccount ? "Free Account" : usage?.planName}
        </div>

        {isFreeAccount ? (
          <div className="text-slate-600 mb-4">
            You are currently on a{" "}
            <span className="font-bold text-slate-800">free plan</span>.  
            Upgrade to unlock more features 🚀
          </div>
        ) : (
          <>
            <div className="mb-6 text-slate-600">
              Used:{" "}
              <span className="font-bold text-slate-800">
                {usage?.gbUsed?.toFixed(2) ?? 0} GB
              </span>{" "}
              /{" "}
              <span className="font-bold text-slate-800">
                {usage?.gbTotal ?? "Unlimited"} GB
              </span>
            </div>

            {usage?.gbTotal ? (
              <>
                <div className="w-full bg-slate-100 rounded-full h-5 mb-2 overflow-hidden">
                  <div
                    className="h-5 bg-blue-600 transition-all"
                    style={{
                      width: `${Math.min(
                        (usage.gbUsed / usage.gbTotal) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 GB</span>
                  <span>{usage.gbTotal} GB</span>
                </div>
              </>
            ) : (
              <div className="text-blue-500 text-center py-2 font-medium">
                Unlimited plan 🚀
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserUsage;
