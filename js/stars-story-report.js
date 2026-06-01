import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp }
  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const EM = "\u2014";
const EN = "\u2013";
const BULLET = "\u2022";
const ELLIPSIS = "\u2026";
const ARROW = "\u2192";

const app = initializeApp({
  apiKey: "AIzaSyBEOMZ_ZMHmuc4aRsE9TihjSyW_ZHvO-XE",
  authDomain: "spareshopdashboard.firebaseapp.com",
  projectId: "spareshopdashboard",
  storageBucket: "spareshopdashboard.firebasestorage.app",
  messagingSenderId: "179087487649",
  appId: "1:179087487649:web:3ce79fda7185805791b6e0"
});
const db = getFirestore(app);

const COLLECTION = "stars_story_submissions";

/** STARS integration team only */
const DEVELOPERS = [
  {
    name: "Bongokuhle Brightman Hlongwane",
    email: "22109577@live.mut.ac.za",
    alt: "kuhlebrightmanhlongwane@gmail.com",
    lane: "A",
    short: "Brightman"
  },
  {
    name: "Lungelo Dladla",
    email: "basil.lungsta20@gmail.com",
    lane: "C",
    short: "Basil"
  },
  {
    name: "Gugulethu Mbambo",
    email: "gmbambo228@gmail.com",
    lane: "B",
    short: "Gugulethu"
  }
];

const MILESTONE_LABELS = {
  "0": `M0 ${EN} Integration sprint`,
  "1": `M1 ${EN} Authentication`,
  "2": `M2 ${EN} Profiles & roles`,
  "3": `M3 ${EN} Read paths`,
  "4": `M4 ${EN} Write paths`,
  "5": `M5 ${EN} Cutover & hardening`,
  "6": `M6 ${EN} Challenge backend`
};

const STORY_REFS = [
  { group: "Foundation stories", items: [
    { value: "STORY-000", label: "STORY-000 — Team read-through (Supabase role)" },
    { value: "STORY-001", label: "STORY-001 — Create Supabase project (JOB-001)" },
    { value: "STORY-002", label: "STORY-002 — .env + dataSource (JOB-002, JOB-027)" },
    { value: "STORY-003", label: "STORY-003 — Schema agreement (JOB-003)" },
    { value: "STORY-004", label: "STORY-004 — Migrations 0002→0004 (JOB-004)" },
    { value: "STORY-005", label: "STORY-005 — seed.sql (JOB-005)" },
    { value: "STORY-006", label: "STORY-006 — Challenge object library JSON" },
    { value: "STORY-007", label: "STORY-007 — RLS policies (JOB-023 slice)" },
    { value: "STORY-008", label: "STORY-008 — Edge Function stub (JOB-032 prep)" },
    { value: "STORY-009", label: "STORY-009 — Team integration gate" },
    { value: "STORY-010", label: "STORY-010 — README toolchain" }
  ]},
  { group: "Integration jobs (M1+)", items: [
    { value: "JOB-006", label: "JOB-006 — Wire login to Supabase Auth" },
    { value: "JOB-007", label: "JOB-007 — Auth state subscription + hydration" },
    { value: "JOB-008", label: "JOB-008 — Map Auth errors" },
    { value: "JOB-009", label: "JOB-009 — user_profiles repository" },
    { value: "JOB-010", label: "JOB-010 — Student registration pipeline" },
    { value: "JOB-011", label: "JOB-011 — useRoleGuard live profile" },
    { value: "JOB-012", label: "JOB-012 — Student dashboard modules" },
    { value: "JOB-013", label: "JOB-013 — Lecturer modules list" },
    { value: "JOB-014", label: "JOB-014 — Attendance history" },
    { value: "JOB-015", label: "JOB-015 — Active session reads" },
    { value: "JOB-016", label: "JOB-016 — Leadership analytics" },
    { value: "JOB-017", label: "JOB-017 — Attendance trend rollups" },
    { value: "JOB-018", label: "JOB-018 — Audit log reads" },
    { value: "JOB-019", label: "JOB-019 — Create attendance session" },
    { value: "JOB-020", label: "JOB-020 — Module active_session_id" },
    { value: "JOB-021", label: "JOB-021 — Challenge attendance submit" },
    { value: "JOB-022", label: "JOB-022 — Offline outbox sync" },
    { value: "JOB-023", label: "JOB-023 — RLS policies v1" },
    { value: "JOB-024", label: "JOB-024 — Enrolment writes" },
    { value: "JOB-025", label: "JOB-025 — Class register finalisation" },
    { value: "JOB-026", label: "JOB-026 — Delegation & proxy writes" },
    { value: "JOB-027", label: "JOB-027 — Data source flag" },
    { value: "JOB-028", label: "JOB-028 — Mock → Supabase migration" },
    { value: "JOB-029", label: "JOB-029 — Observability policy" },
    { value: "JOB-030", label: "JOB-030 — Web + native parity" },
    { value: "JOB-031", label: "JOB-031 — attendance_records schema" },
    { value: "JOB-032", label: "JOB-032 — Edge Function verification" },
    { value: "JOB-033", label: "JOB-033 — Wire challenge UI to Supabase" },
    { value: "JOB-034", label: "JOB-034 — RLS + tests for challenge" }
  ]}
];

