"use client";

import { useEffect, useMemo, useState } from "react";

type Id =
  | "vpc" | "igw" | "public-a" | "public-b" | "private-a" | "private-b"
  | "db-a" | "db-b" | "nat-a" | "nat-b" | "nat-instance" | "tgw" | "peering"
  | "alb" | "nlb" | "apigw" | "vpclink" | "gwlb"
  | "ec2" | "ecs" | "lambda" | "bastion"
  | "rds" | "redis" | "efs"
  | "sg" | "nacl" | "waf" | "shield" | "iam"
  | "secrets" | "ssm" | "cloudwatch";

type Pattern = "ec2" | "ecs" | "lambda" | "ecs-vpclink";

type Resource = {
  id: Id;
  name: string;
  description: string;
};

const resources: Resource[] = [
  { id: "vpc", name: "VPC", description: "Logical network boundary" },
  { id: "igw", name: "Internet Gateway", description: "Internet ingress/egress path" },
  { id: "public-a", name: "Public Subnet — AZ-A", description: "Subnet with public routing" },
  { id: "public-b", name: "Public Subnet — AZ-B", description: "Subnet with public routing" },
  { id: "private-a", name: "Private App Subnet — AZ-A", description: "Private workload subnet" },
  { id: "private-b", name: "Private App Subnet — AZ-B", description: "Private workload subnet" },
  { id: "db-a", name: "Database Subnet — AZ-A", description: "Isolated data tier" },
  { id: "db-b", name: "Database Subnet — AZ-B", description: "Isolated data tier" },
  { id: "nat-a", name: "NAT Gateway — AZ-A", description: "Private outbound Internet" },
  { id: "nat-b", name: "NAT Gateway — AZ-B", description: "Private outbound Internet" },
  { id: "nat-instance", name: "NAT Instance", description: "Instance-based egress" },
  { id: "tgw", name: "Transit Gateway", description: "Central network hub" },
  { id: "peering", name: "VPC Peering", description: "Point-to-point VPC connectivity" },
  { id: "alb", name: "Application Load Balancer", description: "Layer 7 HTTP/HTTPS ingress" },
  { id: "nlb", name: "Network Load Balancer", description: "Layer 4 load balancing" },
  { id: "apigw", name: "API Gateway", description: "Managed API ingress" },
  { id: "vpclink", name: "VPC Link", description: "Private API Gateway integration" },
  { id: "gwlb", name: "Gateway Load Balancer", description: "Network security appliance insertion" },
  { id: "ec2", name: "EC2 Instance", description: "Virtual server workload" },
  { id: "ecs", name: "ECS / Fargate Service", description: "Container workload" },
  { id: "lambda", name: "Lambda", description: "Serverless compute" },
  { id: "bastion", name: "Bastion Host", description: "Jump host for administration" },
  { id: "rds", name: "RDS", description: "Managed relational database" },
  { id: "redis", name: "ElastiCache / Redis", description: "Managed in-memory cache" },
  { id: "efs", name: "EFS", description: "Managed shared filesystem" },
  { id: "sg", name: "Security Group", description: "Stateful workload firewall" },
  { id: "nacl", name: "Network ACL", description: "Subnet-level stateless filter" },
  { id: "waf", name: "AWS WAF", description: "Web application firewall" },
  { id: "shield", name: "AWS Shield", description: "DDoS protection" },
  { id: "iam", name: "IAM Role", description: "Workload identity" },
  { id: "secrets", name: "Secrets Manager", description: "Application secrets" },
  { id: "ssm", name: "Systems Manager", description: "Private instance administration" },
  { id: "cloudwatch", name: "CloudWatch", description: "Logs and operational telemetry" },
];

const patterns: Record<
  Pattern,
  {
    title: string;
    summary: string;
    required: Id[];
    optional: Id[];
    explanation: string;
  }
