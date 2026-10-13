/**
 * Tip #1 – Public WiFi.
 * VO: "public wifi ki connect cheskune appudu important sensitive accounts ni
 * open cheyyaku. VPN on chesko. Endukante attackers aa wifi tone ni session
 * id ni steal chestharu."
 *
 * Icons (public/icons/): wireless.png, bank.png, cross.png, shield.png,
 * ninja.png, key.png. Reference clip: public/tip1.mp4.
 */

// ---------- TIMING (measured from the audio; everything derives from these) ----------
export const BEATS = {
  wifi: 43, // "public wifi ki connect cheskune appudu"
  accounts: 100, // "important sensitive accounts"
  stamps: 150, // "ni open cheyyaku"
  vpnOn: 190, // "VPN on chesko"
  attack: 223, // "endukante attackers aa wifi tone ni"
  session: 291, // "session id ni"
  steal: 313, // "steal chestharu"
  check: 322,
  tick: 330,
  end: 340,
};
export const DURATION = BEATS.end;

import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { BeatLabel } from "../components/BeatLabel";
import { CheckRow } from "../components/CheckRow";
import { Glitch } from "../components/Glitch";
import { Headline, anton, poppins } from "../components/Headline";
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
const CROSS = 180;
const KEY = 180;
const KEY_X = 300;
const NINJA_X = 700;
const BADGE_Y = 1370;
const HEADLINE_Y = 1480;
const ROW_Y = 1720;

/** Frames the key takes to fly into the ninja. */
const KEY_FLIGHT = 8;

const glow = (color: string, px = 40) => `drop-shadow(0 0 ${px}px ${color})`;

export type Tip1PublicWifiProps = {
  /** Show public/tip1.mp4 in the footage band to line up beats. Off for export. */
  showReference?: boolean;
  /** Studio sync helper: frame number + current beat, top-left. Off for export. */
  showBeatLabels?: boolean;
};

