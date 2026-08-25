"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ResourceId =
  | "s3-backend" | "s3-versioning" | "s3-lockfile" | "vpc-module"
  | "network-module" | "compute-module" | "prod-environment"
  | "dev-environment" | "variables" | "outputs" | "data-source"
  | "secrets-manager" | "iam-role" | "security-group" | "alb"
  | "ec2-asg" | "rds" | "nat" | "dynamodb-lock" | "local-backend"
  | "hardcoded-secret" | "iam-admin" | "auto-approve" | "terraform-taint"
  | "null-resource" | "public-s3" | "cloudwatch";

type Resource = { id: ResourceId; name: string; description: string; badge: string };

const resources: Resource[] = [
  { id: "s3-backend", name: "S3 Remote Backend", description: "Centralized Terraform state", badge: "STATE" },
  { id: "s3-versioning", name: "S3 Versioning", description: "Recover previous state versions", badge: "STATE" },
  { id: "s3-lockfile", name: "S3 Native Locking", description: "Prevent concurrent state writes", badge: "LOCK" },
  { id: "dynamodb-lock", name: "DynamoDB Lock Table", description: "Legacy locking approach", badge: "DISTRACTOR" },
  { id: "local-backend", name: "Local Backend", description: "State stored on the operator machine", badge: "DISTRACTOR" },
  { id: "vpc-module", name: "VPC Module", description: "Reusable network module", badge: "MODULE" },
  { id: "network-module", name: "Network Module", description: "Reusable subnet and routing composition", badge: "MODULE" },
  { id: "compute-module", name: "Compute Module", description: "Reusable application compute", badge: "MODULE" },
  { id: "prod-environment", name: "Production Environment", description: "Dedicated production root module", badge: "ENV" },
  { id: "dev-environment", name: "Development Environment", description: "Dedicated development root module", badge: "ENV" },
  { id: "variables", name: "Input Variables", description: "Parameterize environment-specific values", badge: "TF" },
  { id: "outputs", name: "Outputs", description: "Expose useful resource attributes", badge: "TF" },
  { id: "data-source", name: "Data Sources", description: "Read existing infrastructure", badge: "TF" },
  { id: "alb", name: "Application Load Balancer", description: "Public entry point", badge: "AWS" },
  { id: "ec2-asg", name: "EC2 Auto Scaling", description: "Highly available application tier", badge: "AWS" },
  { id: "rds", name: "RDS", description: "Managed relational database", badge: "AWS" },
  { id: "nat", name: "NAT Gateway", description: "Private outbound connectivity", badge: "AWS" },
  { id: "cloudwatch", name: "CloudWatch", description: "Operational telemetry", badge: "AWS" },
  { id: "secrets-manager", name: "Secrets Manager", description: "Runtime secret storage", badge: "SECRET" },
  { id: "iam-role", name: "IAM Role", description: "Workload identity", badge: "IAM" },
  { id: "security-group", name: "Security Group", description: "Network access control", badge: "SG" },
  { id: "hardcoded-secret", name: "Hard-coded Password", description: "Credential embedded in Terraform", badge: "DANGER" },
  { id: "iam-admin", name: "AdministratorAccess", description: "Broad administrative policy", badge: "DANGER" },
  { id: "auto-approve", name: "-auto-approve", description: "Skip interactive approval", badge: "DANGER" },
  { id: "terraform-taint", name: "terraform taint", description: "Legacy resource replacement workflow", badge: "LEGACY" },
  { id: "null-resource", name: "null_resource", description: "Imperative workaround", badge: "DISTRACTOR" },
  { id: "public-s3", name: "Public S3 Bucket", description: "State bucket exposed to the Internet", badge: "DANGER" },
];

const correct: ResourceId[] = [
  "s3-backend", "s3-versioning", "s3-lockfile", "vpc-module",
  "compute-module", "prod-environment", "dev-environment",
  "variables", "outputs", "secrets-manager", "iam-role", "security-group",
];

const KEY = "cloudops-terraform-submission";

