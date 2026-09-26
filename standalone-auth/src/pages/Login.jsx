import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import PasswordField from '../components/PasswordField.jsx'
import { useAuth } from '../context/useAuth.js'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Welcome back"
      title="Sign in to your account"
      description="Use your work email and password to continue."
      footer={<p className="auth-switch">New to StockSense?<Link className="text-link" to="/signup">Create an account</Link></p>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="form-alert" role="alert">{error}</div>}
        <div className="field">
          <label className="field-label" htmlFor="email">Email address</label>
          <div className="input-wrap">
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
        </div>
        <PasswordField id="password" label="Password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" minLength={1} />
        <div className="form-meta"><Link className="text-link" to="/forgot-password">Forgot password?</Link></div>
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? <><LoaderCircle className="button-spinner" /> Signing in</> : <>Sign in <ArrowRight /></>}
        </button>
      </form>
    </AuthShell>
  )
}

export default Login