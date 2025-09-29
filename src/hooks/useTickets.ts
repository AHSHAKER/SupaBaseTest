
import useAuthStore from "../Store/authStore";
import supabase from "../SupabaseUsers";
import type { Tables } from "../../database.types";

const user_id = useAuthStore.getState().user_id;

interface CreateTicketArgs {
    p_initial_message: string;
    p_subject: string;
    p_priority?: string;
}
interface AddTicketMessageArgs {
    p_message_text: string;
    p_sender_id: string;
    p_sender_role: string;
    p_ticket_id: number;
    p_attachments?: any;
}

export type Ticket = Tables<"tickets">;

console.log("Store: ", useAuthStore.getState());

export const createTicket = async (TicketArgs: CreateTicketArgs) => {
  const { data, error } = await supabase.rpc("create_ticket", {
    p_initial_message: TicketArgs.p_initial_message,
    p_subject: TicketArgs.p_subject,
    p_user_id: user_id,
    p_priority: TicketArgs.p_priority,
  });

  if (error) {
    console.error("createTicket error:", error);
    throw new Error(error.message); // Let the caller handle it
  }

  console.log("createTicket data:", data);
  return data;
};

export const addTicketMessage = async (MessageArgs: AddTicketMessageArgs) => {
    const { data, error } = await supabase.rpc("add_ticket_message", {
        p_message_text: MessageArgs.p_message_text,
        p_sender_id: MessageArgs.p_sender_id,
        p_sender_role: MessageArgs.p_sender_role,
        p_ticket_id: MessageArgs.p_ticket_id,
        p_attachments: MessageArgs.p_attachments || [],
    });

    if (error) throw error;
    return data;
};

export const getTicketMessages = async (ticket_id: number) => {
    const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("ticket_id", ticket_id);

    if (error) throw error;
return data;
};

export const getTicketStats = async () => {
    const { data, error } = await supabase.rpc("get_ticket_stats", { p_user_id: user_id });

    if (error) throw error;
    return data;
};

export const updateTicketPriority = async (ticket_id: number, p_priority: string) => {
  const { error } = await supabase.rpc("update_ticket_priority", { ticket_id, p_priority, p_user_id: user_id });

  if (error) throw error;
  return true;
};

export const getTickets = async () => {
  const user_id = useAuthStore.getState().user_id;
  if (!user_id) throw new Error("User not logged in");

    const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", user_id)
        .order("updated_at", { ascending: false });

    if (error) throw error;
    return data as Ticket[];
};

export const getTicketById = async (ticket_id: number) => {
    const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("ticket_id", ticket_id)
        .maybeSingle();

    if (error) throw error;
    return data as Ticket | null;
};