function buildSegments(email) {
  const [local, domain] = email.split("@");
  const domParts = domain.split(".");
  const ext = domParts.pop();
  const domMain = domParts.join(".");

  const lStart = local.slice(0, 2);
  const lEnd = local.length > 4 ? local.slice(-2) : "";
  const lHide = local.slice(2, local.length > 4 ? local.length - 2 : local.length);

  const dStart = domMain.slice(0, 2);
  const dHide = domMain.slice(2);

  return {
    lStart,
    lEnd,
    lHide,
    dStart,
    dHide,
    ext,
    required: lHide + "@" + dHide + "." + ext,
    full: email
  };
}

function populateStoryRefSelect() {
  const el = document.getElementById("storyRef");
  STORY_REFS.forEach((g) => {
    const og = document.createElement("optgroup");
    og.label = g.group;
    g.items.forEach((item) => {
      const o = document.createElement("option");
      o.value = item.value;
      o.textContent = item.label;
      og.appendChild(o);
    });
    el.appendChild(og);
  });
}

function updateMilestoneRibbon(milestoneNum) {
  document.querySelectorAll(".pr-step").forEach((s) => s.classList.remove("active"));
  if (milestoneNum !== null && milestoneNum !== "") {
    document.getElementById("mr" + milestoneNum)?.classList.add("active");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("devName");
  DEVELOPERS.forEach((d) => {
    const o = document.createElement("option");
    o.value = d.email;
    o.textContent = d.name;
    nameEl.appendChild(o);
  });

  populateStoryRefSelect();

  nameEl.addEventListener("change", () => {
    const emailInput = document.getElementById("emailMiddle");
    const segs = document.getElementById("emailSegments");
    const hint = document.getElementById("verifyHint");
    const laneEl = document.getElementById("lane");
    emailInput.value = "";

    if (!nameEl.value) {
      segs.innerHTML = '<span style="color:var(--muted);font-size:.78rem">Select your name first</span>';
      emailInput.disabled = true;
      hint.innerHTML = "";
      laneEl.value = "";
      return;
    }

    const dev = DEVELOPERS.find((d) => d.email === nameEl.value);
    laneEl.value = dev.lane;

    const s = buildSegments(dev.email);
    const dots = BULLET.repeat(Math.min(s.lHide.length, 8));
    const ddots = BULLET.repeat(Math.min(s.dHide.length, 6));
    segs.innerHTML =
      `<span class="seg-reveal">${s.lStart}</span>` +
      `<span class="seg-dots">${dots}</span>` +
      (s.lEnd ? `<span class="seg-reveal">${s.lEnd}</span>` : "") +
      `<span class="seg-divider">@</span>` +
      `<span class="seg-reveal">${s.dStart}</span>` +
      `<span class="seg-dots">${ddots}</span>` +
      `<span class="seg-reveal">.${s.ext}</span>`;
    emailInput.disabled = false;
    emailInput.placeholder = `Type the ${BULLET}${BULLET}${BULLET}${BULLET} portions to complete your email`;
    emailInput.dataset.required = s.required;
    emailInput.dataset.full = s.full;

    if (dev.alt) {
      hint.innerHTML = `<strong>Note:</strong> Two registered emails ${EM} type the hidden portion of either one.`;
    } else {
      hint.innerHTML = `Type the missing characters (shown as ${BULLET}) to verify your identity.`;
    }
  });

  const emailInput = document.getElementById("emailMiddle");
  ["paste", "drop", "cut"].forEach((e) => emailInput.addEventListener(e, (ev) => ev.preventDefault()));
  emailInput.addEventListener("contextmenu", (e) => e.preventDefault());

  document.getElementById("milestone").addEventListener("change", function () {
    updateMilestoneRibbon(this.value);
  });

  document.getElementById("progress").addEventListener("input", function () {
    document.getElementById("progressVal").textContent = this.value + "%";
  });

  document.querySelectorAll(".status-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".status-pill").forEach((p) => (p.className = "status-pill"));
      const v = pill.dataset.val;
      const cls = {
        "In Progress": "sel-on-track",
        "Ready for PR": "sel-completed",
        "In Review": "sel-behind",
        Merged: "sel-completed",
        Blocked: "sel-blocked",
        "Not Started": "sel-not-started"
      }[v];
      pill.classList.add(cls || "sel-on-track");
      document.getElementById("statusHidden").value = v;
      document.getElementById("statusErr").style.display = "none";
    });
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
      const t = btn.dataset.tab;
      document.getElementById(t).classList.add("active");
      if (t === "dashboard") loadDash();
    });
  });

  document.getElementById("storyForm").addEventListener("submit", handleSubmit);
});

