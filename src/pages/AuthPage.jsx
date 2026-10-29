
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await fetch(
        `http://localhost:5001/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong.');
      }

      if (isLogin) {
        const { token, user } = result.data;

        localStorage.setItem('mediflow-token', token);
        localStorage.setItem('mediflow-user', JSON.stringify(user));

        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      } else {
        setIsLogin(true);
        setName('');
        setPassword('');
        setMessage('Account created successfully! Please log in.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-10 text-[var(--color-text)]">
      <section className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg sm:p-8">
        <Link
          to="/"
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          ← Back to MediFlow
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {isLogin
            ? 'Log in to continue to MediFlow.'
            : 'Register as a patient to get started.'}
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Log in'
                : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
            className="font-semibold text-[var(--color-primary)] hover:underline"
          >
            {isLogin ? 'Register' : 'Log in'}
          </button>
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
