"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);
  useEffect(() => {
    if (status === "authenticated") fetch("/api/settings").then(r => r.json()).then(setSettings);
  }, [status]);

  async function saveToken() {
    if (!token.trim()) { setError("Please enter a token"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ githubToken: token }) });
    if (res.ok) {
      setSaved(true); setToken("");
      setSettings(await (await fetch("/api/settings")).json());
      setTimeout(() => setSaved(false), 3000);
    } else setError("Failed to save token");
    setSaving(false);
  }

  if (!settings) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '2px solid var(--border-bright)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="anim-fade-up" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(59,130,246,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontWeight: '800', fontSize: '17px' }}>Driftlog</span>
          </div>
          <button className="btn-ghost" onClick={() => router.push("/dashboard")} style={{ padding: '8px 14px' }}>← dashboard</button>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="anim-fade-up" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.5px' }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your account and integrations</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Sidebar */}
          <div className="anim-fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[{ label: '🧑 Account', active: false }, { label: '🔗 GitHub', active: true }].map(item => (
              <div key={item.label} style={{
                padding: '10px 14px', borderRadius: '12px', fontFamily: 'Space Mono, monospace', fontSize: '12px', cursor: 'pointer',
                background: item.active ? 'var(--accent-glow)' : 'transparent',
                color: item.active ? '#3b82f6' : 'var(--text-muted)',
                border: `1px solid ${item.active ? 'rgba(59,130,246,0.2)' : 'transparent'}`,
              }}>
                {item.label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Account */}
            <div className="card anim-fade-up-2" style={{ padding: '28px' }}>
              <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '20px' }}>Account</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[{ label: 'NAME', value: settings.name }, { label: 'EMAIL', value: settings.email }].map((f, i) => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{f.label}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Token */}
            <div className="card anim-fade-up-3" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '6px' }}>GitHub Integration</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Personal access token to fetch repo data and detect drift</p>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', background: settings.hasGithubToken ? 'rgba(34,197,94,0.1)' : 'var(--surface-2)', border: `1px solid ${settings.hasGithubToken ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`, color: settings.hasGithubToken ? 'var(--green)' : 'var(--text-dim)' }}>
                  {settings.hasGithubToken ? '✓' : '○'}
                </div>
              </div>

              {settings.hasGithubToken && (
                <div className="anim-scale-in" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', marginBottom: '20px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <span className="dot-green" />
                  <div>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: '700', color: 'var(--green)', marginBottom: '2px' }}>Token active</p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{settings.githubTokenPreview}</p>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label className="label">{settings.hasGithubToken ? 'REPLACE TOKEN' : 'ADD TOKEN'}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      className="input-field"
                      type={showToken ? "text" : "password"}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      style={{ paddingRight: '40px' }}
                      onKeyDown={e => e.key === 'Enter' && saveToken()}
                    />
                    <button onClick={() => setShowToken(!showToken)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', fontSize: '14px' }}>
                      {showToken ? '◉' : '◎'}
                    </button>
                  </div>
                  <button
                    onClick={saveToken}
                    disabled={saving}
                    className={saved ? '' : 'btn-primary'}
                    style={{
                      padding: '12px 20px', borderRadius: '12px', fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                      ...(saved ? { background: 'rgba(34,197,94,0.1)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)' } : saving ? { background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' } : {})
                    }}>
                    {saved ? '✓ saved!' : saving ? 'saving...' : 'save token'}
                  </button>
                </div>
                {error && <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--red)', marginTop: '8px' }}>{error}</p>}
              </div>

              {/* How to guide */}
              <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '14px', letterSpacing: '0.05em' }}>HOW TO GET A GITHUB TOKEN</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Go to GitHub → Settings → Developer Settings',
                    'Click Personal Access Tokens → Tokens (classic)',
                    'Generate new token → select repo scope',
                    'Copy and paste it in the field above',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#3b82f6', fontWeight: '700', width: '16px', flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{step}</span>
                    </div>
                  ))}
                </div>
                <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: '700', color: '#3b82f6', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as any).style.color = '#60a5fa'}
                  onMouseLeave={e => (e.currentTarget as any).style.color = '#3b82f6'}>
                  Open GitHub token page ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
