/**
 * Tip #5 – Fake APKs and fake links.
 * VO: "and 5th most important thing enti ante, aa fake APK kani aa fake links
 * kani click cheyyakandi. Okavela click chesinaru anko, mee device lo malware
 * install ayyi, only mee session id ne kaadu, mee device mottam attacker
 * chetiloki ellipoddi."
 *
 * Icons (public/icons/): important.png, apk.png, link.png, dont-click.png,
 * click.png, device.png, malware.png, session-id.png, hacker.png.
 * Reference clip: public/tip5.mp4.
 */

// ---------- TIMING (measured from the audio; everything derives from these) ----------
export const BEATS = {
  important: 0, // "and 5th most important thing enti ante"
  fakeApk: 63, // "aa fake APK kani"
  fakeLinks: 105, // "aa fake links kani"
  dontClick: 126, // "click cheyyakandi"
  ifClick: 159, // "okavela click chesinaru anko"
  device: 196, // "mee device lo"
  install: 225, // "malware install ayyi"
  notJust: 249, // "only mee session id ne kaadu"
  whole: 288, // "mee device mottam"
  hacker: 324, // "attacker chetiloki ellipoddi"
  checkRow: 340,
  tick: 350,
  end: 360,
};
export const DURATION = BEATS.end;

import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
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
const HERO = HERO_MAX; // 280 (the requested 300px "whole" phone is capped here)
const LINK_SIDE_X = 440;
const SIDE_X = 680;
const STOP_Y = 390;
const STOP_SIZE = 180;
const FINGER_Y = 400;
const FINGER_SIZE = 150;
const MALWARE_SIZE = 170;
const MALWARE_Y = 360;
const SMALL_PHONE = 150;
const SMALL_PHONE_X = 700;
const SMALL_PHONE_Y = 410;
const HACKER_X = 470;
const HACKER_SIZE = 260;
const BADGE_Y = 1370;
const HEADLINE_Y = 1480;
const ROW_Y = 1720;

const STRIKE = `M ${HERO_X - 150} ${HERO_Y + 120} L ${HERO_X + 150} ${HERO_Y - 120}`;

const glow = (color: string, px = 40) => `drop-shadow(0 0 ${px}px ${color})`;

/** Small tilted red "FAKE" pill. */
const FakePill: React.FC = () => (
  <div
    style={{
      ...anton(36),
      lineHeight: 1,
      color: colors.text,
      background: colors.danger,
      borderRadius: 999,
      padding: "8px 20px 6px",
      whiteSpace: "nowrap",
      transform: "rotate(-8deg)",
    }}
  >
    FAKE
  </div>
);

export type Tip5FakeLinksProps = {
  /** Show public/tip5.mp4 in the footage band to line up beats. Off for export. */
  showReference?: boolean;
  /** Studio sync helper: frame number + current beat, top-left. Off for export. */
  showBeatLabels?: boolean;
};

