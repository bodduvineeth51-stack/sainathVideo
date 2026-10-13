/**
 * Tip3TwoFactor – content: "log out on someone else's device" (#2 story).
 * VO: "public device lo kani ledha vera vaalla device lo kani login aithe,
 * mi pani aipoyaka just close cheyyakunda logout avvandi. Endukante cookies
 * store aithai."
 *
 * Icons (public/icons/): desktop.png, phone.png, check.png, cross.png,
 * door.png, cookie.png. Reference clip: public/tip2.mp4.
 */

// ---------- TIMING (measured from the audio; everything derives from these) ----------
export const BEATS = {
  publicPc: 24, // "public device lo kani"
  friend: 81, // "ledha vera vaalla device lo kani"
  login: 142, // "login aithe"
  done: 159, // "mi pani aipoyaka"
  close: 183, // "just close cheyyakunda"
  logout: 216, // "logout avvandi"
  cookies: 242, // "endukante cookies"
  store: 279, // "store aithai"
  check: 284,
  tick: 292,
  end: 298,
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
const SIDE = 220;
const DESKTOP_SIDE_X = 360;
const PHONE_X = 720;
const CHECK = 110;
const CROSS = 180;
const BADGE_Y = 1370;
const HEADLINE_Y = 1480;
const ROW_Y = 1720;

const glow = (color: string, px = 40) => `drop-shadow(0 0 ${px}px ${color})`;

export type Tip3TwoFactorProps = {
  /** Show public/tip2.mp4 in the footage band to line up beats. Off for export. */
  showReference?: boolean;
  /** Studio sync helper: frame number + current beat, top-left. Off for export. */
  showBeatLabels?: boolean;
};

export const Tip3TwoFactor: React.FC<Tip3TwoFactorProps> = ({
  showReference = false,
  showBeatLabels = false,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const out = (from: number, dur = 6) => Math.max(0, 1 - pop(from, dur));

  // ---- Desktop: hero → side (friend) → hero (login) → exit (logout) ----
  const toSide = pop(BEATS.friend, 12);
  const toCenter = pop(BEATS.login, 12);
  const sideAmt = frame >= BEATS.login ? 1 - toCenter : toSide;
  const desktopX = interpolate(sideAmt, [0, 1], [HERO_X, DESKTOP_SIDE_X]);
  const desktopSize = interpolate(sideAmt, [0, 1], [HERO, SIDE]);
  const desktopScale = pop(BEATS.publicPc, 10) * out(BEATS.logout);

  // ---- Phone (friend → login) ----
  const phoneIn = pop(BEATS.friend, 12);
  const phoneOut = pop(BEATS.login, 8);

  // ---- Check: pops at login, bounces once at done, exits at close ----
  const checkBounce = interpolate(
    frame,
    [BEATS.done, BEATS.done + 4, BEATS.done + 10],
    [1, 1.22, 1],
    clamp,
  );
  const checkScale = pop(BEATS.login, 8) * checkBounce * out(BEATS.close);

  // ---- Cross slam (close → logout) ----
  const slam = pop(BEATS.close, 8);
  const crossScale = (1.8 - 0.8 * slam) * out(BEATS.logout);

  // ---- Door with a closing squash (logout → cookies) ----
  const doorScale = pop(BEATS.logout, 10) * out(BEATS.cookies);
  const squash = interpolate(
    frame,
    [BEATS.logout + 10, BEATS.logout + 15, BEATS.logout + 22],
    [1, 0.85, 1],
    clamp,
  );

  // ---- Cookie: cyan glow, turns red + one pulse at store ----
  const cookieScale = pop(BEATS.cookies, 10);
  const cookieGlow = interpolateColors(
    frame,
    [BEATS.store, BEATS.store + 3],
    [colors.cyan, colors.danger],
  );
  const pulse = interpolate(
    frame,
    [BEATS.store, BEATS.store + 5, BEATS.store + 12],
    [0, 1, 0],
    clamp,
  );

  // ---- check / tick ----
  const rowIn = pop(BEATS.check, 10);
  const ticked = frame >= BEATS.tick;

  return (
    <AbsoluteFill>
      {showReference ? <ReferenceVideo clip="tip2.mp4" /> : null}

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
        {frame >= BEATS.friend && phoneOut < 1 ? (
          <At
            x={PHONE_X}
            y={HERO_Y}
            transform={`translateX(${(1 - phoneIn) * 520 + phoneOut * 520}px)`}
          >
            <HeroIcon name="phone.png" size={SIDE} />
          </At>
        ) : null}

        {frame >= BEATS.publicPc && desktopScale > 0 ? (
          <At x={desktopX} y={HERO_Y} transform={`scale(${desktopScale})`}>
            <div style={{ position: "relative", width: desktopSize, height: desktopSize }}>
              <div style={{ filter: glow(colors.cyan) }}>
                <HeroIcon name="desktop.png" size={desktopSize} />
              </div>

              {frame >= BEATS.login && checkScale > 0 ? (
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
                  x={desktopSize / 2}
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
            x={HERO_X}
            y={HERO_Y}
            transform={`scale(${doorScale}) scaleX(${squash})`}
            style={{ filter: glow(colors.cyan) }}
          >
            <HeroIcon name="door.png" size={HERO} />
          </At>
        ) : null}

        {frame >= BEATS.cookies ? (
          <>
            <At
              x={HERO_X}
              y={HERO_Y}
              transform={`scale(${cookieScale * (1 + 0.08 * pulse)})`}
              style={{ filter: glow(cookieGlow, 40 + 35 * pulse) }}
            >
              <HeroIcon name="cookie.png" size={HERO} />
            </At>
            <At
              x={HERO_X}
              y={HERO_Y + HERO / 2 + 40}
              transform={`scale(${pop(BEATS.cookies + 3, 8)})`}
              style={{ ...poppins(34), whiteSpace: "nowrap" }}
            >
              SESSION ID
            </At>
          </>
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.publicPc} to={BEATS.friend} y={HEADLINE_Y}>
        <div style={anton(110)}>PUBLIC PC</div>
      </Headline>
      <Headline from={BEATS.friend} to={BEATS.login} y={HEADLINE_Y}>
        <div style={anton(110)}>FRIEND'S PHONE</div>
      </Headline>
      <Headline from={BEATS.login} to={BEATS.done} y={HEADLINE_Y}>
        <div style={anton(110)}>LOGGED IN</div>
      </Headline>
      <Headline from={BEATS.done} to={BEATS.close} y={HEADLINE_Y}>
        <div style={anton(110)}>WORK DONE?</div>
      </Headline>
      <Headline from={BEATS.close} to={BEATS.logout} y={HEADLINE_Y}>
        <div style={anton(110)}>
          DON'T JUST <span style={{ color: colors.danger }}>CLOSE</span>
        </div>
      </Headline>
      <Headline from={BEATS.logout} to={BEATS.cookies} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.cyan }}>LOG OUT</div>
      </Headline>
      <Headline from={BEATS.cookies} to={BEATS.store} y={HEADLINE_Y}>
        <div style={anton(110)}>COOKIES</div>
      </Headline>
      <Headline from={BEATS.store} to={BEATS.end} y={HEADLINE_Y}>
        <div style={anton(110)}>
          <span style={{ color: colors.danger }}>SAVED</span> ON DEVICE
        </div>
      </Headline>

      {/* Badge drawn after the headlines so exiting text passes behind it */}
      <At x={HERO_X} y={BADGE_Y}>
        <TipBadge n={2} enterAt={0} />
      </At>

      {frame >= BEATS.check ? (
        <At x={HERO_X} y={ROW_Y} transform={`scale(${rowIn})`}>
          <CheckRow
            checked={ticked ? 2 : 1}
            animateNewest={ticked}
            checkFrom={BEATS.tick}
            // Finish the draw on the last frame (tick → end is only 6 frames)
            checkDuration={BEATS.end - 1 - BEATS.tick}
            tickPop
          />
        </At>
      ) : null}

      {showBeatLabels ? <BeatLabel beats={BEATS} /> : null}
    </AbsoluteFill>
  );
};
