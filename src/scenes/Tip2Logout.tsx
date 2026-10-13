/**
 * Tip #2 – Log out, don't just close.
 * VO: "2nd thing, public device lo kani ledha vera vaalla device lo kani login
 * aithe ... just close cheyyakunda logout avvandi. Endukante cookies ... store
 * aithai."
 *
 * Icons live in public/icons/: desktop.png, phone.png, check.png, cross.png,
 * door.png, cookie.png (256px PNGs). Reference clip: public/tip2.mp4.
 */

// ---------- TIMING (retime here; everything below is relative to these) ----------
export const BEATS = {
  second: 0, // "2nd thing"
  publicPc: 24, // "public device lo kani"
  friend: 80, // "ledha vera vaalla device lo kani"
  login: 117, // "login aithe"
  close: 188, // "just close cheyyakunda"
  logout: 216, // "logout avvandi"
  cookies: 245, // "endukante cookies"
  store: 280, // "store aithai"
  tick: 286,
  end: 298,
};
export const DURATION = BEATS.end;

import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { HERO_MAX, HeroIcon } from "../components/HeroIcon";
import { BeatLabel } from "../components/BeatLabel";
import { CheckRow } from "../components/CheckRow";
import { Headline, anton, poppins } from "../components/Headline";
import { At, clamp, jitter, usePop } from "../components/motion";
import { ReferenceVideo } from "../components/ReferenceVideo";
import { TipBadge } from "../components/TipBadge";
import { colors, layout } from "../theme";

// ---------- Top band geometry ----------
const BAND_H = layout.footageTop; // 656
const CENTER_X = 540;
const CENTER_Y = 318;
const HERO = HERO_MAX; // 280
const SIDE = 228;
const DESKTOP_SIDE_X = 360;
const PHONE_X = 720;
const CHECK = 105;
const CROSS = 158;
const ROW_Y = 1720;

/** Rows appear and the top band fades this many frames before the tick. */
const OUTRO = BEATS.tick - 12;

const glow = (color: string, px = 40) => `drop-shadow(0 0 ${px}px ${color})`;

export type Tip2LogoutProps = {
  /** Show public/tip2.mp4 in the footage band to line up beats. Off for export. */
  showReference?: boolean;
  /** Studio sync helper: frame number + current beat, top-left. Off for export. */
  showBeatLabels?: boolean;
};

