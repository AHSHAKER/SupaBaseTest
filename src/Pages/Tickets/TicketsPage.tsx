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

  // inside TicketsPage
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎫 My Tickets</h1>
        <button
          onClick={() => setShowCreate(true)}
          
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + New Ticket
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {!loading && tickets.length === 0 && (
        <p className="text-gray-500">You have no tickets. Click "New Ticket" to create one.</p>
      )}

      {!loading && tickets.length > 0 && (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.ticket_id}
              onClick={() => setSelectedTicket(t)}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold">{t.subject}</h2>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    t.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
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
  );
};

export default TicketsPage;
