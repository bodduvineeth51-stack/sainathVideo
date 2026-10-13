/**
 * Thing #1 – Public WiFi.
 *
 * VO: "1st thing nuvvu eppudaina public wifi ki connect chesukunte, appudu
 * important sensitive accounts ni open cheyyaku. Okavela chesthe VPN on
 * chesko. Endhukante attackers aa wifi thone nee session id ni steal chestharu."
 *
 * Four beats, one per line of the VO. Retime BEATS to match the voiceover.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { CheckRow } from "../components/CheckRow";
import { FootageGuide } from "../components/FootageGuide";
import { SessionChip } from "../components/SessionChip";
import { Shield } from "../components/Shield";
import { WifiIcon } from "../components/WifiIcon";
import { colors, fontWeights, fonts, layout, popSpring } from "../theme";

/** Start frame of each beat; last entry is the scene length. */
export const BEATS = {
  wifi: 0,
  dontLogin: 60,
  vpn: 120,
  hijack: 180,
  end: 240,
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Shared bits ----------

type Part = { text: string; color?: string };

/** Headline that slams in (scale 1.4 → 1) with an optional subline. */
const SlamHeadline: React.FC<{ parts: Part[]; sub: string; shake?: boolean }> = ({
  parts,
  sub,
  shake = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: popSpring, durationInFrames: 8 });
  const subPop = spring({
    frame: frame - 5,
    fps,
    config: popSpring,
    durationInFrames: 8,
  });
  const [sx, sy] = shake ? ([[6, -4], [-5, 5], [3, -3]][frame - 4] ?? [0, 0]) : [0, 0];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1395,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        transform: `translate(${sx}px, ${sy}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.headline,
          fontWeight: fontWeights.headline,
          fontSize: 130,
          lineHeight: 1.1,
          letterSpacing: 2,
          color: colors.text,
          whiteSpace: "nowrap",
          transform: `scale(${interpolate(slam, [0, 1], [1.4, 1])})`,
        }}
      >
        {parts.map((p, i) => (
          <span key={i} style={{ color: p.color ?? colors.text }}>
            {i > 0 ? " " : ""}
            {p.text}
          </span>
        ))}
      </div>
      <div
        style={{
          fontFamily: fonts.label,
          fontWeight: fontWeights.label,
          fontSize: 40,
          color: colors.text,
          transform: `scale(${subPop})`,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/** Centers its child on the top band. */
const TopBand: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: layout.footageTop,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

// ---------- Beat 1: public WiFi ----------

const WifiBeat: React.FC = () => (
  <TopBand>
    <WifiIcon popFrom={0} />
    <SessionChip
      text="SSID: Free_Public_WiFi"
      popFrom={10}
      style={{ marginTop: 34 }}
    />
  </TopBand>
);

// ---------- Beat 2: don't open sensitive accounts ----------

const CROSS = ["M 40 40 L 160 160", "M 160 40 L 40 160"];

const AppTile: React.FC<{ label: string; index: number }> = ({ label, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - index * 3,
    fps,
    config: popSpring,
    durationInFrames: 8,
  });
  const crossFrom = 14 + index * 5;
  const crossed = frame >= crossFrom;

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 200,
        boxSizing: "border-box",
        borderRadius: 36,
        border: `4px solid ${crossed ? colors.danger : colors.text}`,
        backgroundColor: colors.panel,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.label,
        fontWeight: fontWeights.label,
        fontSize: 46,
        color: colors.text,
        transform: `scale(${pop})`,
      }}
    >
      {label}
      <svg
        width={200}
        height={200}
        viewBox="0 0 200 200"
        style={{ position: "absolute", left: -4, top: -4, overflow: "visible" }}
      >
        {CROSS.map((d, i) => {
          const from = crossFrom + i * 3;
          const p = interpolate(frame, [from, from + 5], [0, 1], clamp);
          if (p === 0) return null;
          const { strokeDasharray, strokeDashoffset } = evolvePath(p, d);
          return (
            <path
              key={i}
              d={d}
              stroke={colors.danger}
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}
      </svg>
    </div>
  );
};

const DontLoginBeat: React.FC = () => (
  <TopBand>
    <div style={{ display: "flex", gap: 44 }}>
      {["BANK", "EMAIL", "UPI"].map((label, i) => (
        <AppTile key={label} label={label} index={i} />
      ))}
    </div>
  </TopBand>
);

// ---------- Beat 3: turn on VPN ----------

const VpnBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const contentPop = spring({ frame, fps, config: popSpring, durationInFrames: 8 });
  // Toggle flips on just as the shield finishes drawing.
  const toggle = spring({
    frame: frame - 10,
    fps,
    config: popSpring,
    durationInFrames: 8,
  });
  const on = frame >= 12;

  return (
    <TopBand>
      <Shield drawFrom={0} drawDuration={14}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            transform: `scale(${contentPop})`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.headline,
              fontWeight: fontWeights.headline,
              fontSize: 130,
              lineHeight: 1,
              color: colors.text,
            }}
          >
            VPN
          </div>
          {/* Toggle switch */}
          <div
            style={{
              position: "relative",
              width: 170,
              height: 90,
              boxSizing: "border-box",
              borderRadius: 999,
              border: `4px solid ${colors.cyan}`,
              backgroundColor: on ? colors.cyan : colors.panel,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 7,
                left: 8 + interpolate(toggle, [0, 1], [0, 80]),
                width: 68,
                height: 68,
                borderRadius: 999,
                backgroundColor: on ? colors.panel : colors.cyan,
              }}
            />
          </div>
        </div>
      </Shield>
    </TopBand>
  );
};

// ---------- Beat 4: attackers steal the session ID ----------

const WarningIcon: React.FC = () => (
  <svg width={52} height={46} viewBox="0 0 52 46">
    <path
      d="M 26 4 L 49 42 L 3 42 Z"
      fill="none"
      stroke={colors.danger}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path d="M 26 17 L 26 29" stroke={colors.danger} strokeWidth={5} strokeLinecap="round" />
    <circle cx={26} cy={35.5} r={3} fill={colors.danger} />
  </svg>
);

const HijackBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = frame >= 10;
  const labelPop = spring({
    frame: frame - 10,
    fps,
    config: popSpring,
    durationInFrames: 8,
  });
  // A red copy of the chip gets yanked off to the right: "stolen".
  const steal = interpolate(frame, [16, 26], [0, 1], {
    ...clamp,
    easing: (t) => t * t * t,
  });

  return (
    <TopBand>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
          fontFamily: fonts.mono,
          fontWeight: fontWeights.mono,
          fontSize: 46,
          color: colors.danger,
          transform: `scale(${labelPop})`,
        }}
      >
        <WarningIcon />
        SESSION HIJACKED
      </div>
      <div style={{ position: "relative" }}>
        {frame >= 16 && steal < 1 ? (
          <SessionChip
            popFrom={-100}
            borderColor={colors.danger}
            textColor={colors.danger}
            background="transparent"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translateX(${steal * 900}px) rotate(${steal * 6}deg)`,
            }}
          />
        ) : null}
        <SessionChip
          popFrom={0}
          borderColor={hit ? colors.danger : colors.cyan}
          glitch={hit && frame < 30}
        />
      </div>
    </TopBand>
  );
};

