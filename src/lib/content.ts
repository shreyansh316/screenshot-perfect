export interface RoadmapStage {
  title: string;
  timeframe: string;
  focus: string;
  skills: string[];
  milestone: string;
}
export interface Roadmap {
  slug: string;
  title: string;
  summary: string;
  category: string;
  stages: RoadmapStage[];
}

export const ROADMAPS: Roadmap[] = [
  {
    slug: "frontend-developer", title: "Frontend Developer", category: "Software Engineering",
    summary: "From your first HTML page to shipping accessible, tested interfaces in a team.",
    stages: [
      { title: "Foundations", timeframe: "Months 1–2", focus: "How the web works, semantic HTML and modern CSS layout.", skills: ["HTML", "CSS", "Flexbox & Grid", "Git basics"], milestone: "Publish a responsive personal page" },
      { title: "JavaScript", timeframe: "Months 2–4", focus: "Core language, the DOM, fetching data and debugging.", skills: ["JavaScript", "DOM", "Fetch API", "DevTools"], milestone: "Build an app that loads data from a public API" },
      { title: "Frameworks & types", timeframe: "Months 4–6", focus: "Component thinking, state and type safety.", skills: ["React", "TypeScript", "Routing", "Testing basics"], milestone: "Ship a multi-page project with tests" },
      { title: "Professional practice", timeframe: "Months 6–9", focus: "Accessibility, performance, code review and collaboration.", skills: ["Accessibility", "Performance", "Code review", "CI"], milestone: "Contribute to an open-source project or land an internship" },
    ],
  },
  {
    slug: "data-analyst", title: "Data Analyst", category: "Data & Analytics",
    summary: "Learn to ask good questions of data and communicate clear answers.",
    stages: [
      { title: "Spreadsheets & statistics", timeframe: "Months 1–2", focus: "Descriptive statistics, cleaning data, pivot tables.", skills: ["Excel / Sheets", "Statistics", "Data cleaning"], milestone: "Analyse a public dataset and write a one-page summary" },
      { title: "SQL", timeframe: "Months 2–3", focus: "Querying, joining and aggregating relational data.", skills: ["SQL", "Joins", "Window functions"], milestone: "Answer ten business questions with SQL" },
      { title: "Visualisation", timeframe: "Months 3–5", focus: "Choosing the right chart and building dashboards.", skills: ["Power BI or Looker Studio", "Chart design", "Storytelling"], milestone: "Publish an interactive dashboard" },
      { title: "Python & portfolio", timeframe: "Months 5–8", focus: "Automating analysis and presenting a portfolio.", skills: ["Python", "Pandas", "Notebooks"], milestone: "Three portfolio case studies with written insights" },
    ],
  },
  {
    slug: "product-designer", title: "Product Designer", category: "Design",
    summary: "Build a design process grounded in research, clarity and accessibility.",
    stages: [
      { title: "Design fundamentals", timeframe: "Months 1–2", focus: "Typography, layout, colour and visual hierarchy.", skills: ["Typography", "Layout", "Colour"], milestone: "Redesign three screens of an app you use" },
      { title: "Tools & prototyping", timeframe: "Months 2–3", focus: "Wireframes, components and interactive prototypes.", skills: ["Figma", "Components", "Prototyping"], milestone: "Clickable prototype of a small product" },
      { title: "Research & testing", timeframe: "Months 3–5", focus: "Interviews, usability tests and synthesis.", skills: ["User interviews", "Usability testing", "Synthesis"], milestone: "Run five usability sessions and iterate" },
      { title: "Portfolio & collaboration", timeframe: "Months 5–8", focus: "Case-study writing, working with engineers, design systems.", skills: ["Case studies", "Design systems", "Handoff"], milestone: "Two in-depth case studies in a portfolio" },
    ],
  },
  {
    slug: "digital-marketer", title: "Digital Marketer", category: "Marketing",
    summary: "Plan, run and measure campaigns across search, social and email.",
    stages: [
      { title: "Marketing basics", timeframe: "Month 1", focus: "Audiences, positioning and the marketing funnel.", skills: ["Positioning", "Personas", "Funnels"], milestone: "Write a positioning brief for a local business" },
      { title: "Content & channels", timeframe: "Months 2–3", focus: "Copywriting, social media and email.", skills: ["Copywriting", "Social media", "Email"], milestone: "Run a four-week content calendar" },
      { title: "Search & analytics", timeframe: "Months 3–5", focus: "SEO fundamentals and measuring results.", skills: ["SEO", "Web analytics", "UTM tracking"], milestone: "Report on a campaign with clear metrics" },
      { title: "Growth experiments", timeframe: "Months 5–7", focus: "Hypotheses, A/B tests and budgeting.", skills: ["Experimentation", "Paid ads basics", "Budgeting"], milestone: "Document three experiments and what you learned" },
    ],
  },
  {
    slug: "financial-analyst", title: "Financial Analyst", category: "Finance",
    summary: "Build models that support real business decisions.",
    stages: [
      { title: "Accounting foundations", timeframe: "Months 1–2", focus: "Financial statements and how they connect.", skills: ["Income statement", "Balance sheet", "Cash flow"], milestone: "Explain a public company's statements in plain language" },
      { title: "Spreadsheet modelling", timeframe: "Months 2–4", focus: "Clean, auditable models and forecasting.", skills: ["Excel", "Forecasting", "Scenario analysis"], milestone: "Build a three-statement model" },
      { title: "Valuation & analysis", timeframe: "Months 4–6", focus: "Ratios, unit economics and valuation methods.", skills: ["Ratios", "DCF", "Unit economics"], milestone: "Write a short investment memo" },
    ],
  },
  {
    slug: "sustainability-analyst", title: "Sustainability Analyst", category: "Sustainability",
    summary: "Measure environmental impact and help organisations act on it.",
    stages: [
      { title: "Climate & ESG basics", timeframe: "Months 1–2", focus: "Climate science essentials and ESG concepts.", skills: ["Climate basics", "ESG concepts"], milestone: "Summarise a company's sustainability report" },
      { title: "Carbon accounting", timeframe: "Months 2–4", focus: "Scopes 1–3, emissions factors and data collection.", skills: ["GHG Protocol", "Emissions data", "Spreadsheets"], milestone: "Estimate the footprint of a small organisation" },
      { title: "Reporting & strategy", timeframe: "Months 4–6", focus: "Reporting frameworks and reduction plans.", skills: ["Reporting frameworks", "Target setting", "Stakeholder engagement"], milestone: "Draft a reduction roadmap" },
    ],
  },
];

