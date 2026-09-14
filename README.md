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

## Privacy in the current version

The current version does not require an account. Each browser tab/session gets a private workspace. Brand answers are stored in session-scoped browser storage and are not intentionally reused for a new visitor. Legacy shared browser data is removed during startup.

Closing the browser session or choosing **Start a fresh brand** clears the active workspace from view. Personalized downloads are generated in the browser from that session's answers.

This is intentionally a privacy-first V1. Cross-device persistence should only be added with authenticated per-user storage and server-side authorization.

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

## Mobile experience

On mobile, the step navigation becomes a sticky horizontal navigation strip. Selecting a step scrolls directly to that step rather than returning the visitor to the top of the page.

## Local preview

Because the page loads each step as a small HTML fragment, preview it through a local web server rather than opening `index.html` directly from the filesystem.

For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

Production hosting is intended for Cloudflare under `yourbrand.its-ez.com`. GitHub is the source of truth for the application code.