// ---------- Scene ----------

export type Thing1PublicWifiProps = {
  /** Show the footage band in Studio for positioning. Keep false for export. */
  showGuides?: boolean;
};

const beat = (from: number, to: number, children: React.ReactNode) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    {children}
  </Sequence>
);

export const Thing1PublicWifi: React.FC<Thing1PublicWifiProps> = ({
  showGuides = false,
}) => {
  return (
    <AbsoluteFill>
      {showGuides ? <FootageGuide /> : null}

      {/* TOP BAND – visuals, hard-cut per beat */}
      {beat(BEATS.wifi, BEATS.dontLogin, <WifiBeat />)}
      {beat(BEATS.dontLogin, BEATS.vpn, <DontLoginBeat />)}
      {beat(BEATS.vpn, BEATS.hijack, <VpnBeat />)}
      {beat(BEATS.hijack, BEATS.end, <HijackBeat />)}

      {/* BOTTOM BAND – headline per beat */}
      {beat(
        BEATS.wifi,
        BEATS.dontLogin,
        <SlamHeadline
          parts={[{ text: "PUBLIC" }, { text: "WIFI", color: colors.cyan }]}
          sub="café · airport · railway station"
        />,
      )}
      {beat(
        BEATS.dontLogin,
        BEATS.vpn,
        <SlamHeadline
          parts={[{ text: "DON'T", color: colors.danger }, { text: "LOG IN" }]}
          sub="banking · email · UPI apps"
        />,
      )}
      {beat(
        BEATS.vpn,
        BEATS.hijack,
        <SlamHeadline
          parts={[{ text: "TURN ON" }, { text: "VPN", color: colors.cyan }]}
          sub="if you really have to"
        />,
      )}
      {beat(
        BEATS.hijack,
        BEATS.end,
        <SlamHeadline
          parts={[{ text: "SESSION" }, { text: "THEFT", color: colors.danger }]}
          sub="attackers on the same WiFi steal it"
          shake
        />,
      )}

      {/* Progress: box 1 ticks at the start of the scene */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1700,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CheckRow checked={1} checkFrom={6} />
      </div>
    </AbsoluteFill>
  );
};

