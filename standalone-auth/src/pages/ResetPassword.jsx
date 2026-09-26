import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import PasswordField from '../components/PasswordField.jsx'
import { resetPassword } from '../services/authService.js'

function ResetPassword() {
  const email = sessionStorage.getItem('stocksense.resetEmail') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true })
  }, [email, navigate])

  useEffect(() => {
    if (!success) return undefined
    const timer = window.setTimeout(() => {
      sessionStorage.removeItem('stocksense.resetEmail')
      navigate('/login', { replace: true })
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [success, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await resetPassword({ email, newPassword: password })
      setSuccess(true)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reset your password right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Choose a new password"
      title="Reset your password"
      description="Create a new password to secure your StockSense account."
      footer={<p className="auth-switch"><Link className="text-link" to="/login">Return to sign in</Link></p>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="form-alert" role="alert">{error}</div>}
        {success && <div className="form-alert success" role="status"><CheckCircle2 size={16} /> Password updated. Redirecting to sign in…</div>}
        <PasswordField id="password" label="New password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
        <PasswordField id="confirmPassword" label="Confirm new password" name="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
        <button className="submit-button" type="submit" disabled={submitting || success || !email}>
          {submitting ? <><LoaderCircle className="button-spinner" /> Updating password</> : <>Update password <ArrowRight /></>}
        </button>
      </form>
    </AuthShell>
  )
}

export default ResetPassword