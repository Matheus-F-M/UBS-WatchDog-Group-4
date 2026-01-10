import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore, { type AuthState } from "../../lib/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const login = useAuthStore((s: AuthState) => s.login);
  const loading = useAuthStore((s: AuthState) => s.loading);
  const error = useAuthStore((s: AuthState) => s.error);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      // authStore handles error
    } finally {
      setPassword("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>

        <CardFooter className="mt-8 space-y-8">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </CardFooter>

      </form>

      <p className="text-sm text-gray-600 flex justify-center">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 underline px-1">
          Sign up
        </Link>
      </p>
    </Card>
  );
}
