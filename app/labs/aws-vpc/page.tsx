import Link from "next/link";

type Lab = {
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  difficulty: string;
  time: string;
  description: string;
  tags: string[];
  href: string;
  accent: "cyan" | "violet" | "amber" | "emerald";
  icon: string;
};

const labs: Lab[] = [
  {
    number: "01",
    title: "AWS VPC Architecture",
    shortTitle: "VPC ARCHITECTURE",
    category: "NETWORKING",
    difficulty: "ADVANCED",
    time: "20–30 MIN",
    description:
      "Design a production-grade private application network while solving ingress, egress, routing, availability and security requirements.",
    tags: ["AWS", "NETWORKING", "SECURITY"],
    href: "/labs/aws-vpc",
    accent: "cyan",
    icon: "⌁",
  },
  {
    number: "02",
    title: "Terraform Infrastructure",
    shortTitle: "TERRAFORM",
    category: "INFRASTRUCTURE AS CODE",
    difficulty: "ADVANCED",
    time: "25–35 MIN",
    description:
      "Design reusable infrastructure with Terraform while reasoning about state, dependencies, variables, modules and production operations.",
    tags: ["TERRAFORM", "IaC", "AWS"],
    href: "/labs/terraform",
    accent: "violet",
    icon: "⌘",
  },
  {
    number: "03",
    title: "CI/CD Pipeline",
    shortTitle: "CI / CD",
    category: "DEVOPS",
    difficulty: "ADVANCED",
    time: "25–35 MIN",
    description:
      "Design a production delivery pipeline covering source control, testing, artifacts, security, deployments and production promotion.",
    tags: ["GITHUB ACTIONS", "CI/CD", "DEVOPS"],
    href: "/labs/cicd",
    accent: "amber",
    icon: "▶",
  },
  {
    number: "04",
    title: "Kubernetes Deployment",
    shortTitle: "KUBERNETES",
    category: "CONTAINERS",
    difficulty: "ADVANCED",
    time: "25–35 MIN",
    description:
      "Design a resilient Kubernetes workload using deployments, services, ingress, health probes, scaling and operational controls.",
    tags: ["KUBERNETES", "CONTAINERS", "SRE"],
    href: "/labs/kubernetes",
    accent: "emerald",
    icon: "⬡",
  },
];

