# Sainath Video – Remotion overlays

Transparent 1080x1920 overlays for Instagram reels. The footage sits in a 16:9 band
at y = 656–1264; graphics only live in the top (0–656) and bottom (1264–1920) bands.

```bash
npm install
npm run dev                  # Remotion Studio (http://localhost:3000)
npm run render:protect-five  # out/protect-five.mov (ProRes 4444 with alpha)
```

- `src/theme.ts` – shared colors, fonts, spring config, layout bands
- `src/components/CheckRow.tsx` – `<CheckRow checked={n} />` (0–5 ticked; newest tick draws in)
- `src/scenes/ProtectFiveThings.tsx` – scene 1 (set prop `showGuides: true` in Studio to see the footage band)
- `src/scenes/CheckRowDemo.tsx` – preview of CheckRow with ticks
