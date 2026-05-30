// JobPrep AI — Authentication and Form Validations (login.html + signup.html)

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme Toggle on Auth Pages
  initAuthThemeToggle();

  // Route Form Actions
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    initLoginForm(loginForm);
  }
  if (signupForm) {
    initSignupForm(signupForm);
  }
});

// ==========================================
// 1. Theme Management (Shared on Auth Pages)
// ==========================================
function initAuthThemeToggle() {
  const toggleBtn = document.getElementById('toggleMode');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcons(newTheme);
  });

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
// 2. Sign In Form Logic
// ==========================================
function initLoginForm(form) {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const emailErr = document.getElementById('loginEmailErr');
  const passErr = document.getElementById('loginPassErr');
  const showPassBtn = document.getElementById('showLoginPass');
  const submitBtn = document.getElementById('loginSubmit');

  // Toggle Password Visibility
  if (showPassBtn && passwordInput) {
    showPassBtn.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      
      const eyeOpen = showPassBtn.querySelector('.eye-open');
      const eyeShut = showPassBtn.querySelector('.eye-shut');
      
      if (isPass) {
        if (eyeOpen) eyeOpen.style.display = 'none';
        if (eyeShut) eyeShut.style.display = 'block';
        showPassBtn.setAttribute('aria-label', 'Hide password');
      } else {
        if (eyeOpen) eyeOpen.style.display = 'block';
        if (eyeShut) eyeShut.style.display = 'none';
        showPassBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  // Real-time validations
  emailInput.addEventListener('input', () => {
    validateEmailField(emailInput, emailErr);
  });

  passwordInput.addEventListener('input', () => {
    validateRequiredField(passwordInput, passErr, "Password is required");
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = validateEmailField(emailInput, emailErr);
    const isPassValid = validateRequiredField(passwordInput, passErr, "Password is required");

    if (!isEmailValid || !isPassValid) {
      return;
    }

    // Attempt Sign In
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (typeof isFirebaseAvailable !== 'undefined' && isFirebaseAvailable && auth) {
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const displayName = user.displayName || "Firebase User";
          const parts = displayName.split(" ");
          const firstName = parts[0] || "Firebase";
          const lastName = parts.slice(1).join(" ") || "User";
          
          localStorage.setItem('currentUser', JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: user.email
          }));
          window.location.href = 'index.html';
        })
        .catch((error) => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          passwordInput.classList.add('is-error');
          passErr.textContent = error.message;
        });
    } else {
      // Fallback local mock mode
      setTimeout(() => {
        const usersStr = localStorage.getItem('users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        const user = users.find(u => u.email.toLowerCase() === email);

        if (!user || user.password !== password) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          passwordInput.classList.add('is-error');
          passErr.textContent = "Invalid email address or password (Mock Mode).";
          return;
        }

        localStorage.setItem('currentUser', JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }));
        window.location.href = 'index.html';
      }, 800);
    }
  });

  // Social Logins
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const githubLoginBtn = document.getElementById('githubLoginBtn');

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      if (typeof isFirebaseAvailable !== 'undefined' && isFirebaseAvailable && auth) {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
          .then((result) => {
            const user = result.user;
            const displayName = user.displayName || "Google User";
            const parts = displayName.split(" ");
            const firstName = parts[0] || "Google";
            const lastName = parts.slice(1).join(" ") || "User";
            
            localStorage.setItem('currentUser', JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: user.email
            }));
            window.location.href = 'index.html';
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        alert("Google Authentication is unavailable in Mock Mode. Set your Firebase Key in firebase-config.js.");
      }
    });
  }

  if (githubLoginBtn) {
    githubLoginBtn.addEventListener('click', () => {
      if (typeof isFirebaseAvailable !== 'undefined' && isFirebaseAvailable && auth) {
        const provider = new firebase.auth.GithubAuthProvider();
        auth.signInWithPopup(provider)
          .then((result) => {
            const user = result.user;
            const displayName = user.displayName || "GitHub User";
            const parts = displayName.split(" ");
            const firstName = parts[0] || "GitHub";
            const lastName = parts.slice(1).join(" ") || "User";
            
            localStorage.setItem('currentUser', JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: user.email
            }));
            window.location.href = 'index.html';
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        alert("GitHub Authentication is unavailable in Mock Mode. Set your Firebase Key in firebase-config.js.");
      }
    });
  }
}

