// JobPrep AI — Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dynamic date in footer
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // --- Session & Dashboard Stats Manager ---
  initDashboardStats();

  // --- Theme Toggle Manager ---
  initThemeToggle();

  // --- Mobile Drawer Manager ---
  initMobileDrawer();

  // --- User Profile Dropdown Manager ---
  initUserDropdown();

  // --- Resume Dropzone Manager ---
  initResumeDropzone();

  // --- Skills Tracker Manager ---
  initSkillsTracker();

  // --- Tips Carousel Manager ---
  initTipsCarousel();

  // --- AI Mock Interview Chat Manager ---
  initMockInterview();
});

// ==========================================
// 1. Theme Toggle Management
// ==========================================
function initThemeToggle() {
  const toggleBtn = document.getElementById('toggleMode');
  if (!toggleBtn) return;

  // Toggle theme click handler
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Animate toggler thumb and trigger state updates
    updateThemeToggleIcons(newTheme);
  });

  // Sync initial button icon state
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeToggleIcons(initialTheme);
}

function updateThemeToggleIcons(theme) {
  const toggleBtn = document.getElementById('toggleMode');
  if (!toggleBtn) return;
  
  if (theme === 'dark') {
    toggleBtn.setAttribute('aria-label', 'Switch to light colour theme');
  } else {
    toggleBtn.setAttribute('aria-label', 'Switch to dark colour theme');
  }
}

// ==========================================
// 2. Mobile Drawer Management
// ==========================================
function initMobileDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    drawer.hidden = isExpanded;
  });

  // Close drawer if user clicks on a link
  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
    });
  });
}

// ==========================================
// 3. User Session and Dropdown Management
// ==========================================
function initUserDropdown() {
  const authLinks = document.getElementById('authLinks');
  const userMenu = document.getElementById('userMenu');
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  const userAvatar = document.getElementById('userAvatar');
  const dropdownName = document.getElementById('dropdownName');
  const dropdownEmail = document.getElementById('dropdownEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  // Toggle user dropdown on avatar click
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = userMenuBtn.getAttribute('aria-expanded') === 'true';
      userMenuBtn.setAttribute('aria-expanded', !isExpanded);
      userDropdown.hidden = isExpanded;
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
      userMenuBtn.setAttribute('aria-expanded', 'false');
      userDropdown.hidden = true;
    });
  }

  if (typeof isFirebaseAvailable !== 'undefined' && isFirebaseAvailable && auth) {
    // Logout click event
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userStats');
          localStorage.removeItem('userSkills');
          window.location.reload();
        }).catch((error) => {
          alert(error.message);
        });
      });
    }

    // Monitor Firebase Authentication State Changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        const displayName = user.displayName || "Firebase User";
        const parts = displayName.split(" ");
        const firstName = parts[0] || "Firebase";
        const lastName = parts.slice(1).join(" ") || "User";
        
        // Reset statistics if switching to a new user to start from scratch
        const cachedUserStr = localStorage.getItem('currentUser');
        let isNewUser = false;
        if (cachedUserStr) {
          try {
            const cachedUser = JSON.parse(cachedUserStr);
            if (cachedUser.email !== user.email) {
              isNewUser = true;
            }
          } catch(e) {
            isNewUser = true;
          }
        } else {
          isNewUser = true;
        }

        if (isNewUser) {
          localStorage.removeItem('userStats');
          localStorage.removeItem('userSkills');
          localStorage.removeItem('atsResumeData');
          // Reset UI views
          const uploadZone = document.getElementById('uploadZone');
          const uploadResult = document.getElementById('uploadResult');
          if (uploadZone) uploadZone.hidden = false;
          if (uploadResult) uploadResult.hidden = true;
          // Re-initialize lists
          initDashboardStats();
          initSkillsTracker();
        }

        const sessionUser = {
          firstName: firstName,
          lastName: lastName,
          email: user.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';

        const initials = (firstName[0] + (lastName[0] || '')).toUpperCase();
        if (userAvatar) userAvatar.textContent = initials;
        if (dropdownName) dropdownName.textContent = displayName;
        if (dropdownEmail) dropdownEmail.textContent = user.email;
      } else {
        // User is logged out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userStats');
        localStorage.removeItem('userSkills');
        if (authLinks) authLinks.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
      }
    });
  } else {
    // Fallback Mock Dropdown Management
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const user = JSON.parse(currentUserStr);
      if (authLinks) authLinks.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';

      const initials = ((user.firstName || 'J')[0] + (user.lastName || 'D')[0]).toUpperCase();
      if (userAvatar) userAvatar.textContent = initials;
      if (dropdownName) dropdownName.textContent = `${user.firstName} ${user.lastName} (Mock)`;
      if (dropdownEmail) dropdownEmail.textContent = user.email;
    } else {
      if (authLinks) authLinks.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }

    // Logout click event
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userStats');
        localStorage.removeItem('userSkills');
        window.location.reload();
      });
    }
  }
}

