/* Mock data + icons + small helpers — exposed on window */

const ICONS = {
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.3 6.2 21l1.6-6.8L2.4 9.7l6.9-.6L12 2.6l2.7 6.5 6.9.6-5.4 4.5L17.8 21z"/></svg>',
  calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  inbox: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.5 5h13L22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Z"/></svg>',
  user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
  dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  ban: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
  users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  tooth: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c2.8 0 6 1.5 6 5 0 2-.5 3-1 4.5-.5 1.7-.5 3 0 5 .3 1.6-.5 4-2 4-1.7 0-1.5-3-3-3s-1.3 3-3 3c-1.5 0-2.3-2.4-2-4 .5-2 .5-3.3 0-5-.5-1.5-1-2.5-1-4.5 0-3.5 3.2-5 6-5Z"/></svg>',
  stethoscope: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2v6a4 4 0 0 1-8 0V2"/><path d="M7 12v3a6 6 0 0 0 12 0v-1"/><circle cx="19" cy="11" r="2.5"/></svg>',
  cog: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
  chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  signout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  message: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>',
};

/* ============ DENTISTS ============ */
const DENTISTS = [
  {
    id: 'd1', name: 'Dr. Maya Thompson', initials: 'MT', avatar: 'soft-mint',
    specialty: 'Family Dentistry', city: 'Irvine, CA', distance: '1.2 mi',
    rating: 4.9, reviews: 312,
    services: ['Dental Cleaning', 'New Patient Exam', 'Emergency Visit', 'X-ray Consultation'],
    languages: ['English', 'Spanish'], gender: 'Female',
    insurance: ['Delta Dental', 'Aetna', 'Cigna'], newPatients: true,
    next: ['Today 2:30', '3:15', '4:00'],
  },
  {
    id: 'd2', name: 'Dr. Lucas Chen', initials: 'LC', avatar: 'soft-blue',
    specialty: 'Cosmetic & General', city: 'Newport Beach, CA', distance: '4.6 mi',
    rating: 4.8, reviews: 188,
    services: ['Dental Cleaning', 'X-ray Consultation', 'Follow-up', 'Whitening'],
    languages: ['English', 'Mandarin'], gender: 'Male',
    insurance: ['Delta Dental', 'MetLife'], newPatients: true,
    next: ['Tomorrow 9:00', '10:30', '1:45'],
  },
  {
    id: 'd3', name: 'Dr. Ava Rodriguez', initials: 'AR', avatar: 'soft-sand',
    specialty: 'Pediatric Dentistry', city: 'Tustin, CA', distance: '3.1 mi',
    rating: 4.9, reviews: 256,
    services: ['New Patient Exam', 'Dental Cleaning', 'Follow-up'],
    languages: ['English', 'Spanish'], gender: 'Female',
    insurance: ['Aetna', 'Guardian', 'Delta Dental'], newPatients: true,
    next: ['Thu 11:30', '2:00', '4:30'],
  },
  {
    id: 'd4', name: 'Dr. Noah Patel', initials: 'NP', avatar: 'soft-lilac',
    specialty: 'Orthodontics', city: 'Irvine, CA', distance: '0.8 mi',
    rating: 4.7, reviews: 142,
    services: ['Orthodontic Consult', 'Aligners', 'Follow-up'],
    languages: ['English', 'Hindi'], gender: 'Male',
    insurance: ['Cigna', 'Delta Dental'], newPatients: false,
    next: ['Fri 10:00', '11:15', '3:30'],
  },
  {
    id: 'd5', name: 'Dr. Sofia Bennett', initials: 'SB', avatar: 'soft-rose',
    specialty: 'Cosmetic Dentistry', city: 'Costa Mesa, CA', distance: '5.4 mi',
    rating: 4.9, reviews: 401,
    services: ['Whitening', 'Veneers', 'Dental Cleaning'],
    languages: ['English'], gender: 'Female',
    insurance: ['MetLife', 'Aetna'], newPatients: true,
    next: ['Mon 9:30', '12:00', '2:45'],
  },
  {
    id: 'd6', name: 'Dr. Ethan Walker', initials: 'EW', avatar: 'soft-mint',
    specialty: 'General Dentistry', city: 'Irvine, CA', distance: '2.0 mi',
    rating: 4.8, reviews: 219,
    services: ['Dental Cleaning', 'Emergency Visit', 'Fillings'],
    languages: ['English'], gender: 'Male',
    insurance: ['Delta Dental', 'Aetna', 'Cigna', 'Guardian'], newPatients: true,
    next: ['Today 5:00', 'Tomorrow 8:30', '11:00'],
  },
];

/* ============ VISIT TYPES ============ */
const VISIT_TYPES = [
  { id: 'cleaning', name: 'Dental Cleaning', duration: 30, desc: 'Routine cleaning and polish.' },
  { id: 'newpt', name: 'New Patient Exam', duration: 60, desc: 'Full evaluation and X-rays.' },
  { id: 'urgent', name: 'Tooth Pain / Emergency', duration: 45, desc: 'Same-week urgent appointment.' },
  { id: 'whitening', name: 'Whitening', duration: 45, desc: 'In-office whitening session.' },
  { id: 'followup', name: 'Follow-up Visit', duration: 30, desc: 'Check-in for ongoing care.' },
];

/* ============ INITIAL APPOINTMENTS ============ */
const INITIAL_APPTS = [
  {
    id: 'a1', dentistId: 'd1', visitType: 'cleaning',
    date: 'May 22, 2026', time: '2:30 PM',
    status: 'confirmed', patient: 'You',
  },
  {
    id: 'a2', dentistId: 'd2', visitType: 'xray',
    visitName: 'X-ray Consultation',
    date: 'June 10, 2026', time: '9:00 AM',
    status: 'pending', patient: 'You',
  },
];

