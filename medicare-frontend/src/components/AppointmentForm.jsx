import AppointmentForm from "./AppointmentForm";

export default function PatientDashboard({ token }) {
  return (
    <div>
      <h2>Patient Dashboard</h2>
      <AppointmentForm token={token} />
      {/* ...existing appointments list here... */}
    </div>
  );
}
