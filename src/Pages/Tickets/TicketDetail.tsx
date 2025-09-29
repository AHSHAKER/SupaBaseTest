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
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-[600px] h-[500px] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{ticket.subject}</h2>
          <button onClick={onClose} className="text-gray-500 cursor-pointer">✖</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-100">
              <p className="text-sm font-semibold">{m.sender_role}</p>
              <p>{m.message_text}</p>
            </div>
          ))}
        </div>

        {ticket.status === "closed" ? (
  <div className="p-4 border-t text-red-500 text-sm">
    🚫 This ticket is closed. You can no longer send messages.
  </div>
) : (
  <div className="p-4 border-t flex space-x-2">
    <input
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type a reply..."
      className="flex-1 border p-2 rounded"
    />
    <button
      onClick={handleSend}
      className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
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