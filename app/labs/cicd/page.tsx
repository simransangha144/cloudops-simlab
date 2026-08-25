 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Choice = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type Decision = {
  id: string;
  question: string;
  options: string[];
  expected: string;
};

const choices: Choice[] = [
  { id: "github", name: "GitHub Repository", description: "Source control and pull requests", category: "SOURCE" },
  { id: "actions", name: "GitHub Actions", description: "Pipeline orchestration", category: "CI/CD" },
  { id: "oidc", name: "OIDC / Federated Identity", description: "Short-lived cloud credentials", category: "SECURITY" },
  { id: "secrets", name: "Secrets Manager", description: "Centralized application and deployment secrets", category: "SECURITY" },
  { id: "build", name: "Build Runner", description: "Build and test execution", category: "CI" },
  { id: "registry", name: "Container Registry", description: "Immutable container image storage", category: "ARTIFACTS" },
  { id: "staging", name: "Staging Environment", description: "Production-like validation environment", category: "DEPLOY" },
  { id: "approval", name: "Production Approval", description: "Explicit production promotion gate", category: "GOVERNANCE" },
  { id: "production", name: "Production Environment", description: "Live application environment", category: "DEPLOY" },
  { id: "rollback", name: "Rollback Strategy", description: "Fast recovery to a known-good release", category: "RELIABILITY" },
  { id: "artifact", name: "Build Artifact", description: "Versioned artifact passed between stages", category: "ARTIFACTS" },
  { id: "longkeys", name: "Long-Lived Cloud Access Keys", description: "Static credentials stored for pipeline use", category: "DISTRACTOR" },
  { id: "manualcopy", name: "Manual Artifact Copy", description: "Operators copy builds between environments", category: "DISTRACTOR" },
];

const required = [
  "github", "actions", "oidc", "secrets", "build", "registry",
  "staging", "approval", "production", "rollback", "artifact",
];

const decisions: Decision[] = [
  {
    id: "credentials",
    question: "How should the CI/CD pipeline authenticate to the cloud?",
    options: ["Long-lived access keys", "OIDC / federated identity", "Shared administrator password"],
    expected: "OIDC / federated identity",
  },
  {
    id: "promotion",
    question: "How should a tested build reach production?",
    options: ["Manual file copy", "Production approval gate", "Developer SSH"],
    expected: "Production approval gate",
  },
  {
    id: "artifact",
    question: "What should move between pipeline stages?",
    options: ["A rebuilt image", "The same immutable versioned artifact", "Source files copied manually"],
    expected: "The same immutable versioned artifact",
  },
  {
    id: "rollback",
    question: "What is the preferred production recovery mechanism?",
    options: ["Rebuild from scratch", "Rollback to a known-good release", "SSH into servers and edit files"],
    expected: "Rollback to a known-good release",
  },
  {
    id: "secrets",
    question: "Where should deployment/application secrets live?",
    options: ["Git repository", "Secrets Manager", "Pipeline source code"],
    expected: "Secrets Manager",
  },
];

