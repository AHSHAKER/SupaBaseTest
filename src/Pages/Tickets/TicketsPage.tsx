import { useEffect, useState } from "react";
import { getTickets } from "../../hooks/useTickets";
import type { Ticket } from "../../hooks/useTickets";
import TicketDetail from "./TicketDetail";
import CreateTicketForm from "./CreateTicketForm";
import LoadingSpinner from "../../Components/Randoms/LoadingSpinner";
import supabase from "../../SupabaseUsers";

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await getTickets();
      setTickets(ticketsData);
    } catch (err: any) {
      console.error("Failed to fetch tickets:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("tickets-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tickets" },
        (payload) => {
          const updatedTicket: Ticket = payload.new as Ticket;

          setTickets((prev) =>
            prev.map((t) =>
              t.ticket_id === updatedTicket.ticket_id ? updatedTicket : t
            )
          );

          if (
            selectedTicket &&
            selectedTicket.ticket_id === updatedTicket.ticket_id
          ) {
            setSelectedTicket(updatedTicket);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTicket]);

  return (
    <div className="bg-slate-50 flex flex-col items-center p-6">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">🎫 My Tickets</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          >
            + New Ticket
          </button>
        </div>

        {loading && <LoadingSpinner />}
        {!loading && tickets.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-lg">
            You have no tickets yet. Click <span className="font-semibold text-blue-600">New Ticket</span> to create one. 🚀
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t.ticket_id}
                onClick={() => setSelectedTicket(t)}
                className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-slate-800">{t.subject}</h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ring-1 ${
                      t.status === "open"
                        ? "bg-green-100 text-green-700 ring-green-300"
                        : "bg-slate-100 text-slate-700 ring-slate-300"
                    }`}
                  >
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Priority: {t.priority} • Last updated {new Date(t.updated_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedTicket && (
          <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
        )}

        {showCreate && <CreateTicketForm onClose={() => {setShowCreate(false); fetchTickets();}} />}
      </div>
    </div>
  );
};

export default TicketsPage;