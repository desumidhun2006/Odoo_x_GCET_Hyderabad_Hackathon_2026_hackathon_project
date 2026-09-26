import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import PasswordField from '../components/PasswordField.jsx'
import { useAuth } from '../context/useAuth.js'

function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!success) return undefined
    const timer = window.setTimeout(() => navigate('/login', { replace: true }), 1800)
    return () => window.clearTimeout(timer)
  }, [success, navigate])

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      setSuccess(true)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Create your account"
      title="Get started with StockSense"
      description="Set up secure access for your StockSense workspace."
      footer={<p className="auth-switch">Already registered?<Link className="text-link" to="/login">Sign in</Link></p>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="form-alert" role="alert">{error}</div>}
        {success && <div className="form-alert success" role="status"><CheckCircle2 size={16} /> Account created. Taking you to sign in…</div>}
        <div className="field">
          <label className="field-label" htmlFor="name">Full name</label>
          <div className="input-wrap"><input id="name" name="name" type="text" autoComplete="name" placeholder="Jordan Lee" value={form.name} onChange={update} maxLength={80} required /></div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="email">Email address</label>
          <div className="input-wrap"><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={update} required /></div>
        </div>
        <PasswordField id="password" label="Password" name="password" value={form.password} onChange={update} autoComplete="new-password" />
        <PasswordField id="confirmPassword" label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={update} autoComplete="new-password" />
        <button className="submit-button" type="submit" disabled={submitting || success}>
          {submitting ? <><LoaderCircle className="button-spinner" /> Creating account</> : <>Create account <ArrowRight /></>}
        </button>
      </form>
    </AuthShell>
  )
}

export default Signup