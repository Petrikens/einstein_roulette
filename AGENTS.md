# Project Agent Notes

## Stack
- Vue 3 + TypeScript + Vite.
- Tailwind CSS for styling.
- SVG for wheel rendering.
- @vueuse/motion for UI motion.

## Commands
- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Production build: `npm run build`
- Type check: `npm run typecheck`

## Implementation Rules
- Do not use `any`.
- Keep props and emits explicitly typed.
- Put reusable business logic in `src/lib`.
- Keep roulette state in dedicated feature components.
- The shared `Wheel.vue` receives `WheelItem[]`, renders weighted sectors, chooses the result before animation starts, blocks repeat spins, and emits `spinEnd` after animation completes.
- Handle empty lists, one-item wheels, long labels, duplicate participant names, and manual gift removal.

## Design Rules
- Build the usable app as the first screen, not a landing page.
- Desktop layout: two roulette cards side by side.
- Mobile layout: cards stacked vertically.
- Use restrained modern styling, readable text, stable controls, accessible focus states, and responsive SVG sizing.
