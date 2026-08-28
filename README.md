# Lung Cancer Detection Using Bayesian Networks - Research Demo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/Demo-Interactive%20Website-blue.svg)](index.html)
[![Paper](https://img.shields.io/badge/Paper-Henriksen%20et%20al.%20(2025)-green.svg)](batch2_final_paper.pdf)

An interactive research repository that **reproduces and extends** the study
*"Lung Cancer Detection Using Bayesian Networks"* (Henriksen et al., 2025, *Cancer Medicine*).

This repository hosts the **implementation and extension of the paper** alongside a
self-contained, browser-based interactive presentation of the work. No build step or
server is required to view it: it is a static site (`index.html` + `script.js` + `style.css`)
that runs entirely client-side.

---

## About

Early detection of lung cancer in primary care is hard: symptoms are non-specific and
blood workups are frequently incomplete. The original paper shows that **Bayesian
Networks (BNs)** are a strong, interpretable solution because they marginalize over
unobserved variables exactly, without the flawed imputation that breaks standard ML.

This repo reproduces the paper's core results and adds several extensions:

- Dual discretization (clinical reference ranges vs MDLP entropy binning)
- Dual structure learning (expert-elicited DAG vs data-learned DAG via K2 search)
- A missing-data stress test (0% to 30% MCAR) showing BN stability
- Benchmarking BNs against imputed Random Forest / XGBoost
- Two novel architectures: a **Hybrid BN + Deep Learning** model and a **Stacking
  BN ensemble** evaluated on an external NLST cohort

> The original publication PDF is included for scholarly reference
> (`batch2_final_paper.pdf`) and remains subject to the publisher's copyright.

---

## Interactive Demo Website

The demo (`index.html`) walks a reader through the whole story. Highlights:

| Section | What it does |
| ------- | ----------- |
| Hero | Paper title, original authors, headline metrics (9,940 patients, 23 biomarkers, 16 configs, best AUC 0.886). |
| PDF Viewer | In-page full-screen reader for the original paper. |
| Problem Lab | A fake 23-attribute lab report with a "Predict Cancer Risk" button and a missing-data slider (0 to 30%). |
| BN Solution | Problem/solution explainer plus Architecture I (full BN pipeline) canvas diagram. |
| Dataset | Side-by-side proof that the synthetic cohort reproduces the paper's demographics. |
| Imputation | Chart.js figure showing BN suffers zero imputation loss vs mean/KNN/MICE-imputed ML. |
| DAG Comparison | Interactive SVG expert vs learned DAG, with a "Show Differences" toggle that reveals 18 pruned edges (red) and explains each removal on click. |
| Results | 16-config AUC bar chart (All / Best / Paper-vs-Yours toggles), AUC degradation + sensitivity subplots, and P(LC=1) density distributions. |
| Table 3 | The paper's benchmark table. |
| Extensions | BN vs ML, real-data validation, and external NLST validation charts. |
| Hybrid Arch | Architecture II canvas (BN posterior as a feature for a deep MLP). |
| Stacking Arch | Architecture III canvas (BN + XGBoost + Deep MLP stacked under a logistic-regression meta-learner). |

All charts are rendered with [Chart.js](https://www.chartjs.org/) (loaded via CDN). The
architectural diagrams are drawn on `<canvas>` with a small hover/select engine.

---

## Repository Structure

```
.
├── index.html              # The interactive demo (single page, all sections)
├── script.js               # All interactivity: prediction, DAG, charts, arch diagrams
├── style.css               # Strict monochrome design system
├── batch2_final_paper.pdf  # Original publication (scholarly use)
├── images/                 # 14 figures exported from the Colab extension
│   ├── table2.jpeg  table3.jpeg
│   ├── synthetic_data.jpeg  dag_proof.jpeg  imputation.jpeg
│   ├── auc_16.jpeg  auc_degradation.jpeg  distributions.jpeg  correlation_16.jpeg
│   └── bn_vs_ml.jpeg  bn_vs_imputed_ml.jpeg  bn_vs_ml_nlst.jpeg
│   └── hybrid_bn_dl.jpeg  final_stacking_model.jpeg
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CITATION.md
└── .gitignore
```

> **Note on the "Colab Extension":** The model code / notebook that produced the
> `images/` figures and the numbers in `script.js` is **not yet in this repository**.
> It will be added under `notebooks/` (or `src/`) in a later commit. Until then, the
> demo is the hosted, viewable artifact of the extension work.

---

## Getting Started

The site is static. Open it directly or serve it locally:

```bash
# Option A: just open the file
open index.html        # or double-click it

# Option B: serve locally (recommended; some browsers restrict local iframes)
python3 -m http.server 8000
# then visit http://localhost:8000
```

No dependencies to install. Chart.js is loaded from a CDN, so an internet connection
is needed for the charts to render.

---

## Proposed Features / Roadmap

Ideas for extending the demo website (see `CONTRIBUTING.md` to pick one up):

1. **Real inference engine.** The "Predict Cancer Risk" button and the missing-data
   slider currently return hardcoded values (74.2%, and a fixed `riskMap`). Wire the
   site to an actual BN (e.g., a JS BN library or CPTs exported from the Colab notebook)
   so predictions and the missing-data curve are computed live.
2. **Editable evidence vector.** Let visitors change the 23 biomarker values (and
   demographics) instead of a single fixed patient case, and watch the risk update.
3. **What-if comparison.** Side-by-side comparison of two patient evidence vectors.
4. **Confusion matrix / threshold explorer.** The CSS for a confusion matrix and
   clinical-utility panel already exists but is unused; make the 5% / 50% thresholds
   interactive with a draggable cutoff and live sensitivity/specificity/PPV/NPV.
5. **Decision-curve (net benefit) analysis** interactivity to communicate clinical utility.
6. **Interactive DAG nodes.** Add hover tooltips to *every* node showing its conditional
   probability table or in/out-degree, not just the pruned edges.
7. **Mobile navigation.** The top nav is hidden below 992px; add a hamburger menu.
8. **Dark mode toggle** and a proper color-contrast pass for accessibility (red-on-white
   risk text fails contrast checks).
9. **Shareable state.** Encode the current evidence vector + slider in the URL so a
   result can be linked or exported as PNG/PDF.
10. **Accessibility & SEO.** ARIA roles, keyboard navigation for SVG/canvas, meta tags,
    and a social preview image.
11. **Reproducibility packaging.** Add the Colab notebook under `notebooks/`, a
    `requirements.txt`, and a script that regenerates every `images/*.jpeg` from raw data.
12. **Lazy-loaded / responsive images** (`srcset`, `loading="lazy"`) to cut page weight.
13. **Smoke tests.** A tiny headless check (e.g., Playwright) that the page loads and the
    charts initialize without console errors.

---

## Original Paper Citation

Please cite the original study when using this work. BibTeX is in
[`CITATION.md`](CITATION.md).

---

## License

Code and demo content in this repository are released under the **MIT License** (see
[`LICENSE`](LICENSE)). The included PDF (`batch2_final_paper.pdf`) is the original
publisher's copyrighted article and is distributed here for scholarly reference only.

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to propose changes, add the missing
notebook, or pick up a roadmap item.

---

## Acknowledgements

We thank Henriksen et al. for publishing the original study and the open methodological
detail that made this reproduction and extension possible.
