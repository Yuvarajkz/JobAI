// =======================================================
// CAREER COMMAND CENTRE - ADMIN PANEL
// FULLY FUNCTIONAL ADMIN.JS
// =======================================================

// =======================================================
// PAGE LOAD
// =======================================================

document.addEventListener("DOMContentLoaded", () => {

  loadTheme();

  loadSubjects();

  loadQuestionSubjects();

  loadExamSubjects();

  renderQuestions();

  renderResults();

  renderExamList();

  updateDashboardStats();

});

// =======================================================
// THEME
// =======================================================

function toggleTheme() {

  const html = document.documentElement;

  const current = html.dataset.theme;

  html.dataset.theme =
    current === "dark"
      ? "light"
      : "dark";

  localStorage.setItem(
    "ccc_theme",
    html.dataset.theme
  );

}

function loadTheme() {

  const saved =
    localStorage.getItem("ccc_theme");

  if (saved) {
    document.documentElement.dataset.theme =
      saved;
  }

}

// =======================================================
// ADMIN TABS
// =======================================================

function switchTab(tabName) {

  document
    .querySelectorAll(".tab-content")
    .forEach(tab => {
      tab.style.display = "none";
    });

  document
    .querySelectorAll(".admin-tab")
    .forEach(btn => {
      btn.classList.remove(
        "admin-tab--active"
      );
    });

  const activeTab =
    document.getElementById(
      "tab-" + tabName
    );

  if (activeTab) {
    activeTab.style.display = "block";
  }

  if (event && event.target) {
    event.target.classList.add(
      "admin-tab--active"
    );
  }

}

// =======================================================
// SUBJECTS
// =======================================================

