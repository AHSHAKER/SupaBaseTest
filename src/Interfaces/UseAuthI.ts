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