// ==========================================
// 4. Resume Analyser & File Dropzone
// ==========================================
function initResumeDropzone() {
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('resumeUpload');
  const uploadResult = document.getElementById('uploadResult');
  const fileNameSpan = document.getElementById('fileName');

  if (!uploadZone || !fileInput || !uploadResult) return;

  // Restore saved resume analytics on page reload
  const savedDataStr = localStorage.getItem('atsResumeData');
  if (savedDataStr) {
    try {
      const data = JSON.parse(savedDataStr);
      uploadZone.hidden = true;
      uploadResult.hidden = false;
      if (fileNameSpan) fileNameSpan.textContent = data.fileName;
      lastAtsReportHtml = data.reportHtml;
      // Animate score rings after a tiny delay to allow layout
      setTimeout(() => {
        animateScoreRings(data.ats, data.keywords, data.clarity);
      }, 100);
    } catch(e) {
      console.error("Failed to restore ATS data", e);
    }
  }

  // Add drag & drop classes
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadZone.classList.add('dropzone--drag');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dropzone--drag');
    }, false);
  });

  // Handle drop
  uploadZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      handleResumeFile(files[0]);
    }
  });

  // Handle file select via click
  fileInput.addEventListener('change', (e) => {
    if (fileInput.files.length) {
      handleResumeFile(fileInput.files[0]);
    }
  });
}

let lastAtsReportHtml = "";

