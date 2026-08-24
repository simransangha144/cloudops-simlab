"use client";

import { useEffect, useMemo, useState } from "react";

type Group =
  | "network"
  | "subnets"
  | "load"
  | "compute"
  | "data"
  | "routing"
  | "security"
  | "access";

type Item = {
  id: string;
  name: string;
  group: Group;
  description: string;
};

type Link = {
  from: string;
  to: string;
};

const inventory: Item[] = [
  {
    id: "vpc",
    name: "VPC",
    group: "network",
    description: "Isolated virtual network",
  },
  {
    id: "igw",
    name: "Internet Gateway",
    group: "network",
    description: "Connects public resources to the Internet",
  },
  {
    id: "egress-igw",
    name: "Egress-Only Internet Gateway",
    group: "network",
    description: "IPv6 outbound Internet path",
  },
  {
    id: "nat-a",
    name: "NAT Gateway — AZ-A",
    group: "network",
    description: "Private outbound connectivity in AZ-A",
  },
  {
    id: "nat-b",
    name: "NAT Gateway — AZ-B",
    group: "network",
    description: "Private outbound connectivity in AZ-B",
  },
  {
    id: "nat-instance",
    name: "NAT Instance",
    group: "network",
    description: "EC2-based NAT implementation",
  },
  {
    id: "tgw",
    name: "Transit Gateway",
    group: "network",
    description: "Central hub for multiple networks",
  },
  {
    id: "peering",
    name: "VPC Peering",
    group: "network",
    description: "Private connectivity between VPCs",
  },

  {
    id: "public-a",
    name: "Public Subnet — AZ-A",
    group: "subnets",
    description: "Internet-facing subnet in AZ-A",
  },
  {
    id: "public-b",
    name: "Public Subnet — AZ-B",
    group: "subnets",
    description: "Internet-facing subnet in AZ-B",
  },
  {
    id: "private-a",
    name: "Private App Subnet — AZ-A",
    group: "subnets",
    description: "Application workload subnet in AZ-A",
  },
  {
    id: "private-b",
    name: "Private App Subnet — AZ-B",
    group: "subnets",
    description: "Application workload subnet in AZ-B",
  },
  {
    id: "db-a",
    name: "Database Subnet — AZ-A",
    group: "subnets",
    description: "Database workload subnet",
  },
  {
    id: "db-b",
    name: "Database Subnet — AZ-B",
    group: "subnets",
    description: "Database workload subnet",
  },
  {
    id: "isolated",
    name: "Isolated Subnet",
    group: "subnets",
    description: "Subnet with no Internet route",
  },

  {
    id: "alb",
    name: "Application Load Balancer",
    group: "load",
    description: "HTTP/HTTPS application entry point",
  },
  {
    id: "nlb",
    name: "Network Load Balancer",
    group: "load",
    description: "Layer 4 load balancer",
  },
  {
    id: "gwlb",
    name: "Gateway Load Balancer",
    group: "load",
    description: "Traffic insertion for appliances",
  },

  {
    id: "ec2",
    name: "EC2 Instance",
    group: "compute",
    description: "Application compute instance",
  },
  {
    id: "public-ec2",
    name: "Public EC2 Instance",
    group: "compute",
    description: "EC2 with direct Internet exposure",
  },
  {
    id: "asg",
    name: "Auto Scaling Group",
    group: "compute",
    description: "Maintains application capacity",
  },
  {
    id: "ecs",
    name: "ECS Service",
    group: "compute",
    description: "Containerized application service",
  },
  {
    id: "lambda",
    name: "Lambda Function",
    group: "compute",
    description: "Serverless compute workload",
  },

  {
    id: "rds",
    name: "Amazon RDS",
    group: "data",
    description: "Managed relational database",
  },
  {
    id: "redis",
    name: "ElastiCache / Redis",
    group: "data",
    description: "In-memory application cache",
  },
  {
    id: "s3-endpoint",
    name: "S3 Gateway Endpoint",
    group: "data",
    description: "Private S3 connectivity",
  },
  {
    id: "efs",
    name: "EFS File System",
    group: "data",
    description: "Shared network file storage",
  },

  {
    id: "public-rt",
    name: "Public Route Table",
    group: "routing",
    description: "Public subnet routing",
  },
  {
    id: "private-rt-a",
    name: "Private Route Table — AZ-A",
    group: "routing",
    description: "Private subnet routing in AZ-A",
  },
  {
    id: "private-rt-b",
    name: "Private Route Table — AZ-B",
    group: "routing",
    description: "Private subnet routing in AZ-B",
  },
  {
    id: "nacl",
    name: "Network ACL",
    group: "routing",
    description: "Subnet-level stateless filtering",
  },
  {
    id: "prefix-list",
    name: "Managed Prefix List",
    group: "routing",
    description: "Reusable CIDR collection",
  },

  {
    id: "sg",
    name: "Security Group",
    group: "security",
    description: "Stateful instance-level traffic control",
  },
  {
    id: "waf",
    name: "AWS WAF",
    group: "security",
    description: "Web application firewall",
  },
  {
    id: "shield",
    name: "AWS Shield",
    group: "security",
    description: "DDoS protection",
  },

  {
    id: "ssm",
    name: "AWS Systems Manager",
    group: "access",
    description: "Secure administration of private instances",
  },
  {
    id: "bastion",
    name: "Bastion Host",
    group: "access",
    description: "Jump host for administrative access",
  },
  {
    id: "iam",
    name: "IAM Role",
    group: "access",
    description: "Workload identity and permissions",
  },
  {
    id: "cloudwatch",
    name: "CloudWatch Logs",
    group: "access",
    description: "Infrastructure and application logging",
  },
  {
    id: "secrets",
    name: "Secrets Manager",
    group: "access",
    description: "Managed secret storage",
  },
];

