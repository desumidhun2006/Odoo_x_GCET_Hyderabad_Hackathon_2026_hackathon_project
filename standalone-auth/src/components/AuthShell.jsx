import { Boxes } from 'lucide-react'

function Brand({ mobile = false }) {
  return (
    <div className={`brand-lockup${mobile ? ' mobile-brand' : ''}`}>
      <span className="brand-mark"><Boxes size={21} strokeWidth={1.8} /></span>
      <span className="brand-name">Stock<span>Sense</span></span>
    </div>
  )
}

function AuthShell({ kicker, title, description, children, footer }) {
  return (
    <main className="auth-page">
      <aside className="brand-panel" aria-label="StockSense">
        <Brand />
        <div className="brand-copy">
          <p className="eyebrow">StockSense / Operations access</p>
          <h1>Clarity for the work that keeps things moving.</h1>
          <p>A focused workspace for the people behind every well-run operation.</p>
        </div>
        <div className="brand-visual" aria-hidden="true">
          <div className="warehouse-frame">
            <span className="warehouse-roof" />
            <span className="warehouse-shelf"><i /><i /><i /></span>
            <span className="warehouse-shelf lower"><i /><i /><i /></span>
          </div>
        </div>
        <div className="brand-footnote"><span /> Secure team access</div>
      </aside>
      <section className="auth-main">
        <Brand mobile />
        <div className="auth-card">
          <header className="auth-heading">
            <p className="auth-kicker">{kicker}</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </header>
          {children}
          {footer}
        </div>
      </section>
    </main>
  )
}

export default AuthShell