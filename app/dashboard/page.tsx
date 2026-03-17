"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface FileDiff { path: string; status: "added" | "removed" | "modified"; }
interface DriftLog {
  status: string; driftedFiles: FileDiff[]; totalFiles: number;
  behindBy: number; currentCommitSHA: string; deployedCommitSHA: string; checkedAt: string;
}
interface Repo {
  _id: string; fullName: string; branch: string;
  driftStatus: "clean" | "drifted" | "unknown"; lastChecked?: string;
}

function StatusDot({ status }: { status: string }) {
  if (status === "clean") return <span className="dot-green" />;
  if (status === "drifted") return <span className="dot-red" />;
  return <span className="dot-gray" />;
}

function FileBadge({ status }: { status: string }) {
  const cfg: any = {
    added:    { icon: '+', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)' },
    removed:  { icon: '−', color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)' },
    modified: { icon: '~', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  };
  const c = cfg[status] || cfg.modified;
  return (
    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '8px', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {c.icon} {status}
    </span>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ owner: "", name: "", branch: "main" });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
  const [driftLogs, setDriftLogs] = useState<Record<string, DriftLog>>({});

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);
  useEffect(() => { if (status === "authenticated") fetchRepos(); }, [status]);

  async function fetchRepos() {
    const res = await fetch("/api/repos");
    setRepos(await res.json());
    setLoading(false);
  }
  async function fetchDriftLog(repoId: string) {
    const res = await fetch(`/api/drift/logs?repoId=${repoId}`);
    const data = res.ok ? await res.json() : null;
    setDriftLogs(p => ({ ...p, [repoId]: data }));
  }
  async function toggleExpand(repoId: string) {
    if (expandedRepo === repoId) { setExpandedRepo(null); return; }
    setExpandedRepo(repoId);
    if (!driftLogs[repoId]) await fetchDriftLog(repoId);
  }
  async function checkDrift(repoId: string) {
    setChecking(repoId);
    await fetch("/api/drift/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repoId }) });
    await fetchRepos();
    await fetchDriftLog(repoId);
    setExpandedRepo(repoId);
    setChecking(null);
  }
  async function markDeployed(repoId: string) {
    await fetch("/api/drift/snapshot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repoId }) });
    await fetchRepos();
    setDriftLogs(p => { const u = { ...p }; delete u[repoId]; return u; });
    setExpandedRepo(null);
  }
  async function addRepo() {
    setAdding(true); setAddError("");
    const res = await fetch("/api/repos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) { const d = await res.json(); setAddError(d.error || "Failed"); setAdding(false); return; }
    setShowAdd(false); setForm({ owner: "", name: "", branch: "main" });
    await fetchRepos(); setAdding(false);
  }

  const driftedCount = repos.filter(r => r.driftStatus === "drifted").length;
  const cleanCount = repos.filter(r => r.driftStatus === "clean").length;
  const unknownCount = repos.filter(r => r.driftStatus === "unknown").length;

  if (status === "loading" || loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid var(--border-bright)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>initializing...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Nav ─────────────────────────────────────── */}
      <header className="anim-fade-up" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(59,130,246,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontWeight: '800', fontSize: '17px', letterSpacing: '-0.3px' }}>Driftlog</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>v0.1.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{session?.user?.email}</span>
            <button className="btn-ghost" onClick={() => router.push("/settings")} style={{ padding: '8px 14px' }}>⚙ settings</button>
            <button className="btn-danger-ghost" onClick={() => signOut()} style={{ padding: '8px 14px' }}>⎋ sign out</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* ── Page header ─────────────────────────── */}
        <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.5px' }}>Overview</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Monitoring <strong style={{ color: 'var(--text)' }}>{repos.length}</strong> repo{repos.length !== 1 ? 's' : ''} for production drift
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ padding: '12px 20px', fontSize: '14px', fontFamily: 'Syne, sans-serif' }}>
            + Add Repo
          </button>
        </div>

        {/* ── Stat cards ──────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'TOTAL REPOS', value: repos.length,  color: '#3b82f6', glow: 'rgba(59,130,246,0.1)',  icon: '◈', delay: '0.05s' },
            { label: 'DRIFTED',     value: driftedCount,  color: '#ef4444', glow: 'rgba(239,68,68,0.12)', icon: '⚠', delay: '0.10s' },
            { label: 'CLEAN',       value: cleanCount,    color: '#22c55e', glow: 'rgba(34,197,94,0.1)',  icon: '✓', delay: '0.15s' },
            { label: 'UNKNOWN',     value: unknownCount,  color: '#64748b', glow: 'rgba(100,116,139,0.08)',icon: '?', delay: '0.20s' },
          ].map(s => (
            <div key={s.label} className="card card-hover anim-count"
              style={{ padding: '24px', position: 'relative', overflow: 'hidden', animationDelay: s.delay }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at top left, ${s.glow}, transparent 60%)`, pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{s.label}</span>
                  <span style={{ color: s.color, opacity: 0.5, fontSize: '18px' }}>{s.icon}</span>
                </div>
                <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${s.color}40, transparent)` }} />
            </div>
          ))}
        </div>

        {/* ── Add repo form ────────────────────────── */}
        {showAdd && (
          <div className="anim-expand-down" style={{ marginBottom: '24px', padding: '28px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid rgba(59,130,246,0.4)', boxShadow: '0 0 40px rgba(59,130,246,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Add GitHub Repository</h3>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>Enter the details of the repo you want to monitor</p>
              </div>
              <button className="btn-ghost" onClick={() => { setShowAdd(false); setAddError(""); }} style={{ padding: '8px 14px' }}>✕ cancel</button>
            </div>

            {addError && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
                ✕ {addError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { key: 'owner', label: 'OWNER', placeholder: 'e.g. Arup3105' },
                { key: 'name', label: 'REPO NAME', placeholder: 'e.g. CollegePlacementPortal' },
                { key: 'branch', label: 'BRANCH', placeholder: 'main' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input className="input-field" placeholder={f.placeholder}
                    value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={addRepo} disabled={adding} style={{ padding: '12px 24px', fontSize: '14px', fontFamily: 'Syne, sans-serif' }}>
              {adding ? <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>adding repo...</span> : "Add Repository"}
            </button>
          </div>
        )}

        {/* ── Repos section ───────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }} className="anim-fade-up-3">
          <h2 style={{ fontWeight: '800', fontSize: '16px', whiteSpace: 'nowrap' }}>Repositories</h2>
          <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{repos.length} total</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {repos.length === 0 ? (
            <div className="anim-fade-up" style={{ textAlign: 'center', padding: '80px 24px', borderRadius: '20px', border: '1px dashed var(--border)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>◈</div>
              <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>No repos yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Add a GitHub repo to start detecting drift</p>
            </div>
          ) : repos.map((repo, idx) => {
            const isExpanded = expandedRepo === repo._id;
            const log = driftLogs[repo._id];
            const isChecking = checking === repo._id;

            const borderColor = repo.driftStatus === 'drifted'
              ? 'rgba(239,68,68,0.35)' : repo.driftStatus === 'clean'
              ? 'rgba(34,197,94,0.25)' : 'var(--border)';
            const glowColor = repo.driftStatus === 'drifted'
              ? '0 4px 30px rgba(239,68,68,0.08)' : repo.driftStatus === 'clean'
              ? '0 4px 30px rgba(34,197,94,0.06)' : 'none';

            return (
              <div key={repo._id} className="anim-fade-up card-hover"
                style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--surface)', border: `1px solid ${borderColor}`, boxShadow: glowColor, animationDelay: `${idx * 0.05}s`, transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }}>

                {/* Repo row */}
                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <StatusDot status={repo.driftStatus} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: '700', fontSize: '14px' }}>{repo.fullName}</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        {repo.branch}
                      </span>
                      {repo.driftStatus === 'drifted' && (
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.25)' }}>
                          ⚠ DRIFTED
                        </span>
                      )}
                      {repo.driftStatus === 'clean' && (
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.25)' }}>
                          ✓ CLEAN
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {repo.lastChecked ? `last checked ${formatDistanceToNow(new Date(repo.lastChecked))} ago` : 'never checked'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button className="btn-ghost" onClick={() => markDeployed(repo._id)} style={{ padding: '8px 14px' }}>
                      ⊕ mark deployed
                    </button>
                    <button
                      onClick={() => checkDrift(repo._id)}
                      disabled={isChecking}
                      style={{
                        padding: '8px 14px', borderRadius: '12px', fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: isChecking ? 'not-allowed' : 'pointer',
                        background: isChecking ? 'var(--surface-2)' : 'var(--accent-glow)',
                        color: isChecking ? 'var(--text-muted)' : '#3b82f6',
                        border: `1px solid ${isChecking ? 'var(--border)' : 'rgba(59,130,246,0.35)'}`,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { if (!isChecking) { (e.currentTarget as any).style.background = 'rgba(59,130,246,0.2)'; (e.currentTarget as any).style.boxShadow = '0 0 20px rgba(59,130,246,0.2)'; }}}
                      onMouseLeave={e => { (e.currentTarget as any).style.background = isChecking ? 'var(--surface-2)' : 'var(--accent-glow)'; (e.currentTarget as any).style.boxShadow = 'none'; }}
                    >
                      <span style={{ display: 'inline-block', animation: isChecking ? 'spinSlow 0.8s linear infinite' : 'none' }}>↻</span>
                      {isChecking ? 'checking...' : 'check drift'}
                    </button>
                    <button
                      onClick={() => toggleExpand(repo._id)}
                      style={{
                        padding: '8px 14px', borderRadius: '12px', fontFamily: 'Space Mono, monospace', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
                        background: isExpanded ? 'var(--accent-glow)' : 'var(--surface-2)',
                        color: isExpanded ? '#3b82f6' : 'var(--text-muted)',
                        border: `1px solid ${isExpanded ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
                      }}
                    >
                      {isExpanded ? '▲ hide' : '▼ details'}
                    </button>
                  </div>
                </div>

                {/* Drift details */}
                {isExpanded && (
                  <div className="anim-expand-down" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', padding: '24px' }}>
                    {!log ? (
                      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                        No drift check run yet — click "check drift" to scan
                      </p>
                    ) : log.status === "clean" ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '14px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '18px', flexShrink: 0 }}>✓</div>
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--green)', marginBottom: '2px' }}>No drift detected</p>
                          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>All {log.totalFiles} files match your deployed snapshot</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Summary */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 20px', borderRadius: '14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', marginBottom: '16px', flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>DRIFTED FILES</p>
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', fontWeight: '700', color: 'var(--red)', lineHeight: 1 }}>{log.behindBy}</p>
                          </div>
                          <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
                          <div>
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>DEPLOYED</p>
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: '700' }}>{log.deployedCommitSHA?.slice(0, 7)}</p>
                          </div>
                          <div style={{ fontFamily: 'Space Mono, monospace', color: 'var(--text-dim)', fontSize: '18px' }}>→</div>
                          <div>
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>CURRENT</p>
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>{log.currentCommitSHA?.slice(0, 7)}</p>
                          </div>
                        </div>
                        {/* File list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                          {(log.driftedFiles || []).map((f, i) => (
                            <div key={i} className="anim-slide-right" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', animationDelay: `${i * 0.03}s` }}>
                              <FileBadge status={f.status} />
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.path}</span>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-dim)', marginTop: '12px' }}>
                          → click "mark deployed" to accept these changes as the new production baseline
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
