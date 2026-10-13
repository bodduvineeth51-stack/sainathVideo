/**
 * Tip #3 – Two-factor authentication.
 *
 * Icons (public/icons/): twofa.png, otp.png, check.png, session-id.png,
 * expire.png, hacker.png, blocked.png, shield.png. Reference clip: public/tip3.mp4.
 */

// ---------- TIMING (measured from the audio; everything derives from these) ----------
export const BEATS = {
  twofa: 6,
  enable: 48,
  session: 90,
  expire: 138,
  hacker: 159,
  login: 186,
  shield: 234,
  biggest: 280,
  shieldW: 289,
  check: 290,
  tick: 300,
  end: 308,
};
export const DURATION = BEATS.end;

import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { BeatLabel } from "../components/BeatLabel";
import { CheckRow } from "../components/CheckRow";
import { Glitch } from "../components/Glitch";
import { Headline, anton } from "../components/Headline";
import { HERO_MAX, HeroIcon } from "../components/HeroIcon";
import { At, clamp, jitter, usePop } from "../components/motion";
import { ReferenceVideo } from "../components/ReferenceVideo";
import { TipBadge } from "../components/TipBadge";
import { colors, layout } from "../theme";

// ---------- Layout ----------
const BAND_H = layout.footageTop; // 656 – top band
const HERO_X = 540;
const HERO_Y = 330;
const HERO = HERO_MAX; // 280
const SIDE_Y = 400; // y for the small companion icons
const OTP_X = 470;
const OK_X = 680;
const OK_SIZE = 150;
const CARD_X = 400;
const CLOCK_X = 690;
const CLOCK_SIZE = 170;
const HACKER_X = 460;
const BLOCK_X = 660;
const BLOCK_SIZE = 180;
const BADGE_Y = 1370;
const HEADLINE_Y = 1480;
const ROW_Y = 1720;

const glow = (color: string, px = 40) => `drop-shadow(0 0 ${px}px ${color})`;

