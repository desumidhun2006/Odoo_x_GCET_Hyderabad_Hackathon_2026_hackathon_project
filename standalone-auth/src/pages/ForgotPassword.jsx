import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { requestPasswordReset } from '../services/authService.js'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await requestPasswordReset(email.trim())
      sessionStorage.setItem('stocksense.resetEmail', email.trim())
      navigate('/verify-otp')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to request a reset code right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Account recovery"
      title="Forgot your password?"
      description="Enter your account email and we’ll send a one-time reset code."
      footer={<p className="auth-switch"><Link className="text-link" to="/login"><ArrowLeft size={13} /> Back to sign in</Link></p>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="form-alert" role="alert">{error}</div>}
        <div className="field">
          <label className="field-label" htmlFor="email">Email address</label>
          <div className="input-wrap"><input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
        </div>
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? <><LoaderCircle className="button-spinner" /> Sending code</> : <>Send reset code <ArrowRight /></>}
        </button>
      </form>
    </AuthShell>
  )
}

export default ForgotPassword