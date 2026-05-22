/* Doctor dashboard */
const { useState: useStateDD } = React;
const {
  Icon: IconDD, Mono: MonoDD, Sidebar: SidebarDD,
  StatCard: StatCardDD, StatusPill: StatusPillDD,
} = window.DentaUI;
const DDD = window.Denta;

function DoctorDashboard({ onSignOut, sharedAppts }) {
  const [tab, setTab] = useStateDD('dashboard');
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'availability', label: 'Availability', icon: 'clock' },
    { id: 'timeoff', label: 'Block time off', icon: 'ban' },
    { id: 'patients', label: 'Patient details', icon: 'users' },
    { id: 'messages', label: 'Messages', icon: 'message' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  const user = { name: 'Dr. Maya Thompson', initials: 'MT', role: 'Doctor' };
  return (
    <div className="shell">
      <SidebarDD items={items} active={tab} onChange={setTab} user={user} onSignOut={onSignOut} />
      <main className="shell-main">
        {tab === 'dashboard' && <DoctorOverview sharedAppts={sharedAppts} />}
        {tab === 'appointments' && <DoctorAppointments sharedAppts={sharedAppts} />}
        {tab === 'availability' && <DoctorAvailability />}
        {tab === 'timeoff' && <DoctorTimeOff />}
        {tab === 'patients' && <DoctorPatients />}
        {tab === 'messages' && <DoctorMessages />}
        {tab === 'settings' && <DoctorSettings onSignOut={onSignOut} />}
      </main>
    </div>
  );
}

function DoctorOverview({ sharedAppts }) {
  const newCount = (sharedAppts || []).filter(a => a.status !== 'cancelled').length;
  return (
    <div>
      <h1 className="h1" style={{ marginBottom: 4 }}>Provider schedule</h1>
      <p className="muted" style={{ marginBottom: 28 }}>Today · {6 + newCount} appointments · 2 pending requests</p>
      <div className="grid-4" style={{ marginBottom: 22 }}>
        <StatCardDD num={String(6 + newCount)} label="Today's appointments" />
        <StatCardDD num="2" label="Pending requests" />
        <StatCardDD num="96%" label="Schedule fill" />
        <StatCardDD num="4.9" label="Patient rating" />
      </div>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="h3">Upcoming today</h3>
          <span className="muted" style={{ fontSize: 13 }}>Tue, May 20</span>
        </div>
        <ApptList sharedAppts={sharedAppts} />
      </div>
    </div>
  );
}

