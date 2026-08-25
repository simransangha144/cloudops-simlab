import Link from "next/link";

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
    title: "Terraform Infrastructure Assessment",
    category: "INFRASTRUCTURE AS CODE",
    difficulty: "ADVANCED",
    time: "25–35 min",
    description:
      "Test your ability to design reusable, production-grade infrastructure using Terraform, including state, variables, modules, dependencies and AWS resources.",
    tags: ["Terraform", "IaC", "AWS"],
    href: "/labs/terraform",
    available: true,
  },
  {
    number: "03",
    title: "CI/CD Pipeline",
    category: "DEVOPS",
    difficulty: "ADVANCED",
    time: "20–30 min",
    description:
      "Design source control, build, test, deployment and production promotion workflows.",
    tags: ["GitHub Actions", "CI/CD", "DevOps"],
    href: "/labs/cicd",
    available: true,
  },
  {
    number: "04",
    title: "Kubernetes Deployment",
    category: "CONTAINERS",
    difficulty: "ADVANCED",
    time: "20–30 min",
    description:
      "Work with deployments, services, ingress, scaling and rolling deployments.",
    tags: ["Kubernetes", "Containers", "SRE"],
    href: "/labs/kubernetes",
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
    href: "/labs/aws-vpc",
  },
  {
    title: "Azure",
    description:
      "Virtual networks, identity, compute and enterprise architecture.",
    icon: "AZ",
    live: false,
    href: "#",
  },
  {
    title: "GCP",
    description:
      "VPC, GKE, IAM and scalable cloud infrastructure patterns.",
    icon: "GC",
    live: false,
    href: "#",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
        {eyebrow}
      </div>

      <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-8 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-gray-500">
      {children}
    </span>
  );
}