function loadSubjects() {

  const subjects =
    DB.getSubjects();

  const container =
    document.getElementById(
      "adminSubjectList"
    );

  if (!container) return;

  container.innerHTML = "";

  subjects.forEach(subject => {

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:1rem;
        flex-wrap:wrap;
      ">

        <div>

          <h3 style="
            margin-bottom:8px;
            font-size:18px;
          ">
            ${subject.icon}
            ${subject.name}
          </h3>

          <p style="
            color:var(--text-secondary);
            font-size:13px;
          ">
            ${subject.desc}
          </p>

        </div>

        ${
          !subject.builtIn
            ? `
            <button
              class="btn btn--ghost"
              onclick="deleteSubject('${subject.id}')">
              Delete
            </button>
          `
            : `
            <span class="badge badge--blue">
              Default
            </span>
          `
        }

      </div>

    `;

    container.appendChild(card);

  });

}

function addSubject() {

  const name =
    document
      .getElementById("newSubjectName")
      .value
      .trim();

  const desc =
    document
      .getElementById("newSubjectDesc")
      .value
      .trim();

  const icon =
    document
      .getElementById("newSubjectIcon")
      .value
      .trim();

  const color =
    document
      .getElementById("newSubjectColor")
      .value;

  if (!name || !desc || !icon) {

    alert(
      "Please fill all subject fields"
    );

    return;

  }

  DB.addSubject({
    name,
    desc,
    icon,
    color,
    builtIn: false
  });

  document.getElementById(
    "newSubjectName"
  ).value = "";

  document.getElementById(
    "newSubjectDesc"
  ).value = "";

  document.getElementById(
    "newSubjectIcon"
  ).value = "";

  loadSubjects();

  loadQuestionSubjects();

  loadExamSubjects();

  updateDashboardStats();

  alert("Subject Added");

}

function deleteSubject(id) {

  const confirmDelete =
    confirm(
      "Delete subject and related questions?"
    );

  if (!confirmDelete) return;

  DB.deleteSubject(id);

  loadSubjects();

  renderQuestions();

  loadQuestionSubjects();

  loadExamSubjects();

  updateDashboardStats();

}

// =======================================================
// QUESTION SUBJECTS
// =======================================================

function loadQuestionSubjects() {

  const subjects =
    DB.getSubjects();

  const select =
    document.getElementById("qSubject");

  if (!select) return;

  select.innerHTML =
    subjects
      .map(subject => `
        <option value="${subject.id}">
          ${subject.name}
        </option>
      `)
      .join("");

}

// =======================================================
// SECTION CHANGE
// =======================================================

document.addEventListener(
  "change",
  e => {

    if (
      e.target.id === "qSection"
    ) {

      const section =
        e.target.value;

      const optionsArea =
        document.getElementById(
          "optionsArea"
        );

      if (!optionsArea) return;

      optionsArea.style.display =
        section === "A"
          ? "block"
          : "none";

    }

  }
);

// =======================================================
// ADD QUESTION
// =======================================================

function addQuestion() {

  const subjectId =
    document.getElementById(
      "qSubject"
    ).value;

  const section =
    document.getElementById(
      "qSection"
    ).value;

  const text =
    document.getElementById(
      "qText"
    ).value.trim();

  const marks =
    parseInt(
      document.getElementById(
        "qMarks"
      ).value
    );

  if (!text) {

    alert(
      "Please enter question text"
    );

    return;

  }

  let options = [];

  let correct = -1;

  // MCQ
  if (section === "A") {

    options = [

      document
        .getElementById("qOpt1")
        .value
        .trim(),

      document
        .getElementById("qOpt2")
        .value
        .trim(),

      document
        .getElementById("qOpt3")
        .value
        .trim(),

      document
        .getElementById("qOpt4")
        .value
        .trim()

    ];

    if (
      options.some(
        option => !option
      )
    ) {

      alert(
        "Fill all MCQ options"
      );

      return;

    }

    correct =
      parseInt(
        document.getElementById(
          "qCorrect"
        ).value
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

  clearQuestionForm();

  renderQuestions();

  updateDashboardStats();

  alert("Question Added");

}

function clearQuestionForm() {

  document.getElementById(
    "qText"
  ).value = "";

  [
    "qOpt1",
    "qOpt2",
    "qOpt3",
    "qOpt4"
  ].forEach(id => {

    const input =
      document.getElementById(id);

    if (input) {
      input.value = "";
    }

  });

}

// =======================================================
// RENDER QUESTIONS
// =======================================================

function renderQuestions() {

  const container =
    document.getElementById(
      "questionsBySubject"
    );

  if (!container) return;

  const subjects =
    DB.getSubjects();

  const questions =
    DB.getQuestions();

  container.innerHTML = "";

  subjects.forEach(subject => {

    const subjectQuestions =
      questions.filter(
        q =>
          q.subjectId ===
          subject.id
      );

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <div style="
        margin-bottom:1rem;
      ">

        <h2>
          ${subject.icon}
          ${subject.name}
        </h2>

        <p style="
          color:var(--text-secondary);
          font-size:13px;
        ">
          ${subjectQuestions.length}
          Questions
        </p>

      </div>

      ${
        subjectQuestions.length
          ? subjectQuestions
              .map(question => `

              <div style="
                border:1px solid var(--border-soft);
                padding:1rem;
                border-radius:14px;
                margin-bottom:1rem;
              ">

                <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:1rem;
                  flex-wrap:wrap;
                ">

                  <div style="flex:1;">

                    <h4 style="
                      margin-bottom:10px;
                    ">
                      ${question.text}
                    </h4>

                    <div style="
                      display:flex;
                      gap:.5rem;
                      flex-wrap:wrap;
                      margin-bottom:12px;
                    ">

                      <span class="badge badge--blue">
                        Section
                        ${question.section}
                      </span>

                      <span class="badge badge--purple">
                        ${question.marks}
                        Marks
                      </span>

                    </div>

                    ${
                      question.section === "A"
                        ? `
                        <div>
                          ${
                            question.options
                              .map(
                                (
                                  option,
                                  index
                                ) => `
                                <div style="
                                  padding:8px 12px;
                                  border-radius:10px;
                                  margin-bottom:6px;

                                  background:
                                  ${
                                    index ===
                                    question.correct
                                      ? "var(--teal-wash)"
                                      : "var(--bg-subtle)"
                                  };
                                ">
                                  ${String.fromCharCode(
                                    65 + index
                                  )}.
                                  ${option}
                                </div>
                              `
                              )
                              .join("")
                          }
                        </div>
                      `
                        : `
                        <p style="
                          color:var(--text-secondary);
                        ">
                          Written Answer Question
                        </p>
                      `
                    }

                  </div>

                  <button
                    class="btn btn--ghost"
                    onclick="deleteQuestion('${question.id}')">
                    Delete
                  </button>

                </div>

              </div>

            `)
              .join("")
          : `
            <p style="
              color:var(--text-secondary);
            ">
              No Questions Added
            </p>
          `
      }

    `;

    container.appendChild(card);

  });

}

function deleteQuestion(id) {

  const confirmDelete =
    confirm(
      "Delete question?"
    );

  if (!confirmDelete) return;

  DB.deleteQuestion(id);

  renderQuestions();

  updateDashboardStats();

}

// =======================================================
// EXAM SUBJECTS
// =======================================================

function loadExamSubjects() {

  const subjects =
    DB.getSubjects();

  const select =
    document.getElementById(
      "examSubject"
    );

  if (!select) return;

  select.innerHTML =
    subjects
      .map(subject => `
        <option value="${subject.id}">
          ${subject.name}
        </option>
      `)
      .join("");

}

// =======================================================
// CREATE EXAM
// =======================================================

