"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ResourceId =
  | "s3-backend" | "s3-versioning" | "s3-lockfile" | "vpc-module"
  | "network-module" | "compute-module" | "prod-environment"
  | "dev-environment" | "variables" | "outputs" | "data-source"
  | "secrets-manager" | "iam-role" | "security-group" | "alb"
  | "ec2-asg" | "rds" | "nat" | "dynamodb-lock" | "local-backend"
  | "hardcoded-secret" | "iam-admin" | "auto-approve" | "terraform-taint"
  | "null-resource" | "public-s3" | "cloudwatch";

type Group = "state" | "structure" | "infra" | "security" | "operations";

type Resource = {
  id: ResourceId;
  name: string;
  description: string;
  group: Group;
  badge: string;
};

const resources: Resource[] = [
  { id: "s3-backend", name: "S3 Remote Backend", description: "Centralized Terraform state", group: "state", badge: "STATE" },
  { id: "s3-versioning", name: "S3 Versioning", description: "Recover previous state versions", group: "state", badge: "STATE" },
  { id: "s3-lockfile", name: "S3 Native Locking", description: "Prevent concurrent state writes", group: "state", badge: "LOCK" },
  { id: "dynamodb-lock", name: "DynamoDB Lock Table", description: "Legacy locking approach", group: "state", badge: "DISTRACTOR" },
  { id: "local-backend", name: "Local Backend", description: "State stored on the operator machine", group: "state", badge: "DISTRACTOR" },
  { id: "vpc-module", name: "VPC Module", description: "Reusable network module", group: "structure", badge: "MODULE" },
  { id: "network-module", name: "Network Module", description: "Reusable subnet and routing composition", group: "structure", badge: "MODULE" },
  { id: "compute-module", name: "Compute Module", description: "Reusable application compute", group: "structure", badge: "MODULE" },
  { id: "prod-environment", name: "Production Environment", description: "Dedicated production root module", group: "structure", badge: "ENV" },
  { id: "dev-environment", name: "Development Environment", description: "Dedicated development root module", group: "structure", badge: "ENV" },
  { id: "variables", name: "Input Variables", description: "Parameterize environment-specific values", group: "structure", badge: "TF" },
  { id: "outputs", name: "Outputs", description: "Expose useful resource attributes", group: "structure", badge: "TF" },
  { id: "data-source", name: "Data Sources", description: "Read existing infrastructure", group: "structure", badge: "TF" },
  { id: "alb", name: "Application Load Balancer", description: "Public entry point", group: "infra", badge: "AWS" },
  { id: "ec2-asg", name: "EC2 Auto Scaling", description: "Highly available application tier", group: "infra", badge: "AWS" },
  { id: "rds", name: "RDS", description: "Managed relational database", group: "infra", badge: "AWS" },
  { id: "nat", name: "NAT Gateway", description: "Private outbound connectivity", group: "infra", badge: "AWS" },
  { id: "cloudwatch", name: "CloudWatch", description: "Operational telemetry", group: "operations", badge: "AWS" },
  { id: "secrets-manager", name: "Secrets Manager", description: "Runtime secret storage", group: "security", badge: "SECRET" },
  { id: "iam-role", name: "IAM Role", description: "Workload identity", group: "security", badge: "IAM" },
  { id: "security-group", name: "Security Group", description: "Network access control", group: "security", badge: "SG" },
  { id: "hardcoded-secret", name: "Hard-coded Password", description: "Credential embedded in Terraform", group: "security", badge: "DANGER" },
  { id: "iam-admin", name: "AdministratorAccess", description: "Broad administrative policy", group: "security", badge: "DANGER" },
  { id: "auto-approve", name: "-auto-approve", description: "Skip interactive approval", group: "operations", badge: "DANGER" },
  { id: "terraform-taint", name: "terraform taint", description: "Legacy resource replacement workflow", group: "operations", badge: "LEGACY" },
  { id: "null-resource", name: "null_resource", description: "Imperative workaround", group: "operations", badge: "DISTRACTOR" },
  { id: "public-s3", name: "Public S3 Bucket", description: "State bucket exposed to the Internet", group: "security", badge: "DANGER" },
];

