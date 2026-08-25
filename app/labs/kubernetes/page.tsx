 "use client";

import { useState } from "react";
import Link from "next/link";

type Choice = { id: string; name: string; description: string; category: string };
type Decision = { id: string; question: string; options: string[]; expected: string };

const choices: Choice[] = [
  { id: "namespace", name: "Namespace", description: "Logical workload isolation", category: "CORE" },
  { id: "deployment", name: "Deployment", description: "Declarative application rollout", category: "WORKLOAD" },
  { id: "service", name: "ClusterIP Service", description: "Stable internal service discovery", category: "NETWORK" },
  { id: "ingress", name: "Ingress", description: "HTTP/HTTPS north-south entry point", category: "NETWORK" },
  { id: "hpa", name: "Horizontal Pod Autoscaler", description: "Scale replicas from resource metrics", category: "SCALE" },
  { id: "probes", name: "Readiness + Liveness Probes", description: "Control traffic and restart unhealthy containers", category: "RELIABILITY" },
  { id: "configmap", name: "ConfigMap", description: "Non-sensitive configuration", category: "CONFIG" },
  { id: "secret", name: "Kubernetes Secret", description: "Sensitive runtime configuration", category: "SECURITY" },
  { id: "pdb", name: "PodDisruptionBudget", description: "Protect availability during voluntary disruption", category: "RELIABILITY" },
  { id: "rbac", name: "RBAC", description: "Least-privilege Kubernetes permissions", category: "SECURITY" },
  { id: "networkpolicy", name: "NetworkPolicy", description: "Restrict pod-to-pod traffic", category: "SECURITY" },
  { id: "resources", name: "Resource Requests/Limits", description: "Define scheduling and resource boundaries", category: "OPERATIONS" },
  { id: "hostnetwork", name: "hostNetwork: true", description: "Attach workload directly to node network", category: "DISTRACTOR" },
  { id: "privileged", name: "Privileged Container", description: "Elevated container privileges", category: "DISTRACTOR" },
  { id: "nodeport", name: "NodePort", description: "Expose service directly on node ports", category: "DISTRACTOR" },
];

const required = ["namespace","deployment","service","ingress","hpa","probes","configmap","secret","pdb","rbac","networkpolicy","resources"];

const decisions: Decision[] = [
  { id: "exposure", question: "How should the HTTP application be exposed externally?", options: ["NodePort", "Ingress", "hostNetwork"], expected: "Ingress" },
  { id: "health", question: "How should Kubernetes determine whether a pod can receive traffic?", options: ["Readiness probe", "SSH check", "NodePort check"], expected: "Readiness probe" },
  { id: "secrets", question: "Where should sensitive application configuration be stored?", options: ["ConfigMap", "Kubernetes Secret", "Container image"], expected: "Kubernetes Secret" },
  { id: "permissions", question: "How should workloads and operators receive Kubernetes permissions?", options: ["Cluster-admin for everyone", "RBAC least privilege", "Shared kubeconfig"], expected: "RBAC least privilege" },
  { id: "scaling", question: "How should replicas react to sustained resource demand?", options: ["Manually edit replicas", "Horizontal Pod Autoscaler", "Restart the nodes"], expected: "Horizontal Pod Autoscaler" },
  { id: "availability", question: "What protects the service during voluntary disruptions?", options: ["PodDisruptionBudget", "Privileged container", "hostNetwork"], expected: "PodDisruptionBudget" },
];