export default function CicdAssessment() {
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const requiredScore = required.filter((x) => selected.includes(x)).length;
  const unnecessary = selected.filter((x) => !required.includes(x)).length;
  const decisionScore = decisions.filter((d) => answers[d.id] === d.expected).length;
  const total = Math.max(0, Math.round((requiredScore / required.length) * 55 + (decisionScore / decisions.length) * 45 - unnecessary * 5));

  const status = useMemo(() => {
    if (!submitted) return "READY";
    return total >= 80 && requiredScore === required.length ? "PASSED" : "ARCHITECTURE REJECTED";
  }, [submitted, total, requiredScore]);

  function toggle(id: string) {
    if (submitted) return;
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function reset() {
    setSelected([]);
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#03060b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-xs text-gray-500 hover:text-white">← CloudOps SimLab</Link>
            <h1 className="mt-1 text-xl font-semibold">CI/CD Pipeline Assessment <span className="ml-2 rounded-full border border-cyan-400/20 px-3 py-1 text-[10px] text-cyan-300">LAB_02</span></h1>
          </div>
          <div className="flex gap-2 text-[10px] uppercase tracking-wider">
            <span className="rounded-lg border border-white/10 px-3 py-2 text-gray-500">Advanced</span>
            <span className="rounded-lg border border-white/10 px-3 py-2 text-gray-500">25–35 min</span>
            <span className="rounded-lg border border-amber-400/20 px-3 py-2 text-amber-300">Practice Mode</span>
          </div>
        </div>
      </header>

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-6 py-5 md:grid-cols-4">
          {["Secure identity", "Immutable artifacts", "Promotion controls", "Fast rollback"].map((x) => (
            <div key={x} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-gray-400">
              <span className="mr-2 text-cyan-300">●</span>{x}
            </div>
          ))}
        </div>
      </section>

      {!submitted ? (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">Scenario</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Design a production CI/CD delivery path.</h2>
            <p className="mt-3 leading-7 text-gray-400">
              A team ships a containerized API through GitHub. The pipeline must test every change,
              publish an immutable artifact, validate it in staging, require an explicit production
              promotion and support secure credentials and rapid rollback.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
            <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-4 flex justify-between">
                <div><h3 className="font-semibold">Pipeline Resource Pool</h3><p className="mt-1 text-xs text-gray-500">Select the components you would use.</p></div>
                <span className="text-xs text-cyan-300">{selected.length} selected</span>
              </div>
              <div className="space-y-2">
                {choices.map((c) => (
                  <button key={c.id} onClick={() => toggle(c.id)} className={`w-full rounded-xl border p-3 text-left transition ${selected.includes(c.id) ? "border-cyan-400/50 bg-cyan-400/[0.07]" : "border-white/10 bg-black/10 hover:border-white/20"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{c.name}</span>
                      <span className="text-[8px] uppercase tracking-wider text-gray-600">{c.category}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{c.description}</div>
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <div className="rounded-2xl border border-cyan-400/10 bg-[#071018] p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">CI/CD / Production</div>
                <h3 className="mt-2 text-2xl font-semibold">Delivery Control Plane</h3>
                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  {[
                    ["01", "Source & Build", "Commit → test → build"],
                    ["02", "Artifact & Stage", "Version → registry → staging"],
                    ["03", "Promote & Recover", "Approval → production → rollback"],
                  ].map(([n, t, d]) => (
                    <div key={n} className="rounded-xl border border-white/10 bg-black/10 p-5">
                      <div className="text-[10px] text-cyan-300">{n}</div>
                      <div className="mt-3 font-semibold">{t}</div>
                      <div className="mt-2 text-xs text-gray-500">{d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold">Architecture Decisions</h3>
                <p className="mt-1 text-xs text-gray-500">Choose the production-safe answer for each decision.</p>
                <div className="mt-5 space-y-4">
                  {decisions.map((d) => (
                    <div key={d.id} className="rounded-xl border border-white/10 p-4">
                      <div className="text-sm font-medium">{d.question}</div>
                      <div className="mt-3 grid gap-2 md:grid-cols-3">
                        {d.options.map((o) => (
                          <button key={o} onClick={() => setAnswers((a) => ({ ...a, [d.id]: o }))} className={`rounded-lg border px-3 py-3 text-left text-xs transition ${answers[d.id] === o ? "border-cyan-400/50 bg-cyan-400/[0.07] text-cyan-200" : "border-white/10 text-gray-400 hover:border-white/20"}`}>
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setSubmitted(true)} className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-4 text-sm font-bold text-[#021018] transition hover:-translate-y-0.5">
                Submit Assessment →
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-cyan-300">Architecture Result</div>
          <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="text-6xl font-bold">{total}<span className="ml-2 text-xl text-gray-600">/100</span></div>
                <div className="mt-3 text-gray-400">{status === "PASSED" ? "Production-ready delivery architecture." : "Architecture needs revision."}</div>
              </div>
              <div className={`rounded-xl border px-5 py-4 ${status === "PASSED" ? "border-emerald-400/30 text-emerald-300" : "border-amber-400/30 text-amber-300"}`}>
                {status}
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-4">
              <Stat label="Required choices" value={`${requiredScore}/${required.length}`} />
              <Stat label="Decisions" value={`${decisionScore}/${decisions.length}`} />
              <Stat label="Unnecessary" value={`${unnecessary}`} />
              <Stat label="Total" value={`${total}/100`} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="font-semibold">Submitted Components</h3>
              <div className="mt-4 space-y-2">
                {selected.map((id) => {
                  const c = choices.find((x) => x.id === id)!;
                  const ok = required.includes(id);
                  return <div key={id} className={`rounded-lg border px-4 py-3 text-sm ${ok ? "border-emerald-400/20 text-emerald-300" : "border-red-400/20 text-red-300"}`}>{ok ? "✓" : "×"} {c.name}</div>;
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="font-semibold">Decision Results</h3>
              <div className="mt-4 space-y-3">
                {decisions.map((d) => {
                  const ok = answers[d.id] === d.expected;
                  return <div key={d.id} className={`rounded-xl border p-4 ${ok ? "border-emerald-400/20" : "border-red-400/20"}`}>
                    <div className="text-sm">{ok ? "✓" : "×"} {d.question}</div>
                    <div className="mt-2 text-xs text-gray-500">Your answer: {answers[d.id] || "Not answered"}</div>
                    {!ok && <div className="mt-1 text-xs text-cyan-300">Expected: {d.expected}</div>}
                  </div>;
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={reset} className="rounded-xl border border-cyan-400/20 px-6 py-3 text-sm text-cyan-300 hover:bg-cyan-400/[0.05]">Try Again</button>
            <Link href="/labs/kubernetes" className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-[#021018]">Continue to Kubernetes →</Link>
            <Link href="/" className="rounded-xl border border-white/10 px-6 py-3 text-sm text-gray-400 hover:text-white">Back to Assessments</Link>
          </div>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-black/10 p-4"><div className="text-[10px] uppercase tracking-wider text-gray-600">{label}</div><div className="mt-2 text-xl font-semibold">{value}</div></div>;
}
