/* Shared UI primitives. Exposes components on window. */
const { useState, useEffect, useRef, useMemo } = React;
const I = window.Denta.ICONS;

function Icon({ name, style }) {
  return <span style={{ display: 'inline-flex', ...style }} dangerouslySetInnerHTML={{ __html: I[name] || '' }} />;
}

function Logo({ onClick, theme = 'dark' }) {
  return (
    <div className="logo" onClick={onClick}>
      <span className="logo-mark">D</span>
      <span>Denta</span>
    </div>
  );
}

function Mono({ initials, variant = 'soft-blue', size }) {
  return (
    <span className={`mono mono-${variant} ${size === 'sm' ? 'mono-sm' : ''}`}>
      {initials}
    </span>
  );
}

function TopNav({ active, onNav, signedIn, onSignIn, onDashboard, onSignOut }) {
  const links = [
    { id: 'find', label: 'Find dentists' },
    { id: 'appointments', label: 'My appointments' },
    { id: 'providers', label: 'For providers' },
  ];
  return (
    <header className="topnav">
      <div className="container topnav-inner">
        <Logo onClick={() => onNav('home')} />
        <nav className="topnav-links">
          {links.map(l => (
            <a key={l.id} className={`topnav-link ${active === l.id ? 'active' : ''}`}
               onClick={() => onNav(l.id)} style={{ cursor: 'pointer' }}>{l.label}</a>
          ))}
          {signedIn ? (
            <>
              <button className="btn btn-soft btn-sm" onClick={onDashboard}>Dashboard</button>
              <button className="btn btn-ghost btn-sm" onClick={onSignOut}>Sign out</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onSignIn}>Sign in</button>
          )}
        </nav>
      </div>
    </header>
  );
}

function StatCard({ num, label }) {
  return (
    <div className="stat-card">
      <div className="stat-num tnum">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

function Stepper({ step, steps }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <span className="step-bullet"><span>{i + 1}</span></span>
            <span className="step-label">{s}</span>
          </div>
          {i < steps.length - 1 && <div className="step-line" style={i < step ? { background: 'var(--navy)' } : null} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function Sidebar({ items, active, onChange, user, theme = 'dark', onSignOut }) {
  return (
    <aside className={`sidebar ${theme === 'light' ? 'sidebar-light' : ''}`}>
      <Logo />
      <div style={{ height: 8 }} />
      {items.map(it => (
        <div key={it.id}
             className={`sidebar-item ${active === it.id ? 'active' : ''}`}
             onClick={() => onChange(it.id)}>
          <Icon name={it.icon} />
          <span>{it.label}</span>
        </div>
      ))}
      {onSignOut && (
        <>
          <div className="sidebar-divider" />
          <div className="sidebar-item" onClick={onSignOut}>
            <Icon name="signout" />
            <span>Sign out</span>
          </div>
        </>
      )}
      {user && (
        <div className="sidebar-foot">
          <div className="sidebar-user">
            <Mono initials={user.initials} variant="soft-mint" size="sm" />
            <div>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>{user.role}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function Rating({ value, count }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text)', fontSize: 13 }}>
      <span style={{ color: '#E0A800', display: 'inline-flex' }}><Icon name="star" /></span>
      <strong style={{ fontWeight: 700 }}>{value}</strong>
      <span className="muted">({count})</span>
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    confirmed: { cls: 'status-confirmed', label: 'Confirmed' },
    pending: { cls: 'status-pending', label: 'Pending forms' },
    urgent: { cls: 'status-urgent', label: 'Urgent' },
    completed: { cls: 'status-completed', label: 'Completed' },
    cancelled: { cls: 'status-pending', label: 'Cancelled' },
  };
  const v = map[status] || map.pending;
  return <span className={`appt-status ${v.cls}`}>{v.label}</span>;
}

/* Stylized dentist photo header — original illustration:
   a soft navy/blue gradient with a large monogram + tooth motif. */
function DentistPhoto({ initials, variant }) {
  const palettes = {
    'soft-mint':  ['#CFEDE1', '#6FB59A'],
    'soft-blue':  ['#DDE5F0', '#7A93B5'],
    'soft-sand':  ['#F4E5CC', '#C7A56F'],
    'soft-rose':  ['#F2DDE2', '#B98798'],
    'soft-lilac': ['#E1DAF0', '#8472B1'],
  };
  const [c1, c2] = palettes[variant] || palettes['soft-blue'];
  return (
    <div className="dentist-photo" style={{ background: `linear-gradient(155deg, ${c1} 0%, ${c2} 100%)` }}>
      <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`g-${variant}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="320" height="220" fill={`url(#g-${variant})`} />
        {/* tooth silhouette */}
        <g opacity="0.18" transform="translate(230 30)" fill="#fff">
          <path d="M30 0c10 0 22 5 22 18 0 7-2 11-4 16-2 6-2 11 0 18 1 6-2 14-7 14-6 0-5-11-11-11s-5 11-11 11c-5 0-8-9-7-14 2-7 2-12 0-18-2-5-4-9-4-16C8 5 20 0 30 0Z" />
        </g>
        <g opacity="0.10" transform="translate(20 130)" fill="#fff">
          <path d="M30 0c10 0 22 5 22 18 0 7-2 11-4 16-2 6-2 11 0 18 1 6-2 14-7 14-6 0-5-11-11-11s-5 11-11 11c-5 0-8-9-7-14 2-7 2-12 0-18-2-5-4-9-4-16C8 5 20 0 30 0Z" />
        </g>
        <text x="160" y="135" textAnchor="middle" fontFamily="Manrope, sans-serif"
              fontSize="86" fontWeight="800" fill="rgba(15,31,54,0.42)">{initials}</text>
      </svg>
    </div>
  );
}

window.DentaUI = {
  Icon, Logo, Mono, TopNav, StatCard, Toast, Stepper, Sidebar, Rating, StatusPill, DentistPhoto,
};
