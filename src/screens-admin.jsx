const { useState: useStateAdmin } = React;

function AdminDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1 className="h1">Admin</h1>
      <p className="muted">Admin tools coming soon. This is a lightweight placeholder to avoid script 404s during development.</p>
    </div>
  );
}

window.AdminDashboard = AdminDashboard;
