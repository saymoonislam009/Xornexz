export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

export const jobs: Job[] = [
  {
    id: "1",
    slug: "senior-software-engineer",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "5+ years",
    description: "We are looking for a Senior Software Engineer to join our core engineering team and help build scalable web applications.",
    responsibilities: [
      "Design and implement scalable architecture",
      "Write clean, maintainable code",
      "Mentor junior developers",
      "Collaborate with product and design teams"
    ],
    requirements: [
      "5+ years of experience with React and Node.js",
      "Strong understanding of web fundamentals",
      "Experience with database design and optimization",
      "Excellent communication skills"
    ]
  },
  {
    id: "2",
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "New York / Hybrid",
    type: "Full-time",
    experience: "3+ years",
    description: "Join our design team to create beautiful, intuitive, and accessible user experiences for our products.",
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Maintain and evolve our design system",
      "Work closely with engineers for implementation"
    ],
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma and Adobe Creative Suite",
      "Strong portfolio demonstrating user-centered design",
      "Knowledge of HTML/CSS is a plus"
    ]
  },
  {
    id: "3",
    slug: "devops-engineer",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years",
    description: "We need a DevOps Engineer to streamline our deployment processes and ensure high availability of our infrastructure.",
    responsibilities: [
      "Manage CI/CD pipelines",
      "Monitor system performance and reliability",
      "Implement infrastructure as code",
      "Enhance security measures"
    ],
    requirements: [
      "4+ years of DevOps experience",
      "Strong knowledge of AWS and Kubernetes",
      "Experience with Terraform and Ansible",
      "Scripting skills in Python or Bash"
    ]
  },
  {
    id: "4",
    slug: "business-development-manager",
    title: "Business Development Manager",
    department: "Sales",
    location: "London",
    type: "Full-time",
    experience: "4+ years",
    description: "Looking for an energetic Business Development Manager to drive growth and build strategic partnerships.",
    responsibilities: [
      "Identify new business opportunities",
      "Build and maintain client relationships",
      "Develop sales strategies",
      "Collaborate with marketing team"
    ],
    requirements: [
      "4+ years of B2B sales experience",
      "Proven track record of hitting targets",
      "Excellent negotiation and presentation skills",
      "Strong analytical abilities"
    ]
  }
];
