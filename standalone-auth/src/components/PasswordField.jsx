import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

function PasswordField({ id, label, name, value, onChange, autoComplete, minLength = 8, required = true }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="input-wrap has-action">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
        />
        <button
          className="input-action"
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          title={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  )
}

export default PasswordField