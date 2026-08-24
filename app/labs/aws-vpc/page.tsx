"use client";

import { useEffect, useMemo, useState } from "react";

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
  | "sg"
  | "ssm"
  | "bastion"
  | "public-ec2"
  | "nat-instance";

type DecisionId =
  | "alb-location"
  | "app-location"
  | "private-route"
  | "nat-ha"
  | "admin-access";

type ConnectionEndpoint = ComponentId | "internet";

type Connection = {
  from: ConnectionEndpoint;
  to: ConnectionEndpoint;
};

type Component = {
  id: ComponentId;
  name: string;
  group: "network" | "compute" | "security" | "routing" | "access";
  description: string;
  dangerous?: boolean;
};

type Decision = {
  id: DecisionId;
  question: string;
  options: string[];
  correct: number;
};

const components: Component[] = [
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
    id: "public-a",
    name: "Public Subnet — AZ-A",
    group: "network",
    description: "Internet-facing subnet in Availability Zone A",
  },
  {
    id: "public-b",
    name: "Public Subnet — AZ-B",
    group: "network",
    description: "Internet-facing subnet in Availability Zone B",
  },
  {
    id: "private-a",
    name: "Private App Subnet — AZ-A",
    group: "network",
    description: "Application workload subnet in AZ-A",
  },
  {
    id: "private-b",
    name: "Private App Subnet — AZ-B",
    group: "network",
    description: "Application workload subnet in AZ-B",
  },
  {
    id: "alb",
    name: "Application Load Balancer",
    group: "compute",
    description: "Internet-facing HTTP/HTTPS entry point",
  },
  {
    id: "nat-a",
    name: "NAT Gateway — AZ-A",
    group: "network",
    description: "Outbound connectivity for private resources in AZ-A",
  },
  {
    id: "nat-b",
    name: "NAT Gateway — AZ-B",
    group: "network",
    description: "Outbound connectivity for private resources in AZ-B",
  },
  {
    id: "public-rt",
    name: "Public Route Table",
    group: "routing",
    description: "Routes public subnet traffic toward the IGW",
  },
  {
    id: "private-rt-a",
    name: "Private Route Table — AZ-A",
    group: "routing",
    description: "Routes private AZ-A traffic toward NAT-A",
  },
  {
    id: "private-rt-b",
    name: "Private Route Table — AZ-B",
    group: "routing",
    description: "Routes private AZ-B traffic toward NAT-B",
  },
  {
    id: "sg",
    name: "Security Groups",
    group: "security",
    description: "Controls workload network access",
  },
  {
    id: "ssm",
    name: "AWS Systems Manager",
    group: "access",
    description: "Private administrative access without public SSH",
  },
  {
    id: "bastion",
    name: "Bastion Host",
    group: "access",
    description: "Public jump host for administrative SSH",
    dangerous: true,
  },
  {
    id: "public-ec2",
    name: "Public EC2 Instance",
    group: "compute",
    description: "EC2 instance with direct public exposure",
    dangerous: true,
  },
  {
    id: "nat-instance",
    name: "NAT Instance",
    group: "network",
    description: "Self-managed NAT running on EC2",
    dangerous: true,
  },
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
  "sg",
  "ssm",
];

const correctConnections: Connection[] = [
  { from: "vpc", to: "igw" },

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

  { from: "nat-a", to: "public-a" },
  { from: "nat-b", to: "public-b" },
];

