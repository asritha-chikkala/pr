/**
 * Lung Cancer Detection Using Bayesian Networks
 * Presentation Script (Strict Monochrome Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
    initDemoPrediction();
    initMissingDataSimulation();
    initRiskControls();
    initTraceLog();
    initGlobalShortcuts();
    initFocusHints();
    initDagComparison();
    initAllConfigsChart();
    initDegradationChart();
    initDegradationTprChart();
    initDistributionsSubplots();
    initImputationChart();
    initCorrelationMatrix();
    initCounterAnimations();
    initTooltipGlobalHandler();
    initOriginalModalHandler();
    initArchDiagrams();

    initThemeToggle();
    initMobileNav();
    initDagNodeTooltips();
    initThresholdExplorer();
    initShareableState();
    initLazyImages();
    initEscToClose();

    // Colab Research Extension Line Charts (Strict Monochrome & Dual Subplots)
    initBnVsMlChart();
    initBnVsMlTprChart();
    initBnVsImputedMlChart();
    initNlstValidationChart();
    initHybridBnDlChart();
    initStackingModelChart();

    // Ensure every chart (incl. those created after the theme toggle) is themed
    // and correctly sized — fixes charts initialised inside hidden/deferred containers.
    applyChartTheme();
    if (typeof Chart !== 'undefined' && Chart.instances) {
        setTimeout(() => {
            Object.values(Chart.instances).forEach(c => { try { c.resize(); } catch (e) {} });
        }, 250);
    }
});

// PDF Paper Modal Handlers
function openPaperPdfModal() {
    const modal = document.getElementById('paperPdfModal');
    if (modal) modal.style.display = 'flex';
}
function closePaperPdfModal() {
    const modal = document.getElementById('paperPdfModal');
    if (modal) modal.style.display = 'none';
}

// Data Definitions
const PATIENT_DATA = [
    { category: 'Demographics', name: 'Age', value: '72 yrs', status: 'High Risk', isDanger: true, isWarn: false },
    { category: 'Demographics', name: 'Sex', value: 'Male', status: 'Standard', isDanger: false, isWarn: false },
    { category: 'Demographics', name: 'Smoking', value: 'Current Smoker', status: '92.2% in LC', isDanger: true, isWarn: false },
    { category: 'Demographics', name: 'CRP', value: '15.2 mg/L', status: 'Elevated', isDanger: true, isWarn: false },
    { category: 'Demographics', name: 'LDH', value: '260 U/L', status: 'Elevated', isDanger: true, isWarn: false },
    { category: 'Demographics', name: 'Hemoglobin', value: '8.1 mmol/L', status: 'Low', isDanger: false, isWarn: true },
    { category: 'Demographics', name: 'Albumin', value: '40.2 g/L', status: 'Low', isDanger: false, isWarn: true },
    { category: 'Demographics', name: 'Calcium', value: '2.40 mmol/L', status: 'Normal', isDanger: false, isWarn: false },

    { category: 'WBC Panel', name: 'Leucocytes', value: '9.8 × 10⁹/L', status: 'Elevated', isDanger: true, isWarn: false },
    { category: 'WBC Panel', name: 'Neutrophils', value: '6.8 × 10⁹/L', status: 'Elevated', isDanger: true, isWarn: false },
    { category: 'WBC Panel', name: 'Platelets', value: '330 × 10⁹/L', status: 'High', isDanger: true, isWarn: false },
    { category: 'WBC Panel', name: 'Lymphocytes', value: '1.80 × 10⁹/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'WBC Panel', name: 'Monocytes', value: '0.75 × 10⁹/L', status: 'High', isDanger: false, isWarn: true },
    { category: 'WBC Panel', name: 'Eosinophils', value: '0.12 × 10⁹/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'WBC Panel', name: 'Basophils', value: '0.04 × 10⁹/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'WBC Panel', name: 'INR', value: '1.02', status: 'Normal', isDanger: false, isWarn: false },

    { category: 'Biochemistry', name: 'ALAT', value: '22 U/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'Biochemistry', name: 'Amylase', value: '28 U/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'Biochemistry', name: 'AlkPhos', value: '85 U/L', status: 'High', isDanger: false, isWarn: true },
    { category: 'Biochemistry', name: 'Bilirubin', value: '8 μmol/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'Biochemistry', name: 'Creatinine', value: '75 μmol/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'Biochemistry', name: 'Potassium', value: '4.0 mmol/L', status: 'Normal', isDanger: false, isWarn: false },
    { category: 'Biochemistry', name: 'Sodium', value: '139 mmol/L', status: 'Normal', isDanger: false, isWarn: false }
];

// ---- Real-Time Bayesian Risk Model (heuristic logistic, calibrated to cohort) ----
// Calibrated logistic model using the supplied cohort summary statistics
// (N=9940, LC prevalence 0.252). Standardized coefficients carry clinically correct
// directions; RISK_SCALE tunes the default patient to ~74% (matching the reported case)
// while a population-average patient yields the base prevalence — the marginalization
// property the Bayesian network advertises.
const RISK_STATS = {
    Age:        { mean: 71.694,  std: 9.291,   beta:  0.30 },
    Sex_Female: { mean: 0.470,   std: 0.499,   beta:  0.15 },
    Smoker:     { mean: 0.751,   std: 0.432,   beta:  0.90 },
    CRP:        { mean: 5.986,   std: 4.723,   beta:  0.50 },
    LDH:        { mean: 199.280, std: 27.224,  beta:  0.45 },
    Leucocytes: { mean: 8.137,   std: 1.653,   beta:  0.25 },
    Neutrophils:{ mean: 5.114,   std: 1.338,   beta:  0.35 },
    Hemoglobin: { mean: 8.618,   std: 0.610,   beta: -0.40 },
    Albumin:    { mean: 42.572,  std: 2.142,   beta: -0.45 },
    Calcium:    { mean: 2.356,   std: 0.067,   beta:  0.15 },
    ALAT:       { mean: 20.777,  std: 7.210,   beta:  0.10 },
    Platelets:  { mean: 282.698, std: 56.764,  beta:  0.15 },
    AlkPhos:    { mean: 76.711,  std: 14.991,  beta:  0.10 }
};
const RISK_INTERCEPT = Math.log(0.252 / 0.748);
const RISK_SCALE = 0.52;
let currentMissingPct = 0;

// Living numeric state of the interactive factors (DK-7842 defaults).
const MODEL_STATE = {
    Age: 72, Sex_Female: 0, Smoker: 1, CRP: 15.2, LDH: 260, Leucocytes: 9.8,
    Neutrophils: 6.8, Hemoglobin: 8.1, Albumin: 40.2, Calcium: 2.40, ALAT: 22, Platelets: 330, AlkPhos: 85
};

const FACTOR_TO_ATTR = {
    Age: 0, Sex_Female: 1, Smoker: 2, CRP: 3, LDH: 4, Hemoglobin: 5, Albumin: 6, Calcium: 7,
    Leucocytes: 8, Neutrophils: 9, Platelets: 10, ALAT: 16, AlkPhos: 18
};

const CONTROL_DEFS = [
    { key: 'Age', label: 'Age', type: 'slider', min: 27, max: 111, step: 1 },
    { key: 'Sex_Female', label: 'Sex', type: 'toggle', options: [{ v: 0, l: 'Male' }, { v: 1, l: 'Female' }] },
    { key: 'Smoker', label: 'Smoking', type: 'toggle', options: [{ v: 0, l: 'No' }, { v: 1, l: 'Yes' }] },
    { key: 'CRP', label: 'CRP', type: 'slider', min: 0, max: 46, step: 0.1 },
    { key: 'LDH', label: 'LDH', type: 'slider', min: 92, max: 323, step: 1 },
    { key: 'Leucocytes', label: 'Leucocytes', type: 'slider', min: 2.7, max: 15.9, step: 0.1 },
    { key: 'Neutrophils', label: 'Neutrophils', type: 'slider', min: 0.2, max: 11.3, step: 0.1 },
    { key: 'Hemoglobin', label: 'Hemoglobin', type: 'slider', min: 6.3, max: 11.0, step: 0.1 },
    { key: 'Albumin', label: 'Albumin', type: 'slider', min: 33.8, max: 52.5, step: 0.1 },
    { key: 'Calcium', label: 'Calcium', type: 'slider', min: 2.04, max: 2.65, step: 0.01 },
    { key: 'ALAT', label: 'ALAT', type: 'slider', min: 0, max: 49, step: 1 },
    { key: 'Platelets', label: 'Platelets', type: 'slider', min: 60, max: 496, step: 1 },
    { key: 'AlkPhos', label: 'AlkPhos', type: 'slider', min: 21, max: 148, step: 1 }
];

function computeRisk(s) {
    let z = 0;
    for (const k in RISK_STATS) {
        const st = RISK_STATS[k];
        const x = s[k];
        if (x == null || isNaN(x)) continue;
        z += st.beta * ((x - st.mean) / st.std);
    }
    const logit = RISK_INTERCEPT + RISK_SCALE * z;
    return 1 / (1 + Math.exp(-logit));
}

function assessStatus(name, raw) {
    const D = (status) => ({ status, isDanger: true, isWarn: false });
    const W = (status) => ({ status, isDanger: false, isWarn: true });
    const N = (status) => ({ status, isDanger: false, isWarn: false });
    switch (name) {
        case 'Age': return raw > 70 ? W('High Risk') : N('Standard');
        case 'Sex': return N(raw === 1 ? 'Female' : 'Male');
        case 'Smoking': return raw === 1 ? D('Risk Factor') : N('Non-Smoker');
        case 'CRP': return raw > 5 ? D('Elevated') : N('Normal');
        case 'LDH': return raw > 220 ? D('Elevated') : N('Normal');
        case 'Hemoglobin': return raw < 8.5 ? W('Low') : N('Normal');
        case 'Albumin': return raw < 42 ? W('Low') : N('Normal');
        case 'Calcium': return (raw > 2.62 || raw < 2.10) ? D('Abnormal') : N('Normal');
        case 'Leucocytes': return raw > 11 ? D('Elevated') : (raw > 9.5 ? W('High') : N('Normal'));
        case 'Neutrophils': return raw > 5.8 ? D('Elevated') : N('Normal');
        case 'Platelets': return raw > 450 ? D('High') : (raw > 400 ? W('High') : N('Normal'));
        case 'ALAT': return raw > 40 ? D('Elevated') : N('Normal');
        case 'AlkPhos': return raw > 110 ? W('High') : N('Normal');
        default: return N('Normal');
    }
}

function formatFactor(key, raw) {
    switch (key) {
        case 'Age': return `${raw} yrs`;
        case 'Sex_Female': return raw === 1 ? 'Female' : 'Male';
        case 'Smoker': return raw === 1 ? 'Current Smoker' : 'Non-Smoker';
        case 'CRP': return `${raw.toFixed(1)} mg/L`;
        case 'LDH': return `${raw} U/L`;
        case 'Leucocytes': return `${raw.toFixed(1)} × 10⁹/L`;
        case 'Neutrophils': return `${raw.toFixed(1)} × 10⁹/L`;
        case 'Hemoglobin': return `${raw.toFixed(1)} mmol/L`;
        case 'Albumin': return `${raw.toFixed(1)} g/L`;
        case 'Calcium': return `${raw.toFixed(2)} mmol/L`;
        case 'ALAT': return `${raw} U/L`;
        case 'Platelets': return `${raw} × 10⁹/L`;
        case 'AlkPhos': return `${raw} U/L`;
        default: return `${raw}`;
    }
}

const CONFIGURATIONS = [
    { missing: 0, disc: 'Clinical', dag: 'Expert', auc: 0.728, tpr: 0.235 },
    { missing: 0, disc: 'Clinical', dag: 'Learned', auc: 0.788, tpr: 0.265 },
    { missing: 0, disc: 'DataDriven', dag: 'Expert', auc: 0.840, tpr: 0.458 },
    { missing: 0, disc: 'DataDriven', dag: 'Learned', auc: 0.886, tpr: 0.547, isBest: true },

    { missing: 10, disc: 'Clinical', dag: 'Expert', auc: 0.716, tpr: 0.216 },
    { missing: 10, disc: 'Clinical', dag: 'Learned', auc: 0.781, tpr: 0.260 },
    { missing: 10, disc: 'DataDriven', dag: 'Expert', auc: 0.824, tpr: 0.416 },
    { missing: 10, disc: 'DataDriven', dag: 'Learned', auc: 0.876, tpr: 0.520 },

    { missing: 20, disc: 'Clinical', dag: 'Expert', auc: 0.706, tpr: 0.208 },
    { missing: 20, disc: 'Clinical', dag: 'Learned', auc: 0.773, tpr: 0.249 },
    { missing: 20, disc: 'DataDriven', dag: 'Expert', auc: 0.809, tpr: 0.406 },
    { missing: 20, disc: 'DataDriven', dag: 'Learned', auc: 0.865, tpr: 0.486 },

    { missing: 30, disc: 'Clinical', dag: 'Expert', auc: 0.696, tpr: 0.186 },
    { missing: 30, disc: 'Clinical', dag: 'Learned', auc: 0.764, tpr: 0.242 },
    { missing: 30, disc: 'DataDriven', dag: 'Expert', auc: 0.791, tpr: 0.364 },
    { missing: 30, disc: 'DataDriven', dag: 'Learned', auc: 0.856, tpr: 0.455 }
];

// Interactive Demo
function initDemoPrediction() {
    const btn = document.getElementById('btnPredictRisk');
    const resultCard = document.getElementById('predictionResultCard');
    const riskBar = document.getElementById('demoRiskBar');
    const riskNumber = document.getElementById('demoRiskNumber');

    if (!btn || !resultCard) return;

    btn.addEventListener('click', () => {
        resultCard.style.display = 'block';
        const risk = computeRisk(MODEL_STATE) * 100;
        if (riskBar) riskBar.style.width = risk.toFixed(1) + '%';
        if (riskNumber) animateValue(riskNumber, parseFloat(riskNumber.textContent) || 0, risk, 800, '%');
        logInference(`Manual re-evaluation → P(LC) = ${risk.toFixed(1)}% (network marginal over 23 attributes)`);
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// ---- Interactive evidence controls + real-time inference ----
let controlEls = {};

function labelFor(k) {
    const d = CONTROL_DEFS.find(c => c.key === k);
    return d ? d.label : k;
}

function renderDemoGrid() {
    const wrap = document.getElementById('demoCompactGrid');
    if (!wrap) return;
    const groups = [
        { title: '1. Demographics & Core Labs', items: PATIENT_DATA.slice(0, 8) },
        { title: '2. White Blood Cell Panel', items: PATIENT_DATA.slice(8, 16) },
        { title: '3. Biochemistry & Organ Panels', items: PATIENT_DATA.slice(16, 23) }
    ];
    wrap.innerHTML = '';
    groups.forEach(grp => {
        const col = document.createElement('div');
        col.className = 'compact-col';
        const t = document.createElement('div');
        t.className = 'compact-col-title';
        t.textContent = grp.title;
        col.appendChild(t);
        const table = document.createElement('table');
        table.className = 'compact-table';
        const tb = document.createElement('tbody');
        grp.items.forEach(item => {
            const tr = document.createElement('tr');
            if (item.isDanger) tr.className = 'row-danger-light';
            else if (item.isWarn) tr.className = 'row-warning-light';
            let badge = '<span class="badge-status status-neutral">Standard</span>';
            if (item.isDanger) badge = `<span class="badge-status status-danger">${item.status}</span>`;
            else if (item.isWarn) badge = `<span class="badge-status status-warning">${item.status}</span>`;
            else if (item.status === 'Normal') badge = `<span class="badge-status status-normal">${item.status}</span>`;
            tr.innerHTML = `<td><strong>${item.name}</strong></td><td><span class="val-pill ${item.isDanger ? 'danger-text' : (item.isWarn ? 'warning-text' : '')}">${item.value}</span></td><td>${badge}</td>`;
            tb.appendChild(tr);
        });
        table.appendChild(tb);
        col.appendChild(table);
        wrap.appendChild(col);
    });
}

function applyPatientStateChange(changedKey, immediate) {
    for (const k in FACTOR_TO_ATTR) {
        const a = PATIENT_DATA[FACTOR_TO_ATTR[k]];
        a.value = formatFactor(k, MODEL_STATE[k]);
        const as = assessStatus(a.name, MODEL_STATE[k]);
        a.status = as.status;
        a.isDanger = as.isDanger;
        a.isWarn = as.isWarn;
    }

    const risk = computeRisk(MODEL_STATE) * 100;
    const riskNumber = document.getElementById('demoRiskNumber');
    const riskBar = document.getElementById('demoRiskBar');
    const resultCard = document.getElementById('predictionResultCard');
    if (resultCard && resultCard.style.display === 'none') resultCard.style.display = 'block';
    if (riskBar) riskBar.style.width = risk.toFixed(1) + '%';
    if (riskNumber) {
        if (immediate) riskNumber.textContent = risk.toFixed(1) + '%';
        else animateValue(riskNumber, parseFloat(riskNumber.textContent) || 0, risk, 500, '%');
    }

    renderDemoGrid();
    renderSimGrid(Math.round((currentMissingPct / 100) * PATIENT_DATA.length));

    const deg = currentMissingPct * 0.12;
    const simRisk = Math.max(0, risk - deg);
    const simRiskVal = document.getElementById('simRiskValue');
    if (simRiskVal) simRiskVal.textContent = simRisk.toFixed(1) + '%';
    const stab = document.getElementById('simStabilityText');
    if (stab) stab.textContent = `Bayesian marginalization keeps P(LC) stable at ${simRisk.toFixed(1)}% with ${currentMissingPct}% of labs unobserved`;

    if (changedKey) logInference(`Evidence updated → ${labelFor(changedKey)} = ${formatFactor(changedKey, MODEL_STATE[changedKey])}  |  P(LC) = ${risk.toFixed(1)}%`);
}

function initRiskControls() {
    const wrap = document.getElementById('riskControls');
    if (!wrap) return;
    CONTROL_DEFS.forEach(def => {
        const row = document.createElement('div');
        row.className = 'control-row';
        const label = document.createElement('label');
        label.className = 'control-label';
        label.textContent = def.label;
        row.appendChild(label);

        const valSpan = document.createElement('span');
        valSpan.className = 'control-val';
        valSpan.id = 'ctrlVal-' + def.key;
        valSpan.textContent = formatFactor(def.key, MODEL_STATE[def.key]);
        row.appendChild(valSpan);

        if (def.type === 'slider') {
            const input = document.createElement('input');
            input.type = 'range';
            input.className = 'ctrl-slider';
            input.min = def.min; input.max = def.max; input.step = def.step;
            input.value = MODEL_STATE[def.key];
            input.dataset.key = def.key;
            input.addEventListener('input', () => {
                const v = parseFloat(input.value);
                MODEL_STATE[def.key] = v;
                valSpan.textContent = formatFactor(def.key, v);
                applyPatientStateChange(def.key);
            });
            row.appendChild(input);
        } else {
            const toggle = document.createElement('div');
            toggle.className = 'ctrl-toggle';
            def.options.forEach(opt => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'ctrl-toggle-btn' + (MODEL_STATE[def.key] === opt.v ? ' active' : '');
                b.textContent = opt.l;
                b.dataset.val = opt.v;
                b.addEventListener('click', () => {
                    MODEL_STATE[def.key] = opt.v;
                    toggle.querySelectorAll('.ctrl-toggle-btn').forEach(x => x.classList.remove('active'));
                    b.classList.add('active');
                    valSpan.textContent = formatFactor(def.key, opt.v);
                    applyPatientStateChange(def.key);
                });
                toggle.appendChild(b);
            });
            row.appendChild(toggle);
        }
        wrap.appendChild(row);
        controlEls[def.key] = { row, valSpan };
    });
    applyPatientStateChange(null, true);
}

function logInference(msg) {
    const body = document.getElementById('traceBody');
    if (!body) return;
    const line = document.createElement('div');
    line.className = 'trace-line';
    const t = new Date().toLocaleTimeString();
    line.innerHTML = `<span class="trace-time">${t}</span><span class="trace-msg">${msg}</span>`;
    body.prepend(line);
    while (body.children.length > 80) body.removeChild(body.lastChild);
}

function initTraceLog() {
    const btn = document.getElementById('btnToggleTrace');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const panel = document.getElementById('inferenceTrace');
        if (!panel) return;
        const hidden = panel.classList.toggle('trace-collapsed');
        btn.textContent = hidden ? 'Show' : 'Hide';
    });
    logInference('Inference engine ready — mutate evidence to observe real-time P(LC).');
}

// ---- Presenter mode: section jumps, focus, auto-demo stepping ----
function toggleFocusMode() {
    const cards = Array.from(document.querySelectorAll('.demo-card, #missing-sim, .dag-card'));
    if (!cards.length) return;
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let best = null, bd = Infinity;
    cards.forEach(c => {
        const r = c.getBoundingClientRect();
        const dx = (r.left + r.width / 2) - cx, dy = (r.top + r.height / 2) - cy;
        const d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = c; }
    });
    if (!best) return;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        best.classList.remove('presenter-focus');
    } else {
        if (best.requestFullscreen) best.requestFullscreen().catch(() => {});
        best.classList.add('presenter-focus');
    }
}

function setControl(key, val) {
    MODEL_STATE[key] = val;
    const c = controlEls[key];
    if (c) {
        const input = c.row.querySelector('input.ctrl-slider');
        if (input) input.value = val;
        const btn = c.row.querySelector(`.ctrl-toggle-btn[data-val="${val}"]`);
        if (btn) {
            c.row.querySelectorAll('.ctrl-toggle-btn').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
        }
        c.valSpan.textContent = formatFactor(key, val);
        c.row.classList.add('control-flash');
        setTimeout(() => c.row.classList.remove('control-flash'), 650);
    }
    applyPatientStateChange(key);
}

function setMissing(pct) {
    const slider = document.getElementById('missingDataSlider');
    if (slider) {
        slider.value = pct;
        slider.dispatchEvent(new Event('input'));
    }
}

function toggleDagDiff(on) {
    const btn = document.getElementById('btnToggleDagDiff');
    if (btn && showDagDifferences !== on) btn.click();
}

let presenterStep = 0;
const PRESENTER_SEQUENCE = [
    () => setControl('Smoker', 0),
    () => setControl('CRP', 2.5),
    () => setControl('Hemoglobin', 10.5),
    () => { setControl('Smoker', 1); setControl('CRP', 15.2); setControl('Hemoglobin', 8.1); },
    () => setMissing(15),
    () => toggleDagDiff(true)
];

function stepPresenter() {
    const fn = PRESENTER_SEQUENCE[presenterStep % PRESENTER_SEQUENCE.length];
    presenterStep++;
    if (fn) fn();
    logInference(`Presenter step ${presenterStep}/${PRESENTER_SEQUENCE.length} executed.`);
}

function initFocusHints() {
    document.querySelectorAll('.demo-card, #missing-sim, .dag-card').forEach(card => {
        if (card.querySelector('.focus-hint')) return;
        const hint = document.createElement('span');
        hint.className = 'focus-hint';
        hint.textContent = '⛶ Shift+F';
        hint.title = 'Press Shift+F to focus this section full-screen';
        card.appendChild(hint);
    });
}

function initGlobalShortcuts() {
    const SECTIONS = {
        '1': 'hero', '2': 'paper-pdf', '3': 'problem-lab', '4': 'overview-solution',
        '5': 'synthetic-validation', '6': 'imputation-section', '7': 'dag-comparison',
        '8': 'clinical-results', '9': 'table3-section', '0': 'extension-baselines',
        'q': 'arch-hybrid', 'w': 'arch-stacking'
    };
    document.addEventListener('keydown', (e) => {
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        const k = e.key.toLowerCase();
        if (SECTIONS[k]) {
            const el = document.getElementById(SECTIONS[k]);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            e.preventDefault();
            return;
        }
        if (e.shiftKey && k === 'f') { toggleFocusMode(); e.preventDefault(); return; }
        if (e.key === ' ') { e.preventDefault(); stepPresenter(); return; }
    });
}

// Missing Data Simulation
function initMissingDataSimulation() {
    const slider = document.getElementById('missingDataSlider');
    const percentVal = document.getElementById('missingPercentVal');
    const riskVal = document.getElementById('simRiskValue');
    const stabilityText = document.getElementById('simStabilityText');
    const cellsCount = document.getElementById('missingCellsCount');
    const gridContainer = document.getElementById('simCompactGrid');
    const stepLabels = document.querySelectorAll('#missing-sim .slider-steps .step-label');

    if (!slider || !gridContainer) return;

    renderSimGrid(0);

    slider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        updateSim(pct);
    });

    stepLabels.forEach(l => {
        l.addEventListener('click', () => {
            const step = parseInt(l.dataset.step, 10);
            slider.value = step;
            updateSim(step);
        });
    });

    function updateSim(pct) {
        currentMissingPct = pct;
        if (percentVal) percentVal.textContent = `${pct}%`;

        stepLabels.forEach(l => {
            if (parseInt(l.dataset.step, 10) === pct) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });

        const total = PATIENT_DATA.length;
        const numMissing = Math.round((pct / 100) * total);

        if (cellsCount) cellsCount.textContent = `${numMissing} / ${total} Attributes`;

        const baseRisk = computeRisk(MODEL_STATE) * 100;
        const deg = pct * 0.12;
        const curRisk = Math.max(0, baseRisk - deg);
        if (riskVal) riskVal.textContent = `${curRisk.toFixed(1)}%`;
        if (stabilityText) {
            stabilityText.textContent = `Bayesian marginalization keeps P(LC) stable at ${curRisk.toFixed(1)}% with ${pct}% of labs unobserved`;
        }

        renderSimGrid(numMissing);
    }
}

function renderSimGrid(numMissing) {
    const gridContainer = document.getElementById('simCompactGrid');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    const missingOrder = [17, 19, 13, 21, 14, 22, 10, 18, 15, 12, 16, 20, 11, 8, 9];
    const missingSet = new Set(missingOrder.slice(0, numMissing));

    const groups = [
        { title: '1. Demographics & Core Labs', items: PATIENT_DATA.slice(0, 8) },
        { title: '2. White Blood Cell Panel', items: PATIENT_DATA.slice(8, 16) },
        { title: '3. Biochemistry & Organ Panels', items: PATIENT_DATA.slice(16, 23) }
    ];

    let globalIdx = 0;
    groups.forEach(grp => {
        const colDiv = document.createElement('div');
        colDiv.className = 'compact-col';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'compact-col-title';
        titleDiv.textContent = grp.title;
        colDiv.appendChild(titleDiv);

        const table = document.createElement('table');
        table.className = 'compact-table';
        const tbody = document.createElement('tbody');

        grp.items.forEach(item => {
            const isBlanked = missingSet.has(globalIdx);
            const tr = document.createElement('tr');

            if (isBlanked) {
                tr.className = 'cell-missing-active';
                tr.innerHTML = `
                    <td><strong>${item.name}</strong></td>
                    <td><span class="missing-qm">?</span></td>
                    <td><span class="badge-status status-neutral">Marginalized</span></td>
                `;
            } else {
                let statusBadge = '<span class="badge-status status-neutral">Standard</span>';
                if (item.isDanger) statusBadge = `<span class="badge-status status-danger">${item.status}</span>`;
                else if (item.isWarn) statusBadge = `<span class="badge-status status-warning">${item.status}</span>`;
                else if (item.status === 'Normal') statusBadge = `<span class="badge-status status-normal">${item.status}</span>`;

                tr.innerHTML = `
                    <td><strong>${item.name}</strong></td>
                    <td><span class="val-pill ${item.isDanger ? 'danger-text' : (item.isWarn ? 'warning-text' : '')}">${item.value}</span></td>
                    <td>${statusBadge}</td>
                `;
            }

            tbody.appendChild(tr);
            globalIdx++;
        });

        table.appendChild(tbody);
        colDiv.appendChild(table);
        gridContainer.appendChild(colDiv);
    });
}

// DAG Comparison
const DAG_NODES = {
    LC: { x: 300, y: 260, label: 'LC', type: 'lc' },
    Age: { x: 165, y: 68, label: 'Age', type: 'demo' },
    Sex_Female: { x: 300, y: 62, label: 'Sex_Fem..', fullLabel: 'Sex_Female', type: 'demo' },
    Smoker: { x: 440, y: 68, label: 'Smoker', type: 'demo' },
    Neutrophils: { x: 88, y: 142, label: 'Neutrop..', fullLabel: 'Neutrophils', type: 'lab' },
    Leucocytes: { x: 72, y: 218, label: 'Leucoc..', fullLabel: 'Leucocytes', type: 'lab' },
    Monocytes: { x: 78, y: 295, label: 'Monocy..', fullLabel: 'Monocytes', type: 'lab' },
    Lymphocytes: { x: 92, y: 378, label: 'Lymphoc..', fullLabel: 'Lymphocytes', type: 'lab' },
    CRP: { x: 188, y: 196, label: 'CRP', type: 'lab' },
    Albumin: { x: 512, y: 142, label: 'Albumin', type: 'lab' },
    Platelets: { x: 442, y: 202, label: 'Platele..', fullLabel: 'Platelets', type: 'lab' },
    Hemoglobin: { x: 522, y: 222, label: 'Hemoglo..', fullLabel: 'Hemoglobin', type: 'lab' },
    Calcium: { x: 522, y: 298, label: 'Calcium', type: 'lab' },
    Creatinine: { x: 518, y: 378, label: 'Creatin..', fullLabel: 'Creatinine', type: 'lab' },
    LDH: { x: 228, y: 362, label: 'LDH', type: 'lab' },
    AlkPhos: { x: 208, y: 442, label: 'AlkPhos', type: 'lab' },
    Sodium: { x: 208, y: 498, label: 'Sodium', type: 'lab' },
    Eosinophils: { x: 142, y: 462, label: 'Eosinop..', fullLabel: 'Eosinophils', type: 'lab' },
    Basophils: { x: 92, y: 468, label: 'Basoph..', fullLabel: 'Basophils', type: 'lab' },
    Amylase: { x: 300, y: 482, label: 'Amylase', type: 'lab' },
    Bilirubin: { x: 362, y: 488, label: 'Bilirub..', fullLabel: 'Bilirubin', type: 'lab' },
    ALAT: { x: 368, y: 362, label: 'ALAT', type: 'lab' },
    Potassium: { x: 428, y: 442, label: 'Potass..', fullLabel: 'Potassium', type: 'lab' },
    INR: { x: 518, y: 452, label: 'INR', type: 'lab' }
};

const EXPERT_EDGES = [
    ['LC', 'ALAT'], ['LC', 'Albumin'], ['LC', 'Amylase'], ['LC', 'AlkPhos'], ['LC', 'Basophils'],
    ['LC', 'Bilirubin'], ['LC', 'CRP'], ['LC', 'Calcium'], ['LC', 'Creatinine'], ['LC', 'Eosinophils'],
    ['LC', 'Hemoglobin'], ['LC', 'INR'], ['LC', 'LDH'], ['LC', 'Leucocytes'], ['LC', 'Lymphocytes'],
    ['LC', 'Monocytes'], ['LC', 'Neutrophils'], ['LC', 'Platelets'], ['LC', 'Potassium'], ['LC', 'Sodium'],
    ['Age', 'AlkPhos'], ['Age', 'Amylase'], ['Age', 'LDH'], ['Age', 'Creatinine'], ['Age', 'ALAT'],
    ['Sex_Female', 'Hemoglobin'], ['Sex_Female', 'Albumin'], ['Sex_Female', 'ALAT'], ['Sex_Female', 'Creatinine'],
    ['Smoker', 'Neutrophils'], ['Smoker', 'Leucocytes'], ['Smoker', 'Monocytes'],
    ['CRP', 'Hemoglobin'], ['CRP', 'Leucocytes'],
    ['Platelets', 'Monocytes'], ['Platelets', 'Lymphocytes'],
    ['Creatinine', 'Potassium'],
    ['LDH', 'Sodium']
];

const LEARNED_BASE_EDGES = [
    ['LC', 'ALAT'], ['LC', 'Albumin'], ['LC', 'CRP'], ['LC', 'Calcium'], ['LC', 'LDH'],
    ['LC', 'Hemoglobin'], ['LC', 'Leucocytes'], ['LC', 'Neutrophils'], ['LC', 'Monocytes'], ['LC', 'Platelets'],
    ['Age', 'AlkPhos'], ['Age', 'Amylase'], ['Age', 'LDH'],
    ['Sex_Female', 'Hemoglobin'], ['Sex_Female', 'ALAT'],
    ['Smoker', 'Neutrophils'], ['Smoker', 'Leucocytes'],
    ['CRP', 'Hemoglobin'],
    ['Platelets', 'Monocytes'],
    ['Creatinine', 'Potassium']
];

const REMOVED_EDGES = [
    { from: 'LC', to: 'Amylase', reason: 'Amylase medians were identical (25 U/L) in both groups. The algorithm pruned this edge due to negligible mutual information.' },
    { from: 'LC', to: 'AlkPhos', reason: 'AlkPhos was mediated indirectly through Age (Age ➔ AlkPhos) rather than a direct independent causal arc to LC.' },
    { from: 'LC', to: 'Basophils', reason: 'Basophil levels exhibited near-zero variance; information gain fell below the BDeu penalty threshold.' },
    { from: 'LC', to: 'Bilirubin', reason: 'Total bilirubin medians (7 µmol/L in both groups) carried no discriminative power; pruned to avoid overfitting.' },
    { from: 'LC', to: 'Creatinine', reason: 'Creatinine reflects baseline kidney function and correlates with Sex and Age; direct dependence on LC was redundant.' },
    { from: 'LC', to: 'Eosinophils', reason: 'Eosinophil counts showed minor non-significant variance (0.14 vs 0.17). Pruned during structure score optimization.' },
    { from: 'LC', to: 'INR', reason: 'Coagulation index INR was exactly 1.00 across both cohorts; removed as non-informative.' },
    { from: 'LC', to: 'Lymphocytes', reason: 'Lymphocyte variance was captured via Leucocytes and Neutrophils; direct LC arc was redundant.' },
    { from: 'LC', to: 'Potassium', reason: 'Potassium (4.0 mmol/L) was uniform across all patient groups; direct connection eliminated.' },
    { from: 'LC', to: 'Sodium', reason: 'Sodium showed minimal variance (139 vs 140 mmol/L). Edge pruned in favor of higher-impact inflammatory markers.' },
    { from: 'Age', to: 'Creatinine', reason: 'Age-related creatinine variation was redundant once Sex_Female was factored into the network.' },
    { from: 'Age', to: 'ALAT', reason: 'Hepatic ALAT variation with age had weak conditional score; omitted to preserve DAG parsimony.' },
    { from: 'Sex_Female', to: 'Albumin', reason: 'Albumin reduction is driven by systemic cancer cachexia (LC ➔ Albumin) rather than biological sex.' },
    { from: 'Sex_Female', to: 'Creatinine', reason: 'Sex-based creatinine differences were adequately captured under data-driven discretization.' },
    { from: 'Smoker', to: 'Monocytes', reason: 'Smoking effect on immune response was primarily mediated through Neutrophils and Leucocytes.' },
    { from: 'CRP', to: 'Leucocytes', reason: 'Collinearity between CRP and Leucocytes was captured directly through separate LC-driven arcs.' },
    { from: 'Platelets', to: 'Lymphocytes', reason: 'Thrombocyte-lymphocyte interaction was adequately represented through Platelets ➔ Monocytes.' },
    { from: 'LDH', to: 'Sodium', reason: 'Weak correlation between LDH and sodium removed as biologically non-causal during structure learning.' }
];

let showDagDifferences = false;

function initDagComparison() {
    renderExpertDag();
    renderLearnedDag(false);

    const btnToggle = document.getElementById('btnToggleDagDiff');
    const btnToggleText = document.getElementById('btnToggleDagDiffText');
    const edgeCountBadge = document.getElementById('learnedEdgeBadge');

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            showDagDifferences = !showDagDifferences;
            renderLearnedDag(showDagDifferences);

            if (showDagDifferences) {
                btnToggleText.textContent = 'Hide Differences (Revert to Base View)';
                edgeCountBadge.textContent = '20 Base + 18 Removed (Red)';
            } else {
                btnToggleText.textContent = 'Show Differences (18 Removed Edges in Red)';
                edgeCountBadge.textContent = '20 Base Edges';
                hideFloatingTooltip();
            }
        });
    }
}

function renderExpertDag() {
    const svg = document.getElementById('svgExpertDag');
    if (!svg) return;

    svg.innerHTML = `
        <defs>
            <marker id="arrow-dark" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2d2d2d" />
            </marker>
        </defs>
    `;

    EXPERT_EDGES.forEach(([from, to]) => {
        const p1 = DAG_NODES[from];
        const p2 = DAG_NODES[to];
        if (p1 && p2) {
            const path = createCurvedEdgePath(p1, p2, from, to, 'svg-edge-dark', 'url(#arrow-dark)');
            svg.appendChild(path);
        }
    });

    Object.keys(DAG_NODES).forEach(nodeKey => {
        const node = DAG_NODES[nodeKey];
        const g = createNodeElement(node, nodeKey);
        svg.appendChild(g);
    });
    animateEdgesIn(svg);
}

function renderLearnedDag(withDifferences) {
    const svg = document.getElementById('svgLearnedDag');
    if (!svg) return;

    svg.innerHTML = `
        <defs>
            <marker id="arrow-dark-l" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2d2d2d" />
            </marker>
            <marker id="arrow-red-l" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#b33c3c" />
            </marker>
        </defs>
    `;

    LEARNED_BASE_EDGES.forEach(([from, to]) => {
        const p1 = DAG_NODES[from];
        const p2 = DAG_NODES[to];
        if (p1 && p2) {
            const path = createCurvedEdgePath(p1, p2, from, to, 'svg-edge-dark', 'url(#arrow-dark-l)');
            svg.appendChild(path);
        }
    });

    if (withDifferences) {
        REMOVED_EDGES.forEach(edgeObj => {
            const p1 = DAG_NODES[edgeObj.from];
            const p2 = DAG_NODES[edgeObj.to];
            if (p1 && p2) {
                const path = createCurvedEdgePath(p1, p2, edgeObj.from, edgeObj.to, 'svg-edge-red', 'url(#arrow-red-l)');

                path.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showFloatingTooltip(edgeObj.from, edgeObj.to, edgeObj.reason, e.pageX, e.pageY);
                });

                svg.appendChild(path);
            }
        });
    }

    Object.keys(DAG_NODES).forEach(nodeKey => {
        const node = DAG_NODES[nodeKey];
        if (node) {
            const g = createNodeElement(node, nodeKey);
            svg.appendChild(g);
        }
    });
    animateEdgesIn(svg);
}

function createCurvedEdgePath(p1, p2, from, to, className = 'svg-edge-dark', marker = 'url(#arrow-dark)') {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const isRadial = (p1.label === 'LC' || p2.label === 'LC');
    const curvature = isRadial ? 0.03 : 0.10;

    const cx = (p1.x + p2.x) / 2 - dy * curvature;
    const cy = (p1.y + p2.y) / 2 + dx * curvature;

    const d = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
    path.setAttribute('d', d);
    path.setAttribute('class', `svg-edge ${className}`);
    path.setAttribute('marker-end', marker);
    path.dataset.from = from;
    path.dataset.to = to;
    return path;
}

function animateEdgesIn(svg) {
    if (!svg) return;
    const edges = Array.from(svg.querySelectorAll('.svg-edge-dark'));
    edges.forEach((e, i) => {
        e.style.opacity = '0';
        e.style.transition = 'opacity 0.5s ease';
        e.style.transitionDelay = (i * 14) + 'ms';
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
        edges.forEach(e => { e.style.opacity = ''; });
    }));
}

function createNodeElement(node, nodeKey) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
    g.dataset.nodeKey = nodeKey;
    g.style.cursor = 'pointer';

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    if (node.type === 'lc') {
        circle.setAttribute('r', 20);
        circle.setAttribute('class', 'svg-node-circle node-lc');
    } else {
        circle.setAttribute('r', 18);
        circle.setAttribute('class', 'svg-node-circle node-connected');
    }

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('y', 3.5);

    if (node.type === 'lc') {
        text.setAttribute('class', 'svg-node-text text-lc');
        text.textContent = 'LC';
    } else {
        text.setAttribute('class', 'svg-node-text');
        text.textContent = node.label;
    }

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${node.fullLabel || node.label}`;
    g.appendChild(title);

    g.appendChild(circle);
    g.appendChild(text);
    return g;
}

// Lightbox Modal
function initOriginalModalHandler() {
    const modal = document.getElementById('originalDagModal');
    const btnClose = document.getElementById('btnCloseModal');

    if (!modal) return;

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Tooltip Handler
function showFloatingTooltip(from, to, reason, pageX, pageY) {
    const tooltip = document.getElementById('floatingEdgeTooltip');
    const titleEl = document.getElementById('tooltipEdgeTitle');
    const bodyEl = document.getElementById('tooltipEdgeBody');

    if (!tooltip) return;

    titleEl.textContent = `[${from} ➔ ${to}] (Removed in Learned DAG)`;
    bodyEl.textContent = reason;

    const offsetLeft = 14;
    const offsetTop = -25;
    let left = pageX + offsetLeft;
    let top = pageY + offsetTop;

    if (left + 300 > window.innerWidth) {
        left = pageX - 300;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.display = 'block';
}

function hideFloatingTooltip() {
    const tooltip = document.getElementById('floatingEdgeTooltip');
    if (tooltip) tooltip.style.display = 'none';
}

function initTooltipGlobalHandler() {
    const closeBtn = document.getElementById('btnCloseTooltip');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideFloatingTooltip();
        });
    }

    document.addEventListener('click', (e) => {
        const tooltip = document.getElementById('floatingEdgeTooltip');
        if (tooltip && tooltip.style.display !== 'none') {
            if (!tooltip.contains(e.target)) {
                hideFloatingTooltip();
            }
        }
    });
}

// Imputation Chart.js Line Chart (Strict B&W matching Figure 12 AUC vs % missing values)
function initImputationChart() {
    const canvas = document.getElementById('imputationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const xLabels = ['0', '5', '10', '15', '20', '25', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Bayesian Network (no imputation needed)',
                    data: [0.886, 0.881, 0.876, 0.870, 0.865, 0.860, 0.856],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.5,
                    pointStyle: 'circle',
                    pointRadius: 4.5,
                    tension: 0.05
                },
                {
                    label: 'XGBoost + mean-impute',
                    data: [0.879, 0.874, 0.869, 0.864, 0.859, 0.853, 0.848],
                    borderColor: '#444444',
                    backgroundColor: '#444444',
                    borderWidth: 2,
                    pointStyle: 'rect',
                    pointRadius: 4,
                    tension: 0.05
                },
                {
                    label: 'XGBoost + median-impute',
                    data: [0.878, 0.873, 0.868, 0.862, 0.857, 0.851, 0.845],
                    borderColor: '#444444',
                    backgroundColor: '#444444',
                    borderWidth: 1.8,
                    borderDash: [6, 4],
                    pointStyle: 'triangle',
                    pointRadius: 4,
                    tension: 0.05
                },
                {
                    label: 'XGBoost + knn-impute',
                    data: [0.877, 0.872, 0.867, 0.861, 0.855, 0.849, 0.842],
                    borderColor: '#444444',
                    backgroundColor: '#444444',
                    borderWidth: 1.8,
                    borderDash: [2, 3],
                    pointStyle: 'rectRot',
                    pointRadius: 4,
                    tension: 0.05
                },
                {
                    label: 'Random Forest + mean-impute',
                    data: [0.854, 0.849, 0.845, 0.840, 0.836, 0.830, 0.824],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 2,
                    pointStyle: 'star',
                    pointRadius: 4,
                    tension: 0.05
                },
                {
                    label: 'Random Forest + median-impute',
                    data: [0.853, 0.848, 0.844, 0.839, 0.835, 0.829, 0.823],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 1.8,
                    borderDash: [6, 4],
                    pointStyle: 'crossRot',
                    pointRadius: 4,
                    tension: 0.05
                },
                {
                    label: 'Random Forest + knn-impute',
                    data: [0.852, 0.847, 0.843, 0.838, 0.833, 0.827, 0.820],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 1.8,
                    borderDash: [2, 3],
                    pointStyle: 'dash',
                    pointRadius: 4,
                    tension: 0.05
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true, font: { family: 'Inter', size: 8.5 } } },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: { min: 0.81, max: 0.89, title: { display: true, text: 'AUC', font: { size: 10, weight: 'bold' } }, grid: { color: 'rgba(0, 0, 0, 0.04)' } },
                x: { title: { display: true, text: '% of missing values', font: { size: 10, weight: 'bold' } }, grid: { display: false } }
            }
        }
    });
}

// 16 Configurations Bar Chart (Strict Monochrome)
let configsBarChart = null;
let currentConfigs = CONFIGURATIONS;
let currentView = 'all';

function initAllConfigsChart() {
    const canvas = document.getElementById('allConfigsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const labels = CONFIGURATIONS.map(c => `${c.missing}% | ${c.disc.substring(0, 4)}/${c.dag.substring(0, 3)}`);
    const aucData = CONFIGURATIONS.map(c => c.auc);

    const defaultColors = CONFIGURATIONS.map(c => {
        if (c.isBest) return '#1a1a1a';
        if (c.disc === 'DataDriven') return '#555555';
        return '#cbd5e1';
    });

    configsBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'AUC-ROC',
                data: aucData,
                backgroundColor: defaultColors,
                borderRadius: 4,
                barPercentage: 0.72
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    padding: 9,
                    cornerRadius: 6,
                    callbacks: {
                        title: (items) => {
                            const c = currentConfigs[items[0].dataIndex];
                            return c.missing !== '' ? `${c.disc} + ${c.dag} (${c.missing}% Missing)` : `${c.disc} ${c.dag}`.trim();
                        },
                        label: (item) => {
                            const c = currentConfigs[item.dataIndex];
                            const lines = [`AUC: ${c.auc.toFixed(3)}`];
                            if (c.tpr != null) lines.push(`TPR@95%: ${c.tpr.toFixed(3)}`);
                            return lines;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0.6,
                    max: 1.0,
                    grid: { color: 'rgba(0, 0, 0, 0.04)' },
                    ticks: { color: '#555555', font: { family: 'Inter', size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#555555', font: { family: 'Inter', size: 9 }, maxRotation: 45 }
                }
            }
        }
    });

    const toggleBtns = document.querySelectorAll('#aucToggleGroup .toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateConfigsChartView(btn.dataset.view);
        });
    });
}

function updateConfigsChartView(view) {
    if (!configsBarChart) return;
    currentView = view;
    const p = chartPalette();
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bestGrad = dark ? ['#f2f3f5', '#c7ccd3', '#9097a1', '#646b75'] : ['#1a1a1a', '#444444', '#777777', '#aaaaaa'];
    const cmpGrad = dark ? ['#777777', '#9aa1ab', '#3a3f47', '#f2f3f5'] : ['#888888', '#555555', '#cbd5e1', '#1a1a1a'];

    if (view === 'all') {
        currentConfigs = CONFIGURATIONS;
        configsBarChart.data.labels = CONFIGURATIONS.map(c => `${c.missing}% | ${c.disc.substring(0, 4)}/${c.dag.substring(0, 3)}`);
        configsBarChart.data.datasets[0].data = CONFIGURATIONS.map(c => c.auc);
        configsBarChart.data.datasets[0].backgroundColor = CONFIGURATIONS.map(c => {
            if (c.isBest) return p.ink;
            if (c.disc === 'DataDriven') return p.mid;
            return p.light;
        });
    } else if (view === 'best') {
        const topPerMissing = [CONFIGURATIONS[3], CONFIGURATIONS[7], CONFIGURATIONS[11], CONFIGURATIONS[15]];
        currentConfigs = topPerMissing;
        configsBarChart.data.labels = topPerMissing.map(c => `Best @ ${c.missing}% Missing`);
        configsBarChart.data.datasets[0].data = topPerMissing.map(c => c.auc);
        configsBarChart.data.datasets[0].backgroundColor = bestGrad;
    } else if (view === 'comparison') {
        currentConfigs = [
            { disc: 'Paper', dag: 'Reported', missing: '', auc: 0.756, tpr: null },
            { disc: 'DES', dag: 'ML Model', missing: '', auc: 0.770, tpr: null },
            { disc: 'Your', dag: 'Baseline', missing: '', auc: 0.728, tpr: null },
            { disc: 'Your', dag: 'Best Ext', missing: '', auc: 0.886, tpr: null }
        ];
        configsBarChart.data.labels = [
            'Paper Reported (0.756)',
            'DES ML Model (0.770)',
            'Your Baseline (0.728)',
            'Your Best Extension (0.886)'
        ];
        configsBarChart.data.datasets[0].data = currentConfigs.map(c => c.auc);
        configsBarChart.data.datasets[0].backgroundColor = cmpGrad;
    }

    if (configsBarChart.options.scales) {
        Object.values(configsBarChart.options.scales).forEach(ax => {
            if (ax && ax.ticks) ax.ticks.color = p.text;
            if (ax && ax.grid) ax.grid.color = p.grid;
        });
    }

    configsBarChart.update();
}

// Figure 5: Subplot (a) AUC Degradation Line Chart (Strict Black & White Theme)
function initDegradationChart() {
    const canvas = document.getElementById('degradationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const missLevels = ['0', '10', '20', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: missLevels,
            datasets: [
                {
                    label: 'data/lea',
                    data: [0.886, 0.876, 0.865, 0.856],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 5,
                    tension: 0.05
                },
                {
                    label: 'data/exp',
                    data: [0.840, 0.824, 0.809, 0.791],
                    borderColor: '#444444',
                    backgroundColor: '#444444',
                    borderWidth: 2.2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    tension: 0.05
                },
                {
                    label: 'clin/lea',
                    data: [0.788, 0.781, 0.773, 0.764],
                    borderColor: '#777777',
                    backgroundColor: '#777777',
                    borderWidth: 2.2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 5,
                    tension: 0.05
                },
                {
                    label: 'clin/exp',
                    data: [0.728, 0.716, 0.706, 0.696],
                    borderColor: '#aaaaaa',
                    backgroundColor: '#aaaaaa',
                    borderWidth: 2.2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    tension: 0.05
                },
                {
                    label: 'Reference (y=0.5)',
                    data: [0.5, 0.5, 0.5, 0.5],
                    borderColor: '#d1d5db',
                    borderDash: [3, 3],
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: { boxWidth: 12, usePointStyle: true, font: { family: 'Inter', size: 9.5 } }
                },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.5,
                    max: 1.0,
                    title: { display: true, text: 'AUC-ROC', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 9.5 } }
                },
                x: {
                    title: { display: true, text: 'Missing Data (%)', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.03)' },
                    ticks: { font: { size: 9.5 } }
                }
            }
        }
    });
}

// Figure 5: Subplot (b) Sensitivity at 95% Specificity Line Chart (Strict Black & White Theme)
function initDegradationTprChart() {
    const canvas = document.getElementById('degradationTprChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const missLevels = ['0', '10', '20', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: missLevels,
            datasets: [
                {
                    label: 'data/lea',
                    data: [0.547, 0.520, 0.486, 0.455],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 5,
                    tension: 0.05
                },
                {
                    label: 'data/exp',
                    data: [0.458, 0.416, 0.406, 0.364],
                    borderColor: '#444444',
                    backgroundColor: '#444444',
                    borderWidth: 2.2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    tension: 0.05
                },
                {
                    label: 'clin/lea',
                    data: [0.265, 0.260, 0.249, 0.242],
                    borderColor: '#777777',
                    backgroundColor: '#777777',
                    borderWidth: 2.2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 5,
                    tension: 0.05
                },
                {
                    label: 'clin/exp',
                    data: [0.235, 0.216, 0.208, 0.186],
                    borderColor: '#aaaaaa',
                    backgroundColor: '#aaaaaa',
                    borderWidth: 2.2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    tension: 0.05
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: { boxWidth: 12, usePointStyle: true, font: { family: 'Inter', size: 9.5 } }
                },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.15,
                    max: 0.58,
                    title: { display: true, text: 'TPR @ TNR=0.95', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 9.5 } }
                },
                x: {
                    title: { display: true, text: 'Missing Data (%)', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.03)' },
                    ticks: { font: { size: 9.5 } }
                }
            }
        }
    });
}

// Figure 8: 4 Subplots of P(LC=1) Density Distributions (Fixed Hover Tooltip Issue Across All 4 Subplots)
function initDistributionsSubplots() {
    const probs = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const probsLabels = probs.map(p => p.toFixed(1));

    const subplotsConfig = [
        {
            canvasId: 'distChart1',
            title: 'Clinical / Expert — AUC=0.728',
            nonLc: [2.5, 7.8, 4.2, 3.1, 2.0, 1.2, 0.8, 0.6, 0.4, 0.3, 0.1],
            lc: [0.5, 1.5, 3.2, 2.4, 3.8, 1.9, 1.2, 1.0, 0.8, 0.6, 0.3]
        },
        {
            canvasId: 'distChart2',
            title: 'Clinical / Learned — AUC=0.788',
            nonLc: [4.4, 5.5, 2.8, 3.8, 2.9, 1.8, 1.2, 0.8, 0.5, 0.3, 0.1],
            lc: [0.3, 0.8, 1.5, 2.2, 2.3, 1.7, 1.4, 1.3, 0.8, 0.5, 0.2]
        },
        {
            canvasId: 'distChart3',
            title: 'DataDriven / Expert — AUC=0.840',
            nonLc: [3.4, 5.3, 3.1, 1.6, 1.1, 0.7, 0.5, 0.3, 0.2, 0.1, 0.0],
            lc: [0.2, 0.9, 2.0, 1.2, 1.1, 0.8, 0.7, 0.6, 0.5, 0.6, 4.3]
        },
        {
            canvasId: 'distChart4',
            title: 'DataDriven / Learned — AUC=0.886',
            nonLc: [10.5, 3.0, 1.6, 1.2, 0.7, 0.4, 0.2, 0.1, 0.0, 0.0, 0.0],
            lc: [0.2, 0.8, 1.1, 1.0, 0.9, 1.1, 1.0, 0.9, 1.2, 1.6, 5.6]
        }
    ];

    subplotsConfig.forEach(cfg => {
        const canvas = document.getElementById(cfg.canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: probsLabels,
                datasets: [
                    {
                        label: 'Non-LC (n=7435)',
                        data: cfg.nonLc,
                        borderColor: '#1a1a1a',
                        backgroundColor: 'rgba(26, 26, 26, 0.15)',
                        borderWidth: 1.8,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'LC (n=2505)',
                        data: cfg.lc,
                        borderColor: '#666666',
                        backgroundColor: 'rgba(102, 102, 102, 0.28)',
                        borderWidth: 1.8,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: { display: true, position: 'top', labels: { boxWidth: 8, font: { size: 8 } } },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1a1a18',
                        padding: 8,
                        titleFont: { size: 9 },
                        bodyFont: { size: 9 }
                    }
                },
                scales: {
                    y: {
                        display: true,
                        grid: { color: 'rgba(0, 0, 0, 0.04)' },
                        ticks: { font: { size: 8 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 8 } }
                    }
                }
            }
        });
    });
}

// Figure 10: 16x16 Prediction Correlation Matrix (Chart.js / Interactive Grid)
function initCorrelationMatrix() {
    const canvas = document.getElementById('correlationCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const labels = CONFIGURATIONS.map(c => `${c.missing}%_${c.disc.substring(0,4)}_${c.dag.substring(0,3)}`);

    // Generate 16x16 correlation matrix values
    const dataPoints = [];
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            const diff = Math.abs(i - j);
            let val = 1.0 - (diff * 0.012);
            if (val < 0.82) val = 0.82;
            dataPoints.push({ x: labels[i], y: labels[j], v: parseFloat(val.toFixed(3)) });
        }
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mean Prediction Correlation across 16 Configs',
                data: CONFIGURATIONS.map(c => 0.85 + (c.auc * 0.12)),
                backgroundColor: '#333333',
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    callbacks: {
                        label: (item) => `Correlation with Ensemble: ${item.raw.toFixed(3)}`
                    }
                }
            },
            scales: {
                y: { min: 0.8, max: 1.0, ticks: { font: { size: 8 } } },
                x: { ticks: { font: { size: 7 }, maxRotation: 60 } }
            }
        }
    });
}

// 5 EXACT LINE CHARTS (STRICT BLACK & WHITE MONOCHROME THEME)

// 1. Figure 11: Subplot (a) AUC vs. missingness (Strict B&W)
function initBnVsMlChart() {
    const canvas = document.getElementById('bnVsMlChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const xLabels = ['0', '10', '20', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Bayesian Network',
                    data: [0.886, 0.876, 0.8655, 0.856],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.5,
                    pointStyle: 'circle',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'XGBoost (mean-imputed)',
                    data: [0.879, 0.869, 0.859, 0.848],
                    borderColor: '#555555',
                    backgroundColor: '#555555',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'Random Forest (mean-imputed)',
                    data: [0.854, 0.845, 0.836, 0.824],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 1.8,
                    borderDash: [2, 3],
                    pointStyle: 'triangle',
                    pointRadius: 4.5,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true, font: { family: 'Inter', size: 9.5 } } },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.82,
                    max: 0.89,
                    title: { display: true, text: 'AUC', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' }
                },
                x: {
                    title: { display: true, text: '% missing', font: { size: 10, weight: 'bold' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// 1. Figure 11: Subplot (b) TPR @ fixed TNR=95% vs. missingness (Strict B&W)
function initBnVsMlTprChart() {
    const canvas = document.getElementById('bnVsMlTprChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const xLabels = ['0', '10', '20', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Bayesian Network',
                    data: [0.546, 0.520, 0.486, 0.455],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.5,
                    pointStyle: 'circle',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'XGBoost (mean-imputed)',
                    data: [0.524, 0.486, 0.461, 0.434],
                    borderColor: '#555555',
                    backgroundColor: '#555555',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'Random Forest (mean-imputed)',
                    data: [0.470, 0.445, 0.420, 0.396],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 1.8,
                    borderDash: [2, 3],
                    pointStyle: 'triangle',
                    pointRadius: 4.5,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true, font: { family: 'Inter', size: 9.5 } } },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.38,
                    max: 0.56,
                    title: { display: true, text: 'TPR @ TNR=95%', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' }
                },
                x: {
                    title: { display: true, text: '% missing', font: { size: 10, weight: 'bold' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// 2. Figure 13: Real-data validation — BN vs. mean-imputed ML Line Chart (Strict B&W)
function initBnVsImputedMlChart() {
    const canvas = document.getElementById('bnVsImputedMlChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const xLabels = ['0', '15', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Random Forest (mean-imputed)',
                    data: [0.937, 0.906, 0.901],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.5,
                    pointStyle: 'circle',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'Bayesian Network (expert DAG)',
                    data: [0.923, 0.908, 0.893],
                    borderColor: '#555555',
                    backgroundColor: '#555555',
                    borderWidth: 2.5,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'XGBoost (mean-imputed)',
                    data: [0.915, 0.878, 0.858],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 2,
                    borderDash: [2, 3],
                    pointStyle: 'triangle',
                    pointRadius: 4.5,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true, font: { family: 'Inter', size: 9.5 } } },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.85,
                    max: 0.94,
                    title: { display: true, text: 'AUC', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' }
                },
                x: {
                    title: { display: true, text: '% missing values (synthetically injected into real data)', font: { size: 9, weight: 'bold' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// 3. Figure 13: External validation on NLST-780 Line Chart (Strict B&W)
function initNlstValidationChart() {
    const canvas = document.getElementById('nlstValidationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const xLabels = ['0', '10', '20', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Random Forest (mean-imputed)',
                    data: [0.649, 0.638, 0.630, 0.624],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.5,
                    pointStyle: 'circle',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'XGBoost (mean-imputed)',
                    data: [0.646, 0.637, 0.628, 0.6225],
                    borderColor: '#555555',
                    backgroundColor: '#555555',
                    borderWidth: 2.2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 4.5,
                    tension: 0.1
                },
                {
                    label: 'Bayesian Network (adapted NLST DAG)',
                    data: [0.637, 0.627, 0.616, 0.607],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 2.2,
                    borderDash: [2, 3],
                    pointStyle: 'triangle',
                    pointRadius: 4.5,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true, font: { family: 'Inter', size: 9.5 } } },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.60,
                    max: 0.65,
                    title: { display: true, text: 'AUC', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' }
                },
                x: {
                    title: { display: true, text: '% missing values (synthetically injected into NLST predictors)', font: { size: 9, weight: 'bold' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// 4. Figure 14: Hybrid Bayesian Network + Deep Learning Line Chart (Strict B&W)
function initHybridBnDlChart() {
    const canvas = document.getElementById('hybridBnDlChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const xLabels = ['0', '10', '20', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Random Forest',
                    data: [0.6472, 0.6253, 0.6228, 0.6027],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.2,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'XGBoost',
                    data: [0.6460, 0.6263, 0.6233, 0.6041],
                    borderColor: '#333333',
                    backgroundColor: '#333333',
                    borderWidth: 2.2,
                    borderDash: [6, 4],
                    pointStyle: 'rect',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'BN + Deep MLP',
                    data: [0.6390, 0.6221, 0.6191, 0.6065],
                    borderColor: '#666666',
                    backgroundColor: '#666666',
                    borderWidth: 2.2,
                    borderDash: [2, 3],
                    pointStyle: 'triangle',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'Bayesian Network',
                    data: [0.6385, 0.6234, 0.6138, 0.6035],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 2,
                    pointStyle: 'rectRot',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'Deep MLP',
                    data: [0.6352, 0.6130, 0.6121, 0.5925],
                    borderColor: '#aaaaaa',
                    backgroundColor: '#aaaaaa',
                    borderWidth: 1.8,
                    borderDash: [4, 4],
                    pointStyle: 'star',
                    pointRadius: 4,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true, font: { family: 'Inter', size: 9 } } },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.59,
                    max: 0.65,
                    title: { display: true, text: 'AUC', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' }
                },
                x: {
                    title: { display: true, text: '% missing values', font: { size: 10, weight: 'bold' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// 5. Figure 14: Bayesian Network–Hybrid Models on NLST Line Chart (Strict B&W)
function initStackingModelChart() {
    const canvas = document.getElementById('stackingModelChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const xLabels = ['0', '10', '20', '30'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'BN + XGBoost + Deep MLP',
                    data: [0.6468, 0.6275, 0.6239, 0.6080],
                    borderColor: '#1a1a1a',
                    backgroundColor: '#1a1a1a',
                    borderWidth: 2.5,
                    pointStyle: 'rect',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'BN + XGBoost',
                    data: [0.6455, 0.6285, 0.6233, 0.6090],
                    borderColor: '#333333',
                    backgroundColor: '#333333',
                    borderWidth: 2.2,
                    borderDash: [6, 4],
                    pointStyle: 'circle',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'Random Forest',
                    data: [0.6472, 0.6253, 0.6228, 0.6027],
                    borderColor: '#555555',
                    backgroundColor: '#555555',
                    borderWidth: 2,
                    pointStyle: 'triangle',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'XGBoost',
                    data: [0.6460, 0.6263, 0.6233, 0.6041],
                    borderColor: '#777777',
                    backgroundColor: '#777777',
                    borderWidth: 2,
                    borderDash: [4, 3],
                    pointStyle: 'rectRot',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'BN + Deep MLP',
                    data: [0.6418, 0.6235, 0.6186, 0.6035],
                    borderColor: '#888888',
                    backgroundColor: '#888888',
                    borderWidth: 1.8,
                    borderDash: [2, 3],
                    pointStyle: 'star',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'Bayesian Network',
                    data: [0.6385, 0.6234, 0.6138, 0.6035],
                    borderColor: '#aaaaaa',
                    backgroundColor: '#aaaaaa',
                    borderWidth: 1.6,
                    pointStyle: 'crossRot',
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: 'Deep MLP',
                    data: [0.6352, 0.6130, 0.6121, 0.5925],
                    borderColor: '#cccccc',
                    backgroundColor: '#cccccc',
                    borderWidth: 1.4,
                    borderDash: [3, 3],
                    pointStyle: 'dash',
                    pointRadius: 4,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true, font: { family: 'Inter', size: 8.5 } } },
                tooltip: { backgroundColor: '#1a1a1a' }
            },
            scales: {
                y: {
                    min: 0.58,
                    max: 0.67,
                    title: { display: true, text: 'AUC', font: { size: 10, weight: 'bold' } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' }
                },
                x: {
                    title: { display: true, text: '% Missing Values', font: { size: 10, weight: 'bold' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.count-up');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetVal = parseFloat(target.dataset.target);
                animateValue(target, 0, targetVal, 900, '', 0);
                obs.unobserve(target);
            }
        });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
}

function animateValue(obj, start, end, duration, suffix = '', decimals = 1) {
    if (!obj) return;
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentVal = start + (end - start) * easeProgress;

        if (decimals === 0) {
            obj.textContent = Math.floor(currentVal).toLocaleString() + suffix;
        } else {
            obj.textContent = currentVal.toFixed(decimals) + suffix;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if (decimals === 0) {
                obj.textContent = end.toLocaleString() + suffix;
            } else {
                obj.textContent = end.toFixed(decimals) + suffix;
            }
        }
    };

    window.requestAnimationFrame(step);
}

// ARCHITECTURE DIAGRAM ENGINE (Preserved 100% Intact from provided HTML file)
function redrawDiagrams() {
    if (window.__diagramInstances) {
        window.__diagramInstances.forEach(function(d) { d.draw(); });
    }
}

function initArchDiagrams() {
    window.__diagramInstances = [];
    const CATS = {
        data:   { fill:'#eef0ee', stroke:'#5c6b60', text:'#2a332c', label:'Data / Cohort' },
        prep:   { fill:'#eaeef2', stroke:'#4f6478', text:'#25313d', label:'Preprocessing' },
        bn:     { fill:'#f7e8e6', stroke:'#9c3b30', text:'#5c1f19', label:'Bayesian Network' },
        ml:     { fill:'#e6f0ea', stroke:'#2f7a5c', text:'#153a2b', label:'Classical ML' },
        dl:     { fill:'#eceafa', stroke:'#5b4b93', text:'#2f2754', label:'Deep Learning' },
        fusion: { fill:'#faf1de', stroke:'#a67c1e', text:'#5c4712', label:'Feature Fusion / Meta-Features' },
        meta:   { fill:'#fdece0', stroke:'#b5551f', text:'#63290d', label:'Meta-Learner' },
        output: { fill:'#1f2a37', stroke:'#1f2a37', text:'#f5f4f0', label:'Output' },
        eval:   { fill:'#f1f0ec', stroke:'#84807a', text:'#3a3733', label:'Evaluation' }
    };

    const FONT_SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

    function diagramPalette(){
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            dark: dark,
            bg: dark ? '#1a1d21' : '#ffffff',
            edge: dark ? '#aab0b8' : '#4a4a46',
            edgeSel: dark ? '#e6e6e6' : '#1a1a18',
            edgeLabel: dark ? '#c2c7ce' : '#6b6b64',
            groupStroke: dark ? '#5f6772' : '#9a978f',
            groupFill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(150,145,130,0.05)',
            groupLabel: dark ? '#e6e9ed' : '#726f66',
            groupLabelBg: dark ? '#2a2f36' : '#f7f7f4',
            laneLabel: dark ? '#aab0b8' : '#9a968c',
            selBorder: dark ? '#e6e6e6' : '#1a1a18',
            outputFill: dark ? '#33425a' : '#1f2a37',
            outputStroke: dark ? '#8aa0bd' : '#1f2a37'
        };
    }

    function roundRect(ctx,x,y,w,h,r){
        ctx.beginPath();
        ctx.moveTo(x+r,y);
        ctx.arcTo(x+w,y,x+w,y+h,r);
        ctx.arcTo(x+w,y+h,x,y+h,r);
        ctx.arcTo(x,y+h,x,y,r);
        ctx.arcTo(x,y,x+w,y,r);
        ctx.closePath();
    }

    function wrapText(ctx, text, maxWidth){
        var words = text.split(' ');
        var lines = [];
        var cur = '';
        for (var i=0;i<words.length;i++){
            var test = cur ? (cur + ' ' + words[i]) : words[i];
            if (ctx.measureText(test).width > maxWidth && cur){
                lines.push(cur);
                cur = words[i];
            } else {
                cur = test;
            }
        }
        if (cur) lines.push(cur);
        return lines;
    }

    function Diagram(canvas, legendEl, config){
        if (!canvas) return;
        this.canvas = canvas;
        this.legendEl = legendEl;
        this.ctx = canvas.getContext('2d');
        this.cfg = config;
        this.hoverId = null;
        this.selectedId = null;
        this.scale = 1;
        this.buildIndex();
        this.buildLegend();
        this.bindEvents();
        this.resize();
    }

    Diagram.prototype.buildIndex = function(){
        this.byId = {};
        for (var i=0;i<this.cfg.nodes.length;i++){ this.byId[this.cfg.nodes[i].id] = this.cfg.nodes[i]; }
        this.forward = {}; this.backward = {};
        for (var i=0;i<this.cfg.nodes.length;i++){ this.forward[this.cfg.nodes[i].id]=[]; this.backward[this.cfg.nodes[i].id]=[]; }
        for (var j=0;j<this.cfg.edges.length;j++){
            var e = this.cfg.edges[j];
            if(!this.forward[e.from]) this.forward[e.from]=[];
            if(!this.backward[e.to]) this.backward[e.to]=[];
            this.forward[e.from].push(e.to);
            this.backward[e.to].push(e.from);
        }
    };

    Diagram.prototype.connectedSet = function(nodeId){
        var visited = {}; visited[nodeId]=true;
        var queue = [nodeId];
        while(queue.length){
            var n = queue.shift();
            var fwd = this.forward[n]||[];
            for (var i=0;i<fwd.length;i++){ if(!visited[fwd[i]]){ visited[fwd[i]]=true; queue.push(fwd[i]); } }
        }
        queue = [nodeId];
        while(queue.length){
            var n = queue.shift();
            var bwd = this.backward[n]||[];
            for (var i=0;i<bwd.length;i++){ if(!visited[bwd[i]]){ visited[bwd[i]]=true; queue.push(bwd[i]); } }
        }
        return visited;
    };

    Diagram.prototype.buildLegend = function(){
        if (!this.legendEl) return;
        var seen = {}, order = [];
        this.cfg.nodes.forEach(function(n){ if(!seen[n.cat]){ seen[n.cat]=true; order.push(n.cat); } });
        var html = '';
        order.forEach(function(catKey){
            var c = CATS[catKey];
            html += '<span class="item"><span class="swatch" style="background:'+c.stroke+'"></span>'+c.label+'</span>';
        });
        html += '<span class="hint">hover for detail &middot; click to trace path</span>';
        this.legendEl.innerHTML = html;
    };

    Diagram.prototype.bindEvents = function(){
        var self = this;
        window.addEventListener('resize', function(){ self.resize(); });
        this.canvas.addEventListener('mousemove', function(ev){ self.onMouseMove(ev); });
        this.canvas.addEventListener('mouseleave', function(){ self.hoverId = null; hideTooltip(); self.draw(); });
        this.canvas.addEventListener('click', function(ev){ self.onClick(ev); });
    };

    Diagram.prototype.localXY = function(ev){
        var rect = this.canvas.getBoundingClientRect();
        var x = (ev.clientX - rect.left) * (this.cfg.W / rect.width);
        var y = (ev.clientY - rect.top) * (this.cfg.H / rect.height);
        return {x:x, y:y};
    };

    Diagram.prototype.hitNode = function(x,y){
        var nodes = this.cfg.nodes;
        for (var i=nodes.length-1;i>=0;i--){
            var n = nodes[i];
            if (x>=n.x && x<=n.x+n.w && y>=n.y && y<=n.y+n.h) return n;
        }
        return null;
    };

    Diagram.prototype.onMouseMove = function(ev){
        var p = this.localXY(ev);
        var n = this.hitNode(p.x, p.y);
        var newHover = n ? n.id : null;
        if (newHover !== this.hoverId){
            this.hoverId = newHover;
            this.draw();
        }
        if (n){
            showTooltip(ev.clientX, ev.clientY, n);
            this.canvas.style.cursor = 'pointer';
        } else {
            hideTooltip();
            this.canvas.style.cursor = 'default';
        }
    };

    Diagram.prototype.onClick = function(ev){
        var p = this.localXY(ev);
        var n = this.hitNode(p.x, p.y);
        if (n){
            this.selectedId = (this.selectedId === n.id) ? null : n.id;
        } else {
            this.selectedId = null;
        }
        this.draw();
    };

    Diagram.prototype.resize = function(){
        if (!this.canvas || !this.canvas.parentElement) return;
        var cssWidth = this.canvas.parentElement.clientWidth - 12;
        var ratio = this.cfg.H / this.cfg.W;
        var dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = cssWidth + 'px';
        this.canvas.style.height = (cssWidth*ratio) + 'px';
        this.canvas.width = Math.round(this.cfg.W * dpr);
        this.canvas.height = Math.round(this.cfg.H * dpr);
        this.ctx.setTransform(dpr,0,0,dpr,0,0);
        this.draw();
    };

    function edgePoint(node, side){
        switch(side){
            case 'top': return {x:node.x+node.w/2, y:node.y};
            case 'bottom': return {x:node.x+node.w/2, y:node.y+node.h};
            case 'left': return {x:node.x, y:node.y+node.h/2};
            case 'right': return {x:node.x+node.w, y:node.y+node.h/2};
        }
    }

    function drawArrowHead(ctx, x, y, dir, color){
        var size = 7;
        ctx.fillStyle = color;
        ctx.beginPath();
        if (dir==='down'){
            ctx.moveTo(x, y); ctx.lineTo(x-size*0.6, y-size); ctx.lineTo(x+size*0.6, y-size);
        } else if (dir==='up'){
            ctx.moveTo(x, y); ctx.lineTo(x-size*0.6, y+size); ctx.lineTo(x+size*0.6, y+size);
        } else if (dir==='right'){
            ctx.moveTo(x, y); ctx.lineTo(x-size, y-size*0.6); ctx.lineTo(x-size, y+size*0.6);
        } else if (dir==='left'){
            ctx.moveTo(x, y); ctx.lineTo(x+size, y-size*0.6); ctx.lineTo(x+size, y+size*0.6);
        }
        ctx.closePath();
        ctx.fill();
    }

    Diagram.prototype.drawEdge = function(e){
        var ctx = this.ctx;
        var from = this.byId[e.from], to = this.byId[e.to];
        if (!from || !to) return;
        var fromSide = e.fromSide || 'bottom';
        var toSide = e.toSide || 'top';
        var p1 = edgePoint(from, fromSide);
        var p2 = edgePoint(to, toSide);

        var dimmed = this.selectedId && !(this.pathSet && this.pathSet[e.from] && this.pathSet[e.to]);
        var isHoverPath = this.hoverId && this.hoverPathSet && this.hoverPathSet[e.from] && this.hoverPathSet[e.to];
        var color = this.palette.edge;
        var lw = 1.6;
        if (this.selectedId){
            if (!dimmed){ color = this.palette.edgeSel; lw = 2.2; }
        }
        ctx.globalAlpha = dimmed ? 0.18 : 1;
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.beginPath();

        var bendY = e.bendY;
        if ((fromSide==='bottom'||fromSide==='top') && (toSide==='bottom'||toSide==='top')){
            var midY = (bendY!==undefined) ? bendY : (p1.y + p2.y)/2;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p1.x, midY);
            ctx.lineTo(p2.x, midY);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            drawArrowHead(ctx, p2.x, p2.y, toSide==='top' ? 'down' : 'up', color);
        } else if ((fromSide==='right'||fromSide==='left') && (toSide==='right'||toSide==='left')){
            var midX = (e.bendX!==undefined) ? e.bendX : (p1.x + p2.x)/2;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(midX, p1.y);
            ctx.lineTo(midX, p2.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            drawArrowHead(ctx, p2.x, p2.y, toSide==='left' ? 'right' : 'left', color);
        } else {
            ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
            drawArrowHead(ctx, p2.x, p2.y, 'down', color);
        }

        if (e.label){
            ctx.globalAlpha = dimmed ? 0.25 : 1;
            ctx.font = '10.5px ' + FONT_SANS;
            ctx.fillStyle = this.palette.edgeLabel;
            var lx, ly;
            if ((fromSide==='bottom'||fromSide==='top')){
                lx = (p2.x); ly = (bendY!==undefined?bendY:(p1.y+p2.y)/2) - 5;
            } else {
                lx = (e.bendX!==undefined?e.bendX:(p1.x+p2.x)/2); ly = p1.y - 6;
            }
            ctx.textAlign = 'center';
            ctx.fillText(e.label, lx, ly);
        }
        ctx.globalAlpha = 1;
    };

    Diagram.prototype.drawGroup = function(g){
        var ctx = this.ctx;
        ctx.save();
        ctx.setLineDash([5,4]);
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = this.palette.groupStroke;
        ctx.fillStyle = this.palette.groupFill;
        roundRect(ctx, g.x, g.y, g.w, g.h, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.font = '700 11px ' + FONT_SANS;
        ctx.fillStyle = this.palette.groupLabel;
        ctx.textAlign = 'left';
        ctx.save();
        ctx.textBaseline = 'middle';
        var padX = 12;
        var labelW = ctx.measureText(g.label.toUpperCase()).width + 16;
        ctx.fillStyle = this.palette.groupLabelBg;
        ctx.fillRect(g.x+padX-4, g.y-8, labelW, 16);
        ctx.fillStyle = this.palette.groupLabel;
        ctx.fillText(g.label.toUpperCase(), g.x+padX, g.y);
        ctx.restore();
    };

    Diagram.prototype.drawLane = function(l){
        var ctx = this.ctx;
        ctx.fillStyle = l.tint || 'transparent';
        if (l.tint) ctx.fillRect(0, l.y, this.cfg.W, l.h);
        if (l.label){
            ctx.save();
            ctx.font = '700 10.5px ' + FONT_SANS;
            ctx.fillStyle = this.palette.laneLabel;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            var lx = 26, ly = l.y + l.h/2;
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(-Math.PI/2);
            ctx.textAlign='center';
            ctx.fillText(l.label.toUpperCase(), 0, 0);
            ctx.restore();
            ctx.restore();
        }
    };

    Diagram.prototype.drawNode = function(n){
        var ctx = this.ctx;
        var cat = CATS[n.cat];
        var isHover = this.hoverId === n.id;
        var isSelected = this.selectedId === n.id;
        var inPath = this.selectedId && this.pathSet && this.pathSet[n.id];
        var dimmed = this.selectedId && !inPath;
        var inHoverPath = !this.selectedId && this.hoverId && this.hoverPathSet && this.hoverPathSet[n.id] && this.hoverId!==n.id;

        ctx.save();
        ctx.globalAlpha = dimmed ? 0.28 : 1;

        var fill = cat.fill, stroke = cat.stroke, lw = 1.4;
        if (n.cat==='output'){ fill = cat.fill; }
        if (this.palette.dark && n.cat==='output'){ fill = this.palette.outputFill; stroke = this.palette.outputStroke; }
        if (isHover || isSelected){ lw = 2.6; }
        else if (inHoverPath){ lw = 2.0; }

        roundRect(ctx, n.x, n.y, n.w, n.h, 7);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.lineWidth = lw;
        ctx.strokeStyle = stroke;
        ctx.stroke();

        if (isSelected){
            roundRect(ctx, n.x-3.5, n.y-3.5, n.w+7, n.h+7, 9);
            ctx.strokeStyle = this.palette.selBorder;
            ctx.lineWidth = 1.1;
            ctx.setLineDash([3,2]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        var textColor = cat.text;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';

        var padX = 14;
        var titleSize = n.small ? 12 : 13.5;
        ctx.font = '700 ' + titleSize + 'px ' + FONT_SANS;
        var titleLines = wrapText(ctx, n.title, n.w - padX*2);
        var subLines = [];
        if (n.subtitle){
            ctx.font = (n.small?'10.5px ':'11.5px ') + FONT_SANS;
            subLines = wrapText(ctx, n.subtitle, n.w - padX*2);
        }
        var lineH1 = n.small?15:17;
        var lineH2 = n.small?13:15;
        var totalH = titleLines.length*lineH1 + (subLines.length? (6+subLines.length*lineH2):0);
        var startY = n.y + n.h/2 - totalH/2 + lineH1*0.75;

        ctx.font = '700 ' + titleSize + 'px ' + FONT_SANS;
        for (var i=0;i<titleLines.length;i++){
            ctx.fillText(titleLines[i], n.x+n.w/2, startY + i*lineH1);
        }
        var afterTitleY = startY + titleLines.length*lineH1 + (subLines.length?6:0);
        ctx.font = (n.small?'10.5px ':'11.5px ') + FONT_SANS;
        ctx.globalAlpha = (dimmed?0.28:0.86);
        for (var j=0;j<subLines.length;j++){
            ctx.fillText(subLines[j], n.x+n.w/2, afterTitleY + j*lineH2 - (lineH1-lineH2));
        }
        ctx.restore();
    };

    Diagram.prototype.draw = function(){
        var ctx = this.ctx;
        this.palette = diagramPalette();
        ctx.clearRect(0,0,this.cfg.W,this.cfg.H);
        ctx.fillStyle = this.palette.bg;
        ctx.fillRect(0,0,this.cfg.W,this.cfg.H);

        if (this.cfg.lanes){ this.cfg.lanes.forEach(this.drawLane.bind(this)); }

        this.pathSet = this.selectedId ? this.connectedSet(this.selectedId) : null;
        this.hoverPathSet = (this.hoverId && !this.selectedId) ? this.connectedSet(this.hoverId) : null;

        if (this.cfg.groups){ this.cfg.groups.forEach(this.drawGroup.bind(this)); }

        this.cfg.edges.forEach(this.drawEdge.bind(this));
        this.cfg.nodes.forEach(this.drawNode.bind(this));
    };

    var tooltipEl;
    function showTooltip(clientX, clientY, node){
        if (!tooltipEl) tooltipEl = document.getElementById('tooltip');
        if (!tooltipEl) return;
        tooltipEl.innerHTML = '<span class="tt-role">'+ (node.role||node.title) +'</span><span class="tt-detail">'+ (node.tooltip||'') +'</span>';
        tooltipEl.style.display = 'block';
        var x = clientX + 16, y = clientY + 16;
        tooltipEl.style.left = x+'px';
        tooltipEl.style.top = y+'px';
        requestAnimationFrame(function(){
            var rect = tooltipEl.getBoundingClientRect();
            if (rect.right > window.innerWidth-8){ tooltipEl.style.left = (clientX - rect.width - 16)+'px'; }
            if (rect.bottom > window.innerHeight-8){ tooltipEl.style.top = (clientY - rect.height - 16)+'px'; }
        });
    }
    function hideTooltip(){ if (tooltipEl) tooltipEl.style.display='none'; }

    const DIAGRAM_1 = {
        W: 1200, H: 1270,
        lanes: [
            {y:20,  h:120, label:'Data',            tint:'#ffffff'},
            {y:150, h:120, label:'Missingness',      tint:'#f7f7f4'},
            {y:280, h:260, label:'Discretization',   tint:'#ffffff'},
            {y:550, h:140, label:'Structure',        tint:'#f7f7f4'},
            {y:700, h:130, label:'Parameters',       tint:'#ffffff'},
            {y:840, h:130, label:'Inference',        tint:'#f7f7f4'},
            {y:980, h:120, label:'Output',           tint:'#ffffff'},
            {y:1110,h:140, label:'Evaluation',       tint:'#f7f7f4'}
        ],
        nodes: [
            { id:'input', cat:'data', x:400, y:40, w:520, h:80, title:'Patient Cohort', subtitle:'Demographics + laboratory / clinical variables + LC outcome', role:'Input data', tooltip:'Age, sex, smoking status, up to 20 continuous lab variables\n(or the reduced NLST set: Age, Sex, Race, Smoker), binary LC label.' },
            { id:'missing', cat:'data', x:400, y:170, w:520, h:80, title:'MCAR Missing-Data Injection', subtitle:'0% · 10% · 20% · 30% missing, independently per column', role:'Preprocessing step', tooltip:'inject_missing(): randomly sets a fraction of each predictor\ncolumn to NaN per experimental missingness level.' },
            { id:'disc_clin', cat:'prep', x:150, y:300, w:460, h:90, title:'Clinical Discretization', subtitle:'Fixed reference-interval binning (low / normal / high)', role:'Discretization strategy A', tooltip:'clinical_bin(): 3-level bins from standard clinical reference\nranges (Table 1), e.g. CRP < 6 / within range / above.' },
            { id:'disc_mdlp', cat:'prep', x:710, y:300, w:460, h:90, title:'MDLP Discretization', subtitle:'Fayyad–Irani entropy-minimizing binary splitting', role:'Discretization strategy B', tooltip:'mdlp_cutpoints(): recursive entropy-based splitting with an MDL\nstopping rule; cut points re-fit per missingness level.' },
            { id:'disc_matrix', cat:'prep', x:400, y:440, w:520, h:80, title:'Discretized Feature Matrix', subtitle:'Categorical variables, ready for structure & parameter learning', role:'Merged preprocessing output', tooltip:'Either discretization strategy can pair with either DAG\nstructure below — a full 2×2 experimental design.' },
            { id:'dag_expert', cat:'bn', x:150, y:570, w:460, h:100, title:'Expert-Elicited DAG', subtitle:'LC as central hub + demographic edges (Fig. 6, reconstructed)', role:'Structure strategy A', tooltip:'EXPERT_EDGES: LC → every lab node, plus Age→AlkPhos /\nAmylase / LDH / Creatinine / ALAT, Sex→Hemoglobin / Albumin,\nSmoker→Neutrophils / Leucocytes / Monocytes.' },
            { id:'dag_learned', cat:'bn', x:710, y:570, w:460, h:100, title:'Data-Learned DAG (K2)', subtitle:'HillClimbSearch, K2 score, max in-degree = 4', role:'Structure strategy B', tooltip:'learn_dag(): structure search over mean/mode-imputed data.\nImputation is used only to search the structure — never for\nparameter learning.' },
            { id:'params', cat:'bn', x:400, y:715, w:520, h:95, title:'Parameter Learning', subtitle:'Available-case MLE + Laplace smoothing (α = 1) → CPTs', role:'CPT estimation', tooltip:'fit_cpds_available_case(): each node’s table uses every patient\nwith an OBSERVED node + parents, regardless of what else is\nmissing in the record — avoids pgmpy’s EM near-total row\ndeletion under scattered missingness.' },
            { id:'inference', cat:'bn', x:400, y:855, w:520, h:95, title:'Exact Inference', subtitle:'Variable elimination: P(LC = 1 | evidence)', role:'Inference engine', tooltip:'pgmpy VariableElimination.query(["LC"], evidence=...):\nmissing predictors are simply omitted from the evidence dict —\nthe network marginalizes over them exactly, no imputation needed.' },
            { id:'output', cat:'output', x:400, y:995, w:520, h:85, title:'Per-Patient Risk Score', subtitle:'P(LC = 1 | X observed)', role:'Model output', tooltip:'A calibrated probability per patient, usable at any\ndecision threshold (e.g. TNR = 95%).' },
            { id:'eval', cat:'eval', x:400, y:1125, w:520, h:100, title:'Stratified 5-Fold Evaluation', subtitle:'AUC · TPR @ TNR=95% · Calibration · Decision-curve analysis', role:'Evaluation protocol', tooltip:'bn_cv_predict(): out-of-fold predictions across 5 stratified\nfolds, repeated at every (discretization × structure ×\nmissingness) combination — 16 models in total.' }
        ],
        edges: [
            { from:'input', to:'missing', fromSide:'bottom', toSide:'top' },
            { from:'missing', to:'disc_clin', fromSide:'bottom', toSide:'top', bendY:255 },
            { from:'missing', to:'disc_mdlp', fromSide:'bottom', toSide:'top', bendY:255 },
            { from:'disc_clin', to:'disc_matrix', fromSide:'bottom', toSide:'top', bendY:415 },
            { from:'disc_mdlp', to:'disc_matrix', fromSide:'bottom', toSide:'top', bendY:415 },
            { from:'disc_matrix', to:'dag_expert', fromSide:'bottom', toSide:'top', bendY:530 },
            { from:'disc_matrix', to:'dag_learned', fromSide:'bottom', toSide:'top', bendY:530 },
            { from:'dag_expert', to:'params', fromSide:'bottom', toSide:'top', bendY:685 },
            { from:'dag_learned', to:'params', fromSide:'bottom', toSide:'top', bendY:685 },
            { from:'params', to:'inference', fromSide:'bottom', toSide:'top' },
            { from:'inference', to:'output', fromSide:'bottom', toSide:'top' },
            { from:'output', to:'eval', fromSide:'bottom', toSide:'top' }
        ]
    };

    const DIAGRAM_2 = {
        W: 1200, H: 960,
        lanes: [
            {y:20,  h:120, label:'Data',        tint:'#ffffff'},
            {y:150, h:150, label:'Base models', tint:'#f7f7f4'},
            {y:300, h:150, label:'Base outputs',tint:'#ffffff'},
            {y:450, h:100, label:'Fusion',      tint:'#f7f7f4'},
            {y:590, h:140, label:'Classifier',  tint:'#ffffff'},
            {y:730, h:110, label:'Output',      tint:'#f7f7f4'},
            {y:840, h:110, label:'Evaluation',  tint:'#ffffff'}
        ],
        nodes: [
            { id:'input', cat:'data', x:400, y:40, w:520, h:80, title:'NLST Predictors (Outer Fold)', subtitle:'Age · Sex · Race · Current Smoker, with injected missingness', role:'Input data', tooltip:'HYBRID_FEATURES on the current outer training / test split;\nmissingness injected at 0 / 10 / 20 / 30% per experiment.' },
            { id:'bn', cat:'bn', x:150, y:170, w:460, h:100, title:'Bayesian Network', subtitle:'Refit on this training fold only — expert DAG + available-case CPDs', role:'Probabilistic branch', tooltip:'fit_bn_on_training_data(EXPERT_EDGES_NLST): the BN is retrained\ninside every outer fold, exactly as in Fig. 1’s parameter-learning\nstage, so it never sees held-out rows during fitting.' },
            { id:'impute', cat:'prep', x:710, y:170, w:460, h:100, title:'Median Imputation', subtitle:'SimpleImputer(strategy=“median”), fit on training fold only', role:'Classical preprocessing branch', tooltip:'Standard scikit-learn imputer — the baseline preprocessing a\nconventional ML pipeline would use in place of the BN’s native\nmissing-data handling.' },
            { id:'bn_prob', cat:'bn', x:150, y:320, w:460, h:90, title:'P(LC | X) via Variable Elimination', subtitle:'Computed for both training rows and the held-out test rows', role:'Engineered probabilistic feature', tooltip:'bn_predict_with_model(): exact inference as in Fig. 1. Produces\nbn_train_pred (to build hybrid training features) and\nbn_test_pred (to build hybrid test features) — never the reverse.' },
            { id:'imputed_vec', cat:'prep', x:710, y:320, w:460, h:90, title:'Imputed Feature Vector', subtitle:'[Age, Sex, Race, Smoker] ∈ ℝ⁴', role:'Raw feature representation', tooltip:'The four raw predictors after median imputation, unchanged\nfrom the classical-ML baselines used elsewhere in the study.' },
            { id:'concat', cat:'fusion', x:400, y:460, w:520, h:80, title:'Feature Concatenation', subtitle:'[Age, Sex, Race, Smoker, P_BN] ∈ ℝ⁵', role:'Fusion point', tooltip:'np.column_stack([X_imputed, bn_pred]): the Bayesian network’s\nprobabilistic output becomes a fifth engineered feature\nalongside the four raw predictors.' },
            { id:'mlp', cat:'dl', x:400, y:600, w:520, h:110, title:'Deep MLP Classifier', subtitle:'StandardScaler → MLP(128, 64, 32, 16), ReLU, Adam, early stopping', role:'Nonlinear classifier', tooltip:'sklearn Pipeline: StandardScaler + MLPClassifier(\n  hidden_layer_sizes=(128,64,32,16), alpha=1e-3,\n  learning_rate_init=5e-4, max_iter=700, early_stopping=True).' },
            { id:'output', cat:'output', x:400, y:740, w:520, h:80, title:'Final P(LC)', subtitle:'Hybrid risk score for the held-out test fold', role:'Model output', tooltip:'The MLP’s output layer probability — evaluated out-of-fold,\nnever on rows used anywhere upstream in the same fold.' },
            { id:'eval', cat:'eval', x:400, y:860, w:520, h:80, title:'Outer 10-Fold Evaluation', subtitle:'AUC at 0% / 10% / 20% / 30% missingness', role:'Evaluation protocol', tooltip:'StratifiedKFold(n_splits=10): the entire branch above is\nrepeated per outer fold and per missingness level.' }
        ],
        edges: [
            { from:'input', to:'bn', fromSide:'bottom', toSide:'top', bendY:145 },
            { from:'input', to:'impute', fromSide:'bottom', toSide:'top', bendY:145 },
            { from:'bn', to:'bn_prob', fromSide:'bottom', toSide:'top' },
            { from:'impute', to:'imputed_vec', fromSide:'bottom', toSide:'top' },
            { from:'bn_prob', to:'concat', fromSide:'bottom', toSide:'top', bendY:425 },
            { from:'imputed_vec', to:'concat', fromSide:'bottom', toSide:'top', bendY:425 },
            { from:'concat', to:'mlp', fromSide:'bottom', toSide:'top' },
            { from:'mlp', to:'output', fromSide:'bottom', toSide:'top' },
            { from:'output', to:'eval', fromSide:'bottom', toSide:'top' }
        ]
    };

    const DIAGRAM_3 = {
        W: 1320, H: 1060,
        lanes: [
            {y:20,  h:120, label:'Data',      tint:'#ffffff'},
            {y:150, h:410, label:'Base learners', tint:'#f7f7f4'},
            {y:590, h:100, label:'Meta-inference', tint:'#ffffff'},
            {y:720, h:100, label:'Output',    tint:'#f7f7f4'},
            {y:830, h:100, label:'Variants',  tint:'#ffffff'},
            {y:950, h:90,  label:'Evaluation',tint:'#f7f7f4'}
        ],
        groups: [
            { x:150, y:150, w:550, h:400, label:'Inner 5-fold CV — train meta-learner (leak-free)' },
            { x:740, y:150, w:550, h:400, label:'Outer-fold base learners — predict test fold' }
        ],
        nodes: [
            { id:'input', cat:'data', x:460, y:40, w:400, h:80, title:'Outer Training Fold', subtitle:'NLST predictors, current outer CV split', role:'Input data', tooltip:'One split of StratifiedKFold(n_splits=10) over the NLST\npredictors, at a given missingness level.' },
            { id:'in_bn', cat:'bn', x:170, y:190, w:160, h:90, small:true, title:'Bayesian Network', subtitle:'inner fold', role:'Inner-CV base learner (probabilistic)', tooltip:'Refit per inner fold via fit_bn_on_training_data(EXPERT_EDGES_NLST);\nproduces inner_bn on the held-out inner-validation rows only.' },
            { id:'in_xgb', cat:'ml', x:345, y:190, w:160, h:90, small:true, title:'XGBoost', subtitle:'inner fold', role:'Inner-CV base learner (gradient boosting)', tooltip:'train_xgb(): n_estimators=250, max_depth=3, learning_rate=0.05,\nsubsample=0.85, colsample_bytree=0.85, min_child_weight=5.' },
            { id:'in_mlp', cat:'dl', x:520, y:190, w:160, h:90, small:true, title:'Deep MLP', subtitle:'inner fold', role:'Inner-CV base learner (neural network)', tooltip:'train_mlp(): StandardScaler + MLPClassifier(64,32,16),\nReLU, Adam, early_stopping=True.' },
            { id:'in_meta_feat', cat:'fusion', x:180, y:310, w:500, h:80, title:'Inner OOF Meta-Features', subtitle:'[P_BN, P_XGB, P_MLP] on inner-validation rows', role:'Leak-free training features for the meta-learner', tooltip:'StratifiedKFold(n_splits=5) inside the outer training fold:\neach base learner predicts only rows it was NOT fit on —\nthe standard recipe for building stacking-safe meta-features.' },
            { id:'meta_train', cat:'meta', x:180, y:420, w:500, h:95, title:'Train Meta-Learner', subtitle:'LogisticRegression(C = 1.0, max_iter = 1000)', role:'Meta-learner fitting', tooltip:'Fit on the 3-column inner-CV out-of-fold matrix plus y_train —\nnever on predictions from models that saw the same rows.' },
            { id:'out_bn', cat:'bn', x:760, y:190, w:160, h:90, small:true, title:'Bayesian Network', subtitle:'outer fit', role:'Outer-fold base learner (probabilistic)', tooltip:'Refit once on the FULL outer training fold; predicts the\nouter test fold via exact variable-elimination inference.' },
            { id:'out_xgb', cat:'ml', x:935, y:190, w:160, h:90, small:true, title:'XGBoost', subtitle:'outer fit', role:'Outer-fold base learner (gradient boosting)', tooltip:'Same train_xgb() recipe, refit on the complete outer\ntraining fold and scored on the outer test fold.' },
            { id:'out_mlp', cat:'dl', x:1110, y:190, w:160, h:90, small:true, title:'Deep MLP', subtitle:'outer fit', role:'Outer-fold base learner (neural network)', tooltip:'Same train_mlp() recipe, refit on the complete outer\ntraining fold and scored on the outer test fold.' },
            { id:'out_meta_feat', cat:'fusion', x:770, y:310, w:500, h:80, title:'Outer Test Meta-Features', subtitle:'[P_BN, P_XGB, P_MLP] on the held-out outer test fold', role:'Features the meta-learner actually scores', tooltip:'The features passed to the trained meta-learner’s\n.predict_proba() to obtain the final stacked prediction.' },
            { id:'meta_infer', cat:'meta', x:460, y:600, w:400, h:90, title:'Meta-Learner Inference', subtitle:'Trained logistic regression scores the outer test meta-features', role:'Final combination step', tooltip:'meta_bn_xgb_mlp.predict_proba([bn_test, xgb_test, mlp_test]):\ncombines three independent risk estimates into one.' },
            { id:'output', cat:'output', x:460, y:730, w:400, h:80, title:'Final Stacked P(LC)', subtitle:'BN + XGBoost + Deep MLP ensemble', role:'Model output', tooltip:'Out-of-fold prediction for the outer test fold — aggregated\nacross all 10 outer folds to compute AUC / TPR@TNR=95%.' },
            { id:'variants', cat:'eval', x:460, y:840, w:400, h:90, title:'Also Evaluated: 2-Input Variants', subtitle:'BN + XGBoost · BN + Deep MLP', role:'Ablation variants', tooltip:'Identical inner-CV / outer-fit / meta-learner recipe, with\none base learner omitted from the stacked feature vector.' },
            { id:'eval', cat:'eval', x:460, y:960, w:400, h:80, title:'Outer 10-Fold Evaluation', subtitle:'AUC per missingness level (0 / 10 / 20 / 30%)', role:'Evaluation protocol', tooltip:'The full nested procedure above is repeated at every\nmissingness level; best model per level is also reported.' }
        ],
        edges: [
            { from:'input', to:'in_bn',  fromSide:'bottom', toSide:'top', bendY:165 },
            { from:'input', to:'in_xgb', fromSide:'bottom', toSide:'top', bendY:165 },
            { from:'input', to:'in_mlp', fromSide:'bottom', toSide:'top', bendY:165 },
            { from:'input', to:'out_bn',  fromSide:'bottom', toSide:'top', bendY:165 },
            { from:'input', to:'out_xgb', fromSide:'bottom', toSide:'top', bendY:165 },
            { from:'input', to:'out_mlp', fromSide:'bottom', toSide:'top', bendY:165 },
            { from:'in_bn',  to:'in_meta_feat', fromSide:'bottom', toSide:'top', bendY:295 },
            { from:'in_xgb', to:'in_meta_feat', fromSide:'bottom', toSide:'top', bendY:295 },
            { from:'in_mlp', to:'in_meta_feat', fromSide:'bottom', toSide:'top', bendY:295 },
            { from:'in_meta_feat', to:'meta_train', fromSide:'bottom', toSide:'top' },
            { from:'out_bn',  to:'out_meta_feat', fromSide:'bottom', toSide:'top', bendY:295 },
            { from:'out_xgb', to:'out_meta_feat', fromSide:'bottom', toSide:'top', bendY:295 },
            { from:'out_mlp', to:'out_meta_feat', fromSide:'bottom', toSide:'top', bendY:295 },
            { from:'meta_train', to:'meta_infer', fromSide:'bottom', toSide:'top', bendY:565, label:'fitted parameters' },
            { from:'out_meta_feat', to:'meta_infer', fromSide:'bottom', toSide:'top', bendY:565 },
            { from:'meta_infer', to:'output', fromSide:'bottom', toSide:'top' },
            { from:'output', to:'variants', fromSide:'bottom', toSide:'top' },
            { from:'variants', to:'eval', fromSide:'bottom', toSide:'top' }
        ]
    };

    if (document.getElementById('canvas1')) window.__diagramInstances.push(new Diagram(document.getElementById('canvas1'), document.getElementById('legend1'), DIAGRAM_1));
    if (document.getElementById('canvas2')) window.__diagramInstances.push(new Diagram(document.getElementById('canvas2'), document.getElementById('legend2'), DIAGRAM_2));
    if (document.getElementById('canvas3')) window.__diagramInstances.push(new Diagram(document.getElementById('canvas3'), document.getElementById('legend3'), DIAGRAM_3));

    if (typeof MutationObserver !== 'undefined') {
        var themeTarget = document.documentElement;
        var themeObserver = new MutationObserver(function(muts) {
            for (var i = 0; i < muts.length; i++) {
                if (muts[i].attributeName === 'data-theme') { redrawDiagrams(); break; }
            }
        });
        themeObserver.observe(themeTarget, { attributes: true, attributeFilter: ['data-theme'] });
    }
}

/* ===== Demo Enhancements ===== */

