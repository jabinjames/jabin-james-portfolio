export const DATA = {
  name: "Jabin James",
  title: "AI / Software Engineer",
  location: "Pathanamthitta, Kerala, India",
  email: "jabinjames.dev@gmail.com",
  phone: "+91-9526612086",
  linkedin: "https://www.linkedin.com/in/jabinjames/",
  summary:
    "I build systems that reason in steps. My background is in software engineering and applied AI — most recently architecting stateful, multi-agent LLM workflows during an AI research internship, where natural language turned into orchestrated API calls instead of manual data-fetching. I like the layer where language models stop being a chat box and start being a component in a larger system: state graphs, tool calls, retrieval pipelines, conditional routing.",
  interests: [
    "LLM orchestration",
    "Agentic workflows",
    "Retrieval-Augmented Generation",
    "Backend systems",
    "Applied deep learning",
    "API design",
  ],
  experience: [
    {
      org: "TalksandTalks",
      role: "AI Research Intern",
      location: "Kochi",
      duration: "Feb 2026 — Aug 2026",
      state: "active",
      points: [
        "Architected a stateful, multi-step reasoning engine using LangGraph StateGraph, implementing reflection patterns and conditional edge routing to automate sequential API orchestration.",
        "Developed a natural language query engine with LangChain that translates complex English queries into functional API calls, removing manual data-fetching for end users.",
        "Used StateGraph architecture with lazy graph initialization and custom agent state management to orchestrate sequential API calls based on LLM reasoning.",
        "Integrated LLMs with external APIs and data sources to orchestrate dynamic, multi-step task execution.",
        "Engineered custom LangChain tools and connectors to bridge LLMs with third-party platforms.",
      ],
      tech: ["Python", "LangChain", "LangGraph", "REST APIs", "Groq LLM"],
    },
    {
      org: "National Service Scheme (NSS)",
      role: "Volunteer",
      location: "Pathanamthitta",
      duration: "Ongoing",
      state: "complete",
      points: [
        "Organized community outreach programs and health awareness camps for over 500 participants.",
        "Completed 100+ hours of community service, including environmental conservation projects.",
      ],
      tech: [],
    },
  ],
  education: [
    {
      degree: "B.Tech, Computer Science & Engineering",
      org: "Mar Baselios College of Engineering and Technology (Autonomous), Trivandrum",
      duration: "May 2025",
      detail: "CGPA 6.67 / 10",
    },
    {
      degree: "12th — Higher Secondary",
      org: "Mar Thoma Higher Secondary School, Pathanamthitta",
      duration: "Jan 2021",
      detail: "95.83 / 100",
    },
    {
      degree: "10th",
      org: "Sacred Heart High School, Pathanamthitta",
      duration: "Jan 2018",
      detail: "100 / 100",
    },
  ],
  skills: {
    "Languages & Libraries": {
      color: "amber",
      items: [
        "Python",
        "Java",
        "SQL",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "PyTorch",
        "Hugging Face Transformers",
        "React",
        "HTML",
        "CSS",
      ],
    },
    "AI / LLM Stack": {
      color: "teal",
      items: [
        "LangChain",
        "LangGraph StateGraph",
        "Groq LLM",
        "RAG Pipelines",
        "LLM Agent Orchestration",
        "MLOps",
      ],
    },
    "ML / DL Concepts": {
      color: "amber",
      items: [
        "Machine Learning",
        "Deep Learning",
        "CNNs",
        "LSTMs",
        "CTC Loss",
        "NLP",
        "EDA",
        "Feature Engineering",
        "Model Evaluation",
      ],
    },
    "Tools & Platforms": {
      color: "teal",
      items: [
        "Git",
        "GitHub",
        "Power BI",
        "Excel",
        "MySQL",
        "NoSQL",
        "Production Support",
        "Workflow Orchestration",
      ],
    },
  },
  projects: [
    {
      id: "rag",
      name: "Adaptive RAG Pipeline",
      tagline: "Grounding LLM responses in domain-specific documents",
      summary:
        "A retrieval-augmented pipeline that grounds LLM answers in real documents, dynamically selecting context to reduce hallucination.",
      category: "AI / Machine Learning",
      image: null,
      problem:
        "LLMs answer confidently even when they don't know the answer. Without grounding in real source material, responses drift into plausible-sounding hallucination.",
      solution:
        "Implemented a Retrieval-Augmented Generation pipeline that grounds LLM responses in domain-specific knowledge sourced from external documents, with an adaptive layer that selects relevant context dynamically based on query intent — rather than always retrieving the same fixed context window.",
      points: [
        "Adaptive RAG framework that dynamically selects relevant context based on query intent, improving accuracy and reducing hallucinations.",
        "Document chunking and embedding strategy, with vector representations stored in a Chroma vector database for similarity search.",
        "End-to-end pipeline evaluation covering both retrieval quality and final response accuracy.",
      ],
      tech: ["Python", "LangChain", "Chroma", "Embedding Models", "LLMs"],
      githubUrl: "https://github.com/jabinjames/RAG",
      demoUrl: "https://github.com/jabinjames/RAG",
    },
    {
      id: "summarization",
      name: "Text Summarization",
      tagline: "Fine-tuned BART for abstractive summarization",
      summary:
        "A fine-tuned BART model that turns long-form text into fluent, context-aware summaries instead of stitched-together fragments.",
      category: "AI / Machine Learning",
      image: null,
      problem:
        "Long-form text is expensive to read in full. Extractive summaries preserve exact sentences but read choppily — the goal was fluent, context-aware summaries, not stitched fragments.",
      solution:
        "Fine-tuned a pretrained transformer model (BART) for abstractive text summarization, enabling coherent and context-aware summaries, with a preprocessing and tokenization pipeline tuned for long-form input, then evaluated with standard NLP metrics.",
      points: [
        "Data preprocessing and tokenization pipeline optimized for long-form textual input.",
        "Model trained and evaluated using ROUGE, checking accuracy, fluency, and relevance of generated summaries.",
        "Built with Python, Hugging Face Transformers, PyTorch, and Jupyter Notebook, documented for reproducibility.",
      ],
      tech: ["Python", "Hugging Face Transformers", "PyTorch", "BART", "ROUGE"],
      githubUrl: "https://github.com/jabinjames/Text_Summarization",
      demoUrl: "https://github.com/jabinjames/Text_Summarization",
    },
    {
      id: "braille",
      name: "Handwritten Text → Braille",
      tagline: "An accessibility pipeline from handwriting to Braille",
      summary:
        "An end-to-end deep learning pipeline that converts handwritten text into Braille, improving accessibility for visually impaired users.",
      category: "AI / Machine Learning",
      image: null,
      problem:
        "Converting handwritten text to Braille needs a model that can read messy, variable handwriting and then correctly sequence it — a task with no explicit character-level segmentation to lean on.",
      solution:
        "Developed an end-to-end machine learning pipeline to convert handwritten text into Braille, combining CNNs for visual feature extraction with LSTMs for sequence modelling, decoded with CTC loss so the model doesn't need pre-segmented characters to learn from.",
      points: [
        "CNNs extract spatial and visual features from handwritten character images.",
        "LSTMs model temporal dependencies and sequential patterns across handwriting variation.",
        "CTC loss handles sequence alignment and decoding without explicit character-level segmentation.",
      ],
      tech: ["Python", "CNN", "LSTM", "CTC Loss", "Deep Learning"],
      githubUrl: null,
      demoUrl: null,
    },
  ],
  certifications: [
    {
      id: "datascientist",
      title: "Data Scientist",
      issuer: "NASSCOM",
      date: "January 2026",
      featured: true,
    },
    {
      id: "ml",
      title: "Introduction to Machine Learning",
      issuer: "MBCET",
      date: "August 2024",
      featured: false,
    },
    {
      id: "cloud",
      title: "Cloud Computing",
      issuer: "Teachnook",
      date: "February 2022",
      featured: false,
    },
  ],
  languages: ["English", "Hindi", "Malayalam"],
};

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];
