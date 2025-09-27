export interface SignUpValues {
  email: string;
  password: string;
  confirmPassword: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface SignInValues {
  email: string;
  password: string;
}

export interface ProfileContextType {
  user_id: string;
  full_name?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  plan:{
    name: string;
    code: string;
    id: string;
    status: "active" | "pending" | "canceled" | "inactive" | "trialing" | "unpaid";
  } | null;
}