const correct: ResourceId[] = [
  "s3-backend", "s3-versioning", "s3-lockfile", "vpc-module",
  "compute-module", "prod-environment", "dev-environment",
  "variables", "outputs", "secrets-manager", "iam-role", "security-group",
];

const groupLabels: Record<Group, string> = {
  state: "STATE & LOCKING",
  structure: "CODE STRUCTURE",
  infra: "AWS INFRASTRUCTURE",
  security: "SECURITY",
  operations: "OPERATIONS",
};

const SUBMISSION_KEY = "cloudops-terraform-submission";

export default function TerraformLab() {
  const router = useRouter();
  const [selected, setSelected] = useState<ResourceId[]>([]);
  const [filter, setFilter] = useState<"all" | Group>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesGroup = filter === "all" || resource.group === filter;
      const matchesSearch =
        !q ||
        resource.name.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [filter, search]);

  function toggle(id: ResourceId) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function submit() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SUBMISSION_KEY,
        JSON.stringify({
          selected,
          submittedAt: new Date().toISOString(),
        })
      );
    }
    router.push("/labs/terraform/results");
  }

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[8%] top-[-180px] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.07] blur-[150px]" />
        <div className="absolute right-[-120px] top-[18%] h-[620px] w-[620px] rounded-full bg-blue-600/[0.08] blur-[170px]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#03060b]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4">
          <div>
            <a href="/" className="text-xs text-gray-500 hover:text-white">← CloudOps SimLab</a>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-lg font-semibold">Terraform Infrastructure Assessment</h1>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-300">LAB_04</span>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 font-mono text-[10px] text-gray-500">ADVANCED</span>
            <span className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 font-mono text-[10px] text-gray-500">25–35 MIN</span>
            <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2 font-mono text-[10px] text-cyan-300">PRACTICE</span>
          </div>
        </div>
      </header>

      <section className="relative border-b border-white/[0.08] bg-[#050a11]/80">
        <div className="mx-auto max-w-[1500px] px-5 py-8">
          <div className="max-w-5xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400">Scenario / Infrastructure as Code</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Stabilize a production Terraform platform</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-gray-400">
              You have inherited Terraform used to provision a customer-facing AWS application.
              The infrastructure works, but the repository has poor state management, weak
              environment isolation and unsafe operational practices. Select the components
              and practices that belong in a production-grade Terraform implementation.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <Requirement label="Remote, recoverable state" />
              <Requirement label="Safe concurrent operations" />
              <Requirement label="Reusable environment structure" />
              <Requirement label="Secrets and least privilege" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto grid max-w-[1500px] gap-5 px-5 py-6 lg:grid-cols-[350px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-[#080d15]/90 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold">Terraform Resource Pool</p>
                <p className="mt-1 text-[10px] text-gray-500">Plausible options are intentionally mixed together.</p>
              </div>
              <span className="font-mono text-[9px] text-gray-600">{selected.length} SELECTED</span>
            </div>

            <div className="mt-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white outline-none placeholder:text-gray-700 focus:border-cyan-400/30"
              />
            </div>

            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>ALL</FilterButton>
              {(Object.keys(groupLabels) as Group[]).map((group) => (
                <FilterButton key={group} active={filter === group} onClick={() => setFilter(group)}>
                  {groupLabels[group].split(" ")[0]}
                </FilterButton>
              ))}
            </div>

            <div className="mt-4 max-h-[650px] space-y-2 overflow-y-auto pr-1">
              {filtered.map((resource) => {
                const active = selected.includes(resource.id);
                return (
                  <button
                    key={resource.id}
                    type="button"
                    onClick={() => toggle(resource.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-cyan-400/30 bg-cyan-400/[0.06]"
                        : "border-white/[0.07] bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium text-gray-200">{resource.name}</div>
                        <div className="mt-1 text-[10px] leading-4 text-gray-600">{resource.description}</div>
                      </div>
                      <span className={`shrink-0 rounded px-1.5 py-1 font-mono text-[8px] ${active ? "bg-cyan-400/10 text-cyan-300" : "bg-white/[0.03] text-gray-600"}`}>
                        {active ? "ADDED" : resource.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Terraform Architecture Board</p>
                <p className="mt-1 text-[10px] text-gray-600">Construct the production design before submitting.</p>
              </div>
              <div className="flex items-center gap-2">
                {selected.length > 0 && (
                  <button type="button" onClick={() => setSelected([])} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] text-gray-500 hover:text-white">
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={submit}
                  disabled={selected.length === 0}
                  className="rounded-lg bg-cyan-500 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Architecture
                </button>
              </div>
            </div>

            <div className="min-h-[720px] rounded-2xl border border-white/10 bg-[#070c14]/90 p-5">
              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.015] p-5">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-cyan-400">TERRAFORM / PRODUCTION</span>
                    <h3 className="mt-1 text-sm font-semibold">Infrastructure as Code Control Plane</h3>
                  </div>
                  <span className="font-mono text-[9px] text-gray-600">us-east-1</span>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-3">
                  <BoardSection title="STATE & WORKFLOW">
                    {selected.filter((id) => ["s3-backend", "s3-versioning", "s3-lockfile", "dynamodb-lock", "local-backend", "auto-approve"].includes(id))
                      .map((id) => <SelectedCard key={id} resource={resources.find((r) => r.id === id)!} />)}
                  </BoardSection>
                  <BoardSection title="REPOSITORY STRUCTURE">
                    {selected.filter((id) => ["vpc-module", "network-module", "compute-module", "prod-environment", "dev-environment", "variables", "outputs", "data-source"].includes(id))
                      .map((id) => <SelectedCard key={id} resource={resources.find((r) => r.id === id)!} />)}
                  </BoardSection>
                  <BoardSection title="AWS / SECURITY">
                    {selected.filter((id) => ["alb", "ec2-asg", "rds", "nat", "secrets-manager", "iam-role", "security-group", "cloudwatch", "hardcoded-secret", "iam-admin", "public-s3", "null-resource", "terraform-taint"].includes(id))
                      .map((id) => <SelectedCard key={id} resource={resources.find((r) => r.id === id)!} />)}
                  </BoardSection>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <FlowCard number="01" title="Plan" text="Review proposed infrastructure changes." />
                  <FlowCard number="02" title="Review" text="Validate state, security and dependencies." />
                  <FlowCard number="03" title="Apply" text="Promote only an approved configuration." />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.025] px-4 py-3 text-[10px] leading-5 text-gray-500">
                <span className="font-semibold text-amber-300">Assessment rule:</span>{" "}
                no correctness hints are shown while you build. Several resources are deliberately plausible but inappropriate for this production scenario.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Requirement({ label }: { label: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.015] px-3 py-3"><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /><span className="text-[10px] font-medium text-gray-400">{label}</span></div></div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[8px] font-semibold tracking-wider transition ${active ? "bg-cyan-400/10 text-cyan-300" : "text-gray-600 hover:bg-white/[0.03] hover:text-gray-300"}`}>{children}</button>;
}

function BoardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="min-h-[250px] rounded-xl border border-white/[0.07] bg-black/15 p-3"><div className="mb-3 flex items-center justify-between"><span className="font-mono text-[8px] tracking-wider text-gray-600">{title}</span><span className="h-1.5 w-1.5 rounded-full bg-white/10" /></div><div className="space-y-2">{children || <div className="flex min-h-[190px] items-center justify-center rounded-lg border border-dashed border-white/[0.06] text-[9px] text-gray-700">Select components</div>}</div></div>;
}

function SelectedCard({ resource }: { resource: Resource }) {
  return <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.025] px-3 py-2.5"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-medium text-gray-300">{resource.name}</span><span className="font-mono text-[7px] text-cyan-400/70">{resource.badge}</span></div><p className="mt-1 text-[8px] leading-4 text-gray-600">{resource.description}</p></div>;
}

function FlowCard({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4"><div className="font-mono text-[9px] text-cyan-400">{number}</div><div className="mt-2 text-xs font-semibold">{title}</div><div className="mt-1 text-[9px] leading-4 text-gray-600">{text}</div></div>;
}
