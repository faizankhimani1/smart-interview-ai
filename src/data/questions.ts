export type Role = 'frontend' | 'backend' | 'fullstack' | 'aiml';
export type Level = 'fresher' | 'experienced';
export type Round = 'aptitude' | 'technical' | 'hr';

export interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface TechnicalQuestion {
  id: string;
  question: string;
  type: 'conceptual' | 'coding';
  role: Role[];
  level: Level[];
  sampleAnswer: string;
  keyPoints: string[];
  codeTemplate?: string;
}

export interface HRQuestion {
  id: string;
  question: string;
  category: string;
  keyTraits: string[];
  sampleAnswer: string;
}

export const aptitudeQuestions: AptitudeQuestion[] = [
  {
    id: 'apt_1',
    question: 'If a train travels 300 km in 4 hours, what is its speed in km/h?',
    options: ['60 km/h', '75 km/h', '80 km/h', '90 km/h'],
    correctIndex: 1,
    explanation: 'Speed = Distance / Time = 300 / 4 = 75 km/h',
    category: 'Arithmetic',
  },
  {
    id: 'apt_2',
    question: 'What is the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'],
    correctIndex: 2,
    explanation: 'Differences are 4, 6, 8, 10, 12 → 30 + 12 = 42',
    category: 'Series',
  },
  {
    id: 'apt_3',
    question: 'A is 40% of B. B is what percent of A?',
    options: ['150%', '200%', '250%', '300%'],
    correctIndex: 2,
    explanation: 'If A = 0.4B, then B = A/0.4 = 2.5A = 250% of A',
    category: 'Percentages',
  },
  {
    id: 'apt_4',
    question: 'Which data structure uses LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctIndex: 1,
    explanation: 'A Stack operates on LIFO principle — the last element inserted is the first to be removed.',
    category: 'Data Structures',
  },
  {
    id: 'apt_5',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'Binary search repeatedly halves the search space, giving O(log n) time complexity.',
    category: 'Algorithms',
  },
  {
    id: 'apt_6',
    question: 'Two pipes can fill a tank in 12 and 18 hours. How long to fill together?',
    options: ['6.2 hours', '7.2 hours', '8 hours', '9 hours'],
    correctIndex: 1,
    explanation: '1/12 + 1/18 = 3/36 + 2/36 = 5/36. Time = 36/5 = 7.2 hours',
    category: 'Arithmetic',
  },
  {
    id: 'apt_7',
    question: 'Which sorting algorithm has best average time complexity?',
    options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
    correctIndex: 1,
    explanation: 'Merge Sort has O(n log n) in all cases — best, average and worst.',
    category: 'Algorithms',
  },
  {
    id: 'apt_8',
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language'],
    correctIndex: 0,
    explanation: 'SQL stands for Structured Query Language, used to communicate with databases.',
    category: 'Databases',
  },
  {
    id: 'apt_9',
    question: 'If a shopkeeper marks an item 25% above cost and gives 10% discount, what is profit %?',
    options: ['10%', '12.5%', '15%', '17.5%'],
    correctIndex: 1,
    explanation: 'Let cost = 100, marked = 125, selling price = 125 × 0.9 = 112.5. Profit = 12.5%',
    category: 'Percentages',
  },
  {
    id: 'apt_10',
    question: 'Which of the following is NOT an OOP concept?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
    correctIndex: 2,
    explanation: 'The four OOP pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction. Compilation is not one of them.',
    category: 'Programming Concepts',
  },
  {
    id: 'apt_11',
    question: 'In a class of 30, 18 play cricket and 15 play football. 10 play both. How many play neither?',
    options: ['5', '7', '10', '12'],
    correctIndex: 1,
    explanation: 'Using set theory: |C∪F| = 18+15−10 = 23. Neither = 30−23 = 7',
    category: 'Logic',
  },
  {
    id: 'apt_12',
    question: 'What is the output of: 5 + 3 * 2 - 1 in most programming languages?',
    options: ['15', '10', '16', '13'],
    correctIndex: 1,
    explanation: 'Operator precedence: 3*2=6, then 5+6=11, then 11-1=10',
    category: 'Programming Concepts',
  },
];

