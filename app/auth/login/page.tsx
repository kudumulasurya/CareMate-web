import { LoginForm } from "@/components/auth/auth-form"

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-6">
      <LoginForm />
      <p className="mt-4 text-sm">
        New here?{" "}
        <a className="underline" href="/auth/register">
          Create an account
        </a>{" "}
        or{" "}
        <a className="underline" href="/auth/register-doctor">
          Register as a doctor
        </a>
      </p>
    </main>
  )
}