export default function KubernetesAssessment() {
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);

  const requiredScore = required.filter(x => selected.includes(x)).length;
  const unnecessary = selected.filter(x => !required.includes(x)).length;
  const forbidden = selected.filter(x => ["privileged","hostnetwork"].includes(x)).length;
  const decisionScore = decisions.filter(d => answers[d.id] === d.expected).length;
  const total = Math.max(0, Math.round((requiredScore / required.length) * 50 + (decisionScore / decisions.length) * 50 - unnecessary * 4 - forbidden * 10));
  const passed = submitted && total >= 80 && requiredScore === required.length && forbidden === 0;

  function toggle(id: string) {
    if (submitted) return;
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s,id]);
  }

  function reset() {
    setSelected([]); setAnswers({}); setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#03060b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-xs text-gray-500 hover:text-white">← CloudOps SimLab</Link>
            <h1 className="mt-1 text-xl font-semibold">Kubernetes Deployment Assessment <span className="ml-2 rounded-full border border-cyan-400/20 px-3 py-1 text-[10px] text-cyan-300">LAB_03</span></h1>
          </div>
          <div className="flex gap-2 text-[10px] uppercase tracking-wider">
            <span className="rounded-lg border border-white/10 px-3 py-2 text-gray-500">Advanced</span>
            <span className="rounded-lg border border-white/10 px-3 py-2 text-gray-500">25–35 min</span>
            <span className="rounded-lg border border-amber-400/20 px-3 py-2 text-amber-300">Practice Mode</span>
          </div>
        </div>
      </header>

      <div className="border-b border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl gap-3 px-6 py-5 md:grid-cols-4">
          {["Declarative workloads", "Secure service exposure", "Least privilege", "Resilient scaling"].map(x => <div key={x} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-gray-400"><span className="mr-2 text-cyan-300">●</span>{x}</div>)}
        </div>
      </div>

      {!submitted ? (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">Scenario</div>
            <h2 className="mt-2 text-3xl font-bold">Design a production Kubernetes workload.</h2>
            <p className="mt-3 leading-7 text-gray-400">
              Deploy a stateless web/API workload that must be reachable through controlled HTTP ingress,
              survive pod disruption, scale under load, use least-privilege access and separate sensitive
              configuration from ordinary application settings.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
            <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-4 flex justify-between"><div><h3 className="font-semibold">Kubernetes Resource Pool</h3><p className="mt-1 text-xs text-gray-500">Select the resources you would deploy.</p></div><span className="text-xs text-cyan-300">{selected.length} selected</span></div>
              <div className="space-y-2">
                {choices.map(c => <button key={c.id} onClick={() => toggle(c.id)} className={`w-full rounded-xl border p-3 text-left transition ${selected.includes(c.id) ? "border-cyan-400/50 bg-cyan-400/[0.07]" : "border-white/10 hover:border-white/20"}`}>
                  <div className="flex justify-between"><span className="text-sm font-medium">{c.name}</span><span className="text-[8px] uppercase tracking-wider text-gray-600">{c.category}</span></div>
                  <div className="mt-1 text-xs text-gray-500">{c.description}</div>
                </button>)}
              </div>
            </aside>

            <div>
              <div className="rounded-2xl border border-cyan-400/10 bg-[#071018] p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">KUBERNETES / PRODUCTION</div>
                <h3 className="mt-2 text-2xl font-semibold">Application Control Plane</h3>
                <div className="mt-7 grid gap-4 md:grid-cols-4">
                  {[["01","Workload","Deployment"],["02","Network","Service + Ingress"],["03","Reliability","Probes + PDB + HPA"],["04","Security","RBAC + NetworkPolicy"]].map(([n,t,d]) => <div key={n} className="rounded-xl border border-white/10 p-5"><div className="text-[10px] text-cyan-300">{n}</div><div className="mt-3 font-semibold">{t}</div><div className="mt-2 text-xs text-gray-500">{d}</div></div>)}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold">Architecture Decisions</h3>
                <p className="mt-1 text-xs text-gray-500">Select the production-safe answer.</p>
                <div className="mt-5 space-y-4">
                  {decisions.map(d => <div key={d.id} className="rounded-xl border border-white/10 p-4">
                    <div className="text-sm font-medium">{d.question}</div>
                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      {d.options.map(o => <button key={o} onClick={() => setAnswers(a => ({...a,[d.id]:o}))} className={`rounded-lg border px-3 py-3 text-left text-xs ${answers[d.id] === o ? "border-cyan-400/50 bg-cyan-400/[0.07] text-cyan-200" : "border-white/10 text-gray-400 hover:border-white/20"}`}>{o}</button>)}
                    </div>
                  </div>)}
                </div>
              </div>

              <button onClick={() => setSubmitted(true)} className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-4 text-sm font-bold text-[#021018]">Submit Assessment →</button>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-cyan-300">Architecture Result</div>
          <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div><div className="text-6xl font-bold">{total}<span className="ml-2 text-xl text-gray-600">/100</span></div><div className="mt-3 text-gray-400">{passed ? "Production-ready Kubernetes architecture." : "Architecture needs revision."}</div></div>
              <div className={`rounded-xl border px-5 py-4 ${passed ? "border-emerald-400/30 text-emerald-300" : "border-amber-400/30 text-amber-300"}`}>{passed ? "PASSED" : "ARCHITECTURE REJECTED"}</div>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-5">
              <Stat label="Required" value={`${requiredScore}/${required.length}`} />
              <Stat label="Decisions" value={`${decisionScore}/${decisions.length}`} />
              <Stat label="Unnecessary" value={`${unnecessary}`} />
              <Stat label="Forbidden" value={`${forbidden}`} />
              <Stat label="Score" value={`${total}/100`} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 p-6"><h3 className="font-semibold">Submitted Components</h3><div className="mt-4 space-y-2">{selected.map(id => { const c=choices.find(x=>x.id===id)!; const ok=required.includes(id); return <div key={id} className={`rounded-lg border px-4 py-3 text-sm ${ok ? "border-emerald-400/20 text-emerald-300" : "border-red-400/20 text-red-300"}`}>{ok ? "✓" : "×"} {c.name}</div> })}</div></div>
            <div className="rounded-2xl border border-white/10 p-6"><h3 className="font-semibold">Decision Results</h3><div className="mt-4 space-y-3">{decisions.map(d => { const ok=answers[d.id]===d.expected; return <div key={d.id} className={`rounded-xl border p-4 ${ok ? "border-emerald-400/20" : "border-red-400/20"}`}><div className="text-sm">{ok?"✓":"×"} {d.question}</div><div className="mt-2 text-xs text-gray-500">Your answer: {answers[d.id] || "Not answered"}</div>{!ok && <div className="mt-1 text-xs text-cyan-300">Expected: {d.expected}</div>}</div>})}</div></div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={reset} className="rounded-xl border border-cyan-400/20 px-6 py-3 text-sm text-cyan-300">Try Again</button>
            <Link href="/labs/aws-vpc" className="rounded-xl border border-white/10 px-6 py-3 text-sm text-gray-400 hover:text-white">Review VPC Assessment</Link>
            <Link href="/" className="rounded-xl border border-white/10 px-6 py-3 text-sm text-gray-400 hover:text-white">Back to Assessments</Link>
          </div>
        </section>
      )}
    </main>
  );
}

function Stat({label,value}:{label:string;value:string}) {
  return <div className="rounded-xl border border-white/10 bg-black/10 p-4"><div className="text-[10px] uppercase tracking-wider text-gray-600">{label}</div><div className="mt-2 text-xl font-semibold">{value}</div></div>;
}
