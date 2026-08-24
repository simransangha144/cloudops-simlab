"use client";

import { useMemo, useState } from "react";

type ComponentId =
  | "internet"
  | "igw"
  | "public-subnet"
  | "nat"
  | "private-subnet"
  | "alb"
  | "route-tables"
  | "app-server"
  | "security-group";

type Component = {
  id: ComponentId;
  name: string;
  description: string;
  short: string;
};

type ValidationResult = {
  title: string;
  detail: string;
  passed: boolean;
};

const components: Component[] = [
  {
    id: "internet",
    name: "Internet",
    description: "External network",
    short: "NET",
  },
  {
    id: "igw",
    name: "Internet Gateway",
    description: "Connects the VPC to the Internet",
    short: "IGW",
  },
  {
    id: "public-subnet",
    name: "Public Subnet",
    description: "Subnet with a route toward the Internet Gateway",
    short: "PUBLIC",
  },
  {
    id: "nat",
    name: "NAT Gateway",
    description: "Provides outbound Internet access to private resources",
    short: "NAT",
  },
  {
    id: "private-subnet",
    name: "Private Subnet",
    description: "Subnet without direct inbound Internet exposure",
    short: "PRIVATE",
  },
  {
    id: "route-tables",
    name: "Route Tables",
    description: "Controls traffic flow between network components",
    short: "RT",
  },
  {
    id: "app-server",
    name: "Application Server",
    description: "Private EC2 application workload",
    short: "EC2",
  },
  {
    id: "security-group",
    name: "Security Group",
    description: "Controls inbound and outbound instance traffic",
    short: "SG",
  },
  {
    id: "alb",
    name: "Application Load Balancer",
    description: "Receives HTTP/HTTPS traffic from clients",
    short: "ALB",
  },
];

const objectives = [
  "Create a VPC",
  "Create public and private subnets",
  "Attach an Internet Gateway",
  "Deploy NAT Gateway in the public subnet",
  "Configure public and private routes",
  "Deploy application servers privately",
  "Prevent direct public exposure",
];

