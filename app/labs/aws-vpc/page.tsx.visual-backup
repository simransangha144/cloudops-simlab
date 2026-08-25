"use client";

import { useMemo, useState } from "react";

type Group =
  | "network"
  | "subnets"
  | "load"
  | "compute"
  | "api"
  | "data"
  | "routing"
  | "security"
  | "access";

type ComponentId = string;
type Link = { from: ComponentId; to: ComponentId };

type Item = {
  id: ComponentId;
  name: string;
  group: Group;
  description: string;
  tags?: string[];
};

type PatternId = "alb-ec2" | "alb-ecs" | "api-lambda" | "api-ecs";

type Pattern = {
  id: PatternId;
  name: string;
  short: string;
  description: string;
  required: string[];
  forbidden: string[];
  links: [string, string][];
  decisions: Record<string, string>;
};

const inventory: Item[] = [
  // NETWORK
  { id: "vpc", name: "VPC", group: "network", description: "Isolated virtual network" },
  { id: "igw", name: "Internet Gateway", group: "network", description: "Internet path for public IPv4 resources" },
  { id: "egress-igw", name: "Egress-Only Internet Gateway", group: "network", description: "IPv6-only outbound Internet path" },
  { id: "nat-a", name: "NAT Gateway — AZ-A", group: "network", description: "Private IPv4 outbound connectivity in AZ-A" },
  { id: "nat-b", name: "NAT Gateway — AZ-B", group: "network", description: "Private IPv4 outbound connectivity in AZ-B" },
  { id: "nat-instance", name: "NAT Instance", group: "network", description: "Legacy EC2-based NAT implementation" },
  { id: "tgw", name: "Transit Gateway", group: "network", description: "Hub for multiple VPCs and networks" },
  { id: "peering", name: "VPC Peering", group: "network", description: "Point-to-point private VPC connectivity" },

  // SUBNETS
  { id: "public-a", name: "Public Subnet — AZ-A", group: "subnets", description: "Internet-facing subnet in AZ-A" },
  { id: "public-b", name: "Public Subnet — AZ-B", group: "subnets", description: "Internet-facing subnet in AZ-B" },
  { id: "private-a", name: "Private App Subnet — AZ-A", group: "subnets", description: "Private application workload subnet" },
  { id: "private-b", name: "Private App Subnet — AZ-B", group: "subnets", description: "Private application workload subnet" },
  { id: "db-a", name: "Database Subnet — AZ-A", group: "subnets", description: "Private database tier subnet" },
  { id: "db-b", name: "Database Subnet — AZ-B", group: "subnets", description: "Private database tier subnet" },
  { id: "isolated", name: "Isolated Subnet", group: "subnets", description: "Subnet with no Internet route" },

  // LOAD / API
  { id: "alb", name: "Application Load Balancer", group: "load", description: "Layer-7 HTTP/HTTPS application entry point" },
  { id: "nlb", name: "Network Load Balancer", group: "load", description: "Layer-4 load balancer for TCP/UDP workloads" },
  { id: "gwlb", name: "Gateway Load Balancer", group: "load", description: "Traffic insertion for security appliances" },
  { id: "api-gateway", name: "API Gateway", group: "api", description: "Managed public API front door" },
  { id: "vpc-link", name: "API Gateway VPC Link", group: "api", description: "Private API Gateway connectivity to VPC services" },

  // COMPUTE
  { id: "ec2", name: "EC2 Instance", group: "compute", description: "Application compute workload" },
  { id: "public-ec2", name: "Public EC2 Instance", group: "compute", description: "EC2 with direct Internet exposure" },
  { id: "asg", name: "Auto Scaling Group", group: "compute", description: "Maintains compute capacity across AZs" },
  { id: "ecs", name: "ECS / Fargate Service", group: "compute", description: "Managed containerized application service" },
  { id: "lambda", name: "Lambda Function", group: "compute", description: "Serverless application compute" },

  // DATA / OTHER
  { id: "rds", name: "Amazon RDS", group: "data", description: "Managed relational database" },
  { id: "redis", name: "ElastiCache / Redis", group: "data", description: "Managed in-memory cache" },
  { id: "s3-endpoint", name: "S3 Gateway Endpoint", group: "data", description: "Private VPC access to S3" },
  { id: "efs", name: "EFS File System", group: "data", description: "Shared network file storage" },

  // ROUTING
  { id: "public-rt", name: "Public Route Table", group: "routing", description: "Routes public subnets toward the Internet Gateway" },
  { id: "private-rt-a", name: "Private Route Table — AZ-A", group: "routing", description: "Private routing for AZ-A" },
  { id: "private-rt-b", name: "Private Route Table — AZ-B", group: "routing", description: "Private routing for AZ-B" },
  { id: "nacl", name: "Network ACL", group: "routing", description: "Subnet-level stateless filtering" },
  { id: "prefix-list", name: "Managed Prefix List", group: "routing", description: "Reusable CIDR collection" },

  // SECURITY / ACCESS
  { id: "sg", name: "Security Group", group: "security", description: "Stateful workload traffic control" },
  { id: "waf", name: "AWS WAF", group: "security", description: "Managed web application firewall" },
  { id: "shield", name: "AWS Shield", group: "security", description: "DDoS protection service" },
  { id: "ssm", name: "AWS Systems Manager", group: "access", description: "Secure administration without public SSH" },
  { id: "bastion", name: "Bastion Host", group: "access", description: "Jump host for administrative access" },
  { id: "iam", name: "IAM Role", group: "access", description: "Workload identity and permissions" },
  { id: "cloudwatch", name: "CloudWatch Logs", group: "access", description: "Application and infrastructure observability" },
  { id: "secrets", name: "Secrets Manager", group: "access", description: "Managed secret storage" },
];

