"use client";

import { useEffect, useMemo, useState } from "react";

type Group = "network" | "subnets" | "load" | "compute" | "data" | "routing" | "security" | "access";
type Item = { id: string; name: string; group: Group; description: string };
type Link = { from: string; to: string };

const inventory: Item[] = [
  { id:"vpc", name:"VPC", group:"network", description:"Isolated virtual network" },
  { id:"igw", name:"Internet Gateway", group:"network", description:"Connects public resources to the Internet" },
  { id:"egress-igw", name:"Egress-Only Internet Gateway", group:"network", description:"IPv6 outbound Internet path" },
  { id:"nat-a", name:"NAT Gateway — AZ-A", group:"network", description:"Private outbound connectivity in AZ-A" },
  { id:"nat-b", name:"NAT Gateway — AZ-B", group:"network", description:"Private outbound connectivity in AZ-B" },
  { id:"nat-instance", name:"NAT Instance", group:"network", description:"EC2-based NAT implementation" },
  { id:"tgw", name:"Transit Gateway", group:"network", description:"Central hub for multiple networks" },
  { id:"peering", name:"VPC Peering", group:"network", description:"Private connectivity between VPCs" },

  { id:"public-a", name:"Public Subnet — AZ-A", group:"subnets", description:"Internet-facing subnet in AZ-A" },
  { id:"public-b", name:"Public Subnet — AZ-B", group:"subnets", description:"Internet-facing subnet in AZ-B" },
  { id:"private-a", name:"Private App Subnet — AZ-A", group:"subnets", description:"Application workload subnet in AZ-A" },
  { id:"private-b", name:"Private App Subnet — AZ-B", group:"subnets", description:"Application workload subnet in AZ-B" },
  { id:"db-a", name:"Database Subnet — AZ-A", group:"subnets", description:"Database workload subnet" },
  { id:"db-b", name:"Database Subnet — AZ-B", group:"subnets", description:"Database workload subnet" },
  { id:"isolated", name:"Isolated Subnet", group:"subnets", description:"Subnet with no Internet route" },

  { id:"alb", name:"Application Load Balancer", group:"load", description:"HTTP/HTTPS application entry point" },
  { id:"nlb", name:"Network Load Balancer", group:"load", description:"Layer 4 load balancer" },
  { id:"gwlb", name:"Gateway Load Balancer", group:"load", description:"Traffic insertion for appliances" },

  { id:"ec2", name:"EC2 Instance", group:"compute", description:"Application compute instance" },
  { id:"public-ec2", name:"Public EC2 Instance", group:"compute", description:"EC2 with direct Internet exposure" },
  { id:"asg", name:"Auto Scaling Group", group:"compute", description:"Maintains application capacity" },
  { id:"ecs", name:"ECS Service", group:"compute", description:"Containerized application service" },
  { id:"lambda", name:"Lambda Function", group:"compute", description:"Serverless compute workload" },

  { id:"rds", name:"Amazon RDS", group:"data", description:"Managed relational database" },
  { id:"redis", name:"ElastiCache / Redis", group:"data", description:"In-memory application cache" },
  { id:"s3-endpoint", name:"S3 Gateway Endpoint", group:"data", description:"Private S3 connectivity" },
  { id:"efs", name:"EFS File System", group:"data", description:"Shared network file storage" },

  { id:"public-rt", name:"Public Route Table", group:"routing", description:"Public subnet routing" },
  { id:"private-rt-a", name:"Private Route Table — AZ-A", group:"routing", description:"Private subnet routing in AZ-A" },
  { id:"private-rt-b", name:"Private Route Table — AZ-B", group:"routing", description:"Private subnet routing in AZ-B" },
  { id:"nacl", name:"Network ACL", group:"routing", description:"Subnet-level stateless filtering" },
  { id:"prefix-list", name:"Managed Prefix List", group:"routing", description:"Reusable CIDR collection" },

  { id:"sg", name:"Security Group", group:"security", description:"Stateful instance-level traffic control" },
  { id:"waf", name:"AWS WAF", group:"security", description:"Web application firewall" },
  { id:"shield", name:"AWS Shield", group:"security", description:"DDoS protection" },

  { id:"ssm", name:"AWS Systems Manager", group:"access", description:"Secure administration of private instances" },
  { id:"bastion", name:"Bastion Host", group:"access", description:"Jump host for administration" },
  { id:"iam", name:"IAM Role", group:"access", description:"Workload identity and permissions" },
  { id:"cloudwatch", name:"CloudWatch Logs", group:"access", description:"Infrastructure and application logging" },
  { id:"secrets", name:"Secrets Manager", group:"access", description:"Managed secret storage" },
];

