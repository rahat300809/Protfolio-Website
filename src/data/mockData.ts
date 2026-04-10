import { Project, Research, Certificate, SkillCategory, BlogPost, PortfolioSettings, QuickInfo } from "../types";

export const portfolioSettings: PortfolioSettings = {
  profileImage: "/profile.jpg",
  name: "MD. Rahat Mahamud",
  title: "IoT Developer | Embedded Systems | AI Enthusiast",
  bio: "Building intelligent systems for real world impact. CSE Student at Daffodil International University.",
  cvUrl: "#",
  aboutText: "I am a passionate Computer Science and Engineering student at Daffodil International University, specializing in IoT and Embedded Systems. My journey in technology is driven by a desire to bridge the gap between hardware and software to create impactful real-world solutions.",
  aboutImage: "https://images.unsplash.com/photo-1747582411588-f9b4acabe995?q=80&w=3027&auto=format&fit=crop",
  blogVideoUrl: "",
  stats: {
    projectsCompleted: 150,
    happyClients: 1200,
    yearsExperience: 12,
    satisfactionRate: 98
  },
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
    dribbble: "https://dribbble.com"
  },
  isMaintenanceMode: false
};

export const quickInfos: QuickInfo[] = [
  {
    id: "q1",
    title: "Education",
    subtitle: "B.Sc. in CSE, DIU",
    icon: "education",
    description: "Currently pursuing a Bachelor of Science in Computer Science and Engineering at Daffodil International University. Focusing heavily on IoT, embedded systems, and artificial intelligence. Active in research and electronics clubs."
  },
  {
    id: "q2",
    title: "Focus",
    subtitle: "IoT & Embedded Systems",
    icon: "focus",
    description: "Specializing in the integration of hardware and software to build smart, real-world solutions. Experienced with Arduino, ESP32, various sensors, and cloud IoT platforms."
  },
  {
    id: "q3",
    title: "Location",
    subtitle: "Dhaka, Bangladesh",
    icon: "location",
    description: "Based in Dhaka, Bangladesh. Open to remote opportunities, collaborations, and local tech community events."
  },
  {
    id: "q4",
    title: "Experience",
    subtitle: "3+ Years Learning",
    icon: "experience",
    description: "Over three years of hands-on learning and project development in electronics, robotics, and software engineering. Constantly exploring new technologies and vibe coding workflows."
  }
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Smart Crash Detection Helmet",
    category: "IoT / Embedded",
    description: "A safety-focused helmet that detects crashes and sends alerts.",
    fullDescription: "The Smart Crash Detection Helmet uses an MPU6050 accelerometer and gyroscope to detect sudden impacts or falls. When a crash is detected, it communicates with a mobile app via Bluetooth/GSM to send the user's GPS location to emergency contacts.",
    technologies: ["Arduino", "MPU6050", "GSM Module", "GPS Module", "C++"],
    features: ["Real-time impact detection", "Emergency SMS alerts", "GPS location tracking", "Low power consumption"],
    status: "Completed",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Drone System",
    category: "Robotics",
    description: "Custom-built quadcopter for surveillance and mapping.",
    fullDescription: "A high-performance quadcopter designed for autonomous flight and real-time video streaming. Built using a custom flight controller and integrated with AI for object tracking.",
    technologies: ["ESP32", "Betaflight", "Python", "OpenCV", "Lidar"],
    features: ["Autonomous waypoint navigation", "AI-based object tracking", "4K video transmission", "Obstacle avoidance"],
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Fire Detection System",
    category: "IoT",
    description: "Smart IoT-based fire and smoke detection system.",
    fullDescription: "An intelligent fire detection system that uses flame sensors and smoke sensors to monitor environments. It triggers local alarms and sends push notifications to users' smartphones.",
    technologies: ["NodeMCU", "Flame Sensor", "MQ2 Smoke Sensor", "Blynk IoT"],
    features: ["Instant push notifications", "Local buzzer alarm", "Temperature monitoring", "Cloud data logging"],
    status: "Completed",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    title: "Smart Attendance Device",
    category: "Embedded Systems",
    description: "RFID and Biometric-based attendance tracking system.",
    fullDescription: "A compact device for schools and offices to track attendance using RFID tags and fingerprint scanning. Data is synced to a central database via Wi-Fi.",
    technologies: ["ESP8266", "RFID RC522", "Fingerprint Sensor", "MySQL"],
    features: ["Biometric security", "RFID card support", "Real-time database sync", "Web dashboard"],
    status: "Completed",
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    title: "Automatic Plant Watering System",
    category: "IoT / Agriculture",
    description: "Automated irrigation system based on soil moisture levels.",
    fullDescription: "This system monitors soil moisture and automatically activates a water pump when the soil is dry. It helps in water conservation and ensures plants get the right amount of water.",
    technologies: ["Arduino", "Soil Moisture Sensor", "Relay Module", "Water Pump"],
    features: ["Fully automated", "Water level monitoring", "Solar powered option", "Manual override via App"],
    status: "Completed",
    image: "https://images.unsplash.com/photo-1530836369250-ef71a3f5e482?auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    title: "Weather Control System",
    category: "IoT",
    description: "Micro-environment control for greenhouses.",
    fullDescription: "A system designed to maintain specific temperature and humidity levels within a greenhouse or indoor farm using fans, heaters, and misters.",
    technologies: ["ESP32", "DHT22", "Relay Bank", "Next.js Dashboard"],
    features: ["Precision climate control", "Historical data charts", "Automated scheduling", "Remote monitoring"],
    status: "In Progress",
    image: "/projects/greenhouse.png",
  },
  {
    id: "7",
    title: "Liquid Tree Concept",
    category: "Research / Biotech",
    description: "Urban air purification using microalgae bioreactors.",
    fullDescription: "A research project exploring the use of 'Liquid Trees'—bioreactors filled with microalgae that consume CO2 and produce oxygen more efficiently than traditional trees in urban settings.",
    technologies: ["Bioreactor Design", "Microalgae Cultivation", "Sensors", "Data Analysis"],
    features: ["High CO2 absorption", "Compact urban design", "Real-time O2 production tracking", "Sustainable maintenance"],
    status: "Research",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
  },
  {
    id: "8",
    title: "Research & News Aggregator",
    category: "Web / AI",
    description: "AI-powered platform to aggregate and summarize research papers.",
    fullDescription: "A web application that fetches the latest research papers and news from various sources and uses AI to provide concise summaries for busy researchers.",
    technologies: ["React", "Node.js", "Gemini API", "Python Scrapers"],
    features: ["Automated summarization", "Category filtering", "Personalized feed", "PDF export"],
    status: "Completed",
    image: "/projects/research-aggregator.png",
  },
  {
    id: "9",
    title: "AI Sleep Pattern Analysis",
    category: "AI / Health",
    description: "Analyzing sleep cycles using non-invasive sensors and AI.",
    fullDescription: "A research project that uses motion and sound sensors to track sleep stages and provides AI-driven insights to improve sleep quality.",
    technologies: ["TensorFlow", "Python", "IoT Sensors", "React Native"],
    features: ["Sleep stage detection", "Snore analysis", "Smart alarm", "Weekly health reports"],
    status: "Research",
    image: "/projects/sleep-analysis.png",
  },
  {
    id: "10",
    title: "Code Sharing Platform",
    category: "Web Development",
    description: "A collaborative platform for developers to share and review code.",
    fullDescription: "A full-stack web application that allows developers to create 'snippets', share them with others, and get real-time feedback through comments.",
    technologies: ["Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
    features: ["Syntax highlighting", "Real-time comments", "User profiles", "Forking snippets"],
    status: "Completed",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80",
  },
  {
    id: "11",
    title: "Educational Learning App",
    category: "Mobile / Web",
    description: "Gamified learning platform for CSE students.",
    fullDescription: "An interactive learning app that provides courses, quizzes, and coding challenges for computer science students, with a focus on IoT and Embedded Systems.",
    technologies: ["React", "Firebase", "Lottie Animations", "Node.js"],
    features: ["Interactive quizzes", "Progress tracking", "Leaderboards", "Offline access"],
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
  },
  {
    id: "12",
    title: "Smart Air Pen",
    category: "Embedded Systems",
    description: "A pen that tracks handwriting in the air and digitizes it.",
    fullDescription: "Using high-precision IMU sensors, this pen tracks its movement in 3D space and translates it into digital text or drawings on a computer screen.",
    technologies: ["Arduino Nano 33 BLE", "IMU Sensor", "Python", "Machine Learning"],
    features: ["Air writing recognition", "Bluetooth connectivity", "Rechargeable battery", "Multi-language support"],
    status: "In Progress",
    image: "/projects/air-pen.png",
  },
];