function ApptList({ markable, sharedAppts }) {
  const newOnes = (sharedAppts || [])
    .filter(a => a.dentistId === 'd1' && a.status !== 'cancelled')
    .map(a => ({
      time: a.time, patient: a.patient || 'New patient',
      type: a.visitName || 'Visit', status: a.status, isNew: true,
    }));
  const list = [...newOnes, ...DDD.DOCTOR_SCHEDULE];
  const [statuses, setStatuses] = useStateDD(
    Object.fromEntries(list.map((a, i) => [i, a.status]))
  );
  React.useEffect(() => {
    setStatuses(Object.fromEntries(list.map((a, i) => [i, a.status])));
  }, [newOnes.length]);

  return (
    <div>
      {list.map((a, i) => (
        <div key={i} className="appt-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, flex: 1 }}>
            <div className="appt-time tnum">{a.time}</div>
            <MonoDD initials={a.patient.split(' ').map(s => s[0]).join('').slice(0,2)} variant={['soft-blue','soft-mint','soft-sand','soft-rose','soft-lilac'][i % 5]} size="sm" />
            <div>
              <div className="appt-patient">{a.patient} {a.isNew && <span className="chip chip-mint chip-sm" style={{ marginLeft: 6 }}>New</span>}</div>
              <div className="appt-type">{a.type}</div>
            </div>
          </div>
          {markable ? (
            <div style={{ display: 'flex', gap: 6 }}>
              {['confirmed','pending','urgent','completed'].map(s => (
                <button key={s}
                        className={`chip chip-sm ${statuses[i] === s ? (s === 'urgent' ? 'chip-warn' : 'chip-active') : ''}`}
                        onClick={() => setStatuses(st => ({ ...st, [i]: s }))}>
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <StatusPillDD status={statuses[i]} />
          )}
        </div>
      ))}
    </div>
  );
}

function DoctorAppointments({ sharedAppts }) {
  return (
    <div>
      <h1 className="h1" style={{ marginBottom: 8 }}>Appointments</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Mark each visit's status as you go.</p>
      <div className="card" style={{ padding: 28 }}>
        <ApptList markable sharedAppts={sharedAppts} />
      </div>
    </div>
  );
}

function DoctorAvailability() {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const [hours, setHours] = useStateDD(DDD.OFFICE_HOURS.map(h => ({...h})));
  function toggle(i) {
    setHours(arr => arr.map((h, idx) => idx === i ? { ...h, active: !h.active } : h));
  }
  function setVal(i, key, val) {
    setHours(arr => arr.map((h, idx) => idx === i ? { ...h, [key]: val } : h));
  }
  return (
    <div style={{ maxWidth: 880 }}>
      <h1 className="h1" style={{ marginBottom: 8 }}>Availability</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Edit your weekly working hours.</p>
      <div className="card" style={{ padding: 8 }}>
        {hours.map((h, i) => (
          <div key={h.d} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 100px', gap: 14, padding: '14px 20px', borderBottom: i < hours.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
            <div style={{ fontWeight: 600 }}>{h.d}</div>
            <input className="input" value={h.open} disabled={!h.active} onChange={e => setVal(i, 'open', e.target.value)} />
            <input className="input" value={h.close} disabled={!h.active} onChange={e => setVal(i, 'close', e.target.value)} />
            <button className={`chip ${h.active ? 'chip-active' : ''}`} onClick={() => toggle(i)}>
              {h.active ? 'Open' : 'Closed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorTimeOff() {
  const [blocks, setBlocks] = useStateDD([
    { id: 'b1', start: 'Jun 4, 2026', end: 'Jun 6, 2026', reason: 'Conference' },
    { id: 'b2', start: 'Jul 22, 2026', end: 'Jul 26, 2026', reason: 'Vacation' },
  ]);
  const [draft, setDraft] = useStateDD({ start: '', end: '', reason: '' });
  function add() {
    if (!draft.start || !draft.end) return;
    setBlocks(b => [...b, { id: 'b' + Date.now(), ...draft }]);
    setDraft({ start: '', end: '', reason: '' });
  }
  return (
    <div style={{ maxWidth: 780 }}>
      <h1 className="h1" style={{ marginBottom: 8 }}>Block time off</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Keep appointments away from days you're unavailable.</p>
      <div className="card" style={{ padding: 24, marginBottom: 22 }}>
        <h3 className="h4" style={{ marginBottom: 14 }}>Add a new block</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr auto', gap: 12, alignItems: 'end' }}>
          <div><label className="label">Start</label><input className="input" value={draft.start} placeholder="MM / DD / YYYY" onChange={e => setDraft({...draft, start: e.target.value})} /></div>
          <div><label className="label">End</label><input className="input" value={draft.end} placeholder="MM / DD / YYYY" onChange={e => setDraft({...draft, end: e.target.value})} /></div>
          <div><label className="label">Reason</label><input className="input" value={draft.reason} placeholder="Vacation, training…" onChange={e => setDraft({...draft, reason: e.target.value})} /></div>
          <button className="btn btn-primary" onClick={add}>Add block</button>
        </div>
      </div>
      <div className="card" style={{ padding: 8 }}>
        {blocks.map((b, i) => (
          <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr auto', gap: 12, padding: '16px 20px', borderBottom: i < blocks.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
            <div>{b.start}</div>
            <div>{b.end}</div>
            <div className="muted">{b.reason}</div>
            <button className="btn btn-soft btn-sm" onClick={() => setBlocks(arr => arr.filter(x => x.id !== b.id))}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorPatients() {
  const patients = [
    { id: 'p1', name: 'Sarah Kim', last: 'May 6, 2026', visits: 8, plan: 'Routine cleanings every 6 mo', initials: 'SK', avatar: 'soft-rose' },
    { id: 'p2', name: 'Alex Nguyen', last: 'New patient', visits: 0, plan: 'New patient exam scheduled', initials: 'AN', avatar: 'soft-blue' },
    { id: 'p3', name: 'Priya Shah', last: 'Apr 18, 2026', visits: 5, plan: 'Follow-up on filling', initials: 'PS', avatar: 'soft-mint' },
    { id: 'p4', name: 'Jordan Lee', last: 'May 20, 2026', visits: 2, plan: 'Urgent tooth pain — eval needed', initials: 'JL', avatar: 'soft-sand' },
  ];
  const [sel, setSel] = useStateDD(patients[0].id);
  const p = patients.find(x => x.id === sel);
  return (
    <div>
      <h1 className="h1" style={{ marginBottom: 8 }}>Patient details</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Quick context for the people on today's schedule.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        <div className="card" style={{ padding: 12 }}>
          {patients.map(pp => (
            <div key={pp.id} onClick={() => setSel(pp.id)}
                 style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, cursor: 'pointer',
                          background: sel === pp.id ? 'var(--surface-2)' : 'transparent' }}>
              <MonoDD initials={pp.initials} variant={pp.avatar} size="sm" />
              <div>
                <div style={{ fontWeight: 700 }}>{pp.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>Last visit: {pp.last}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <MonoDD initials={p.initials} variant={p.avatar} />
            <div>
              <h3 className="h3">{p.name}</h3>
              <div className="muted">Last visit: {p.last} · {p.visits} total visits</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
            <Field label="Insurance" value="Delta Dental PPO" />
            <Field label="Date of birth" value="03 / 14 / 1992" />
            <Field label="Phone" value="(949) 555-0182" />
            <Field label="Email" value={`${p.name.split(' ')[0].toLowerCase()}@example.com`} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Care plan" value={p.plan} />
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-sm">Open chart</button>
            <button className="btn btn-ghost btn-sm">Add note</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function DoctorMessages() {
  const threads = [
    { id: 't1', from: 'Sarah Kim', preview: 'Hi Dr. Thompson — quick question about my cleaning…', time: '1h', unread: true },
    { id: 't2', from: 'Alex Nguyen', preview: 'Thanks for the new patient packet!', time: '4h', unread: true },
    { id: 't3', from: 'Front desk', preview: 'Jordan Lee called about an urgent visit.', time: '1d', unread: false },
  ];
  const [sel, setSel] = useStateDD('t1');
  const [text, setText] = useStateDD('');
  const [msgs, setMsgs] = useStateDD([
    { from: 'them', body: 'Hi Dr. Thompson — quick question about my cleaning on Friday. Should I take ibuprofen before?' },
    { from: 'me', body: 'Hi Sarah — no need to pre-medicate for a routine cleaning. See you Friday!' },
  ]);
  function send() {
    if (!text.trim()) return;
    setMsgs(m => [...m, { from: 'me', body: text.trim() }]);
    setText('');
  }
  return (
    <div>
      <h1 className="h1" style={{ marginBottom: 8 }}>Messages</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Reply to your patients here.</p>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 480 }}>
        <div style={{ borderRight: '1px solid var(--border)', padding: 12 }}>
          {threads.map(t => (
            <div key={t.id} onClick={() => setSel(t.id)}
                 style={{ padding: 14, borderRadius: 12, cursor: 'pointer',
                          background: sel === t.id ? 'var(--surface-2)' : 'transparent' }}>
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
            <div style={{ fontWeight: 700 }}>{threads.find(t => t.id === sel)?.from}</div>
            <div className="muted" style={{ fontSize: 13 }}>Patient</div>
          </div>
          <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
            {msgs.map((m, i) => (
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
                   onKeyDown={e => e.key === 'Enter' && send()} placeholder="Write a reply…" />
            <button className="btn btn-primary" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorSettings({ onSignOut }) {
  const [autoConfirm, setAutoConfirm] = useStateDD(true);
  const [notify, setNotify] = useStateDD(true);
  return (
    <div style={{ maxWidth: 700 }}>
      <h1 className="h1" style={{ marginBottom: 22 }}>Settings</h1>
      <div className="card" style={{ padding: 28 }}>
        <Toggle label="Auto-confirm cleaning bookings" desc="Routine cleanings won't need manual approval." value={autoConfirm} onChange={() => setAutoConfirm(!autoConfirm)} />
        <Toggle label="Notify me of urgent visits" desc="SMS alert when an emergency visit lands on the day's schedule." value={notify} onChange={() => setNotify(!notify)} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={onSignOut}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 700 }}>{label}</div>
        <div className="muted" style={{ fontSize: 13 }}>{desc}</div>
      </div>
      <button className={`chip ${value ? 'chip-active' : ''}`} onClick={onChange}>{value ? 'On' : 'Off'}</button>
    </div>
  );
}

window.DoctorDashboard = DoctorDashboard;