const sections: [Group,string][] = [
  ["network","NETWORK"],["subnets","SUBNETS"],["load","LOAD BALANCING"],
  ["compute","COMPUTE"],["data","DATA & STORAGE"],["routing","ROUTING"],
  ["security","SECURITY"],["access","ACCESS & MANAGEMENT"],
];

const required = [
  "vpc","igw","public-a","public-b","private-a","private-b",
  "nat-a","nat-b","alb","public-rt","private-rt-a","private-rt-b","sg","ssm",
];

const requiredLinks: Link[] = [
  ["vpc","igw"],["igw","public-rt"],["public-a","public-rt"],["public-b","public-rt"],
  ["public-a","alb"],["public-b","alb"],["alb","private-a"],["alb","private-b"],
  ["private-a","private-rt-a"],["private-b","private-rt-b"],
  ["private-rt-a","nat-a"],["private-rt-b","nat-b"],["nat-a","igw"],["nat-b","igw"],
].map(([from,to]) => ({from,to}));

const decisions = [
  ["alb","Where should the Application Load Balancer live?",["Public subnets","Private application subnets","Database subnets","No subnet"],"Public subnets"],
  ["app","Where should the application servers live?",["Public subnets","Private application subnets","Inside the ALB","Internet Gateway"],"Private application subnets"],
  ["route","What should the private subnet default route target?",["Internet Gateway","NAT Gateway","Application Load Balancer","No route"],"NAT Gateway"],
  ["nat","For production across two AZs, how many NAT Gateways should be used?",["One shared NAT Gateway","One NAT Gateway per AZ","One NAT Instance","None"],"One NAT Gateway per AZ"],
  ["admin","How should administrators access private EC2 instances?",["AWS Systems Manager","SSH from the Internet","Public bastion only","ALB"],"AWS Systems Manager"],
  ["sg","What should the application Security Group allow inbound from?",["0.0.0.0/0","The ALB Security Group","The NAT Gateway","The Internet Gateway"],"The ALB Security Group"],
  ["public","What should be publicly reachable?",["ALB only","ALB and application servers","Application servers only","Nothing"],"ALB only"],
] as const;

const name = (id:string) => inventory.find(x=>x.id===id)?.name ?? id;
const sameLink = (a:string,b:string,l:Link) => (l.from===a&&l.to===b)||(l.from===b&&l.to===a);