function generateAtsReport(fileName, ats, keywords, clarity) {
  // Extract file extension and base name
  const ext = fileName.substring(fileName.lastIndexOf('.')).toUpperCase();
  const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
  
  // Decide keywords to suggest based on name or random
  const allPossibleKeywords = ["Docker", "Kubernetes", "TypeScript", "CI/CD Pipelines", "React", "Node.js", "Redis", "AWS Cloud", "NoSQL Databases", "Unit Testing", "System Design", "Microservices"];
  // Randomly select 3 missing keywords
  const shuffled = allPossibleKeywords.sort(() => 0.5 - Math.random());
  const missingKeywords = shuffled.slice(0, 3);
  const foundKeywords = shuffled.slice(3, 8);

  const clarityIssues = clarity < 85 
    ? [
        "Simplify dense paragraphs in the 'Experience' section. Bullet points should not exceed 2 lines.",
        "Ensure dates are formatted consistently (e.g. 'MM/YYYY' or 'Month YYYY')."
      ]
    : [
        "Great paragraph spacing and margins detected.",
        "Clear hierarchy of headings (H1/H2 font sizes are well balanced)."
      ];

  const parsingPreviewText = `
[CONTACT INFO]
Name: ${baseName}
Email: parsed-email@gmail.com
Phone: +1 (555) 019-2834

[EXPERIENCE]
Role: Software Engineer
Highlights: Built microservices, optimized database queries, collaborated with front-end teams.

[SKILLS]
Tech: ${foundKeywords.join(", ")}
  `.trim();

  lastAtsReportHtml = `
    <div class="report-section">
      <div class="report-section__title report-section__title--info">
        <span>📄 File Diagnostic Summary</span>
      </div>
      <p>File Analysed: <strong>${fileName}</strong> (${ext} Format)</p>
      <p>Overall Compatibility Status: ${ats >= 80 ? '<span class="badge badge--teal" style="font-size:10px; margin-left:6px;">Highly Compatible</span>' : '<span class="badge badge--coral" style="font-size:10px; margin-left:6px;">Requires Edits</span>'}</p>
    </div>

    <div class="report-section">
      <div class="report-section__title ${keywords >= 75 ? 'report-section__title--success' : 'report-section__title--warning'}">
        <span>🔑 Keywords & Skills Optimization</span>
      </div>
      <p>Your resume matches standard job listings for your target roles at <strong>${keywords}%</strong>.</p>
      <div style="margin-top: 8px;">
        <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">Skills Found:</span>
        <div class="report-badge-container" style="margin-top:4px;">
          ${foundKeywords.map(k => `<span class="badge badge--blue" style="font-size:10px;">${k}</span>`).join('')}
        </div>
      </div>
      <div style="margin-top: 10px;">
        <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">⚠️ Highly Recommended Missing Keywords:</span>
        <div class="report-badge-container" style="margin-top:4px;">
          ${missingKeywords.map(k => `<span class="badge badge--coral" style="font-size:10px;">+ ${k}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="report-section">
      <div class="report-section__title report-section__title--success">
        <span>📏 Format & Clarity Checks</span>
      </div>
      <ul class="report-list">
        <li><strong>Single-column template</strong> parsed successfully (best for ATS).</li>
        <li>No tables, textboxes, or headers/footers containing critical info detected.</li>
        ${clarityIssues.map(issue => `<li>${issue}</li>`).join('')}
      </ul>
    </div>

    <div class="report-section">
      <div class="report-section__title report-section__title--info">
        <span>🤖 ATS Parsing Text Preview</span>
      </div>
      <p style="font-size:12px; margin-bottom: 6px;">This is exactly how recruitment machines read your headings and details:</p>
      <div class="report-preview">${parsingPreviewText}</div>
    </div>
  `;
}

window.openAtsModal = function() {
  const modal = document.getElementById('atsModal');
  const body = document.getElementById('atsReportBody');
  if (modal && body) {
    body.innerHTML = lastAtsReportHtml || `
      <div style="text-align:center; padding: 20px;">
        <p style="color:var(--text-secondary);">No resume data parsed yet. Please upload your resume on the dashboard first.</p>
      </div>
    `;
    modal.hidden = false;
  }
};

window.closeAtsModal = function() {
  const modal = document.getElementById('atsModal');
  if (modal) {
    modal.hidden = true;
  }
};

function handleResumeFile(file) {
  const uploadZone = document.getElementById('uploadZone');
  const uploadResult = document.getElementById('uploadResult');
  const fileNameSpan = document.getElementById('fileName');

  if (!file) return;

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("File size exceeds 5MB limit.");
    return;
  }

  // Validate extension
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    alert("Unsupported file format. Please upload PDF, DOC, or DOCX.");
    return;
  }

  // Show simulated analyzer loading state
  const dropzoneBody = uploadZone.querySelector('.dropzone__body');
  const originalBodyHtml = dropzoneBody.innerHTML;
  
  dropzoneBody.innerHTML = `
    <div class="typing-indicator" style="justify-content: center; margin-bottom: 8px;">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
    <p class="dropzone__label">Parsing resumes through AI model...</p>
    <p class="dropzone__hint">Extracting skills, formats & alignments</p>
  `;

  setTimeout(() => {
    // Restore dropzone state
    dropzoneBody.innerHTML = originalBodyHtml;
    uploadZone.hidden = true;
    
    // Generate simulated scores
    const atsScore = Math.floor(70 + Math.random() * 25);
    const keywordsScore = Math.floor(60 + Math.random() * 35);
    const clarityScore = Math.floor(75 + Math.random() * 20);

    if (fileNameSpan) fileNameSpan.textContent = file.name;
    uploadResult.hidden = false;

    // Animate score rings
    animateScoreRings(atsScore, keywordsScore, clarityScore);
    
    // Generate diagnostic HTML report
    generateAtsReport(file.name, atsScore, keywordsScore, clarityScore);
    
    // Save to local storage
    localStorage.setItem('atsResumeData', JSON.stringify({
      fileName: file.name,
      ats: atsScore,
      keywords: keywordsScore,
      clarity: clarityScore,
      reportHtml: lastAtsReportHtml
    }));

    // Increment progress stats
    incrementQuestionCount(3);
    
    // Append AI notification inside mock interview box if active
    appendAiMessage("System Notification", "🔍 AI Resume Analyser completed! ATS score: " + atsScore + "/100. Keywords match rate: " + keywordsScore + "%. Try mentioning these numbers in your mock interview answers!", true);
  }, 1800);
}

window.resetResume = function() {
  const uploadZone = document.getElementById('uploadZone');
  const uploadResult = document.getElementById('uploadResult');
  const fileInput = document.getElementById('resumeUpload');
  
  localStorage.removeItem('atsResumeData');
  lastAtsReportHtml = "";
  
  if (uploadZone) uploadZone.hidden = false;
  if (uploadResult) uploadResult.hidden = true;
  if (fileInput) fileInput.value = ""; // Reset input file value
};

function animateScoreRings(ats, keywords, clarity) {
  const scoreRings = document.querySelectorAll('.score-ring');
  if (scoreRings.length < 3) return;

  const circumference = 113.1;

  const scores = [ats, keywords, clarity];
  
  scoreRings.forEach((ring, idx) => {
    const scoreVal = scores[idx];
    const numEl = ring.querySelector('.score-ring__num');
    const fillEl = ring.querySelector('.score-ring__fill');
    
    if (numEl) numEl.textContent = scoreVal;
    if (fillEl) {
      const offset = circumference * (1 - scoreVal / 100);
      // Wait for DOM layout, then transition
      setTimeout(() => {
        fillEl.style.strokeDashoffset = offset;
      }, 50);
    }
  });
}

// ==========================================
// 5. Skills Tracker & Progress Engine
// ==========================================
function initSkillsTracker() {
  let skills = localStorage.getItem('userSkills');
  if (!skills) {
    skills = JSON.stringify(JobPrepData.defaultSkills);
    localStorage.setItem('userSkills', skills);
  }
  renderSkillsUI();
}

function renderSkillsUI() {
  const skillsStr = localStorage.getItem('userSkills');
  if (!skillsStr) return;
  const skills = JSON.parse(skillsStr);

  skills.forEach(skill => {
    const pctEl = document.getElementById(`skill${skill.id}Pct`);
    const barEl = document.getElementById(`skill${skill.id}Bar`);
    const trackEl = barEl ? barEl.parentElement : null;
    
    if (pctEl) pctEl.textContent = `${skill.value}%`;
    if (barEl) barEl.style.width = `${skill.value}%`;
    if (trackEl) {
      trackEl.setAttribute('aria-valuenow', skill.value);
      trackEl.setAttribute('aria-label', `${skill.name} ${skill.value}%`);
    }
  });
}

// Global action to simulate progress training session
window.improveSkill = function() {
  const skillsStr = localStorage.getItem('userSkills');
  if (!skillsStr) return;
  let skills = JSON.parse(skillsStr);

  // Pick a random skill to improve
  const randomIndex = Math.floor(Math.random() * skills.length);
  const selectedSkill = skills[randomIndex];
  
  if (selectedSkill.value >= 100) {
    alert(`Wow! You already have 100% mastery in ${selectedSkill.name}. Reset skills or work on another.`);
    return;
  }

  const increment = Math.floor(5 + Math.random() * 12);
  const oldVal = selectedSkill.value;
  selectedSkill.value = Math.min(100, oldVal + increment);

  localStorage.setItem('userSkills', JSON.stringify(skills));
  renderSkillsUI();

  // Stats updates
  incrementSessionCount();
  
  // Push live logs into chat
  appendAiMessage(
    "JobPrep AI Coach", 
    `⚡ **Skill Boost!** Answering questions helped you sharpen **${selectedSkill.name}** from ${oldVal}% to ${selectedSkill.value}% (+${selectedSkill.value - oldVal}%). Keep up the momentum!`
  );
};

// Global action to reset skills values
window.resetSkills = function() {
  if (confirm("Are you sure you want to reset your skill levels to default baseline levels?")) {
    localStorage.setItem('userSkills', JSON.stringify(JobPrepData.defaultSkills));
    renderSkillsUI();
  }
};

// ==========================================
// 6. Tips Carousel Manager
// ==========================================
let currentTipIndex = 0;
let tipInterval = null;

function initTipsCarousel() {
  const container = document.getElementById('tipsCarousel');
  const dotsContainer = document.getElementById('tipDots');
  if (!container || !dotsContainer) return;

  // Clear static html and render dynamically from data.js
  container.innerHTML = '';
  dotsContainer.innerHTML = '';

  JobPrepData.tips.forEach((tip, idx) => {
    const tipDiv = document.createElement('div');
    tipDiv.className = `tip ${idx === 0 ? 'tip--active' : ''}`;
    tipDiv.setAttribute('role', 'article');
    tipDiv.innerHTML = `
      <div class="tip__num" aria-hidden="true">${tip.num}</div>
      <p class="tip__text">${tip.text}</p>
      <span class="badge badge--${tip.badgeClass}">${tip.badgeText}</span>
    `;
    container.appendChild(tipDiv);

    const dotBtn = document.createElement('button');
    dotBtn.className = `dot ${idx === 0 ? 'dot--active' : ''}`;
    dotBtn.setAttribute('aria-label', `Go to tip ${idx + 1}`);
    dotBtn.setAttribute('role', 'tab');
    dotBtn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    dotBtn.addEventListener('click', () => {
      goToTip(idx);
      resetTipTimer();
    });
    dotsContainer.appendChild(dotBtn);
  });

  startTipTimer();
}

function showTip(index) {
  const tips = document.querySelectorAll('#tipsCarousel .tip');
  const dots = document.querySelectorAll('#tipDots .dot');
  if (!tips.length || !dots.length) return;

  // Clamp indices
  if (index >= tips.length) index = 0;
  if (index < 0) index = tips.length - 1;

  currentTipIndex = index;

  tips.forEach((tip, idx) => {
    if (idx === index) {
      tip.classList.add('tip--active');
    } else {
      tip.classList.remove('tip--active');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === index) {
      dot.classList.add('dot--active');
      dot.setAttribute('aria-selected', 'true');
    } else {
      dot.classList.remove('dot--active');
      dot.setAttribute('aria-selected', 'false');
    }
  });
}

window.prevTip = function() {
  showTip(currentTipIndex - 1);
  resetTipTimer();
};

window.nextTip = function() {
  showTip(currentTipIndex + 1);
  resetTipTimer();
};

function startTipTimer() {
  if (tipInterval) clearInterval(tipInterval);
  tipInterval = setInterval(() => {
    showTip(currentTipIndex + 1);
  }, 8000);
}

function resetTipTimer() {
  clearInterval(tipInterval);
  startTipTimer();
}

// ==========================================
// 7. Conversational AI Interview Coach
// ==========================================
let activeTrack = 'tech';
let currentQuestionIndex = 0;
let userAnswersLog = [];

function initMockInterview() {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;

  // Render initial bot welcome
  restartInterview();
}

window.setMode = function(mode) {
  if (activeTrack === mode) return;
  activeTrack = mode;

  // Update navbar selection indicators
  const techBtn = document.getElementById('modeTech');
  const behavBtn = document.getElementById('modeBehav');
  
  if (mode === 'tech') {
    techBtn.classList.add('mode-btn--active');
    techBtn.setAttribute('aria-pressed', 'true');
    behavBtn.classList.remove('mode-btn--active');
    behavBtn.setAttribute('aria-pressed', 'false');
  } else {
    behavBtn.classList.add('mode-btn--active');
    behavBtn.setAttribute('aria-pressed', 'true');
    techBtn.classList.remove('mode-btn--active');
    techBtn.setAttribute('aria-pressed', 'false');
  }

  restartInterview();
};

function restartInterview() {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
  
  chatBox.innerHTML = '';
  currentQuestionIndex = 0;
  userAnswersLog = [];

  const welcomeText = activeTrack === 'tech'
    ? "Hello! I am your JobPrep Technical Interviewer. I will assess your core engineering skills, data structures knowledge, and system designs. Are you ready to begin? Press the suggestions or tell me your goals!"
    : "Hello! I am your Behavioural Interview Coach. We will go through standard STAR scenarios to evaluate your communication, conflicts handling, and task prioritization. Are you ready?";

  appendAiMessage("AI Coach", welcomeText);
  updateChatSuggestions();
}

function updateChatSuggestions() {
  const suggsContainer = document.getElementById('chatSuggestions');
  if (!suggsContainer) return;

  suggsContainer.innerHTML = '';

  const defaultSuggestions = activeTrack === 'tech'
    ? [
        "Let's start! Ask the first technical question.",
        "I want to focus on System Design today.",
        "Skip introduction →"
      ]
    : [
        "Let's start! Ask the first behavioural question.",
        "I'm prepping for a Senior role.",
        "Skip introduction →"
      ];

  // If we are actively in questions
  const activeQuestions = JobPrepData.interviewQuestions[activeTrack];
  if (currentQuestionIndex > 0 && currentQuestionIndex <= activeQuestions.length) {
    // Provide specific helper phrases
    suggsContainer.innerHTML = `
      <button class="suggestion" onclick="useSuggestion(this)">Could you explain that concept in more detail?</button>
      <button class="suggestion" onclick="useSuggestion(this)">I would approach this by listing key requirements first.</button>
      <button class="suggestion" onclick="useSuggestion(this)">Skip to next question →</button>
    `;
    return;
  }

  defaultSuggestions.forEach(sugg => {
    const btn = document.createElement('button');
    btn.className = 'suggestion';
    btn.textContent = sugg;
    btn.addEventListener('click', () => useSuggestion(btn));
    suggsContainer.appendChild(btn);
  });
}

window.useSuggestion = function(element) {
  const text = element.textContent || element.value;
  const input = document.getElementById('userInput');
  if (!input) return;

  if (text.includes("Skip to next question")) {
    simulateSkipQuestion();
    return;
  }

  input.value = text;
  sendMessage();
};

window.handleKeydown = function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

window.autoResize = function(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};

window.sendMessage = function() {
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  
  if (!userInput || !chatBox || !userInput.value.trim()) return;

  const messageText = userInput.value.trim();
  
  // Append user bubble
  appendUserMessage(messageText);

  // Clear input
  userInput.value = '';
  userInput.style.height = 'auto';

  // Disable text input during AI processing
  userInput.disabled = true;
  if (sendBtn) sendBtn.disabled = true;

  // Show typing bubble
  const typingIndicator = appendTypingIndicator();
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulate processing response
  setTimeout(() => {
    // Remove typing indicator
    typingIndicator.remove();

    // Process chat response
    processAiResponse(messageText);

    // Re-enable inputs
    userInput.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    userInput.focus();
    
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1300);
};

function processAiResponse(userMsg) {
  const questionsList = JobPrepData.interviewQuestions[activeTrack];
  
  // If interview hasn't officially started asking questions yet
  if (currentQuestionIndex === 0) {
    currentQuestionIndex = 1;
    const firstQ = questionsList[0].question;
    appendAiMessage("AI Coach", `Excellent! Let's get started. Here is your first question:\n\n**${firstQ}**`);
    updateChatSuggestions();
    incrementSessionCount();
    return;
  }

  // User is answering question currentQuestionIndex (1-indexed, so array index is currentQuestionIndex - 1)
  const currentQ = questionsList[currentQuestionIndex - 1];
  userAnswersLog.push({ question: currentQ.question, answer: userMsg });

  // Evaluate matching keywords
  const matchedKeywords = [];
  const lowerMsg = userMsg.toLowerCase();
  
  currentQ.keywords.forEach(kw => {
    if (lowerMsg.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    }
  });

  let feedback = "";
  if (matchedKeywords.length >= 2) {
    feedback = `${currentQ.feedbackMatch}\n\n*(Keywords detected: ${matchedKeywords.join(', ')})*`;
    // Award skill points
    awardPointsForMatch();
  } else {
    feedback = currentQ.feedbackGeneric;
  }

  incrementQuestionCount();

  // Move to next question
  if (currentQuestionIndex < questionsList.length) {
    currentQuestionIndex++;
    const nextQ = questionsList[currentQuestionIndex - 1].question;
    appendAiMessage("AI Coach", `**Feedback on Q${currentQuestionIndex-1}:**\n${feedback}\n\n---\n\n**Question ${currentQuestionIndex}:**\n${nextQ}`);
  } else {
    // Interview ended
    currentQuestionIndex = 999; // Finished
    const graduationScore = calculateInterviewScore(userAnswersLog);
    appendAiMessage(
      "AI Coach", 
      `🎉 **Mock Interview Completed!**\n\nYou've finished the track. I evaluated your logs and generated a graduation assessment:\n\n* **Final Score:** ${graduationScore}/100\n* **Strengths:** Detailed layout configurations, active technical keywords vocabulary.\n* **Growth Areas:** Expand on lock strategies and network partitioning failure scenarios.\n\nYour skill scores have been adjusted. You can switch tracks or reset skills anytime!`
    );
    // Double upgrade skills on completion
    improveAllSkills(4);
  }

  updateChatSuggestions();
}

