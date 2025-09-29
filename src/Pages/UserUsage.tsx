import { useEffect, useState } from "react";
import { fetchUsage } from "../hooks/DataUsage";
import type { UsageSummary } from "../hooks/DataUsage"; // make sure to export the type

const UserUsage = () => {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const data = await fetchUsage(); // pass userId if required
        setUsage(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch usage");
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, []);

  if (loading) return <p>Loading usage...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Current Plan: {usage?.planName || "No active plan"}</h2>
      <p>
        Used: {usage?.gbUsed.toFixed(2) ?? 0} GB / {usage?.gbTotal ?? "Unlimited"} GB
      </p>
      {usage?.gbTotal ? (
        <div className="progress-bar" style={{ width: "100%", background: "#eee", borderRadius: 8 }}>
          <div
            className="progress"
            style={{
              width: `${(usage.gbUsed / usage.gbTotal) * 100}%`,
              height: 16,
              background: "#4caf50",
              borderRadius: 8,
            }}
          />
        </div>
      ) : (
        <p>Unlimited plan</p>
      )}
    </div>
  );
};

export default UserUsage;
