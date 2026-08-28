# Contributing

Thanks for your interest in improving this research demo. This is a small, static
repository, so the process is intentionally lightweight.

## How to contribute

1. Fork / branch off `main`.
   - Features: `feature/short-name`
   - Fixes: `fix/short-name`
   - Chore: `chore/short-name`
2. Make your change. Keep the strict monochrome design system defined in `style.css`
   (CSS variables under `:root`); do not introduce new brand colors.
3. Test locally:
   ```bash
   python3 -m http.server 8000
   # open http://localhost:8000 and click through every section
   ```
   Verify there are no console errors and that charts still render.
4. Open a pull request describing the change and the motivation.

## What we need help with

See the **Proposed Features / Roadmap** section in `README.md`. The highest-value
items right now are:

- Wiring the demo to a **real Bayesian Network inference engine** (the prediction and
  missing-data slider are currently hardcoded).
- Adding the **Colab notebook / model code** that produced the `images/` figures, under
  `notebooks/` or `src/`, plus a `requirements.txt`.

## Code style

- Plain HTML/CSS/JS, no build step.
- `script.js` is organized as one `init*` function per interactive component, called
  from the `DOMContentLoaded` handler at the top.
- Prefer Chart.js for new plots to stay consistent with the existing figures.

## Reporting issues

Open an issue with: what you did, what you expected, what happened, and a screenshot
if the problem is visual.
