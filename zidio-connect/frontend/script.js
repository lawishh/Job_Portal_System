const API_BASE = "http://localhost:8080/api";

// ======= Utility Toast =======
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.background = isError ? "#e53935" : "#2ecc71";
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2500);
}

// ======= Navbar Control =======
function updateNavbar(isLoggedIn, role = null) {
  document.getElementById("loginNav").style.display = isLoggedIn ? "none" : "inline";
  document.getElementById("registerNav").style.display = isLoggedIn ? "none" : "inline";

  document.getElementById("homeNav").style.display = isLoggedIn ? "inline" : "none";
  document.getElementById("jobsNav").style.display = isLoggedIn ? "inline" : "none";
  document.getElementById("internshipsNav").style.display = isLoggedIn ? "inline" : "none";
  document.getElementById("logoutNav").style.display = isLoggedIn ? "inline" : "none";

  if (role === "recruiter") {
  document.getElementById("nav-dashboard").style.display = "inline-block";
}

  if (!role) role = localStorage.getItem("userRole");
  const isRecruiter = role === "recruiter";
  document.getElementById("addJobNav").style.display = isRecruiter ? "inline" : "none";
  document.getElementById("addInternNav").style.display = isRecruiter ? "inline" : "none";
}

// ======= Show Page =======
function showSection(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ======= On Load =======
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const storedUser = localStorage.getItem("userName");
  const storedRole = localStorage.getItem("userRole");

  if (storedUser) {
    updateNavbar(true, storedRole);
    showSection("home");
    loadListings(); // 🔄 load jobs & internships after login
  } else {
    updateNavbar(false);
    showSection("login");
  }

  // ======= LOGIN =======
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const data = await res.json();
        const name = data.name || "User";
        const role = data.role || "student";

        localStorage.setItem("userName", name);
        localStorage.setItem("userRole", role);

        updateNavbar(true, role);
        showToast(`Welcome, ${name}!`);
        showSection("home");
        loadListings();
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData.message === "User not found") {
          showToast("User not found! Redirecting to Register...", true);
          setTimeout(() => showSection("register"), 1500);
        } else if (errData.message === "Invalid password") {
          showToast("Incorrect password. Try again!", true);
        } else {
          showToast("Login failed. Please try again.", true);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Network error. Please check your connection.", true);
    }
  });

  // ======= REGISTER =======
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newUser = {
      name: document.getElementById("regName").value,
      email: document.getElementById("regEmail").value,
      password: document.getElementById("regPassword").value,
      role: document.getElementById("regRole").value,
    };

    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        showToast("Registration successful! Redirecting to Login...");
        setTimeout(() => showSection("login"), 1500);
      } else {
        showToast("Email already registered.", true);
      }
    } catch {
      showToast("Server error during registration.", true);
    }
  });

  // ======= ADD JOB (Recruiter only) =======
  document.getElementById("addJobForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const jobData = {
      title: document.getElementById("jobTitle").value,
      company: document.getElementById("jobCompany").value,
      location: document.getElementById("jobLocation").value,
      duration: document.getElementById("jobDuration")?.value || "",
      description: document.getElementById("jobDescription").value,
    };

    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (res.ok) {
        showToast("✅ Job added successfully!");
        document.getElementById("addJobForm").reset();
        showSection("jobs");
        loadJobs(); // 🔄 refresh UI
      } else {
        showToast("❌ Failed to add job.", true);
      }
    } catch (err) {
      console.error(err);
      showToast("Server error while adding job.", true);
    }
  });

  // ======= ADD INTERNSHIP (Recruiter only) =======
  document.getElementById("addInternForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const internData = {
      title: document.getElementById("internTitle").value,
      company: document.getElementById("internCompany").value,
      location: document.getElementById("internLocation").value,
      duration: document.getElementById("internDuration").value,
      description: document.getElementById("internDescription").value,
    };

    try {
      const res = await fetch(`${API_BASE}/internships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(internData),
      });

      if (res.ok) {
        showToast("✅ Internship added successfully!");
        document.getElementById("addInternForm").reset();
        showSection("internships");
        loadInternships(); // 🔄 refresh UI
      } else {
        showToast("❌ Failed to add internship.", true);
      }
    } catch (err) {
      console.error(err);
      showToast("Server error while adding internship.", true);
    }
  });
});

// ======= Logout =======
function logoutUser() {
  const name = localStorage.getItem("userName");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  showToast(`Goodbye ${name}! 👋`);
  updateNavbar(false);
  showSection("login");
}

// ======= Load Listings =======
async function loadListings() {
  await Promise.all([loadJobs(), loadInternships()]);
}

// ======= Load Jobs =======
async function loadJobs() {
  try {
    const res = await fetch(`${API_BASE}/jobs`);
    const jobs = await res.json();
    renderJobs(jobs);
  } catch (err) {
    console.error("Error loading jobs:", err);
    showToast("Failed to load jobs.", true);
  }
}

// ======= Load Internships =======
async function loadInternships() {
  try {
    const res = await fetch(`${API_BASE}/internships`);
    const internships = await res.json();
    renderInternships(internships);
  } catch (err) {
    console.error("Error loading internships:", err);
    showToast("Failed to load internships.", true);
  }
}

// ======= Render Jobs =======
function renderJobs(jobs) {
  const container = document.getElementById("job-list");
  if (!container) return;
  const role = localStorage.getItem("userRole");
  container.innerHTML = "";

  jobs.forEach((job) => {
    const card = document.createElement("div");
    card.classList.add("job-card");
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><b>Company:</b> ${job.company}</p>
      <p><b>Location:</b> ${job.location}</p>
      <p><b>Description:</b> ${job.description}</p>
      ${
        role === "recruiter"
          ? `<button onclick="deleteJob(${job.id})" class="delete-btn">🗑 Delete</button>`
          : `<button onclick="applyJob('${job.id}')">Apply</button>`
      }
    `;
    container.appendChild(card);
  });
}