const sections: [Group, string][] = [
  ["network", "NETWORK"],
  ["subnets", "SUBNETS"],
  ["load", "LOAD BALANCING"],
  ["compute", "COMPUTE"],
  ["data", "DATA & STORAGE"],
  ["routing", "ROUTING"],
  ["security", "SECURITY"],
  ["access", "ACCESS & MANAGEMENT"],
];

const required = [
  "vpc",
  "igw",
  "public-a",
  "public-b",
  "private-a",
  "private-b",
  "nat-a",
  "nat-b",
  "alb",
  "public-rt",
  "private-rt-a",
  "private-rt-b",
  "sg",
  "ssm",
];

const requiredLinks: Link[] = [
  { from: "vpc", to: "igw" },
  { from: "igw", to: "public-rt" },
  { from: "public-a", to: "public-rt" },
  { from: "public-b", to: "public-rt" },
  { from: "public-a", to: "alb" },
  { from: "public-b", to: "alb" },
  { from: "alb", to: "private-a" },
  { from: "alb", to: "private-b" },
  { from: "private-a", to: "private-rt-a" },
  { from: "private-b", to: "private-rt-b" },
  { from: "private-rt-a", to: "nat-a" },
  { from: "private-rt-b", to: "nat-b" },
  { from: "nat-a", to: "igw" },
  { from: "nat-b", to: "igw" },
];

const decisions = [
  [
    "alb",
    "Where should the Application Load Balancer live?",
    [
      "Public subnets",
      "Private application subnets",
      "Database subnets",
      "No subnet",
    ],
    "Public subnets",
  ],
  [
    "app",
    "Where should the application servers live?",
    [
      "Public subnets",
      "Private application subnets",
      "Inside the ALB",
      "Internet Gateway",
    ],
    "Private application subnets",
  ],
  [
    "route",
    "What should the private subnet default route target?",
    [
      "Internet Gateway",
      "NAT Gateway",
      "Application Load Balancer",
      "No route",
    ],
    "NAT Gateway",
  ],
  [
    "nat",
    "For production across two AZs, how many NAT Gateways should be used?",
    [
      "One shared NAT Gateway",
      "One NAT Gateway per AZ",
      "One NAT Instance",
      "None",
    ],
    "One NAT Gateway per AZ",
  ],
  [
    "admin",
    "How should administrators access private EC2 instances?",
    [
      "AWS Systems Manager",
      "SSH from the Internet",
      "Public bastion only",
      "ALB",
    ],
    "AWS Systems Manager",
  ],
  [
    "sg",
    "What should the application Security Group allow inbound from?",
    [
      "0.0.0.0/0",
      "The ALB Security Group",
      "The NAT Gateway",
      "The Internet Gateway",
    ],
    "The ALB Security Group",
  ],
  [
    "public",
    "What should be publicly reachable?",
    [
      "ALB only",
      "ALB and application servers",
      "Application servers only",
      "Nothing",
    ],
    "ALB only",
  ],
] as const;