const sections: [Group, string][] = [
  ["network", "NETWORK"],
  ["subnets", "SUBNETS"],
  ["load", "LOAD BALANCING"],
  ["api", "API FRONT DOOR"],
  ["compute", "COMPUTE"],
  ["data", "DATA & STORAGE"],
  ["routing", "ROUTING"],
  ["security", "SECURITY"],
  ["access", "ACCESS & MANAGEMENT"],
];

const commonNetwork = [
  "vpc",
  "igw",
  "public-a",
  "public-b",
  "private-a",
  "private-b",
  "nat-a",
  "nat-b",
  "public-rt",
  "private-rt-a",
  "private-rt-b",
  "sg",
];

const patterns: Pattern[] = [
  {
    id: "alb-ec2",
    name: "ALB + EC2",
    short: "Traditional VPC application",
    description: "Internet-facing ALB distributes traffic to private EC2 application workloads across two AZs.",
    required: [...commonNetwork, "alb", "ec2", "ssm"],
    forbidden: ["public-ec2", "nat-instance"],
    links: [
      ["vpc", "igw"],
      ["igw", "public-rt"],
      ["public-a", "public-rt"],
      ["public-b", "public-rt"],
      ["public-a", "alb"],
      ["public-b", "alb"],
      ["alb", "private-a"],
      ["alb", "private-b"],
      ["private-a", "private-rt-a"],
      ["private-b", "private-rt-b"],
      ["private-rt-a", "nat-a"],
      ["private-rt-b", "nat-b"],
      ["nat-a", "igw"],
      ["nat-b", "igw"],
      ["private-a", "ec2"],
      ["private-b", "ec2"],
      ["ssm", "ec2"],
    ],
    decisions: {
      entry: "Application Load Balancer",
      compute: "Private application subnets",
      admin: "AWS Systems Manager",
      outbound: "NAT Gateway",
      public: "ALB only",
    },
  },
  {
    id: "alb-ecs",
    name: "ALB + ECS/Fargate",
    short: "Managed container application",
    description: "Internet-facing ALB routes to private ECS/Fargate tasks spread across two AZs.",
    required: [...commonNetwork, "alb", "ecs"],
    forbidden: ["public-ec2", "ec2", "nat-instance"],
    links: [
      ["vpc", "igw"],
      ["igw", "public-rt"],
      ["public-a", "public-rt"],
      ["public-b", "public-rt"],
      ["public-a", "alb"],
      ["public-b", "alb"],
      ["alb", "private-a"],
      ["alb", "private-b"],
      ["private-a", "private-rt-a"],
      ["private-b", "private-rt-b"],
      ["private-rt-a", "nat-a"],
      ["private-rt-b", "nat-b"],
      ["nat-a", "igw"],
      ["nat-b", "igw"],
      ["private-a", "ecs"],
      ["private-b", "ecs"],
    ],
    decisions: {
      entry: "Application Load Balancer",
      compute: "Private application subnets",
      admin: "ECS Exec / service-native access",
      outbound: "NAT Gateway",
      public: "ALB only",
    },
  },
  {
    id: "api-lambda",
    name: "API Gateway + Lambda",
    short: "Serverless API",
    description: "Managed API Gateway exposes the API and invokes Lambda without public application servers.",
    required: ["api-gateway", "lambda", "iam"],
    forbidden: ["public-ec2", "alb", "ec2", "ecs", "nat-instance"],
    links: [
      ["api-gateway", "lambda"],
      ["lambda", "iam"],
    ],
    decisions: {
      entry: "API Gateway",
      compute: "Lambda",
      admin: "No instance administration",
      outbound: "Managed service / VPC integration only when required",
      public: "API Gateway only",
    },
  },
  {
    id: "api-ecs",
    name: "API Gateway + ECS",
    short: "Private container API",
    description: "API Gateway uses VPC Link to reach an ECS service kept private inside the VPC.",
    required: [
      ...commonNetwork,
      "api-gateway",
      "vpc-link",
      "ecs",
    ],
    forbidden: ["public-ec2", "ec2", "alb", "nat-instance"],
    links: [
      ["vpc", "igw"],
      ["igw", "public-rt"],
      ["public-a", "public-rt"],
      ["public-b", "public-rt"],
      ["private-a", "private-rt-a"],
      ["private-b", "private-rt-b"],
      ["private-rt-a", "nat-a"],
      ["private-rt-b", "nat-b"],
      ["nat-a", "igw"],
      ["nat-b", "igw"],
      ["api-gateway", "vpc-link"],
      ["vpc-link", "ecs"],
      ["private-a", "ecs"],
      ["private-b", "ecs"],
    ],
    decisions: {
      entry: "API Gateway",
      compute: "Private application subnets",
      admin: "ECS Exec / service-native access",
      outbound: "NAT Gateway",
      public: "API Gateway only",
    },
  },
];