// ==========================================
// 3. Sign Up Form Logic
// ==========================================
function initSignupForm(form) {
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('signupEmail');
  const passwordInput = document.getElementById('signupPassword');
  const confirmInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('agreeTerms');

  const firstNameErr = document.getElementById('firstNameErr');
  const lastNameErr = document.getElementById('lastNameErr');
  const emailErr = document.getElementById('signupEmailErr');
  const passErr = document.getElementById('signupPassErr');
  const confirmErr = document.getElementById('confirmPassErr');

  const showPassBtn = document.getElementById('showSignupPass');
  const submitBtn = document.getElementById('signupSubmit');

  // Toggle Password Visibility
  if (showPassBtn && passwordInput) {
    showPassBtn.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      
      const eyeOpen = showPassBtn.querySelector('.eye-open');
      const eyeShut = showPassBtn.querySelector('.eye-shut');
      
      if (isPass) {
        if (eyeOpen) eyeOpen.style.display = 'none';
        if (eyeShut) eyeShut.style.display = 'block';
        showPassBtn.setAttribute('aria-label', 'Hide password');
      } else {
        if (eyeOpen) eyeOpen.style.display = 'block';
        if (eyeShut) eyeShut.style.display = 'none';
        showPassBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  // Real-time strength calculator
  passwordInput.addEventListener('input', () => {
    evaluatePasswordStrength(passwordInput.value);
    validatePasswordField(passwordInput, passErr);
  });

  // Real-time validations
  firstNameInput.addEventListener('input', () => validateRequiredField(firstNameInput, firstNameErr, "First name is required"));
  lastNameInput.addEventListener('input', () => validateRequiredField(lastNameInput, lastNameErr, "Last name is required"));
  emailInput.addEventListener('input', () => validateEmailField(emailInput, emailErr));
  confirmInput.addEventListener('input', () => validateConfirmPassword(passwordInput, confirmInput, confirmErr));

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isFirstValid = validateRequiredField(firstNameInput, firstNameErr, "First name is required");
    const isLastValid = validateRequiredField(lastNameInput, lastNameErr, "Last name is required");
    const isEmailValid = validateEmailField(emailInput, emailErr);
    const isPassValid = validatePasswordField(passwordInput, passErr);
    const isConfirmValid = validateConfirmPassword(passwordInput, confirmInput, confirmErr);
    const isTermsAccepted = termsCheckbox.checked;

    if (!isTermsAccepted) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (!isFirstValid || !isLastValid || !isEmailValid || !isPassValid || !isConfirmValid) {
      return;
    }

    // Register user
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (typeof isFirebaseAvailable !== 'undefined' && isFirebaseAvailable && auth) {
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return user.updateProfile({
            displayName: `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`
          }).then(() => {
            window.location.href = 'login.html';
          });
        })
        .catch((error) => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          emailInput.classList.add('is-error');
          emailErr.textContent = error.message;
        });
    } else {
      // Mock Sign up fallback
      setTimeout(() => {
        const usersStr = localStorage.getItem('users');
        let users = usersStr ? JSON.parse(usersStr) : [];

        if (users.some(u => u.email.toLowerCase() === email)) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          emailInput.classList.add('is-error');
          emailErr.textContent = "This email address is already registered (Mock Mode).";
          return;
        }

        users.push({
          firstName: firstNameInput.value.trim(),
          lastName: lastNameInput.value.trim(),
          email: email,
          password: password
        });

        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = 'login.html';
      }, 800);
    }
  });

  // Social Signups
  const googleSignupBtn = document.getElementById('googleSignupBtn');
  const githubSignupBtn = document.getElementById('githubSignupBtn');

  if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', () => {
      if (typeof isFirebaseAvailable !== 'undefined' && isFirebaseAvailable && auth) {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
          .then((result) => {
            const user = result.user;
            const displayName = user.displayName || "Google User";
            const parts = displayName.split(" ");
            const firstName = parts[0] || "Google";
            const lastName = parts.slice(1).join(" ") || "User";
            
            localStorage.setItem('currentUser', JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: user.email
            }));
            window.location.href = 'index.html';
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        alert("Google Registration is unavailable in Mock Mode. Set your Firebase Key in firebase-config.js.");
      }
    });
  }

  if (githubSignupBtn) {
    githubSignupBtn.addEventListener('click', () => {
      if (typeof isFirebaseAvailable !== 'undefined' && isFirebaseAvailable && auth) {
        const provider = new firebase.auth.GithubAuthProvider();
        auth.signInWithPopup(provider)
          .then((result) => {
            const user = result.user;
            const displayName = user.displayName || "GitHub User";
            const parts = displayName.split(" ");
            const firstName = parts[0] || "GitHub";
            const lastName = parts.slice(1).join(" ") || "User";
            
            localStorage.setItem('currentUser', JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: user.email
            }));
            window.location.href = 'index.html';
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        alert("GitHub Registration is unavailable in Mock Mode. Set your Firebase Key in firebase-config.js.");
      }
    });
  }
}

