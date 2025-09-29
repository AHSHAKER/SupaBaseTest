import { useState } from "react";
import { createTicket } from "../../hooks/useTickets";

interface Props {
  onClose: () => void;
}

const CreateTicketForm = ({ onClose }: Props) => {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("normal");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTicket({ p_subject: subject, p_priority: priority, p_initial_message: message });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Create Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <textarea
            placeholder="Initial message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="cursor-pointer hover:shadow-lg px-3 py-1 border rounded">
              Cancel
            </button>
            <button type="submit" className="cursor-pointer hover:shadow-lg px-3 py-1  bg-blue-600 text-white rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketForm;
