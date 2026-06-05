import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp }
  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const EM = "\u2014";       // —
const EN = "\u2013";       // –
const BULLET = "\u2022";   // •
const ELLIPSIS = "\u2026"; // …
const ARROW = "\u2192";    // →

const app = initializeApp({
  apiKey: "AIzaSyBEOMZ_ZMHmuc4aRsE9TihjSyW_ZHvO-XE",
  authDomain: "spareshopdashboard.firebaseapp.com",
  projectId: "spareshopdashboard",
  storageBucket: "spareshopdashboard.firebasestorage.app",
  messagingSenderId: "179087487649",
  appId: "1:179087487649:web:3ce79fda7185805791b6e0"
});
const db = getFirestore(app);

const INTERNS = [
  { name: "Neliswa Ngcobo", email: "neliswangcobo141@gmail.com" },
  { name: "Thandazani Mbutho", email: "mbuthothandazani@gmail.com" },
  { name: "Ntando Khumalo", email: "khumalontando99@gmail.com" },
  { name: "Nompilo Mnguni", email: "mnguninompilo969@gmail.com" },
  { name: "Ndumiso Mndaweni", email: "ndumisomndaweni073@gmail.com" },
  { name: "Nkululeko Nkomo", email: "nkomon917@gmail.com" },
  { name: "Nkosinathi Mlambo", email: "mlambonkosinathi15@gmail.com" },
  { name: "Bongokuhle Brightman Hlongwane", email: "22109577@live.mut.ac.za", alt: "kuhlebrightmanhlongwane@gmail.com" },
  { name: "Lungelo Dladla", email: "basil.lungsta20@gmail.com" },
  { name: "Nqubeko Snenhlanhla Nhlumayo", email: "nqubekosnenhlanhla@gmail.com" },
  { name: "Mesuli Nduluko", email: "ndulukomesuli02@gmail.com" },
  { name: "Wandile Celimpilo Khumalo", email: "khumalowandile44@gmail.com" },
  { name: "Nokwanda Ndlovu", email: "nokwandandlovu17@gmail.com" },
  { name: "Ntokozo Shamase", email: "ntokozoshamase2015@gmail.com" },
  { name: "Nkanyiso Dlamini", email: "nkanyisod1252@gmail.com" },
  { name: "Gugulethu Mbambo", email: "gmbambo228@gmail.com" },
  { name: "Mpendulo Ncayiyane", email: "answermthombe@gmail.com" },
  { name: "Mbekezeli Sibusiso Mthethwa", email: "mbekezelimthethwa@gmail.com" },
  { name: "Yudishthir Ramanand", email: "yudishthir1234@gmail.com" }
];

const MILESTONES = {
  "1": [`Milestone 1 ${EN} Research and stream contribution approved`],
  "2": [
    `Milestone 1 ${EN} Stream prototype implementation started`,
    `Milestone 2 ${EN} Functional stream prototypes completed`
  ],
  "3": [`Milestone 3 ${EN} Enhanced prototypes approved`],
  "4": [`Milestone 4 ${EN} Integrated AgriChain Smart System completed`],
  "5": [`Milestone 5 ${EN} Testing and validation passed`],
  "6": [`Milestone 6 ${EN} AgriChain Smart System Version 1.0 released`]
};

const DELIVERABLES = {
  "1": [
    "Common Problem-Domain Understanding & Literature Review",
    "Stream Research & Discovery Report",
    "Stream Presentation"
  ],
  "2": [
    "Stream Implementation Progress Report",
    "Stream Demonstration",
    "Preliminary AgriChain Component"
  ],
  "3": [
    "Enhanced Stream Prototype",
    "Innovation Enhancement Report",
    "Prototype Demonstration"
  ],
  "4": [
    "Integrated AgriChain Smart System",
    "Integration Documentation",
    "System Demonstration"
  ],
  "5": [
    "Testing Report",
    "Validation Report",
    "Updated AgriChain Smart System"
  ],
  "6": [
    "Final AgriChain Smart System",
    "Final Project Report",
    "Project Showcase Presentation",
    "Innovation Demonstration",
    "Student Technical Portfolio"
  ]
};

function formatStreamLabel(stream) {
  if (!stream) return "";
  return stream
    .replace("Artificial Intelligence & Machine Learning", "AI & ML")
    .replace(`Internet of Things (IoT) ${EM} Drone Technology`, "IoT · Drones")
    .replace("Internet of Things (IoT)", "IoT")
    .replace("Blockchain & Traceability", "Blockchain");
}

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

function milestonePlaceholder() {
  return `${EM} select milestone ${EM}`;
}

function phaseFirstPlaceholder() {
  return `${EM} select phase first ${EM}`;
}

