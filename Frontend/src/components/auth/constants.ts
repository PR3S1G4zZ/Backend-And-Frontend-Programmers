export const USER_TYPES = {
  PROGRAMMER: "programmer",
  COMPANY: "company",
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

// Renombrado para evitar conflicto con el FormData del navegador
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  position: string;
}

export const INITIAL_FORM_DATA: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  position: "",
};

export const DEMO_ACCOUNTS = [
  { label: "Programador", email: "demo@dev.com" },
  { label: "Empresa", email: "demo@company.com" },
  { label: "Contraseña", password: "Demo1234!" },
];

// Email: exactamente un punto después del "@" (ej: usuario@dominio.tld)
export const EMAIL_SINGLE_DOT_REGEX = /^[^@\s]+@[^@\.\s]+\.[^@\.\s]+$/i;