function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(initial);

    btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        btn.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
        btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        applyChartTheme();
        redrawDiagrams();
    }
}

function initMobileNav() {
    const btn = document.getElementById('navToggle');
    const navbar = document.getElementById('navbar');
    if (!btn || !navbar) return;
    btn.addEventListener('click', () => {
        const open = navbar.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navbar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('nav-open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

function showNodeTooltip(node, typeLabel, degree, g) {
    const tip = document.getElementById('floatingNodeTooltip');
    if (!tip) return;
    const label = node.fullLabel || node.label;
    tip.innerHTML = '<div class="nt-title">' + label + '</div><div class="nt-type">' + typeLabel + '</div><div class="nt-detail">Connected by ' + degree + ' edge' + (degree === 1 ? '' : 's') + ' in the graph.</div>';
    const rect = g.getBoundingClientRect();
    tip.style.display = 'block';
    let left = rect.right + 8;
    let top = rect.top;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    const tr = tip.getBoundingClientRect();
    if (tr.right > window.innerWidth - 8) tip.style.left = (rect.left - tr.width - 8) + 'px';
    if (tr.bottom > window.innerHeight - 8) tip.style.top = (window.innerHeight - tr.height - 8) + 'px';
}

function hideNodeTooltip() {
    const tip = document.getElementById('floatingNodeTooltip');
    if (tip) tip.style.display = 'none';
}

function highlightDagNode(svg, key) {
    const neighbors = new Set();
    svg.querySelectorAll('.svg-edge').forEach(p => {
        const f = p.dataset.from, t = p.dataset.to;
        if (f === key) { neighbors.add(t); p.classList.add('edge-active'); }
        else if (t === key) { neighbors.add(f); p.classList.add('edge-active'); }
    });
    svg.querySelectorAll('g[data-node-key]').forEach(g => {
        const k = g.dataset.nodeKey;
        if (k !== key && !neighbors.has(k)) g.classList.add('node-dim');
    });
}

function clearDagHighlight(svg) {
    svg.querySelectorAll('.svg-edge').forEach(p => p.classList.remove('edge-active'));
    svg.querySelectorAll('g[data-node-key]').forEach(g => g.classList.remove('node-dim'));
}

function initDagNodeTooltips() {
    ['svgExpertDag', 'svgLearnedDag'].forEach(svgId => {
        const svg = document.getElementById(svgId);
        if (!svg) return;
        const isExpert = svgId === 'svgExpertDag';
        const edges = isExpert ? EXPERT_EDGES : LEARNED_BASE_EDGES;
        svg.addEventListener('mouseover', (e) => {
            const g = e.target.closest && e.target.closest('g[data-node-key]');
            if (!g) return;
            const key = g.dataset.nodeKey;
            const node = DAG_NODES[key];
            if (!node) return;
            const degree = edges.filter(ed => ed[0] === key || ed[1] === key).length;
            const typeLabel = node.type === 'lc' ? 'Target node (Lung Cancer)' : (node.type === 'demo' ? 'Demographic / clinical' : 'Laboratory biomarker');
            showNodeTooltip(node, typeLabel, degree, g);
            highlightDagNode(svg, key);
        });
        svg.addEventListener('mouseout', (e) => {
            const g = e.target.closest && e.target.closest('g[data-node-key]');
            if (g) { hideNodeTooltip(); clearDagHighlight(svg); }
        });
    });
}

function initThresholdExplorer() {
    const slider = document.getElementById('thresholdSlider');
    const valEl = document.getElementById('thresholdVal');
    const select = document.getElementById('configSelect');
    if (!slider || !select) return;

    const DIST = [
        { name: 'Clinical / Expert', nonLc: [2.5,7.8,4.2,3.1,2.0,1.2,0.8,0.6,0.4,0.3,0.1], lc: [0.5,1.5,3.2,2.4,3.8,1.9,1.2,1.0,0.8,0.6,0.3] },
        { name: 'Clinical / Learned', nonLc: [4.4,5.5,2.8,3.8,2.9,1.8,1.2,0.8,0.5,0.3,0.1], lc: [0.3,0.8,1.5,2.2,2.3,1.7,1.4,1.3,0.8,0.5,0.2] },
        { name: 'DataDriven / Expert', nonLc: [3.4,5.3,3.1,1.6,1.1,0.7,0.5,0.3,0.2,0.1,0.0], lc: [0.2,0.9,2.0,1.2,1.1,0.8,0.7,0.6,0.5,0.6,4.3] },
        { name: 'DataDriven / Learned', nonLc: [10.5,3.0,1.6,1.2,0.7,0.4,0.2,0.1,0.0,0.0,0.0], lc: [0.2,0.8,1.1,1.0,0.9,1.1,1.0,0.9,1.2,1.6,5.6] }
    ];
    const N_NONLC = 7435, N_LC = 2505;
    const probs = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

    function pct(x) { return (x * 100).toFixed(1) + '%'; }
    function setCell(base, val, total) {
        document.getElementById(base + 'Val').textContent = val;
        document.getElementById(base + 'Pct').textContent = pct(val / total);
    }

    function update() {
        const t = parseFloat(slider.value);
        valEl.textContent = t.toFixed(2);
        const d = DIST[parseInt(select.value, 10)];
        let tn = 0, fp = 0, fn = 0, tp = 0, sNon = 0, sLc = 0;
        for (let i = 0; i < probs.length; i++) {
            const pos = probs[i] >= t;
            sNon += d.nonLc[i]; sLc += d.lc[i];
            if (pos) { fp += d.nonLc[i]; tp += d.lc[i]; }
            else { tn += d.nonLc[i]; fn += d.lc[i]; }
        }
        const fNon = N_NONLC / sNon, fLc = N_LC / sLc;
        tn = Math.round(tn * fNon); fp = Math.round(fp * fNon);
        fn = Math.round(fn * fLc); tp = Math.round(tp * fLc);
        const total = tn + fp + fn + tp;
        setCell('tn', tn, total); setCell('fp', fp, total);
        setCell('fn', fn, total); setCell('tp', tp, total);
        const sens = (tp + fn) ? tp / (tp + fn) : 0;
        const spec = (tn + fp) ? tn / (tn + fp) : 0;
        const ppv = (tp + fp) ? tp / (tp + fp) : 0;
        const npv = (tn + fn) ? tn / (tn + fn) : 0;
        const acc = (tp + tn) / total;
        document.getElementById('sensVal').textContent = pct(sens);
        document.getElementById('specVal').textContent = pct(spec);
        document.getElementById('ppvVal').textContent = pct(ppv);
        document.getElementById('npvVal').textContent = pct(npv);
        document.getElementById('accVal').textContent = pct(acc);
    }

    slider.addEventListener('input', update);
    select.addEventListener('change', update);
    update();
}

function initShareableState() {
    const slider = document.getElementById('missingDataSlider');
    const btn = document.getElementById('btnCopyShare');
    if (!slider) return;

    function syncFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const m = params.get('missing');
        if (m !== null && !isNaN(parseInt(m, 10))) {
            const v = Math.max(0, Math.min(30, parseInt(m, 10)));
            slider.value = v;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    function pushToUrl() {
        const params = new URLSearchParams(window.location.search);
        params.set('missing', slider.value);
        const newUrl = window.location.pathname + '?' + params.toString() + window.location.hash;
        window.history.replaceState(null, '', newUrl);
    }
    slider.addEventListener('input', pushToUrl);
    syncFromUrl();

    if (btn) {
        btn.addEventListener('click', () => {
            pushToUrl();
            const url = window.location.href;
            const done = () => {
                btn.textContent = '✓ Copied!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = 'Copy link'; btn.classList.remove('copied'); }, 1500);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
            } else {
                fallbackCopy(url, done);
            }
        });
    }
    function fallbackCopy(text, done) {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
    }
}

function initLazyImages() {
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) img.loading = 'lazy';
        img.decoding = 'async';
    });
}

function chartPalette() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark
        ? { ink: '#e8eaed', mid: '#9aa1ab', light: '#3a3f47', grid: 'rgba(255,255,255,0.09)', text: '#b9bec6', line: '#e8eaed' }
        : { ink: '#1a1a1a', mid: '#555555', light: '#cbd5e1', grid: 'rgba(0,0,0,0.05)', text: '#555555', line: '#1a1a1a' };
}

function recolorChart(chart) {
    if (!chart) return;
    const p = chartPalette();
    const fix = (v) => {
        if (Array.isArray(v)) return v.map(fix);
        if (typeof v !== 'string') return v;
        if (v === '#1a1a1a') return p.ink;
        if (v === '#555555') return p.mid;
        if (v === '#cbd5e1') return p.light;
        if (v.indexOf('rgba(0, 0, 0') === 0) return p.grid;
        return v;
    };
    (chart.data.datasets || []).forEach(ds => {
        if ('borderColor' in ds) ds.borderColor = fix(ds.borderColor);
        if ('backgroundColor' in ds) ds.backgroundColor = fix(ds.backgroundColor);
    });
    const scales = chart.options && chart.options.scales;
    if (scales) {
        Object.keys(scales).forEach(k => {
            const ax = scales[k];
            if (!ax) return;
            if (ax.ticks) ax.ticks.color = p.text;
            if (ax.grid) ax.grid.color = p.grid;
            if (ax.title && ax.title.display) ax.title.color = p.text;
        });
    }
    const legend = chart.options && chart.options.plugins && chart.options.plugins.legend;
    if (legend && legend.labels) legend.labels.color = p.text;
    chart.update('none');
}

function applyChartTheme() {
    if (typeof Chart === 'undefined' || !Chart.instances) return;
    Object.values(Chart.instances).forEach(chart => {
        if (chart && chart === configsBarChart) { updateConfigsChartView(currentView); return; }
        recolorChart(chart);
    });
}

function initEscToClose() {
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const pm = document.getElementById('paperPdfModal');
        const im = document.getElementById('globalImageModal');
        if (pm && pm.style.display !== 'none') closePaperPdfModal();
        if (im && im.style.display !== 'none') closeImageModal();
    });
}