function PlatformCard({
  platform,
}: {
  platform: (typeof platforms)[number];
}) {
  const card = (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl border p-7 transition duration-300 ${
        platform.live
          ? "border-cyan-400/20 bg-cyan-400/[0.025] hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/[0.045]"
          : "border-white/[0.07] bg-white/[0.01] opacity-60"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#080d15] text-xs font-bold text-gray-300">
          {platform.icon}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${
            platform.live
              ? "border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300"
              : "border border-white/5 bg-white/[0.02] text-gray-600"
          }`}
        >
          {platform.live ? "LIVE" : "SOON"}
        </span>
      </div>

      <div className="relative mt-7">
        <h3 className="text-2xl font-semibold tracking-tight">
          {platform.title}
        </h3>

        <p className="mt-4 min-h-[56px] text-sm leading-7 text-gray-500">
          {platform.description}
        </p>
      </div>

      {platform.live ? (
        <div className="relative mt-7 flex items-center justify-between rounded-lg border border-cyan-400/20 bg-cyan-400/[0.035] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300 transition group-hover:bg-cyan-400/[0.07]">
          <span>Open Networking Lab</span>
          <span className="text-sm transition group-hover:translate-x-1">
            →
          </span>
        </div>
      ) : (
        <div className="relative mt-7 rounded-lg border border-white/[0.06] px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-gray-700">
          Coming soon
        </div>
      )}
    </div>
  );

  if (!platform.live) {
    return card;
  }

  return <Link href={platform.href}>{card}</Link>;
}

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
                CloudForge Assessments
              </div>

              <div className="text-[9px] uppercase tracking-[0.24em] text-gray-500">
                Cloud Infrastructure Engineering Assessments
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
            <a
              href="#labs"
              className="group flex items-center gap-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-bold text-[#021018] shadow-xl shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20"
              >
              Start Assessment
               <span className="transition group-hover:translate-x-1">→</span>
              </a>

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

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-blue-500/[0.06] blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070c14]/90 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    Live preview
                  </div>

                  <div className="mt-2 text-sm font-semibold">
                    Production API topology
                  </div>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1 text-[8px] uppercase tracking-[0.16em] text-emerald-300">
                  Design mode
                </div>
              </div>

              <div className="relative mt-5 h-[330px] overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#061019]">
                <div className="absolute inset-0 opacity-40">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>

                {/* Connection lines */}
                <div className="absolute left-[25%] top-[49%] h-px w-[24%] rotate-[-5deg] bg-gradient-to-r from-cyan-400/30 to-blue-400/40" />

                <div className="absolute left-[51%] top-[42%] h-px w-[22%] rotate-[-25deg] bg-gradient-to-r from-blue-400/40 to-indigo-400/30" />

                <div className="absolute left-[51%] top-[58%] h-px w-[22%] rotate-[25deg] bg-gradient-to-r from-blue-400/40 to-indigo-400/30" />

                {/* Nodes */}
                <div className="absolute left-[6%] top-[43%] rounded-xl border border-white/10 bg-[#0a111c] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400 shadow-xl">
                  Internet
                </div>

                <div className="absolute left-[28%] top-[29%] rounded-xl border border-cyan-400/15 bg-[#0a111c] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-300 shadow-xl">
                  API Gateway
                </div>

                <div className="absolute left-[28%] top-[57%] rounded-xl border border-blue-400/15 bg-[#0a111c] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-300 shadow-xl">
                  ALB
                </div>

                <div className="absolute right-[24%] top-[29%] rounded-xl border border-indigo-400/15 bg-[#0a111c] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-300 shadow-xl">
                  Lambda
                </div>

                <div className="absolute right-[18%] top-[57%] rounded-xl border border-blue-400/15 bg-[#0a111c] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-300 shadow-xl">
                  ECS / EC2
                </div>

                <div className="absolute right-[5%] top-[43%] rounded-xl border border-white/10 bg-[#0a111c] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400 shadow-xl">
                  Private Data
                </div>

                <div className="absolute bottom-4 left-0 right-0 text-center text-[8px] uppercase tracking-[0.2em] text-gray-700">
                  Multiple valid patterns
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                  <div className="text-lg font-semibold">04</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.15em] text-gray-600">
                    Patterns
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                  <div className="text-lg font-semibold">AZ</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.15em] text-gray-600">
                    Resilience
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                  <div className="text-lg font-semibold">IAM</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.15em] text-gray-600">
                    Security
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section
        id="platforms"
        className="relative border-t border-white/[0.07]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow="Platforms"
            title="Cloud, without the shortcuts."
            description="Practice infrastructure decisions across the platforms and tools used in real production environments."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.title}
                platform={platform}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Assessments */}
      <section
        id="labs"
        className="relative border-t border-white/[0.07]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow="Simulation Labs"
            title="Real engineering decisions."
            description="Multiple production architectures can be valid. The candidate must reason about requirements, trade-offs and topology—not just click a predetermined answer."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {labs.map((lab) => (
              <article
                key={lab.number}
                className={`group relative flex min-h-[480px] flex-col overflow-hidden rounded-2xl border p-7 transition duration-300 ${
                  lab.available
                    ? "border-cyan-400/20 bg-cyan-400/[0.025] hover:-translate-y-1 hover:border-cyan-400/40"
                    : "border-white/[0.07] bg-white/[0.01] opacity-60"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-cyan-300">
                    LAB_{lab.number}
                  </span>

                  <span className="text-[8px] uppercase tracking-[0.18em] text-gray-600">
                    {lab.available ? "LIVE" : "LOCKED"}
                  </span>
                </div>

                <div className="relative mt-8 flex flex-wrap gap-2">
                  <Badge>{lab.category}</Badge>
                  <Badge>{lab.difficulty}</Badge>
                </div>

                <h3 className="relative mt-6 text-xl font-semibold leading-7 tracking-tight">
                  {lab.title}
                </h3>

                <p className="relative mt-4 flex-1 text-sm leading-7 text-gray-500">
                  {lab.description}
                </p>

                <div className="relative mt-6 flex items-center gap-4 text-[9px] uppercase tracking-[0.12em] text-gray-600">
                  <span>◷ {lab.time}</span>

                  {lab.available && (
                    <>
                      <span>•</span>
                      <span>Practice enabled</span>
                    </>
                  )}
                </div>

                <div className="relative mt-6 flex flex-wrap gap-2">
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
                    className="relative mt-8 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3.5 text-xs font-bold text-[#021018] transition hover:brightness-110"
                  >
                    <span>Start Assessment</span>
                    <span className="text-sm transition group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ) : (
                  <div className="relative mt-8 w-full rounded-xl border border-white/10 px-4 py-3.5 text-center text-xs text-gray-700">
                    Assessment unavailable
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative border-t border-white/[0.07] bg-[#02050a]"
      >
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            CloudForge Assessments
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
            Built to test engineering judgment.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-500">
            CloudForge Assessments focuses on the decisions engineers make when
            designing real infrastructure: availability, security,
            networking, scalability, operational access and infrastructure
            as code.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Badge>AWS</Badge>
            <Badge>Terraform</Badge>
            <Badge>Networking</Badge>
            <Badge>Security</Badge>
            <Badge>DevOps</Badge>
            <Badge>Infrastructure</Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-[9px] uppercase tracking-[0.16em] text-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <span>CloudForge Assessments</span>

          <span>
            AWS LIVE · AZURE / GCP NEXT · PRODUCTION PATTERNS
          </span>
        </div>
      </footer>
    </main>
  );
}