> = {
  ec2: {
    title: "ALB + EC2",
    summary: "Classic multi-AZ private application tier.",
    required: ["vpc", "igw", "public-a", "public-b", "private-a", "private-b", "nat-a", "nat-b", "alb", "ec2", "sg"],
    optional: ["waf", "shield", "rds", "db-a", "db-b", "ssm", "iam", "secrets", "cloudwatch"],
    explanation: "Internet-facing ALB in public subnets distributes traffic to private EC2 workloads across two Availability Zones. Private subnets use AZ-local NAT Gateways for outbound connectivity.",
  },
  ecs: {
    title: "ALB + ECS/Fargate",
    summary: "Containerized private application behind a managed ALB.",
    required: ["vpc", "igw", "public-a", "public-b", "private-a", "private-b", "nat-a", "nat-b", "alb", "ecs", "sg", "iam"],
    optional: ["waf", "shield", "rds", "db-a", "db-b", "secrets", "cloudwatch"],
    explanation: "Internet-facing ALB provides customer ingress while ECS/Fargate tasks remain private and span two Availability Zones. IAM provides workload identity.",
  },
  lambda: {
    title: "API Gateway + Lambda",
    summary: "Serverless API ingress and compute path.",
    required: ["apigw", "lambda"],
    optional: ["waf", "shield", "iam", "secrets", "cloudwatch", "vpc", "private-a", "private-b", "sg", "rds", "db-a", "db-b"],
    explanation: "API Gateway is the public API entry point and Lambda provides serverless compute. A VPC is optional when Lambda must reach private resources.",
  },
  "ecs-vpclink": {
    title: "API Gateway + ECS",
    summary: "Managed API ingress into a private container service.",
    required: ["vpc", "private-a", "private-b", "apigw", "vpclink", "ecs", "sg"],
    optional: ["nat-a", "nat-b", "igw", "waf", "shield", "iam", "secrets", "cloudwatch", "rds", "db-a", "db-b"],
    explanation: "API Gateway provides the Internet-facing API endpoint and VPC Link provides private integration into ECS. ECS remains in private subnets.",
  },
};