export const researchItems: Research[] = [
  {
    id: "r1",
    title: "Liquid Tree Concept",
    description: "Exploring microalgae bioreactors for urban air purification.",
    fullDetails: "This research focuses on the scalability of microalgae bioreactors in densely populated cities like Dhaka. We are analyzing the CO2 absorption rates of different algae strains and designing a compact, low-maintenance bioreactor unit that can be integrated into street furniture.",
    date: "2024 - Present",
    image: "/projects/liquid-tree.png",
  },
  {
    id: "r2",
    title: "AI Sleep Pattern Analysis",
    description: "Non-invasive sleep monitoring using IoT and Deep Learning.",
    fullDetails: "The goal of this study is to develop a low-cost, non-invasive sleep monitoring system. By using accelerometers placed under the mattress and sound sensors for breathing patterns, we are training a deep learning model to classify sleep stages (Light, Deep, REM) with high accuracy.",
    date: "2023 - 2024",
    image: "/projects/sleep-analysis.png",
  },
];

export const certificates: Certificate[] = [
  {
    id: "c1",
    title: "IoT Fundamentals",
    organization: "Cisco Networking Academy",
    image: "https://picsum.photos/seed/cert1/600/400",
  },
  {
    id: "c2",
    title: "Embedded Systems Design",
    organization: "Coursera / UC Irvine",
    image: "https://picsum.photos/seed/cert2/600/400",
  },
  {
    id: "c3",
    title: "AI for Everyone",
    organization: "DeepLearning.AI",
    image: "https://picsum.photos/seed/cert3/600/400",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "s1",
    category: "Programming",
    skills: [
      { name: "C / C++", level: 90 },
      { name: "Python", level: 60 },
      { name: "JavaScript", level: 30 },
    ],
  },
  {
    id: "s2",
    category: "Embedded Systems",
    skills: [
      { name: "Arduino / ESP32", level: 90 },
      { name: "Raspberry Pi", level: 25 },
      {
        name: "Sensor Integration",
        level: 80,
        tags: ["MPU6050", "DHT11 / DHT22", "Flame Sensor", "Gas Sensor", "Soil Moisture Sensor", "Ultrasonic Sensor", "GPS (NEO-6M)", "GSM (SIM800L)"]
      },
    ],
  },
  {
    id: "s3",
    category: "AI Tools",
    skills: [
      { name: "ChatGPT", level: 90 },
      { name: "Google Gemini", level: 85 },
      { name: "Claude", level: 85 },
      { name: "GitHub Copilot", level: 70 },
      { name: "DeepSeek", level: 65 },
      { name: "Perplexity", level: 40 },
      { name: "TensorFlow", level: 20 },
      { name: "OpenCV", level: 20 },
    ],
  },
  {
    id: "s4",
    category: "Vibe Coding Tools",
    description: "Modern AI-assisted development workflow.",
    skills: [
      { name: "Antigravity AI Studio", level: 90 },
      { name: "Google AI Studio", level: 85 },
      { name: "Firebase Studio", level: 70 },
      { name: "Claude AI", level: 80 },
      { name: "ChatGPT", level: 90 },
      { name: "Gemini", level: 85 },
      { name: "Canva", level: 60 },
      { name: "Cursor IDE", level: 75 },
    ],
  },
  {
    id: "s5",
    category: "Web Development",
    description: "Primarily uses AI-assisted development (vibe coding) tools to build modern web applications.",
    skills: [
      { name: "HTML / CSS Basics", level: 50 },
      { name: "JavaScript Basics", level: 30 },
      { name: "Tailwind CSS", level: 40 },
      { name: "React / Next.js", level: 30 },
      { name: "Node.js", level: 20 },
    ],
  },
  {
    id: "s6",
    category: "Research & Leadership",
    description: "Active in robotics and IEEE technical activities with leadership experience in university clubs.",
    skills: [
      { name: "Research Skills", level: 75 },
      { name: "Research Paper Reading", level: 80 },
      { name: "Technical Writing", level: 70 },
      { name: "Leadership", level: 85 },
      { name: "Project Coordination", level: 80 },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "The Future of IoT in Smart Cities",
    thumbnail: "https://picsum.photos/seed/blog1/800/400",
    preview: "How IoT is transforming urban living through connected infrastructure and real-time data.",
    date: "Oct 12, 2024",
  },
  {
    id: "b2",
    title: "Getting Started with ESP32",
    thumbnail: "https://picsum.photos/seed/blog2/800/400",
    preview: "A comprehensive guide for beginners to start their journey with the powerful ESP32 microcontroller.",
    date: "Sep 25, 2024",
  },
];