function simulateSkipQuestion() {
  const chatBox = document.getElementById('chatBox');
  const questionsList = JobPrepData.interviewQuestions[activeTrack];

  if (currentQuestionIndex === 0 || currentQuestionIndex > questionsList.length) {
    return;
  }

  appendUserMessage("*(Skips to next question)*");
  
  const typingIndicator = appendTypingIndicator();
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typingIndicator.remove();
    
    if (currentQuestionIndex < questionsList.length) {
      currentQuestionIndex++;
      const nextQ = questionsList[currentQuestionIndex - 1].question;
      appendAiMessage("AI Coach", `No problem! Let's move onto the next topic.\n\n**Question ${currentQuestionIndex}:**\n${nextQ}`);
    } else {
      currentQuestionIndex = 999;
      appendAiMessage("AI Coach", `Session ended. You skipped the final question. Make sure to practice this area later to plug your gaps!`);
    }
    updateChatSuggestions();
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
}

function calculateInterviewScore(answers) {
  let score = 55; // base
  answers.forEach(log => {
    if (log.answer.length > 80) score += 8;
    if (log.answer.length > 180) score += 4;
  });
  return Math.min(98, score + Math.floor(Math.random() * 10));
}

function awardPointsForMatch() {
  const skillsStr = localStorage.getItem('userSkills');
  if (!skillsStr) return;
  let skills = JSON.parse(skillsStr);

  // Decide which skill to upgrade based on activeTrack
  let targetId = activeTrack === 'tech' ? 1 : 3; // System Design or Behavioural
  // 50% chance for tech to boost Algorithms instead
  if (activeTrack === 'tech' && Math.random() > 0.5) {
    targetId = 2; // Algorithms
  }

  const skill = skills.find(s => s.id === targetId);
  if (skill && skill.value < 100) {
    skill.value = Math.min(100, skill.value + 4);
    localStorage.setItem('userSkills', JSON.stringify(skills));
    renderSkillsUI();
  }
}

