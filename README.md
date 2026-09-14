# YourBrand — Guided Brand Builder

A beginner-friendly guided web experience for discovering and building a personal or business brand using self-reflection, Canva, and AI.

## What the experience covers

1. Find Your Center — emotion, belief, strengths, lived experience, and boundaries
2. Who You’re Here For — audience, needs, outcomes, proof, and differentiation
3. Find Your Voice — real writing samples, natural language patterns, and anti-voice
4. Choose Your Look — emotional visual direction, mood boards, colors, fonts, and image style
5. Build It in Canva — Brand Kit / Brand Home setup and starter templates
6. Shape Your Message — one-line description, themes, and proof boundaries
7. Create With AI — how to use AI as a collaborator without losing your voice
8. Meet Your Brand — personalized brand reveal and downloadable files

## Privacy in V1

The current version does not require an account. Answers are saved in the visitor's own browser using localStorage. Progress therefore stays on that browser/device unless browser data is cleared.

Downloads are generated in the browser from the visitor's answers. V1 does not send those answers to a database.

## Personalized downloads

The final step can generate:
- My Brand Guide
- My Brand Voice Guide
- My Canva Brand Plan
- My AI Writing Guide
- My Content Starter Map
- A ZIP containing all five files

## AI philosophy

AI is treated as a collaborator, not the creative authority. The core rule throughout the experience is:

> If something does not feel like you, it is not finished yet.

## Local preview

Because the page loads each step as a small HTML fragment, preview it through a local web server rather than opening `index.html` directly from the filesystem.

For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

The repository includes a GitHub Pages workflow under `.github/workflows/pages.yml`. Every push to `main` attempts to publish the current static site.
