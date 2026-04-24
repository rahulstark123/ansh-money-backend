export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>ANSH MONEY API</h1>
      <p>The backend is running successfully!</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Status: ✅ Online</h3>
        <p>Connected to Supabase Database</p>
      </div>
    </div>
  );
}
