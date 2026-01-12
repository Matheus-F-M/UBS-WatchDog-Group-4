import { z } from "zod";

/* -----------------------------------------
   --------------- CPF/CNPJ ----------------
   ----------------------------------------- */
export type CPF = string & { __brand: "CPF" };
export type CNPJ = string & { __brand: "CNPJ" };
export type CpfCnpj = CPF | CNPJ;

/**
 * Checks if the given value is a valid CPF.
 * @param value String
 * @returns boolean
 */
export function isCPF(value: string): value is CPF {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value);
}

/**
 * Checks if the given value is a valid CNPJ.
 * @param value String
 * @returns boolean
 */
export function isCNPJ(value: string): value is CNPJ {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value);
}

/**
 * Uses isCPF and isCNPJ to validate input and enforce types.
 * @param value String
 * @returns CpfCnpj | null
 */
export function validateCpfCnpj(value: string): CpfCnpj | null {
  if (isCPF(value)) return value as CPF;
  if (isCNPJ(value)) return value as CNPJ;
  return null;
}

// CPF/CNPJ schema with validation
export const cpfCnpjSchema = z
  .string()
  .regex(
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    "CPF/CNPJ inválido"
  );
  
/* -----------------------------------------
   ----------------- TIME ------------------
   ----------------------------------------- */
export type TimeString = string & { __brand: "TimeString" };

/**
 * Checks if the given value is a valid time in HH:MM:SS format (24-hour).
 * @param value String
 * @returns boolean
 */
export function isValidTime(value: string): value is TimeString {
  return /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
}

/**
 * Formats a TimeString to HH:MM format for display (removes seconds).
 * @param value TimeString in HH:MM:SS format
 * @returns Formatted string HH:MM
 */
export function formatTime(value: TimeString): string {
  return value.substring(0, 5); // Returns HH:MM
}

// Time schema with validation
export const timeSchema = z
  .string()
  .refine((time) => validateTime(time) !== null, {
    message: "Hora inválida. Use HH:MM:SS ou HH:MM (formato 24h)",
  })
  .transform((time) => validateTime(time)!);

/* -----------------------------------------
   ----------------- DATE ------------------
   ----------------------------------------- */

export type DateString = string & { __brand: "DateString" };

/**
 * Checks if the given value is a valid date in YYYY-MM-DD format.
 * @param value String
 * @returns boolean
 */
export function isValidDate(value: string): value is DateString {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString().split('T')[0];
}

/**
 * Validates and returns a TimeString, or null if invalid.
 * Accepts HH:MM:SS or HH:MM format (24-hour)
 * @param value String
 * @returns TimeString | null
 */
export function validateTime(value: string): TimeString | null {
  // Try HH:MM:SS format first
  if (isValidTime(value)) return value as TimeString;
  
  // Try HH:MM format and convert to HH:MM:SS
  const hhmmMatch = value.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/);
  if (hhmmMatch) {
    return `${value}:00` as TimeString;
  }
  
  return null;
}

/**
 * Validates and returns a DateString, or null if invalid.
 * Accepts formats: YYYY-MM-DD, DD/MM/YYYY, or ISO date strings
 * @param value String
 * @returns DateString | null
 */
export function validateDate(value: string): DateString | null {
  // Try YYYY-MM-DD format first
  if (isValidDate(value)) return value as DateString;
  
  // Try DD/MM/YYYY format
  const ddmmyyyyMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    const isoDate = `${year}-${month}-${day}`;
    if (isValidDate(isoDate)) return isoDate as DateString;
  }
  
  // Try parsing as general date string
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    const isoDate = date.toISOString().split('T')[0];
    if (isValidDate(isoDate)) return isoDate as DateString;
  }
  
  return null;
}

/**
 * Formats a DateString to DD/MM/YYYY format for display.
 * @param value DateString in YYYY-MM-DD format
 * @returns Formatted string DD/MM/YYYY
 */
export function formatDate(value: DateString): string {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

// Date schema with validation
export const dateSchema = z
  .string()
  .refine((date) => validateDate(date) !== null, {
    message: "Data inválida. Use YYYY-MM-DD ou DD/MM/YYYY",
  })
  .transform((date) => validateDate(date)!);

/* -----------------------------------------
   ---------------- MONEY ------------------
   ----------------------------------------- */

// Money amount with 2 decimal places
export const moneyAmountSchema = z
  .number()
  .positive()
  .transform((val) => Math.floor(val * 100) / 100);

/**
 * Formats a number to 2 decimal places, rounding down to the nearest hundredth.
 * @param value Number to format
 * @returns Formatted string with 2 decimal places
 */
export function formatCurrency(value: number): string {
  const roundedDown = Math.floor(value * 100) / 100;
  return roundedDown.toFixed(2);
}

/* -----------------------------------------
   -------------- CURRENCY -----------------    <<<< This will come from the backend later
   ----------------------------------------- */

// Define currencies array (can be exported and reused)
export const currencies = [
  { value: "BRL", label: "BRL - Brazilian Real" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "CHF", label: "CHF - Swiss Franc" },
] as const; // 'as const' makes it readonly and preserves literal types

// Extract currency codes from the array
const currencyValues = currencies.map((c) => c.value) as [string, ...string[]];

// Currency schema using the extracted values
export const currencySchema = z.enum(currencyValues);

// Extract TypeScript type
export type Currency = z.infer<typeof currencySchema>;

/* -----------------------------------------
   -------------- CLIENT -------------------
   ----------------------------------------- */

// Client schema
export const clientSchema = z.object({
  id: z.string(), // <<<< STRING: OK
  nome: z.string().min(1, "Nome obrigatório"), // <<<< STRING: OK
  // sobrenome: z.string().min(1, "Sobrenome obrigatório"), // <<<< Remover Sobrenome
  cpfCnpj: cpfCnpjSchema, // <<<< STRING: OK
  pais: z.string().min(1, "País obrigatório"), // <<<< STRING: OK
  kycStatus: z.enum(["Aprovado", "Pendente", "Em Análise", "Rejeitado"]), // <<<< STRING ENUM: Remover "Em Análise"
  nivelDeRisco: z.enum(["Baixo", "Medio", "Alto"]), // <<<< STRING ENUM: OK
  income: moneyAmountSchema.optional(), // <<<< NUMBER: OK mas coletar essa informação do back ("income")
  // monthlyIncomeCurrency: currencySchema.optional(), // <<<< This will come from the backend later
  // companyCapitalCurrency: currencySchema.optional(), // <<<< This will come from the backend later
});

// Infer TypeScript type from Zod schema
export type Client = z.infer<typeof clientSchema>;

/* -----------------------------------------
   ------------- TRANSACTION ---------------
   ----------------------------------------- */

export const transactionSchema = z.object({
  id: z.string(), // STRING: TODO backend check
  idCliente: z.string(), // STRING: TODO backend check
  tipo: z.enum(["Depósito", "Saque", "Transferência"]), // ENUM<STRING>: TODO backend check
  valor: moneyAmountSchema, // NUMBER: TODO backend check
  moeda: currencySchema, // STRING: TODO backend check
  contraparte: z.string().min(1, "Contraparte obrigatória"), // STRING (ID): TODO backend check [] ALERT: Conflito quando adicionando um novo cliente e no fetching
  data: dateSchema, // STRING: TODO backend check
  hora: timeSchema, // STRING: TODO backend check
});

// Infer TypeScript type from Zod schema
export type Transaction = z.infer<typeof transactionSchema>;
