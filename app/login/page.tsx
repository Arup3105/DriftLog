"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true); setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    if (res?.error) { setError("Invalid email or password"); setLoading(false); }
    else router.push("/dashboard");
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="anim-fade-up" style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="anim-fade-up">
          <div className="anim-float" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 30px rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>Driftlog</span>
          </div>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>PRODUCTION DRIFT DETECTION</p>
        </div>

        {/* Card */}
        <div className="card anim-fade-up-2" style={{ padding: '36px', position: 'relative' }}>
          <div className="card-accent-top" style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, #06b6d4, transparent)' }} />

          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Sign in to monitor your repos</p>

          {error && (
            <div className="anim-scale-in" style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', fontFamily: 'Space Mono, monospace', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✕</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="label">EMAIL ADDRESS</label>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div>
              <label className="label">PASSWORD</label>
              <input className="input-field" type="password" placeholder="••••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '14px', fontFamily: 'Syne, sans-serif' }}>
            {loading
              ? <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>authenticating...</span>
              : "Sign in →"}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
            No account?{" "}
            <a href="/register" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}
              onMouseEnter={e => (e.target as any).style.color = '#60a5fa'}
              onMouseLeave={e => (e.target as any).style.color = '#3b82f6'}>
              Create one
            </a>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-dim)' }}>
          v0.1.0 · built with Next.js + MongoDB + Docker
        </p>
      </div>
    </div>
  );
}