export default function AwsVpcAssessment() {
  const [selected,setSelected]=useState<string[]>([]);
  const [links,setLinks]=useState<Link[]>([]);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [connect,setConnect]=useState(false);
  const [first,setFirst]=useState<string|null>(null);
  const [submitted,setSubmitted]=useState(false);
  const [search,setSearch]=useState("");
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    try {
      const s=JSON.parse(localStorage.getItem("cloudops-vpc-assessment")||"null");
      if(s){setSelected(s.selected||[]);setLinks(s.links||[]);setAnswers(s.answers||{});setSubmitted(!!s.submitted);}
    } catch {}
    setReady(true);
  },[]);

  useEffect(()=>{
    if(ready) localStorage.setItem("cloudops-vpc-assessment",JSON.stringify({selected,links,answers,submitted}));
  },[ready,selected,links,answers,submitted]);

  const visible=useMemo(()=>{
    const q=search.toLowerCase().trim();
    return sections.map(([group,label])=>({
      label, items:inventory.filter(x=>x.group===group && (!q||x.name.toLowerCase().includes(q)||x.description.toLowerCase().includes(q)))
    })).filter(x=>x.items.length);
  },[search]);

  const score=useMemo(()=>{
    const c=required.filter(x=>selected.includes(x)).length;
    const unnecessary=selected.filter(x=>!required.includes(x)).length;
    const goodLinks=links.filter(l=>requiredLinks.some(r=>sameLink(l.from,l.to,r))).length;
    const goodDecisions=decisions.filter(d=>answers[d[0]]===d[3]).length;
    return Math.max(0,Math.round(c/required.length*40 + goodLinks/requiredLinks.length*35 + goodDecisions/decisions.length*25 - Math.min(15,unnecessary*2)));
  },[selected,links,answers]);

  function clickItem(id:string){
    if(submitted)return;
    if(connect){
      if(!selected.includes(id))return;
      if(!first){setFirst(id);return;}
      if(first===id){setFirst(null);return;}
      if(!links.some(l=>sameLink(l.from,l.to,{from:first,to:id}))) setLinks(x=>[...x,{from:first,to:id}]);
      setFirst(null);
      return;
    }
    setSelected(x=>x.includes(id)?x.filter(y=>y!==id):[...x,id]);
  }

  function remove(id:string){
    if(submitted)return;
    setSelected(x=>x.filter(y=>y!==id));
    setLinks(x=>x.filter(l=>l.from!==id&&l.to!==id));
  }

  if(!ready)return null;

  if(submitted){
    const correct=required.filter(x=>selected.includes(x)).length;
    const unnecessary=selected.filter(x=>!required.includes(x));
    const goodLinks=links.filter(l=>requiredLinks.some(r=>sameLink(l.from,l.to,r))).length;
    const goodDecisions=decisions.filter(d=>answers[d[0]]===d[3]).length;
    return <main className="min-h-screen bg-[#070b12] text-white">
      <Header locked/>
      <section className="border-b border-white/10"><div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-[10px] uppercase tracking-[.2em] text-blue-400">Assessment Result</p>
        <div className="mt-3 rounded-xl border border-white/10 bg-[#0b111b] p-6">
          <span className="text-5xl font-semibold">{score}</span><span className="ml-2 text-xs text-gray-600">/ 100</span>
          <p className="mt-2 text-xs text-gray-500">Your architecture has been submitted and locked. No further changes are permitted.</p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Stat label="Required components" value={`${correct}/${required.length}`}/>
          <Stat label="Correct connections" value={`${goodLinks}/${requiredLinks.length}`}/>
          <Stat label="Decision score" value={`${goodDecisions}/${decisions.length}`}/>
          <Stat label="Unnecessary components" value={`${unnecessary.length}`}/>
        </div>
      </div></section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-8 md:grid-cols-2">
        <Panel title="Architecture Findings">
          <Finding ok={correct===required.length}>All required production components were selected.</Finding>
          <Finding ok={!unnecessary.length}>{unnecessary.length} unnecessary component(s) were selected.</Finding>
          <Finding ok={goodLinks===requiredLinks.length}>{requiredLinks.length-goodLinks} required connection(s) are missing.</Finding>
          <Finding ok={links.length===goodLinks}>{links.length-goodLinks} incorrect connection(s) were created.</Finding>
        </Panel>
        <Panel title="Submitted Components">
          <div className="space-y-1.5">{selected.map(id=><div key={id} className={`rounded-md border px-3 py-2 text-[10px] ${required.includes(id)?"border-emerald-500/30 text-emerald-300":"border-red-500/30 text-red-300"}`}>{required.includes(id)?"✓":"×"} {name(id)}</div>)}</div>
        </Panel>
        <div className="md:col-span-2"><Panel title="Decision Results">
          {decisions.map(d=>{const ok=answers[d[0]]===d[3];return <div key={d[0]} className={`mb-2 rounded-lg border p-3 ${ok?"border-emerald-500/20":"border-red-500/20"}`}><p className="text-[10px]">{ok?"✓":"×"} {d[1]}</p><p className="mt-1 text-[10px] text-gray-600">Your answer: {answers[d[0]]||"Not answered"}</p>{!ok&&<p className="mt-1 text-[10px] text-gray-600">Expected: {d[3]}</p>}</div>})}
        </Panel></div>
      </section>
    </main>;
  }

  return <main className="min-h-screen bg-[#070b12] text-white">
    <Header onSubmit={()=>setSubmitted(true)}/>
    <section className="border-b border-white/10 bg-[#090e17]"><div className="mx-auto max-w-7xl px-6 py-8">
      <p className="text-[10px] uppercase tracking-[.2em] text-blue-400">Scenario</p>
      <h2 className="mt-2 text-2xl font-bold">Design a production-grade private application network</h2>
      <p className="mt-3 max-w-5xl text-xs leading-6 text-gray-400">You are designing infrastructure for a customer-facing API. The application must be highly available across two Availability Zones. Application servers must never have public IP addresses. Customers must be able to reach the application from the Internet, while administrators must be able to access private instances securely. The application also needs outbound Internet connectivity for operating-system and software updates.</p>
      <div className="mt-5 grid gap-2 md:grid-cols-4"><Requirement label="2 Availability Zones"/><Requirement label="No public EC2"/><Requirement label="Private application tier"/><Requirement label="One attempt only"/></div>
    </div></section>

    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-7 lg:grid-cols-[360px_1fr]">
      <aside>
        <div className="mb-4 flex justify-between"><div><h2 className="text-sm font-semibold">Component Inventory</h2><p className="mt-1 text-[11px] text-gray-500">Choose the resources you believe belong in the design.</p></div><span className="text-[10px] text-gray-600">{selected.length}/{inventory.length}</span></div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search components..." className="mb-4 w-full rounded-lg border border-white/10 bg-white/[.02] px-3 py-2 text-xs outline-none placeholder:text-gray-600"/>
        <div className="space-y-5">{visible.map(s=><div key={s.label}><p className="mb-2 text-[10px] font-semibold tracking-[.16em] text-gray-600">{s.label}</p><div className="space-y-1.5">{s.items.map(c=>{const active=selected.includes(c.id);return <button key={c.id} onClick={()=>clickItem(c.id)} className={`w-full rounded-md border px-3 py-2.5 text-left transition ${active?"border-blue-400/50 bg-blue-500/[.07]":"border-white/[.07] bg-white/[.015] hover:border-white/20"}`}><div className="flex justify-between gap-2"><span className="text-xs font-medium">{c.name}</span><span className={`text-[9px] uppercase ${active?"text-blue-400":"text-gray-700"}`}>{active?"Selected":"Add"}</span></div><p className="mt-1 text-[10px] text-gray-600">{c.description}</p></button>})}</div></div>)}</div>
      </aside>

      <div>
        <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Architecture Canvas</h2><p className="mt-1 text-[10px] text-gray-600">VPC: 10.0.0.0/16 · Region: us-east-1</p></div><button disabled={selected.length<2} onClick={()=>{setConnect(!connect);setFirst(null)}} className={`rounded-lg border px-4 py-2 text-xs ${connect?"border-blue-400/50 bg-blue-500/10 text-blue-300":"border-white/10 text-gray-400"} disabled:opacity-40`}>{connect?"Exit Connect Mode":"Connect Components"}</button></div>
        {connect&&<div className="mb-3 rounded-lg border border-blue-400/20 bg-blue-400/[.04] px-4 py-3 text-[11px] text-blue-200">{first?"Select the second component.":"Select the first component, then the second."}</div>}

        <div className="min-h-[450px] rounded-xl border border-white/10 bg-[#0b111b] p-5"><div className="rounded-lg border border-blue-400/15 bg-blue-400/[.015] p-5">
          <div className="flex justify-between"><div><span className="font-mono text-[10px] text-blue-400">AWS_VPC</span><h3 className="mt-1 text-sm font-semibold">10.0.0.0/16</h3></div><span className="rounded border border-white/10 px-2 py-1 text-[9px] text-gray-600">us-east-1</span></div>
          {selected.length===0?<div className="flex min-h-[360px] items-center justify-center text-center"><div><div className="text-3xl text-gray-700">⌘</div><p className="mt-3 text-xs text-gray-500">Select components from the inventory to build your architecture.</p><p className="mt-1 text-[10px] text-gray-700">No correctness feedback is shown before submission.</p></div></div>:<div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{selected.map(id=>{const c=inventory.find(x=>x.id===id)!;return <div key={id} onClick={()=>clickItem(id)} className={`cursor-pointer rounded-lg border p-4 ${first===id?"border-blue-400/60 bg-blue-500/[.08]":"border-white/10 bg-white/[.015] hover:border-white/20"}`}><div className="flex justify-between"><div><p className="text-xs font-medium">{c.name}</p><p className="mt-1 text-[9px] uppercase text-gray-700">{c.group}</p></div>{!connect&&<button onClick={e=>{e.stopPropagation();remove(id)}} className="text-[9px] text-gray-700 hover:text-white">Remove</button>}</div><p className="mt-3 text-[10px] text-gray-600">{c.description}</p></div>})}</div>}
          {links.length>0&&<div className="mt-5 border-t border-white/[.06] pt-4"><p className="mb-2 text-[10px] uppercase tracking-wider text-gray-600">Connections</p><div className="flex flex-wrap gap-2">{links.map((l,i)=><span key={i} className="rounded-md border border-white/10 px-3 py-2 text-[10px] text-gray-500">{name(l.from)} → {name(l.to)}</span>)}</div></div>}
        </div></div>

        <div className="mt-5 rounded-xl border border-white/10 bg-[#0b111b] p-5"><div className="flex justify-between"><div><h2 className="text-sm font-semibold">Architecture Decisions</h2><p className="mt-1 text-[10px] text-gray-600">Answer every question before submission.</p></div><span className="text-[10px] text-gray-600">{Object.keys(answers).length}/{decisions.length}</span></div>
          <div className="mt-4 space-y-2">{decisions.map((d,i)=><label key={d[0]} className="block rounded-lg border border-white/[.07] p-3"><span className="text-[11px]">{i+1}. {d[1]}</span><select value={answers[d[0]]||""} onChange={e=>setAnswers(x=>({...x,[d[0]]:e.target.value}))} className="mt-2 w-full rounded-md border border-white/10 bg-[#0b111b] px-3 py-2 text-[10px] text-gray-300"><option value="">Select an answer</option>{d[2].map(o=><option key={o}>{o}</option>)}</select></label>)}</div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-blue-400/20 bg-blue-400/[.03] p-4"><p className="text-[10px] font-semibold text-blue-300">Instructions</p><ol className="mt-2 space-y-1 text-[10px] text-gray-500"><li>1. Select components you believe are necessary.</li><li>2. Build relationships using Connect Components.</li><li>3. Answer every architecture decision.</li><li>4. Submit when confident.</li></ol></div><div className="rounded-xl border border-amber-400/20 bg-amber-400/[.025] p-4"><p className="text-[10px] font-semibold text-amber-300">Important</p><ul className="mt-2 space-y-1 text-[10px] text-gray-500"><li>• You have only ONE attempt.</li><li>• The design is permanently locked after submission.</li><li>• Incorrect resources are intentionally not identified beforehand.</li></ul></div></div>
        <button onClick={()=>setSubmitted(true)} className="mt-5 w-full rounded-lg bg-blue-500 px-5 py-3 text-xs font-semibold hover:bg-blue-400">Submit Architecture — One Attempt</button>
      </div>
    </section>
  </main>;
}

