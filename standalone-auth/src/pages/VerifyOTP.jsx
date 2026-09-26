import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { resendOtp, verifyOtp } from '../services/authService.js'

function VerifyOTP() {
  const email = sessionStorage.getItem('stocksense.resetEmail') || ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!email) {
      navigate('/forgot-password', { replace: true })
      return
    }
    setSubmitting(true)
    try {
      await verifyOtp({ email, otp })
      navigate('/reset-password', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'That code is invalid or expired. Request a new code and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    setError('')
    setNotice('')
    setResending(true)
    try {
      await resendOtp(email)
      setNotice('If an account exists for this email, a new code has been sent.')
      setOtp('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to resend the code right now.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthShell
      kicker="Verify your email"
      title="Enter your reset code"
      description={email ? `Enter the 6-digit code sent to ${email}.` : 'Start password recovery to receive a one-time code.'}
      footer={<p className="auth-switch"><Link className="text-link" to="/forgot-password">Use a different email</Link></p>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="form-alert" role="alert">{error}</div>}
        {notice && <div className="form-alert success" role="status"><CheckCircle2 size={16} /> {notice}</div>}
        <div className="field">
          <label className="field-label" htmlFor="otp">One-time code</label>
          <div className="input-wrap"><input id="otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} pattern="[0-9]{6}" minLength={6} maxLength={6} required /></div>
        </div>
        <div className="resend-row"><span>Code expires after 10 minutes</span><button className="resend-button" type="button" onClick={handleResend} disabled={resending || !email}>{resending ? 'Sending…' : 'Resend code'}</button></div>
        <button className="submit-button" type="submit" disabled={submitting || otp.length !== 6 || !email}>
          {submitting ? <><LoaderCircle className="button-spinner" /> Verifying code</> : <>Verify code <ArrowRight /></>}
        </button>
      </form>
    </AuthShell>
  )
}

export default VerifyOTP