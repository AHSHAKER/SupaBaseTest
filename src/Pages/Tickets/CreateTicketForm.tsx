import { useState, useRef, useEffect } from "react";
import { createTicket } from "../../hooks/useTickets";

interface Props {
  onClose: () => void;
}

const CreateTicketForm = ({ onClose }: Props) => {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("normal");
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorityOptions = [
    { value: "low", label: "Low", color: "slate" },
    { value: "normal", label: "Normal", color: "blue" },
    { value: "high", label: "High", color: "orange" },
    { value: "urgent", label: "Urgent", color: "red" }
  ];

  const selectedOption = priorityOptions.find(opt => opt.value === priority);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTicket({ p_subject: subject, p_priority: priority, p_initial_message: message });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Create Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          
          {/* Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition bg-white text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full bg-${selectedOption?.color}-500`}></span>
                <span className="text-slate-700">{selectedOption?.label}</span>
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-10 overflow-hidden">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setPriority(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 flex items-center gap-2 transition ${
                      priority === option.value
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full bg-${option.color}-500`}></span>
                    <span>{option.label}</span>
                    {priority === option.value && (
                      <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            placeholder="Initial message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketForm;