/**
 * Tip #4 – Check your active sessions.
 * VO: "active sessions ni regular ga check cheskunta undandi. Instagram lo
 * where you logged in loki elthe aa aa devices lo mi account log-in ayyi
 * undho chupisthundhi. So mik thelvani account em unna ante ventane logout
 * cheyandi."
 *
 * Icons (public/icons/): magnifier.png, settings.png, where.png,
 * device-phone.png, device-laptop.png, device-unknown.png, check.png.
 * Reference clip: public/tip4.mp4.
 */

// ---------- TIMING (measured from the audio; everything derives from these) ----------
export const BEATS = {
  active: 0, // "active sessions ni regular ga"
  check: 57, // "check cheskunta undandi"
  instagram: 78, // "instagram lo"
  where: 92, // "where you logged in loki elthe"
  devices: 126, // "aa aa devices lo mi account"
  loggedIn: 177, // "log-in ayyi undho chupisthundhi"
  unknown: 220, // "so mik thelvani account em unna ante"
  ventane: 261, // "ventane"
  logout: 280, // "logout cheyandi"
  checkRow: 288,
  tick: 296,
  end: 304,
};
export const DURATION = BEATS.end;

import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { BeatLabel } from "../components/BeatLabel";
import { CheckRow } from "../components/CheckRow";
import { Headline, anton, poppins } from "../components/Headline";
import { HERO_MAX, HeroIcon } from "../components/HeroIcon";
import { At, clamp, usePop } from "../components/motion";
import { ReferenceVideo } from "../components/ReferenceVideo";
import { TipBadge } from "../components/TipBadge";
import { colors, layout } from "../theme";

// ---------- Layout ----------
const BAND_H = layout.footageTop; // 656 – top band
const HERO_X = 540;
const HERO_Y = 330;
const HERO = HERO_MAX; // 280
const PHONE_X = 470;
const SIDE_X = 680;
const SIDE_Y = 380;
const SIDE_SIZE = 150;
const BADGE_Y = 1370;
const HEADLINE_Y = 1480;
const ROW_Y = 1720;

// Device card
const CARD_W = 620;
const CARD_H = 400;
const CARD_LEFT = HERO_X - CARD_W / 2; // 230
const CARD_TOP = HERO_Y - CARD_H / 2; // 130
const PAD = 20;
const ROW_H = 112;
const ROW_GAP = 12;
const ROW_W = CARD_W - PAD * 2;
const CARD_H_2ROWS = PAD * 2 + ROW_H * 2 + ROW_GAP; // after row 3 is removed
const CARD_BORDER = "#3C4B6E";
const ROW_BG = "#111A2E";
const PLACE_GREY = "#8A93A6";
const DOT = 24;
const ROW_ICON = 80;

const DEVICES = [
  { icon: "device-phone.png", name: "iPhone", place: "Hyderabad" },
  { icon: "device-laptop.png", name: "Windows PC", place: "Vijayawada" },
  { icon: "device-unknown.png", name: "Unknown", place: "???" },
];

// Row 3 "Log out" button, in global coordinates (cursor target)
const BTN_X = CARD_LEFT + PAD + ROW_W - 95;
const BTN_Y = CARD_TOP + PAD + 2 * (ROW_H + ROW_GAP) + ROW_H / 2;

const glow = (color: string, px = 40) => `drop-shadow(0 0 ${px}px ${color})`;

/** White arrow cursor; hotspot is the tip at (0, 0). */
const Cursor: React.FC = () => (
  <svg width={44} height={62} viewBox="0 0 44 62" style={{ overflow: "visible" }}>
    <path
      d="M 2 2 L 2 50 L 14 39 L 22 58 L 31 54 L 23 36 L 40 36 Z"
      fill="#FFFFFF"
      stroke={colors.panel}
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
  </svg>
);

export type Tip4ActiveSessionsProps = {
  /** Show public/tip4.mp4 in the footage band to line up beats. Off for export. */
  showReference?: boolean;
  /** Studio sync helper: frame number + current beat, top-left. Off for export. */
  showBeatLabels?: boolean;
};

