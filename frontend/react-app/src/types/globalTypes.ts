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
const currencyValues = currencies.map(c => c.value) as [string, ...string[]];

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
  income: moneyAmountSchema.optional(), // <<<< OK mas coletar essa informação do back ("income")
  // monthlyIncomeCurrency: currencySchema.optional(), // <<<< This will come from the backend later
  // companyCapitalCurrency: currencySchema.optional(), // <<<< This will come from the backend later
});

// Infer TypeScript type from Zod schema
export type Client = z.infer<typeof clientSchema>;