window.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("internName");
  INTERNS.forEach((i) => {
    const o = document.createElement("option");
    o.value = i.email;
    o.textContent = i.name;
    nameEl.appendChild(o);
  });

  nameEl.addEventListener("change", () => {
    const emailInput = document.getElementById("emailMiddle");
    const segs = document.getElementById("emailSegments");
    const hint = document.getElementById("verifyHint");
    emailInput.value = "";
    if (!nameEl.value) {
      segs.innerHTML = '<span style="color:var(--muted);font-size:.78rem">Select your name first</span>';
      emailInput.disabled = true;
      hint.innerHTML = "";
      return;
    }
    const intern = INTERNS.find((i) => i.email === nameEl.value);
    const s = buildSegments(intern.email);
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
    if (intern.alt) {
      hint.innerHTML = `<strong>Note:</strong> You have two registered emails ${EM} type the hidden portion of either one.`;
    } else {
      hint.innerHTML = `Type the missing characters (shown as ${BULLET}) to verify your identity.`;
    }
    updatePhaseRibbon(null);
  });

  const emailInput = document.getElementById("emailMiddle");
  ["paste", "drop", "cut"].forEach((e) => emailInput.addEventListener(e, (ev) => ev.preventDefault()));
  emailInput.addEventListener("contextmenu", (e) => e.preventDefault());

  document.getElementById("phase").addEventListener("change", function () {
    const p = this.value;
    const mEl = document.getElementById("milestone");
    mEl.innerHTML = `<option value="">${milestonePlaceholder()}</option>`;
    if (p && MILESTONES[p]) {
      MILESTONES[p].forEach((m) => {
        const o = document.createElement("option");
        o.value = m;
        o.textContent = m;
        mEl.appendChild(o);
      });
    }
    const wrap = document.getElementById("delivCheckWrap");
    if (p && DELIVERABLES[p]) {
      wrap.innerHTML =
        '<div class="check-grid">' +
        DELIVERABLES[p]
          .map((d) => `<label class="check-item"><input type="checkbox" name="deliv" value="${d}"/> ${d}</label>`)
          .join("") +
        "</div>";
    } else {
      wrap.innerHTML =
        '<p style="font-size:.78rem;color:var(--muted)">Select your phase above to see deliverables.</p>';
    }
    updatePhaseRibbon(p);
  });

  document.getElementById("progress").addEventListener("input", function () {
    document.getElementById("progressVal").textContent = this.value + "%";
  });

  document.querySelectorAll(".status-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".status-pill").forEach((p) => (p.className = "status-pill"));
      const v = pill.dataset.val;
      const cls = {
        "On Track": "sel-on-track",
        "Behind Schedule": "sel-behind",
        Blocked: "sel-blocked",
        Completed: "sel-completed",
        "Not Started": "sel-not-started"
      }[v];
      pill.classList.add(cls);
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

  document.getElementById("reportForm").addEventListener("submit", handleSubmit);
});

function updatePhaseRibbon(phase) {
  document.querySelectorAll(".pr-step").forEach((s) => s.classList.remove("active"));
  if (phase) document.getElementById("pr" + phase)?.classList.add("active");
}

function phaseLabelFromSelect(phaseEl) {
  const text = phaseEl.options[phaseEl.selectedIndex].text;
  const parts = text.split(EN);
  const tail = parts.length > 1 ? parts.slice(1).join(EN).trim() : text.replace(/^Phase\s+\d+\s*/i, "").trim();
  return `Phase ${phaseEl.value} ${EN} ${tail}`;
}