function improveAllSkills(amount) {
  const skillsStr = localStorage.getItem('userSkills');
  if (!skillsStr) return;
  let skills = JSON.parse(skillsStr);
  skills.forEach(skill => {
    skill.value = Math.min(100, skill.value + amount);
  });
  localStorage.setItem('userSkills', JSON.stringify(skills));
  renderSkillsUI();
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('chatBox');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg msg--user';
  msgDiv.innerHTML = `
    <div class="msg__avatar" aria-hidden="true">ME</div>
    <div class="msg__bubble">${escapeHtml(text)}</div>
  `;
  chatBox.appendChild(msgDiv);
}

function appendAiMessage(sender, text, isNotification = false) {
  const chatBox = document.getElementById('chatBox');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg msg--ai';
  
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  const avatarLabel = sender === "System Notification" ? "SYS" : "AI";
  const notificationStyle = isNotification ? 'style="background: var(--blue-wash); border-color: rgba(37,99,235,.25); font-size: 12.5px;"' : '';

  msgDiv.innerHTML = `
    <div class="msg__avatar" aria-hidden="true">${avatarLabel}</div>
    <div class="msg__bubble" ${notificationStyle}>${formattedText}</div>
  `;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTypingIndicator() {
  const chatBox = document.getElementById('chatBox');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg msg--ai';
  msgDiv.innerHTML = `
    <div class="msg__avatar" aria-hidden="true">AI</div>
    <div class="msg__bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  chatBox.appendChild(msgDiv);
  return msgDiv;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// ==========================================
// 8. Stats Manager (LocalStorage Persistence)
// ==========================================
function initDashboardStats() {
  let stats = localStorage.getItem('userStats');
  if (!stats) {
    stats = JSON.stringify({ sessions: 0, questions: 0, streak: 1, lastActive: null });
    localStorage.setItem('userStats', stats);
  }
  
  // Also calculate daily activity bars on load
  renderDashboardStats();
}

function renderDashboardStats() {
  const statsStr = localStorage.getItem('userStats');
  if (!statsStr) return;
  const stats = JSON.parse(statsStr);

  const sessionEl = document.getElementById('sessionCount');
  const questionEl = document.getElementById('questionCount');
  const streakEl = document.getElementById('streakCount');

  if (sessionEl) sessionEl.textContent = stats.sessions;
  if (questionEl) questionEl.textContent = stats.questions;
  if (streakEl) streakEl.textContent = `Day ${stats.streak}`;

  // Populate activity chart
  renderActivityChart(stats);
}

function incrementSessionCount() {
  const statsStr = localStorage.getItem('userStats');
  if (!statsStr) return;
  const stats = JSON.parse(statsStr);
  stats.sessions++;
  localStorage.setItem('userStats', JSON.stringify(stats));
  renderDashboardStats();
}

function incrementQuestionCount(amount = 1) {
  const statsStr = localStorage.getItem('userStats');
  if (!statsStr) return;
  const stats = JSON.parse(statsStr);
  stats.questions += amount;
  localStorage.setItem('userStats', JSON.stringify(stats));
  renderDashboardStats();
}

function renderActivityChart(stats) {
  const barsContainer = document.getElementById('activityBars');
  if (!barsContainer) return;

  barsContainer.innerHTML = '';
  // Generate simulated activity heights for Mon-Sun (index 0 corresponds to Monday)
  // Let's make it look like a real weekly logs chart
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday etc
  const convertedDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1; // Mon is 0, Sun is 6

  const dailyActivities = [10, 40, 20, 65, 30, 15, 0]; // percentage heights
  // Let current day activity match current statistics
  dailyActivities[convertedDayIndex] = Math.min(100, Math.max(15, stats.questions * 6));

  dailyActivities.forEach((height, idx) => {
    const bar = document.createElement('div');
    bar.className = 'activity-bar';
    bar.style.height = `${height}%`;

    if (idx < convertedDayIndex) {
      bar.classList.add('activity-bar--on');
    } else if (idx === convertedDayIndex) {
      bar.classList.add('activity-bar--now');
      bar.setAttribute('aria-current', 'date');
    }
    
    barsContainer.appendChild(bar);
  });
}
