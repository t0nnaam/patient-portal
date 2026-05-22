/* Public-facing screens. */
const { useState: useStateP, useMemo: useMemoP, useEffect: useEffectP } = React;
const {
  Icon: IconP, Logo: LogoP, Mono: MonoP, TopNav: TopNavP,
  StatCard: StatCardP, Stepper: StepperP, Rating: RatingP,
  StatusPill: StatusPillP, DentistPhoto: DentistPhotoP,
} = window.DentaUI;
const D = window.Denta;

/* ============ HOME ============ */
function HomeScreen({ onSearch, onSelectDentist, onViewDetails }) {
  const [service, setService] = useStateP('Dental cleaning');
  const [location, setLocation] = useStateP('Irvine, CA');
  const chips = ['Dental Cleaning', 'New Patient Exam', 'Emergency Visit', 'Whitening', 'Follow-up'];

  return (
    <main className="container" style={{ padding: '60px 40px 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 60, alignItems: 'start' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            <span style={{ color: 'var(--mint-700)' }}>●</span> Free to use · No account needed to book
          </div>
          <h1 className="h1" style={{ fontSize: 56, marginBottom: 20 }}>
            Find a dentist<br/>you'll actually like.
          </h1>
          <p className="muted" style={{ fontSize: 17, maxWidth: 540, marginBottom: 32 }}>
            Search nearby dentists, compare availability, and book a verified
            appointment in minutes. Denta keeps scheduling simple for patients and practices.
          </p>

          <div className="searchbar" style={{ maxWidth: 640 }}>
            <div className="searchbar-field">
              <input value={service} onChange={e => setService(e.target.value)} placeholder="Dental service" />
            </div>
            <div className="searchbar-divider" />
            <div className="searchbar-field">
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or ZIP" />
            </div>
            <button className="btn btn-primary" onClick={() => onSearch({ service, location })}>
              Search
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18, maxWidth: 640 }}>
            {chips.map(c => (
              <button key={c} className="chip chip-hover" onClick={() => onSearch({ service: c, location })}>
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 48, marginTop: 64 }}>
            <div>
              <div className="h2" style={{ fontSize: 36 }}>24K+</div>
              <div className="muted" style={{ marginTop: 4 }}>appointments booked</div>
            </div>
            <div>
              <div className="h2" style={{ fontSize: 36 }}>4.9</div>
              <div className="muted" style={{ marginTop: 4 }}>average patient rating</div>
            </div>
            <div>
              <div className="h2" style={{ fontSize: 36 }}>1,200+</div>
              <div className="muted" style={{ marginTop: 4 }}>verified dentists</div>
            </div>
          </div>
        </div>

        <div className="card card-lg" style={{ padding: 28 }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: '22px 24px', marginBottom: 18 }}>
            <h3 className="h3" style={{ marginBottom: 6 }}>Top dentists near Irvine</h3>
            <div className="muted" style={{ fontSize: 14 }}>Verified providers, ready to book.</div>
          </div>

          {D.DENTISTS.slice(0, 4).map(d => (
            <div key={d.id} className="appt-row" style={{ padding: '16px 4px' }}>
              <MonoP initials={d.initials} variant={d.avatar} size="sm" />
              <div style={{ flex: 1, marginLeft: 12 }}>
                <div style={{ fontWeight: 700 }}>{d.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>{d.specialty} · {d.city}</div>
              </div>
              <button className="btn btn-primary btn-sm"
                      onClick={() => onViewDetails(d.id)}>View</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ============ FILTERS PANEL (shared between public + patient dashboard) ============ */
function FiltersPanel({ filters, setFilters, onClear }) {
  const SPECIALTIES = ['General Dentistry', 'Family Dentistry', 'Cosmetic Dentistry', 'Pediatric Dentistry', 'Orthodontics'];
  const LANGS = ['English', 'Spanish', 'Mandarin', 'Hindi'];
  const INSURERS = ['Delta Dental', 'Aetna', 'Cigna', 'MetLife', 'Guardian'];
  const SERVICES = ['Dental Cleaning', 'New Patient Exam', 'Emergency Visit', 'Whitening', 'Follow-up'];

  function toggle(group, val) {
    setFilters(f => {
      const cur = f[group];
      const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
      return { ...f, [group]: next };
    });
  }

  return (
    <div className="card filters-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 className="h4">Filters</h3>
        <button className="chip chip-sm chip-hover" onClick={onClear}>Clear</button>
      </div>

      <div className="filter-group">
        <div className="filter-label">Location</div>
        <input className="input" value={filters.locationText || ''}
               onChange={e => setFilters(f => ({ ...f, locationText: e.target.value }))}
               placeholder="City or ZIP" />
      </div>

      <div className="filter-group">
        <div className="filter-label">Dental service</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SERVICES.map(s => (
            <label key={s} className="filter-checkbox">
              <input type="checkbox" checked={filters.services.includes(s)} onChange={() => toggle('services', s)} />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Specialty</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SPECIALTIES.map(s => (
            <label key={s} className="filter-checkbox">
              <input type="checkbox" checked={filters.specialty.includes(s)} onChange={() => toggle('specialty', s)} />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Provider gender</div>
        <div className="filter-options">
          {['any', 'female', 'male'].map(g => (
            <span key={g}
                  className={`chip chip-sm chip-hover ${filters.gender === g ? 'chip-active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, gender: g }))}>
              {g === 'any' ? 'No preference' : g[0].toUpperCase() + g.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Languages</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {LANGS.map(l => (
            <label key={l} className="filter-checkbox">
              <input type="checkbox" checked={filters.languages.includes(l)} onChange={() => toggle('languages', l)} />
              {l}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Insurance</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {INSURERS.map(l => (
            <label key={l} className="filter-checkbox">
              <input type="checkbox" checked={filters.insurance.includes(l)} onChange={() => toggle('insurance', l)} />
              {l}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-checkbox">
          <input type="checkbox" checked={filters.newPatients}
                 onChange={() => setFilters(f => ({ ...f, newPatients: !f.newPatients }))} />
          <span style={{ fontWeight: 600 }}>Accepting new patients</span>
        </label>
      </div>
    </div>
  );
}

/* ============ DENTIST CARD (no times, Details + Book) ============ */
function DentistCard({ d, onDetails, onBook }) {
  return (
    <div className="dentist-card">
      <DentistPhotoP initials={d.initials} variant={d.avatar} />
      <div className="dentist-body">
        <div className="dentist-distance">{d.distance} away</div>
        <div>
          <div className="dentist-name">{d.name}</div>
          <div className="dentist-spec">{d.specialty} · {d.city}</div>
        </div>
        <RatingP value={d.rating} count={d.reviews} />
        <div className="dentist-meta">
          <strong>Services: </strong>
          <span className="muted">{d.services.slice(0, 3).join(' · ')}</span>
        </div>
        {d.newPatients && (
          <span className="chip chip-mint chip-sm" style={{ alignSelf: 'flex-start' }}>Accepting new patients</span>
        )}
      </div>
      <div className="card-footer" style={{ gap: 10 }}>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => onDetails(d.id)}>Details</button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onBook(d.id)}>Book</button>
      </div>
    </div>
  );
}

/* ============ SEARCH RESULTS ============ */
function emptyFilters(query) {
  return {
    locationText: query?.location || 'Irvine, CA',
    services: query?.service ? [query.service] : [],
    specialty: [],
    gender: 'any',
    languages: ['English'],
    insurance: [],
    newPatients: false,
  };
}

function applyFilters(filters) {
  return D.DENTISTS.filter(d => {
    if (filters.gender !== 'any' && d.gender.toLowerCase() !== filters.gender) return false;
    if (filters.newPatients && !d.newPatients) return false;
    if (filters.specialty.length && !filters.specialty.some(s => d.specialty.includes(s))) return false;
    if (filters.insurance.length && !filters.insurance.some(i => d.insurance.includes(i))) return false;
    if (filters.languages.length && !filters.languages.some(l => d.languages.includes(l))) return false;
    return true;
  });
}

function SearchScreen({ query, onSearch, onDetails, onBook, headerTitle = 'Find your next dental visit' }) {
  const [service, setService] = useStateP(query.service || '');
  const [location, setLocation] = useStateP(query.location || 'Irvine, CA');
  const [filters, setFilters] = useStateP(emptyFilters(query));
  const filtered = useMemoP(() => applyFilters(filters), [filters]);

  return (
    <main className="container" style={{ padding: '40px 40px 80px' }}>
      <h1 className="h1" style={{ marginBottom: 24 }}>{headerTitle}</h1>

      <div className="searchbar" style={{ maxWidth: 760, marginBottom: 32 }}>
        <div className="searchbar-field">
          <input value={service} onChange={e => setService(e.target.value)} placeholder="Dental service" />
        </div>
        <div className="searchbar-divider" />
        <div className="searchbar-field">
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or ZIP" />
        </div>
        <button className="btn btn-primary" onClick={() => onSearch({ service, location })}>Search</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }}>
        <FiltersPanel filters={filters} setFilters={setFilters} onClear={() => setFilters(emptyFilters({ location }))} />

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
              {filtered.map(d => (
                <DentistCard key={d.id} d={d} onDetails={onDetails} onBook={onBook} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ============ DENTIST DETAIL ============ */
function DentistDetailScreen({ dentistId, onBook, onBack }) {
  const d = D.DENTISTS.find(x => x.id === dentistId) || D.DENTISTS[0];

  const EDUCATION = {
    d1: ['DDS, UCLA School of Dentistry, 2014', 'BS, Biological Sciences, UC Irvine, 2010'],
    d2: ['DDS, USC Herman Ostrow, 2012', 'Cosmetic fellowship, Las Vegas Institute, 2014'],
    d3: ['DDS, NYU College of Dentistry, 2011', 'Pediatric residency, Children\'s Hospital LA, 2013'],
    d4: ['DDS, Columbia University, 2009', 'Orthodontic residency, UCSF, 2012'],
    d5: ['DDS, Loma Linda University, 2013', 'Aesthetic dentistry certificate, NYU, 2015'],
    d6: ['DDS, UC San Francisco, 2015', 'General practice residency, Long Beach VA, 2016'],
  };
  const ABOUT = `${d.name.split(' ').slice(1).join(' ')} is a ${d.specialty.toLowerCase()} dentist serving the ${d.city.split(',')[0]} area. Known for a calm chairside manner and unhurried visits, ${d.name.split(' ')[0]} ${d.name.split(' ')[1]} focuses on preventive care and clear, jargon-free explanations.`;

  return (
    <main className="container" style={{ padding: '40px 40px 80px' }}>
      <button className="topnav-link" onClick={onBack}
              style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'none', border: 'none' }}>
        ← Back to results
      </button>

      <div className="card card-lg" style={{ overflow: 'hidden', marginBottom: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0 }}>
          <div style={{ height: 320 }}>
            <DentistPhotoP initials={d.initials} variant={d.avatar} />
          </div>
          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="dentist-distance" style={{ marginBottom: 8 }}>{d.distance} away · {d.city}</div>
            <h1 className="h1" style={{ marginBottom: 6 }}>{d.name}</h1>
            <div className="muted" style={{ fontSize: 17, marginBottom: 14 }}>{d.specialty}</div>
            <div style={{ marginBottom: 18 }}><RatingP value={d.rating} count={d.reviews} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary btn-lg" onClick={() => onBook(d.id)}>Book appointment</button>
              <button className="btn btn-ghost btn-lg">Save</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: 28 }}>
            <h3 className="h3" style={{ marginBottom: 10 }}>About</h3>
            <p className="muted" style={{ lineHeight: 1.6 }}>{ABOUT}</p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 className="h3" style={{ marginBottom: 14 }}>Services offered</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.services.map(s => <span key={s} className="chip chip-sm">{s}</span>)}
            </div>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 className="h3" style={{ marginBottom: 14 }}>Education & training</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {(EDUCATION[d.id] || EDUCATION.d1).map((e, i) => (
                <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                  <span style={{ color: 'var(--mint-700)', fontWeight: 700 }}>•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: 28 }}>
            <h3 className="h4" style={{ marginBottom: 14 }}>Office</h3>
            <div className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
              Bright Smiles Dental<br/>
              4521 Jamboree Rd, Suite 200<br/>
              {d.city} 92660
            </div>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 className="h4" style={{ marginBottom: 14 }}>Office hours</h3>
            {D.OFFICE_HOURS.map(h => (
              <div key={h.d} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
                <span className="muted">{h.d.slice(0,3)}</span>
                <span style={{ fontWeight: 600 }}>{h.active ? `${h.open} – ${h.close}` : 'Closed'}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 className="h4" style={{ marginBottom: 12 }}>Languages</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {d.languages.map(l => <span key={l} className="chip chip-sm">{l}</span>)}
            </div>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 className="h4" style={{ marginBottom: 12 }}>Accepted insurance</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {d.insurance.map(i => <span key={i} className="chip chip-sm">{i}</span>)}
            </div>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 className="h4" style={{ marginBottom: 12 }}>Contact</h3>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              <div className="muted">Front desk</div>
              <div style={{ fontWeight: 600 }}>(949) 555-0188</div>
              <div className="muted" style={{ marginTop: 8 }}>Email</div>
              <div style={{ fontWeight: 600 }}>hello@brightsmiles.dental</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============ BOOKING (5 steps starting at visit type) ============ */
const BOOKING_STEPS = ['Visit type', 'Date & time', 'Patient info', 'Review', 'Confirm'];

function BookingScreen({ dentistId, signedIn, onSignIn, onConfirm, onBack }) {
  const dentist = D.DENTISTS.find(d => d.id === dentistId) || D.DENTISTS[0];
  const [step, setStep] = useStateP(0);
  const [visit, setVisit] = useStateP(D.VISIT_TYPES[0].id);
  const [pickedDate, setPickedDate] = useStateP(D.BOOKING_DATES[2].key);
  const [pickedTime, setPickedTime] = useStateP('2:30');
  const [patient, setPatient] = useStateP({ name: '', email: '', phone: '', dob: '', insurance: 'Delta Dental' });

  const visitObj = D.VISIT_TYPES.find(v => v.id === visit);
  const dateObj = D.BOOKING_DATES.find(d => d.key === pickedDate);

  function doConfirm() {
    onConfirm({
      dentistId: dentist.id,
      visitType: visit,
      visitName: visitObj.name,
      duration: visitObj.duration,
      date: `${dateObj.dayName} ${dateObj.dayNum}, 2026`,
      time: `${pickedTime} PM`,
      patient: patient.name || 'Guest patient',
      insurance: patient.insurance,
    });
  }

  return (
    <main className="container" style={{ padding: '40px 40px 80px' }}>
      <button className="topnav-link" onClick={onBack}
              style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'none', border: 'none' }}>
        ← Back
      </button>
      <h1 className="h1" style={{ marginBottom: 6 }}>Book an appointment</h1>
      <div className="muted" style={{ marginBottom: 28, fontSize: 16 }}>
        {dentist.name} · {visitObj.name} · {dentist.city}
      </div>

      <div style={{ marginBottom: 28 }}>
        <StepperP step={step} steps={BOOKING_STEPS} />
      </div>

      {step === 0 && (
        <div className="card-lg card" style={{ padding: 32, maxWidth: 720 }}>
          <h3 className="h3" style={{ marginBottom: 18 }}>Choose visit type</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {D.VISIT_TYPES.map(v => (
              <div key={v.id} className={`visit-card ${visit === v.id ? 'active' : ''}`}
                   onClick={() => setVisit(v.id)}>
                <div className="row">
                  <div className="name">{v.name}</div>
                  <div className="dur">{v.duration} min</div>
                </div>
                <div className="desc">{v.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={onBack}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(1)}>Continue</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card-lg card" style={{ padding: 32 }}>
          <h3 className="h3" style={{ marginBottom: 18 }}>Select a date and time</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
            {D.BOOKING_DATES.map(d => (
              <div key={d.key} className="date-col">
                <div className="dt-head">{d.dayName} {d.dayNum}</div>
                {D.BOOKING_TIMES.map(t => {
                  const isActive = pickedDate === d.key && pickedTime === t;
                  return (
                    <button key={t} className={`time-pill ${isActive ? 'active' : ''}`}
                            onClick={() => { setPickedDate(d.key); setPickedTime(t); }}>{t}</button>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(2)}>Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card-lg card" style={{ padding: 32, maxWidth: 760 }}>
          <h3 className="h3" style={{ marginBottom: 18 }}>Patient information</h3>
          {!signedIn && (
            <div className="section-tile" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Returning patient?</div>
                <div className="muted" style={{ fontSize: 13 }}>Sign in to pull in your details.</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={onSignIn}>Sign in</button>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Full name</label>
              <input className="input" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} placeholder="Alex Morgan" />
            </div>
            <div>
              <label className="label">Date of birth</label>
              <input className="input" value={patient.dob} onChange={e => setPatient({...patient, dob: e.target.value})} placeholder="MM / DD / YYYY" />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={patient.email} onChange={e => setPatient({...patient, email: e.target.value})} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} placeholder="(555) 555-5555" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Insurance</label>
              <select className="input" value={patient.insurance} onChange={e => setPatient({...patient, insurance: e.target.value})}>
                {['Delta Dental','Aetna','Cigna','MetLife','Guardian','Self-pay'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card-lg card" style={{ padding: 32, maxWidth: 720 }}>
          <h3 className="h3" style={{ marginBottom: 20 }}>Review your appointment</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Row label="Dentist" value={`${dentist.name} · ${dentist.specialty}`} />
            <Row label="Visit type" value={`${visitObj.name} · ${visitObj.duration} min`} />
            <Row label="Date & time" value={`${dateObj.dayName} ${dateObj.dayNum} at ${pickedTime}`} />
            <Row label="Location" value={dentist.city} />
            <Row label="Patient" value={patient.name || 'Guest patient'} />
            <Row label="Insurance" value={patient.insurance} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
            <button className="btn btn-primary" onClick={() => { setStep(4); setTimeout(doConfirm, 800); }}>
              Confirm booking
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card-lg card" style={{ padding: 48, maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--mint)', color: 'var(--mint-700)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <IconP name="check" style={{ width: 32, height: 32, transform: 'scale(2)' }} />
          </div>
          <h2 className="h2" style={{ marginBottom: 8 }}>You're booked!</h2>
          <p className="muted">Confirmation is on its way to your inbox.</p>
        </div>
      )}
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <span className="muted">{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ============ MY APPOINTMENTS ============ */
function MyAppointmentsScreen({ appointments, onCancel, onReschedule, onBookNew, onMessage }) {
  const [tab, setTab] = useStateP('upcoming');
  const list = appointments.filter(a => tab === 'upcoming' ? a.status !== 'cancelled' : a.status === 'cancelled');

  return (
    <main className="container" style={{ padding: '40px 40px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <h1 className="h1" style={{ marginBottom: 6 }}>My appointments</h1>
          <div className="muted">Your visits, all in one place.</div>
        </div>
        <button className="btn btn-primary" onClick={onBookNew}>Book new appointment</button>
      </div>

      <div className="tabs" style={{ margin: '18px 0 28px' }}>
        {[['upcoming','Upcoming'], ['past','Past'], ['cancelled','Cancelled']].map(([id,lbl]) => (
          <span key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{lbl}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.length === 0 && (
            <div className="card" style={{ padding: 28, textAlign: 'center' }}>
              <div className="muted">No appointments yet.</div>
            </div>
          )}
          {list.map(a => {
            const dentist = D.DENTISTS.find(d => d.id === a.dentistId);
            return (
              <div key={a.id} className="card" style={{ padding: 22, display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 16, alignItems: 'center' }}>
                <div>
                  <div className="h4">{a.date}</div>
                  <div className="muted" style={{ marginTop: 4 }}>{a.time}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{dentist?.name}</div>
                  <div className="muted">{a.visitName || D.VISIT_TYPES.find(v => v.id === a.visitType)?.name || 'Visit'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <StatusPillP status={a.status} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => onReschedule(a.id)}>Reschedule</button>
                    <button className="btn btn-soft btn-sm" onClick={() => onCancel(a.id)}>Cancel</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 className="h4" style={{ marginBottom: 8 }}>Need help?</h3>
          <p className="muted" style={{ fontSize: 14 }}>
            Message the office, update insurance, or manage reminders from one calm place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary" onClick={onMessage}>Message office</button>
            <button className="btn btn-ghost">Update insurance</button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============ ROLE SELECT ============ */
function RoleSelectScreen({ onPick, onBack }) {
  const roles = [
    { id: 'patient', label: 'Patient', desc: 'Book and manage dental appointments', icon: 'user' },
    { id: 'doctor', label: 'Doctor', desc: 'View schedule and patients', icon: 'stethoscope' },
    { id: 'admin', label: 'Administrator', desc: 'Manage practice and users', icon: 'cog' },
  ];
  return (
    <div className="role-page">
      <div style={{ width: '100%', maxWidth: 1000, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--navy)', fontWeight: 800, fontSize: 24, marginBottom: 22 }}>D</div>
        <h1 className="h1" style={{ color: '#fff', fontSize: 44, marginBottom: 10 }}>Denta</h1>
        <p style={{ color: '#B6C2D2', marginBottom: 40, fontSize: 16 }}>Select your role to continue</p>
        <div className="grid-3" style={{ maxWidth: 900, margin: '0 auto' }}>
          {roles.map(r => (
            <div key={r.id} className="role-card" onClick={() => onPick(r.id)}>
              <div className="role-icon"><IconP name={r.icon} /></div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{r.label}</div>
              <div className="muted" style={{ fontSize: 14 }}>{r.desc}</div>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{ marginTop: 36, color: '#B6C2D2', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
          ← Back to Denta
        </button>
      </div>
    </div>
  );
}

/* ============ LOGIN ============ */
function LoginScreen({ role, patientOnly, onSignIn, onBack, onGoSignup }) {
  const [email, setEmail] = useStateP(role === 'patient' ? 'alex@morgan.com' : role === 'doctor' ? 'maya@denta.com' : 'admin@denta.com');
  const [password, setPassword] = useStateP('••••••••');
  const titleMap = { patient: 'Patient sign in', doctor: 'Doctor sign in', admin: 'Administrator sign in' };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <LogoP />
        <h2 className="h2" style={{ marginTop: 22, marginBottom: 6 }}>{titleMap[role] || 'Sign in'}</h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          {patientOnly ? 'Sign in to continue booking.' : 'Welcome back. Enter your details.'}
        </p>
        <label className="label">Email</label>
        <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
        <div style={{ height: 14 }} />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 22 }}
                onClick={() => onSignIn(role)}>Sign in</button>
        {role === 'patient' && (
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
            <span className="muted">New to Denta? </span>
            <a onClick={onGoSignup} style={{ cursor: 'pointer', fontWeight: 600 }}>Create an account</a>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <a className="muted" onClick={onBack} style={{ cursor: 'pointer', fontSize: 13 }}>← Back</a>
        </div>
      </div>
    </div>
  );
}

/* ============ SIGN UP (patient) ============ */
function SignupScreen({ onSignup, onBack, onGoSignin }) {
  const [form, setForm] = useStateP({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useStateP('');

  function submit() {
    if (!form.name || !form.email || !form.phone) return setError('Please fill in name, email, and phone.');
    if (!form.password || form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords don\'t match.');
    setError('');
    onSignup({ name: form.name, email: form.email });
  }

  function f(key) {
    return { value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) };
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <LogoP />
        <h2 className="h2" style={{ marginTop: 22, marginBottom: 6 }}>Create your patient account</h2>
        <p className="muted" style={{ marginBottom: 24 }}>Book, message your office, and track visits in one place.</p>

        <label className="label">Full name</label>
        <input className="input" placeholder="Alex Morgan" {...f('name')} />
        <div style={{ height: 12 }} />
        <label className="label">Email</label>
        <input className="input" placeholder="you@example.com" {...f('email')} />
        <div style={{ height: 12 }} />
        <label className="label">Phone</label>
        <input className="input" placeholder="(555) 555-5555" {...f('phone')} />
        <div style={{ height: 12 }} />
        <label className="label">Password</label>
        <input className="input" type="password" placeholder="At least 6 characters" {...f('password')} />
        <div style={{ height: 12 }} />
        <label className="label">Confirm password</label>
        <input className="input" type="password" {...f('confirm')} />

        {error && <div style={{ color: '#A23A3A', fontSize: 13, marginTop: 12 }}>{error}</div>}

        <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 22 }} onClick={submit}>
          Create account
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
          <span className="muted">Already have an account? </span>
          <a onClick={onGoSignin} style={{ cursor: 'pointer', fontWeight: 600 }}>Sign in</a>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <a className="muted" onClick={onBack} style={{ cursor: 'pointer', fontSize: 13 }}>← Back to Denta</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, SearchScreen, DentistDetailScreen, BookingScreen, MyAppointmentsScreen,
  RoleSelectScreen, LoginScreen, SignupScreen,
  DentaSearchPanels: { FiltersPanel, DentistCard, emptyFilters, applyFilters },
});
