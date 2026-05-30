// JobPrep AI — Mock Interview and Tips Data
const JobPrepData = {
  defaultSkills: [
    { id: 1, name: 'System Design', value: 60, colorClass: 'blue' },
    { id: 2, name: 'Algorithms', value: 45, colorClass: 'coral' },
    { id: 3, name: 'Behavioural', value: 80, colorClass: 'purple' },
    { id: 4, name: 'Data Structures', value: 35, colorClass: 'amber' }
  ],

  tips: [
    {
      num: '01',
      text: 'Use the <strong>STAR method</strong> — Situation, Task, Action, Result — for every behavioural question.',
      badgeText: 'Behavioural',
      badgeClass: 'blue'
    },
    {
      num: '02',
      text: '<strong>Clarify requirements</strong> before diving in. Smart questions show senior engineering thinking.',
      badgeText: 'Technical',
      badgeClass: 'teal'
    },
    {
      num: '03',
      text: '<strong>Think out loud.</strong> Interviewers value your reasoning as much as the final answer.',
      badgeText: 'General',
      badgeClass: 'coral'
    },
    {
      num: '04',
      text: 'For coding challenges, **test edge cases** (null input, empty arrays, extreme bounds) before declaring done.',
      badgeText: 'Technical',
      badgeClass: 'purple'
    },
    {
      num: '05',
      text: 'Be **honest about what you do not know**. Explain how you would go about finding the solution instead.',
      badgeText: 'General',
      badgeClass: 'amber'
    }
  ],

  interviewQuestions: {
    tech: [
      {
        id: 1,
        question: "Let's start the Technical track. How would you design a URL shortening service like Bitly? What are the key scale requirements and architectural components you'd consider?",
        keywords: ['hash', 'base62', 'cache', 'redis', 'db', 'database', 'sharding', 'nosql', 'unique', 'api', 'load balancer', 'redirect'],
        feedbackMatch: "That is a very structured answer. Incorporating elements like Base62 encoding, Redis caching, and a horizontal scaling strategy using a Load Balancer represents solid system design capability.",
        feedbackGeneric: "Excellent start. In system design, focusing on high availability, database choices (like NoSQL for key-value redirection), and CDN/Caching strategies yields a very strong engineering response."
      },
      {
        id: 2,
        question: "Great. Now, how would you detect a cycle in a directed graph? Explain the algorithm, data structures, and its time and space complexities.",
        keywords: ['dfs', 'visited', 'stack', 'recursion', 'kahn', 'topological', 'indegree', 'color', 'grey', 'black', 'o(v+e)'],
        feedbackMatch: "Correct! Using depth-first search (DFS) with recursive backtracking or Kahn's algorithm for topological sorting is the standard way. Your explanation of O(V + E) time complexity is spot on.",
        feedbackGeneric: "Good. Cycle detection is key in dependency resolution systems. A Depth First Search (DFS) with a tracking set (or three-color marking: white, grey, black) yields O(V + E) time and O(V) space complexities."
      },
      {
        id: 3,
        question: "Interesting. What are the key differences between optimistic locking and pessimistic locking? In what scenarios would you choose one over the other?",
        keywords: ['version', 'collision', 'concurrency', 'write', 'read', 'database', 'conflict', 'performance', 'overhead', 'deadlock'],
        feedbackMatch: "Well explained. Optimistic locking using a version column is ideal for read-heavy systems with low collision probability, whereas pessimistic locking is safer for high-conflict transaction processing.",
        feedbackGeneric: "Good points. Optimistic locking works great for high concurrency and low write conflicts by checking row versions on write. Pessimistic locking locks the rows upfront, avoiding conflicts but risking deadlocks."
      },
      {
        id: 4,
        question: "Perfect. Lastly, how do you handle state management in a highly distributed application where users need microsecond latency response?",
        keywords: ['redis', 'cache', 'session', 'stateless', 'sticky', 'jwt', 'distributed', 'pub/sub', 'consistent hashing', 'replication'],
        feedbackMatch: "Excellent. Utilizing redis replication, stateless servers, JWTs, and consistent hashing for server affinity is the standard industry pattern for low-latency session management.",
        feedbackGeneric: "Solid approach. Designing stateless application servers and caching session state in a distributed database like Redis or Memcached allows scaling horizontally while maintaining microsecond response times."
      }
    ],
    behav: [
      {
        id: 1,
        question: "Welcome to the Behavioural track. Tell me about a time you had a severe technical conflict with a teammate. How did you handle it and what was the outcome?",
        keywords: ['conflict', 'data', 'communication', 'listen', 'compromise', 'align', 'meeting', 'trade-off', 'manager', 'agree', 'disagree'],
        feedbackMatch: "Great. Emphasizing active listening, grounding technical decisions in objective data/benchmarks, and focusing on user outcomes is the gold standard for healthy engineering collaboration.",
        feedbackGeneric: "Good story. Resolving team conflicts through proactive communication, documentation of trade-offs, and running objective experiments (like A/B tests) shows strong maturity."
      },
      {
        id: 2,
        question: "Tell me about a project you worked on that failed or fell significantly short of expectations. What went wrong, what did you learn, and how did you communicate it?",
        keywords: ['fail', 'learn', 'mistake', 'scope', 'timeline', 'estimation', 'communication', 'postmortem', 'retrospective', 'risk'],
        feedbackMatch: "Excellent transparency. Admitting project failures, holding blameless postmortems, and adjusting estimation scopes for future sprints are attributes of senior engineers.",
        feedbackGeneric: "Honest response. Failure is a great teacher. Highlighting clear communication with stakeholders early on, conducting a retrospective, and applying those learnings to future plans is highly valued."
      },
      {
        id: 3,
        question: "How do you prioritize your tasks when you are faced with multiple critical deadlines and competing priorities under pressure?",
        keywords: ['prioritize', 'matrix', 'eisenhower', 'impact', 'stakeholder', 'urgency', 'delegate', 'kanban', 'sprint', 'say no'],
        feedbackMatch: "Very practical. Using frameworks like the Eisenhower Matrix, grouping tasks by impact/effort, and aligning frequently with product managers ensures the highest business value is delivered first.",
        feedbackGeneric: "Good method. Setting expectations early, ranking tasks by immediate business impact, communicating blockers transparently, and avoiding context-switching are crucial under pressure."
      },
      {
        id: 4,
        question: "Tell me about a time you went above and beyond your standard role description to solve a problem or deliver a feature.",
        keywords: ['ownership', 'proactive', 'extra', 'night', 'documentation', 'refactor', 'test', 'help', 'mentor', 'initiative'],
        feedbackMatch: "Inspirational. Taking full ownership, initiating refactors for long-term health, and mentoring others without being asked demonstrates true leadership potential.",
        feedbackGeneric: "Excellent example of ownership. Stepping outside defined scopes to unblock the team, fix critical pipeline bugs, or document legacy systems shows high initiative and drive."
      }
    ]
  }
};
