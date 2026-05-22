/* App router + global state. */
const { useState: useStateApp, useEffect: useEffectApp } = React;
const { TopNav: TopNavApp, Toast: ToastApp } = window.DentaUI;

function App() {
  const [route, setRoute] = useStateApp({ name: 'home', params: {} });
  const [session, setSession] = useStateApp(null); // { role, name, initials, email }
  const [appointments, setAppointments] = useStateApp(window.Denta.INITIAL_APPTS);
  const [toast, setToast] = useStateApp(null);
  const [pendingBooking, setPendingBooking] = useStateApp(null); // resume after sign-in

  useEffectApp(() => { window.scrollTo({ top: 0 }); }, [route]);

  function go(name, params = {}) { setRoute({ name, params }); }

  function onSearch({ service, location }) {
    go('search', { service, location });
  }

  function onConfirmAppt(payload) {
    const id = 'a' + Date.now();
    const next = {
      id, dentistId: payload.dentistId,
      visitType: payload.visitType, visitName: payload.visitName,
      date: payload.date, time: payload.time,
      status: 'confirmed', patient: payload.patient,
      insurance: payload.insurance,
    };
    setAppointments(a => [next, ...a]);
    setToast('Appointment confirmed');
    setTimeout(() => {
      if (session?.role === 'patient') go('patient', { tab: 'appts' });
      else go('appointments');
    }, 1400);
  }

  function onCancelAppt(id) {
    setAppointments(a => a.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
    setToast('Appointment cancelled');
  }
  function onRescheduleAppt(id) {
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;
    go('booking', { dentistId: appt.dentistId });
  }

  function onSignInFromHome() { go('role'); }
  function onSignInPatientOnly() {
    setPendingBooking(route.params);
    go('login', { role: 'patient', patientOnly: true });
  }
  function onSignInForProviders() { go('login', { role: 'doctor' }); }
  function onRequireMyAppts() {
    if (session?.role === 'patient') go('patient', { tab: 'appts' });
    else go('login', { role: 'patient', returnTo: 'patient-appts' });
  }

  function onRolePick(role) { go('login', { role }); }

  function onLoginSuccess(role) {
    const profiles = {
      patient: { role: 'patient', name: 'Alex Morgan', initials: 'AM', email: 'alex@morgan.com', since: 'Aug 2024' },
      doctor: { role: 'doctor', name: 'Dr. Maya Thompson', initials: 'MT', email: 'maya@denta.com' },
      admin: { role: 'admin', name: 'Jamie Rivera', initials: 'JR', email: 'admin@denta.com' },
    };
    setSession(profiles[role]);
    setToast(`Signed in as ${role}`);

    if (role === 'patient' && pendingBooking?.dentistId) {
      const params = pendingBooking;
      setPendingBooking(null);
      go('booking', params);
      return;
    }
    if (role === 'patient' && route.params.returnTo === 'patient-appts') {
      go('patient', { tab: 'appts' });
      return;
    }
    if (role === 'patient') go('patient', { tab: 'find' });
    else if (role === 'doctor') go('doctor');
    else if (role === 'admin') go('admin');
  }

  function onSignup({ name, email }) {
    const initials = name.split(' ').map(s => s[0] || '').join('').slice(0, 2).toUpperCase() || 'AM';
    setSession({ role: 'patient', name, initials, email, since: 'Today' });
    setToast('Welcome to Denta');
    if (pendingBooking?.dentistId) {
      const p = pendingBooking;
      setPendingBooking(null);
      go('booking', p);
    } else {
      go('patient', { tab: 'find' });
    }
  }

  function onSignOut() {
    setSession(null);
    setToast('Signed out');
    go('home');
  }

  function onDashboard() {
    if (!session) return;
    if (session.role === 'patient') go('patient', { tab: 'find' });
    else if (session.role === 'doctor') go('doctor');
    else go('admin');
  }

  function onTopNav(id) {
    if (id === 'find') go('search', { service: '', location: 'Irvine, CA' });
    else if (id === 'appointments') onRequireMyAppts();
    else if (id === 'providers') onSignInForProviders();
  }

  function onDetails(id) { go('detail', { dentistId: id, from: route.name }); }
  function onBook(id) { go('booking', { dentistId: id }); }

  const PUBLIC_CHROME_ROUTES = ['home', 'search', 'booking', 'appointments', 'detail'];
  const showPublicChrome = PUBLIC_CHROME_ROUTES.includes(route.name);
  const activeNav = route.name === 'appointments' ? 'appointments'
                  : route.name === 'search' || route.name === 'detail' ? 'find'
                  : null;

  return (
    <div className="page">
      {showPublicChrome && (
        <TopNavApp
          active={activeNav}
          onNav={onTopNav}
          signedIn={!!session}
          onSignIn={onSignInFromHome}
          onDashboard={onDashboard}
          onSignOut={onSignOut}
        />
      )}

      {route.name === 'home' && (
        <HomeScreen onSearch={onSearch}
                    onSelectDentist={(id) => onBook(id)}
                    onViewDetails={onDetails} />
      )}

      {route.name === 'search' && (
        <SearchScreen
          query={{ service: route.params.service || '', location: route.params.location || 'Irvine, CA' }}
          onSearch={onSearch}
          onDetails={onDetails}
          onBook={onBook}
        />
      )}

      {route.name === 'detail' && (
        <DentistDetailScreen
          dentistId={route.params.dentistId}
          onBook={onBook}
          onBack={() => go(route.params.from === 'home' ? 'home' : 'search', { service: '', location: 'Irvine, CA' })}
        />
      )}

      {route.name === 'booking' && (
        <BookingScreen
          dentistId={route.params.dentistId}
          signedIn={!!session}
          onSignIn={onSignInPatientOnly}
          onConfirm={onConfirmAppt}
          onBack={() => go('detail', { dentistId: route.params.dentistId, from: 'search' })}
        />
      )}

      {route.name === 'appointments' && (
        <MyAppointmentsScreen
          appointments={appointments}
          onCancel={onCancelAppt}
          onReschedule={onRescheduleAppt}
          onBookNew={() => go('search', { service: '', location: 'Irvine, CA' })}
          onMessage={() => {
            if (session?.role === 'patient') go('patient', { tab: 'messages' });
            else go('login', { role: 'patient' });
          }}
        />
      )}

      {route.name === 'role' && (
        <RoleSelectScreen onPick={onRolePick} onBack={() => go('home')} />
      )}

      {route.name === 'login' && (
        <LoginScreen
          role={route.params.role}
          patientOnly={route.params.patientOnly}
          onSignIn={onLoginSuccess}
          onGoSignup={() => go('signup', { fromBooking: !!route.params.patientOnly })}
          onBack={() => {
            if (route.params.patientOnly && pendingBooking) go('booking', pendingBooking);
            else go('home');
          }}
        />
      )}

      {route.name === 'signup' && (
        <SignupScreen
          onSignup={onSignup}
          onGoSignin={() => go('login', { role: 'patient', patientOnly: !!route.params.fromBooking })}
          onBack={() => go('home')}
        />
      )}

      {route.name === 'patient' && session?.role === 'patient' && (
        <PatientDashboard
          initialTab={route.params.tab}
          appointments={appointments}
          user={session}
          onCancel={onCancelAppt}
          onReschedule={onRescheduleAppt}
          onBookFromHere={() => go('search', { service: '', location: 'Irvine, CA' })}
          onMessage={() => go('patient', { tab: 'messages' })}
          onSignOut={onSignOut}
          onDetails={onDetails}
          onBook={onBook}
        />
      )}

      {route.name === 'doctor' && session?.role === 'doctor' && (
        <DoctorDashboard onSignOut={onSignOut} sharedAppts={appointments} />
      )}

      {route.name === 'admin' && session?.role === 'admin' && (
        <AdminDashboard onSignOut={onSignOut} sharedAppts={appointments} />
      )}

      <ToastApp message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
