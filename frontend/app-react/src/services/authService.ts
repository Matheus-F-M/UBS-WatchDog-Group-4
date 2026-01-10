/*
    Always Throw Errors Here and not in the components
*/
import type { AuthResponse } from "@/types/auth";

export async function loginRequest(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
}