const accentStyles = {
  cyan: {
    text: "text-cyan-300",
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/[0.07]",
    glow: "bg-cyan-400/10",
    button:
      "from-cyan-300 to-blue-500 text-[#031016] shadow-cyan-500/10",
    dot: "bg-cyan-300",
  },
  violet: {
    text: "text-violet-300",
    border: "border-violet-400/20",
    bg: "bg-violet-400/[0.07]",
    glow: "bg-violet-400/10",
    button:
      "from-violet-300 to-indigo-500 text-[#080512] shadow-violet-500/10",
    dot: "bg-violet-300",
  },
  amber: {
    text: "text-amber-300",
    border: "border-amber-400/20",
    bg: "bg-amber-400/[0.07]",
    glow: "bg-amber-400/10",
    button:
      "from-amber-300 to-orange-500 text-[#120a02] shadow-amber-500/10",
    dot: "bg-amber-300",
  },
  emerald: {
    text: "text-emerald-300",
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/[0.07]",
    glow: "bg-emerald-400/10",
    button:
      "from-emerald-300 to-teal-500 text-[#02100b] shadow-emerald-500/10",
    dot: "bg-emerald-300",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02050a] text-white selection:bg-cyan-400/20">
      <Background />

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#02050a]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600 font-black shadow-[0_0_35px_rgba(34,211,238,.15)]">
              <span className="relative z-10 text-[#021018]">C</span>

              <div className="absolute -inset-8 translate-x-[-120%] rotate-12 bg-white/30 transition duration-700 group-hover:translate-x-[120%]" />
            </div>

            <div>
              <div className="text-sm font-bold tracking-tight">
                CloudForge
                <span className="ml-1.5 font-normal text-gray-500">
                  Assessments
                </span>
              </div>

              <div className="text-[8px] uppercase tracking-[0.28em] text-gray-600">
                Engineering Judgment Platform
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500 md:flex">
            <a
              href="#assessments"
              className="transition hover:text-cyan-300"
            >
              Assessments
            </a>

            <a
              href="#method"
              className="transition hover:text-cyan-300"
            >
              Method
            </a>

            <a
              href="#platforms"
              className="transition hover:text-cyan-300"
            >
              Platforms
            </a>

            <a
              href="https://github.com/simransangha144/cloudops-simlab"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 px-4 py-2 text-gray-400 transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.04] hover:text-white"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/[0.045] px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Production-style assessments
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl lg:text-[76px]">
              Prove you can
              <br />

              <span className="bg-gradient-to-r from-cyan-200 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                build it.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-gray-500 sm:text-lg">
              CloudForge is a hands-on engineering assessment platform built
              around real infrastructure decisions—not tutorials,
              memorization or guided click-throughs.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#assessments"
                className="group flex items-center gap-5 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#021018] shadow-2xl shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20"
              >
                Explore assessments
                <span className="text-base transition group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#method"
                className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:border-white/20 hover:bg-white/[0.045] hover:text-white"
              >
                How it works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[9px] font-medium uppercase tracking-[0.2em] text-gray-700">
              <span>Architecture</span>
              <span>•</span>
              <span>Infrastructure</span>
              <span>•</span>
              <span>DevOps</span>
              <span>•</span>
              <span>SRE</span>
            </div>
          </div>

          <HeroTopology />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/[0.07] bg-white/[0.012]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[0.07] px-5 lg:grid-cols-4 lg:px-8">
          <StatBlock value="04" label="Live assessments" />
          <StatBlock value="4×" label="Engineering domains" />
          <StatBlock value="ADV" label="Assessment level" />
          <StatBlock value="∞" label="Practice attempts" />
        </div>
      </section>

      {/* ASSESSMENTS */}
      <section id="assessments" className="relative scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-28">
          <SectionHeader
            eyebrow="01 / Assessment catalog"
            title="Engineering problems."
            description="Choose a scenario. Read the constraints. Make the architectural decisions yourself."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {labs.map((lab) => (
              <AssessmentCard key={lab.number} lab={lab} />
            ))}
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section
        id="method"
        className="border-y border-white/[0.07] bg-white/[0.012]"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <SectionHeader
            eyebrow="02 / The methodology"
            title="No training wheels."
            description="CloudForge is designed to expose engineering judgment rather than reward memorization."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <MethodCard
              number="01"
              title="Read"
              description="Understand the scenario, constraints, availability requirements and operational expectations."
            />

            <MethodCard
              number="02"
              title="Reason"
              description="Evaluate multiple possible architectures and determine which one actually satisfies the requirements."
            />

            <MethodCard
              number="03"
              title="Submit"
              description="Commit to your design and see how your decisions compare against the expected engineering solution."
            />
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section id="platforms">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <SectionHeader
            eyebrow="03 / Technology domains"
            title="Built around real platforms."
            description="The assessment catalog expands across the technologies engineers use every day."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Platform
              name="AWS"
              items="VPC · IAM · EC2 · ALB · RDS"
              active
            />

            <Platform
              name="Terraform"
              items="Modules · State · Variables · Dependencies"
              active
            />

            <Platform
              name="Kubernetes"
              items="Deployments · Services · Ingress · Scaling"
              active
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.07]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.05] via-blue-500/[0.08] to-violet-500/[0.05]" />

        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center lg:px-8">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-300">
            +
          </div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
            CloudForge Assessments
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Ready to make the call?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500">
            Pick an assessment and see whether your infrastructure judgment
            holds up under production-style constraints.
          </p>

          <a
            href="#assessments"
            className="mt-9 inline-flex items-center gap-5 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-7 py-4 text-xs font-black uppercase tracking-wider text-[#021018] shadow-2xl shadow-cyan-500/10 transition hover:-translate-y-0.5"
          >
            Enter the forge
            <span className="text-base">→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.07] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[8px] font-medium uppercase tracking-[0.2em] text-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <span>
            CloudForge Assessments
          </span>

          <span>
            Engineering judgment · Infrastructure · DevOps · SRE
          </span>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* BACKGROUND                                                                 */
/* -------------------------------------------------------------------------- */

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-[-180px] top-[-220px] h-[600px] w-[600px] rounded-full bg-cyan-500/[0.07] blur-[150px]" />

      <div className="absolute right-[-200px] top-[15%] h-[700px] w-[700px] rounded-full bg-blue-600/[0.08] blur-[170px]" />

      <div className="absolute bottom-[-250px] left-[30%] h-[650px] w-[650px] rounded-full bg-violet-600/[0.05] blur-[180px]" />

      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO TOPOLOGY                                                              */
/* -------------------------------------------------------------------------- */

function HeroTopology() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-10 rounded-full bg-cyan-400/[0.06] blur-[80px]" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050b12]/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-cyan-400">
              ENGINEERING TOPOLOGY
            </div>

            <div className="mt-1 text-sm font-semibold">
              Production architecture
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.04] px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

            <span className="text-[7px] uppercase tracking-widest text-emerald-300">
              Design mode
            </span>
          </div>
        </div>

        <div className="relative mt-5 h-[330px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#03070c]">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.05) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <TopologyLine
            x1="17%"
            y1="50%"
            x2="34%"
            y2="50%"
          />

          <TopologyLine
            x1="43%"
            y1="42%"
            x2="59%"
            y2="29%"
          />

          <TopologyLine
            x1="43%"
            y1="58%"
            x2="59%"
            y2="70%"
          />

          <TopologyLine
            x1="68%"
            y1="29%"
            x2="82%"
            y2="48%"
          />

          <TopologyLine
            x1="68%"
            y1="70%"
            x2="82%"
            y2="52%"
          />

          <TopologyNode
            left="9%"
            top="50%"
            label="INTERNET"
            sub="PUBLIC"
          />

          <TopologyNode
            left="35%"
            top="50%"
            label="EDGE"
            sub="INGRESS"
          />

          <TopologyNode
            left="61%"
            top="29%"
            label="APP"
            sub="AZ-A"
          />

          <TopologyNode
            left="61%"
            top="70%"
            label="APP"
            sub="AZ-B"
          />

          <TopologyNode
            left="84%"
            top="50%"
            label="DATA"
            sub="PRIVATE"
          />

          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-gray-700">
              Multi-AZ
            </span>

            <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-gray-700">
              Private workloads
            </span>

            <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-gray-700">
              Secure ingress
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MiniStat value="HA" label="Availability" />

          <MiniStat value="IAM" label="Security" />

          <MiniStat value="AZ ×2" label="Resilience" />
        </div>
      </div>
    </div>
  );
}

