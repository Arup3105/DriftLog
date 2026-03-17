"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); }
    else router.push("/login");
  }

  const fields = [
    { key: 'name', label: 'FULL NAME', placeholder: 'Your name', type: 'text' },
    { key: 'email', label: 'EMAIL ADDRESS', placeholder: 'you@example.com', type: 'email' },
    { key: 'password', label: 'PASSWORD', placeholder: '••••••••••', type: 'password' },
  ];

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '15%', right: '15%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="anim-fade-up" style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="anim-float">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 0 30px rgba(6,182,212,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>Driftlog</span>
          </div>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>PRODUCTION DRIFT DETECTION</p>
        </div>

        <div className="card anim-fade-up-2" style={{ padding: '36px', position: 'relative' }}>
          <div className="card-accent-top" style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #3b82f6, transparent)' }} />

          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>Create account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Start monitoring in minutes</p>

          {error && (
            <div className="anim-scale-in" style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', fontFamily: 'Space Mono, monospace', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✕</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {fields.map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input className="input-field" type={f.type} placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '14px', fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            {loading
              ? <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>creating account...</span>
              : "Create account →"}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: '#06b6d4', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
