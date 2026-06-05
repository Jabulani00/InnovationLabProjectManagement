import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const EM = "—";

const app = initializeApp({
  apiKey: "AIzaSyBEOMZ_ZMHmuc4aRsE9TihjSyW_ZHvO-XE",
  authDomain: "spareshopdashboard.firebaseapp.com",
  projectId: "spareshopdashboard",
  storageBucket: "spareshopdashboard.firebasestorage.app",
  messagingSenderId: "179087487649",
  appId: "1:179087487649:web:3ce79fda7185805791b6e0"
});

const db = getFirestore(app);

const state = {
  activePanel: "agri",
  filters: {
    agri: { search: "", status: "all", tag: "all" },
    stars: { search: "", status: "all", tag: "all" }
  }
};

function formatStreamLabel(stream) {
  if (!stream) return "";
  return stream
    .replace("Artificial Intelligence & Machine Learning", "AI & ML")
    .replace(`Internet of Things (IoT) ${EM} Drone Technology`, "IoT · Drones")
    .replace("Internet of Things (IoT)", "IoT")
    .replace("Blockchain & Traceability", "Blockchain");
}

function badgeClass(status) {
  return {
    "On Track": "bg",
    "Behind Schedule": "br",
    Completed: "bb",
    Blocked: "bo",
    "Not Started": "bm",
    "In Progress": "bg",
    "Ready for PR": "bb",
    "In Review": "br",
    Merged: "bb"
  }[status] || "bm";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function filterRows(rows, panel) {
  const f = state.filters[panel];
  const term = f.search.trim().toLowerCase();

  return rows.filter((row) => {
    const label = (panel === "agri" ? (row.internName || "") : (row.developerName || row.internName || "")).toLowerCase();
    const tag = (panel === "agri" ? (row.stream || "") : (row.storyRef || row.lane || "")).toLowerCase();
    const summary = (panel === "agri" ? (row.workDone || "") : (row.workDone || row.storyRefLabel || "")).toLowerCase();
    const matchesSearch = !term || label.includes(term) || tag.includes(term) || summary.includes(term);
    const matchesStatus = f.status === "all" || row.status === f.status;
    const matchesTag = f.tag === "all" || (panel === "agri" ? (row.stream || "") : (row.lane || row.storyRef || "")) === f.tag;
    return matchesSearch && matchesStatus && matchesTag;
  });
}

function renderSummary(panel, rows) {
  const total = rows.length;
  const people = new Set(rows.map((row) => panel === "agri" ? (row.internName || "Unknown") : (row.developerName || row.internName || "Unknown"))).size;
  const tagSet = new Set(rows.map((row) => panel === "agri" ? (row.stream || "") : (row.storyRef || row.lane || "")).filter(Boolean)).size;
  const done = rows.filter((row) => /merged|completed|ready for pr|on track/i.test(String(row.status || ""))).length;

  document.getElementById("kpiRow").innerHTML = `
    <div class="kpi"><div class="kpi-num">${total}</div><div class="kpi-lbl">Total ${panel === "agri" ? "reports" : "submissions"}</div></div>
    <div class="kpi"><div class="kpi-num">${people}</div><div class="kpi-lbl">Individuals</div></div>
    <div class="kpi"><div class="kpi-num">${tagSet}</div><div class="kpi-lbl">${panel === "agri" ? "Streams" : "Stories / lanes"}</div></div>
    <div class="kpi"><div class="kpi-num">${done}</div><div class="kpi-lbl">Ready / complete</div></div>
  `;
}

function cardMarkup(panel, row) {
  if (panel === "agri") {
    return `
      <details class="submission-card">
        <summary>
          <strong>${escapeHtml(row.internName || "Unknown intern")}</strong>
          <span class="summary-row">
            <span class="stag">${escapeHtml(formatStreamLabel(row.stream) || "No stream")}</span>
            <span class="badge ${badgeClass(row.status)}">${escapeHtml(row.status || "Unknown")}</span>
            <span class="stag">Week ${escapeHtml(row.week || 0)}</span>
            <span class="stag">${escapeHtml(row.progress || 0)}% progress</span>
          </span>
          <span class="summary-meta">${escapeHtml(row.phase || "Phase not set")} · ${escapeHtml(row.milestone || "Milestone not set")}</span>
        </summary>
        <div class="submission-body">
          <div class="detail-grid">
            <div class="detail-box"><div class="detail-label">Work completed</div><div class="detail-value">${escapeHtml(row.workDone || "No details provided.")}</div></div>
            <div class="detail-box"><div class="detail-label">Challenges</div><div class="detail-value">${escapeHtml(row.challenges || "—")}</div></div>
            <div class="detail-box"><div class="detail-label">Next steps</div><div class="detail-value">${escapeHtml(row.nextSteps || "—")}</div></div>
            <div class="detail-box"><div class="detail-label">Support & collaboration</div><div class="detail-value">${escapeHtml((row.support || "") + (row.collab ? "\n" + row.collab : "") || "—")}</div></div>
          </div>
          <div class="detail-box"><div class="detail-label">Deliverables</div><div class="detail-value">${(row.deliverables || []).length ? row.deliverables.map((item) => `<span class="stag" style="margin-right:6px; display:inline-block;">${escapeHtml(item)}</span>`).join("") : "No deliverables listed."}</div></div>
        </div>
      </details>`;
  }

  return `
    <details class="submission-card">
      <summary>
        <strong>${escapeHtml(row.developerName || row.internName || "Unknown developer")}</strong>
        <span class="summary-row">
          <span class="stag">${escapeHtml(row.storyRef || "No story")}</span>
          <span class="badge ${badgeClass(row.status)}">${escapeHtml(row.status || "Unknown")}</span>
          <span class="stag">${escapeHtml(row.lane ? `Lane ${row.lane}` : "No lane")}</span>
          <span class="stag">${escapeHtml(row.progress || 0)}% progress</span>
        </span>
        <span class="summary-meta">${escapeHtml(row.milestone || "Milestone not set")} · ${escapeHtml(row.prLink || "No PR link")}</span>
      </summary>
      <div class="submission-body">
        <div class="detail-grid">
          <div class="detail-box"><div class="detail-label">Work completed</div><div class="detail-value">${escapeHtml(row.workDone || "No details provided.")}</div></div>
          <div class="detail-box"><div class="detail-label">Files touched</div><div class="detail-value">${escapeHtml(row.filesTouched || "—")}</div></div>
          <div class="detail-box"><div class="detail-label">Blockers & dependencies</div><div class="detail-value">${escapeHtml(row.challenges || "—")}</div></div>
          <div class="detail-box"><div class="detail-label">Next steps</div><div class="detail-value">${escapeHtml(row.nextSteps || "—")}</div></div>
        </div>
        <div class="detail-box"><div class="detail-label">Checklist</div><div class="detail-value">${(row.prChecklist || []).length ? row.prChecklist.map((item) => `<span class="stag" style="margin-right:6px; display:inline-block;">${escapeHtml(item)}</span>`).join("") : "No checklist items selected."}</div></div>
      </div>
    </details>`;
}

function renderPanel(panel, rows) {
  const filtered = filterRows(rows, panel);
  renderSummary(panel, filtered);
  document.getElementById(`${panel}Cards`).innerHTML = filtered.length
    ? filtered.map((row) => cardMarkup(panel, row)).join("")
    : `<div class="detail-box" style="color:var(--muted)">No ${panel === "agri" ? "AgriChain reports" : "STARS submissions"} match the current filter choices.</div>`;
}

function populateFilters(rows, panel) {
  const statusSelect = document.getElementById("statusFilter");
  const tagSelect = document.getElementById("tagFilter");
  const currentStatus = state.filters[panel].status;
  const currentTag = state.filters[panel].tag;

  const statusOptions = [...new Set(rows.map((row) => row.status).filter(Boolean))];
  const tagOptions = [...new Set(rows.map((row) => panel === "agri" ? (row.stream || "") : (row.storyRef || row.lane || "")).filter(Boolean))];

  statusSelect.innerHTML = '<option value="all">All statuses</option>' + statusOptions.map((option) => `<option value="${escapeHtml(option)}" ${currentStatus === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
  tagSelect.innerHTML = '<option value="all">All streams / lanes</option>' + tagOptions.map((option) => `<option value="${escapeHtml(option)}" ${currentTag === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
}

async function loadDashboard() {
  const agriSnap = await getDocs(query(collection(db, "agrichain_reports"), orderBy("submittedAt", "desc")));
  const starsSnap = await getDocs(query(collection(db, "stars_story_submissions"), orderBy("submittedAt", "desc")));

  const agriRows = agriSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const starsRows = starsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  populateFilters(agriRows, "agri");
  populateFilters(starsRows, "stars");
  renderPanel(state.activePanel, state.activePanel === "agri" ? agriRows : starsRows);
}

function switchPanel(panel) {
  state.activePanel = panel;
  document.querySelectorAll(".panel-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.panel === panel));
  document.querySelectorAll(".panel-panel").forEach((section) => section.classList.toggle("active", section.id === `panel-${panel}`));
  loadDashboard();
}

window.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll(".panel-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchPanel(btn.dataset.panel));
  });

  document.getElementById("searchInput").addEventListener("input", (event) => {
    state.filters[state.activePanel].search = event.target.value;
    loadDashboard();
  });
  document.getElementById("statusFilter").addEventListener("change", (event) => {
    state.filters[state.activePanel].status = event.target.value;
    loadDashboard();
  });
  document.getElementById("tagFilter").addEventListener("change", (event) => {
    state.filters[state.activePanel].tag = event.target.value;
    loadDashboard();
  });

  document.getElementById("refreshBtn").addEventListener("click", loadDashboard);
  await loadDashboard();
});
