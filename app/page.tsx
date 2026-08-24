const platforms = [
  {
    name: "AWS",
    description: "VPCs, EC2, RDS, IAM, ALB, CloudWatch",
  },
  {
    name: "Azure",
    description: "VNets, App Services, Functions, Key Vault",
  },
  {
    name: "GCP",
    description: "VPC, GKE, Cloud Run, IAM, Logging",
  },
];

const labs = [
  {
    number: "01",
    title: "AWS VPC Architecture",
    description:
      "Design a production-style VPC with public and private subnets, routing and security controls.",
    tags: ["AWS", "Networking", "Security"],
  },
  {
    number: "02",
    title: "CI/CD Pipeline",
    description:
      "Simulate source control, build, test, deployment and production promotion.",
    tags: ["GitHub Actions", "CI/CD", "DevOps"],
  },
  {
    number: "03",
    title: "Kubernetes Deployment",
    description:
      "Explore pods, deployments, services, ingress and rolling deployments.",
    tags: ["Kubernetes", "Containers", "DevOps"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#070b12]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 font-bold">
              C
            </div>

            <div>
              <div className="font-semibold tracking-tight">
                CloudOps SimLab
              </div>
              <div className="text-xs text-gray-500">
                Cloud Engineering Simulator
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#platforms" className="transition hover:text-white">
              Platforms
            </a>
            <a href="#labs" className="transition hover:text-white">
              Labs
            </a>
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a
              href="https://github.com/simransangha144/cloudops-simlab"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 px-4 py-2 text-gray-300 transition hover:border-white/30 hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-24">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Interactive Cloud Engineering Lab
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Build cloud infrastructure.
              <br />
              <span className="text-blue-400">Break it. Fix it.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
              CloudOps SimLab is an interactive environment for learning,
              demonstrating and experimenting with modern cloud
              infrastructure, DevOps and security concepts.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#labs"
                className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
              >
                Explore Labs
              </a>

              <a
                href="#platforms"
                className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-gray-300 transition hover:border-white/30 hover:text-white"
              >
                Explore Platforms
              </a>
            </div>
          </div>

          {/* Terminal */}
          <div className="mt-20 overflow-hidden rounded-2xl border border-white/10 bg-[#0b111b] shadow-2xl shadow-blue-950/30">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
              <span className="ml-3 text-xs text-gray-500">
                cloudops-simlab
              </span>
            </div>

            <div className="p-6 font-mono text-sm leading-8">
              <div className="text-gray-500">
                # simulate production infrastructure
              </div>
              <div>
                <span className="text-blue-400">$</span>{" "}
                <span className="text-gray-200">
                  cloudops lab create aws-vpc
                </span>
              </div>
              <div className="text-green-400">
                ✓ VPC architecture initialized
              </div>
              <div className="text-green-400">
                ✓ Public subnet created
              </div>
              <div className="text-green-400">
                ✓ Private subnet created
              </div>
              <div className="text-green-400">
                ✓ Security controls applied
              </div>
              <div>
                <span className="text-blue-400">$</span>{" "}
                <span className="text-gray-200">
                  cloudops lab simulate failure
                </span>
              </div>
              <div className="text-yellow-400">
                ⚠ Simulating availability-zone failure...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="border-t border-white/10 bg-[#090e17]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Cloud Platforms
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Learn across the major clouds
            </h2>
            <p className="mt-4 max-w-2xl text-gray-400">
              Understand the architecture patterns and operational concepts
              that transfer across cloud providers.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:-translate-y-1 hover:border-blue-400/30"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-400">
                  {platform.name[0]}
                </div>

                <h3 className="text-xl font-semibold">{platform.name}</h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {platform.description}
                </p>

                <div className="mt-6 text-sm font-medium text-blue-400">
                  Explore →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Labs */}
      <section id="labs" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Simulation Labs
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Hands-on infrastructure scenarios
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {labs.map((lab) => (
              <article
                key={lab.number}
                className="group rounded-2xl border border-white/10 bg-[#0b111b] p-7 transition hover:border-blue-400/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-blue-400">
                    LAB_{lab.number}
                  </span>

                  <span className="text-gray-600 transition group-hover:text-blue-400">
                    →
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold">{lab.title}</h3>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  {lab.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="mt-8 w-full rounded-lg border border-white/10 py-2.5 text-sm font-medium text-gray-300 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white">
                  Launch Lab
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-white/10 bg-[#090e17]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            The Project
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            A cloud engineering playground
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-gray-400">
            Built to demonstrate practical knowledge of cloud architecture,
            DevOps, infrastructure as code, networking, security,
            observability and automation.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row">
          <div>© 2026 CloudOps SimLab</div>
          <div>Built with Next.js · TypeScript · Vercel</div>
        </div>
      </footer>
    </main>
  );
}