const decisions: Decision[] = [
  {
    id: "alb-location",
    question: "Where should the Application Load Balancer live?",
    options: [
      "Public subnets",
      "Private application subnets",
      "Inside the application EC2 instances",
      "No load balancer is required",
    ],
    correct: 0,
  },
  {
    id: "app-location",
    question: "Where should the application servers live?",
    options: [
      "Public subnets",
      "Private application subnets",
      "Inside the Internet Gateway",
      "On a public bastion host",
    ],
    correct: 1,
  },
  {
    id: "private-route",
    question: "What should a private subnet use for outbound Internet access?",
    options: [
      "Internet Gateway directly",
      "NAT Gateway",
      "Application Load Balancer",
      "No route is required",
    ],
    correct: 1,
  },
  {
    id: "nat-ha",
    question: "For production HA across two Availability Zones, how should NAT Gateway be deployed?",
    options: [
      "One shared NAT Gateway",
      "One NAT Gateway per Availability Zone",
      "One NAT Instance only",
      "No NAT is required",
    ],
    correct: 1,
  },
  {
    id: "admin-access",
    question: "How should administrators access private EC2 instances?",
    options: [
      "AWS Systems Manager Session Manager",
      "SSH directly from the Internet",
      "A public bastion host",
      "Expose port 22 on the application instances",
    ],
    correct: 0,
  },
];

const labels: Record<ComponentId | "internet", string> = {
  internet: "Internet",
  ...Object.fromEntries(
    components.map((component) => [component.id, component.name])
  ),
} as Record<ComponentId | "internet", string>;

function connectionKey(connection: Connection) {
  return `${connection.from}->${connection.to}`;
}

function sameConnection(a: Connection, b: Connection) {
  return connectionKey(a) === connectionKey(b);
}