export interface Resource {
  title: string;
  provider: string;
  url: string;
  kind: "Course" | "Documentation" | "Guide" | "Practice";
  topic: string;
  free: boolean;
}

/** Well-known, free, publicly available learning resources (external links). */
export const RESOURCES: Resource[] = [
  { title: "MDN Web Docs: Learn web development", provider: "Mozilla", url: "https://developer.mozilla.org/en-US/docs/Learn", kind: "Documentation", topic: "Web development", free: true },
  { title: "Responsive Web Design certification", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn", kind: "Course", topic: "Web development", free: true },
  { title: "Web Accessibility Tutorials", provider: "W3C WAI", url: "https://www.w3.org/WAI/tutorials/", kind: "Guide", topic: "Accessibility", free: true },
  { title: "Statistics and probability", provider: "Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability", kind: "Course", topic: "Data & statistics", free: true },
  { title: "Kaggle Learn micro-courses", provider: "Kaggle", url: "https://www.kaggle.com/learn", kind: "Practice", topic: "Data & statistics", free: true },
  { title: "SQLBolt interactive lessons", provider: "SQLBolt", url: "https://sqlbolt.com/", kind: "Practice", topic: "Data & statistics", free: true },
  { title: "Python tutorial", provider: "Python.org", url: "https://docs.python.org/3/tutorial/", kind: "Documentation", topic: "Programming", free: true },
  { title: "Git book: Pro Git", provider: "git-scm.com", url: "https://git-scm.com/book/en/v2", kind: "Documentation", topic: "Programming", free: true },
  { title: "Laws of UX", provider: "lawsofux.com", url: "https://lawsofux.com/", kind: "Guide", topic: "Design", free: true },
  { title: "Figma Learn", provider: "Figma", url: "https://help.figma.com/hc/en-us/categories/360002051613", kind: "Guide", topic: "Design", free: true },
  { title: "Google Search Central: SEO Starter Guide", provider: "Google", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", kind: "Guide", topic: "Marketing", free: true },
  { title: "GHG Protocol: Standards", provider: "GHG Protocol", url: "https://ghgprotocol.org/standards", kind: "Documentation", topic: "Sustainability", free: true },
];

export interface InterviewTopic {
  title: string;
  intro: string;
  questions: { q: string; tip: string }[];
}

export const INTERVIEW_TOPICS: InterviewTopic[] = [
  {
    title: "Getting to know you",
    intro: "Almost every interview opens here. Prepare a two-minute story that connects your past, present and why this role.",
    questions: [
      { q: "Tell me about yourself.", tip: "Structure it as present → past → future: what you're doing now, one or two experiences that shaped you, and why this role is the logical next step." },
      { q: "Why do you want this internship?", tip: "Name something specific about the team or work, then link it to a skill you want to build. Avoid generic praise." },
      { q: "What are you looking to learn?", tip: "Pick one or two concrete skills and explain how you'd use them afterwards." },
    ],
  },
  {
    title: "Behavioural questions (STAR)",
    intro: "Answer with Situation, Task, Action, Result. Spend most of your time on the Action — what you did, not the team.",
    questions: [
      { q: "Describe a time you worked through a disagreement in a team.", tip: "Show you listened first, found shared goals, and kept the relationship intact. End with what you'd repeat." },
      { q: "Tell me about a project that didn't go to plan.", tip: "Own your part honestly, explain what you changed, and share the measurable outcome or lesson." },
      { q: "When did you learn something quickly?", tip: "Describe your learning approach — resources, practice, asking for feedback — not just that you're a fast learner." },
    ],
  },
  {
    title: "Role-specific thinking",
    intro: "Interviewers want to see how you reason. Think aloud, state assumptions, and check your answer.",
    questions: [
      { q: "Walk me through a project on your resume.", tip: "Explain the problem, your decisions and trade-offs, and what you'd improve. Be ready for follow-up questions on any detail." },
      { q: "How would you approach a task you've never done before?", tip: "Break it down: clarify the goal, research, try a small version, ask for feedback, iterate." },
      { q: "How do you prioritise when everything feels urgent?", tip: "Mention impact and deadlines, communicating trade-offs, and confirming priorities with your manager." },
    ],
  },
  {
    title: "Your questions for them",
    intro: "Always have two or three thoughtful questions ready. They show genuine interest.",
    questions: [
      { q: "What does a successful first month look like in this role?", tip: "Listen for how clear the expectations are — it tells you about onboarding and support." },
      { q: "How does the team give feedback?", tip: "Good teams have regular, specific feedback. Vague answers are worth noting." },
      { q: "What are you most excited about for the team this year?", tip: "A friendly closer that often reveals the team's real priorities." },
    ],
  },
];