export default function AwsVpcResults() {
  const [data, setData] = useState<{ pattern: Pattern; selected: Id[] } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cloudops-vpc-result");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.pattern && Array.isArray(parsed?.selected)) {
          setData(parsed);
        }
      }
    } catch {
      // Ignore malformed session data.
    }
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-[#03060b] text-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-2xl border border-white/10 bg-[#070c13] p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">LAB_01 / AWS</p>
            <h1 className="mt-3 text-2xl font-bold">No assessment result found</h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Start the AWS VPC assessment and submit an architecture before opening the results page.
            </p>
            <a
              href="/labs/aws-vpc"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-xs font-bold text-[#021018]"
            >
              Start VPC Assessment →
            </a>
          </div>
        </div>
      </main>
    );
  }

  const pattern = patterns[data.pattern];
  const selected = data.selected;

  const evaluation = useMemo(() => {
    const requiredHits = pattern.required.filter((id) => selected.includes(id));
    const optionalHits = pattern.optional.filter((id) => selected.includes(id));
    const unnecessary = selected.filter(
      (id) => !pattern.required.includes(id) && !pattern.optional.includes(id),
    );

    const requiredScore =
      pattern.required.length === 0
        ? 0
        : Math.round((requiredHits.length / pattern.required.length) * 80);

    const optionalScore = optionalHits.length > 0 ? 10 : 0;
    const cleanlinessScore = unnecessary.length === 0 ? 10 : 0;
    const score = Math.min(100, requiredScore + optionalScore + cleanlinessScore);

    return {
      requiredHits,
      optionalHits,
      unnecessary,
      score,
      complete: requiredHits.length === pattern.required.length && unnecessary.length === 0,
    };
  }, [pattern, selected]);

  const missing = pattern.required.filter((id) => !selected.includes(id));

  const resetAndRetry = () => {
    sessionStorage.removeItem("cloudops-vpc-result");
    window.location.href = "/labs/aws-vpc";
  };

  const goTerraform = () => {
    sessionStorage.removeItem("cloudops-vpc-result");
    window.location.href = "/labs/terraform";
  };

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <header className="border-b border-white/[0.08] bg-[#03060b]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <a href="/" className="text-xs text-gray-600 hover:text-white">← CloudOps SimLab</a>
            <div className="mt-3 flex items-center gap-3">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-400">ASSESSMENT RESULT · LAB_01</div>
                <h1 className="mt-1 text-xl font-semibold">AWS VPC Architecture</h1>
              </div>
              <span className="rounded-md border border-cyan-400/20 bg-cyan-400/[0.06] px-2 py-1 text-[8px] uppercase tracking-wider text-cyan-300">
                Practice
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-white/10 bg-[#070c13] p-7">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">Final architecture score</div>
                <div className="mt-3 text-6xl font-bold tracking-tight">
                  {evaluation.score}
                  <span className="ml-2 text-sm font-normal text-gray-600">/ 100</span>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {evaluation.complete
                    ? "Architecture satisfies the required production pattern."
                    : "Architecture submitted for evaluation. Review the expected architecture below."}
                </p>
              </div>

              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-5 py-4">
                <div className="text-[9px] uppercase tracking-[0.18em] text-cyan-300">Selected pattern</div>
                <div className="mt-1 text-sm font-semibold">{pattern.title}</div>
                <div className="mt-1 text-[10px] text-gray-600">{pattern.summary}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Required" value={`${evaluation.requiredHits.length}/${pattern.required.length}`} />
            <Stat label="Optional selected" value={`${evaluation.optionalHits.length}`} />
            <Stat label="Missing" value={`${missing.length}`} />
            <Stat label="Unnecessary" value={`${evaluation.unnecessary.length}`} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-8 lg:grid-cols-2">
        <Panel title="Your submission">
          <div className="flex flex-wrap gap-2">
            {selected.length ? (
              selected.map((id) => (
                <span
                  key={id}
                  className={`rounded-lg border px-3 py-2 text-[10px] ${
                    pattern.required.includes(id)
                      ? "border-emerald-400/20 bg-emerald-400/[0.04] text-emerald-300"
                      : pattern.optional.includes(id)
                        ? "border-cyan-400/20 bg-cyan-400/[0.04] text-cyan-300"
                        : "border-red-400/20 bg-red-400/[0.04] text-red-300"
                  }`}
                >
                  {resourceName(id)}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-600">No resources selected.</span>
            )}
          </div>
        </Panel>

        <Panel title="Assessment findings">
          <Finding ok={missing.length === 0}>
            {missing.length === 0
              ? "All required components were selected."
              : `${missing.length} required component(s) are missing.`}
          </Finding>

          <Finding ok={evaluation.unnecessary.length === 0}>
            {evaluation.unnecessary.length === 0
              ? "No components outside the selected production pattern were added."
              : `${evaluation.unnecessary.length} component(s) are outside the selected production pattern.`}
          </Finding>

          <Finding ok={evaluation.optionalHits.length > 0}>
            {evaluation.optionalHits.length > 0
              ? `${evaluation.optionalHits.length} optional production component(s) selected.`
              : "No optional production components selected."}
          </Finding>
        </Panel>

        <div className="lg:col-span-2">
          <Panel title={`Expected production architecture — ${pattern.title}`}>
            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5">
              <p className="text-sm leading-7 text-gray-400">{pattern.explanation}</p>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <AnswerList title="Required components" ids={pattern.required} tone="required" />
              <AnswerList title="Optional production components" ids={pattern.optional} tone="optional" />
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel title="What you missed">
            {missing.length ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {missing.map((id) => (
                  <div key={id} className="rounded-xl border border-amber-400/15 bg-amber-400/[0.025] p-3">
                    <div className="text-xs font-semibold text-amber-200">{resourceName(id)}</div>
                    <div className="mt-1 text-[9px] leading-4 text-gray-600">
                      Required for the selected production pattern.
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.025] p-4 text-sm text-emerald-300">
                Nothing required was missed.
              </div>
            )}
          </Panel>
        </div>
      </section>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 sm:flex-row sm:justify-between">
          <button
            onClick={resetAndRetry}
            className="rounded-xl border border-white/10 px-5 py-3 text-xs font-semibold text-gray-300 hover:border-cyan-400/20 hover:text-white"
          >
            ← Retry VPC Assessment
          </button>

          <button
            onClick={goTerraform}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-xs font-bold text-[#021018] hover:brightness-110"
          >
            Continue to Terraform Assessment →
          </button>
        </div>
      </footer>
    </main>
  );
}

function resourceName(id: Id) {
  return resources.find((r) => r.id === id)?.name ?? id;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#070c13] p-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-600">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#070c13] p-5">
      <div className="mb-4 text-[9px] uppercase tracking-[0.2em] text-cyan-400">{title}</div>
      {children}
    </div>
  );
}

function Finding({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className={`mb-2 rounded-xl border p-3 text-xs ${
      ok
        ? "border-emerald-400/15 bg-emerald-400/[0.025] text-emerald-300"
        : "border-red-400/15 bg-red-400/[0.025] text-red-300"
    }`}>
      {ok ? "✓" : "×"} {children}
    </div>
  );
}

function AnswerList({
  title,
  ids,
  tone,
}: {
  title: string;
  ids: Id[];
  tone: "required" | "optional";
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-gray-300">{title}</div>
      <div className="space-y-1.5">
        {ids.map((id) => (
          <div
            key={id}
            className={`rounded-lg border px-3 py-2 text-[10px] ${
              tone === "required"
                ? "border-emerald-400/15 bg-emerald-400/[0.025] text-emerald-300"
                : "border-cyan-400/10 bg-cyan-400/[0.02] text-cyan-300"
            }`}
          >
            {tone === "required" ? "✓" : "•"} {resourceName(id)}
          </div>
        ))}
      </div>
    </div>
  );
}
