import Link from "next/link";
import type { ReactNode } from "react";

type Lab = {
  number: string;
  title: string;
  category: string;
  difficulty: string;
  time: string;
  description: string;
  tags: string[];
  href: string;
  available: boolean;
};

const labs: Lab[] = [
  {
    number: "01",
    title: "AWS VPC Architecture",
    category: "NETWORKING",
    difficulty: "ADVANCED",
    time: "20–30 min",
    description:
      "Design a production API network while choosing between multiple valid AWS implementation patterns.",
    tags: ["AWS", "Networking", "Security"],
    href: "/labs/aws-vpc",
    available: true,
  },

  {
    number: "02",
    title: "CI/CD Pipeline",
    category: "DEVOPS",
    difficulty: "ADVANCED",
    time: "Coming soon",
    description:
      "Design source control, build, test, deployment and production promotion workflows.",
    tags: ["GitHub Actions", "CI/CD", "DevOps"],
    href: "/labs/cicd",
    available: false,
  },

  {
    number: "03",
    title: "Kubernetes Deployment",
    category: "CONTAINERS",
    difficulty: "ADVANCED",
    time: "Coming soon",
    description:
      "Work with deployments, services, ingress, scaling and rolling deployments.",
    tags: ["Kubernetes", "Containers", "SRE"],
    href: "/labs/kubernetes",
    available: false,
  },

  {
    number: "04",
    title: "Terraform Infrastructure",
    category: "INFRASTRUCTURE",
    difficulty: "ADVANCED",
    time: "25–35 min",
    description:
      "Build and reason about production infrastructure using Terraform, modules, state, dependencies and infrastructure-as-code patterns.",
    tags: ["Terraform", "IaC", "AWS"],
    href: "/labs/terraform",
    available: true,
  },
];