export const Tip5FakeLinks: React.FC<Tip5FakeLinksProps> = ({
  showReference = false,
  showBeatLabels = false,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const out = (from: number, dur = 6) => Math.max(0, 1 - pop(from, dur));
  const oneShot = (from: number, peak: number, end: number) =>
    interpolate(frame, [from, peak, end], [0, 1, 0], clamp);

  // ---- important: warning with one pulse ----
  const warnScale = pop(BEATS.important, 10) * out(BEATS.fakeApk);
  const warnPulse = oneShot(BEATS.important + 12, BEATS.important + 17, BEATS.important + 24);

  // ---- fakeApk: package + FAKE pill ----
  const apkScale = pop(BEATS.fakeApk, 10) * out(BEATS.fakeLinks);
  const apkPill = pop(BEATS.fakeApk + 6, 8) * out(BEATS.fakeLinks);

  // ---- fakeLinks / dontClick / ifClick: link ----
  const linkScale = pop(BEATS.fakeLinks, 10) * out(BEATS.device);
  const linkPill = pop(BEATS.fakeLinks + 6, 8) * out(BEATS.dontClick);
  const linkX = interpolate(pop(BEATS.dontClick, 12), [0, 1], [HERO_X, LINK_SIDE_X]);
  const linkGlow = interpolateColors(
    frame,
    [BEATS.ifClick, BEATS.ifClick + 6],
    [colors.danger, colors.cyan],
  );

  // dontClick: stop sign slam with a 3-frame shake as it lands
  const slam = pop(BEATS.dontClick, 8);
  const stopScale = (1.8 - 0.8 * slam) * out(BEATS.ifClick);
  const shakeIdx = frame - BEATS.dontClick - 3;
  const shake = shakeIdx >= 0 && shakeIdx < 3 ? jitter(shakeIdx) : 0;

  // ifClick: finger slides in from bottom-right, taps at ifClick + 15
  const fingerIn = pop(BEATS.ifClick, 12);
  const fingerX = interpolate(fingerIn, [0, 1], [1100, SIDE_X]);
  const fingerY = interpolate(fingerIn, [0, 1], [720, FINGER_Y]);
  const tapAt = BEATS.ifClick + 15;
  const tap = interpolate(frame, [tapAt, tapAt + 2, tapAt + 8], [1, 0.9, 1], clamp);
  const fingerScale = tap * out(BEATS.device);
  const ripple = interpolate(frame, [tapAt, tapAt + 14], [0, 1], clamp);

  // ---- device / install: phone, malware crawls on, glow → red, glitch ----
  const phoneAScale = pop(BEATS.device, 10) * out(BEATS.notJust);
  const crawl = interpolate(frame, [BEATS.install, BEATS.install + 16], [0, 1], {
    ...clamp,
    easing: (t) => 1 - (1 - t) * (1 - t),
  });
  const malwareX = interpolate(crawl, [0, 1], [820, 660]);
  const malwareWobble = 7 * Math.sin(((frame - BEATS.install) / 30) * Math.PI * 2 * 2.5);
  const malwareScale = pop(BEATS.install, 8) * out(BEATS.notJust);
  const phoneAGlow = interpolateColors(
    frame,
    [BEATS.install + 8, BEATS.install + 14],
    [colors.cyan, colors.danger],
  );
  const glitchAt = BEATS.install + 16; // when the malware lands
  const phoneGlitch = frame >= glitchAt && frame < glitchAt + 4;

  // ---- notJust: grey ID card, red strike draws in 8 frames ----
  const cardScale = pop(BEATS.notJust, 10) * out(BEATS.whole);
  const strikeDraw = interpolate(frame, [BEATS.notJust + 6, BEATS.notJust + 14], [0, 1], clamp);
  const strike = evolvePath(strikeDraw, STRIKE);

  // ---- whole: phone returns, strong red glow pulsing twice ----
  const phoneBIn = pop(BEATS.whole, 10);
  const pulseT = interpolate(frame, [BEATS.whole + 4, BEATS.whole + 28], [0, 1], clamp);
  const twice = pulseT > 0 && pulseT < 1 ? Math.abs(Math.sin(pulseT * Math.PI * 2)) : 0;

  // ---- hacker: phone shrinks + moves; hacker rises behind with glitch ----
  const toSmall = pop(BEATS.hacker, 12);
  const phoneBX = interpolate(toSmall, [0, 1], [HERO_X, SMALL_PHONE_X]);
  const phoneBY = interpolate(toSmall, [0, 1], [HERO_Y, SMALL_PHONE_Y]);
  const phoneBSize = interpolate(toSmall, [0, 1], [HERO, SMALL_PHONE]);
  const hackerRise = pop(BEATS.hacker, 12);
  const hackerGlitch = frame >= BEATS.hacker && frame < BEATS.hacker + 4;

  // ---- checkRow / tick: the list completes, all boxes glow once ----
  const listIn = pop(BEATS.checkRow, 10);
  const ticked = frame >= BEATS.tick;
  const listGlow = oneShot(BEATS.tick + 2, BEATS.tick + 5, BEATS.tick + 9);

  return (
    <AbsoluteFill>
      {showReference ? <ReferenceVideo clip="tip5.mp4" /> : null}

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
        {warnScale > 0 ? (
          <At
            x={HERO_X}
            y={HERO_Y}
            transform={`scale(${warnScale * (1 + 0.08 * warnPulse)})`}
            style={{ filter: glow(colors.danger, 40 + 35 * warnPulse) }}
          >
            <HeroIcon name="important.png" size={HERO} />
          </At>
        ) : null}

        {frame >= BEATS.fakeApk && apkScale > 0 ? (
          <At x={HERO_X} y={HERO_Y} transform={`scale(${apkScale})`}>
            <div style={{ position: "relative", width: HERO, height: HERO }}>
              <div style={{ filter: glow(colors.danger) }}>
                <HeroIcon name="apk.png" size={HERO} />
              </div>
              {frame >= BEATS.fakeApk + 6 ? (
                <At x={HERO - 20} y={20} transform={`scale(${apkPill})`}>
                  <FakePill />
                </At>
              ) : null}
            </div>
          </At>
        ) : null}

        {frame >= BEATS.fakeLinks && linkScale > 0 ? (
          <At x={linkX} y={HERO_Y} transform={`scale(${linkScale})`}>
            <div style={{ position: "relative", width: HERO, height: HERO }}>
              <div style={{ filter: glow(linkGlow) }}>
                <HeroIcon name="link.png" size={HERO} />
              </div>
              {frame >= BEATS.fakeLinks + 6 && linkPill > 0 ? (
                <At x={HERO - 20} y={20} transform={`scale(${linkPill})`}>
                  <FakePill />
                </At>
              ) : null}
            </div>
          </At>
        ) : null}

        {frame >= BEATS.dontClick && stopScale > 0 ? (
          <At
            x={SIDE_X + shake}
            y={STOP_Y}
            transform={`scale(${stopScale})`}
            style={{ filter: glow(colors.danger, 24) }}
          >
            <HeroIcon name="dont-click.png" size={STOP_SIZE} />
          </At>
        ) : null}

        {frame >= tapAt && ripple < 1 ? (
          <svg width={1080} height={BAND_H} style={{ position: "absolute", inset: 0 }}>
            <circle
              cx={LINK_SIDE_X}
              cy={HERO_Y}
              r={60 + 140 * ripple}
              fill="none"
              stroke={colors.cyan}
              strokeWidth={10 * (1 - ripple) + 2}
              opacity={1 - ripple}
            />
          </svg>
        ) : null}

        {frame >= BEATS.ifClick && fingerScale > 0 ? (
          <At x={fingerX} y={fingerY} transform={`scale(${fingerScale})`} style={{ filter: glow(colors.cyan, 20) }}>
            <HeroIcon name="click.png" size={FINGER_SIZE} />
          </At>
        ) : null}

        {frame >= BEATS.device && phoneAScale > 0 ? (
          <At x={HERO_X} y={HERO_Y} transform={`scale(${phoneAScale})`} style={{ filter: glow(phoneAGlow) }}>
            <Glitch active={phoneGlitch}>
              <HeroIcon name="device.png" size={HERO} />
            </Glitch>
          </At>
        ) : null}
        {frame >= BEATS.install && malwareScale > 0 ? (
          <At
            x={malwareX}
            y={MALWARE_Y}
            transform={`scale(${malwareScale}) rotate(${malwareWobble}deg)`}
            style={{ filter: glow(colors.danger, 20) }}
          >
            <HeroIcon name="malware.png" size={MALWARE_SIZE} />
          </At>
        ) : null}

        {frame >= BEATS.notJust && cardScale > 0 ? (
          <>
            <At x={HERO_X} y={HERO_Y} transform={`scale(${cardScale})`} style={{ filter: "grayscale(1)" }}>
              <HeroIcon name="session-id.png" size={HERO} />
            </At>
            {strikeDraw > 0 ? (
              <svg
                width={1080}
                height={BAND_H}
                style={{ position: "absolute", inset: 0, opacity: cardScale > 0.5 ? 1 : cardScale * 2 }}
              >
                <path
                  d={STRIKE}
                  stroke={colors.danger}
                  strokeWidth={18}
                  strokeLinecap="round"
                  strokeDasharray={strike.strokeDasharray}
                  strokeDashoffset={strike.strokeDashoffset}
                />
              </svg>
            ) : null}
          </>
        ) : null}

        {/* hacker rises behind the phone */}
        {frame >= BEATS.hacker ? (
          <At
            x={HACKER_X}
            y={HERO_Y + (1 - hackerRise) * 300}
            style={{ filter: glow(colors.danger) }}
          >
            <Glitch active={hackerGlitch}>
              <HeroIcon name="hacker.png" size={HACKER_SIZE} />
            </Glitch>
          </At>
        ) : null}

        {frame >= BEATS.whole ? (
          <At
            x={phoneBX}
            y={phoneBY}
            transform={`scale(${phoneBIn * (1 + 0.06 * twice)})`}
            style={{ filter: glow(colors.danger, 55 + 45 * twice) }}
          >
            <HeroIcon name="device.png" size={phoneBSize} />
          </At>
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.important} to={BEATS.fakeApk} y={HEADLINE_Y}>
        <div style={anton(110)}>MOST IMPORTANT</div>
      </Headline>
      <Headline from={BEATS.fakeApk} to={BEATS.fakeLinks} y={HEADLINE_Y}>
        <div style={anton(110)}>FAKE APKs</div>
      </Headline>
      <Headline from={BEATS.fakeLinks} to={BEATS.dontClick} y={HEADLINE_Y}>
        <div style={anton(110)}>FAKE LINKS</div>
      </Headline>
      <Headline from={BEATS.dontClick} to={BEATS.ifClick} y={HEADLINE_Y}>
        <div style={anton(110)}>
          <span style={{ color: colors.danger }}>DON'T</span> CLICK
        </div>
      </Headline>
      <Headline from={BEATS.ifClick} to={BEATS.device} y={HEADLINE_Y}>
        <div style={anton(110)}>IF YOU CLICK...</div>
      </Headline>
      <Headline from={BEATS.device} to={BEATS.install} y={HEADLINE_Y}>
        <div style={anton(110)}>YOUR DEVICE</div>
      </Headline>
      <Headline from={BEATS.install} to={BEATS.notJust} y={HEADLINE_Y}>
        <div style={anton(110)}>MALWARE INSTALLS</div>
      </Headline>
      <Headline from={BEATS.notJust} to={BEATS.whole} y={HEADLINE_Y}>
        <div style={anton(110)}>NOT JUST THIS</div>
      </Headline>
      <Headline from={BEATS.whole} to={BEATS.hacker} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.danger }}>WHOLE DEVICE</div>
      </Headline>
      <Headline from={BEATS.hacker} to={BEATS.end} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.danger }}>IN HACKER'S HANDS</div>
      </Headline>

      {/* Badge drawn after the headlines so exiting text passes behind it */}
      <At x={HERO_X} y={BADGE_Y}>
        <TipBadge n={5} enterAt={0} />
      </At>

      {frame >= BEATS.checkRow ? (
        <At
          x={HERO_X}
          y={ROW_Y}
          transform={`scale(${listIn})`}
          style={{ filter: listGlow > 0 ? glow(colors.cyan, 30 * listGlow) : undefined }}
        >
          <CheckRow
            checked={ticked ? 5 : 4}
            animateNewest={ticked}
            checkFrom={BEATS.tick}
            checkDuration={5}
            tickPop
          />
        </At>
      ) : null}

      {showBeatLabels ? <BeatLabel beats={BEATS} /> : null}
    </AbsoluteFill>
  );
};
