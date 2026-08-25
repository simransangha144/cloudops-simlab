"use client";

import { useMemo, useState } from "react";

type Id =
  | "vpc" | "igw" | "public-a" | "public-b" | "private-a" | "private-b"
  | "db-a" | "db-b" | "nat-a" | "nat-b" | "alb" | "nlb" | "apigw" | "vpclink"
  | "ec2" | "ecs" | "lambda" | "rds" | "redis" | "efs" | "bastion" | "ssm"
  | "waf" | "shield" | "sg" | "nacl" | "iam" | "secrets" | "cloudwatch"
  | "tgw" | "peering" | "nat-instance" | "gwlb";

type Group = "NETWORKING" | "COMPUTE" | "INGRESS" | "DATA" | "SECURITY" | "MANAGEMENT" | "ROUTING";

type Resource = { id: Id; name: string; description: string; group: Group };

const resources: Resource[] = [
  { id: "vpc", name: "VPC", description: "Logical network boundary", group: "NETWORKING" },
  { id: "igw", name: "Internet Gateway", description: "Internet ingress/egress path", group: "NETWORKING" },
  { id: "public-a", name: "Public Subnet — AZ-A", description: "Subnet with public routing", group: "NETWORKING" },
  { id: "public-b", name: "Public Subnet — AZ-B", description: "Subnet with public routing", group: "NETWORKING" },
  { id: "private-a", name: "Private App Subnet — AZ-A", description: "Private workload subnet", group: "NETWORKING" },
  { id: "private-b", name: "Private App Subnet — AZ-B", description: "Private workload subnet", group: "NETWORKING" },
  { id: "db-a", name: "Database Subnet — AZ-A", description: "Isolated data tier", group: "NETWORKING" },
  { id: "db-b", name: "Database Subnet — AZ-B", description: "Isolated data tier", group: "NETWORKING" },
  { id: "nat-a", name: "NAT Gateway — AZ-A", description: "Private outbound Internet", group: "NETWORKING" },
  { id: "nat-b", name: "NAT Gateway — AZ-B", description: "Private outbound Internet", group: "NETWORKING" },
  { id: "nat-instance", name: "NAT Instance", description: "Instance-based egress", group: "ROUTING" },
  { id: "tgw", name: "Transit Gateway", description: "Central network hub", group: "ROUTING" },
  { id: "peering", name: "VPC Peering", description: "Point-to-point VPC connectivity", group: "ROUTING" },
  { id: "alb", name: "Application Load Balancer", description: "Layer 7 HTTP/HTTPS ingress", group: "INGRESS" },
  { id: "nlb", name: "Network Load Balancer", description: "Layer 4 load balancing", group: "INGRESS" },
  { id: "apigw", name: "API Gateway", description: "Managed API ingress", group: "INGRESS" },
  { id: "vpclink", name: "VPC Link", description: "Private API Gateway integration", group: "INGRESS" },
  { id: "gwlb", name: "Gateway Load Balancer", description: "Network security appliance insertion", group: "INGRESS" },
  { id: "ec2", name: "EC2 Instance", description: "Virtual server workload", group: "COMPUTE" },
  { id: "ecs", name: "ECS / Fargate Service", description: "Container workload", group: "COMPUTE" },
  { id: "lambda", name: "Lambda", description: "Serverless compute", group: "COMPUTE" },
  { id: "bastion", name: "Bastion Host", description: "Jump host for administration", group: "COMPUTE" },
  { id: "rds", name: "RDS", description: "Managed relational database", group: "DATA" },
  { id: "redis", name: "ElastiCache / Redis", description: "Managed in-memory cache", group: "DATA" },
  { id: "efs", name: "EFS", description: "Managed shared filesystem", group: "DATA" },
  { id: "sg", name: "Security Group", description: "Stateful workload firewall", group: "SECURITY" },
  { id: "nacl", name: "Network ACL", description: "Subnet-level stateless filter", group: "SECURITY" },
  { id: "waf", name: "AWS WAF", description: "Web application firewall", group: "SECURITY" },
  { id: "shield", name: "AWS Shield", description: "DDoS protection", group: "SECURITY" },
  { id: "iam", name: "IAM Role", description: "Workload identity", group: "SECURITY" },
  { id: "secrets", name: "Secrets Manager", description: "Application secrets", group: "MANAGEMENT" },
  { id: "ssm", name: "Systems Manager", description: "Private instance administration", group: "MANAGEMENT" },
  { id: "cloudwatch", name: "CloudWatch", description: "Logs and operational telemetry", group: "MANAGEMENT" },
];

