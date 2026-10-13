/**
 * Tip #1 – Public WiFi.
 * VO: "1st thing, public wifi ki connect cheskune tappudu important sensitive
 * accounts ni open cheyyaku. Okavela chesna vpn on chesko. Endhuku ante
 * attackers aa wifi thone ni session id ni steal chesstharu."
 */

// ---------- TIMING (retime here; everything below is relative to these) ----------
export const BEATS = {
  first: 0, // "1st thing"
  wifi: 18, // "public wifi ki connect cheskune tappudu"
  accounts: 100, // "important sensitive accounts ni open cheyyaku"
  vpn: 153, // "okavela chesna vpn on chesko"
  attack: 195, // "endhuku ante attackers ... session id ni steal chesstharu"
  tick: 282, // checkbox 1 ticks
};
export const DURATION = 300;

import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { CheckRow } from "../components/CheckRow";
import { Glitch } from "../components/Glitch";
import { Headline, anton } from "../components/Headline";
import { At, clamp, jitter, usePop } from "../components/motion";
import { PhoneIcon } from "../components/PhoneIcon";
import { ReferenceVideo } from "../components/ReferenceVideo";
import { SessionChip } from "../components/SessionChip";
import { TipBadge } from "../components/TipBadge";
import { colors, fontWeights, fonts, layout } from "../theme";

// ---------- Top band geometry ----------
const BAND_H = layout.footageTop; // 656
const LINE_Y = 380;
const PHONE_X = 260;
const ROUTER_X = 820;
const LINE_X1 = 350; // phone side
const LINE_X2 = 700; // router side
const MID_X = (LINE_X1 + LINE_X2) / 2;
const TUNNEL_R = 36;
const GREY = "#8A8F98";

// ---------- Icons (flat SVG: navy fill + off-white outline) ----------

const RouterIcon: React.FC = () => (
  <svg width={260} height={170} viewBox="0 0 260 170" style={{ overflow: "visible" }}>
    <line x1={60} y1={78} x2={40} y2={8} stroke={colors.text} strokeWidth={8} strokeLinecap="round" />
    <line x1={200} y1={78} x2={220} y2={8} stroke={colors.text} strokeWidth={8} strokeLinecap="round" />
    <rect x={10} y={74} width={240} height={90} rx={22} fill={colors.panel} stroke={colors.text} strokeWidth={7} />
    {[70, 105, 140].map((cx) => (
      <circle key={cx} cx={cx} cy={119} r={8} fill={colors.cyan} />
    ))}
    <line x1={170} y1={119} x2={220} y2={119} stroke={colors.text} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

const APP_GLYPHS: React.ReactNode[] = [
  // Bank building
  <g key="bank">
    <path d="M 26 46 L 56 24 L 86 46 Z" />
    <path d="M 35 52 L 35 76 M 50 52 L 50 76 M 62 52 L 62 76 M 77 52 L 77 76" />
    <path d="M 26 84 L 86 84" />
  </g>,
  // Envelope
  <g key="mail">
    <rect x={24} y={34} width={64} height={46} rx={6} />
    <path d="M 27 38 L 56 60 L 85 38" />
  </g>,
  // User profile
  <g key="user">
    <circle cx={56} cy={46} r={13} />
    <path d="M 31 86 C 31 64 81 64 81 86" />
  </g>,
];

const AppIcon: React.FC<{ index: number }> = ({ index }) => (
  <svg width={112} height={112} viewBox="0 0 112 112">
    <circle cx={56} cy={56} r={52} fill={colors.panel} stroke={colors.text} strokeWidth={5} />
    <g fill="none" stroke={colors.text} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      {APP_GLYPHS[index]}
    </g>
  </svg>
);

const RedStamp: React.FC = () => (
  <svg width={112} height={112} viewBox="0 0 112 112" style={{ overflow: "visible" }}>
    <g stroke={colors.danger} strokeWidth={16} strokeLinecap="round">
      <path d="M 20 20 L 92 92" />
      <path d="M 92 20 L 20 92" />
    </g>
  </svg>
);

const ShieldGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 80 92">
    <path
      d="M 40 4 L 74 16 L 74 44 C 74 66 58 82 40 88 C 22 82 6 66 6 44 L 6 16 Z"
      fill="rgba(34, 211, 238, 0.15)"
      stroke={colors.cyan}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </svg>
);

