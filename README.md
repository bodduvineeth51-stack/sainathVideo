# Sainath Video – Remotion overlays

Transparent 1080x1920 overlays for Instagram reels. The footage sits in a 16:9 band
at y = 656–1264; graphics only live in the top (0–656) and bottom (1264–1920) bands.

```bash
npm install
npm run dev                  # Remotion Studio (http://localhost:3000)
npm run render:protect-five  # out/protect-five.mov (ProRes 4444 with alpha)
npm run render:thing1        # out/thing1-public-wifi.mov
npm run render:tip1          # out/tip1-public-wifi.mov (reference clip off)
npm run render:tip2          # out/tip2-logout.mov (reference clip off)
```

- `src/theme.ts` – shared colors, fonts, spring config, layout bands
- `src/components/CheckRow.tsx` – `<CheckRow checked={n} />` (0–5 ticked; newest tick draws in)
- `src/scenes/ProtectFiveThings.tsx` – scene 1 (set prop `showGuides: true` in Studio to see the footage band)
- `src/scenes/Thing1PublicWifi.tsx` – thing #1 (public WiFi), 8s in 4 beats; retime via `BEATS`
- `src/scenes/Tip1PublicWifi.tsx` – tip #1, 11.33s (340 frames), synced to the VO; retime via `BEATS` at the top. Put your
  reference clip at `public/tip1.mp4` to preview it in the footage band (Studio only)
- `src/scenes/Tip2Logout.tsx` – tip #2, 10s; retime via `BEATS`; reference clip `public/tip2.mp4`
- `src/components/BeatLabel.tsx` – Studio sync helper ("f 190 · vpnOn"), prop `showBeatLabels`
- `src/components/Headline.tsx`, `TipBadge.tsx`, `ReferenceVideo.tsx`, `motion.tsx` – shared
  headline transitions, #N badge, Studio reference footage, spring/position helpers
- `src/components/` – also `Shield`, `SessionChip`, `WifiIcon`, `FootageGuide`
- `src/scenes/CheckRowDemo.tsx` – preview of CheckRow with ticks