export const Tip2Logout: React.FC<Tip2LogoutProps> = ({
  showReference = false,
  showBeatLabels = false,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const out = (from: number, dur = 6) => Math.max(0, 1 - pop(from, dur));

  // ---- #2 badge ----
  const badge = pop(BEATS.second, 10) * out(BEATS.publicPc);

  // ---- Desktop: hero → side (friend) → hero (login) → exit (logout) ----
  const toSide = pop(BEATS.friend, 12);
  const toCenter = pop(BEATS.login, 12);
  const sideAmt = frame >= BEATS.login ? 1 - toCenter : toSide;
  const desktopX = interpolate(sideAmt, [0, 1], [CENTER_X, DESKTOP_SIDE_X]);
  const desktopSize = interpolate(sideAmt, [0, 1], [HERO, SIDE]);
  const desktopScale = pop(BEATS.publicPc, 10) * out(BEATS.logout);

  // ---- Phone (friend → login) ----
  const phoneIn = pop(BEATS.friend, 12);
  const phoneOut = pop(BEATS.login, 8);

  // ---- Check (login → close) ----
  const checkScale = pop(BEATS.login + 4, 8) * out(BEATS.close);

  // ---- Cross slam (close → logout) ----
  const slam = pop(BEATS.close, 8);
  const crossScale = (1.8 - 0.8 * slam) * out(BEATS.logout);
  const shakeIdx = frame - BEATS.close - 3;
  const shake = shakeIdx >= 0 && shakeIdx < 3 ? jitter(shakeIdx) * 0.8 : 0;

  // ---- Door (logout → cookies) ----
  const doorScale = pop(BEATS.logout, 10) * out(BEATS.cookies);
  const squash = interpolate(
    frame,
    [BEATS.logout + 10, BEATS.logout + 15, BEATS.logout + 22],
    [1, 0.85, 1],
    clamp,
  );

  // ---- Cookie (cookies → end) ----
  const cookieScale = pop(BEATS.cookies, 10);
  const cookieGlowColor = interpolateColors(
    frame,
    [BEATS.store, BEATS.store + 3],
    [colors.cyan, colors.danger],
  );
  const cookieGlowPx = interpolate(
    frame,
    [BEATS.store, BEATS.store + 5, BEATS.store + 12],
    [40, 75, 40],
    clamp,
  );
  const cookiePulse = interpolate(
    frame,
    [BEATS.store, BEATS.store + 5, BEATS.store + 12],
    [1, 1.08, 1],
    clamp,
  );

  // ---- Outro ----
  const bandOpacity = interpolate(frame, [OUTRO, OUTRO + 6], [1, 0.3], clamp);
  const rowIn = pop(OUTRO, 10);
  const ticked = frame >= BEATS.tick;

  return (
    <AbsoluteFill>
      {showReference ? <ReferenceVideo file="tip2.mp4" /> : null}

      {/* ================= TOP BAND ================= */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: BAND_H,
          overflow: "hidden", // nothing can leak into the footage band
          opacity: bandOpacity,
        }}
      >
        {badge > 0 ? (
          <At x={CENTER_X} y={CENTER_Y} transform={`scale(${1.8 * badge})`}>
            <TipBadge n={2} />
          </At>
        ) : null}

        {frame >= BEATS.friend && phoneOut < 1 ? (
          <At
            x={PHONE_X}
            y={CENTER_Y}
            transform={`translateX(${(1 - phoneIn) * 520 + phoneOut * 520}px)`}
          >
            <HeroIcon name="phone.png" size={SIDE} />
          </At>
        ) : null}

        {frame >= BEATS.publicPc && desktopScale > 0 ? (
          <At x={desktopX} y={CENTER_Y} transform={`scale(${desktopScale})`}>
            <div style={{ position: "relative", width: desktopSize, height: desktopSize }}>
              <HeroIcon name="desktop.png" size={desktopSize} />

              {frame >= BEATS.login + 4 && checkScale > 0 ? (
                <At
                  x={desktopSize - 10}
                  y={10}
                  transform={`scale(${checkScale})`}
                  style={{ filter: glow(colors.cyan, 20) }}
                >
                  <HeroIcon name="check.png" size={CHECK} />
                </At>
              ) : null}

              {frame >= BEATS.close && crossScale > 0 ? (
                <At
                  x={desktopSize / 2 + shake}
                  y={desktopSize / 2}
                  transform={`scale(${crossScale})`}
                  style={{ filter: glow(colors.danger) }}
                >
                  <HeroIcon name="cross.png" size={CROSS} />
                </At>
              ) : null}
            </div>
          </At>
        ) : null}

        {frame >= BEATS.logout && doorScale > 0 ? (
          <At
            x={CENTER_X}
            y={CENTER_Y}
            transform={`scale(${doorScale}) scaleX(${squash})`}
            style={{ filter: glow(colors.cyan) }}
          >
            <HeroIcon name="door.png" size={HERO} />
          </At>
        ) : null}

        {frame >= BEATS.cookies ? (
          <>
            <At
              x={CENTER_X}
              y={CENTER_Y - 30}
              transform={`scale(${cookieScale * cookiePulse})`}
              style={{ filter: glow(cookieGlowColor, cookieGlowPx) }}
            >
              <HeroIcon name="cookie.png" size={245} />
            </At>
            <At
              x={CENTER_X}
              y={CENTER_Y + 150}
              transform={`scale(${pop(BEATS.cookies + 4, 8)})`}
              style={{ ...poppins(36), whiteSpace: "nowrap" }}
            >
              SESSION ID
            </At>
          </>
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.publicPc} to={BEATS.friend}>
        <div style={anton(110)}>PUBLIC PC</div>
      </Headline>
      <Headline from={BEATS.friend} to={BEATS.login}>
        <div style={anton(110)}>FRIEND'S PHONE</div>
      </Headline>
      <Headline from={BEATS.login} to={BEATS.close}>
        <div style={anton(110)}>LOGGED IN</div>
      </Headline>
      <Headline from={BEATS.close} to={BEATS.logout}>
        <div style={anton(110)}>
          DON'T JUST <span style={{ color: colors.danger }}>CLOSE</span>
        </div>
      </Headline>
      <Headline from={BEATS.logout} to={BEATS.cookies} enter="pop">
        <div style={{ ...anton(110), color: colors.cyan }}>LOG OUT</div>
      </Headline>
      <Headline from={BEATS.cookies} to={OUTRO}>
        <div style={anton(110)}>COOKIES</div>
      </Headline>
      <Headline from={BEATS.store} to={BEATS.end}>
        <div style={anton(110)}>
          <span style={{ color: colors.danger }}>SAVED</span> ON DEVICE
        </div>
      </Headline>

      {frame >= OUTRO ? (
        <At x={CENTER_X} y={ROW_Y} transform={`scale(${rowIn})`}>
          <CheckRow
            checked={ticked ? 2 : 1}
            animateNewest={ticked}
            checkFrom={BEATS.tick}
            tickPop
          />
        </At>
      ) : null}

      {showBeatLabels ? <BeatLabel beats={BEATS} /> : null}
    </AbsoluteFill>
  );
};