// ======= Render Internships =======
function renderInternships(internships) {
  const container = document.getElementById("internship-list");
  if (!container) return;
  const role = localStorage.getItem("userRole");
  container.innerHTML = "";

  internships.forEach((intern) => {
    const card = document.createElement("div");
    card.classList.add("intern-card");

    card.innerHTML = `
      <h3>${intern.title}</h3>
      <p><b>Company:</b> ${intern.company}</p>
      <p><b>Location:</b> ${intern.location}</p>
      <p><b>Duration:</b> ${intern.duration}</p>
      <p>${intern.description}</p>
    `;

    if (role === "recruiter") {
      // Recruiters can delete internships
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑 Delete";
      delBtn.classList.add("delete-btn");
      delBtn.addEventListener("click", () => deleteInternship(intern.id));
      card.appendChild(delBtn);
    } else {
      // Students can apply
      const applyBtn = document.createElement("button");
      applyBtn.textContent = "Apply";
      applyBtn.classList.add("apply-btn");
      applyBtn.setAttribute("data-intern-id", intern.id);
      applyBtn.addEventListener("click", () => applyIntern(intern.id));
      card.appendChild(applyBtn);
    }

    container.appendChild(card);
  });
}



// ======= Delete Job =======
async function deleteJob(id) {
  if (!confirm("Are you sure you want to delete this job?")) return;
  try {
    const res = await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Job deleted successfully!");
      loadJobs();
    } else showToast("Failed to delete job.", true);
  } catch (err) {
    console.error(err);
    showToast("Server error while deleting job.", true);
  }
}

// ======= Delete Internship =======
async function deleteInternship(id) {
  if (!confirm("Are you sure you want to delete this internship?")) return;
  try {
    const res = await fetch(`${API_BASE}/internships/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Internship deleted successfully!");
      loadInternships();
    } else showToast("Failed to delete internship.", true);
  } catch (err) {
    console.error(err);
    showToast("Server error while deleting internship.", true);
  }
}


function applyJob(jobId) {
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("userRole");

  if (!name || !role) {
    showToast("⚠️ Please login first!");
    return;
  }

  if (role === "recruiter") {
    showToast("🚫 Recruiters cannot apply for jobs!");
    return;
  }

  showToast(`✅ ${name} successfully applied for Job ID: ${jobId}`);

  const applyBtn = document.querySelector(`button[data-job-id="${jobId}"]`);
  if (applyBtn) {
    applyBtn.disabled = true;
    applyBtn.textContent = "Applied";
  }
}



function applyIntern(internId) {
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("userRole");

  if (!name || !role) {
    showToast("⚠️ Please login first!");
    return;
  }

  if (role === "recruiter") {
    showToast("🚫 Recruiters cannot apply for internships!");
    return;
  }

  // Success
  showToast(`✅ ${name} successfully applied for Internship ID: ${internId}`);

  // disable button after applying
  const applyBtn = document.querySelector(`button[data-intern-id="${internId}"]`);
  if (applyBtn) {
    applyBtn.disabled = true;
    applyBtn.textContent = "Applied";
  }
}




async function loadRecruiterApplications() {
  const recruiterId = localStorage.getItem("userId");

  try {
    const res = await fetch(`${API_BASE}/applications/recruiter/${recruiterId}`);
    if (!res.ok) throw new Error("Failed to load applications");

    const applications = await res.json();
    const container = document.getElementById("application-list");
    container.innerHTML = "";

    if (applications.length === 0) {
      container.innerHTML = "<p>No applications received yet.</p>";
      return;
    }

    applications.forEach((app) => {
      const card = document.createElement("div");
      card.classList.add("app-card");
      card.innerHTML = `
        <p><b>Application ID:</b> ${app.id}</p>
        <p><b>Type:</b> ${app.type}</p>
        <p><b>Job/Internship ID:</b> ${app.jobId}</p>
        <p><b>Student ID:</b> ${app.userId}</p>
        <p><b>Status:</b> ${app.status}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading applications:", err);
    showToast("⚠️ Failed to load recruiter applications!");
  }
}
