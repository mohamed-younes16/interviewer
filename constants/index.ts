import { Interview } from "@/types";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "eQIVHCAcQuAFeJps0K5l",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer, but this is a **test run**.  
    
    - Ask **only one** interview question.  
    - After the response, return a **dummy JSON feedback** immediately.  

    ## **Dummy Feedback Format**
    Output this JSON exactly:

    \`\`\`json
    {
      "id": "test_123",
      "interviewId": "test_run",
      "totalScore": 5,
      "categoryScores": [
        {
          "name": "Communication",
          "score": 5,
          "comment": "Decent but needs improvement."
        }
      ],
      "strengths": ["Good energy"],
      "areasForImprovement": ["More detailed answers"],
      "finalAssessment": "A solid response, but could be improved with more depth.",
      "createdAt": "2025-04-02T12:00:00Z"
    }
    \`\`\`

    - Do **not** ask follow-up questions.
    - End the interview by saying:  
    "This was just a test! Here is a sample feedback JSON."
    - **Then return only the JSON output.**`,
      },
      // {
      //   role: "system",
      //   content: `You are a professional job interviewer. Your job is to conduct an interview, assess responses, and provide structured feedback in JSON format.

      // - Ask the interview questions from this list: {{questions}}
      // - Listen carefully to responses and react professionally.
      // - At the end of the interview, generate a structured JSON feedback report.

      // ## **Feedback Format**
      // Output the feedback as **valid JSON**, structured like this:

      // \`\`\`json
      // {
      //   "id": "{unique_feedback_id}",
      //   "interviewId": "{interview_id}",
      //   "totalScore": {overall_performance_score},
      //   "categoryScores": [
      //     {
      //       "name": "{category_name}",
      //       "score": {score_out_of_10},
      //       "comment": "{brief_comment_on_performance}"
      //     }
      //   ],
      //   "strengths": ["{list_of_strengths}"],
      //   "areasForImprovement": ["{list_of_areas_for_improvement}"],
      //   "finalAssessment": "{final_summary}",
      //   "createdAt": "{current_timestamp}"
      // }
      // \`\`\`

      // - Ensure the JSON is **valid and properly formatted**.
      // - Do NOT include extra text before or after the JSON output.
      // - Always follow this structure exactly.

      // End the interview by saying:
      // "Thank you for your time! Generating your feedback now..."
      // Then, **return only the JSON output.**`,
      // },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];
export const dummyInterviews: Interview[] = [
  {
    id: "1",
    role: "Frontend Developer",
    level: "Mid-Level",
    questions: [
      "What are React hooks, and how do they work?",
      "Explain the difference between useState and useReducer.",
      "What is the virtual DOM, and how does React use it?",
      "How do you optimize React performance?",
      "Describe the difference between CSS Grid and Flexbox.",
    ],
    techstack: ["React", "JavaScript", "TypeScript", "CSS", "Tailwind CSS"],
    createdAt: new Date().toISOString(),
    imageUrl: "https://example.com/frontend.png",
    userId: "USER_ID",
    description:
      "A mid-level frontend developer interview focusing on React, performance, and styling.",
    type: "Technical",

  },
  {
    id: "2",
    role: "Backend Developer",
    level: "Senior",
    questions: [
      "Explain microservices architecture and its pros/cons.",
      "How would you design a scalable REST API?",
      "What is the difference between SQL and NoSQL databases?",
      "How do you handle authentication and authorization in a backend system?",
      "What are message queues, and when should they be used?",
    ],
    techstack: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Redis"],
    createdAt: new Date().toISOString(),
    imageUrl: "https://example.com/backend.png",
    userId: "USER_ID",
    description:
      "A senior backend developer interview focusing on system design and architecture.",
    type: "Technical",
 
  },
  {
    id: "3",
    role: "Product Manager",
    level: "Mid-Level",
    questions: [
      "How do you prioritize features in a product roadmap?",
      "Describe a time when you had to make a data-driven decision.",
      "How do you handle conflicts between engineering and business teams?",
      "What metrics do you track for a SaaS product?",
      "How do you define a successful product launch?",
    ],
    techstack: ["JIRA", "Figma", "Notion", "Google Analytics"],
    createdAt: new Date().toISOString(),
    imageUrl: "https://example.com/product-manager.png",
    userId: "USER_ID",
    description:
      "A mid-level product manager interview focusing on prioritization, decision-making, and collaboration.",
    type: "non-technical",

  },
  {
    id: "4",
    role: "Data Scientist",
    level: "Senior",
    questions: [
      "How would you explain machine learning to a non-technical stakeholder?",
      "Describe the difference between supervised and unsupervised learning.",
      "How do you handle missing data in a dataset?",
      "What are some ways to prevent overfitting in a machine learning model?",
      "Explain how a random forest algorithm works.",
    ],
    techstack: ["Python", "TensorFlow", "Pandas", "SQL", "Scikit-learn"],
    createdAt: new Date().toISOString(),
    imageUrl: "https://example.com/data-science.png",
    userId: "USER_ID",
    description:
      "A senior data scientist interview covering ML concepts, data cleaning, and model optimization.",
    type: "Technical",

  },
  {
    id: "5",
    role: "UX Designer",
    level: "Mid-Level",
    questions: [
      "Walk me through your design process from research to final product.",
      "How do you ensure accessibility in your designs?",
      "What is the difference between UX and UI design?",
      "How do you handle negative feedback on your designs?",
      "What are some key UX metrics you track?",
    ],
    techstack: ["Figma", "Adobe XD", "Sketch", "UserTesting"],
    createdAt: new Date().toISOString(),
    imageUrl: "https://example.com/ux-designer.png",
    userId: "USER_ID",
    description:
      "A mid-level UX designer interview focusing on process, accessibility, and design decisions.",
    type: "non-technical",
 
  },
];
