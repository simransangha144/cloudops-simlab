"use client";

import { useMemo, useState } from "react";

type ComponentId =
  | "vpc"
  | "igw"
  | "public-a"
  | "public-b"
  | "private-a"
  | "private-b"
  | "alb"
  | "nat-a"
  | "nat-b"
  | "public-rt"
  | "private-rt-a"
  | "private-rt-b"
  | "security-groups"
  | "ssm"
  | "bastion"
  | "public-ec2"
  | "nat-instance";

type Component = {
  id: ComponentId;
  name: string;
  group: "network" | "compute" | "security" | "routing" | "access";
};

type ConnectionEndpoint = ComponentId | "internet";

type Connection = {
  from: ConnectionEndpoint;
  to: ConnectionEndpoint;
};

const components: Component[] = [
  { id: "vpc", name: "VPC", group: "network" },
  { id: "igw", name: "Internet Gateway", group: "network" },

  { id: "public-a", name: "Public Subnet — AZ-A", group: "network" },
  { id: "public-b", name: "Public Subnet — AZ-B", group: "network" },

  { id: "private-a", name: "Private App Subnet — AZ-A", group: "network" },
  { id: "private-b", name: "Private App Subnet — AZ-B", group: "network" },

  { id: "alb", name: "Application Load Balancer", group: "compute" },

  { id: "nat-a", name: "NAT Gateway — AZ-A", group: "network" },
  { id: "nat-b", name: "NAT Gateway — AZ-B", group: "network" },

  { id: "public-rt", name: "Public Route Table", group: "routing" },
  { id: "private-rt-a", name: "Private Route Table — AZ-A", group: "routing" },
  { id: "private-rt-b", name: "Private Route Table — AZ-B", group: "routing" },

  { id: "security-groups", name: "Security Groups", group: "security" },

  { id: "ssm", name: "AWS Systems Manager", group: "access" },
  { id: "bastion", name: "Bastion Host", group: "access" },

  { id: "public-ec2", name: "Public EC2 Instance", group: "compute" },
  { id: "nat-instance", name: "NAT Instance", group: "network" },
];

const correctComponents: ComponentId[] = [
  "vpc",
  "igw",
  "public-a",
  "public-b",
  "private-a",
  "private-b",
  "alb",
  "nat-a",
  "nat-b",
  "public-rt",
  "private-rt-a",
  "private-rt-b",
  "security-groups",
  "ssm",
];

const forbiddenComponents: ComponentId[] = [
  "bastion",
  "public-ec2",
  "nat-instance",
];

const correctConnections: Connection[] = [
  { from: "internet", to: "igw" } as Connection,
  { from: "igw", to: "public-rt" },
  { from: "public-rt", to: "public-a" },
  { from: "public-rt", to: "public-b" },

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

  { from: "security-groups", to: "alb" },
  { from: "security-groups", to: "private-a" },
  { from: "security-groups", to: "private-b" },

  { from: "ssm", to: "private-a" },
  { from: "ssm", to: "private-b" },
];

const allComponentIds = components.map((c) => c.id);