export const Tip4ActiveSessions: React.FC<Tip4ActiveSessionsProps> = ({
  showReference = false,
  showBeatLabels = false,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const out = (from: number, dur = 6) => Math.max(0, 1 - pop(from, dur));

  // ---- active / check: magnifier tilts and sweeps once ----
  const magScale = pop(BEATS.active, 10) * out(BEATS.instagram);
  const magTilt = -18 * Math.min(1, pop(BEATS.check, 8));
  const sweepT = interpolate(frame, [BEATS.check + 2, BEATS.check + 18], [0, 1], clamp);
  const magSweep = 40 * Math.sin(sweepT * Math.PI * 2);

  // ---- instagram: phone + rotating gear (1 turn per 3 s) ----
  const phoneScale = pop(BEATS.instagram, 10) * out(BEATS.devices);
  const gearScale = pop(BEATS.instagram + 3, 8) * out(BEATS.where);
  const gearRotate = ((frame - BEATS.instagram) / 90) * 360;

  // ---- where: pin drops in from above with a bounce ----
  const pinDrop = pop(BEATS.where, 14);
  const pinY = interpolate(pinDrop, [0, 1], [-120, SIDE_Y]);
  const pinScale = out(BEATS.devices);

  // ---- devices: card + staggered rows ----
  const cardIn = pop(BEATS.devices, 12);
  const rowIn = (i: number) => pop(BEATS.devices + 6 + i * 5, 10);

  // ---- loggedIn: dots ----
  const dotIn = (i: number) => pop(BEATS.loggedIn + i * 4, 8);
  const dotPulse = (Math.sin(((frame - BEATS.loggedIn) / 30) * Math.PI * 2) + 1) / 2;

  // ---- unknown: row 3 turns red and pulses twice; card glow red ----
  const redT = interpolate(frame, [BEATS.unknown, BEATS.unknown + 4], [0, 1], clamp);
  const pulseT = interpolate(frame, [BEATS.unknown, BEATS.unknown + 18], [0, 1], clamp);
  const row3Pulse = pulseT > 0 && pulseT < 1 ? 1 + 0.04 * Math.abs(Math.sin(pulseT * Math.PI * 2)) : 1;
  const backToCyan = interpolate(frame, [BEATS.logout, BEATS.logout + 6], [0, 1], clamp);
  const cardGlow =
    frame < BEATS.logout
      ? interpolateColors(redT, [0, 1], [colors.cyan, colors.danger])
      : interpolateColors(backToCyan, [0, 1], [colors.danger, colors.cyan]);

  // ---- ventane: Log out button + cursor glide ----
  const btnIn = pop(BEATS.ventane, 8);
  const glide = interpolate(frame, [BEATS.ventane + 2, BEATS.ventane + 17], [0, 1], {
    ...clamp,
    easing: (t) => t * t * (3 - 2 * t),
  });
  const cursorX = interpolate(glide, [0, 1], [1000, BTN_X + 12]);
  const cursorY = interpolate(glide, [0, 1], [620, BTN_Y + 10]);

  // ---- logout: click, row 3 leaves, card shrinks, check pops ----
  const press = interpolate(frame, [BEATS.logout, BEATS.logout + 2, BEATS.logout + 8], [1, 0.9, 1], clamp);
  const leave = interpolate(frame, [BEATS.logout, BEATS.logout + 8], [0, 1], clamp);
  const cardH = interpolate(leave, [0, 1], [CARD_H, CARD_H_2ROWS]);
  const cursorOut = out(BEATS.logout + 6, 6);
  const okScale = pop(BEATS.logout + 4, 8);

  // ---- checkRow / tick ----
  const listIn = pop(BEATS.checkRow, 10);
  const ticked = frame >= BEATS.tick;

  return (
    <AbsoluteFill>
      {showReference ? <ReferenceVideo clip="tip4.mp4" /> : null}

      {/* ================= TOP BAND ================= */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: BAND_H,
          overflow: "hidden", // nothing can leak into the footage band
        }}
      >
        {magScale > 0 ? (
          <At
            x={HERO_X + magSweep}
            y={HERO_Y}
            transform={`scale(${magScale}) rotate(${magTilt}deg)`}
            style={{ filter: glow(colors.cyan) }}
          >
            <HeroIcon name="magnifier.png" size={HERO} />
          </At>
        ) : null}

        {frame >= BEATS.instagram && phoneScale > 0 ? (
          <At x={PHONE_X} y={HERO_Y} transform={`scale(${phoneScale})`} style={{ filter: glow(colors.cyan) }}>
            <HeroIcon name="device-phone.png" size={HERO} />
          </At>
        ) : null}
        {frame >= BEATS.instagram + 3 && gearScale > 0 ? (
          <At
            x={SIDE_X}
            y={SIDE_Y}
            transform={`scale(${gearScale}) rotate(${gearRotate}deg)`}
            style={{ filter: glow(colors.cyan, 24) }}
          >
            <HeroIcon name="settings.png" size={SIDE_SIZE} />
          </At>
        ) : null}
        {frame >= BEATS.where && pinScale > 0 ? (
          <At x={SIDE_X} y={pinY} transform={`scale(${pinScale})`} style={{ filter: glow(colors.cyan, 24) }}>
            <HeroIcon name="where.png" size={SIDE_SIZE} />
          </At>
        ) : null}

        {/* Device card */}
        {frame >= BEATS.devices ? (
          <div
            style={{
              position: "absolute",
              left: CARD_LEFT,
              top: CARD_TOP,
              width: CARD_W,
              height: cardH,
              transformOrigin: "50% 50%",
              transform: `scale(${cardIn})`,
              filter: glow(cardGlow, 30),
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxSizing: "border-box",
                background: colors.panel,
                border: `2px solid ${CARD_BORDER}`,
                borderRadius: 28,
              }}
            />
            {DEVICES.map((d, i) => {
              const isRow3 = i === 2;
              const red = isRow3 ? redT : 0;
              const s = rowIn(i) * (isRow3 ? row3Pulse : 1);
              const leaveX = isRow3 ? 140 * leave : 0;
              const opacity = isRow3 ? 1 - leave : 1;
              if (frame < BEATS.devices + 6 + i * 5 || opacity <= 0) return null;
              const dotColor = interpolateColors(red, [0, 1], [colors.cyan, colors.danger]);
              const showDot = frame >= BEATS.loggedIn + i * 4 && !(isRow3 && frame >= BEATS.ventane);
              return (
                <div
                  key={d.name}
                  style={{
                    position: "absolute",
                    left: PAD,
                    top: PAD + i * (ROW_H + ROW_GAP),
                    width: ROW_W,
                    height: ROW_H,
                    boxSizing: "border-box",
                    background: ROW_BG,
                    borderRadius: 18,
                    border:
                      red > 0
                        ? `4px solid ${interpolateColors(red, [0, 1], [ROW_BG, colors.danger])}`
                        : `4px solid ${ROW_BG}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    padding: "0 22px",
                    opacity,
                    transform: `translateX(${leaveX}px) scale(${s})`,
                  }}
                >
                  <HeroIcon name={d.icon} size={ROW_ICON} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div
                      style={{
                        ...poppins(40),
                        lineHeight: 1.1,
                        color: interpolateColors(red, [0, 1], [colors.text, colors.danger]),
                      }}
                    >
                      {d.name}
                    </div>
                    <div style={{ ...poppins(30), lineHeight: 1.1, color: PLACE_GREY }}>{d.place}</div>
                  </div>

                  {showDot ? (
                    <div
                      style={{
                        position: "absolute",
                        right: 30,
                        top: ROW_H / 2 - 4 - DOT / 2,
                        width: DOT,
                        height: DOT,
                        borderRadius: 999,
                        background: dotColor,
                        transform: `scale(${dotIn(i)})`,
                        boxShadow: `0 0 ${8 + 14 * dotPulse}px ${dotColor}`,
                      }}
                    />
                  ) : null}

                  {isRow3 && frame >= BEATS.ventane ? (
                    <div
                      style={{
                        position: "absolute",
                        right: 18,
                        top: "50%",
                        transform: `translateY(-50%) scale(${btnIn * press})`,
                        background: colors.danger,
                        color: colors.text,
                        ...poppins(30),
                        lineHeight: 1,
                        borderRadius: 999,
                        padding: "12px 24px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Log out
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {frame >= BEATS.logout + 4 ? (
          <At
            x={CARD_LEFT + CARD_W}
            y={CARD_TOP + CARD_H_2ROWS}
            transform={`scale(${okScale})`}
            style={{ filter: glow(colors.cyan, 24) }}
          >
            <HeroIcon name="check.png" size={130} />
          </At>
        ) : null}

        {frame >= BEATS.ventane + 2 && cursorOut > 0 ? (
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              transformOrigin: "0 0",
              transform: `scale(${cursorOut * (frame >= BEATS.logout ? press : 1)})`,
            }}
          >
            <Cursor />
          </div>
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.active} to={BEATS.check} y={HEADLINE_Y}>
        <div style={anton(110)}>ACTIVE SESSIONS</div>
      </Headline>
      <Headline from={BEATS.check} to={BEATS.instagram} y={HEADLINE_Y}>
        <div style={anton(110)}>CHECK OFTEN</div>
      </Headline>
      <Headline from={BEATS.instagram} to={BEATS.where} y={HEADLINE_Y}>
        <div style={anton(110)}>SETTINGS</div>
      </Headline>
      <Headline from={BEATS.where} to={BEATS.devices} y={HEADLINE_Y}>
        <div style={anton(110)}>WHERE LOGGED IN?</div>
      </Headline>
      <Headline from={BEATS.devices} to={BEATS.loggedIn} y={HEADLINE_Y}>
        <div style={anton(110)}>YOUR DEVICES</div>
      </Headline>
      <Headline from={BEATS.loggedIn} to={BEATS.unknown} y={HEADLINE_Y}>
        <div style={anton(110)}>LOGGED IN HERE</div>
      </Headline>
      <Headline from={BEATS.unknown} to={BEATS.logout} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.danger }}>DON'T KNOW IT?</div>
      </Headline>
      <Headline from={BEATS.logout} to={BEATS.end} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.cyan }}>LOG OUT</div>
      </Headline>

      {/* Badge drawn after the headlines so exiting text passes behind it */}
      <At x={HERO_X} y={BADGE_Y}>
        <TipBadge n={4} enterAt={0} />
      </At>

      {frame >= BEATS.checkRow ? (
        <At x={HERO_X} y={ROW_Y} transform={`scale(${listIn})`}>
          <CheckRow
            checked={ticked ? 4 : 3}
            animateNewest={ticked}
            checkFrom={BEATS.tick}
            checkDuration={4}
            tickPop
          />
        </At>
      ) : null}

      {showBeatLabels ? <BeatLabel beats={BEATS} /> : null}
    </AbsoluteFill>
  );
};