export default function TerraformResults() {
  const [selected, setSelected] = useState<ResourceId[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSelected(Array.isArray(parsed.selected) ? parsed.selected : []);
      }
    } catch {
      setSelected([]);
    } finally {
      setReady(true);
    }
  }, []);

  const score = useMemo(() => {
    const selectedSet = new Set(selected);
    const correctSelected = correct.filter((id) => selectedSet.has(id)).length;
    const wrongSelected = selected.filter((id) => !correct.includes(id)).length;
    const missing = correct.length - correctSelected;
    const unnecessary = selected.filter((id) => !correct.includes(id)).length;
    const points = Math.round((correctSelected / correct.length) * 100);
    const passed = correctSelected === correct.length && wrongSelected === 0;
    return { correctSelected, wrongSelected, missing, unnecessary, points, passed };
  }, [selected]);

  function retry() {
    sessionStorage.removeItem(KEY);
    window.location.href = "/labs/terraform";
  }

  if (!ready) {
    return <main className="min-h-screen bg-[#03060b]" />;
  }

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[8%] top-[-180px] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.07] blur-[150px]" />
        <div className="absolute right-[-120px] top-[18%] h-[620px] w-[620px] rounded-full bg-blue-600/[0.08] blur-[170px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#03060b]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1250px] items-center justify-between px-5 py-4">
          <div>
            <Link href="/labs/terraform" className="text-xs text-gray-500 hover:text-white">← Terraform Assessment</Link>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-lg font-semibold">Terraform Assessment Result</h1>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-300">LAB_04</span>
            </div>
          </div>
          <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2 font-mono text-[10px] text-cyan-300">SUBMITTED</span>
        </div>
      </header>

      <section className="relative">
        <div className="mx-auto max-w-[1250px] px-5 py-10">
          <div className="rounded-2xl border border-white/10 bg-[#080d15]/90 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">Assessment Result</p>
                <h2 className={`mt-2 text-3xl font-bold ${score.passed ? "text-cyan-300" : "text-white"}`}>
                  {score.passed ? "Architecture accepted" : "Architecture needs improvement"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                  Your submission has been evaluated against the production Terraform architecture defined for this lab.
                </p>
              </div>
              <div className={`rounded-2xl border px-7 py-5 text-center ${score.passed ? "border-cyan-400/25 bg-cyan-400/[0.05]" : "border-amber-400/20 bg-amber-400/[0.04]"}`}>
                <div className="font-mono text-4xl font-bold">{score.points}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-gray-600">Final Score / 100</div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-4">
              <Metric label="Correct" value={`${score.correctSelected}`} />
              <Metric label="Incorrect" value={`${score.wrongSelected}`} />
              <Metric label="Missing" value={`${score.missing}`} />
              <Metric label="Unnecessary" value={`${score.unnecessary}`} />
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <ResultList
              title="Your Submission"
              items={selected.map((id) => resources.find((r) => r.id === id)!)}
              empty="No resources were selected."
              submitted
            />
            <ResultList
              title="Expected Production Architecture"
              items={correct.map((id) => resources.find((r) => r.id === id)!)}
              empty=""
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#080d15]/90 p-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-cyan-400">Evaluation</p>
            <h3 className="mt-2 text-lg font-semibold">What the assessment is measuring</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Info title="Remote state" text="Centralized S3 state with version recovery and native state locking." />
              <Info title="Reusable code" text="Reusable modules and separate production/development environment roots." />
              <Info title="Security" text="Secrets Manager, workload IAM roles and security groups instead of embedded credentials or broad admin access." />
              <Info title="Operational discipline" text="The assessment deliberately includes plausible but inappropriate Terraform practices as distractors." />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={retry}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/20 hover:bg-white/[0.04] hover:text-white"
            >
              Retry Terraform Assessment
            </button>
            <div className="flex gap-3">
              <Link href="/" className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-gray-400 hover:text-white">Back to Labs</Link>
              <Link href="/labs/aws-vpc" className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-[#021018]">Next Assessment →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-4"><div className="text-2xl font-semibold">{value}</div><div className="mt-1 text-[9px] uppercase tracking-wider text-gray-600">{label}</div></div>;
}

function ResultList({ title, items, empty, submitted = false }: { title: string; items: Resource[]; empty: string; submitted?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#080d15]/90 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="font-mono text-[9px] text-gray-600">{items.length} ITEMS</span>
      </div>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? <div className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-gray-600">{empty}</div> : items.map((resource) => (
          <div key={resource.id} className={`rounded-xl border px-4 py-3 ${submitted && correct.includes(resource.id) ? "border-cyan-400/15 bg-cyan-400/[0.025]" : submitted ? "border-amber-400/15 bg-amber-400/[0.025]" : "border-cyan-400/10 bg-cyan-400/[0.02]"}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{resource.name}</span>
              <span className="font-mono text-[8px] text-gray-600">{resource.badge}</span>
            </div>
            <p className="mt-1 text-[10px] leading-5 text-gray-600">{resource.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4"><div className="text-sm font-semibold">{title}</div><p className="mt-1 text-[10px] leading-5 text-gray-600">{text}</p></div>;
}