export default function AwsVpcAssessment() {
  const [selected, setSelected] = useState<ComponentId[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectMode, setConnectMode] = useState(false);
  const [connectionSource, setConnectionSource] =
    useState<ComponentId | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const selectedComponents = useMemo(
    () => components.filter((component) => selected.includes(component.id)),
    [selected]
  );

  function toggleComponent(id: ComponentId) {
    if (submitted) return;

    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

    setConnections((current) =>
      current.filter(
        (connection) => connection.from !== id && connection.to !== id
      )
    );

    setConnectionSource(null);
  }

  function handleNodeClick(id: ComponentId) {
    if (submitted || !connectMode) return;

    if (!connectionSource) {
      setConnectionSource(id);
      return;
    }

    if (connectionSource === id) {
      setConnectionSource(null);
      return;
    }

    const exists = connections.some(
      (connection) =>
        (connection.from === connectionSource && connection.to === id) ||
        (connection.from === id && connection.to === connectionSource)
    );

    if (!exists) {
      setConnections((current) => [
        ...current,
        { from: connectionSource, to: id },
      ]);
    }

    setConnectionSource(null);
  }

  function normalizeConnection(connection: Connection) {
    return `${connection.from}->${connection.to}`;
  }

  function calculateScore() {
    let total = 0;

    // Component selection: 45 points
    const requiredSelected = correctComponents.filter((id) =>
      selected.includes(id)
    ).length;

    total += Math.round(
      (requiredSelected / correctComponents.length) * 45
    );

    // Unnecessary / dangerous components: -5 each
    const unnecessarySelected = forbiddenComponents.filter((id) =>
      selected.includes(id)
    ).length;

    total -= unnecessarySelected * 5;

    // Connections: 40 points
    const normalizedStudent = new Set(
      connections.map(normalizeConnection)
    );

    const normalizedCorrect = correctConnections.map(normalizeConnection);

    const correctConnectionCount = normalizedCorrect.filter((connection) =>
      normalizedStudent.has(connection)
    ).length;

    total += Math.round(
      (correctConnectionCount / normalizedCorrect.length) * 40
    );

    // Architecture decisions: 15 points
    const hasBothAzs =
      selected.includes("private-a") &&
      selected.includes("private-b") &&
      selected.includes("public-a") &&
      selected.includes("public-b");

    const hasNatHa =
      selected.includes("nat-a") &&
      selected.includes("nat-b");

    const hasSecureAccess = selected.includes("ssm");

    if (hasBothAzs) total += 5;
    if (hasNatHa) total += 5;
    if (hasSecureAccess) total += 5;

    return Math.max(0, Math.min(100, total));
  }

  function submitAssessment() {
    if (submitted) return;

    const finalScore = calculateScore();

    setScore(finalScore);
    setSubmitted(true);
    setConnectMode(false);
    setConnectionSource(null);
  }

  function resetLab() {
    if (submitted) return;

    setSelected([]);
    setConnections([]);
    setConnectMode(false);
    setConnectionSource(null);
  }

  function getComponentName(id: ComponentId | "internet") {
    if (id === "internet") return "Internet";

    return components.find((component) => component.id === id)?.name ?? id;
  }

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#070b12]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <a
              href="/"
              className="text-xs text-gray-600 hover:text-gray-300"
            >
              ← CloudOps SimLab
            </a>

            <h1 className="mt-1 text-sm font-semibold">
              AWS VPC Architecture Assessment
            </h1>
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              submitted
                ? "border-red-400/30 bg-red-400/10 text-red-300"
                : "border-blue-400/30 bg-blue-400/10 text-blue-300"
            }`}
          >
            {submitted ? "SUBMITTED — LOCKED" : "ONE ATTEMPT"}
          </div>
        </div>
      </header>

      {/* Scenario */}
      <section className="border-b border-white/10 bg-[#090e17]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="max-w-5xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400">
              Scenario
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Design a production-grade private application network
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-6 text-gray-400">
              You are designing infrastructure for a customer-facing API.
              The application must be highly available across two
              Availability Zones.
            </p>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-400">
              Application servers must never have public IP addresses.
              Customers must be able to reach the application from the
              Internet, while administrators must be able to securely access
              the servers without exposing SSH to the Internet.
            </p>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-400">
              The application also requires outbound Internet connectivity
              for operating-system and software updates.
            </p>

            <p className="mt-4 text-xs font-medium text-gray-300">
              You are given several infrastructure components. Some are
              unnecessary or deliberately unsafe. Select only what you believe
              is required and construct the architecture.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <Requirement label="2 Availability Zones" />
              <Requirement label="No public EC2" />
              <Requirement label="Private application tier" />
              <Requirement label="One attempt only" />
            </div>
          </div>
        </div>
      </section>

      {/* Locked result */}
      {submitted && (
        <section className="border-b border-white/10 bg-[#080d15]">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="rounded-xl border border-blue-400/20 bg-blue-400/[0.03] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    Assessment Result
                  </p>

                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-4xl font-bold">
                      {score}
                    </span>
                    <span className="mb-1 text-sm text-gray-500">
                      / 100
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Your assessment is permanently locked for this browser.
                  </p>
                </div>

                <div className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300">
                  No further changes permitted
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Assessment */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[300px_1fr]">
          {/* Inventory */}
          <aside>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Component Inventory
                </p>

                <span className="text-[10px] text-gray-600">
                  {selected.length}/{components.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-600">
                Choose the components you believe belong in the architecture.
              </p>
            </div>

            <div className="space-y-2">
              {components.map((component) => {
                const active = selected.includes(component.id);

                return (
                  <button
                    key={component.id}
                    disabled={submitted}
                    onClick={() => toggleComponent(component.id)}
                    className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                      active
                        ? "border-blue-400/50 bg-blue-500/10"
                        : "border-white/10 bg-white/[0.015] hover:border-white/25"
                    } ${
                      submitted
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        {component.name}
                      </span>

                      <span
                        className={`text-[9px] font-semibold ${
                          active
                            ? "text-blue-400"
                            : "text-gray-700"
                        }`}
                      >
                        {active ? "SELECTED" : "SELECT"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!submitted && (
              <button
                onClick={resetLab}
                className="mt-4 w-full rounded-lg border border-white/10 px-4 py-2.5 text-xs text-gray-500 hover:border-white/25 hover:text-white"
              >
                Reset Architecture
              </button>
            )}
          </aside>

          {/* Canvas */}
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Architecture Canvas
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Select components, then connect them.
                </p>
              </div>

              {!submitted && (
                <button
                  onClick={() => {
                    setConnectMode((current) => !current);
                    setConnectionSource(null);
                  }}
                  className={`rounded-lg border px-4 py-2 text-xs font-medium transition ${
                    connectMode
                      ? "border-blue-400/50 bg-blue-500/10 text-blue-300"
                      : "border-white/10 text-gray-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {connectMode
                    ? "Connection Mode ON"
                    : "Connect Components"}
                </button>
              )}
            </div>

            {connectMode && !submitted && (
              <div className="mb-4 rounded-lg border border-blue-400/20 bg-blue-400/5 px-4 py-3 text-xs text-blue-300">
                {connectionSource
                  ? `Source selected: ${getComponentName(
                      connectionSource
                    )}. Now select the destination component.`
                  : "Select a component to start a connection."}
              </div>
            )}

            <div className="min-h-[620px] rounded-2xl border border-white/10 bg-[#0b111b] p-5">
              <div className="rounded-xl border border-blue-400/20 bg-blue-400/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-blue-400">
                      AWS_VPC
                    </span>
                    <h3 className="mt-1 font-semibold">
                      10.0.0.0/16
                    </h3>
                  </div>

                  <div className="rounded-md border border-white/10 px-3 py-1 text-[10px] text-gray-600">
                    us-east-1
                  </div>
                </div>

                {/* Architecture nodes */}
                <div className="mt-8 grid gap-4">
                  {selectedComponents.length === 0 ? (
                    <div className="flex min-h-[480px] items-center justify-center rounded-xl border border-dashed border-white/10">
                      <div className="text-center">
                        <div className="text-3xl text-gray-700">
                          +
                        </div>
                        <p className="mt-3 text-sm text-gray-500">
                          Your architecture starts here
                        </p>
                        <p className="mt-1 text-xs text-gray-700">
                          Select components from the inventory
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {selectedComponents.map((component) => {
                        const isSource =
                          connectionSource === component.id;

                        return (
                          <button
                            key={component.id}
                            onClick={() =>
                              handleNodeClick(component.id)
                            }
                            className={`rounded-xl border p-4 text-left transition ${
                              isSource
                                ? "border-blue-400 bg-blue-500/10"
                                : "border-white/10 bg-white/[0.02]"
                            } ${
                              connectMode
                                ? "cursor-crosshair hover:border-blue-400/50"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold">
                                {component.name}
                              </span>

                              {isSource && (
                                <span className="text-[9px] text-blue-400">
                                  SOURCE
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-[10px] text-gray-600">
                              {component.group.toUpperCase()}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Connections */}
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold">
                      Architecture Connections
                    </p>

                    <span className="text-[10px] text-gray-600">
                      {connections.length} connection
                      {connections.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {connections.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-gray-700">
                      No connections defined
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {connections.map((connection, index) => (
                        <div
                          key={`${connection.from}-${connection.to}-${index}`}
                          className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                        >
                          <span className="text-xs text-gray-300">
                            {getComponentName(connection.from)}
                          </span>

                          <span className="text-blue-400">
                            →
                          </span>

                          <span className="text-xs text-gray-300">
                            {getComponentName(connection.to)}
                          </span>

                          {!submitted && (
                            <button
                              onClick={() =>
                                setConnections((current) =>
                                  current.filter(
                                    (_, i) => i !== index
                                  )
                                )
                              }
                              className="ml-auto text-[10px] text-gray-700 hover:text-red-400"
                            >
                              REMOVE
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            {!submitted && (
              <div className="mt-5 rounded-xl border border-white/10 bg-[#0b111b] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Ready to submit?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Your architecture will be evaluated and permanently
                      locked after submission.
                    </p>
                  </div>

                  <button
                    onClick={submitAssessment}
                    className="rounded-lg bg-blue-500 px-6 py-3 text-xs font-semibold text-white transition hover:bg-blue-400"
                  >
                    Submit Architecture
                  </button>
                </div>
              </div>
            )}

            {/* Post-submission review */}
            {submitted && (
              <div className="mt-5 rounded-xl border border-white/10 bg-[#0b111b] p-5">
                <p className="text-sm font-semibold">
                  Assessment Review
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  The architecture below represents exactly what the
                  candidate submitted.
                </p>

                <div className="mt-5 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs font-semibold">
                    Expected production architecture
                  </p>

                  <p className="mt-3 text-xs leading-6 text-gray-500">
                    Internet → Internet Gateway → public subnets →
                    internet-facing ALB → private application subnets
                    across two Availability Zones. Private subnets use
                    AZ-local NAT Gateways for outbound connectivity.
                    Administrative access should use Systems Manager
                    rather than a publicly exposed SSH endpoint.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Requirement({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.015] px-3 py-2.5">
      <span className="text-blue-400">✓</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}
