// =======================================================
// Career Command Centre - Main App Logic
// =======================================================

// ---------------- THEME ----------------
function toggleTheme() {
  const html = document.documentElement;
  const current = html.dataset.theme;

  html.dataset.theme = current === "dark" ? "light" : "dark";

  localStorage.setItem("ccc_theme", html.dataset.theme);
}

(function loadTheme() {
  const saved = localStorage.getItem("ccc_theme");
  if (saved) {
    document.documentElement.dataset.theme = saved;
  }
})();

// ---------------- LOAD DASHBOARD ----------------
document.addEventListener("DOMContentLoaded", () => {
  loadSubjects();
  loadExamTable();
  updateStats();

  if (document.getElementById("adminSubjectList")) {
    renderAdminSubjects();
    populateSubjectDropdowns();
    renderQuestions();
    renderResults();
  }
});

// ---------------- SUBJECTS ----------------
function loadSubjects() {
  const grid = document.getElementById("subjectGrid");
  if (!grid) return;

  const subjects = DB.getSubjects();

  grid.innerHTML = "";

  subjects.forEach(subject => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card__top">
        <div class="card__icon-wrap card__icon-wrap--${subject.color}">
          <span style="font-size:20px">${subject.icon}</span>
        </div>
        <div>
          <div class="card__title">${subject.name}</div>
          <div class="card__caption">${subject.desc}</div>
        </div>
      </div>

      <div class="card__actions">
        <button class="btn btn--primary" onclick="openSubject('${subject.id}')">
          Open
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  document.getElementById("totalSubjects").innerText = subjects.length;
}

function openSubject(id) {
  location.href = "admin.html";
}

// ---------------- ADMIN SUBJECTS ----------------
function addSubject() {
  const name = document.getElementById("newSubjectName").value.trim();
  const desc = document.getElementById("newSubjectDesc").value.trim();
  const icon = document.getElementById("newSubjectIcon").value.trim();
  const color = document.getElementById("newSubjectColor").value;

  if (!name || !desc || !icon) {
    alert("Please fill all fields");
    return;
  }

  DB.addSubject({
    name,
    desc,
    icon,
    color
  });

  alert("Subject Added");

  renderAdminSubjects();
  loadSubjects();
  populateSubjectDropdowns();
}

function renderAdminSubjects() {
  const list = document.getElementById("adminSubjectList");
  if (!list) return;

  const subjects = DB.getSubjects();

  list.innerHTML = "";

  subjects.forEach(subject => {
    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3>${subject.icon} ${subject.name}</h3>
          <p>${subject.desc}</p>
        </div>

        ${
          !subject.builtIn
            ? `<button class="btn btn--ghost"
                onclick="deleteSubject('${subject.id}')">
                Delete
              </button>`
            : ""
        }
      </div>
    `;

    list.appendChild(div);
  });
}

function deleteSubject(id) {
  if (confirm("Delete this subject?")) {
    DB.deleteSubject(id);

    renderAdminSubjects();
    loadSubjects();
    populateSubjectDropdowns();
  }
}

// ---------------- DROPDOWNS ----------------
function populateSubjectDropdowns() {
  const subjects = DB.getSubjects();

  const qSubject = document.getElementById("qSubject");
  const examSubject = document.getElementById("examSubject");

  if (qSubject) {
    qSubject.innerHTML = subjects
      .map(
        s => `<option value="${s.id}">${s.name}</option>`
      )
      .join("");
  }

  if (examSubject) {
    examSubject.innerHTML = subjects
      .map(
        s => `<option value="${s.id}">${s.name}</option>`
      )
      .join("");
  }
}

// ---------------- QUESTIONS ----------------
function addQuestion() {
  const subjectId = document.getElementById("qSubject").value;
  const section = document.getElementById("qSection").value;
  const text = document.getElementById("qText").value.trim();

  const marks = parseInt(
    document.getElementById("qMarks").value
  );

  if (!text) {
    alert("Enter question");
    return;
  }

  let options = [];
  let correct = -1;

  if (section === "A") {
    options = [
      document.getElementById("qOpt1").value,
      document.getElementById("qOpt2").value,
      document.getElementById("qOpt3").value,
      document.getElementById("qOpt4").value
    ];

    correct = parseInt(
      document.getElementById("qCorrect").value
    );
  }

  DB.addQuestion({
    subjectId,
    section,
    text,
    options,
    correct,
    marks
  });

  alert("Question Added");

  renderQuestions();
}

function renderQuestions() {
  const container =
    document.getElementById("questionsBySubject");

  if (!container) return;

  const subjects = DB.getSubjects();
  const questions = DB.getQuestions();

  container.innerHTML = "";

  subjects.forEach(subject => {
    const subjectQuestions = questions.filter(
      q => q.subjectId === subject.id
    );

    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `
      <h2>${subject.icon} ${subject.name}</h2>
      <p>${subjectQuestions.length} Questions</p>

      <div style="margin-top:1rem;">
        ${subjectQuestions
          .map(
            q => `
          <div style="padding:10px;border:1px solid #ccc;border-radius:10px;margin-bottom:10px;">
            <strong>${q.text}</strong>
            <p>Section ${q.section} · ${q.marks} marks</p>

            <button class="btn btn--ghost"
              onclick="deleteQuestion('${q.id}')">
              Delete
            </button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    container.appendChild(div);
  });
}

function deleteQuestion(id) {
  DB.deleteQuestion(id);

  renderQuestions();
}

// ---------------- EXAMS ----------------
function createExam() {
  const title =
    document.getElementById("examTitle").value;

  const subjectId =
    document.getElementById("examSubject").value;

  const duration =
    document.getElementById("examDuration").value;

  const instructions =
    document.getElementById("examInstructions").value;

  const showResult =
    document.getElementById("examShowResult").checked;

  if (!title) {
    alert("Enter exam title");
    return;
  }

  const exam = DB.createExam({
    title,
    subjectId,
    duration,
    instructions,
    showResult
  });

  const link =
    `${location.origin}${location.pathname.replace("admin.html", "")}exam.html?id=${exam.id}`;

  navigator.clipboard.writeText(link);

  alert("Exam Link Copied:\n" + link);

  loadExamTable();
  updateStats();
}

// ---------------- EXAM TABLE ----------------
function loadExamTable() {
  const wrap = document.getElementById("examTableWrap");

  if (!wrap) return;

  const exams = DB.getExams();

  if (!exams.length) return;

  wrap.innerHTML = `
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:12px;">Title</th>
          <th>Attempts</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        ${exams
          .map(
            exam => `
          <tr>
            <td style="padding:12px;">${exam.title}</td>
            <td>${exam.attempts || 0}</td>

            <td>
              <a class="btn btn--primary"
                href="exam.html?id=${exam.id}">
                Open
              </a>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  document.getElementById(
    "examCount"
  ).innerText = `${exams.length} exams`;
}

// ---------------- RESULTS ----------------
function renderResults() {
  console.log(DB.getResults());
}

// ---------------- STATS ----------------
function updateStats() {
  const exams = DB.getExams();

  let attempts = 0;

  exams.forEach(e => {
    attempts += e.attempts || 0;
  });

  const totalExams =
    document.getElementById("totalExams");

  const totalAttempts =
    document.getElementById("totalAttempts");

  if (totalExams)
    totalExams.innerText = exams.length;

  if (totalAttempts)
    totalAttempts.innerText = attempts;
}

// ---------------- ADMIN TABS ----------------
function switchTab(tab) {
  document
    .querySelectorAll(".tab-content")
    .forEach(el => {
      el.style.display = "none";
    });

  document
    .querySelectorAll(".admin-tab")
    .forEach(el => {
      el.classList.remove("admin-tab--active");
    });

  document.getElementById(
    "tab-" + tab
  ).style.display = "block";

  event.target.classList.add("admin-tab--active");
}