/* ============ DOCTOR SCHEDULE ============ */
const DOCTOR_SCHEDULE = [
  { time: '9:00 AM', patient: 'Sarah Kim', type: 'Dental Cleaning', status: 'confirmed' },
  { time: '10:30 AM', patient: 'Alex Nguyen', type: 'New Patient Exam', status: 'confirmed' },
  { time: '1:45 PM', patient: 'Priya Shah', type: 'Follow-up Visit', status: 'confirmed' },
  { time: '2:30 PM', patient: 'Jordan Lee', type: 'Tooth Pain', status: 'urgent' },
  { time: '3:30 PM', patient: 'Maria Lopez', type: 'Whitening', status: 'confirmed' },
  { time: '4:15 PM', patient: 'Daniel Ross', type: 'Cleaning', status: 'pending' },
];

/* ============ ADMIN APPOINTMENT TYPES ============ */
const ADMIN_APPT_TYPES = [
  { name: 'Dental Cleaning', min: 30, status: 'Active' },
  { name: 'New Patient Exam', min: 60, status: 'Active' },
  { name: 'Emergency Visit', min: 45, status: 'Urgent' },
  { name: 'Follow-up Visit', min: 30, status: 'Active' },
  { name: 'X-ray Consultation', min: 30, status: 'Active' },
];

const WEEKLY_DEMAND = [
  { d: 'M', v: 52 },
  { d: 'T', v: 78 },
  { d: 'W', v: 64 },
  { d: 'T', v: 96 },
  { d: 'F', v: 84 },
  { d: 'S', v: 38 },
  { d: 'S', v: 20 },
];

const PROVIDERS_LIST = [
  { id: 'd1', name: 'Dr. Maya Thompson', specialty: 'Family Dentistry', avatar: 'soft-mint', initials: 'MT', status: 'Active', patients: 412, rating: 4.9 },
  { id: 'd2', name: 'Dr. Lucas Chen', specialty: 'Cosmetic & General', avatar: 'soft-blue', initials: 'LC', status: 'Active', patients: 268, rating: 4.8 },
  { id: 'd3', name: 'Dr. Ava Rodriguez', specialty: 'Pediatric Dentistry', avatar: 'soft-sand', initials: 'AR', status: 'Active', patients: 351, rating: 4.9 },
  { id: 'd4', name: 'Dr. Noah Patel', specialty: 'Orthodontics', avatar: 'soft-lilac', initials: 'NP', status: 'Active', patients: 197, rating: 4.7 },
  { id: 'd5', name: 'Dr. Sofia Bennett', specialty: 'Cosmetic Dentistry', avatar: 'soft-rose', initials: 'SB', status: 'On Leave', patients: 460, rating: 4.9 },
  { id: 'd6', name: 'Dr. Ethan Walker', specialty: 'General Dentistry', avatar: 'soft-mint', initials: 'EW', status: 'Active', patients: 240, rating: 4.8 },
];

const INSURANCE_LIST = [
  { name: 'Delta Dental', accepted: true, members: 'Premier, PPO' },
  { name: 'Aetna', accepted: true, members: 'Dental PPO' },
  { name: 'Cigna', accepted: true, members: 'DPPO Advantage' },
  { name: 'MetLife', accepted: true, members: 'PDP' },
  { name: 'Guardian', accepted: true, members: 'Dental Guard' },
  { name: 'Humana', accepted: false, members: '—' },
];

const OFFICE_HOURS = [
  { d: 'Monday', open: '8:00 AM', close: '6:00 PM', active: true },
  { d: 'Tuesday', open: '8:00 AM', close: '6:00 PM', active: true },
  { d: 'Wednesday', open: '8:00 AM', close: '7:00 PM', active: true },
  { d: 'Thursday', open: '8:00 AM', close: '7:00 PM', active: true },
  { d: 'Friday', open: '8:00 AM', close: '4:00 PM', active: true },
  { d: 'Saturday', open: '9:00 AM', close: '1:00 PM', active: true },
  { d: 'Sunday', open: 'Closed', close: '—', active: false },
];

const MESSAGES_THREADS = [
  { id: 'm1', from: 'Bright Smiles — Front Desk', preview: 'Your insurance details look good. See you Friday!', time: '2h', unread: true },
  { id: 'm2', from: 'Dr. Maya Thompson', preview: 'Following up on your cleaning — let us know if anything feels off.', time: '1d', unread: false },
  { id: 'm3', from: 'Denta Reminders', preview: 'Your appointment is in 3 days. Tap to confirm.', time: '3d', unread: false },
];

/* Date helper for booking grid */
function genDates() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now = new Date(2026, 4, 20); // May 20, 2026
  const out = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({ dayName: days[d.getDay()], dayNum: d.getDate(), key: d.toISOString().slice(0,10) });
  }
  return out;
}
const BOOKING_DATES = genDates();
const BOOKING_TIMES = ['9:00', '10:30', '2:30', '4:00'];

window.Denta = {
  ICONS, DENTISTS, VISIT_TYPES, INITIAL_APPTS,
  DOCTOR_SCHEDULE, ADMIN_APPT_TYPES, WEEKLY_DEMAND,
  PROVIDERS_LIST, INSURANCE_LIST, OFFICE_HOURS, MESSAGES_THREADS,
  BOOKING_DATES, BOOKING_TIMES,
};
