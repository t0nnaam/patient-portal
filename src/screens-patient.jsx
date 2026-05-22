/* Patient dashboard with tabs: find dentists, my appointments, messages, insurance, profile */
const { useState: useStatePD, useMemo: useMemoPD, useEffect } = React;
const {
  Icon: IconPD, Mono: MonoPD, Sidebar: SidebarPD, Rating: RatingPD,
  StatusPill: StatusPillPD, DentistPhoto: DentistPhotoPD, StatCard: StatCardPD,
} = window.DentaUI;
const DPD = window.Denta;

function PatientDashboard({ initialTab, appointments, user, onCancel, onReschedule, onBookFromHere, onMessage, onSignOut, onDetails, onBook }) {
  const [tab, setTab] = useStatePD(initialTab || 'find');
  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);

  const items = [
    { id: 'find', label: 'Find dentists', icon: 'search' },
    { id: 'appts', label: 'My appointments', icon: 'calendar' },
    { id: 'messages', label: 'Messages', icon: 'inbox' },
    { id: 'insurance', label: 'Insurance', icon: 'shield' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  return (
    <div className="shell">
      <SidebarPD items={items} active={tab} onChange={setTab} user={user} onSignOut={onSignOut} />
      <main className="shell-main">
        {tab === 'find' && <PatientFind onDetails={onDetails} onBook={onBook} />}
        {tab === 'appts' && <PatientAppts appointments={appointments} onCancel={onCancel} onReschedule={onReschedule} onBookNew={onBookFromHere} />}
        {tab === 'messages' && <PatientMessages />}
        {tab === 'insurance' && <PatientInsurance />}
        {tab === 'profile' && <PatientProfile user={user} onSignOut={onSignOut} />}
      </main>
    </div>
  );
}

function PatientFind({ onDetails, onBook }) {
  const { FiltersPanel, DentistCard, emptyFilters, applyFilters } = window.DentaSearchPanels;
  const [service, setService] = useStatePD('');
  const [location, setLocation] = useStatePD('Irvine, CA');
  const [filters, setFilters] = useStatePD(emptyFilters({ location: 'Irvine, CA' }));
  const filtered = applyFilters(filters);

  function doSearch() {
    setFilters(f => ({ ...f, locationText: location, services: service ? [service] : f.services }));
  }

  return (
    <div>
      <h1 className="h1" style={{ marginBottom: 8 }}>Find dentists</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Search nearby dentists and book a visit.</p>

      <div className="searchbar" style={{ maxWidth: 760, marginBottom: 28 }}>
        <div className="searchbar-field">
          <input value={service} onChange={e => setService(e.target.value)} placeholder="Dental service" />
        </div>
        <div className="searchbar-divider" />
        <div className="searchbar-field">
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or ZIP" />
        </div>
        <button className="btn btn-primary" onClick={doSearch}>Search</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }}>
        <FiltersPanel filters={filters} setFilters={setFilters}
                      onClear={() => setFilters(emptyFilters({ location: 'Irvine, CA' }))} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 className="h3">{filtered.length} dentists match your search</h3>
            <div className="muted" style={{ fontSize: 14 }}>Sort by: <strong style={{ color: 'var(--text)' }}>Closest</strong></div>
          </div>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div className="muted">No dentists match these filters. Try clearing some.</div>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(d => <DentistCard key={d.id} d={d} onDetails={onDetails} onBook={onBook} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PatientAppts({ appointments, onCancel, onReschedule, onBookNew }) {
  const [tab, setTab] = useStatePD('upcoming');
  const list = appointments.filter(a => tab === 'upcoming' ? a.status !== 'cancelled' : a.status === 'cancelled');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 className="h1" style={{ marginBottom: 6 }}>My appointments</h1>
          <p className="muted">Your visits, all in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={onBookNew}>Book new appointment</button>
      </div>

      <div className="tabs" style={{ margin: '16px 0 24px' }}>
        {[['upcoming','Upcoming'], ['past','Past'], ['cancelled','Cancelled']].map(([id,lbl]) => (
          <span key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{lbl}</span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {list.length === 0 && (
          <div className="card" style={{ padding: 28, textAlign: 'center' }}>
            <div className="muted">No appointments in this tab.</div>
          </div>
        )}
        {list.map(a => {
          const dentist = DPD.DENTISTS.find(d => d.id === a.dentistId);
          return (
            <div key={a.id} className="card" style={{ padding: 22, display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 16, alignItems: 'center' }}>
              <div>
                <div className="h4">{a.date}</div>
                <div className="muted" style={{ marginTop: 4 }}>{a.time}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <MonoPD initials={dentist?.initials || '?'} variant={dentist?.avatar || 'soft-blue'} size="sm" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{dentist?.name}</div>
                  <div className="muted">{a.visitName || DPD.VISIT_TYPES.find(v => v.id === a.visitType)?.name || 'Visit'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <StatusPillPD status={a.status} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onReschedule(a.id)}>Reschedule</button>
                  <button className="btn btn-soft btn-sm" onClick={() => onCancel(a.id)}>Cancel</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PatientMessages() {
  const [selected, setSelected] = useStatePD(DPD.MESSAGES_THREADS[0].id);
  const [text, setText] = useStatePD('');
  const [messages, setMessages] = useStatePD([
    { from: 'them', body: 'Hi Alex — confirming we received your insurance details. See you Friday!' },
    { from: 'me', body: 'Great, thanks! Is parking available on-site?' },
    { from: 'them', body: 'Yes, free parking in the lot behind the building.' },
  ]);

  function send() {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: 'me', body: text.trim() }]);
    setText('');
    setTimeout(() => {
      setMessages(m => [...m, { from: 'them', body: 'Got it! We\'ll get back to you shortly.' }]);
    }, 600);
  }

  return (
    <div>
      <h1 className="h1" style={{ marginBottom: 8 }}>Messages</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Chat directly with your dental office.</p>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 480 }}>
        <div style={{ borderRight: '1px solid var(--border)', padding: 12 }}>
          {DPD.MESSAGES_THREADS.map(t => (
            <div key={t.id} onClick={() => setSelected(t.id)}
                 style={{ padding: 14, borderRadius: 12, cursor: 'pointer',
                          background: selected === t.id ? 'var(--surface-2)' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.from}</div>
                {t.unread && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--mint-700)' }} />}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.preview}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700 }}>Bright Smiles — Front Desk</div>
            <div className="muted" style={{ fontSize: 13 }}>Typically replies within an hour</div>
          </div>
          <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                                    background: m.from === 'me' ? 'var(--navy)' : 'var(--surface-2)',
                                    color: m.from === 'me' ? '#fff' : 'var(--text)',
                                    padding: '10px 14px', borderRadius: 14, maxWidth: '70%', fontSize: 14 }}>
                {m.body}
              </div>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input className="input" value={text} onChange={e => setText(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && send()}
                   placeholder="Write a message…" />
            <button className="btn btn-primary" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientInsurance() {
  const [insurer, setInsurer] = useStatePD('Delta Dental');
  const [memberId, setMemberId] = useStatePD('DD-882-3911');
  const [group, setGroup] = useStatePD('GRP-1024');
  const [saved, setSaved] = useStatePD(false);
  return (
    <div style={{ maxWidth: 700 }}>
      <h1 className="h1" style={{ marginBottom: 8 }}>Insurance</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Keep your coverage up to date for faster check-in.</p>
      <div className="card" style={{ padding: 28 }}>
        <label className="label">Primary insurance</label>
        <select className="input" value={insurer} onChange={e => setInsurer(e.target.value)}>
          {['Delta Dental','Aetna','Cigna','MetLife','Guardian','Self-pay'].map(i => <option key={i}>{i}</option>)}
        </select>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
          <div>
            <label className="label">Member ID</label>
            <input className="input" value={memberId} onChange={e => setMemberId(e.target.value)} />
          </div>
          <div>
            <label className="label">Group #</label>
            <input className="input" value={group} onChange={e => setGroup(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 22 }} onClick={() => { setSaved(true); setTimeout(()=>setSaved(false), 1800); }}>
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function PatientProfile({ user, onSignOut }) {
  const [name, setName] = useStatePD(user?.name || 'Alex Morgan');
  const [email, setEmail] = useStatePD(user?.email || 'alex@morgan.com');
  const [phone, setPhone] = useStatePD('(949) 555-0182');
  const [remind, setRemind] = useStatePD(true);
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 className="h1" style={{ marginBottom: 8 }}>Profile & settings</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Your account, contact info and preferences.</p>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
          <MonoPD initials={user?.initials || 'AM'} variant="soft-mint" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{name}</div>
            <div className="muted" style={{ fontSize: 14 }}>Patient since {user?.since || 'Aug 2024'}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label className="label">Full name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 700 }}>Appointment reminders</div>
            <div className="muted" style={{ fontSize: 13 }}>SMS the day before each visit.</div>
          </div>
          <button className={`chip ${remind ? 'chip-active' : ''}`} onClick={() => setRemind(!remind)}>
            {remind ? 'On' : 'Off'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onSignOut}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

window.PatientDashboard = PatientDashboard;