const Hacker: React.FC = () => (
  <svg width={200} height={230} viewBox="0 0 200 230" style={{ overflow: "visible" }}>
    <path
      d="M 100 8 C 42 8 22 66 26 124 C 18 150 6 190 2 230 L 198 230 C 194 190 182 150 174 124 C 178 66 158 8 100 8 Z"
      fill={colors.panel}
      stroke={colors.danger}
      strokeWidth={3}
      strokeOpacity={0.8}
    />
    <ellipse cx={100} cy={104} rx={44} ry={52} fill="#000" />
    <g style={{ filter: `drop-shadow(0 0 8px ${colors.danger})` }}>
      <ellipse cx={82} cy={104} rx={10} ry={4.5} fill={colors.danger} />
      <ellipse cx={118} cy={104} rx={10} ry={4.5} fill={colors.danger} />
    </g>
  </svg>
);

// ---------- Scene ----------

export type Tip1PublicWifiProps = {
  /** Show public/tip1.mp4 in the footage band to line up beats. Off for export. */
  showReference?: boolean;
};

export const Tip1PublicWifi: React.FC<Tip1PublicWifiProps> = ({
  showReference = false,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop();

  // ---- Beat 2: wifi ----
  const phoneIn = pop(BEATS.wifi, 12);
  const routerIn = pop(BEATS.wifi + 3, 12);
  const ssidIn = pop(BEATS.wifi + 8, 10);
  const lineDraw = interpolate(
    frame,
    [BEATS.wifi + 14, BEATS.wifi + 29],
    [0, 1],
    clamp,
  );
  const linePath = `M ${LINE_X2} ${LINE_Y} L ${LINE_X1} ${LINE_Y}`;
  const lineMask = evolvePath(lineDraw, linePath);
  const connectedOpacity =
    interpolate(frame, [BEATS.wifi + 29, BEATS.wifi + 35], [0, 1], clamp) *
    interpolate(frame, [BEATS.attack, BEATS.attack + 4], [1, 0], clamp);

  // ---- Beat 3: accounts ----
  const appTargets = [
    { x: PHONE_X - 150, y: 205 },
    { x: PHONE_X, y: 150 },
    { x: PHONE_X + 150, y: 205 },
  ];
  const appsOut = Math.max(0, 1 - pop(BEATS.vpn, 8));

  // ---- Beat 4: vpn ----
  const toggleScale = Math.max(
    0,
    pop(BEATS.vpn, 8) * (1 - pop(BEATS.attack, 6)),
  );
  const flip = pop(BEATS.vpn + 8, 8);
  const tunnelIn = Math.max(0, pop(BEATS.vpn + 8, 10));
  const tunnelColor = interpolateColors(
    frame,
    [BEATS.attack, BEATS.attack + 6],
    [colors.cyan, GREY],
  );
  const tunnelOpacity = interpolate(
    frame,
    [BEATS.attack, BEATS.attack + 6],
    [1, 0.3],
    clamp,
  );
  const glowAmount = interpolate(
    frame,
    [BEATS.attack, BEATS.attack + 4],
    [1, 0],
    clamp,
  );
  const span = LINE_X2 - LINE_X1;
  const shimmerX =
    LINE_X1 - 150 + ((Math.max(0, frame - BEATS.vpn - 8) * 14) % (span + 300));

  // ---- Beat 5: attack ----
  const noVpnScale = pop(BEATS.attack + 2, 8);
  const hackerRise = pop(BEATS.attack + 4, 12);
  const hackerGlitch =
    frame >= BEATS.attack + 4 && frame < BEATS.attack + 8;
  const SNATCH = BEATS.attack + 40;
  const chipTravel = interpolate(
    frame,
    [BEATS.attack + 12, SNATCH],
    [0, 1],
    { ...clamp, easing: (t) => t * t * (3 - 2 * t) },
  );
  const jerk = pop(SNATCH, 6);
  const snatched = frame >= SNATCH;
  const chipX = interpolate(chipTravel, [0, 1], [PHONE_X, MID_X]) + 40 * jerk;
  const chipY = LINE_Y + 80 * jerk;
  const chipRotate = -9 * jerk;

  const armProgress = interpolate(frame, [SNATCH - 7, SNATCH], [0, 1], clamp);
  const shoulder = { x: MID_X + 78, y: 560 };
  const hand = { x: chipX + 46, y: chipY + 18 };
  const armPath = `M ${shoulder.x} ${shoulder.y} Q ${shoulder.x + 30} ${hand.y + 40} ${hand.x} ${hand.y}`;
  const arm = evolvePath(armProgress, armPath);
  const armTip = getPointAtLength(armPath, getLength(armPath) * armProgress) ?? hand;
  const flash = frame >= SNATCH && frame < SNATCH + 3 ? 0.25 : 0;

  // ---- Tick ----
  const dim = interpolate(frame, [BEATS.tick, BEATS.tick + 6], [1, 0.4], clamp);

  return (
    <AbsoluteFill>
      {showReference ? <ReferenceVideo file="tip1.mp4" /> : null}

      {/* ================= TOP BAND ================= */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: BAND_H,
          overflow: "hidden", // hard guarantee: nothing leaks into the footage
          opacity: dim,
        }}
      >
        {/* Connection line, tunnel, wifi arcs */}
        <svg
          width={1080}
          height={BAND_H}
          viewBox={`0 0 1080 ${BAND_H}`}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <mask id="lineMask" maskUnits="userSpaceOnUse">
              <path
                d={linePath}
                stroke="#fff"
                strokeWidth={20}
                strokeDasharray={lineMask.strokeDasharray}
                strokeDashoffset={lineMask.strokeDashoffset}
              />
            </mask>
            <linearGradient
              id="shimmer"
              gradientUnits="userSpaceOnUse"
              x1={shimmerX - 90}
              x2={shimmerX + 90}
              y1={0}
              y2={0}
            >
              <stop offset="0" stopColor={tunnelColor} />
              <stop offset="0.5" stopColor={frame >= BEATS.attack ? tunnelColor : "#FFFFFF"} />
              <stop offset="1" stopColor={tunnelColor} />
            </linearGradient>
          </defs>

          {frame >= BEATS.wifi + 14 ? (
            <path
              d={linePath}
              stroke={colors.text}
              strokeWidth={6}
              strokeDasharray="18 14"
              strokeLinecap="round"
              mask="url(#lineMask)"
            />
          ) : null}

          {frame >= BEATS.vpn + 8 ? (
            <g
              opacity={tunnelOpacity}
              style={{
                transformOrigin: `0px ${LINE_Y}px`,
                transform: `scaleY(${tunnelIn})`,
                filter:
                  glowAmount > 0
                    ? `drop-shadow(0 0 ${14 * glowAmount}px ${colors.cyan})`
                    : undefined,
              }}
            >
              <rect
                x={LINE_X1 - 10}
                y={LINE_Y - TUNNEL_R}
                width={span + 20}
                height={TUNNEL_R * 2}
                fill={tunnelColor}
                fillOpacity={0.1}
              />
              {[-TUNNEL_R, TUNNEL_R].map((dy) => (
                <line
                  key={dy}
                  x1={LINE_X1 - 10}
                  x2={LINE_X2 + 10}
                  y1={LINE_Y + dy}
                  y2={LINE_Y + dy}
                  stroke="url(#shimmer)"
                  strokeWidth={7}
                  strokeLinecap="round"
                />
              ))}
            </g>
          ) : null}

          {/* Looping wifi arcs above the router */}
          {frame >= BEATS.wifi + 10
            ? [0, 1, 2].map((i) => {
                const t = ((frame - BEATS.wifi - 10) / 24 + i / 3) % 1;
                const r = 30 + 60 * t;
                const cx = ROUTER_X;
                const cy = 262;
                const a = (deg: number) => (deg * Math.PI) / 180;
                return (
                  <path
                    key={i}
                    d={`M ${cx + r * Math.cos(a(-140))} ${cy + r * Math.sin(a(-140))} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a(-40))} ${cy + r * Math.sin(a(-40))}`}
                    fill="none"
                    stroke={colors.cyan}
                    strokeWidth={8}
                    strokeLinecap="round"
                    opacity={(1 - t) * ssidIn}
                  />
                );
              })
            : null}
        </svg>

        {/* Phone + router spring in from the sides */}
        {frame >= BEATS.wifi ? (
          <>
            <At x={PHONE_X} y={LINE_Y} transform={`translateX(${(1 - phoneIn) * -460}px)`}>
              <PhoneIcon />
            </At>
            <At x={ROUTER_X} y={LINE_Y + 18} transform={`translateX(${(1 - routerIn) * 460}px)`}>
              <RouterIcon />
            </At>
            <At
              x={ROUTER_X}
              y={140}
              transform={`scale(${ssidIn})`}
              style={{
                fontFamily: fonts.mono,
                fontWeight: fontWeights.mono,
                fontSize: 34,
                color: colors.text,
                whiteSpace: "nowrap",
              }}
            >
              FREE_PUBLIC_WIFI
            </At>
          </>
        ) : null}

        {connectedOpacity > 0 ? (
          <At
            x={MID_X}
            y={LINE_Y + 62}
            style={{
              opacity: connectedOpacity,
              fontFamily: fonts.label,
              fontWeight: fontWeights.label,
              fontSize: 32,
              color: colors.panel,
              background: colors.text,
              borderRadius: 999,
              padding: "4px 22px",
              whiteSpace: "nowrap",
            }}
          >
            Connected
          </At>
        ) : null}

        {/* Beat 3: app icons pop out of the phone, then get stamped */}
        {frame >= BEATS.accounts && appsOut > 0
          ? appTargets.map((target, i) => {
              const p = pop(BEATS.accounts + i * 4, 10);
              if (frame < BEATS.accounts + i * 4) return null;
              const x = PHONE_X + (target.x - PHONE_X) * p;
              const y = LINE_Y + (target.y - LINE_Y) * p;
              const stampFrom = BEATS.accounts + 20 + i * 5;
              const stampS = pop(stampFrom, 8);
              const shakeIdx = frame - stampFrom - 3;
              const shake = shakeIdx >= 0 && shakeIdx < 3 ? jitter(shakeIdx, i) * 0.6 : 0;
              return (
                <At
                  key={i}
                  x={x + shake}
                  y={y}
                  transform={`scale(${Math.max(0, p) * appsOut})`}
                >
                  <div style={{ position: "relative" }}>
                    <AppIcon index={i} />
                    {frame >= stampFrom ? (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          transform: `scale(${1.8 - 0.8 * stampS})`,
                        }}
                      >
                        <RedStamp />
                      </div>
                    ) : null}
                  </div>
                </At>
              );
            })
          : null}

        {/* Beat 4: VPN toggle above the line */}
        {toggleScale > 0 ? (
          <At
            x={MID_X}
            y={LINE_Y - 100}
            transform={`scale(${toggleScale})`}
            style={{ display: "flex", alignItems: "center", gap: 22 }}
          >
            <div style={{ ...anton(64), lineHeight: 1 }}>VPN</div>
            <div
              style={{
                position: "relative",
                width: 150,
                height: 80,
                boxSizing: "border-box",
                borderRadius: 999,
                border: `4px solid ${colors.cyan}`,
                backgroundColor: interpolateColors(
                  Math.min(1, Math.max(0, flip)),
                  [0, 1],
                  [colors.panel, colors.cyan],
                ),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 7,
                  left: 8 + 70 * flip,
                  width: 58,
                  height: 58,
                  borderRadius: 999,
                  backgroundColor: flip > 0.5 ? colors.panel : colors.text,
                }}
              />
            </div>
          </At>
        ) : null}

        {/* Beat 5: "NO VPN?" */}
        {frame >= BEATS.attack + 2 ? (
          <At
            x={MID_X}
            y={LINE_Y - 90}
            transform={`scale(${noVpnScale})`}
            style={{
              fontFamily: fonts.mono,
              fontWeight: fontWeights.mono,
              fontSize: 38,
              color: colors.danger,
              whiteSpace: "nowrap",
            }}
          >
            NO VPN?
          </At>
        ) : null}

        {/* Beat 5: hacker rises from below the line */}
        {frame >= BEATS.attack + 4 ? (
          <div
            style={{
              position: "absolute",
              left: MID_X - 100,
              top: 418,
              transform: `translateY(${(1 - hackerRise) * 260}px)`,
            }}
          >
            <Glitch active={hackerGlitch}>
              <Hacker />
            </Glitch>
          </div>
        ) : null}

        {/* Beat 5: session chip travels phone → router, gets snatched */}
        {frame >= BEATS.attack + 10 ? (
          <At x={chipX} y={chipY} transform={`rotate(${chipRotate}deg)`}>
            <SessionChip
              popFrom={BEATS.attack + 10}
              borderColor={snatched ? colors.danger : colors.cyan}
              glitch={snatched && frame < SNATCH + 8}
              style={{
                minWidth: 0,
                height: 72,
                fontSize: 34,
                padding: "0 26px",
                borderWidth: 3,
              }}
            />
          </At>
        ) : null}

        {/* Hacker's arm reaching for the chip */}
        {armProgress > 0 ? (
          <svg
            width={1080}
            height={BAND_H}
            viewBox={`0 0 1080 ${BAND_H}`}
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d={armPath}
              fill="none"
              stroke={colors.danger}
              strokeWidth={34}
              strokeLinecap="round"
              strokeDasharray={arm.strokeDasharray}
              strokeDashoffset={arm.strokeDashoffset}
            />
            <path
              d={armPath}
              fill="none"
              stroke={colors.panel}
              strokeWidth={26}
              strokeLinecap="round"
              strokeDasharray={arm.strokeDasharray}
              strokeDashoffset={arm.strokeDashoffset}
            />
            <circle
              cx={armTip.x}
              cy={armTip.y}
              r={22}
              fill={colors.panel}
              stroke={colors.danger}
              strokeWidth={4}
            />
          </svg>
        ) : null}

        {/* Red flash on the snatch */}
        {flash > 0 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: colors.danger,
              opacity: flash,
            }}
          />
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.first} to={BEATS.wifi} enter="pop">
        <TipBadge n={1} />
      </Headline>

      <Headline from={BEATS.wifi} to={BEATS.accounts}>
        <div style={anton(110)}>
          PUBLIC <span style={{ color: colors.cyan }}>WIFI</span>
        </div>
      </Headline>

      <Headline from={BEATS.accounts} to={BEATS.vpn}>
        <div
          style={{
            fontFamily: fonts.label,
            fontWeight: fontWeights.label,
            fontSize: 64,
            lineHeight: 1.2,
            color: colors.text,
          }}
        >
          <span style={{ color: colors.danger }}>DON'T</span> OPEN
          <br />
          SENSITIVE ACCOUNTS
        </div>
      </Headline>

      <Headline from={BEATS.vpn} to={BEATS.attack}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <ShieldGlyph size={76} />
          <div style={anton(110)}>
            TURN ON <span style={{ color: colors.cyan }}>VPN</span>
          </div>
        </div>
      </Headline>

      <Headline from={BEATS.attack} to={DURATION}>
        <Glitch active={frame < BEATS.attack + 6}>
          <div style={{ ...anton(110), color: colors.danger }}>
            SESSION STOLEN
          </div>
        </Glitch>
      </Headline>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1800 - 45,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CheckRow
          checked={frame >= BEATS.tick ? 1 : 0}
          checkFrom={BEATS.tick}
          tickPop
          highlight={frame < BEATS.tick ? 1 : undefined}
        />
      </div>
    </AbsoluteFill>
  );
};
