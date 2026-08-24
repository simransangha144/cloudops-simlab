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
  | "bastion"
  | "public-ec2"
  | "nat-instance";

type AnswerKey = {
  albPlacement: string;
  appPlacement: string;
  privateRoute: string;
  natDesign: string;
  adminAccess: string;
  appInbound: string;
  publicExposure: string;
};

const correctAnswers: AnswerKey = {
  albPlacement: "public",
  appPlacement: "private",
  privateRoute: "nat",
  natDesign: "two",
  adminAccess: "ssm",
  appInbound: "alb-sg",
  publicExposure: "alb-only",
};

const components: {
  id: ComponentId;
  name: string;
  description: string;
}[] = [
  {
    id: "vpc",
    name: "VPC",
    description: "Isolated virtual network",
  },
  {
    id: "igw",
    name: "Internet Gateway",
    description: "Connects public resources to the Internet",
  },
  {
    id: "public-a",
    name: "Public Subnet — AZ A",
    description: "Subnet with Internet Gateway route",
  },
  {
    id: "public-b",
    name: "Public Subnet — AZ B",
    description: "Subnet with Internet Gateway route",
  },
  {
    id: "private-a",
    name: "Private App Subnet — AZ A",
    description: "Application workload subnet",
  },
  {
    id: "private-b",
    name: "Private App Subnet — AZ B",
    description: "Application workload subnet",
  },
  {
    id: "alb",
    name: "Application Load Balancer",
    description: "HTTP/HTTPS entry point",
  },
  {
    id: "nat-a",
    name: "NAT Gateway — AZ A",
    description: "Outbound connectivity for private resources",
  },
  {
    id: "nat-b",
    name: "NAT Gateway — AZ B",
    description: "Outbound connectivity for private resources",
  },
  {
    id: "public-rt",
    name: "Public Route Table",
    description: "Routes public traffic toward the IGW",
  },
  {
    id: "private-rt-a",
    name: "Private Route Table — AZ A",
    description: "Controls private subnet traffic",
  },
  {
    id: "private-rt-b",
    name: "Private Route Table — AZ B",
    description: "Controls private subnet traffic",
  },
  {
    id: "sg",
    name: "Security Groups",
    description: "Stateful workload traffic controls",
  },
  {
    id: "bastion",
    name: "Bastion Host",
    description: "Jump server for administrative access",
  },
  {
    id: "public-ec2",
    name: "Public EC2 Instance",
    description: "EC2 instance with public Internet exposure",
  },
  {
    id: "nat-instance",
    name: "NAT Instance",
    description: "Self-managed outbound gateway",
  },
];

const requiredComponents: ComponentId[] = [
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
];

const questions = [
  {
    id: "albPlacement",
    title: "1. Where should the Application Load Balancer live?",
    options: [
      ["public", "Public subnets"],
      ["private", "Private application subnets"],
      ["both", "Both public and private subnets"],
    ],
  },
  {
    id: "appPlacement",
    title: "2. Where should the application servers live?",
    options: [
      ["public", "Public subnets"],
      ["private", "Private application subnets"],
      ["alb", "Inside the ALB"],
    ],
  },
  {
    id: "privateRoute",
    title: "3. What should the private subnet default route use?",
    options: [
      ["igw", "Internet Gateway"],
      ["nat", "NAT Gateway"],
      ["alb", "Application Load Balancer"],
      ["none", "No default route"],
    ],
  },
  {
    id: "natDesign",
    title: "4. For production HA across two AZs, how many NAT Gateways?",
    options: [
      ["one", "One shared NAT Gateway"],
      ["two", "One NAT Gateway per AZ"],
      ["zero", "None"],
    ],
  },
  {
    id: "adminAccess",
    title: "5. How should administrators access private EC2 instances?",
    options: [
      ["ssm", "AWS Systems Manager Session Manager"],
      ["bastion", "Public bastion host"],
      ["ssh-public", "SSH directly over the Internet"],
    ],
  },
  {
    id: "appInbound",
    title: "6. What should the application Security Group allow inbound from?",
    options: [
      ["internet", "0.0.0.0/0"],
      ["alb-sg", "The ALB Security Group"],
      ["bastion", "The Bastion Security Group"],
      ["none", "Nothing"],
    ],
  },
  {
    id: "publicExposure",
    title: "7. What should be publicly reachable?",
    options: [
      ["everything", "ALB and application servers"],
      ["alb-only", "Only the Internet-facing ALB"],
      ["ec2", "Application EC2 instances"],
      ["none", "Nothing"],
    ],
  },
];