const groups: Group[] = ["NETWORKING", "INGRESS", "COMPUTE", "DATA", "SECURITY", "MANAGEMENT", "ROUTING"];

type Pattern = "ec2" | "ecs" | "lambda" | "ecs-vpclink";

const patterns: Record<Pattern, { title: string; summary: string; required: Id[]; optional: Id[] }> = {
  ec2: {
    title: "ALB + EC2",
    summary: "Classic multi-AZ private application tier.",
    required: ["vpc", "igw", "public-a", "public-b", "private-a", "private-b", "nat-a", "nat-b", "alb", "ec2", "sg"],
    optional: ["waf", "shield", "rds", "db-a", "db-b", "ssm", "iam", "secrets", "cloudwatch"],
  },
  ecs: {
    title: "ALB + ECS/Fargate",
    summary: "Containerized private application behind a managed ALB.",
    required: ["vpc", "igw", "public-a", "public-b", "private-a", "private-b", "nat-a", "nat-b", "alb", "ecs", "sg", "iam"],
    optional: ["waf", "shield", "rds", "db-a", "db-b", "secrets", "cloudwatch"],
  },
  lambda: {
    title: "API Gateway + Lambda",
    summary: "Serverless API ingress and compute path.",
    required: ["apigw", "lambda"],
    optional: ["waf", "shield", "iam", "secrets", "cloudwatch", "vpc", "private-a", "private-b", "sg", "rds", "db-a", "db-b"],
  },
  "ecs-vpclink": {
    title: "API Gateway + ECS",
    summary: "Managed API ingress into a private container service.",
    required: ["vpc", "private-a", "private-b", "apigw", "vpclink", "ecs", "sg"],
    optional: ["nat-a", "nat-b", "igw", "waf", "shield", "iam", "secrets", "cloudwatch", "rds", "db-a", "db-b"],
  },
};

