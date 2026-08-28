/**
 * Lung Cancer Detection Using Bayesian Networks
 * Presentation Script (Strict Monochrome Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
    initDemoPrediction();
    initMissingDataSimulation();
    initDagComparison();
    initAllConfigsChart();
    initDegradationChart();
    initDegradationTprChart();
    initDistributionsSubplots();
    initRocChart();
    initCounterAnimations();
    initTooltipGlobalHandler();
    initOriginalModalHandler();

    // Colab Research Extension Line Charts (Strict Monochrome & Dual Subplots)
    initBnVsMlChart();
    initBnVsMlTprChart();
    initBnVsImputedMlChart();
    initNlstValidationChart();
    initHybridBnDlChart();
    initStackingModelChart();
});

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
        btn.disabled = true;
        btn.innerHTML = '<span>Computing Bayesian Inference...</span>';

        setTimeout(() => {
            resultCard.style.display = 'block';

            setTimeout(() => {
                if (riskBar) riskBar.style.width = '74.2%';
            }, 50);

            animateValue(riskNumber, 0, 74.2, 800, '%');

            btn.disabled = false;
            btn.innerHTML = '<span>✓ Re-Evaluate Risk</span>';

            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 250);
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

    const riskMap = {
        0: 74.2,
        5: 73.9,
        10: 73.4,
        15: 72.8,
        20: 72.3,
        25: 71.9,
        30: 71.4
    };

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

        const curRisk = riskMap[pct] || 74.2;
        if (riskVal) riskVal.textContent = `${curRisk.toFixed(1)}%`;
        if (stabilityText) {
            stabilityText.textContent = `Even with ${pct}% missing data, risk prediction remains stable (${curRisk.toFixed(1)}%)`;
        }

        renderSimGrid(numMissing);
    }

    function renderSimGrid(numMissing) {
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
            const path = createCurvedEdgePath(p1, p2, 'svg-edge-dark', 'url(#arrow-dark)');
            svg.appendChild(path);
        }
    });

    Object.keys(DAG_NODES).forEach(nodeKey => {
        const node = DAG_NODES[nodeKey];
        const g = createNodeElement(node, nodeKey);
        svg.appendChild(g);
    });
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
            const path = createCurvedEdgePath(p1, p2, 'svg-edge-dark', 'url(#arrow-dark-l)');
            svg.appendChild(path);
        }
    });

    if (withDifferences) {
        REMOVED_EDGES.forEach(edgeObj => {
            const p1 = DAG_NODES[edgeObj.from];
            const p2 = DAG_NODES[edgeObj.to];
            if (p1 && p2) {
                const path = createCurvedEdgePath(p1, p2, 'svg-edge-red', 'url(#arrow-red-l)');

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
}

function createCurvedEdgePath(p1, p2, className = 'svg-edge-dark', marker = 'url(#arrow-dark)') {
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
    return path;
}

function createNodeElement(node, nodeKey) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    if (node.type === 'lc') {
        circle.setAttribute('r', 16);
        circle.setAttribute('class', 'svg-node-circle node-lc');
    } else {
        circle.setAttribute('r', 13);
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

// 16 Configurations Bar Chart (Strict Monochrome)
let configsBarChart = null;

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
                            const c = CONFIGURATIONS[items[0].dataIndex];
                            return `${c.disc} + ${c.dag} (${c.missing}% Missing)`;
                        },
                        label: (item) => {
                            const c = CONFIGURATIONS[item.dataIndex];
                            return [
                                `AUC: ${c.auc.toFixed(3)}`,
                                `TPR@95%: ${c.tpr.toFixed(3)}`
                            ];
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

    if (view === 'all') {
        configsBarChart.data.labels = CONFIGURATIONS.map(c => `${c.missing}% | ${c.disc.substring(0, 4)}/${c.dag.substring(0, 3)}`);
        configsBarChart.data.datasets[0].data = CONFIGURATIONS.map(c => c.auc);
        configsBarChart.data.datasets[0].backgroundColor = CONFIGURATIONS.map(c => {
            if (c.isBest) return '#1a1a1a';
            if (c.disc === 'DataDriven') return '#555555';
            return '#cbd5e1';
        });
    } else if (view === 'best') {
        const topPerMissing = [CONFIGURATIONS[3], CONFIGURATIONS[7], CONFIGURATIONS[11], CONFIGURATIONS[15]];
        configsBarChart.data.labels = topPerMissing.map(c => `Best @ ${c.missing}% Missing`);
        configsBarChart.data.datasets[0].data = topPerMissing.map(c => c.auc);
        configsBarChart.data.datasets[0].backgroundColor = ['#1a1a1a', '#444444', '#777777', '#aaaaaa'];
    } else if (view === 'comparison') {
        configsBarChart.data.labels = [
            'Paper Reported (0.756)',
            'DES ML Model (0.770)',
            'Your Baseline (0.728)',
            'Your Best Extension (0.886)'
        ];
        configsBarChart.data.datasets[0].data = [0.756, 0.770, 0.728, 0.886];
        configsBarChart.data.datasets[0].backgroundColor = ['#888888', '#555555', '#cbd5e1', '#1a1a1a'];
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

// Figure 8: 4 Subplots of P(LC=1) Density Distributions (Strict B&W Theme matching distributions.jpeg)
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
                        pointRadius: 0
                    },
                    {
                        label: 'LC (n=2505)',
                        data: cfg.lc,
                        borderColor: '#666666',
                        backgroundColor: 'rgba(102, 102, 102, 0.28)',
                        borderWidth: 1.8,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Threshold (p=0.5)',
                        data: Array(11).fill(null).map((_, i) => i === 5 ? Math.max(...cfg.nonLc, ...cfg.lc) : null),
                        borderColor: '#888888',
                        borderDash: [3, 3],
                        borderWidth: 1,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1a1a1a' }
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

function initRocChart() {
    const canvas = document.getElementById('rocChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const fprPoints = [0, 0.02, 0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50, 0.70, 1.0];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fprPoints.map(f => (f * 100).toFixed(0) + '%'),
            datasets: [
                {
                    label: 'DataDriven / Learned (0.886)',
                    data: [0, 0.41, 0.547, 0.68, 0.76, 0.82, 0.89, 0.93, 0.96, 0.99, 1.0],
                    borderColor: '#1a1a1a',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'DataDriven / Expert (0.840)',
                    data: [0, 0.32, 0.458, 0.59, 0.68, 0.75, 0.84, 0.89, 0.93, 0.98, 1.0],
                    borderColor: '#555555',
                    borderWidth: 1.8,
                    borderDash: [4, 3],
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Clinical / Learned (0.788)',
                    data: [0, 0.18, 0.265, 0.48, 0.59, 0.68, 0.79, 0.85, 0.90, 0.96, 1.0],
                    borderColor: '#888888',
                    borderWidth: 1.6,
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Random Chance (0.500)',
                    data: fprPoints,
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
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { family: 'Inter', size: 9.5 } }
                }
            },
            scales: {
                y: { min: 0, max: 1.0, grid: { color: 'rgba(0, 0, 0, 0.04)' } },
                x: { grid: { color: 'rgba(0, 0, 0, 0.03)' } }
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
                    data: [0.7777, 0.6263, 0.6233, 0.6041],
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