export const Tip1PublicWifi: React.FC<Tip1PublicWifiProps> = ({
  showReference = false,
  showBeatLabels = false,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const out = (from: number, dur = 6) => Math.max(0, 1 - pop(from, dur));

  // ---- wifi ----
  const wifiScale = pop(BEATS.wifi, 10) * out(BEATS.accounts);

  // ---- accounts + stamps ----
  const bankScale = pop(BEATS.accounts, 10) * out(BEATS.vpnOn);
  const bankGlow = interpolateColors(
    frame,
    [BEATS.stamps, BEATS.stamps + 3],
    [colors.cyan, colors.danger],
  );
  const slam = pop(BEATS.stamps, 8);
  const crossScale = (1.8 - 0.8 * slam) * out(BEATS.vpnOn);
  const shakeIdx = frame - BEATS.stamps - 3; // shake as the stamp lands
  const shake = shakeIdx >= 0 && shakeIdx < 3 ? jitter(shakeIdx) : 0;

  // ---- vpnOn: shield with one pulse ----
  const shieldScale = pop(BEATS.vpnOn, 10) * out(BEATS.attack);
  const shieldPulse = interpolate(
    frame,
    [BEATS.vpnOn + 10, BEATS.vpnOn + 15, BEATS.vpnOn + 22],
    [0, 1, 0],
    clamp,
  );

  // ---- attack: ninja (glitch on entry), slides right at session ----
  const ninjaScale = pop(BEATS.attack, 10);
  const ninjaGlitch = frame >= BEATS.attack && frame < BEATS.attack + 4;
  const ninjaX = interpolate(pop(BEATS.session, 12), [0, 1], [HERO_X, NINJA_X]);

  // ---- session: key + label; steal: key flies into the ninja ----
  const keyIn = pop(BEATS.session, 10);
  const flight = interpolate(frame, [BEATS.steal, BEATS.steal + KEY_FLIGHT], [0, 1], {
    ...clamp,
    easing: (t) => t * t,
  });
  const keyX = interpolate(flight, [0, 1], [KEY_X, NINJA_X]);
  const keyScale = keyIn * (1 - 0.8 * flight);
  const keyVisible = frame >= BEATS.session && frame < BEATS.steal + KEY_FLIGHT;
  const labelScale = pop(BEATS.session + 3, 8) * out(BEATS.steal);

  // Red pulse ring around the ninja when the key lands
  const ringFrom = BEATS.steal + KEY_FLIGHT;
  const ring = interpolate(frame, [ringFrom, ringFrom + 14], [0, 1], clamp);

  // ---- check / tick ----
  const rowIn = pop(BEATS.check, 10);
  const ticked = frame >= BEATS.tick;

  return (
    <AbsoluteFill>
      {showReference ? <ReferenceVideo clip="tip1.mp4" /> : null}

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
        {frame >= BEATS.wifi && wifiScale > 0 ? (
          <At x={HERO_X} y={HERO_Y} transform={`scale(${wifiScale})`} style={{ filter: glow(colors.cyan) }}>
            <HeroIcon name="wireless.png" size={HERO} />
          </At>
        ) : null}

        {frame >= BEATS.accounts && bankScale > 0 ? (
          <At x={HERO_X} y={HERO_Y} transform={`scale(${bankScale})`}>
            <div style={{ position: "relative", width: HERO, height: HERO }}>
              <div style={{ filter: glow(bankGlow) }}>
                <HeroIcon name="bank.png" size={HERO} />
              </div>
              {frame >= BEATS.stamps && crossScale > 0 ? (
                <At
                  x={HERO * 0.8 + shake}
                  y={HERO * 0.8}
                  transform={`scale(${crossScale})`}
                  style={{ filter: glow(colors.danger, 24) }}
                >
                  <HeroIcon name="cross.png" size={CROSS} />
                </At>
              ) : null}
            </div>
          </At>
        ) : null}

        {frame >= BEATS.vpnOn && shieldScale > 0 ? (
          <At
            x={HERO_X}
            y={HERO_Y}
            transform={`scale(${shieldScale * (1 + 0.08 * shieldPulse)})`}
            style={{ filter: glow(colors.cyan, 40 + 40 * shieldPulse) }}
          >
            <HeroIcon name="shield.png" size={HERO} />
          </At>
        ) : null}

        {frame >= BEATS.attack ? (
          <At
            x={ninjaX}
            y={HERO_Y}
            transform={`scale(${ninjaScale})`}
            style={{ filter: glow(colors.danger) }}
          >
            <Glitch active={ninjaGlitch}>
              <HeroIcon name="ninja.png" size={HERO} />
            </Glitch>
          </At>
        ) : null}

        {frame >= ringFrom && ring < 1 ? (
          <svg width={1080} height={BAND_H} style={{ position: "absolute", inset: 0 }}>
            <circle
              cx={NINJA_X}
              cy={HERO_Y}
              r={150 + 120 * ring}
              fill="none"
              stroke={colors.danger}
              strokeWidth={10 * (1 - ring) + 2}
              opacity={1 - ring}
            />
          </svg>
        ) : null}

        {keyVisible ? (
          <At
            x={keyX}
            y={HERO_Y}
            transform={`scale(${keyScale})`}
            style={{ filter: glow(colors.cyan, 30) }}
          >
            <HeroIcon name="key.png" size={KEY} />
          </At>
        ) : null}

        {frame >= BEATS.session && labelScale > 0 ? (
          <At
            x={KEY_X}
            y={HERO_Y + KEY / 2 + 40}
            transform={`scale(${labelScale})`}
            style={{ ...poppins(34), whiteSpace: "nowrap" }}
          >
            SESSION ID
          </At>
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.wifi} to={BEATS.accounts} y={HEADLINE_Y}>
        <div style={anton(110)}>
          PUBLIC <span style={{ color: colors.cyan }}>WIFI</span>
        </div>
      </Headline>
      <Headline from={BEATS.accounts} to={BEATS.stamps} y={HEADLINE_Y}>
        <div style={anton(110)}>SENSITIVE ACCOUNTS</div>
      </Headline>
      <Headline from={BEATS.stamps} to={BEATS.vpnOn} y={HEADLINE_Y}>
        <div style={anton(110)}>
          <span style={{ color: colors.danger }}>DON'T</span> OPEN
        </div>
      </Headline>
      <Headline from={BEATS.vpnOn} to={BEATS.attack} y={HEADLINE_Y}>
        <div style={anton(110)}>
          USE A <span style={{ color: colors.cyan }}>VPN</span>
        </div>
      </Headline>
      <Headline from={BEATS.attack} to={BEATS.steal} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.danger }}>HACKERS WATCH</div>
      </Headline>
      <Headline from={BEATS.steal} to={BEATS.end} y={HEADLINE_Y}>
        <div style={{ ...anton(110), color: colors.danger }}>SESSION STOLEN</div>
      </Headline>

      {/* Badge drawn after the headlines so exiting text passes behind it */}
      <At x={HERO_X} y={BADGE_Y}>
        <TipBadge n={1} enterAt={0} />
      </At>

      {frame >= BEATS.check ? (
        <At x={HERO_X} y={ROW_Y} transform={`scale(${rowIn})`}>
          <CheckRow
            checked={ticked ? 1 : 0}
            checkFrom={BEATS.tick}
            tickPop
          />
        </At>
      ) : null}

      {showBeatLabels ? <BeatLabel beats={BEATS} /> : null}
    </AbsoluteFill>
  );
};