export default function AwsVpcLab() {
  const [selected, setSelected] = useState<Id[]>([]);
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<Group | "ALL">("ALL");

  const filtered = useMemo(() => resources.filter((r) => (group === "ALL" || r.group === group) && r.name.toLowerCase().includes(search.toLowerCase())), [group, search]);

  function toggle(id: Id) {
    setSubmitted(false);
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function submit() {
    setSubmitted(true);
  }

  function score() {
    if (!pattern) return 0;
    const p = patterns[pattern];
    const requiredHit = p.required.filter((x) => selected.includes(x)).length;
    const optionalHit = p.optional.filter((x) => selected.includes(x)).length;
    const wrong = selected.filter((x) => !p.required.includes(x) && !p.optional.includes(x)).length;
    return Math.max(0, Math.round((requiredHit / p.required.length) * 75 + Math.min(optionalHit, 4) * 5 - Math.min(wrong, 5) * 2));
  }

  const selectedResources = resources.filter((r) => selected.includes(r.id));
  const publicItems = selectedResources.filter((r) => ["public-a", "public-b", "alb", "igw", "nat-a", "nat-b"].includes(r.id));
  const privateItems = selectedResources.filter((r) => ["private-a", "private-b", "db-a", "db-b", "ec2", "ecs", "lambda", "rds", "redis", "efs"].includes(r.id));

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#03060b]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 transition hover:text-white">←</a>
            <div className="h-8 w-px bg-white/10" />
            <div><div className="font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-400">LAB_01 / AWS</div><h1 className="mt-0.5 text-sm font-semibold">Production API Architecture</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[9px] uppercase tracking-widest text-gray-500 sm:block">Practice mode</div>
            <button onClick={() => { setSelected([]); setPattern(null); setSubmitted(false); }} className="rounded-lg border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-widest text-gray-500 hover:text-white">Reset</button>
          </div>
        </div>
      </header>

      <section className="border-b border-white/[0.07] bg-gradient-to-b from-cyan-400/[0.025] to-transparent">
        <div className="mx-auto max-w-[1500px] px-5 py-9">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2"><Badge>ADVANCED</Badge><Badge>NETWORKING</Badge><Badge>MULTI-AZ</Badge></div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Design a production-grade private application network</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-gray-400">
              You are designing infrastructure for a customer-facing API. The application must be highly available across two Availability Zones. Application workloads must not have public IP addresses. Customers must reach the application from the Internet, administrators must access private workloads securely, and the application needs outbound Internet connectivity for operating-system and software updates.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <Requirement title="HA" text="Two Availability Zones" />
              <Requirement title="PRIVATE" text="No public workload IPs" />
              <Requirement title="INGRESS" text="Internet-facing customers" />
              <Requirement title="ADMIN" text="Secure private access" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-4 px-5 py-5 xl:grid-cols-[300px_1fr_270px]">
        <aside className="rounded-2xl border border-white/10 bg-[#070c13] p-4">
          <div className="mb-4 flex items-end justify-between"><div><div className="text-sm font-semibold">Resource toolbox</div><div className="mt-1 text-[10px] text-gray-600">Choose what belongs in your design.</div></div><span className="font-mono text-[9px] text-gray-700">{selected.length} selected</span></div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="mb-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white outline-none placeholder:text-gray-700 focus:border-cyan-400/30" />
          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">{["ALL", ...groups].map((g) => <button key={g} onClick={() => setGroup(g as Group | "ALL")} className={`whitespace-nowrap rounded-md px-2 py-1 text-[8px] uppercase tracking-wider ${group === g ? "bg-cyan-400/10 text-cyan-300" : "text-gray-600 hover:text-gray-400"}`}>{g}</button>)}</div>
          <div className="max-h-[620px] space-y-1.5 overflow-y-auto pr-1">
            {filtered.map((r) => {
              const active = selected.includes(r.id);
              return <button key={r.id} onClick={() => toggle(r.id)} className={`group w-full rounded-xl border p-3 text-left transition ${active ? "border-cyan-400/30 bg-cyan-400/[0.06]" : "border-white/[0.07] bg-white/[0.012] hover:border-white/15 hover:bg-white/[0.025]"}`}>
                <div className="flex items-center justify-between gap-2"><span className={`text-xs font-medium ${active ? "text-cyan-200" : "text-gray-300"}`}>{r.name}</span><span className="font-mono text-[8px] text-gray-700">{active ? "✓" : r.group.slice(0, 3)}</span></div>
                <div className="mt-1 text-[9px] leading-4 text-gray-600">{r.description}</div>
              </button>;
            })}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between"><div><div className="text-sm font-semibold">Architecture canvas</div><div className="mt-1 font-mono text-[9px] text-gray-600">VPC / 10.0.0.0/16 / us-east-1</div></div><div className="font-mono text-[9px] text-gray-700">{selected.length} COMPONENTS</div></div>
          <div className="relative min-h-[710px] overflow-hidden rounded-2xl border border-white/10 bg-[#060b12] p-5">
            <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="relative h-[650px] rounded-xl border border-cyan-400/10 bg-cyan-400/[0.012] p-5">
              <div className="flex items-center justify-between"><div><div className="font-mono text-[8px] tracking-[0.2em] text-cyan-400">CANDIDATE DESIGN</div><div className="mt-1 text-xs text-gray-500">{pattern ? patterns[pattern].title : "Select an architecture pattern below"}</div></div><div className="rounded-md border border-white/10 px-2.5 py-1 text-[8px] text-gray-600">LIVE CANVAS</div></div>

              <div className="mt-8 grid grid-cols-[105px_1fr] gap-4">
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3"><div className="text-[8px] uppercase tracking-widest text-gray-600">Internet</div><div className="h-10 w-10 rounded-full border border-cyan-400/20 bg-cyan-400/5" /><div className="text-[8px] text-gray-700">CLIENTS</div></div>
                <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="mb-3 text-[8px] uppercase tracking-[0.2em] text-gray-700">VPC</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Subnet title="PUBLIC / AZ-A" items={publicItems.filter((x) => ["public-a", "alb", "igw", "nat-a"].includes(x.id))} />
                    <Subnet title="PUBLIC / AZ-B" items={publicItems.filter((x) => ["public-b", "nat-b"].includes(x.id))} />
                    <Subnet title="PRIVATE / AZ-A" items={privateItems.filter((x) => ["private-a", "ec2", "ecs", "lambda"].includes(x.id))} />
                    <Subnet title="PRIVATE / AZ-B" items={privateItems.filter((x) => ["private-b", "rds", "redis", "efs"].includes(x.id))} />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-[8px] uppercase tracking-[0.2em] text-gray-700">SELECTED COMPONENTS / TOPOLOGY</div>
                <div className="flex flex-wrap gap-2">{selectedResources.length ? selectedResources.map((r) => <span key={r.id} className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] px-3 py-2 text-[9px] text-gray-400">{r.name}</span>) : <span className="text-[10px] text-gray-700">Your architecture will appear here as resources are selected.</span>}</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#070c13] p-4">
            <div className="text-[9px] uppercase tracking-[0.2em] text-cyan-400">Architecture pattern</div>
            <div className="mt-2 text-xs text-gray-500">Choose the implementation you believe best satisfies the requirements.</div>
            <div className="mt-4 space-y-2">
              {(Object.keys(patterns) as Pattern[]).map((key) => <button key={key} onClick={() => { setPattern(key); setSubmitted(false); }} className={`w-full rounded-xl border p-3 text-left transition ${pattern === key ? "border-cyan-400/30 bg-cyan-400/[0.06]" : "border-white/[0.07] bg-white/[0.012] hover:border-white/15"}`}><div className="text-xs font-semibold text-gray-300">{patterns[key].title}</div><div className="mt-1 text-[9px] leading-4 text-gray-600">{patterns[key].summary}</div></button>)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#070c13] p-4">
            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Submission</div>
            <div className="mt-3 text-sm font-semibold">{pattern ? patterns[pattern].title : "No pattern selected"}</div>
            <div className="mt-1 text-[10px] text-gray-600">{selected.length} resources selected</div>
            <button disabled={!pattern} onClick={submit} className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3.5 text-xs font-bold text-[#021018] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30">Submit Architecture →</button>
          </div>

          {submitted && pattern && <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5"><div className="text-[9px] uppercase tracking-[0.2em] text-cyan-400">Assessment result</div><div className="mt-3 flex items-end gap-2"><span className="text-4xl font-bold">{score()}</span><span className="mb-1 text-xs text-gray-600">/ 100</span></div><div className="mt-3 text-xs leading-5 text-gray-400">{score() >= 80 ? "Strong production-oriented design." : score() >= 55 ? "Viable direction, but important requirements are missing." : "The chosen pattern or topology does not yet satisfy enough of the requirements."}</div><div className="mt-4 border-t border-white/10 pt-4 text-[9px] leading-5 text-gray-600">Validation occurs only after submission. Resources are intentionally not color-coded as correct or incorrect during design.</div></div>}
        </aside>
      </section>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-md border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-gray-500">{children}</span>; }
function Requirement({ title, text }: { title: string; text: string }) { return <div className="rounded-xl border border-white/10 bg-white/[0.018] p-3"><div className="font-mono text-[8px] text-cyan-400">{title}</div><div className="mt-1 text-[9px] text-gray-600">{text}</div></div>; }
function Subnet({ title, items }: { title: string; items: Resource[] }) { return <div className="min-h-[118px] rounded-xl border border-white/[0.07] bg-white/[0.012] p-3"><div className="font-mono text-[8px] tracking-wider text-gray-600">{title}</div><div className="mt-3 flex flex-wrap gap-1.5">{items.length ? items.map((x) => <span key={x.id} className="rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-[8px] text-gray-500">{x.name}</span>) : <span className="text-[8px] text-gray-800">empty</span>}</div></div>; }