export default function AwsVpcLab() {
  const [selected, setSelected] = useState<ComponentId[]>([]);
  const [validated, setValidated] = useState(false);
  const [showConfig, setShowConfig] = useState<ComponentId | null>(null);

  const [publicCidr, setPublicCidr] = useState("10.0.1.0/24");
  const [privateCidr, setPrivateCidr] = useState("10.0.2.0/24");
  const [appPublicIp, setAppPublicIp] = useState(false);
  const [privateRouteTarget, setPrivateRouteTarget] = useState("nat");
  const [natSubnet, setNatSubnet] = useState("public");

  function has(id: ComponentId) {
    return selected.includes(id);
  }

  function toggleComponent(id: ComponentId) {
    setValidated(false);

    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function resetLab() {
    setSelected([]);
    setValidated(false);
    setShowConfig(null);
    setPublicCidr("10.0.1.0/24");
    setPrivateCidr("10.0.2.0/24");
    setAppPublicIp(false);
    setPrivateRouteTarget("nat");
    setNatSubnet("public");
  }

  const validationResults = useMemo<ValidationResult[]>(() => {
    return [
      {
        title: "VPC exists",
        detail: "10.0.0.0/16 VPC is configured.",
        passed: true,
      },
      {
        title: "Internet Gateway attached",
        detail: "Internet Gateway provides external connectivity.",
        passed: has("igw"),
      },
      {
        title: "Public subnet configured",
        detail: `Public subnet ${publicCidr} exists.`,
        passed: has("public-subnet"),
      },
      {
        title: "Private subnet configured",
        detail: `Private subnet ${privateCidr} exists.`,
        passed: has("private-subnet"),
      },
      {
        title: "NAT Gateway deployed",
        detail:
          natSubnet === "public"
            ? "NAT Gateway is deployed in the public subnet."
            : "NAT Gateway must be deployed in a public subnet.",
        passed: has("nat") && natSubnet === "public",
      },
      {
        title: "Route tables configured",
        detail:
          privateRouteTarget === "nat"
            ? "Private subnet default route points to NAT Gateway."
            : "Private subnet must not route directly to the Internet Gateway.",
        passed:
          has("route-tables") &&
          privateRouteTarget === "nat" &&
          has("nat"),
      },
      {
        title: "Application server is private",
        detail: appPublicIp
          ? "Application server currently has a public IP."
          : "Application server has no public IP.",
        passed: has("app-server") && !appPublicIp,
      },
      {
        title: "Application server in private subnet",
        detail: "Application workload must reside in the private subnet.",
        passed: has("app-server") && has("private-subnet"),
      },
      {
        title: "Security group configured",
        detail: "Application traffic is controlled by a security group.",
        passed: has("security-group"),
      },
      {
        title: "Production load balancing",
        detail: "ALB provides a controlled application entry point.",
        passed: has("alb"),
      },
    ];
  }, [
    selected,
    publicCidr,
    privateCidr,
    appPublicIp,
    privateRouteTarget,
    natSubnet,
  ]);

  const passedCount = validationResults.filter((item) => item.passed).length;

  const score = Math.round(
    (passedCount / validationResults.length) * 100
  );

  const labPassed = score === 100;

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#070b12]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <a
              href="/"
              className="text-sm text-gray-500 transition hover:text-white"
            >
              ← CloudOps SimLab
            </a>

            <h1 className="mt-2 text-xl font-semibold">
              AWS VPC Architecture Lab
            </h1>
          </div>

          <div className="rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-xs text-blue-300">
            LAB_01
          </div>
        </div>
      </header>

      {/* SCENARIO */}
      <section className="border-b border-white/10 bg-[#090e17]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Scenario
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Build a production-style private application network
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              Your application servers must run inside a private subnet.
              They need outbound Internet access for software updates, but
              they must not be directly reachable from the public Internet.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Requirement label="Private application tier" />
              <Requirement label="Outbound Internet access" />
              <Requirement label="No direct public exposure" />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAB */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[310px_1fr]">
          {/* LEFT PANEL */}
          <aside>
            <div className="mb-5">
              <p className="text-sm font-semibold">Infrastructure</p>
              <p className="mt-1 text-xs text-gray-500">
                Add components to construct the architecture.
              </p>
            </div>

            <div className="space-y-3">
              {components.map((component) => {
                const active = has(component.id);

                return (
                  <button
                    key={component.id}
                    onClick={() => {
                      toggleComponent(component.id);
                      setShowConfig(component.id);
                    }}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-blue-400/50 bg-blue-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {component.name}
                      </span>

                      <span
                        className={`font-mono text-xs ${
                          active ? "text-blue-400" : "text-gray-600"
                        }`}
                      >
                        {active ? "ACTIVE" : component.short}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {component.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* CONFIGURATION */}
            {showConfig && has(showConfig) && (
              <div className="mt-5 rounded-xl border border-blue-400/20 bg-blue-400/[0.04] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Configuration
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {showConfig}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowConfig(null)}
                    className="text-xs text-gray-500 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                {showConfig === "public-subnet" && (
                  <ConfigField
                    label="CIDR"
                    value={publicCidr}
                    onChange={setPublicCidr}
                  />
                )}

                {showConfig === "private-subnet" && (
                  <ConfigField
                    label="CIDR"
                    value={privateCidr}
                    onChange={setPrivateCidr}
                  />
                )}

                {showConfig === "nat" && (
                  <SelectField
                    label="Subnet"
                    value={natSubnet}
                    onChange={setNatSubnet}
                    options={[
                      ["public", "Public Subnet"],
                      ["private", "Private Subnet"],
                    ]}
                  />
                )}

                {showConfig === "route-tables" && (
                  <SelectField
                    label="Private default route"
                    value={privateRouteTarget}
                    onChange={setPrivateRouteTarget}
                    options={[
                      ["nat", "NAT Gateway"],
                      ["igw", "Internet Gateway"],
                    ]}
                  />
                )}

                {showConfig === "app-server" && (
                  <label className="flex cursor-pointer items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={appPublicIp}
                      onChange={(e) =>
                        setAppPublicIp(e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    Assign public IPv4
                  </label>
                )}
              </div>
            )}

            {/* OBJECTIVES */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-semibold">Lab Objectives</p>

              <div className="mt-4 space-y-3">
                {objectives.map((objective, index) => {
                  const complete = index < passedCount;

                  return (
                    <div
                      key={objective}
                      className="flex items-start gap-3 text-xs"
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          complete
                            ? "border-green-400 bg-green-400/10 text-green-400"
                            : "border-white/20 text-gray-600"
                        }`}
                      >
                        {complete ? "✓" : ""}
                      </span>

                      <span
                        className={
                          complete
                            ? "text-gray-300"
                            : "text-gray-500"
                        }
                      >
                        {objective}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CANVAS */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Architecture Canvas
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  VPC: 10.0.0.0/16 · Region: us-east-1
                </p>
              </div>

              <button
                onClick={resetLab}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-gray-400 transition hover:border-white/25 hover:text-white"
              >
                Reset Lab
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b111b] p-6">
              <div className="min-h-[600px] rounded-xl border border-blue-400/20 bg-blue-400/[0.02] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-blue-400">
                      AWS_VPC
                    </span>

                    <h3 className="mt-1 font-semibold">
                      10.0.0.0/16
                    </h3>
                  </div>

                  <div className="rounded-md border border-white/10 px-3 py-1 text-xs text-gray-500">
                    us-east-1
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {has("internet") && (
                    <ArchitectureNode
                      title="Internet"
                      subtitle="External network"
                      type="external"
                    />
                  )}

                  {has("igw") && (
                    <Connection label="Internet Gateway" />
                  )}

                  {has("public-subnet") && (
                    <Subnet
                      title="Public Subnet"
                      cidr={publicCidr}
                      publicSubnet
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        {has("nat") && (
                          <ArchitectureNode
                            title="NAT Gateway"
                            subtitle="Outbound Internet"
                            type="gateway"
                          />
                        )}

                        {has("alb") && (
                          <ArchitectureNode
                            title="Application Load Balancer"
                            subtitle="HTTP / HTTPS"
                            type="loadbalancer"
                          />
                        )}
                      </div>
                    </Subnet>
                  )}

                  {has("route-tables") && (
                    <Subnet
                      title="Routing Layer"
                      cidr="Route Tables"
                      publicSubnet={false}
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <ArchitectureNode
                          title="Public Route Table"
                          subtitle="0.0.0.0/0 → IGW"
                        />

                        <ArchitectureNode
                          title="Private Route Table"
                          subtitle={`0.0.0.0/0 → ${
                            privateRouteTarget === "nat"
                              ? "NAT"
                              : "IGW"
                          }`}
                          warning={privateRouteTarget === "igw"}
                        />
                      </div>
                    </Subnet>
                  )}

                  {has("private-subnet") && (
                    <Subnet
                      title="Private Subnet"
                      cidr={privateCidr}
                      publicSubnet={false}
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        {has("app-server") && (
                          <ArchitectureNode
                            title="Application Server"
                            subtitle={
                              appPublicIp
                                ? "EC2 · PUBLIC IP"
                                : "EC2 · PRIVATE"
                            }
                            warning={appPublicIp}
                          />
                        )}

                        {has("security-group") && (
                          <ArchitectureNode
                            title="Application Security Group"
                            subtitle="Controlled traffic"
                          />
                        )}
                      </div>
                    </Subnet>
                  )}

                  {selected.length === 0 && (
                    <div className="flex min-h-[400px] items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl text-gray-700">
                          +
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                          Select infrastructure components to begin.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* VALIDATION */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b111b] p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    Architecture Validation
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    The simulator checks networking, routing,
                    security and exposure.
                  </p>
                </div>

                <button
                  onClick={() => setValidated(true)}
                  className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Validate Architecture
                </button>
              </div>

              {validated && (
                <div className="mt-6">
                  <div
                    className={`rounded-xl border p-5 ${
                      labPassed
                        ? "border-green-400/30 bg-green-400/5"
                        : "border-yellow-400/20 bg-yellow-400/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-semibold ${
                            labPassed
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {labPassed
                            ? "✓ Architecture Passed"
                            : "⚠ Architecture Incomplete"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {passedCount} of{" "}
                          {validationResults.length} checks passed
                        </p>
                      </div>

                      <div className="text-3xl font-bold">
                        {score}
                        <span className="text-sm text-gray-500">
                          /100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {validationResults.map((result) => (
                      <div
                        key={result.title}
                        className={`rounded-lg border p-4 ${
                          result.passed
                            ? "border-green-400/10 bg-green-400/[0.03]"
                            : "border-red-400/10 bg-red-400/[0.03]"
                        }`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={
                              result.passed
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {result.passed ? "✓" : "✕"}
                          </span>

                          <div>
                            <p className="text-sm font-medium">
                              {result.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {result.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* UI COMPONENTS                                                             */
/* -------------------------------------------------------------------------- */

function Requirement({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-3">
        <span className="text-blue-400">✓</span>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
    </div>
  );
}

function ConfigField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500">{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-white outline-none focus:border-blue-400/50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b111b] px-3 py-2 text-xs text-white outline-none focus:border-blue-400/50"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ArchitectureNode({
  title,
  subtitle,
  type,
  warning,
}: {
  title: string;
  subtitle: string;
  type?: "external" | "gateway" | "loadbalancer";
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        warning
          ? "border-red-400/40 bg-red-400/[0.05]"
          : type === "external"
          ? "border-yellow-400/20 bg-yellow-400/[0.03]"
          : type === "gateway"
          ? "border-purple-400/20 bg-purple-400/[0.04]"
          : type === "loadbalancer"
          ? "border-blue-400/20 bg-blue-400/[0.04]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>

        {warning && (
          <span className="text-xs text-red-400">
            MISCONFIGURED
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function Connection({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-blue-400/20" />

      <span className="font-mono text-[10px] uppercase tracking-wider text-blue-400">
        {label}
      </span>

      <div className="h-px flex-1 bg-blue-400/20" />
    </div>
  );
}

function Subnet({
  title,
  cidr,
  publicSubnet,
  children,
}: {
  title: string;
  cidr: string;
  publicSubnet: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        publicSubnet
          ? "border-orange-400/20 bg-orange-400/[0.025]"
          : "border-purple-400/20 bg-purple-400/[0.025]"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 font-mono text-xs text-gray-500">
            {cidr}
          </p>
        </div>

        <span
          className={`rounded-md px-2 py-1 text-[10px] ${
            publicSubnet
              ? "bg-orange-400/10 text-orange-300"
              : "bg-purple-400/10 text-purple-300"
          }`}
        >
          {publicSubnet ? "PUBLIC" : "PRIVATE"}
        </span>
      </div>

      {children}
    </div>
  );
}
