import { Icons } from "@/components/icons";
import {
  ChartCandlestick,
  HomeIcon,
  NotebookIcon,
  ScanLine,
  Send,
} from "lucide-react";
// Languages
import { Cplusplus } from "@/components/ui/svgs/cplusplus";
import { Python } from "@/components/ui/svgs/python";
import { CLang } from "@/components/ui/svgs/clang";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Java } from "@/components/ui/svgs/java";
import { Mysql } from "@/components/ui/svgs/mysql";
// AI / ML
import { Pytorch } from "@/components/ui/svgs/pytorch";
import { Tensorflow } from "@/components/ui/svgs/tensorflow";
import { Huggingface } from "@/components/ui/svgs/huggingface";
import { Langchain } from "@/components/ui/svgs/langchain";
import { Opencv } from "@/components/ui/svgs/opencv";
// Backend & web
import { Fastapi } from "@/components/ui/svgs/fastapi";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Express } from "@/components/ui/svgs/express";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { Graphql } from "@/components/ui/svgs/graphql";
// Data stores
import { Mongodb } from "@/components/ui/svgs/mongodb";
import { Redis } from "@/components/ui/svgs/redis";
import { Elasticsearch } from "@/components/ui/svgs/elasticsearch";
// Cloud & tooling
import { Aws } from "@/components/ui/svgs/aws";
import { Googlecloud } from "@/components/ui/svgs/googlecloud";
import { Docker } from "@/components/ui/svgs/docker";
import { Git } from "@/components/ui/svgs/git";
import { Linux } from "@/components/ui/svgs/linux";
import { Postman } from "@/components/ui/svgs/postman";
// Systems & graphics
import { Qt } from "@/components/ui/svgs/qt";
import { Opengl } from "@/components/ui/svgs/opengl";
import { Cmake } from "@/components/ui/svgs/cmake";