export default function AwsVpcAssessment() {
  const [selected, setSelected] = useState<ComponentId[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [answers, setAnswers] = useState<Record<DecisionId, number>>(
    {} as Record<DecisionId, number>
  );

  const [connectMode, setConnectMode] = useState(false);
  const [connectionStart, setConnectionStart] =
    useState<ComponentId | null>(null);

  const [stage, setStage] = useState<"design" | "review" | "locked">(
    "design"
  );

  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const locked = window.localStorage.getItem(
      "cloudops-aws-vpc-assessment-locked"
    );

    const savedScore = window.localStorage.getItem(
      "cloudops-aws-vpc-assessment-score"
    );

    if (locked === "true") {
      setStage("locked");

      if (savedScore) {
        setScore(Number(savedScore));
      }
    }
  }, []);

  const selectedRequired = correctComponents.filter((id) =>
    selected.includes(id)
  ).length;

  const selectedDangerous = selected.filter(
    (id) =>
      components.find((component) => component.id === id)?.dangerous === true
  ).length;

  const extraComponents = selected.filter(
    (id) => !correctComponents.includes(id)
  ).length;

  const correctConnectionCount = connections.filter((candidate) =>
    correctConnections.some((correct) =>
      sameConnection(candidate, correct)
    )
  ).length;

  const wrongConnectionCount = connections.filter(
    (candidate) =>
      !correctConnections.some((correct) =>
        sameConnection(candidate, correct)
      )
  ).length;

  const missingConnectionCount =
    correctConnections.length - correctConnectionCount;

  const correctDecisionCount = decisions.filter(
    (decision) => answers[decision.id] === decision.correct
  ).length;

  /*
   * We intentionally do NOT require a minimum number of components
   * or connections. The candidate is allowed to submit a bad design.
   * The architecture quality determines the score.
   */
  const canReview = useMemo(() => {
    return decisions.every(
      (decision) => answers[decision.id] !== undefined
    );
  }, [answers]);

  function toggleComponent(id: ComponentId) {
    if (stage !== "design") return;

    setSelected((current) => {
      if (current.includes(id)) {
        setConnections((existing) =>
          existing.filter(
            (connection) =>
              connection.from !== id && connection.to !== id
          )
        );

        if (connectionStart === id) {
          setConnectionStart(null);
        }

        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  }

  function handleNodeClick(id: ComponentId) {
    if (!connectMode || stage !== "design") return;
    if (!selected.includes(id)) return;

    if (!connectionStart) {
      setConnectionStart(id);
      return;
    }

    if (connectionStart === id) {
      setConnectionStart(null);
      return;
    }

    const candidate: Connection = {
      from: connectionStart,
      to: id,
    };

    setConnections((current) => {
      if (
        current.some((connection) =>
          sameConnection(connection, candidate)
        )
      ) {
        return current;
      }

      return [...current, candidate];
    });

    setConnectionStart(null);
  }

  function removeConnection(index: number) {
    if (stage !== "design") return;

    setConnections((current) =>
      current.filter((_, connectionIndex) => connectionIndex !== index)
    );
  }

  function calculateScore() {
    /*
     * Component selection: 30
     * Topology:             35
     * High availability:   15
     * Decisions/security:  20
     *
     * Extra and dangerous components are explicitly penalized.
     */

    const componentAccuracy =
      selectedRequired / correctComponents.length;

    const extraComponentPenalty = Math.min(
      extraComponents * 5,
      20
    );

    const componentPoints = Math.max(
      0,
      componentAccuracy * 30 - extraComponentPenalty
    );

    const topologyAccuracy =
      correctConnectionCount / correctConnections.length;

    const topologyPenalty = Math.min(
      missingConnectionCount * 1.5 +
        wrongConnectionCount * 3,
      25
    );

    const topologyPoints = Math.max(
      0,
      topologyAccuracy * 35 - topologyPenalty
    );

    const hasPublicAZs =
      selected.includes("public-a") &&
      selected.includes("public-b");

    const hasPrivateAZs =
      selected.includes("private-a") &&
      selected.includes("private-b");

    const hasNatAZs =
      selected.includes("nat-a") &&
      selected.includes("nat-b");

    let haPoints = 0;

    if (hasPublicAZs) haPoints += 5;
    if (hasPrivateAZs) haPoints += 5;
    if (hasNatAZs) haPoints += 5;

    const decisionPoints =
      (correctDecisionCount / decisions.length) * 20;

    const dangerousPenalty = Math.min(
      selectedDangerous * 10,
      30
    );

    let total =
      componentPoints +
      topologyPoints +
      haPoints +
      decisionPoints -
      dangerousPenalty;

    const hasPublicEc2 = selected.includes("public-ec2");
    const hasBastion = selected.includes("bastion");
    const hasNatInstance = selected.includes("nat-instance");

    const criticalMistakes =
      Number(hasPublicEc2) +
      Number(hasBastion) +
      Number(hasNatInstance);

    /*
     * One critical mistake prevents an excellent score.
     * Multiple critical mistakes make a pass impossible.
     */
    if (criticalMistakes >= 2) {
      total = Math.min(total, 59);
    } else if (criticalMistakes === 1) {
      total = Math.min(total, 69);
    }

    /*
     * "Select everything" is deliberately treated as poor
     * engineering judgment.
     */
    if (selected.length === components.length) {
      total = Math.min(total, 49);
    }

    return Math.max(
      0,
      Math.min(100, Math.round(total))
    );
  }

  function submitAssessment() {
    if (!canReview || stage !== "review") return;

    const finalScore = calculateScore();

    setScore(finalScore);
    setStage("locked");

    window.localStorage.setItem(
      "cloudops-aws-vpc-assessment-locked",
      "true"
    );

    window.localStorage.setItem(
      "cloudops-aws-vpc-assessment-score",
      String(finalScore)
    );

    window.localStorage.setItem(
      "cloudops-aws-vpc-assessment-submission",
      JSON.stringify({
        selected,
        connections,
        answers,
        score: finalScore,
        submittedAt: new Date().toISOString(),
      })
    );
  }

  function goToReview() {
    if (!canReview || stage !== "design") return;

    setConnectMode(false);
    setConnectionStart(null);
    setStage("review");
  }

  if (stage === "locked") {
    return (
      <LockedResult
        score={score ?? 0}
        selected={selected}
        connections={connections}
        answers={answers}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <a
              href="/"
              className="text-[11px] text-gray-600 hover:text-white"
            >
              ← CloudOps SimLab
            </a>

            <h1 className="mt-1 text-sm font-semibold">
              AWS VPC Architecture Assessment
            </h1>
          </div>

          <div className="rounded-full border border-blue-400/20 bg-blue-400/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-blue-300">
            Assessment in progress
          </div>
        </div>
      </header>

      <Scenario />

      {stage === "design" && (
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
              <ComponentInventory
                selected={selected}
                onToggle={toggleComponent}
              />

              <div>
                <ArchitectureCanvas
                  selected={selected}
                  connections={connections}
                  connectMode={connectMode}
                  connectionStart={connectionStart}
                  onNodeClick={handleNodeClick}
                  onRemoveConnection={removeConnection}
                  onToggleConnectMode={() => {
                    setConnectMode((current) => !current);
                    setConnectionStart(null);
                  }}
                />

                <DecisionPanel
                  answers={answers}
                  onAnswer={(id, value) =>
                    setAnswers((current) => ({
                      ...current,
                      [id]: value,
                    }))
                  }
                />

                <div className="mt-6 flex justify-end">
                  <button
                    disabled={!canReview}
                    onClick={goToReview}
                    className={`rounded-lg px-6 py-3 text-sm font-semibold transition ${
                      canReview
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "cursor-not-allowed bg-white/5 text-gray-600"
                    }`}
                  >
                    Review Architecture →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {stage === "review" && (
        <section className="px-6 py-10">
          <Review
            selected={selected}
            connections={connections}
            answers={answers}
            onBack={() => setStage("design")}
            onSubmit={submitAssessment}
          />
        </section>
      )}
    </main>
  );
}

function Scenario() {
  return (
    <section className="border-b border-white/10 bg-[#090e17]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400">
            Scenario
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Design a production-grade private application network
          </h2>

          <div className="mt-4 space-y-3 text-xs leading-6 text-gray-500">
            <p>
              You are designing infrastructure for a customer-facing API.
              The application must be highly available across two
              Availability Zones.
            </p>

            <p>
              Application servers must never have public IP addresses.
              Customers must be able to reach the application from the
              Internet, while administrators must be able to securely
              access the servers without exposing SSH to the Internet.
            </p>

            <p>
              The application also requires outbound Internet connectivity
              for operating-system and software updates.
            </p>

            <p className="text-gray-400">
              You have been given several infrastructure components. Some are
              unnecessary or deliberately unsafe. Select only what you
              believe is required, construct the architecture, and answer
              the architecture decisions.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <Requirement label="2 Availability Zones" />
            <Requirement label="No public EC2" />
            <Requirement label="Private application tier" />
            <Requirement label="One attempt only" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ComponentInventory({
  selected,
  onToggle,
}: {
  selected: ComponentId[];
  onToggle: (id: ComponentId) => void;
}) {
  const groups = [
    "network",
    "compute",
    "routing",
    "security",
    "access",
  ] as const;

  return (
    <aside>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">
            Component Inventory
          </p>

          <span className="text-[9px] text-gray-600">
            {selected.length}/{components.length}
          </span>
        </div>

        <p className="mt-1 text-[10px] leading-5 text-gray-600">
          Choose the infrastructure components you believe belong
          in the architecture.
        </p>
      </div>

      <div className="space-y-5">
        {groups.map((group) => {
          const groupComponents = components.filter(
            (component) => component.group === group
          );

          return (
            <div key={group}>
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                {group}
              </p>

              <div className="space-y-2">
                {groupComponents.map((component) => {
                  const active = selected.includes(component.id);

                  return (
                    <button
                      key={component.id}
                      onClick={() => onToggle(component.id)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        active
                          ? "border-blue-400/50 bg-blue-500/[0.07]"
                          : "border-white/10 bg-white/[0.015] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium">
                          {component.name}
                        </span>

                        <span
                          className={`text-[8px] font-semibold uppercase ${
                            active
                              ? "text-blue-400"
                              : "text-gray-700"
                          }`}
                        >
                          {active ? "Selected" : "Select"}
                        </span>
                      </div>

                      <p className="mt-1 text-[9px] leading-4 text-gray-600">
                        {component.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function ArchitectureCanvas({
  selected,
  connections,
  connectMode,
  connectionStart,
  onNodeClick,
  onRemoveConnection,
  onToggleConnectMode,
}: {
  selected: ComponentId[];
  connections: Connection[];
  connectMode: boolean;
  connectionStart: ComponentId | null;
  onNodeClick: (id: ComponentId) => void;
  onRemoveConnection: (index: number) => void;
  onToggleConnectMode: () => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            Architecture Canvas
          </p>

          <p className="mt-1 text-[10px] text-gray-600">
            VPC: 10.0.0.0/16 · Region: us-east-1
          </p>
        </div>

        <button
          onClick={onToggleConnectMode}
          className={`rounded-lg border px-4 py-2 text-[10px] font-semibold transition ${
            connectMode
              ? "border-blue-400/50 bg-blue-400/10 text-blue-300"
              : "border-white/10 text-gray-500 hover:text-white"
          }`}
        >
          {connectMode
            ? "Connection Mode ON"
            : "Connect Components"}
        </button>
      </div>

      {connectMode && (
        <div className="mb-4 rounded-lg border border-blue-400/20 bg-blue-400/[0.03] px-4 py-3 text-[10px] text-blue-300">
          {connectionStart
            ? `Source selected: ${labels[connectionStart]}. Choose the destination.`
            : "Select a source component, then select its destination."}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0b111b] p-4">
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/[0.015] p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-blue-400">
                AWS_VPC
              </span>

              <h3 className="mt-1 text-sm font-semibold">
                10.0.0.0/16
              </h3>
            </div>

            <div className="rounded-md border border-white/10 px-3 py-1 text-[9px] text-gray-600">
              us-east-1
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {selected.map((id) => {
              const component = components.find(
                (item) => item.id === id
              );

              if (!component) return null;

              const selectedAsSource = connectionStart === id;

              return (
                <button
                  key={id}
                  onClick={() => onNodeClick(id)}
                  className={`rounded-lg border p-3 text-left transition ${
                    selectedAsSource
                      ? "border-blue-400 bg-blue-400/10"
                      : component.dangerous
                        ? "border-red-400/20 bg-red-400/[0.02]"
                        : "border-white/10 bg-white/[0.02]"
                  } ${
                    connectMode
                      ? "cursor-pointer hover:border-blue-400/40"
                      : "cursor-default"
                  }`}
                >
                  <p className="text-[10px] font-semibold">
                    {component.name}
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-700">
                    {component.group}
                  </p>
                </button>
              );
            })}
          </div>

          {selected.length === 0 && (
            <div className="py-20 text-center text-xs text-gray-700">
              Select infrastructure components to begin.
            </div>
          )}

          {selected.length > 0 && connections.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold">
                  Architecture Connections
                </p>

                <span className="text-[9px] text-gray-700">
                  {connections.length} connections
                </span>
              </div>

              <div className="space-y-2">
                {connections.map((connection, index) => (
                  <div
                    key={`${connectionKey(connection)}-${index}`}
                    className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2"
                  >
                    <span className="text-[9px] text-gray-500">
                      {labels[connection.from]} →{" "}
                      {labels[connection.to]}
                    </span>

                    <button
                      onClick={() => onRemoveConnection(index)}
                      className="text-[8px] text-gray-700 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionPanel({
  answers,
  onAnswer,
}: {
  answers: Record<DecisionId, number>;
  onAnswer: (id: DecisionId, value: number) => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b111b] p-5">
      <div className="mb-5">
        <p className="text-sm font-semibold">
          Architecture Decisions
        </p>

        <p className="mt-1 text-[10px] text-gray-600">
          Apply your own engineering judgment. No correctness feedback
          is provided before submission.
        </p>
      </div>

      <div className="space-y-7">
        {decisions.map((decision, index) => (
          <div key={decision.id}>
            <p className="text-[11px] font-medium leading-5">
              {index + 1}. {decision.question}
            </p>

            <div className="mt-3 space-y-2">
              {decision.options.map((option, optionIndex) => {
                const selected =
                  answers[decision.id] === optionIndex;

                return (
                  <button
                    key={option}
                    onClick={() =>
                      onAnswer(decision.id, optionIndex)
                    }
                    className={`w-full rounded-lg border px-3 py-3 text-left text-[10px] transition ${
                      selected
                        ? "border-blue-400/50 bg-blue-400/[0.06] text-blue-200"
                        : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Review({
  selected,
  connections,
  answers,
  onBack,
  onSubmit,
}: {
  selected: ComponentId[];
  connections: Connection[];
  answers: Record<DecisionId, number>;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
          Final Review
        </p>

        <h2 className="mt-3 text-xl font-bold">
          Review your architecture before submission
        </h2>

        <p className="mt-3 text-xs leading-6 text-gray-500">
          This is your final review. Once submitted, the assessment
          will be permanently locked. You will not receive another
          attempt.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ReviewCard title="Selected Components">
          {selected.length === 0 ? (
            <p className="text-xs text-gray-700">
              No components selected.
            </p>
          ) : (
            <div className="space-y-2">
              {selected.map((id) => (
                <div
                  key={id}
                  className="rounded-md border border-white/10 px-3 py-2 text-[10px] text-gray-500"
                >
                  {labels[id]}
                </div>
              ))}
            </div>
          )}
        </ReviewCard>

        <ReviewCard title="Connections">
          {connections.length === 0 ? (
            <p className="text-xs text-gray-700">
              No connections defined.
            </p>
          ) : (
            <div className="space-y-2">
              {connections.map((connection, index) => (
                <div
                  key={`${connectionKey(connection)}-${index}`}
                  className="rounded-md border border-white/10 px-3 py-2 text-[10px] text-gray-500"
                >
                  {labels[connection.from]} →{" "}
                  {labels[connection.to]}
                </div>
              ))}
            </div>
          )}
        </ReviewCard>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b111b] p-5">
        <p className="text-sm font-semibold">
          Architecture decisions
        </p>

        <p className="mt-2 text-[10px] text-gray-600">
          {Object.keys(answers).length} / {decisions.length} decisions
          answered
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="rounded-md border border-white/10 px-3 py-2 text-center text-[9px] text-gray-600"
            >
              Answered
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <button
          onClick={onBack}
          className="rounded-lg border border-white/10 px-5 py-3 text-xs text-gray-500 hover:text-white"
        >
          ← Back to Design
        </button>

        <button
          onClick={onSubmit}
          className="rounded-lg bg-red-500 px-7 py-3 text-sm font-semibold text-white hover:bg-red-400"
        >
          Submit Final Architecture
        </button>
      </div>
    </div>
  );
}

function LockedResult({
  score,
  selected,
  connections,
  answers,
}: {
  score: number;
  selected: ComponentId[];
  connections: Connection[];
  answers: Record<DecisionId, number>;
}) {
  const requiredSelected = correctComponents.filter((id) =>
    selected.includes(id)
  ).length;

  const extraComponents = selected.filter(
    (id) => !correctComponents.includes(id)
  );

  const dangerousComponents = selected.filter(
    (id) =>
      components.find((component) => component.id === id)
        ?.dangerous === true
  );

  const correctConnectionCount = connections.filter((candidate) =>
    correctConnections.some((correct) =>
      sameConnection(candidate, correct)
    )
  ).length;

  const wrongConnections = connections.filter(
    (candidate) =>
      !correctConnections.some((correct) =>
        sameConnection(candidate, correct)
      )
  );

  const correctDecisionCount = decisions.filter(
    (decision) => answers[decision.id] === decision.correct
  ).length;

  const missingConnections =
    correctConnections.length - correctConnectionCount;

  const grade =
    score >= 90
      ? "Excellent"
      : score >= 75
        ? "Strong"
        : score >= 60
          ? "Needs Improvement"
          : "Poor";

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <a
              href="/"
              className="text-[11px] text-gray-600 hover:text-white"
            >
              ← CloudOps SimLab
            </a>

            <h1 className="mt-1 text-sm font-semibold">
              AWS VPC Architecture Assessment
            </h1>
          </div>

          <div className="rounded-full border border-red-400/20 bg-red-400/[0.04] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-red-300">
            Submitted — Locked
          </div>
        </div>
      </header>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
            Assessment Result
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b111b] p-7">
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold">
                {score}
              </span>

              <span className="pb-2 text-sm text-gray-600">
                / 100
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold">
              {grade}
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-600">
              Your architecture has been submitted. No further changes
              are permitted.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-4">
            <ResultMetric
              label="Required Components"
              value={`${requiredSelected}/${correctComponents.length}`}
            />

            <ResultMetric
              label="Correct Connections"
              value={`${correctConnectionCount}/${correctConnections.length}`}
            />

            <ResultMetric
              label="Decision Score"
              value={`${correctDecisionCount}/${decisions.length}`}
            />

            <ResultMetric
              label="Unnecessary Components"
              value={String(extraComponents.length)}
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <ReviewCard title="Architecture Findings">
              <div className="space-y-3">
                <Finding
                  good={requiredSelected === correctComponents.length}
                  text={
                    requiredSelected === correctComponents.length
                      ? "All required production components were selected."
                      : `${correctComponents.length - requiredSelected} required components were missing.`
                  }
                />

                <Finding
                  good={extraComponents.length === 0}
                  text={
                    extraComponents.length === 0
                      ? "No unnecessary components were selected."
                      : `${extraComponents.length} unnecessary component(s) were selected.`
                  }
                />

                <Finding
                  good={dangerousComponents.length === 0}
                  text={
                    dangerousComponents.length === 0
                      ? "No deliberately unsafe infrastructure was selected."
                      : `Unsafe component(s) selected: ${dangerousComponents
                          .map((id) => labels[id])
                          .join(", ")}`
                  }
                />

                <Finding
                  good={
                    missingConnections === 0 &&
                    wrongConnections.length === 0
                  }
                  text={
                    missingConnections === 0 &&
                    wrongConnections.length === 0
                      ? "The submitted topology matches the expected architecture."
                      : `${missingConnections} required connection(s) missing and ${wrongConnections.length} incorrect connection(s) created.`
                  }
                />
              </div>
            </ReviewCard>

            <ReviewCard title="Submitted Components">
              <div className="space-y-2">
                {selected.length === 0 ? (
                  <p className="text-xs text-gray-700">
                    No components selected.
                  </p>
                ) : (
                  selected.map((id) => {
                    const correct =
                      correctComponents.includes(id);

                    return (
                      <div
                        key={id}
                        className={`rounded-md border px-3 py-2 text-[10px] ${
                          correct
                            ? "border-green-400/20 text-green-300"
                            : "border-red-400/20 text-red-300"
                        }`}
                      >
                        {correct ? "✓" : "✕"} {labels[id]}
                      </div>
                    );
                  })
                )}
              </div>
            </ReviewCard>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b111b] p-5">
            <p className="text-sm font-semibold">
              Decision Results
            </p>

            <div className="mt-4 space-y-2">
              {decisions.map((decision) => {
                const correct =
                  answers[decision.id] === decision.correct;

                return (
                  <div
                    key={decision.id}
                    className={`rounded-lg border px-4 py-3 text-[10px] ${
                      correct
                        ? "border-green-400/20 bg-green-400/[0.02]"
                        : "border-red-400/20 bg-red-400/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          correct
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {correct ? "✓" : "✕"}
                      </span>

                      <span className="text-gray-400">
                        {decision.question}
                      </span>
                    </div>

                    <p className="mt-2 text-gray-600">
                      Your answer:{" "}
                      {decision.options[answers[decision.id]] ??
                        "Not answered"}
                    </p>

                    {!correct && (
                      <p className="mt-1 text-gray-700">
                        Expected:{" "}
                        {decision.options[decision.correct]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
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
      <span className="text-[9px] text-gray-500">
        {label}
      </span>
    </div>
  );
}

function ReviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b111b] p-5">
      <p className="mb-4 text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}

function ResultMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b111b] p-4">
      <p className="text-[9px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-gray-300">
        {value}
      </p>
    </div>
  );
}

function Finding({
  good,
  text,
}: {
  good: boolean;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-white/10 px-3 py-3">
      <span
        className={good ? "text-green-400" : "text-red-400"}
      >
        {good ? "✓" : "✕"}
      </span>

      <span className="text-[10px] leading-5 text-gray-500">
        {text}
      </span>
    </div>
  );
}

