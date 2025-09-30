import { useEffect, useState } from "react";
import { addTicketMessage, getTicketMessages } from "../../hooks/useTickets";
import type { Ticket } from "../../hooks/useTickets";
import supabase from "../../SupabaseUsers";

interface Props {
  ticket: Ticket;
  onClose: () => void;
}

const TicketDetail = ({ ticket, onClose }: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const msgs = await getTicketMessages(ticket.ticket_id);
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [ticket.ticket_id]);

  useEffect(() => {
    const channel = supabase
      .channel("ticket-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_messages", filter: `ticket_id=eq.${ticket.ticket_id}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticket.ticket_id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const msg = await addTicketMessage({
      p_message_text: newMessage,
      p_sender_id: ticket.user_id,
      p_sender_role: "customer",
      p_ticket_id: ticket.ticket_id,
    });
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl h-[500px] flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{ticket.subject}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-full p-2 transition"
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  m.sender_role === "customer"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-50 text-slate-500"
                }`}>
                  {m.sender_role === "customer" ? "You" : "Agent"}
                </span>
                <span className="text-xs text-slate-400">{m.created_at ? new Date(m.created_at).toLocaleString() : ""}</span>
              </div>
              <div className="text-slate-700">{m.message_text}</div>
            </div>
          ))}
        </div>

        {ticket.status === "closed" ? (
          <div className="p-6 border-t border-slate-100 text-red-500 text-sm text-center">
            🚫 This ticket is closed. You can no longer send messages.
          </div>
        ) : (
          <div className="p-6 border-t border-slate-100 flex space-x-2 bg-white">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a reply..."
              className="flex-1 border border-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;