export default function AwsVpcLab() {
  const [selected, setSelected] = useState<ComponentId[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cloudops-lab-01-submitted");

    if (stored === "true") {
      setSubmitted(true);

      const storedScore = localStorage.getItem("cloudops-lab-01-score");

      if (storedScore) {
        setScore(Number(storedScore));
      }
    }
  }, []);

  const componentScore = useMemo(() => {
    const correct = selected.filter((id) =>
      requiredComponents.includes(id)
    ).length;

    const incorrect = selected.filter(
      (id) => !requiredComponents.includes(id)
    ).length;

    return Math.max(0, correct - incorrect);
  }, [selected]);

  function toggleComponent(id: ComponentId) {
    if (submitted) return;

    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function selectAnswer(questionId: string, value: string) {
    if (submitted) return;

    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  }

  function submitAssessment() {
    if (submitted) return;

    const questionScore = questions.reduce((total, question) => {
      return (
        total +
        (answers[question.id] ===
        correctAnswers[question.id as keyof AnswerKey]
          ? 1
          : 0)
      );
    }, 0);

    const finalScore = Math.max(
      0,
      componentScore + questionScore
    );

    setScore(finalScore);
    setSubmitted(true);

    localStorage.setItem("cloudops-lab-01-submitted", "true");
    localStorage.setItem("cloudops-lab-01-score", String(finalScore));
  }

  const totalPoints = requiredComponents.length + questions.length;

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-white"
            >
              ← CloudOps SimLab
            </a>

            <h1 className="mt-2 text-xl font-semibold">
              AWS VPC Architecture Assessment
            </h1>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-xs ${
              submitted
                ? "border-red-400/30 bg-red-400/10 text-red-300"
                : "border-blue-400/30 bg-blue-400/10 text-blue-300"
            }`}
          >
            {submitted ? "SUBMITTED — LOCKED" : "ATTEMPT 1 OF 1"}
          </div>
        </div>
      </header>

      <section className="border-b border-white/10 bg-[#090e17]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Scenario
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Design a production-grade private application network
          </h2>

          <div className="mt-5 max-w-4xl space-y-3 text-gray-400">
            <p>
              You are designing infrastructure for a customer-facing API.
              The application must be highly available across two
              Availability Zones.
            </p>

            <p>
              Application servers must never have public IP addresses.
              Customers must be able to reach the application from the
              Internet, while administrators must be able to access the
              servers without exposing SSH to the Internet.
            </p>

            <p>
              The application also needs outbound Internet connectivity
              for operating-system and software updates.
            </p>

            <p className="font-medium text-white">
              You are given several infrastructure components. Some are
              unnecessary or deliberately unsafe. Select only what you
              believe is required and answer the architecture questions.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <Requirement text="2 Availability Zones" />
            <Requirement text="No public EC2" />
            <Requirement text="Private application tier" />
            <Requirement text="One attempt only" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {submitted && (
          <div className="mb-8 rounded-2xl border border-blue-400/20 bg-blue-400/5 p-6">
            <p className="text-sm text-gray-400">
              Assessment Result
            </p>

            <div className="mt-2 flex items-end gap-3">
              <span className="text-5xl font-bold">
                {score}
              </span>

              <span className="mb-1 text-gray-500">
                / {totalPoints}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-400">
              Your assessment is permanently locked for this browser.
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside>
            <div className="mb-4">
              <p className="text-sm font-semibold">
                Infrastructure Components
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Think carefully. Incorrect components reduce your score.
              </p>
            </div>

            <div className="space-y-3">
              {components.map((component) => {
                const active = selected.includes(component.id);

                return (
                  <button
                    key={component.id}
                    disabled={submitted}
                    onClick={() => toggleComponent(component.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-blue-400/50 bg-blue-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    } ${
                      submitted
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {component.name}
                      </span>

                      <span className="font-mono text-xs text-gray-500">
                        {active ? "SELECTED" : "SELECT"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {component.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            <div className="rounded-2xl border border-white/10 bg-[#0b111b] p-6">
              <div className="mb-8">
                <p className="text-sm font-semibold">
                  Architecture Decisions
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  There is no feedback until you submit.
                </p>
              </div>

              <div className="space-y-8">
                {questions.map((question) => (
                  <div key={question.id}>
                    <p className="mb-3 font-medium">
                      {question.title}
                    </p>

                    <div className="grid gap-2">
                      {question.options.map(([value, label]) => {
                        const checked =
                          answers[question.id] === value;

                        const correct =
                          submitted &&
                          correctAnswers[
                            question.id as keyof AnswerKey
                          ] === value;

                        const wrong =
                          submitted &&
                          checked &&
                          !correct;

                        return (
                          <button
                            key={value}
                            disabled={submitted}
                            onClick={() =>
                              selectAnswer(question.id, value)
                            }
                            className={`rounded-xl border p-4 text-left text-sm transition ${
                              correct
                                ? "border-green-400/50 bg-green-400/10"
                                : wrong
                                ? "border-red-400/50 bg-red-400/10"
                                : checked
                                ? "border-blue-400/50 bg-blue-400/10"
                                : "border-white/10 bg-white/[0.02] hover:border-white/25"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!submitted && (
                <div className="mt-10 border-t border-white/10 pt-8">
                  <div className="mb-5 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
                    <p className="text-sm font-semibold text-yellow-300">
                      ⚠ Final submission
                    </p>

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      You have exactly one attempt. Once submitted,
                      your architecture cannot be changed.
                    </p>
                  </div>

                  <button
                    onClick={submitAssessment}
                    className="w-full rounded-xl bg-blue-500 px-6 py-4 font-semibold text-white transition hover:bg-blue-400"
                  >
                    Submit Architecture — 1 Attempt
                  </button>
                </div>
              )}

              {submitted && (
                <div className="mt-10 border-t border-white/10 pt-8">
                  <h3 className="font-semibold">
                    Assessment Review
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    Correct answers are highlighted in green.
                    Incorrect selections are highlighted in red.
                  </p>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm font-semibold">
                      Expected production architecture
                    </p>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      Internet → Internet-facing ALB → private
                      application subnets across two AZs.
                      Private subnets use NAT Gateways for outbound
                      Internet access. Administrative access should
                      use Systems Manager rather than a publicly
                      exposed bastion or SSH endpoint.
                    </p>
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

function Requirement({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-300">
      <span className="mr-2 text-blue-400">✓</span>
      {text}
    </div>
  );
}