function createExamLink() {

  const title =
    document.getElementById(
      "examTitle"
    ).value.trim();

  const subjectId =
    document.getElementById(
      "examSubject"
    ).value;

  const duration =
    parseInt(
      document.getElementById(
        "examDuration"
      ).value
    );

  const instructions =
    document.getElementById(
      "examInstructions"
    ).value.trim();

  const showResult =
    document.getElementById(
      "examShowResult"
    ).checked;

  if (!title) {

    alert(
      "Please enter exam title"
    );

    return;

  }

  const exam =
    DB.createExam({

      title,

      subjectId,

      duration,

      instructions,

      showResult

    });

  const examLink =
    `${window.location.origin}${window.location.pathname.replace(
      "practice-admin.html",
      ""
    )}practice-exam.html?id=${exam.id}`;

  navigator.clipboard.writeText(
    examLink
  );

  const resultBox =
    document.getElementById(
      "generatedExamLink"
    );

  if (resultBox) {

    resultBox.innerHTML = `

      <div class="card">

        <h3 style="
          margin-bottom:1rem;
        ">
          Exam Link Generated
        </h3>

        <input
          type="text"
          readonly
          value="${examLink}"
          class="form-input"
        />

        <div style="
          margin-top:1rem;
          display:flex;
          gap:1rem;
          flex-wrap:wrap;
        ">

          <button
            class="btn btn--primary"
            onclick="window.open('${examLink}')">
            Open Exam
          </button>

          <button
            class="btn btn--ghost"
            onclick="navigator.clipboard.writeText('${examLink}')">
            Copy Again
          </button>

        </div>

      </div>

    `;

  }

  renderExamList();

  updateDashboardStats();

  alert(
    "Exam Link Copied"
  );

}

// =======================================================
// EXAM LIST
// =======================================================

function renderExamList() {

  const container =
    document.getElementById(
      "examList"
    );

  if (!container) return;

  const exams =
    DB.getExams();

  container.innerHTML = "";

  if (!exams.length) {

    container.innerHTML = `
      <div class="card">
        <p>No Exams Created</p>
      </div>
    `;

    return;

  }

  exams.forEach(exam => {

    const subjectName =
      DB.getSubjectName(
        exam.subjectId
      );

    const card =
      document.createElement("div");

    card.className = "card";

    const link =
      `${window.location.origin}${window.location.pathname.replace(
        "practice-admin.html",
        ""
      )}practice-exam.html?id=${exam.id}`;

    card.innerHTML = `

      <div style="
        display:flex;
        justify-content:space-between;
        gap:1rem;
        flex-wrap:wrap;
      ">

        <div>

          <h3 style="
            margin-bottom:8px;
          ">
            ${exam.title}
          </h3>

          <p style="
            color:var(--text-secondary);
            font-size:13px;
          ">
            ${subjectName}
          </p>

          <div style="
            margin-top:10px;
            display:flex;
            gap:.5rem;
            flex-wrap:wrap;
          ">

            <span class="badge badge--blue">
              ${exam.duration}
              mins
            </span>

            <span class="badge badge--teal">
              Attempts:
              ${exam.attempts}
            </span>

          </div>

        </div>

        <div style="
          display:flex;
          gap:.5rem;
          flex-wrap:wrap;
        ">

          <button
            class="btn btn--primary"
            onclick="window.open('${link}')">
            Open
          </button>

          <button
            class="btn btn--ghost"
            onclick="deleteExam('${exam.id}')">
            Delete
          </button>

        </div>

      </div>

    `;

    container.appendChild(card);

  });

}

function deleteExam(id) {

  const confirmDelete =
    confirm(
      "Delete exam?"
    );

  if (!confirmDelete) return;

  DB.deleteExam(id);

  renderExamList();

  updateDashboardStats();

}

// =======================================================
// RESULTS
// =======================================================

function renderResults() {

  const results =
    DB.getResults();

  const container =
    document.getElementById(
      "resultsContainer"
    );

  if (!container) return;

  container.innerHTML = "";

  if (!results.length) {

    container.innerHTML = `
      <div class="card">
        <p>No Results Yet</p>
      </div>
    `;

    return;

  }

  results.forEach(result => {

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <div style="
        display:flex;
        justify-content:space-between;
        gap:1rem;
        flex-wrap:wrap;
      ">

        <div>

          <h3 style="
            margin-bottom:6px;
          ">
            ${result.studentName}
          </h3>

          <p style="
            color:var(--text-secondary);
            font-size:13px;
          ">
            ${formatDate(
              result.submittedAt
            )}
          </p>

        </div>

        <div>

          <span class="badge badge--teal">
            ${result.score}%
          </span>

        </div>

      </div>

      <div style="
        margin-top:1rem;
        display:flex;
        gap:.5rem;
        flex-wrap:wrap;
      ">

        <span class="badge badge--blue">
          Correct:
          ${result.correctAnswers}
        </span>

        <span class="badge badge--purple">
          Total Marks:
          ${result.totalMarks}
        </span>

      </div>

    `;

    container.appendChild(card);

  });

}

// =======================================================
// DASHBOARD STATS
// =======================================================

function updateDashboardStats() {

  const subjects =
    DB.getSubjects();

  const questions =
    DB.getQuestions();

  const exams =
    DB.getExams();

  const results =
    DB.getResults();

  const setText = (
    id,
    value
  ) => {

    const el =
      document.getElementById(id);

    if (el) {
      el.innerText = value;
    }

  };

  setText(
    "totalSubjects",
    subjects.length
  );

  setText(
    "totalQuestions",
    questions.length
  );

  setText(
    "totalExams",
    exams.length
  );

  setText(
    "totalResults",
    results.length
  );

}