const decisionOptions: Record<string, string[]> = {
  entry: ["Application Load Balancer", "API Gateway", "Internet Gateway", "Public EC2"],
  compute: ["Private application subnets", "Public subnets", "Database subnets", "Lambda"],
  admin: ["AWS Systems Manager", "ECS Exec / service-native access", "SSH from the Internet", "Public bastion only", "No instance administration"],
  outbound: ["NAT Gateway", "Internet Gateway directly", "NAT Instance", "Managed service / VPC integration only when required"],
  public: ["ALB only", "API Gateway only", "ALB and application servers", "Application servers only", "Nothing"],
};

const pairKey = (a: string, b: string) => [a, b].sort().join("::");

function getPattern(id: PatternId) {
  return patterns.find((p) => p.id === id)!;
}

export default function AwsVpcAssessment() {
  const [pattern, setPattern] = useState<PatternId | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [connect, setConnect] = useState(false);
  const [first, setFirst] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");

  const activePattern = pattern ? getPattern(pattern) : null;

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sections
      .map(([group, label]) => ({
        label,
        items: inventory.filter(
          (x) =>
            x.group === group &&
            (!q ||
              x.name.toLowerCase().includes(q) ||
              x.description.toLowerCase().includes(q))
        ),
      }))
      .filter((x) => x.items.length);
  }, [search]);

  const evaluation = useMemo(() => {
    if (!activePattern) {
      return {
        required: 0,
        requiredTotal: 0,
        unnecessary: selected.length,
        forbidden: 0,
        correctLinks: 0,
        requiredLinks: 0,
        decisions: 0,
        decisionTotal: 5,
        score: 0,
      };
    }

    const requiredCount = activePattern.required.filter((id) => selected.includes(id)).length;
    const unnecessary = selected.filter((id) => !activePattern.required.includes(id));
    const forbidden = selected.filter((id) => activePattern.forbidden.includes(id));
    const requiredLinks = activePattern.links.map(([from, to]) => pairKey(from, to));
    const correctLinks = links.filter((l) => requiredLinks.includes(pairKey(l.from, l.to)));
    const decisions = Object.entries(activePattern.decisions).filter(
      ([key, expected]) => answers[key] === expected
    ).length;

    const componentScore =
      (requiredCount / activePattern.required.length) * 35;

    const connectionScore =
      (correctLinks.length / requiredLinks.length) * 40;

    const decisionScore = (decisions / 5) * 25;

    const penalties =
      Math.min(15, unnecessary.length * 1.5) +
      Math.min(15, forbidden.length * 5);

    return {
      required: requiredCount,
      requiredTotal: activePattern.required.length,
      unnecessary: unnecessary.length,
      forbidden: forbidden.length,
      correctLinks: correctLinks.length,
      requiredLinks: requiredLinks.length,
      decisions,
      decisionTotal: 5,
      score: Math.max(
        0,
        Math.min(100, Math.round(componentScore + connectionScore + decisionScore - penalties))
      ),
    };
  }, [activePattern, selected, links, answers]);

  function choosePattern(id: PatternId) {
    if (submitted) return;
    setPattern(id);
    setSelected([]);
    setLinks([]);
    setAnswers({});
    setConnect(false);
    setFirst(null);
  }

  function clickItem(id: string) {
    if (submitted || !activePattern) return;

    if (connect) {
      if (!selected.includes(id)) return;
      if (!first) {
        setFirst(id);
        return;
      }
      if (first === id) {
        setFirst(null);
        return;
      }

      const next = { from: first, to: id };
      if (!links.some((l) => pairKey(l.from, l.to) === pairKey(next.from, next.to))) {
        setLinks((current) => [...current, next]);
      }
      setFirst(null);
      return;
    }

    setSelected((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );
  }

  function remove(id: string) {
    if (submitted) return;
    setSelected((current) => current.filter((x) => x !== id));
    setLinks((current) => current.filter((l) => l.from !== id && l.to !== id));
  }

  const complete =
    !!activePattern &&
    evaluation.required === evaluation.requiredTotal &&
    evaluation.forbidden === 0 &&
    evaluation.correctLinks === evaluation.requiredLinks &&
    evaluation.decisions === evaluation.decisionTotal;

  if (submitted && activePattern) {
    const unnecessaryIds = selected.filter(
      (id) => !activePattern.required.includes(id)
    );

    return (
      <main className="min-h-screen bg-[#050810] text-white">
        <Header locked pattern={activePattern.name} />
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="text-[10px] uppercase tracking-[.22em] text-blue-400">
              Architecture Result
            </p>
            <div className="mt-3 rounded-2xl border border-white/10 bg-[#0b111b] p-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-6xl font-semibold tracking-tight">
                    {evaluation.score}
                    <span className="ml-2 text-sm text-gray-600">/ 100</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    {complete
                      ? "Architecture satisfies the selected production pattern."
                      : "Architecture submitted for evaluation."}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-400/20 bg-blue-500/[.04] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-wider text-blue-300">
                    Selected pattern
                  </p>
                  <p className="mt-1 text-sm font-semibold">{activePattern.name}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Stat label="Required components" value={`${evaluation.required}/${evaluation.requiredTotal}`} />
              <Stat label="Correct connections" value={`${evaluation.correctLinks}/${evaluation.requiredLinks}`} />
              <Stat label="Decisions" value={`${evaluation.decisions}/5`} />
              <Stat label="Unnecessary" value={`${evaluation.unnecessary}`} />
              <Stat label="Forbidden" value={`${evaluation.forbidden}`} />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-6 py-8 md:grid-cols-2">
          <Panel title="Architecture Findings">
            <Finding ok={evaluation.required === evaluation.requiredTotal}>
              {evaluation.required === evaluation.requiredTotal
                ? "All required components for the selected pattern were selected."
                : `${evaluation.requiredTotal - evaluation.required} required component(s) are missing.`}
            </Finding>
            <Finding ok={evaluation.correctLinks === evaluation.requiredLinks}>
              {evaluation.requiredLinks - evaluation.correctLinks} required connection(s) are missing.
            </Finding>
            <Finding ok={evaluation.unnecessary === 0}>
              {evaluation.unnecessary} unnecessary component(s) were selected.
            </Finding>
            <Finding ok={evaluation.forbidden === 0}>
              {evaluation.forbidden} explicitly unsafe component(s) were selected.
            </Finding>
          </Panel>

          <Panel title="Submitted Components">
            <div className="space-y-1.5">
              {selected.map((id) => {
                const required = activePattern.required.includes(id);
                const forbidden = activePattern.forbidden.includes(id);
                return (
                  <div
                    key={id}
                    className={`rounded-md border px-3 py-2 text-[10px] ${
                      forbidden
                        ? "border-red-500/30 text-red-300"
                        : required
                          ? "border-emerald-500/30 text-emerald-300"
                          : "border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {forbidden ? "×" : required ? "✓" : "•"} {name(id)}
                  </div>
                );
              })}
            </div>
          </Panel>

          <div className="md:col-span-2">
            <Panel title="Architecture Decision Results">
              {Object.entries(activePattern.decisions).map(([key, expected]) => {
                const answer = answers[key] || "Not answered";
                const ok = answer === expected;
                return (
                  <div
                    key={key}
                    className={`mb-2 rounded-lg border p-3 ${
                      ok ? "border-emerald-500/20" : "border-red-500/20"
                    }`}
                  >
                    <p className="text-[10px]">
                      {ok ? "✓" : "×"} {decisionLabel(key)}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-600">
                      Your answer: {answer}
                    </p>
                    {!ok && (
                      <p className="mt-1 text-[10px] text-gray-600">
                        Expected for {activePattern.name}: {expected}
                      </p>
                    )}
                  </div>
                );
              })}
            </Panel>
          </div>

          {unnecessaryIds.length > 0 && (
            <div className="md:col-span-2 rounded-xl border border-amber-400/20 bg-amber-400/[.025] p-4 text-[10px] text-gray-500">
              <span className="font-semibold text-amber-300">Engineering note:</span>{" "}
              resources outside the selected pattern are not automatically bad in every
              real-world system. This lab scores whether they belong in the architecture
              you chose for this scenario.
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050810] text-white">
      <Header pattern={activePattern?.name} />

      <section className="border-b border-white/10 bg-[#090e17]">
        <div className="mx-auto max-w-7xl px-6 py-9">
          <p className="text-[10px] uppercase tracking-[.22em] text-blue-400">
            Networking Assessment · LAB_01
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Design a production-grade API architecture
          </h2>
          <p className="mt-3 max-w-5xl text-sm leading-7 text-gray-400">
            You are designing infrastructure for a customer-facing API. The application
            must be highly available where the chosen architecture requires multiple
            Availability Zones. Public application workloads must never receive public
            IP addresses. Customers must be able to reach the API from the Internet,
            and private workloads must have appropriate administrative and outbound
            connectivity. Choose an architecture pattern, then prove the design with
            components, relationships, and engineering decisions.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <Requirement label="Multiple valid architectures" />
            <Requirement label="No public application workloads" />
            <Requirement label="Architecture-aware scoring" />
            <Requirement label="Practice mode — unlimited attempts" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-7">
        <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[.035] p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-blue-300">
                Step 01 · Choose your architecture
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                There is more than one correct AWS answer.
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Select the delivery pattern you are going to defend. The scoring engine
                changes its valid components and connections accordingly.
              </p>
            </div>
            <span className="rounded-full border border-blue-400/20 px-3 py-1.5 text-[9px] uppercase tracking-wider text-blue-300">
              Pattern-aware
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {patterns.map((p) => {
              const active = p.id === pattern;
              return (
                <button
                  key={p.id}
                  onClick={() => choosePattern(p.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-blue-400/60 bg-blue-500/[.09] shadow-lg shadow-blue-950/20"
                      : "border-white/10 bg-white/[.015] hover:-translate-y-0.5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-300">
                      {p.short}
                    </span>
                    <span className="text-[9px] text-gray-600">
                      {active ? "SELECTED" : "SELECT"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{p.name}</h3>
                  <p className="mt-2 text-[10px] leading-5 text-gray-500">
                    {p.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {!activePattern ? (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[.01] p-14 text-center">
            <div className="text-4xl text-gray-700">◇</div>
            <h3 className="mt-4 text-sm font-semibold">Choose a pattern to begin</h3>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-gray-600">
              The inventory intentionally contains plausible alternatives and decoys.
              The selected architecture pattern determines which choices are valid.
            </p>
          </div>
        </section>
      ) : (
        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-7 lg:grid-cols-[360px_1fr]">
          <aside>
            <div className="mb-4 flex justify-between">
              <div>
                <h2 className="text-sm font-semibold">Component Inventory</h2>
                <p className="mt-1 text-[11px] text-gray-500">
                  Select the resources you believe belong in the architecture.
                </p>
              </div>
              <span className="text-[10px] text-gray-600">
                {selected.length}/{inventory.length}
              </span>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="mb-4 w-full rounded-lg border border-white/10 bg-white/[.02] px-3 py-2.5 text-xs outline-none placeholder:text-gray-600"
            />

            <div className="max-h-[760px] space-y-5 overflow-y-auto pr-2">
              {visible.map((section) => (
                <div key={section.label}>
                  <p className="mb-2 text-[10px] font-semibold tracking-[.16em] text-gray-600">
                    {section.label}
                  </p>
                  <div className="space-y-1.5">
                    {section.items.map((c) => {
                      const active = selected.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => clickItem(c.id)}
                          className={`w-full rounded-md border px-3 py-2.5 text-left transition ${
                            active
                              ? "border-blue-400/50 bg-blue-500/[.07]"
                              : "border-white/[.07] bg-white/[.015] hover:border-white/20"
                          }`}
                        >
                          <div className="flex justify-between gap-2">
                            <span className="text-xs font-medium">{c.name}</span>
                            <span
                              className={`text-[9px] uppercase ${
                                active ? "text-blue-400" : "text-gray-700"
                              }`}
                            >
                              {active ? "Selected" : "Add"}
                            </span>
                          </div>
                          <p className="mt-1 text-[10px] text-gray-600">
                            {c.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold">Architecture Canvas</h2>
                <p className="mt-1 text-[10px] text-gray-600">
                  VPC: 10.0.0.0/16 · Region: us-east-1 · Pattern: {activePattern.name}
                </p>
              </div>
              <button
                disabled={selected.length < 2}
                onClick={() => {
                  setConnect(!connect);
                  setFirst(null);
                }}
                className={`rounded-lg border px-4 py-2 text-xs ${
                  connect
                    ? "border-blue-400/50 bg-blue-500/10 text-blue-300"
                    : "border-white/10 text-gray-400"
                } disabled:opacity-40`}
              >
                {connect ? "Exit Connect Mode" : "Connect Components"}
              </button>
            </div>

            {connect && (
              <div className="mb-3 rounded-lg border border-blue-400/20 bg-blue-400/[.04] px-4 py-3 text-[11px] text-blue-200">
                {first
                  ? `Selected: ${name(first)}. Now select the second component.`
                  : "Select the first component, then the second."}
              </div>
            )}

            <div className="min-h-[500px] rounded-xl border border-white/10 bg-[#0b111b] p-5">
              <div className="rounded-lg border border-blue-400/15 bg-blue-400/[.015] p-5">
                <div className="flex justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-blue-400">AWS_VPC</span>
                    <h3 className="mt-1 text-sm font-semibold">10.0.0.0/16</h3>
                  </div>
                  <span className="rounded border border-white/10 px-2 py-1 text-[9px] text-gray-600">
                    us-east-1
                  </span>
                </div>

                {selected.length === 0 ? (
                  <div className="flex min-h-[390px] items-center justify-center text-center">
                    <div>
                      <div className="text-4xl text-gray-700">⌘</div>
                      <p className="mt-3 text-xs text-gray-500">
                        Select resources from the inventory to build your architecture.
                      </p>
                      <p className="mt-1 text-[10px] text-gray-700">
                        Incorrect selections are not highlighted before submission.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {selected.map((id) => {
                      const c = inventory.find((x) => x.id === id)!;
                      return (
                        <div
                          key={id}
                          onClick={() => clickItem(id)}
                          className={`cursor-pointer rounded-lg border p-4 ${
                            first === id
                              ? "border-blue-400/60 bg-blue-500/[.08]"
                              : "border-white/10 bg-white/[.015] hover:border-white/20"
                          }`}
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="text-xs font-medium">{c.name}</p>
                              <p className="mt-1 text-[9px] uppercase text-gray-700">
                                {c.group}
                              </p>
                            </div>
                            {!connect && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  remove(id);
                                }}
                                className="text-[9px] text-gray-700 hover:text-white"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="mt-3 text-[10px] text-gray-600">
                            {c.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {links.length > 0 && (
                  <div className="mt-5 border-t border-white/[.06] pt-4">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-600">
                      Connections
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {links.map((l, i) => {
                        const correct = activePattern.links.some(
                          ([a, b]) => pairKey(a, b) === pairKey(l.from, l.to)
                        );
                        return (
                          <span
                            key={i}
                            className={`rounded-md border px-3 py-2 text-[10px] ${
                              correct
                                ? "border-emerald-500/20 text-gray-500"
                                : "border-white/10 text-gray-500"
                            }`}
                          >
                            {name(l.from)} → {name(l.to)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-[#0b111b] p-5">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Architecture Decisions</h2>
                  <p className="mt-1 text-[10px] text-gray-600">
                    Questions are evaluated against your selected pattern.
                  </p>
                </div>
                <span className="text-[10px] text-gray-600">
                  {Object.keys(answers).length}/5
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {Object.keys(decisionOptions).map((key, i) => (
                  <label
                    key={key}
                    className="block rounded-lg border border-white/[.07] p-3"
                  >
                    <span className="text-[11px]">
                      {i + 1}. {decisionLabel(key)}
                    </span>
                    <select
                      value={answers[key] || ""}
                      onChange={(e) =>
                        setAnswers((x) => ({ ...x, [key]: e.target.value }))
                      }
                      className="mt-2 w-full rounded-md border border-white/10 bg-[#0b111b] px-3 py-2 text-[10px] text-gray-300"
                    >
                      <option value="">Select an answer</option>
                      {decisionOptions[key].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-blue-400/20 bg-blue-400/[.03] p-4">
                <p className="text-[10px] font-semibold text-blue-300">
                  Candidate Workflow
                </p>
                <ol className="mt-2 space-y-1 text-[10px] text-gray-500">
                  <li>01 — Choose an architecture pattern.</li>
                  <li>02 — Select the resources you would deploy.</li>
                  <li>03 — Connect the major relationships.</li>
                  <li>04 — Answer the architecture decisions.</li>
                  <li>05 — Submit and review the score.</li>
                </ol>
              </div>

              <div className="rounded-xl border border-amber-400/20 bg-amber-400/[.025] p-4">
                <p className="text-[10px] font-semibold text-amber-300">
                  Assessment Rules
                </p>
                <ul className="mt-2 space-y-1 text-[10px] text-gray-500">
                  <li>• Multiple production patterns are valid.</li>
                  <li>• Decoy resources intentionally remain in the inventory.</li>
                  <li>• No correctness feedback is shown before submission.</li>
                  <li>• This is currently practice mode — submit as many times as needed.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(true)}
              className="mt-5 w-full rounded-lg bg-blue-500 px-5 py-3 text-xs font-semibold shadow-lg shadow-blue-950/20 transition hover:bg-blue-400"
            >
              Submit Architecture — Practice Attempt
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function name(id: string) {
  return inventory.find((x) => x.id === id)?.name ?? id;
}

function decisionLabel(key: string) {
  const labels: Record<string, string> = {
    entry: "What should be the Internet-facing API entry point?",
    compute: "Where should application workloads run?",
    admin: "How should administrators access private workloads?",
    outbound: "How should private workloads obtain outbound connectivity?",
    public: "What should be publicly reachable from the Internet?",
  };
  return labels[key] ?? key;
}

function Header({
  locked,
  pattern,
}: {
  locked?: boolean;
  pattern?: string;
}) {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <a href="/" className="text-[10px] text-gray-600 hover:text-white">
            ← CloudOps SimLab
          </a>
          <h1 className="mt-1 text-sm font-semibold">
            AWS VPC Architecture Assessment
          </h1>
          {pattern && (
            <p className="mt-1 text-[9px] uppercase tracking-wider text-blue-400">
              {pattern}
            </p>
          )}
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[10px] uppercase ${
            locked
              ? "border-white/10 text-gray-500"
              : "border-emerald-400/20 text-emerald-300"
          }`}
        >
          {locked ? "Submitted" : "Practice Mode"}
        </span>
      </div>
    </header>
  );
}

function Requirement({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.015] px-3 py-2.5">
      <span className="text-blue-400">✓</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0b111b] p-4">
      <p className="text-[9px] uppercase tracking-wider text-gray-600">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0b111b] p-4">
      <h2 className="text-xs font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Finding({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mb-2 rounded-md border px-3 py-2.5 text-[10px] ${
        ok
          ? "border-emerald-500/20 text-emerald-300"
          : "border-red-500/20 text-red-300"
      }`}
    >
      {ok ? "✓" : "×"} {children}
    </div>
  );
}