export type Tip3TwoFactorProps = {
  /** Show public/tip3.mp4 in the footage band to line up beats. Off for export. */
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

  // ---- twofa ----
  const twofaScale = pop(BEATS.twofa, 10) * out(BEATS.enable);

  // ---- enable: OTP code + check ----
  const otpScale = pop(BEATS.enable, 10) * out(BEATS.session);
  const okFrom = BEATS.enable + 10;
  const okScale = pop(okFrom, 8) * out(BEATS.session);

  // ---- session: ID card; expire: slides left, greys out, glow → red ----
  const cardScale = pop(BEATS.session, 10) * out(BEATS.hacker);
  const cardX = interpolate(pop(BEATS.expire, 12), [0, 1], [HERO_X, CARD_X]);
  const grey = interpolate(frame, [BEATS.expire, BEATS.expire + 12], [0, 1], clamp);
  const cardGlow = interpolateColors(
    frame,
    [BEATS.expire, BEATS.expire + 12],
    [colors.cyan, colors.danger],
  );

  // Alarm clock rings: ±8°, 3 cycles over 18 frames after it pops in
  const clockFrom = BEATS.expire + 2;
  const clockScale = pop(clockFrom, 8) * out(BEATS.hacker);
  const ringT = interpolate(frame, [clockFrom + 4, clockFrom + 22], [0, 1], clamp);
  const clockRotate = ringT > 0 && ringT < 1 ? 8 * Math.sin(ringT * Math.PI * 2 * 3) : 0;

  // ---- hacker (glitch on entry); login: moves left + blocked slam ----
  const hackerScale = pop(BEATS.hacker, 10) * out(BEATS.shield);
  const hackerGlitch = frame >= BEATS.hacker && frame < BEATS.hacker + 4;
  const hackerX = interpolate(pop(BEATS.login, 12), [0, 1], [HERO_X, HACKER_X]);
  const slam = pop(BEATS.login, 8);
  const blockScale = (1.8 - 0.8 * slam) * out(BEATS.shield);
  const shakeIdx = frame - BEATS.login - 3; // shake as it lands
  const shake = shakeIdx >= 0 && shakeIdx < 3 ? jitter(shakeIdx) : 0;

  // ---- shield; biggest: springs to 1.15x; shieldW: one pulse ring ----
  const shieldIn = pop(BEATS.shield, 10);
  const shieldGrow = interpolate(pop(BEATS.biggest, 10), [0, 1], [1, 1.15]);
  const ring = interpolate(frame, [BEATS.shieldW, BEATS.shieldW + 14], [0, 1], clamp);

  // ---- check / tick ----
  const rowIn = pop(BEATS.check, 10);
  const ticked = frame >= BEATS.tick;

  return (
    <AbsoluteFill>
      {showReference ? <ReferenceVideo clip="tip3.mp4" /> : null}

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
        {frame >= BEATS.twofa && twofaScale > 0 ? (
          <At x={HERO_X} y={HERO_Y} transform={`scale(${twofaScale})`} style={{ filter: glow(colors.cyan) }}>
            <HeroIcon name="twofa.png" size={HERO} />
          </At>
        ) : null}

        {frame >= BEATS.enable && otpScale > 0 ? (
          <At x={OTP_X} y={HERO_Y} transform={`scale(${otpScale})`} style={{ filter: glow(colors.cyan) }}>
            <HeroIcon name="otp.png" size={HERO} />
          </At>
        ) : null}
        {frame >= okFrom && okScale > 0 ? (
          <At x={OK_X} y={SIDE_Y} transform={`scale(${okScale})`} style={{ filter: glow(colors.cyan, 24) }}>
            <HeroIcon name="check.png" size={OK_SIZE} />
          </At>
        ) : null}

        {frame >= BEATS.session && cardScale > 0 ? (
          <At
            x={cardX}
            y={HERO_Y}
            transform={`scale(${cardScale})`}
            style={{ filter: `grayscale(${grey}) ${glow(cardGlow)}` }}
          >
            <HeroIcon name="session-id.png" size={HERO} />
          </At>
        ) : null}
        {frame >= clockFrom && clockScale > 0 ? (
          <At
            x={CLOCK_X}
            y={SIDE_Y}
            transform={`scale(${clockScale}) rotate(${clockRotate}deg)`}
            style={{ filter: glow(colors.danger, 24) }}
          >
            <HeroIcon name="expire.png" size={CLOCK_SIZE} />
          </At>
        ) : null}

        {frame >= BEATS.hacker && hackerScale > 0 ? (
          <At x={hackerX} y={HERO_Y} transform={`scale(${hackerScale})`} style={{ filter: glow(colors.danger) }}>
            <Glitch active={hackerGlitch}>
              <HeroIcon name="hacker.png" size={HERO} />
            </Glitch>
          </At>
        ) : null}
        {frame >= BEATS.login && blockScale > 0 ? (
          <At
            x={BLOCK_X + shake}
            y={SIDE_Y}
            transform={`scale(${blockScale})`}
            style={{ filter: glow(colors.danger, 24) }}
          >
            <HeroIcon name="blocked.png" size={BLOCK_SIZE} />
          </At>
        ) : null}

        {frame >= BEATS.shield ? (
          <At
            x={HERO_X}
            y={HERO_Y}
            transform={`scale(${shieldIn * shieldGrow})`}
            style={{ filter: glow(colors.cyan) }}
          >
            <HeroIcon name="shield.png" size={HERO} />
          </At>
        ) : null}
        {frame >= BEATS.shieldW && ring < 1 ? (
          <svg width={1080} height={BAND_H} style={{ position: "absolute", inset: 0 }}>
            <circle
              cx={HERO_X}
              cy={HERO_Y}
              r={(HERO / 2) * 1.15 + 140 * ring}
              fill="none"
              stroke={colors.cyan}
              strokeWidth={10 * (1 - ring) + 2}
              opacity={1 - ring}
            />
          </svg>
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.twofa} to={BEATS.enable} y={HEADLINE_Y}>
        <div style={anton(110)}>2-FACTOR AUTH</div>
      </Headline>
      <Headline from={BEATS.enable} to={BEATS.session} y={HEADLINE_Y}>
        <div style={anton(110)}>
          TURN IT <span style={{ color: colors.cyan }}>ON</span>
        </div>
      </Headline>
      <Headline from={BEATS.session} to={BEATS.expire} y={HEADLINE_Y}>
        <div style={anton(110)}>SESSION ID</div>
      </Headline>
      <Headline from={BEATS.expire} to={BEATS.hacker} y={HEADLINE_Y}>
        <div style={anton(110)}>IT EXPIRES</div>
      </Headline>
      <Headline from={BEATS.hacker} to={BEATS.login} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.danger }}>THE HACKER</div>
      </Headline>
      <Headline from={BEATS.login} to={BEATS.shield} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.danger }}>LOGIN AGAIN?</div>
      </Headline>
      <Headline from={BEATS.shield} to={BEATS.biggest} y={HEADLINE_Y}>
        <div style={anton(110)}>2FA</div>
      </Headline>
      <Headline from={BEATS.biggest} to={BEATS.end} y={HEADLINE_Y}>
        <div style={anton(110)}>
          BIGGEST <span style={{ color: colors.cyan }}>SHIELD</span>
        </div>
      </Headline>

      {/* Badge drawn after the headlines so exiting text passes behind it */}
      <At x={HERO_X} y={BADGE_Y}>
        <TipBadge n={3} enterAt={0} />
      </At>

      {frame >= BEATS.check ? (
        <At x={HERO_X} y={ROW_Y} transform={`scale(${rowIn})`}>
          <CheckRow
            checked={ticked ? 3 : 2}
            animateNewest={ticked}
            checkFrom={BEATS.tick}
            // Finish the draw on the last frame
            checkDuration={BEATS.end - 1 - BEATS.tick}
            tickPop
          />
        </At>
      ) : null}

      {showBeatLabels ? <BeatLabel beats={BEATS} /> : null}
    </AbsoluteFill>
  );
};
