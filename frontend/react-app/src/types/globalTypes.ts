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
   -------------- CURRENCY -----------------
   ----------------------------------------- */

// Define currencies array (can be exported and reused)
export const currencySchema = z.object({
  codigo: z.string().min(1, "Código obrigatório"), // <<<< STRING: OK
  nome: z.string().min(1, "Nome obrigatório"), // <<<< STRING: OK
  taxaDiaria: z.number().nonnegative("Taxa diária deve ser não negativa"), // <<<< NUMBER: OK
});

// Infer TypeScript type from Zod schema
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
  pais: z.string().min(1, "País obrigatório"), // <<<< STRING: OK USE API
  kycStatus: z.enum(["Aprovado", "Pendente", "Em Análise", "Rejeitado"]), // <<<< STRING ENUM: Remover "Em Análise"
  nivelDeRisco: z.enum(["Baixo", "Medio", "Alto"]), // <<<< STRING ENUM: OK
  income: moneyAmountSchema.optional(), // <<<< NUMBER: OK mas coletar essa informação do back ("income")
  isActive: z.boolean(), // <<<< BOOLEAN: OK
});

// Infer TypeScript type from Zod schema
export type Client = z.infer<typeof clientSchema>;

/* -----------------------------------------
   ------------- TRANSACTION ---------------
   ----------------------------------------- */

export const transactionSchema = z.object({
  id: z.string(), // STRING: OK
  idCliente: z.string(), // STRING: OK
  tipo: z.enum(["Depósito", "Saque", "Transferência"]), // ENUM<STRING>: OK
  valor: moneyAmountSchema, // NUMBER: OK
  moeda: z.string(), // STRING: OK
  idContraparte: z.string(), // STRING (ID CONTRAPARTE): OK
  dataHora: z.string(), // STRING: Combined date and time
});

// Infer TypeScript type from Zod schema
export type Transaction = z.infer<typeof transactionSchema>;

/* -----------------------------------------
      ------------- ALERT ---------------
   ----------------------------------------- */

export const alertSchema = z.object({
  id: z.string(), // STRING: TODO backend check
  idCliente: z.string(), // STRING: TODO backend check
  idTransacao: z.string(), // STRING: TODO backend check
  regra: z.string().min(1, "Regra obrigatória"), // STRING: TODO backend check
  severidade: z.enum(["Baixa", "Média", "Alta", "Crítico"]), // STRING ENUM: TODO backend check
  status: z.enum(["Novo","Em Análise", "Resolvido"]), // STRING ENUM: TODO backend check
});

// Infer TypeScript type from Zod schema
export type Alert = z.infer<typeof alertSchema>;

/* -----------------------------------------
    -------------- COUNTRY ---------------
   ----------------------------------------- */

   export const countrySchema = z.object({
    nome: z.string().min(1, "Nome obrigatório"), // STRING: TODO backend check
    codigo: z.string().min(1, "Código obrigatório"), // STRING: TODO backend check
    risco: z.enum(["Baixo", "Médio", "Alto"]), // STRING: TODO backend check
  });

// Infer TypeScript type from Zod schema
export type Country = z.infer<typeof countrySchema>;