const name = (id: string) =>
  inventory.find((x) => x.id === id)?.name ?? id;

const sameLink = (a: string, b: string, l: Link) =>
  (l.from === a && l.to === b) || (l.from === b && l.to === a);

export default function AwsVpcAssessment() {
  const [selected, setSelected] = useState<string[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [connect, setConnect] = useState(false);
  const [first, setFirst] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cloudops-vpc-assessment") || "null"
      );

      if (saved) {
        setSelected(saved.selected || []);
        setLinks(saved.links || []);
        setAnswers(saved.answers || {});
        setSubmitted(!!saved.submitted);
      }
    } catch {}

    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(
        "cloudops-vpc-assessment",
        JSON.stringify({
          selected,
          links,
          answers,
          submitted,
        })
      );
    }
  }, [ready, selected, links, answers, submitted]);

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

  const score = useMemo(() => {
    const correctComponents = required.filter((x) =>
      selected.includes(x)
    ).length;

    const unnecessary = selected.filter(
      (x) => !required.includes(x)
    ).length;

    const goodLinks = links.filter((l) =>
      requiredLinks.some((r) => sameLink(l.from, l.to, r))
    ).length;

    const goodDecisions = decisions.filter(
      (d) => answers[d[0]] === d[3]
    ).length;

    return Math.max(
      0,
      Math.round(
        (correctComponents / required.length) * 40 +
          (goodLinks / requiredLinks.length) * 35 +
          (goodDecisions / decisions.length) * 25 -
          Math.min(15, unnecessary * 2)
      )
    );
  }, [selected, links, answers]);

  function clickItem(id: string) {
    if (submitted) return;

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

      if (
        !links.some((l) =>
          sameLink(l.from, l.to, {
            from: first,
            to: id,
          })
        )
      ) {
        setLinks((current) => [
          ...current,
          {
            from: first,
            to: id,
          },
        ]);
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

    setLinks((current) =>
      current.filter((l) => l.from !== id && l.to !== id)
    );
  }

  if (!ready) return null;

  if (submitted) {
    const correct = required.filter((x) =>
      selected.includes(x)
    ).length;

    const unnecessary = selected.filter(
      (x) => !required.includes(x)
    );

    const goodLinks = links.filter((l) =>
      requiredLinks.some((r) => sameLink(l.from, l.to, r))
    ).length;

    const goodDecisions = decisions.filter(
      (d) => answers[d[0]] === d[3]
    ).length;

    return (
      <main className="min-h-screen bg-[#050810] text-white">
        <Header locked />

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-400">
                  Assessment Result
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Architecture submitted
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  The assessment is permanently locked for this browser.
                </p>
              </div>

              <div className="text-right">
                <div className="text-6xl font-semibold tracking-tight">
                  {score}
                  <span className="ml-2 text-sm text-gray-700">/100</span>
                </div>

                <div className="mt-2 text-[9px] uppercase tracking-wider text-gray-600">
                  Final Architecture Score
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="Required Components"
                value={`${correct}/${required.length}`}
              />
              <Stat
                label="Correct Connections"
                value={`${goodLinks}/${requiredLinks.length}`}
              />
              <Stat
                label="Architecture Decisions"
                value={`${goodDecisions}/${decisions.length}`}
              />
              <Stat
                label="Unnecessary Components"
                value={`${unnecessary.length}`}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-6 py-8 md:grid-cols-2">
          <Panel title="Architecture Findings">
            <Finding ok={correct === required.length}>
              Required production components selected.
            </Finding>

            <Finding ok={!unnecessary.length}>
              {unnecessary.length} unnecessary component(s) selected.
            </Finding>

            <Finding ok={goodLinks === requiredLinks.length}>
              {requiredLinks.length - goodLinks} required connection(s)
              missing.
            </Finding>

            <Finding ok={links.length === goodLinks}>
              {links.length - goodLinks} incorrect connection(s)
              created.
            </Finding>
          </Panel>

          <Panel title="Submitted Components">
            <div className="space-y-1.5">
              {selected.map((id) => (
                <div
                  key={id}
                  className={`rounded-md border px-3 py-2 text-[10px] ${
                    required.includes(id)
                      ? "border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-300"
                      : "border-red-500/20 bg-red-500/[0.02] text-red-300"
                  }`}
                >
                  {required.includes(id) ? "✓" : "×"} {name(id)}
                </div>
              ))}
            </div>
          </Panel>

          <div className="md:col-span-2">
            <Panel title="Architecture Decision Results">
              {decisions.map((d) => {
                const ok = answers[d[0]] === d[3];

                return (
                  <div
                    key={d[0]}
                    className={`mb-2 rounded-lg border p-4 ${
                      ok
                        ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                        : "border-red-500/20 bg-red-500/[0.02]"
                    }`}
                  >
                    <p className="text-xs">
                      {ok ? "✓" : "×"} {d[1]}
                    </p>

                    <p className="mt-2 text-[10px] text-gray-600">
                      Your answer: {answers[d[0]] || "Not answered"}
                    </p>

                    {!ok && (
                      <p className="mt-1 text-[10px] text-gray-600">
                        Expected: {d[3]}
                      </p>
                    )}
                  </div>
                );
              })}
            </Panel>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050810] text-white">
      <Header onSubmit={() => setSubmitted(true)} />

      {/* Scenario */}
      <section className="border-b border-white/10 bg-[#080d16]">
        <div className="mx-auto max-w-7xl px-6 py-9">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-5xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-400">
                Networking Assessment · LAB_01
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Design a production-grade private application network
              </h2>

              <p className="mt-4 max-w-5xl text-xs leading-7 text-gray-500">
                You are designing infrastructure for a customer-facing API.
                The application must be highly available across two
                Availability Zones. Application servers must never have public
                IP addresses. Customers must be able to reach the application
                from the Internet, while administrators must be able to access
                private instances securely. The application also needs
                outbound Internet connectivity for operating-system and
                software updates.
              </p>
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] px-5 py-4">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-amber-300">
                Attempt Policy
              </div>
              <div className="mt-2 text-sm font-semibold">
                ONE ATTEMPT
              </div>
              <div className="mt-1 text-[9px] text-gray-600">
                No correctness feedback before submission.
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Requirement label="2 Availability Zones" />
            <Requirement label="No public EC2" />
            <Requirement label="Private application tier" />
            <Requirement label="One attempt only" />
          </div>
        </div>
      </section>

      {/* Workspace */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-7 lg:grid-cols-[360px_1fr]">
        {/* Inventory */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-[#080d16]">
            <div className="border-b border-white/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">
                    Component Inventory
                  </h2>

                  <p className="mt-1 text-[10px] leading-5 text-gray-600">
                    Select the resources you believe belong in the
                    architecture.
                  </p>
                </div>

                <div className="rounded-md border border-white/10 px-2 py-1 font-mono text-[9px] text-gray-600">
                  {selected.length}/{inventory.length}
                </div>
              </div>

              <div className="mt-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs outline-none placeholder:text-gray-700 focus:border-blue-400/30"
                />
              </div>
            </div>

            <div className="max-h-[72vh] overflow-y-auto p-4">
              <div className="space-y-6">
                {visible.map((section) => (
                  <div key={section.label}>
                    <div className="mb-2 flex items-center gap-2 px-1">
                      <span className="h-px flex-1 bg-white/[0.05]" />
                      <p className="text-[8px] font-semibold tracking-[0.2em] text-gray-700">
                        {section.label}
                      </p>
                      <span className="h-px flex-1 bg-white/[0.05]" />
                    </div>

                    <div className="space-y-1.5">
                      {section.items.map((item) => {
                        const active = selected.includes(item.id);

                        return (
                          <button
                            key={item.id}
                            onClick={() => clickItem(item.id)}
                            className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                              active
                                ? "border-blue-400/40 bg-blue-500/[0.07]"
                                : "border-white/[0.06] bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.025]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[11px] font-medium text-gray-200">
                                  {item.name}
                                </div>

                                <div className="mt-1 text-[9px] leading-4 text-gray-700">
                                  {item.description}
                                </div>
                              </div>

                              <span
                                className={`shrink-0 text-[8px] uppercase tracking-wider ${
                                  active
                                    ? "text-blue-300"
                                    : "text-gray-800"
                                }`}
                              >
                                {active ? "Added" : "Select"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Canvas header */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">
                  Architecture Canvas
                </h2>

                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] text-gray-600">
                  DESIGN MODE
                </span>
              </div>

              <p className="mt-1 text-[10px] text-gray-600">
                VPC: 10.0.0.0/16 · Region: us-east-1
              </p>
            </div>

            <button
              disabled={selected.length < 2}
              onClick={() => {
                setConnect(!connect);
                setFirst(null);
              }}
              className={`rounded-lg border px-4 py-2.5 text-[10px] font-semibold transition ${
                connect
                  ? "border-blue-400/40 bg-blue-500/10 text-blue-300"
                  : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-30`}
            >
              {connect ? "Exit Connection Mode" : "Connect Components"}
            </button>
          </div>

          {connect && (
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.04] px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-xs text-blue-300">
                {first ? "2" : "1"}
              </div>

              <div>
                <div className="text-[10px] font-semibold text-blue-200">
                  {first
                    ? `Selected: ${name(first)}`
                    : "Select the first component"}
                </div>

                <div className="mt-1 text-[9px] text-gray-600">
                  {first
                    ? "Now select the component it should connect to."
                    : "Select two components to create an architecture relationship."}
                </div>
              </div>
            </div>
          )}

          {/* Architecture canvas */}
          <div className="rounded-2xl border border-white/10 bg-[#080d16] p-4 shadow-2xl shadow-black/20">
            <div className="rounded-xl border border-blue-400/10 bg-blue-500/[0.012] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[9px] text-blue-400">
                    AWS_VPC
                  </div>

                  <h3 className="mt-1 text-sm font-semibold">
                    10.0.0.0/16
                  </h3>
                </div>

                <div className="rounded-md border border-white/10 px-2.5 py-1 text-[8px] text-gray-600">
                  us-east-1
                </div>
              </div>

              {selected.length === 0 ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-xl text-gray-700">
                      +
                    </div>

                    <p className="mt-5 text-xs text-gray-500">
                      Your architecture starts here.
                    </p>

                    <p className="mt-2 text-[10px] leading-5 text-gray-700">
                      Select resources from the inventory. No correctness
                      feedback is intentionally provided.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {selected.map((id) => {
                      const item = inventory.find(
                        (x) => x.id === id
                      )!;

                      return (
                        <div
                          key={id}
                          onClick={() => clickItem(id)}
                          className={`cursor-pointer rounded-xl border p-4 transition ${
                            first === id
                              ? "border-blue-400/60 bg-blue-500/[0.08] shadow-lg shadow-blue-950/20"
                              : "border-white/10 bg-white/[0.015] hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium">
                                {item.name}
                              </p>

                              <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-700">
                                {item.group}
                              </p>
                            </div>

                            {!connect && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  remove(id);
                                }}
                                className="text-[8px] text-gray-700 hover:text-white"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <p className="mt-3 text-[9px] leading-5 text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {links.length > 0 && (
                    <div className="mt-6 border-t border-white/[0.06] pt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-gray-700">
                          Architecture Relationships
                        </p>

                        <span className="font-mono text-[8px] text-gray-700">
                          {links.length} links
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {links.map((link, index) => (
                          <span
                            key={index}
                            className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[9px] text-gray-500"
                          >
                            {name(link.from)}
                            <span className="mx-2 text-blue-400">→</span>
                            {name(link.to)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Decisions */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-[#080d16] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">
                  Architecture Decisions
                </h2>

                <p className="mt-1 text-[10px] text-gray-600">
                  These decisions are part of the final score.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 px-3 py-2">
                <span className="font-mono text-xs text-gray-300">
                  {Object.keys(answers).length}
                </span>
                <span className="text-[9px] text-gray-700">
                  {" "}
                  / {decisions.length}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {decisions.map((decision, index) => (
                <label
                  key={decision[0]}
                  className="block rounded-xl border border-white/[0.07] bg-white/[0.01] p-4 transition hover:border-white/15"
                >
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] font-mono text-[9px] text-gray-600">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1">
                      <span className="text-[11px] font-medium text-gray-300">
                        {decision[1]}
                      </span>

                      <select
                        value={answers[decision[0]] || ""}
                        onChange={(e) =>
                          setAnswers((current) => ({
                            ...current,
                            [decision[0]]: e.target.value,
                          }))
                        }
                        className="mt-3 w-full rounded-lg border border-white/10 bg-[#0b111b] px-3 py-2.5 text-[10px] text-gray-300 outline-none transition focus:border-blue-400/30"
                      >
                        <option value="">
                          Select your architecture decision
                        </option>

                        {decision[2].map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-blue-400/15 bg-blue-500/[0.025] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300">
                Candidate Workflow
              </p>

              <ol className="mt-3 space-y-2 text-[10px] leading-5 text-gray-600">
                <li>01 — Read the production scenario.</li>
                <li>02 — Select the resources you believe are required.</li>
                <li>03 — Build the architecture relationships.</li>
                <li>04 — Answer the architecture decisions.</li>
                <li>05 — Review your design.</li>
                <li>06 — Submit when confident.</li>
              </ol>
            </div>

            <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.025] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                Assessment Rules
              </p>

              <ul className="mt-3 space-y-2 text-[10px] leading-5 text-gray-600">
                <li>• One attempt only.</li>
                <li>• No correctness feedback before submission.</li>
                <li>• Decoy resources are intentionally included.</li>
                <li>• Incorrect architecture choices affect the score.</li>
                <li>• Submission permanently locks the assessment.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="mt-5 flex w-full items-center justify-between rounded-xl bg-blue-500 px-5 py-4 text-xs font-semibold shadow-xl shadow-blue-950/20 transition hover:bg-blue-400"
          >
            <span>Submit Architecture</span>
            <span>ONE ATTEMPT →</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function Header({
  locked,
  onSubmit,
}: {
  locked?: boolean;
  onSubmit?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050810]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <a
            href="/"
            className="text-[9px] text-gray-600 transition hover:text-white"
          >
            ← CloudOps SimLab
          </a>

          <h1 className="mt-1 text-xs font-semibold">
            AWS VPC Architecture Assessment
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`hidden rounded-full border px-3 py-1 text-[8px] uppercase tracking-wider sm:inline-block ${
              locked
                ? "border-red-400/20 bg-red-400/[0.04] text-red-300"
                : "border-amber-400/20 bg-amber-400/[0.04] text-amber-300"
            }`}
          >
            {locked ? "Submitted — Locked" : "One Attempt Only"}
          </span>

          {!locked && (
            <button
              onClick={onSubmit}
              className="rounded-lg bg-blue-500 px-4 py-2 text-[10px] font-semibold transition hover:bg-blue-400"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Requirement({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.015] px-3 py-2.5">
      <span className="text-blue-400">✓</span>
      <span className="text-[9px] text-gray-500">{label}</span>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080d16] p-4">
      <p className="text-[8px] uppercase tracking-[0.18em] text-gray-700">
        {label}
      </p>

      <p className="mt-2 font-mono text-xl font-semibold text-gray-200">
        {value}
      </p>
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
    <section className="rounded-xl border border-white/10 bg-[#080d16] p-5">
      <h2 className="text-xs font-semibold">{title}</h2>

      <div className="mt-4">{children}</div>
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
      className={`mb-2 rounded-lg border px-4 py-3 text-[10px] ${
        ok
          ? "border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-300"
          : "border-red-500/20 bg-red-500/[0.02] text-red-300"
      }`}
    >
      {ok ? "✓" : "×"} {children}
    </div>
  );
}