const platforms = [
  {
    title: "AWS",
    description:
      "VPC, compute, IAM, load balancing and production networking.",
    icon: "AWS",
    live: true,
  },
  {
    title: "Azure",
    description:
      "Virtual networks, identity, compute and enterprise architecture.",
    icon: "AZ",
    live: false,
  },
  {
    title: "GCP",
    description:
      "VPC, GKE, IAM and scalable cloud infrastructure patterns.",
    icon: "GC",
    live: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#03060b] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[8%] top-[-180px] h-[520px] w-[520px] rounded-full bg-cyan-500/[0.08] blur-[140px]" />
        <div className="absolute right-[-100px] top-[20%] h-[620px] w-[620px] rounded-full bg-blue-600/[0.10] blur-[170px]" />
        <div className="absolute bottom-[-220px] left-[35%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.07] blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#03060b]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400 to-blue-600 font-black shadow-lg shadow-blue-600/20">
              <span>C</span>
              <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
            </div>

            <div>
              <div className="font-semibold tracking-tight">
                CloudOps SimLab
              </div>

              <div className="text-[9px] uppercase tracking-[0.24em] text-gray-500">
                Cloud Engineering Simulator
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-xs text-gray-400 md:flex">
            <a
              href="#platforms"
              className="transition hover:text-white"
            >
              Platforms
            </a>

            <a
              href="#labs"
              className="transition hover:text-white"
            >
              Assessments
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>

            <a
              href="https://github.com/simransangha144/cloudops-simlab"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 px-4 py-2 transition hover:border-cyan-400/30 hover:bg-white/[0.04] hover:text-white"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-24 lg:grid-cols-[1.08fr_.92fr] lg:pb-32 lg:pt-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.9)]" />
              Production-style cloud assessments
            </div>

            <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Test cloud engineering
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                without the training wheels.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              A hands-on simulator for testing real infrastructure judgment.
              Candidates read requirements, choose an architecture, connect
              resources and submit their design.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/labs/aws-vpc"
                className="group flex items-center gap-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-bold text-[#021018] shadow-xl shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20"
              >
                Start Assessment

                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#labs"
                className="rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                Explore Labs
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.16em] text-gray-600">
              <span>Architecture judgment</span>
              <span>•</span>
              <span>Production patterns</span>
              <span>•</span>
              <span>Hands-on decisions</span>
            </div>
          </div>

          <ArchitecturePreview />
        </div>
      </section>

      {/* Platforms */}
      <section
        id="platforms"
        className="relative border-y border-white/[0.07] bg-white/[0.012]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-9 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400">
                Platforms
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Cloud, without the shortcuts.
              </h2>
            </div>

            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-gray-600 md:block">
              AWS live • Azure / GCP next
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {platforms.map((platform) => (
              <div
                key={platform.title}
                className={`group rounded-2xl border p-6 transition ${
                  platform.live
                    ? "border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.07] to-blue-500/[0.02] hover:border-cyan-300/35"
                    : "border-white/10 bg-white/[0.018] opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 font-mono text-xs font-bold text-gray-300">
                    {platform.icon}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-widest ${
                      platform.live
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "bg-white/5 text-gray-600"
                    }`}
                  >
                    {platform.live ? "Live" : "Soon"}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  {platform.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {platform.description}
                </p>

                {platform.live && (
                  <Link
                    href="/labs/aws-vpc"
                    className="mt-6 flex items-center justify-between rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-cyan-300"
                  >
                    Open networking lab
                    <span>→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Labs */}
      <section id="labs" className="relative">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Simulation Labs
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Real engineering decisions.
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              Multiple production architectures can be valid. The candidate
              must reason about requirements, trade-offs and topology—not just
              click a predetermined answer.
            </p>
          </div>

          {/* Changed to 4-column layout on large screens */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {labs.map((lab) => (
              <article
                key={lab.number}
                className={`group relative overflow-hidden rounded-2xl border p-7 ${
                  lab.available
                    ? "border-cyan-400/20 bg-gradient-to-b from-cyan-400/[0.05] to-[#080d15] hover:-translate-y-1 hover:border-cyan-300/35"
                    : "border-white/10 bg-white/[0.015] opacity-65"
                }`}
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-cyan-400/10" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan-400">
                      LAB_{lab.number}
                    </span>

                    <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">
                      {lab.available ? "LIVE" : "LOCKED"}
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    <Badge>{lab.category}</Badge>
                    <Badge>{lab.difficulty}</Badge>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {lab.title}
                  </h3>

                  <p className="mt-4 min-h-[96px] text-sm leading-6 text-gray-500">
                    {lab.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-5 text-[9px] uppercase tracking-wider text-gray-600">
                    <span>◷ {lab.time}</span>

                    {lab.available && (
                      <span>● Practice enabled</span>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {lab.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 px-2.5 py-1 text-[9px] text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {lab.available ? (
                    <Link
                      href={lab.href}
                      className="mt-8 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3.5 text-xs font-bold text-[#021018]"
                    >
                      Start Assessment
                      <span>→</span>
                    </Link>
                  ) : (
                    <div className="mt-8 rounded-xl border border-white/10 px-4 py-3.5 text-center text-xs text-gray-600">
                      Assessment unavailable
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t border-white/[0.07] bg-white/[0.012]"
      >
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400">
            CloudOps SimLab
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Built to expose engineering judgment.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500">
            The goal is not to memorize service names. It is to turn
            requirements into resilient, secure and explainable infrastructure.
          </p>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            <MiniFeature
              n="01"
              title="Reason"
              text="Interpret constraints before touching resources."
            />

            <MiniFeature
              n="02"
              title="Design"
              text="Choose a viable production architecture."
            />

            <MiniFeature
              n="03"
              title="Defend"
              text="Submit a topology that survives validation."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] px-6 py-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[9px] uppercase tracking-[0.18em] text-gray-600">
          <span>CloudOps SimLab</span>
          <span>Infrastructure • DevOps • SRE</span>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Architecture Preview                                                        */
/* -------------------------------------------------------------------------- */

function ArchitecturePreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101a]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">
              LIVE PREVIEW
            </div>

            <div className="mt-1 text-sm font-semibold">
              Production API topology
            </div>
          </div>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[8px] text-emerald-300">
            DESIGN MODE
          </div>
        </div>

        <div className="relative mt-5 h-[330px]">
          <div className="absolute inset-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.015]" />

          <Node x="6%" y="42%" label="INTERNET" small />

          <Node x="31%" y="22%" label="API GATEWAY" />

          <Node x="31%" y="62%" label="ALB" />

          <Node x="64%" y="22%" label="LAMBDA" />

          <Node x="64%" y="62%" label="ECS / EC2" />

          <Node x="82%" y="42%" label="PRIVATE DATA" small />

          <div className="absolute left-[19%] top-[48%] h-px w-[12%] bg-gradient-to-r from-cyan-400/0 via-cyan-400/60 to-cyan-400/0" />

          <div className="absolute left-[47%] top-[34%] h-px w-[17%] rotate-[-24deg] bg-gradient-to-r from-blue-400/0 via-blue-400/60 to-blue-400/0" />

          <div className="absolute left-[47%] top-[65%] h-px w-[17%] rotate-[20deg] bg-gradient-to-r from-blue-400/0 via-blue-400/60 to-blue-400/0" />

          <div className="absolute left-[75%] top-[43%] h-px w-[10%] bg-gradient-to-r from-indigo-400/0 via-indigo-400/60 to-indigo-400/0" />

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.18em] text-gray-700">
            multiple valid patterns
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <Stat value="04" label="patterns" />
          <Stat value="AZ" label="resilience" />
          <Stat value="IAM" label="security" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                  */
/* -------------------------------------------------------------------------- */

function Node({
  x,
  y,
  label,
  small,
}: {
  x: string;
  y: string;
  label: string;
  small?: boolean;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0a1420] px-3 py-2 shadow-lg"
      style={{
        left: x,
        top: y,
      }}
    >
      <div
        className={`font-mono font-semibold ${
          small
            ? "text-[7px] text-gray-500"
            : "text-[8px] text-gray-300"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </span>
  );
}

function MiniFeature({
  n,
  title,
  text,
}: {
  n: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.018] p-5">
      <div className="font-mono text-[9px] text-cyan-400">
        {n}
      </div>

      <div className="mt-3 font-semibold">
        {title}
      </div>

      <div className="mt-2 text-xs leading-5 text-gray-600">
        {text}
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-center">
      <div className="font-mono text-sm font-semibold text-cyan-300">
        {value}
      </div>

      <div className="mt-1 text-[7px] uppercase tracking-[0.15em] text-gray-600">
        {label}
      </div>
    </div>
  );
}
