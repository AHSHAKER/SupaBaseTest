// import React from "react";
// import usePlans from "../hooks/usePlans";

// const Plans: React.FC = () => {
//   const { plans, loading, error, refresh } = usePlans();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 flex flex-col items-center p-8">
//       <h1 className="text-4xl font-bold text-white mb-8">Available Plans</h1>
//       {loading && <div className="text-white/90">Loading plans...</div>}
//       {error && (
//         <div className="text-red-200 mb-4">
//           Error loading plans: {error}
//           <button
//             className="ml-4 px-3 py-1 bg-white text-yellow-700 rounded"
//             onClick={refresh}
//           >
//             Retry
//           </button>
//         </div>
//       )}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
//         {plans.map((plan) => (
//           <div
//             key={plan.plan_id}
//             className="bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-start"
//           >
//             <h2 className="text-2xl font-semibold text-yellow-700 mb-2">
//               {plan.name}
//             </h2>
//             <p className="text-sm text-yellow-900 mb-2">{plan.code}</p>
//             <div className="mb-2">
//               <span className="font-bold">Price:</span>{" "}
//               {plan.price_amount} {plan.price_currency}
//             </div>
//             <div className="mb-2">
//               <span className="font-bold">Billing Period:</span>{" "}
//               {plan.billing_period}
//             </div>
//             <div className="mb-2">
//               <span className="font-bold">Download:</span>{" "}
//               {plan.download_mbps} Mbps
//             </div>
//             <div className="mb-2">
//               <span className="font-bold">Upload:</span>{" "}
//               {plan.upload_mbps} Mbps
//             </div>
//             <div className="mb-2">
//               <span className="font-bold">Data Cap:</span>{" "}
//               {plan.data_cap_gb ? `${plan.data_cap_gb} GB` : "Unlimited"}
//             </div>
//             <div className="mb-2">
//               <span className="font-bold">Active:</span>{" "}
//               {plan.is_active ? "Yes" : "No"}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Plans;