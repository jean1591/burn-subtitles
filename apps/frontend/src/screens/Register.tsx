import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { FormattedMessage } from "react-intl";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password);
      navigate("/buy-credits");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            <FormattedMessage
              id="auth.register.title"
              defaultMessage="Create your account"
            />
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <FormattedMessage
              id="auth.register.haveAccount"
              defaultMessage="Already have an account?"
            />{" "}
            <Link
              to="/login"
              className="font-medium text-amber-600 hover:text-amber-500"
            >
              <FormattedMessage
                id="auth.register.login"
                defaultMessage="Sign in"
              />
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                <FormattedMessage
                  id="auth.email"
                  defaultMessage="Email address"
                />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                <FormattedMessage
                  id="auth.password"
                  defaultMessage="Password"
                />
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                <FormattedMessage
                  id="auth.confirmPassword"
                  defaultMessage="Confirm password"
                />
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <FormattedMessage
                  id="auth.register.loading"
                  defaultMessage="Creating account..."
                />
              ) : (
                <FormattedMessage
                  id="auth.register.submit"
                  defaultMessage="Create account"
                />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