function Header({locked,onSubmit}:{locked?:boolean;onSubmit?:()=>void}) {
  return <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><div><a href="/" className="text-[10px] text-gray-600 hover:text-white">← CloudOps SimLab</a><h1 className="mt-1 text-sm font-semibold">AWS VPC Architecture Assessment</h1></div><div className="flex gap-3 items-center"><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase text-gray-400">{locked?"Submitted — Locked":"One Attempt Only"}</span>{!locked&&<button onClick={onSubmit} className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold hover:bg-blue-400">Submit Architecture</button>}</div></div></header>;
}
function Requirement({label}:{label:string}){return <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.015] px-3 py-2.5"><span className="text-blue-400">✓</span><span className="text-[10px] text-gray-400">{label}</span></div>}
function Stat({label,value}:{label:string;value:string}){return <div className="rounded-lg border border-white/10 bg-[#0b111b] p-4"><p className="text-[9px] uppercase tracking-wider text-gray-600">{label}</p><p className="mt-2 text-sm font-semibold">{value}</p></div>}
function Panel({title,children}:{title:string;children:React.ReactNode}){return <section className="rounded-xl border border-white/10 bg-[#0b111b] p-4"><h2 className="text-xs font-semibold">{title}</h2><div className="mt-3">{children}</div></section>}
function Finding({ok,children}:{ok:boolean;children:React.ReactNode}){return <div className={`mb-2 rounded-md border px-3 py-2.5 text-[10px] ${ok?"border-emerald-500/20 text-emerald-300":"border-red-500/20 text-red-300"}`}>{ok?"✓":"×"} {children}</div>}