export const DATA = {
  name: "Manoj L",
  initials: "ML",
  url: "https://github.com/paradox974333",
  location: "Chennai, Tamil Nadu, India",
  locationLink: "https://www.google.com/maps/place/Chennai",
  description:
    "Project Associate at IIT Madras, building real-time C++ for image-guided surgical navigation — and agentic AI systems running in production.",
  summary:
    "I build systems where latency and correctness actually matter. At [HTIC, IIT Madras](/#work) I write production C++ for image-guided surgical navigation — real-time 2D/3D vertebra tracking from fluoroscopic X-ray, camera calibration, C-arm geometry estimation and 2D-to-3D registration — code that runs inside robotic-assisted spine procedures, where a dropped frame is not an option.\n\nThat same instinct shows up in everything else I ship. I built [ImperialX](https://imperialx.io) end-to-end, including [Sally](/#projects) — a multi-agent trading system on an MCP architecture whose agents reason over live market data and execute at sub-100ms latency, with RAG-grounded analysis and human-in-the-loop controls. I built the [ScalePath](https://scalepath.in/) platform that carries founders from idea to investment ready, the automations and CRM deployment behind [VG INNFRA](https://www.vginnfra.com/), and a [3D explorer for 5,000+ celestial bodies](/#hackathons) at NASA Space Apps 2024. Along the way: a Seq2Seq transliteration model past 92% accuracy, and a calibration pipeline holding sub-0.5 pixel reprojection error.\n\nI speak Kannada, English and Hindi.",
  intro:
    "Most days I'm at HTIC, IIT Madras, tracking vertebrae in live X-ray, where a dropped frame is not an option. The rest of the time I build platforms end to end for founders and teams who need them shipped.",
  avatarUrl: "/me.jpg",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  stack: [
    {
      label: "Languages",
      items: [
        { name: "C++", icon: Cplusplus },
        { name: "Python", icon: Python },
        { name: "C", icon: CLang },
        { name: "JavaScript", icon: Javascript },
        { name: "Java", icon: Java },
        { name: "MySQL", icon: Mysql },
      ],
    },
    {
      label: "AI / ML",
      items: [
        { name: "PyTorch", icon: Pytorch },
        { name: "TensorFlow", icon: Tensorflow },
        { name: "Hugging Face", icon: Huggingface },
        { name: "LangChain", icon: Langchain },
        { name: "OpenCV", icon: Opencv },
      ],
    },
    {
      label: "Backend & web",
      items: [
        { name: "FastAPI", icon: Fastapi },
        { name: "Node.js", icon: Nodejs },
        { name: "Express", icon: Express },
        { name: "React", icon: ReactLight },
        { name: "GraphQL", icon: Graphql },
      ],
    },
    {
      label: "Data stores",
      items: [
        { name: "MongoDB", icon: Mongodb },
        { name: "Redis", icon: Redis },
        { name: "ElasticSearch", icon: Elasticsearch },
      ],
    },
    {
      label: "Cloud & tooling",
      items: [
        { name: "AWS", icon: Aws },
        { name: "Google Cloud", icon: Googlecloud },
        { name: "Docker", icon: Docker },
        { name: "Git", icon: Git },
        { name: "Linux", icon: Linux },
        { name: "Postman", icon: Postman },
      ],
    },
    {
      label: "Systems & graphics",
      items: [
        { name: "Qt", icon: Qt },
        { name: "OpenGL", icon: Opengl },
        { name: "CMake", icon: Cmake },
      ],
    },
  ],
  // the "now" bullets on the home page
  now: [
    {
      icon: ScanLine,
      lead: "I track vertebrae in live X-ray",
      body: "at HTIC, IIT Madras: camera calibration, C-arm geometry and 2D-to-3D registration, in production C++.",
    },
    {
      icon: ChartCandlestick,
      lead: "I build agents that trade",
      body: "Sally reasons over live market data on an MCP architecture and executes in under 100ms, with a human in the loop.",
    },
    {
      icon: Send,
      lead: "Right now I'm shipping platforms end to end",
      body: "HyperOrbs, ScalePath and VG INNFRA, from the data model to the screens people use.",
    },
  ],
  quote: {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "manoj123l288@gmail.com",
    tel: "+919743339652",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/paradox974333",
        icon: Icons.github,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:manoj123l288@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "HTIC, IIT Madras",
      href: "https://www.hticiitm.org/",
      badges: [],
      location: "Chennai, India",
      title: "Project Associate",
      logoUrl: "/htic.png",
      start: "June 2026",
      end: "Present",
      description:
        "Building production-grade C++ software for image-guided surgical navigation in spine and orthopedic procedures, with real-time 2D/3D vertebra tracking from fluoroscopic X-ray imaging. Implemented camera calibration, C-arm geometry estimation and 2D-to-3D registration pipelines, plus deep-learning anatomical landmark detection and pose estimation. Optimized low-latency inference pipelines for robotic-assisted surgery, integrating OpenCV, VTK, ITK, Qt and C++ modules while working directly with surgeons, researchers and engineers. Owned unit and integration testing, performance profiling and CI/CD contributions to keep the system reliable in clinical environments.",
    },
    {
      company: "ScalePath",
      href: "https://scalepath.in/",
      badges: [],
      location: "Remote",
      title: "Full-Stack Developer",
      logoUrl: "/scalepath.png",
      start: "2026",
      end: "Present",
      description:
        "Built the entire ScalePath platform — a product that takes founders from an idea to investment ready, covering idea validation, business building, traction growth and investor readiness. Owned the stack end-to-end, from data model and backend services through to the product surface founders actually use.",
    },
    {
      company: "ImperialX",
      href: "https://imperialx.io",
      badges: [],
      location: "Bangalore (Remote)",
      title: "AI Systems Developer (Freelance)",
      logoUrl: "/imperialx.png",
      start: "August 2025",
      end: "Present",
      description:
        "Built the ImperialX platform end-to-end, architecting the Sally AI trading system on an MCP architecture with sub-100ms execution latency, context-aware agents and automated risk management. Designed agent-to-agent communication, memory components and planning mechanisms for autonomous decision-making, backed by human-in-the-loop fallback controls and real-time monitoring. Implemented RAG pipelines over vector embeddings to ground agents in domain knowledge, and built backend microservices in FastAPI and Node.js with WebSockets for real-time communication. Deployed on AWS with Docker and CI/CD, using Redis and ElasticSearch for high-throughput data pipelines.",
    },
    {
      company: "VG INNFRA",
      href: "https://www.vginnfra.com/",
      badges: [],
      location: "Remote",
      title: "Web Developer",
      logoUrl: "/vginnfra.png",
      start: "2026",
      end: "Present",
      description:
        "Web developer for VG INNFRA, a branded residential asset developer. Built the company's internal automations and delivered their CRM deployment, wiring the tooling their sales and delivery teams run on.",
    },
    {
      company: "Social_buzzz18",
      href: "https://socialbuzzz18.in/",
      badges: [],
      location: "Remote",
      title: "Freelance Web Developer",
      logoUrl: "/socialbuzzz.png",
      start: "2026",
      end: "Present",
      description:
        "Freelance web developer for Social_buzzz18, a digital marketing studio in Kalaburagi. Built their entire website end-to-end, and delivered two more complete builds for a college and a school through them.",
    },
    {
      company: "HTIC, IIT Madras",
      href: "https://www.hticiitm.org/",
      badges: [],
      location: "Chennai, India",
      title: "Project Intern, Image Guided Robotic Systems",
      logoUrl: "/htic.png",
      start: "February 2026",
      end: "May 2026",
      description:
        "Developed real-time 2D/3D spine tracking software with computer vision pipelines for anatomical landmark detection and tracking. Implemented low-latency inference for real-time surgical assistance and integrated perception, tracking and robotic control modules. Collaborated with cross-functional teams on code reviews, integration and delivery under Agile practices.",
    },
  ],
  education: [
    {
      school: "Dayananda Sagar University",
      href: "https://www.dsu.edu.in/",
      degree: "B.Tech, Computer Science",
      logoUrl: "/dsu.png",
      start: "2022",
      end: "2026",
    },
    {
      school: "Christ Academy Junior College",
      href: "https://christacademy.in/",
      degree: "Pre-University (PUC)",
      logoUrl: "/christacademy.png",
      start: "2020",
      end: "2022",
    },
  ],
  projects: [
    {
      title: "HyperOrbs",
      short: "HyperOrbs",
      tagline: "Your own agent and an AI team in one workspace",
      href: "https://hyperorbs.com/",
      dates: "2026 - Present",
      active: true,
      description:
        "A workspace where you get your own agent and an AI team that work inside your apps: research, writing, outreach and follow-ups, with a shared Library, a 3D office and a score you earn.",
      technologies: ["AI Agents","Multi-agent","LLM Tool Calling","Integrations"],
      links: [{ type: "Website", href: "https://hyperorbs.com/", icon: <Icons.globe className="size-3" /> }],
      image: "/shots/hyperorbs.jpg",
      video: "",
    },
    {
      title: "Sally AI Trading System",
      short: "Sally",
      tagline: "Multi-agent trading on MCP, sub-100ms",
      href: "https://imperialx.io",
      dates: "August 2025 - Present",
      active: true,
      description:
        "Multi-agent trading system built on an MCP architecture. Autonomous agents reason over live market data and execute trades through LLM tool calling, grounded by RAG-based market analysis, with memory components and human-in-the-loop safety controls. Sub-100ms execution latency, running in production on AWS.",
      technologies: ["Python","LangChain","MCP","FastAPI","Node.js","Redis","ElasticSearch","WebSockets","AWS","Docker"],
      links: [{ type: "Website", href: "https://imperialx.io", icon: <Icons.globe className="size-3" /> }],
      image: "/shots/imperialx.jpg",
      video: "",
    },
    {
      title: "ScalePath",
      short: "ScalePath",
      tagline: "Takes founders from idea to investment ready",
      href: "https://scalepath.in/",
      dates: "2026 - Present",
      active: true,
      description:
        "The entire ScalePath platform, built end-to-end — a product that carries founders from an idea through validation, business building and traction, to investment ready. Data model, backend services and the product surface founders actually use.",
      technologies: ["Next.js","TypeScript","React","Node.js","SQL","Tailwind CSS"],
      links: [{ type: "Website", href: "https://scalepath.in/", icon: <Icons.globe className="size-3" /> }],
      image: "/shots/scalepath.jpg",
      video: "",
    },
    {
      title: "VG INNFRA",
      short: "VG INNFRA",
      tagline: "Website, automations and CRM for a developer",
      href: "https://www.vginnfra.com/",
      dates: "2026 - Present",
      active: true,
      description:
        "Website, internal automations and CRM deployment for a branded residential asset developer with 45 lakh+ sq ft delivered. Built the tooling their sales and delivery teams run on day to day.",
      technologies: ["Next.js","TypeScript","React","Automation","CRM"],
      links: [{ type: "Website", href: "https://www.vginnfra.com/", icon: <Icons.globe className="size-3" /> }],
      image: "/shots/vginnfra.jpg",
      video: "",
    },
    {
      title: "Social_buzzz18",
      short: "Social_buzzz18",
      tagline: "Studio site plus a college and a school",
      href: "https://socialbuzzz18.in/",
      dates: "2026 - Present",
      active: true,
      description:
        "Full website build for a digital marketing studio in Kalaburagi, plus two further complete builds delivered through them for a college and a school.",
      technologies: ["JavaScript","React","Node.js","HTML","CSS"],
      links: [{ type: "Website", href: "https://socialbuzzz18.in/", icon: <Icons.globe className="size-3" /> }],
      image: "/shots/socialbuzzz.jpg",
      video: "",
    },
    {
      title: "Real-Time Spine Tracking System",
      short: "Spine tracker",
      tagline: "Real-time 2D/3D vertebra tracking for surgery",
      href: "",
      dates: "February 2026 - Present",
      active: true,
      description:
        "Real-time 2D/3D tracking of spinal structures for image-guided surgical navigation: vertebral landmark detection, 2D-to-3D reconstruction, image registration and low-latency inference pipelines tuned for robotic-assisted procedures.",
      technologies: ["C++","OpenCV","VTK","ITK","Qt","CMake","Deep Learning"],
      links: [],
      image: "/projects/spine.jpg",
      video: "",
    },
    {
      title: "3D Exoplanet & Solar System Explorer",
      short: "Exoplanet explorer",
      tagline: "NASA Space Apps: 5,000+ bodies in WebGL",
      href: "https://paradox974333.github.io/nasaspaceapp/",
      dates: "October 2024",
      active: false,
      description:
        "Interactive 3D platform rendering 5,000+ celestial bodies from NASA open APIs, with orbital simulations and real-time rendering. Built for the NASA Space Apps Challenge 2024.",
      technologies: ["JavaScript","Three.js","WebGL","Node.js","NASA APIs","WebSockets"],
      links: [
        { type: "Live", href: "https://paradox974333.github.io/nasaspaceapp/", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/paradox974333/nasaspaceapp", icon: <Icons.github className="size-3" /> },
      ],
      image: "/shots/nasa.jpg",
      video: "",
    },
    {
      title: "Neural Transliteration System",
      short: "Transliteration",
      tagline: "Seq2Seq model past 92% accuracy",
      href: "",
      dates: "2025",
      active: false,
      description:
        "Sequence-to-sequence transliteration model using LSTM/GRU encoders and beam-search decoding, reaching over 92% accuracy. Deployed with Hugging Face transformers behind a production-ready inference pipeline.",
      technologies: ["Python","PyTorch","Hugging Face","Seq2Seq","LSTM","Beam Search"],
      links: [],
      image: "/projects/translit.jpg",
      video: "",
    },
    {
      title: "Camera Radial Distortion Calibration",
      short: "Lens calibration",
      tagline: "Radial distortion fixed under 0.5px",
      href: "",
      dates: "2026",
      active: false,
      description:
        "Calibration pipeline that corrects radial lens distortion through numerical optimization, achieving sub-0.5 pixel reprojection error with robust distortion correction for surgical imaging.",
      technologies: ["C++","Python","OpenCV","NumPy"],
      links: [],
      image: "/projects/calibration.jpg",
      video: "",
    },
  ],
  hackathons: [
    {
      title: "NASA Space Apps Challenge 2024",
      dates: "October 2024",
      location: "",
      description:
        "Built the 3D Exoplanet & Solar System Explorer with a multidisciplinary team — an interactive real-time visualization platform covering 5,000+ celestial bodies, powered by NASA open APIs and orbital simulation.",
      image: "/spaceapps.png",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/paradox974333/nasaspaceapp",
        },
      ],
    },
  ],
} as const;