async function handleSubmit(e) {
  e.preventDefault();
  clearErr();
  let ok = true;

  const nameEl = document.getElementById("devName");
  const emailEl = document.getElementById("emailMiddle");
  const milestoneEl = document.getElementById("milestone");
  const storyRefEl = document.getElementById("storyRef");
  const workEl = document.getElementById("workDone");
  const statEl = document.getElementById("statusHidden");

  if (!nameEl.value) { showErr("nameErr"); ok = false; }
  if (!milestoneEl.value) { showErr("milestoneErr"); ok = false; }
  if (!storyRefEl.value) { showErr("storyRefErr"); ok = false; }
  if (!workEl.value.trim()) { showErr("workErr"); ok = false; }
  if (!statEl.value) {
    document.getElementById("statusErr").style.display = "block";
    ok = false;
  }

  if (nameEl.value) {
    const typed = emailEl.value.trim().toLowerCase();
    const required = (emailEl.dataset.required || "").toLowerCase();
    const full = (emailEl.dataset.full || "").toLowerCase();
    const dev = DEVELOPERS.find((d) => d.email === nameEl.value);
    let altOk = false;
    if (dev?.alt) {
      const altSeg = buildSegments(dev.alt);
      altOk = typed === altSeg.required.toLowerCase() || typed === dev.alt.toLowerCase();
    }
    const mainOk = typed === required || typed === full;
    if (!mainOk && !altOk) {
      showErr("emailErr");
      ok = false;
    }
  }

  if (!ok) return;

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.textContent = `Submitting${ELLIPSIS}`;

  try {
    const dev = DEVELOPERS.find((d) => d.email === nameEl.value);
    const prChecks = [...document.querySelectorAll("input[name=prcheck]:checked")].map((c) => c.value);
    const milestoneNum = parseInt(milestoneEl.value, 10);

    await addDoc(collection(db, COLLECTION), {
      developerName: dev.name,
      developerShort: dev.short,
      email: dev.email,
      lane: document.getElementById("lane").value || dev.lane,
      milestone: MILESTONE_LABELS[milestoneEl.value],
      milestoneNum,
      storyRef: storyRefEl.value,
      storyRefLabel: storyRefEl.options[storyRefEl.selectedIndex].text,
      startAfter: document.getElementById("startAfter").value.trim(),
      prLink: document.getElementById("prLink").value.trim(),
      progress: parseInt(document.getElementById("progress").value, 10),
      prChecklist: prChecks,
      workDone: workEl.value.trim(),
      filesTouched: document.getElementById("filesTouched").value.trim(),
      challenges: document.getElementById("challenges").value.trim(),
      nextSteps: document.getElementById("nextSteps").value.trim(),
      status: statEl.value,
      submittedAt: Timestamp.now()
    });

    toast("Story progress submitted successfully!");
    document.getElementById("storyForm").reset();
    document.getElementById("progressVal").textContent = "0%";
    document.querySelectorAll(".status-pill").forEach((p) => (p.className = "status-pill"));
    document.getElementById("emailSegments").innerHTML =
      '<span style="color:var(--muted);font-size:.78rem">Select your name first</span>';
    document.getElementById("emailMiddle").disabled = true;
    document.getElementById("verifyHint").innerHTML = "";
    updateMilestoneRibbon(null);
  } catch (err) {
    console.error(err);
    toast("Submission failed: " + err.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = `Submit Story Progress ${ARROW}`;
  }
}

window.loadDash = async function () {
  const body = document.getElementById("dashBody");
  const spin = document.getElementById("dashSpin");
  spin.style.display = "flex";
  body.innerHTML = "";

  try {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy("submittedAt", "desc")));
    spin.style.display = "none";
    const rows = [];
    snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));

    const total = rows.length;
    const inProgress = rows.filter((r) => r.status === "In Progress" || r.status === "Ready for PR").length;
    const avg = rows.length ? Math.round(rows.reduce((a, r) => a + (r.progress || 0), 0) / rows.length) : 0;
    const merged = rows.filter((r) => r.status === "Merged").length;

    document.getElementById("kpiRow").innerHTML = `
      <div class="kpi"><div class="kpi-num">${total}</div><div class="kpi-lbl">Total Submissions</div></div>
      <div class="kpi"><div class="kpi-num">${inProgress}</div><div class="kpi-lbl">Stories in progress</div></div>
      <div class="kpi"><div class="kpi-num">${avg}%</div><div class="kpi-lbl">Avg progress</div></div>
      <div class="kpi"><div class="kpi-num">${merged}</div><div class="kpi-lbl">Merged / complete</div></div>
    `;

    if (!rows.length) {
      body.innerHTML =
        `<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:2rem">No submissions yet.</td></tr>`;
      return;
    }

    const badgeClass = {
      "In Progress": "bg",
      "Ready for PR": "bb",
      "In Review": "br",
      Merged: "bb",
      Blocked: "bo",
      "Not Started": "bm"
    };

    rows.forEach((r) => {
      const date = r.submittedAt?.toDate?.() ? r.submittedAt.toDate().toLocaleDateString("en-ZA") : EM;
      const bc = badgeClass[r.status] || "bm";
      const lane = r.lane ? `Lane ${r.lane}` : EM;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${r.developerName || r.internName || EM}</strong></td>
        <td><span class="stag">${r.storyRef || EM}</span></td>
        <td style="font-size:.75rem">${r.milestone?.split(EN)[0]?.trim() || r.milestone || EM}</td>
        <td style="font-size:.75rem;color:var(--muted)">${lane}</td>
        <td>
          <div class="pbar-wrap"><div class="pbar-fill" style="width:${r.progress || 0}%"></div></div>
          <small>${r.progress || 0}%</small>
        </td>
        <td><span class="badge ${bc}">${r.status}</span></td>
        <td class="td-trunc" title="${escapeAttr(r.workDone)}">${r.workDone || EM}</td>
        <td style="font-size:.75rem;color:var(--muted);white-space:nowrap">${date}</td>
      `;
      body.appendChild(tr);
    });
  } catch (err) {
    spin.style.display = "none";
    body.innerHTML = `<tr><td colspan="8" style="color:var(--danger);padding:2rem;text-align:center">Error: ${escapeAttr(err.message)}</td></tr>`;
  }
};

function escapeAttr(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function showErr(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function clearErr() {
  document.querySelectorAll(".err").forEach((e) => { e.style.display = "none"; });
}

function toast(msg, isErr = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.background = isErr ? "var(--red)" : "var(--green2)";
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 4000);
}
