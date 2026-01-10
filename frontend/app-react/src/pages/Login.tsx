import * as React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { loginRequest } from "@/services/authService"


/**
 * Creates a login form to be used in main.tsx.
 * Uses the card.tsx component of shadcn/ui to style a login page.
 * Uses Zustand to create an authentication state management.
 * @returns a log-in page
 */
export default function Login() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const login = useAuthStore((state) => state.login)

  /**
   * Handles the form submission for user login, using local storage to store the authentication token.
   * @param e - The form submission event.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try{
      const { token, user } = await loginRequest(email,password)
      login(user, token) // update global auth state
      localStorage.setItem("token", token) // store token in local storage
      localStorage.setItem("user", JSON.stringify(user)) // store user in local storage
      
      // TODO: Replace with proper routing
      window.location.href = "/" // redirect to dashboard
      // ---------------

    } catch (err: any) {
      setError(err?.message ?? "Sign in failed")
    } finally {
      setLoading(false)
      setPassword("") // Clear Password for security
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="px-6 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </div>
            <CardAction className="text-sm">
              <a href="/help" className="underline">
                Need help?
              </a>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="px-6 pt-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-6">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a href="/register" className="text-primary underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}