// ==========================================
// 4. Verification & Validation Helpers
// ==========================================
function validateRequiredField(input, errContainer, errMsg) {
  if (!input.value.trim()) {
    input.classList.add('is-error');
    input.classList.remove('is-valid');
    if (errContainer) errContainer.textContent = errMsg;
    return false;
  }
  input.classList.remove('is-error');
  input.classList.add('is-valid');
  if (errContainer) errContainer.textContent = '';
  return true;
}

function validateEmailField(input, errContainer) {
  const emailVal = input.value.trim();
  if (!emailVal) {
    input.classList.add('is-error');
    input.classList.remove('is-valid');
    errContainer.textContent = "Email is required";
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    input.classList.add('is-error');
    input.classList.remove('is-valid');
    errContainer.textContent = "Please enter a valid email address";
    return false;
  }

  input.classList.remove('is-error');
  input.classList.add('is-valid');
  errContainer.textContent = '';
  return true;
}

function validatePasswordField(input, errContainer) {
  const val = input.value;
  if (!val) {
    input.classList.add('is-error');
    input.classList.remove('is-valid');
    errContainer.textContent = "Password is required";
    return false;
  }
  if (val.length < 8) {
    input.classList.add('is-error');
    input.classList.remove('is-valid');
    errContainer.textContent = "Password must be at least 8 characters long";
    return false;
  }

  input.classList.remove('is-error');
  input.classList.add('is-valid');
  errContainer.textContent = '';
  return true;
}

function validateConfirmPassword(passInput, confirmInput, errContainer) {
  const passVal = passInput.value;
  const confirmVal = confirmInput.value;

  if (!confirmVal) {
    confirmInput.classList.add('is-error');
    confirmInput.classList.remove('is-valid');
    errContainer.textContent = "Please confirm your password";
    return false;
  }

  if (passVal !== confirmVal) {
    confirmInput.classList.add('is-error');
    confirmInput.classList.remove('is-valid');
    errContainer.textContent = "Passwords do not match";
    return false;
  }

  confirmInput.classList.remove('is-error');
  confirmInput.classList.add('is-valid');
  errContainer.textContent = '';
  return true;
}

// Password Strength Evaluator (0 to 4 score)
function evaluatePasswordStrength(password) {
  const sBar1 = document.getElementById('sBar1');
  const sBar2 = document.getElementById('sBar2');
  const sBar3 = document.getElementById('sBar3');
  const sBar4 = document.getElementById('sBar4');
  const label = document.getElementById('strengthLabel');

  if (!sBar1) return; // not on signup page

  const bars = [sBar1, sBar2, sBar3, sBar4];
  
  // Reset all bars to default background style
  bars.forEach(bar => {
    bar.style.backgroundColor = '';
  });

  if (!password) {
    label.textContent = '';
    return;
  }

  let score = 0;
  
  // Criteria checks
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++; // special char

  // Colors mapping
  let color = '';
  let text = '';

  switch (score) {
    case 1:
      color = '#ef4444'; // Weak Red
      text = 'Weak';
      bars[0].style.backgroundColor = color;
      break;
    case 2:
      color = '#ea580c'; // Fair Orange
      text = 'Fair';
      bars[0].style.backgroundColor = color;
      bars[1].style.backgroundColor = color;
      break;
    case 3:
      color = '#d97706'; // Good Yellow
      text = 'Good';
      bars[0].style.backgroundColor = color;
      bars[1].style.backgroundColor = color;
      bars[2].style.backgroundColor = color;
      break;
    case 4:
      color = '#0d9488'; // Strong Teal/Green
      text = 'Strong';
      bars[0].style.backgroundColor = color;
      bars[1].style.backgroundColor = color;
      bars[2].style.backgroundColor = color;
      bars[3].style.backgroundColor = color;
      break;
    default:
      label.textContent = '';
      return;
  }

  label.textContent = text;
  label.style.color = color;
}