function TopologyNode({
  left,
  top,
  label,
  sub,
}: {
  left: string;
  top: string;
  label: string;
  sub: string;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      <div className="relative flex h-14 w-20 flex-col items-center justify-center rounded-xl border border-cyan-400/20 bg-[#08131d]/95 shadow-[0_0_25px_rgba(34,211,238,.05)]">
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.8)]" />

        <div className="mt-1 font-mono text-[7px] font-bold text-gray-300">
          {label}
        </div>

        <div className="font-mono text-[6px] uppercase tracking-wider text-gray-600">
          {sub}
        </div>
      </div>
    </div>
  );
}

function TopologyLine({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}) {
  return (
    <div
      className="absolute h-px origin-left bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0"
      style={{
        left: x1,
        top: y1,
        width: `${Math.sqrt(
          Math.pow(parseFloat(x2) - parseFloat(x1), 2) +
            Math.pow(parseFloat(y2) - parseFloat(y1), 2)
        )}%`,
        transform: `rotate(${Math.atan2(
          parseFloat(y2) - parseFloat(y1),
          parseFloat(x2) - parseFloat(x1)
        ) * (180 / Math.PI)}deg)`,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* ASSESSMENT CARD                                                            */
/* -------------------------------------------------------------------------- */

function AssessmentCard({ lab }: { lab: Lab }) {
  const accent = accentStyles[lab.accent];

  return (
    <Link
      href={lab.href}
      className={`group relative overflow-hidden rounded-2xl border ${accent.border} bg-[#060b12] p-7 transition duration-300 hover:-translate-y-1 hover:bg-[#08101a]`}
    >
      <div
        className={`absolute -right-20 -top-20 h-56 w-56 rounded-full ${accent.glow} opacity-40 blur-[70px] transition duration-500 group-hover:opacity-80`}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accent.border} ${accent.bg} font-mono text-lg ${accent.text}`}
            >
              {lab.icon}
            </div>

            <div>
              <div
                className={`font-mono text-[8px] font-semibold uppercase tracking-[0.2em] ${accent.text}`}
              >
                LAB_{lab.number}
              </div>

              <div className="mt-1 text-[8px] uppercase tracking-[0.18em] text-gray-600">
                {lab.category}
              </div>
            </div>
          </div>

          <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
            ● LIVE
          </span>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold tracking-tight">
            {lab.title}
          </h3>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
            {lab.description}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          <Meta text={lab.difficulty} />
          <Meta text={lab.time} />
          <Meta text="PRODUCTION SCENARIO" />
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {lab.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/[0.07] bg-white/[0.015] px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-wider text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
          <span
            className={`text-[9px] font-bold uppercase tracking-[0.2em] ${accent.text}`}
          >
            Enter challenge
          </span>

          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accent.button} text-sm transition group-hover:translate-x-1`}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Meta({ text }: { text: string }) {
  return (
    <span className="rounded-md border border-white/[0.07] bg-white/[0.015] px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-wider text-gray-500">
      {text}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* OTHER COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="font-mono text-[8px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
        {eyebrow}
      </div>

      <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function StatBlock({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-9">
      <div className="font-mono text-2xl font-bold tracking-tight text-gray-200">
        {value}
      </div>

      <div className="mt-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-gray-600">
        {label}
      </div>
    </div>
  );
}

function MiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-3">
      <div className="font-mono text-xs font-bold text-gray-300">
        {value}
      </div>

      <div className="mt-1 text-[7px] uppercase tracking-wider text-gray-700">
        {label}
      </div>
    </div>
  );
}

function MethodCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.015] p-7 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.02]">
      <div className="font-mono text-[9px] text-cyan-400">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function Platform({
  name,
  items,
  active,
}: {
  name: string;
  items: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-7 transition ${
        active
          ? "border-white/10 bg-white/[0.018] hover:border-cyan-400/20"
          : "border-white/[0.06] bg-white/[0.01]"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          {name}
        </h3>

        {active && (
          <span className="flex items-center gap-2 text-[7px] uppercase tracking-widest text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        )}
      </div>

      <p className="mt-4 text-xs leading-6 text-gray-600">
        {items}
      </p>
    </div>
  );
}