// ================================================================
//  data.js — Shared data layer using localStorage
//  All pages import this first to get/set shared state
// ================================================================

const DB = {
  // ── Subjects ────────────────────────────────────────────────
  getSubjects() {
    const raw = localStorage.getItem('ccc_subjects');
    if (raw) return JSON.parse(raw);
    // Default 4 subjects
    const defaults = [
      { id: 'technical',   name: 'Technical',   desc: 'Core technical concepts & problem solving', icon: '⚙️',  color: 'blue',   builtIn: true },
      { id: 'aptitude',    name: 'Aptitude',    desc: 'Quantitative, logical & verbal reasoning',   icon: '🧠',  color: 'purple', builtIn: true },
      { id: 'interview',   name: 'Interview',   desc: 'HR questions, communication & soft skills',  icon: '🎤',  color: 'teal',   builtIn: true },
      { id: 'custom',      name: 'General',     desc: 'Custom & miscellaneous questions',            icon: '📚',  color: 'coral',  builtIn: false },
    ];
    localStorage.setItem('ccc_subjects', JSON.stringify(defaults));
    return defaults;
  },

  saveSubjects(subjects) {
    localStorage.setItem('ccc_subjects', JSON.stringify(subjects));
  },

  addSubject(subject) {
    const subjects = this.getSubjects();
    subject.id = 'subj_' + Date.now();
    subjects.push(subject);
    this.saveSubjects(subjects);
    return subject;
  },

  deleteSubject(id) {
    let subjects = this.getSubjects();
    subjects = subjects.filter(s => s.id !== id);
    this.saveSubjects(subjects);
    // Also remove questions for this subject
    let qs = this.getQuestions();
    qs = qs.filter(q => q.subjectId !== id);
    this.saveQuestions(qs);
  },

  // ── Questions ───────────────────────────────────────────────
  getQuestions() {
    const raw = localStorage.getItem('ccc_questions');
    if (raw) return JSON.parse(raw);
    // Seed default questions
    const defaults = [
      // TECHNICAL — Section A (MCQ)
      { id:'q1', subjectId:'technical', section:'A', text:'What does CPU stand for?', options:['Central Processing Unit','Computer Personal Unit','Central Program Utility','Core Processing Unit'], correct:0, marks:1 },
      { id:'q2', subjectId:'technical', section:'A', text:'Which data structure uses LIFO order?', options:['Queue','Stack','Linked List','Tree'], correct:1, marks:1 },
      { id:'q3', subjectId:'technical', section:'A', text:'What is the time complexity of binary search?', options:['O(n)','O(n²)','O(log n)','O(1)'], correct:2, marks:1 },
      { id:'q4', subjectId:'technical', section:'A', text:'Which protocol is used for sending email?', options:['FTP','HTTP','SMTP','TCP'], correct:2, marks:1 },
      { id:'q5', subjectId:'technical', section:'A', text:'What does OOP stand for?', options:['Object-Oriented Programming','Optimal Output Processing','Open Operational Protocol','Object Output Procedure'], correct:0, marks:1 },
      // TECHNICAL — Section B (Short)
      { id:'q6', subjectId:'technical', section:'B', text:'Define polymorphism in OOP and give one example.', options:[], correct:-1, marks:5 },
      { id:'q7', subjectId:'technical', section:'B', text:'Explain the difference between a process and a thread.', options:[], correct:-1, marks:5 },
      { id:'q8', subjectId:'technical', section:'B', text:'What is a deadlock? When does it occur?', options:[], correct:-1, marks:5 },
      // TECHNICAL — Section C (Long)
      { id:'q9',  subjectId:'technical', section:'C', text:'Explain the concept of normalization in databases. Discuss 1NF, 2NF, and 3NF with examples.', options:[], correct:-1, marks:15 },
      { id:'q10', subjectId:'technical', section:'C', text:'Describe the OSI model. Explain each layer and its role in network communication.', options:[], correct:-1, marks:15 },

      // APTITUDE — Section A (MCQ)
      { id:'q11', subjectId:'aptitude', section:'A', text:'If 3x + 7 = 22, what is x?', options:['3','4','5','6'], correct:2, marks:1 },
      { id:'q12', subjectId:'aptitude', section:'A', text:'A train travels 300 km in 5 hours. What is its speed?', options:['50 km/h','60 km/h','70 km/h','80 km/h'], correct:1, marks:1 },
      { id:'q13', subjectId:'aptitude', section:'A', text:'Which number comes next: 2, 4, 8, 16, __?', options:['24','28','32','36'], correct:2, marks:1 },
      { id:'q14', subjectId:'aptitude', section:'A', text:'If A is the mother of B, B is the sister of C, what is A to C?', options:['Sister','Aunt','Mother','Grandmother'], correct:2, marks:1 },
      { id:'q15', subjectId:'aptitude', section:'A', text:'Find the odd one out: Apple, Mango, Carrot, Banana', options:['Apple','Mango','Carrot','Banana'], correct:2, marks:1 },
      // APTITUDE — Section B
      { id:'q16', subjectId:'aptitude', section:'B', text:'A shopkeeper buys goods for ₹500 and sells them for ₹650. Calculate the profit percentage.', options:[], correct:-1, marks:5 },
      { id:'q17', subjectId:'aptitude', section:'B', text:'Two pipes fill a tank in 12 and 15 hours respectively. How long will they take together?', options:[], correct:-1, marks:5 },
      // APTITUDE — Section C
      { id:'q18', subjectId:'aptitude', section:'C', text:'A train passes a standing person in 10 seconds and a 200m platform in 30 seconds. Find the length and speed of the train. Show full working.', options:[], correct:-1, marks:15 },

      // INTERVIEW — Section A (MCQ)
      { id:'q19', subjectId:'interview', section:'A', text:'What is the best way to handle a conflict with a colleague at work?', options:['Ignore them','Report immediately to HR','Discuss calmly to find a mutual solution','Talk to other colleagues about it'], correct:2, marks:1 },
      { id:'q20', subjectId:'interview', section:'A', text:'Which of these is NOT a key element of effective communication?', options:['Active listening','Clear messaging','Interrupting frequently','Empathy'], correct:2, marks:1 },
      { id:'q21', subjectId:'interview', section:'A', text:'In STAR method, what does "A" stand for?', options:['Attitude','Action','Accuracy','Agenda'], correct:1, marks:1 },
      { id:'q22', subjectId:'interview', section:'A', text:'Which question type is typically asked in an HR interview?', options:['"What is recursion?"','"Tell me about yourself."','"Solve this algorithm."','"Write a SQL query."'], correct:1, marks:1 },
      // INTERVIEW — Section B
      { id:'q23', subjectId:'interview', section:'B', text:'Write a brief answer to "Why should we hire you?" (100 words max)', options:[], correct:-1, marks:5 },
      { id:'q24', subjectId:'interview', section:'B', text:'Describe a time you worked effectively under pressure. Use the STAR method.', options:[], correct:-1, marks:5 },
      // INTERVIEW — Section C
      { id:'q25', subjectId:'interview', section:'C', text:'You are asked "What are your greatest weaknesses?" in an interview. Write a professional and authentic response that turns this into an opportunity to showcase growth. (Minimum 150 words)', options:[], correct:-1, marks:15 },
    ];
    localStorage.setItem('ccc_questions', JSON.stringify(defaults));
    return defaults;
  },

  saveQuestions(qs) {
    localStorage.setItem('ccc_questions', JSON.stringify(qs));
  },

  addQuestion(q) {
    const qs = this.getQuestions();
    q.id = 'q_' + Date.now();
    qs.push(q);
    this.saveQuestions(qs);
    return q;
  },

  deleteQuestion(id) {
    let qs = this.getQuestions();
    qs = qs.filter(q => q.id !== id);
    this.saveQuestions(qs);
  },

  getQuestionsForSubject(subjectId) {
    return this.getQuestions().filter(q => q.subjectId === subjectId);
  },

  // ── Exams ────────────────────────────────────────────────────
  getExams() {
    const raw = localStorage.getItem('ccc_exams');
    return raw ? JSON.parse(raw) : [];
  },

  saveExams(exams) {
    localStorage.setItem('ccc_exams', JSON.stringify(exams));
  },

  createExam(config) {
    const exams = this.getExams();
    const exam = {
      id: 'exam_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      ...config,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };
    exams.unshift(exam);
    this.saveExams(exams);
    return exam;
  },

  getExamById(id) {
    return this.getExams().find(e => e.id === id);
  },

  incrementAttempt(examId) {
    const exams = this.getExams();
    const idx = exams.findIndex(e => e.id === examId);
    if (idx !== -1) { exams[idx].attempts = (exams[idx].attempts || 0) + 1; this.saveExams(exams); }
  },

  // ── Results ──────────────────────────────────────────────────
  getResults() {
    const raw = localStorage.getItem('ccc_results');
    return raw ? JSON.parse(raw) : [];
  },

  saveResult(result) {
    const results = this.getResults();
    result.id = 'res_' + Date.now();
    result.submittedAt = new Date().toISOString();
    results.unshift(result);
    localStorage.setItem('ccc_results', JSON.stringify(results));
    this.incrementAttempt(result.examId);
    return result;
  },

  clearResults() {
    localStorage.removeItem('ccc_results');
    // Reset attempt counts
    const exams = this.getExams();
    exams.forEach(e => e.attempts = 0);
    this.saveExams(exams);
  },
};

// Color helpers
const COLOR_MAP = {
  blue:   { wash: 'var(--blue-wash)',   accent: 'var(--accent-blue)',   cls: 'blue'   },
  teal:   { wash: 'var(--teal-wash)',   accent: 'var(--accent-teal)',   cls: 'teal'   },
  coral:  { wash: 'var(--coral-wash)',  accent: 'var(--accent-coral)',  cls: 'coral'  },
  purple: { wash: 'var(--purple-wash)', accent: 'var(--accent-purple)', cls: 'purple' },
  amber:  { wash: 'var(--amber-wash)',  accent: 'var(--accent-amber)',  cls: 'amber'  },
};

function getColor(color) { return COLOR_MAP[color] || COLOR_MAP.blue; }

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2,'0');
  const s = (seconds % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