export const technicalQuestions: TechnicalQuestion[] = [
  // Frontend
  {
    id: 'tech_fe_1',
    question: 'Explain the difference between `==` and `===` in JavaScript. When would you use each?',
    type: 'conceptual',
    role: ['frontend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: '`==` performs type coercion (loose equality) before comparison, while `===` checks both value and type without coercion (strict equality). Always prefer `===` to avoid unexpected type conversions. For example, `0 == false` is true but `0 === false` is false.',
    keyPoints: ['Type coercion', 'Strict vs loose equality', 'Practical use cases', 'Best practices'],
  },
  {
    id: 'tech_fe_2',
    question: 'What is the Virtual DOM in React and how does it improve performance?',
    type: 'conceptual',
    role: ['frontend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to batch updates and minimize direct DOM manipulation. When state changes, React creates a new Virtual DOM tree, diffs it with the previous one (reconciliation), and applies only the necessary changes to the real DOM, reducing expensive browser reflows.',
    keyPoints: ['Virtual DOM definition', 'Reconciliation algorithm', 'Diffing process', 'Performance benefits'],
  },
  {
    id: 'tech_fe_3',
    question: 'Write a JavaScript function to debounce a function with a given delay.',
    type: 'coding',
    role: ['frontend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    keyPoints: ['Closure usage', 'setTimeout/clearTimeout', 'Preserving context', 'Arguments forwarding'],
    codeTemplate: `function debounce(fn, delay) {
  // Your implementation here
  
}`,
  },
  {
    id: 'tech_fe_4',
    question: 'Explain CSS Flexbox vs Grid. When would you choose one over the other?',
    type: 'conceptual',
    role: ['frontend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'Flexbox is one-dimensional (row or column), ideal for component-level layout like navigation bars, centering content, or distributing space along one axis. CSS Grid is two-dimensional (rows and columns simultaneously), best for page-level layouts. Use Flexbox for smaller UI components and Grid for overall page structure.',
    keyPoints: ['1D vs 2D layout', 'Use cases', 'Flexbox properties', 'Grid properties'],
  },
  {
    id: 'tech_fe_5',
    question: 'What are React Hooks? Explain useState and useEffect with examples.',
    type: 'conceptual',
    role: ['frontend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'Hooks are functions that let functional components use state and lifecycle features. useState manages local state (const [count, setCount] = useState(0)). useEffect handles side effects like API calls, subscriptions, and cleanup — it runs after render and optionally after specific dependencies change.',
    keyPoints: ['Hook definition', 'useState syntax', 'useEffect lifecycle', 'Dependency array'],
  },
  // Backend
  {
    id: 'tech_be_1',
    question: 'What is REST? Explain the key principles of RESTful API design.',
    type: 'conceptual',
    role: ['backend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'REST (Representational State Transfer) is an architectural style for distributed systems. Key principles: Statelessness (server stores no client state), Client-Server separation, Uniform interface (standard HTTP methods: GET, POST, PUT, DELETE), Cacheable responses, Layered system, and optional Code on demand. Resources are identified by URIs.',
    keyPoints: ['REST definition', '6 constraints', 'HTTP methods', 'Resource identification'],
  },
  {
    id: 'tech_be_2',
    question: 'Explain ACID properties in databases with real-world examples.',
    type: 'conceptual',
    role: ['backend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'ACID stands for: Atomicity (transaction is all-or-nothing — bank transfer), Consistency (DB goes from one valid state to another), Isolation (concurrent transactions don\'t interfere — multiple users booking same seat), Durability (committed data persists despite system failures). These ensure reliable database transactions.',
    keyPoints: ['Atomicity', 'Consistency', 'Isolation', 'Durability', 'Real examples'],
  },
  {
    id: 'tech_be_3',
    question: 'Write a Python function to find the most frequent element in a list.',
    type: 'coding',
    role: ['backend', 'fullstack', 'aiml'],
    level: ['fresher', 'experienced'],
    sampleAnswer: `from collections import Counter

def most_frequent(lst):
    if not lst:
        return None
    counter = Counter(lst)
    return counter.most_common(1)[0][0]

# Alternative without Counter
def most_frequent_v2(lst):
    return max(set(lst), key=lst.count)`,
    keyPoints: ['Counter usage', 'Edge cases', 'Time complexity', 'Alternative approaches'],
    codeTemplate: `def most_frequent(lst):
    # Your implementation here
    pass`,
  },
  {
    id: 'tech_be_4',
    question: 'What is the difference between SQL and NoSQL databases? When would you choose each?',
    type: 'conceptual',
    role: ['backend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'SQL databases are relational, schema-based, ACID-compliant (PostgreSQL, MySQL) — best for structured data, complex queries, and transactions. NoSQL databases (MongoDB, Redis, Cassandra) are schema-less, highly scalable, and flexible — best for unstructured data, high-throughput write operations, and horizontal scaling.',
    keyPoints: ['Structure differences', 'ACID vs BASE', 'Scalability', 'Use case examples'],
  },
  {
    id: 'tech_be_5',
    question: 'Explain microservices architecture and its advantages over monolithic architecture.',
    type: 'conceptual',
    role: ['backend', 'fullstack'],
    level: ['experienced'],
    sampleAnswer: 'Microservices decompose an application into small, independent services each with its own business logic and database. Advantages: Independent deployment, technology heterogeneity, fault isolation, easier scaling of individual components, better team autonomy. Drawbacks include increased complexity, network overhead, and distributed system challenges.',
    keyPoints: ['Definition', 'vs Monolith', 'Advantages', 'Challenges', 'Communication patterns'],
  },
  // AI/ML
  {
    id: 'tech_ai_1',
    question: 'Explain the difference between supervised, unsupervised, and reinforcement learning.',
    type: 'conceptual',
    role: ['aiml'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'Supervised learning uses labeled data to learn input-output mappings (classification, regression). Unsupervised learning finds patterns in unlabeled data (clustering, dimensionality reduction). Reinforcement learning trains agents through reward/punishment in an environment (game playing, robotics). Each suits different problem types based on data availability and objectives.',
    keyPoints: ['Supervised definition', 'Unsupervised definition', 'RL definition', 'Examples of each'],
  },
  {
    id: 'tech_ai_2',
    question: 'What is overfitting? How do you detect and prevent it?',
    type: 'conceptual',
    role: ['aiml'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'Overfitting occurs when a model learns training data too well, including noise, and fails to generalize to new data. Detection: Large gap between train and validation accuracy. Prevention: Regularization (L1/L2), Dropout, Cross-validation, Early stopping, More training data, Data augmentation, Simpler model architecture.',
    keyPoints: ['Definition', 'Detection methods', 'Prevention techniques', 'Bias-variance tradeoff'],
  },
  {
    id: 'tech_ai_3',
    question: 'Write a Python function to implement linear regression from scratch using gradient descent.',
    type: 'coding',
    role: ['aiml'],
    level: ['experienced'],
    sampleAnswer: `import numpy as np

def linear_regression_gd(X, y, lr=0.01, epochs=1000):
    m = len(y)
    theta = np.zeros(X.shape[1])
    
    for _ in range(epochs):
        predictions = X.dot(theta)
        errors = predictions - y
        gradient = X.T.dot(errors) / m
        theta -= lr * gradient
    
    return theta`,
    keyPoints: ['Gradient computation', 'Parameter update', 'Learning rate', 'Convergence'],
    codeTemplate: `import numpy as np

def linear_regression_gd(X, y, lr=0.01, epochs=1000):
    # Your implementation here
    pass`,
  },
  // Full Stack
  {
    id: 'tech_fs_1',
    question: 'Explain the concept of JWT authentication. How does it work end-to-end?',
    type: 'conceptual',
    role: ['fullstack', 'backend'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'JWT (JSON Web Token) consists of three parts: Header (algorithm), Payload (claims/data), and Signature (verification). On login, server creates and signs a JWT and sends it to the client. Client stores it (localStorage/cookies) and sends it in Authorization header for subsequent requests. Server verifies the signature without database lookup — stateless authentication.',
    keyPoints: ['JWT structure', 'Header/Payload/Signature', 'Auth flow', 'Stateless nature', 'Security considerations'],
  },
  {
    id: 'tech_fs_2',
    question: 'What is Docker and how does containerization benefit full-stack development?',
    type: 'conceptual',
    role: ['fullstack', 'backend'],
    level: ['experienced'],
    sampleAnswer: 'Docker packages applications with their dependencies into containers — lightweight, portable, isolated environments. Benefits: Environment consistency (eliminates "works on my machine"), easy deployment, microservices orchestration, rapid scaling with Kubernetes, CI/CD integration. Docker Compose manages multi-container apps (frontend, backend, database).',
    keyPoints: ['Container definition', 'vs VMs', 'Docker Compose', 'Benefits in dev/prod'],
  },
];

export const hrQuestions: HRQuestion[] = [
  {
    id: 'hr_1',
    question: 'Tell me about yourself and why you chose a career in software development.',
    category: 'Introduction',
    keyTraits: ['Communication', 'Passion', 'Clarity', 'Relevance'],
    sampleAnswer: 'A strong answer connects personal background to technical interests, highlights key experiences, and expresses genuine enthusiasm for problem-solving and technology.',
  },
  {
    id: 'hr_2',
    question: 'Describe a challenging technical problem you faced and how you solved it.',
    category: 'Problem Solving',
    keyTraits: ['Analytical thinking', 'Perseverance', 'Creativity', 'Technical depth'],
    sampleAnswer: 'Use the STAR method: Situation, Task, Action, Result. Focus on your specific contribution, technical approach, and measurable outcomes.',
  },
  {
    id: 'hr_3',
    question: 'How do you handle tight deadlines and multiple priorities simultaneously?',
    category: 'Time Management',
    keyTraits: ['Organization', 'Prioritization', 'Stress management', 'Communication'],
    sampleAnswer: 'A strong response mentions specific prioritization methods, communication with stakeholders, breaking tasks into milestones, and maintaining quality under pressure.',
  },
  {
    id: 'hr_4',
    question: 'Describe a time you had to work with a difficult team member. How did you handle it?',
    category: 'Teamwork',
    keyTraits: ['Emotional intelligence', 'Conflict resolution', 'Empathy', 'Professionalism'],
    sampleAnswer: 'Strong answers show emotional intelligence, proactive communication, focusing on team goals over personal conflicts, and positive outcomes for the project.',
  },
  {
    id: 'hr_5',
    question: 'Where do you see yourself in 5 years? What are your career goals?',
    category: 'Career Goals',
    keyTraits: ['Ambition', 'Alignment', 'Realism', 'Growth mindset'],
    sampleAnswer: 'Good responses align personal growth with company trajectory, show technical ambition (architect, lead, specialist), and demonstrate research into the industry.',
  },
  {
    id: 'hr_6',
    question: 'What is your greatest strength and how has it helped you in your career?',
    category: 'Self-awareness',
    keyTraits: ['Self-awareness', 'Confidence', 'Evidence', 'Relevance'],
    sampleAnswer: 'Effective answers name a specific strength relevant to the role, back it with a concrete example, and show its positive impact on past work.',
  },
  {
    id: 'hr_7',
    question: 'How do you stay updated with the latest technology trends and continue learning?',
    category: 'Learning',
    keyTraits: ['Curiosity', 'Initiative', 'Adaptability', 'Growth mindset'],
    sampleAnswer: 'Strong responses mention specific resources (blogs, conferences, courses), personal projects, open-source contributions, and a genuine enthusiasm for continuous learning.',
  },
];

export const additionalTechnicalQuestions: TechnicalQuestion[] = [
  {
    id: 'tech_fe_6',
    question: 'Explain event delegation in JavaScript and why it\'s useful.',
    type: 'conceptual',
    role: ['frontend', 'fullstack'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'Event delegation leverages event bubbling to handle events at a parent level rather than attaching listeners to each child. This improves performance (fewer listeners), works for dynamically added elements, and simplifies code. Example: One click listener on a `<ul>` handles all `<li>` clicks by checking `event.target`.',
    keyPoints: ['Event bubbling', 'Parent listener', 'Dynamic elements', 'Performance benefits'],
  },
  {
    id: 'tech_be_6',
    question: 'What is the difference between authentication and authorization?',
    type: 'conceptual',
    role: ['backend', 'fullstack', 'frontend'],
    level: ['fresher', 'experienced'],
    sampleAnswer: 'Authentication verifies WHO you are (login with credentials). Authorization determines WHAT you can access (permissions/roles). Example: Logging into Gmail is authentication; only being able to see your own emails is authorization. Auth happens first, then authorization.',
    keyPoints: ['Authentication definition', 'Authorization definition', 'Order of operations', 'Real examples'],
  },
  {
    id: 'tech_ai_4',
    question: 'Explain the concept of transfer learning and when would you use it?',
    type: 'conceptual',
    role: ['aiml'],
    level: ['experienced'],
    sampleAnswer: 'Transfer learning uses a pre-trained model (trained on large datasets like ImageNet) and fine-tunes it for a specific task. Use it when you have limited labeled data, need faster training, or want to leverage learned features. Examples: Using BERT for text classification, ResNet for medical imaging, GPT for domain-specific chatbots.',
    keyPoints: ['Definition', 'Pre-trained models', 'Fine-tuning', 'Use cases', 'Examples'],
  },
  {
    id: 'tech_fs_3',
    question: 'What is CI/CD and how does it improve software delivery?',
    type: 'conceptual',
    role: ['fullstack', 'backend'],
    level: ['experienced'],
    sampleAnswer: 'CI (Continuous Integration) automates code integration and testing on every commit, catching bugs early. CD (Continuous Delivery/Deployment) automates the release pipeline — from testing to production. Benefits: faster releases, reduced manual errors, consistent quality, immediate feedback loops. Tools: GitHub Actions, Jenkins, CircleCI.',
    keyPoints: ['CI definition', 'CD definition', 'Pipeline stages', 'Benefits', 'Tools'],
  },
];

export function getQuestionsForSession(role: Role, level: Level): {
  aptitude: AptitudeQuestion[];
  technical: TechnicalQuestion[];
  hr: HRQuestion[];
} {
  const aptitude = aptitudeQuestions.sort(() => Math.random() - 0.5).slice(0, 8);

  const allTechnical = [...technicalQuestions, ...additionalTechnicalQuestions];
  const technical = allTechnical
    .filter(q => q.role.includes(role) && q.level.includes(level))
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  const hr = hrQuestions.sort(() => Math.random() - 0.5).slice(0, 4);

  return { aptitude, technical, hr };
}