async function handleSubmit(e) {
  e.preventDefault();
  clearErr();
  let ok = true;

  const nameEl = document.getElementById("internName");
  const emailEl = document.getElementById("emailMiddle");
  const phaseEl = document.getElementById("phase");
  const streamEl = document.getElementById("stream");
  const milEl = document.getElementById("milestone");
  const weekEl = document.getElementById("week");
  const workEl = document.getElementById("workDone");
  const statEl = document.getElementById("statusHidden");

  if (!nameEl.value) {
    showErr("nameErr");
    ok = false;
  }
  if (!streamEl.value) {
    showErr("streamErr");
    ok = false;
  }
  if (!phaseEl.value) {
    showErr("phaseErr");
    ok = false;
  }
  if (!milEl.value) {
    showErr("milestoneErr");
    ok = false;
  }
  if (!weekEl.value || weekEl.value < 1 || weekEl.value > 24) {
    showErr("weekErr");
    ok = false;
  }
  if (!workEl.value.trim()) {
    showErr("workErr");
    ok = false;
  }
  if (!statEl.value) {
    document.getElementById("statusErr").style.display = "block";
    ok = false;
  }

  if (nameEl.value) {
    const typed = emailEl.value.trim().toLowerCase();
    const required = (emailEl.dataset.required || "").toLowerCase();
    const full = (emailEl.dataset.full || "").toLowerCase();
    const intern = INTERNS.find((i) => i.email === nameEl.value);
    let altOk = false;
    if (intern?.alt) {
      const altSeg = buildSegments(intern.alt);
      altOk = typed === altSeg.required.toLowerCase() || typed === intern.alt.toLowerCase();
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
    const intern = INTERNS.find((i) => i.email === document.getElementById("internName").value);
    const checked = [...document.querySelectorAll("input[name=deliv]:checked")].map((c) => c.value);
    await addDoc(collection(db, "agrichain_reports"), {
      internName: intern.name,
      email: intern.email,
      stream: streamEl.value,
      phase: phaseLabelFromSelect(phaseEl),
      phaseNum: parseInt(phaseEl.value, 10),
      milestone: milEl.value,
      week: parseInt(weekEl.value, 10),
      progress: parseInt(document.getElementById("progress").value, 10),
      deliverables: checked,
      workDone: workEl.value.trim(),
      challenges: document.getElementById("challenges").value.trim(),
      nextSteps: document.getElementById("nextSteps").value.trim(),
      support: document.getElementById("support").value.trim(),
      collab: document.getElementById("collab").value.trim(),
      status: statEl.value,
      submittedAt: Timestamp.now()
    });
    toast("Report submitted successfully!");
    document.getElementById("reportForm").reset();
    document.getElementById("progressVal").textContent = "0%";
    document.querySelectorAll(".status-pill").forEach((p) => (p.className = "status-pill"));
    document.getElementById("emailSegments").innerHTML =
      '<span style="color:var(--muted);font-size:.78rem">Select your name first</span>';
    document.getElementById("emailMiddle").disabled = true;
    document.getElementById("verifyHint").innerHTML = "";
    document.getElementById("delivCheckWrap").innerHTML =
      '<p style="font-size:.78rem;color:var(--muted)">Select your phase above to see deliverables.</p>';
    document.getElementById("milestone").innerHTML = `<option value="">${phaseFirstPlaceholder()}</option>`;
    updatePhaseRibbon(null);
  } catch (err) {
    console.error(err);
    toast("Submission failed: " + err.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = `Submit Progress Report ${ARROW}`;
  }
}

window.loadDash = async function () {
  const body = document.getElementById("dashBody");
  const spin = document.getElementById("dashSpin");
  spin.style.display = "flex";
  body.innerHTML = "";
  try {
    const snap = await getDocs(query(collection(db, "agrichain_reports"), orderBy("submittedAt", "desc")));
    spin.style.display = "none";
    const rows = [];
    snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));

    const total = rows.length;
    const streams = new Set(rows.map((r) => r.stream)).size;
    const avg = rows.length ? Math.round(rows.reduce((a, r) => a + (r.progress || 0), 0) / rows.length) : 0;
    const onTrack = rows.filter((r) => r.status === "On Track").length;
    document.getElementById("kpiRow").innerHTML = `
      <div class="kpi"><div class="kpi-num">${total}</div><div class="kpi-lbl">Total Reports</div></div>
      <div class="kpi"><div class="kpi-num">${streams}</div><div class="kpi-lbl">Streams Reporting</div></div>
      <div class="kpi"><div class="kpi-num">${avg}%</div><div class="kpi-lbl">Avg Progress</div></div>
      <div class="kpi"><div class="kpi-num">${onTrack}</div><div class="kpi-lbl">On Track</div></div>
    `;

    if (!rows.length) {
      body.innerHTML =
        '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:2rem">No reports submitted yet.</td></tr>';
      return;
    }

    const badgeClass = {
      "On Track": "bg",
      "Behind Schedule": "br",
      Completed: "bb",
      Blocked: "bo",
      "Not Started": "bm"
    };

    rows.forEach((r) => {
      const date = r.submittedAt?.toDate?.() ? r.submittedAt.toDate().toLocaleDateString("en-ZA") : EM;
      const ph = r.phase?.split(EN)[0]?.trim() || r.phase;
      const mil = r.milestone?.split(EN).slice(1).join(EN).trim() || r.milestone;
      const bc = badgeClass[r.status] || "bm";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${r.internName}</strong></td>
        <td><span class="stag">${formatStreamLabel(r.stream)}</span></td>
        <td style="font-size:.75rem">${ph}</td>
        <td style="font-size:.75rem;color:var(--muted)">${mil || EM}</td>
        <td style="text-align:center">${r.week}</td>
        <td>
          <div class="pbar-wrap"><div class="pbar-fill" style="width:${r.progress || 0}%"></div></div>
          <small>${r.progress || 0}%</small>
        </td>
        <td><span class="badge ${bc}">${r.status}</span></td>
        <td class="td-trunc" title="${r.workDone}">${r.workDone}</td>
        <td style="font-size:.75rem;color:var(--muted);white-space:nowrap">${date}</td>
      `;
      body.appendChild(tr);
    });
  } catch (err) {
    spin.style.display = "none";
    body.innerHTML = `<tr><td colspan="9" style="color:var(--danger);padding:2rem;text-align:center">Error: ${err.message}</td></tr>`;
  }
};

function showErr(id) {
  const e = document.getElementById(id);
  if (e) e.style.display = "block";
}
function clearErr() {
  document.querySelectorAll(".err").forEach((e) => {
    e.style.display = "none";
  });
}
function toast(msg, isErr = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.background = isErr ? "var(--red)" : "var(--green2)";
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 4000);
}
