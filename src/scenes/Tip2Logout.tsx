/**
 * Tip #2 – Log out, don't just close.
 * VO: "2nd thing, public device lo kani ledha vera vaalla device lo kani login
 * aithe, mi pani aipoyaka just close cheyyakunda logout avvandi. Endhukante
 * cookies andhulone store aithai."
 */

// ---------- TIMING (retime here; everything below is relative to these) ----------
export const BEATS = {
  second: 0, // "2nd thing"
  devices: 22, // "public device lo kani ledha vera vaalla device lo kani login aithe"
  done: 122, // "mi pani aipoyaka"
  close: 155, // "just close cheyyakunda"
  logout: 188, // "logout avvandi"
  cookies: 211, // "endhukante cookies andhulone store aithai"
  tick: 285, // checkbox 2 ticks
};
export const DURATION = 300;

import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { CheckRow } from "../components/CheckRow";
import { Headline, anton, poppins } from "../components/Headline";
import { At, clamp, jitter, usePop } from "../components/motion";
import { PhoneIcon } from "../components/PhoneIcon";
import { ReferenceVideo } from "../components/ReferenceVideo";
import { TipBadge } from "../components/TipBadge";
import { colors, fontWeights, fonts, layout } from "../theme";

// ---------- Top band geometry ----------
const BAND_H = layout.footageTop; // 656
const MON_X = 330;
const MON_W = 360;
const MON_H = 240;
const MON_TOP = 215;
const BEZEL = 17; // border + padding around the screen
const SCREEN_W = MON_W - BEZEL * 2; // 326
const SCREEN_H = MON_H - BEZEL * 2; // 206
const SCREEN_TOP = MON_TOP + BEZEL;
const PHONE_X = 820;
const PHONE_Y = 380;
const MON_SHIFT = -130; // monitor slides left for the storage drawer

const TITLE_H = 36;
// Screen-local positions of the interactive bits
const CLOSE_BTN = { x: SCREEN_W - 22, y: TITLE_H / 2 };
const LOGOUT_BTN = { x: 215, y: 140 };

const SCREEN_BG = "#131C33";
const BAR_GREY = "#3A4560";
const COOKIE = "#C98B4B";
const COOKIE_EDGE = "#8A5A2B";
const CHIP = "#5A3518";

// ---------- Small SVG glyphs (no font fallbacks for ✓ ✕ ≠) ----------

const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path d="M 6 17 L 13 24 L 26 9" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NotEqual: React.FC = () => (
  <svg width={40} height={40} viewBox="0 0 40 40">
    <g stroke={colors.text} strokeWidth={6} strokeLinecap="round">
      <path d="M 6 15 L 34 15" />
      <path d="M 6 27 L 34 27" />
      <path d="M 27 4 L 13 36" />
    </g>
  </svg>
);

const Tag: React.FC<{
  children: React.ReactNode;
  bg?: string;
  fg?: string;
  border?: string;
}> = ({ children, bg = colors.panel, fg = colors.text, border = colors.text }) => (
  <div
    style={{
      ...poppins(32),
      lineHeight: 1,
      color: fg,
      background: bg,
      border: `3px solid ${border}`,
      borderRadius: 999,
      padding: "9px 22px",
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    {children}
  </div>
);

const Cursor: React.FC = () => (
  // Hotspot is the top-left tip (0, 0).
  <svg width={46} height={66} viewBox="0 0 46 66" style={{ overflow: "visible" }}>
    <path
      d="M 2 2 L 2 54 L 15 42 L 24 62 L 33 58 L 24 39 L 42 39 Z"
      fill="#FFFFFF"
      stroke={colors.panel}
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
  </svg>
);

// ---------- Monitor + screens ----------

const LoginScreen: React.FC<{ dots: number; buttonFlash: boolean; loggedIn: boolean }> = ({
  dots,
  buttonFlash,
  loggedIn,
}) => (
  <svg width={SCREEN_W} height={SCREEN_H} viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`}>
    <rect x={40} y={34} width={246} height={36} rx={9} fill="#25304D" />
    <rect x={56} y={47} width={92} height={10} rx={5} fill={colors.text} opacity={0.7} />
    <rect x={40} y={84} width={246} height={36} rx={9} fill="#25304D" />
    {Array.from({ length: dots }, (_, i) => (
      <circle key={i} cx={62 + i * 22} cy={102} r={6} fill={colors.text} />
    ))}
    <rect
      x={40}
      y={138}
      width={246}
      height={40}
      rx={10}
      fill={buttonFlash ? "#FFFFFF" : loggedIn ? colors.cyan : colors.panel}
      stroke={colors.cyan}
      strokeWidth={3}
    />
  </svg>
);

const DashboardScreen: React.FC<{ titleBar: number }> = ({ titleBar }) => (
  <svg width={SCREEN_W} height={SCREEN_H} viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`}>
    <rect x={0} y={0} width={64} height={SCREEN_H} fill="#1B2440" />
    {[60, 92, 124].map((y) => (
      <rect key={y} x={16} y={y} width={32} height={10} rx={5} fill={BAR_GREY} />
    ))}
    {[
      [56, 210],
      [88, 160],
      [120, 190],
      [152, 130],
      [176, 170],
    ].map(([y, w]) => (
      <rect key={y} x={84} y={y} width={w} height={16} rx={8} fill={BAR_GREY} />
    ))}
    {/* Window title bar with close button */}
    <g transform={`translate(0 ${(titleBar - 1) * TITLE_H})`}>
      <rect x={0} y={0} width={SCREEN_W} height={TITLE_H} fill="#26304A" />
      <rect x={14} y={13} width={70} height={10} rx={5} fill={BAR_GREY} />
      <rect
        x={CLOSE_BTN.x - 16}
        y={CLOSE_BTN.y - 14}
        width={32}
        height={28}
        rx={6}
        fill={colors.panel}
        stroke={colors.text}
        strokeWidth={2}
      />
      <g stroke={colors.text} strokeWidth={4} strokeLinecap="round">
        <path d={`M ${CLOSE_BTN.x - 7} ${CLOSE_BTN.y - 7} L ${CLOSE_BTN.x + 7} ${CLOSE_BTN.y + 7}`} />
        <path d={`M ${CLOSE_BTN.x + 7} ${CLOSE_BTN.y - 7} L ${CLOSE_BTN.x - 7} ${CLOSE_BTN.y + 7}`} />
      </g>
    </g>
  </svg>
);

const MonitorFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", width: MON_W, height: MON_H + 60 }}>
    <svg
      width={MON_W}
      height={MON_H + 60}
      viewBox={`0 0 ${MON_W} ${MON_H + 60}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <rect x={MON_W / 2 - 22} y={MON_H} width={44} height={42} fill={colors.panel} stroke={colors.text} strokeWidth={6} />
      <rect x={MON_W / 2 - 85} y={MON_H + 38} width={170} height={16} rx={8} fill={colors.panel} stroke={colors.text} strokeWidth={6} />
      <rect x={3.5} y={3.5} width={MON_W - 7} height={MON_H - 7} rx={18} fill={colors.panel} stroke={colors.text} strokeWidth={7} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: BEZEL,
        top: BEZEL,
        width: SCREEN_W,
        height: SCREEN_H,
        borderRadius: 8,
        overflow: "hidden",
        background: SCREEN_BG,
      }}
    >
      {children}
    </div>
  </div>
);

// ---------- Cookie ----------

const CRACKS = [
  "M 112 118 L 92 84 L 98 52 L 80 22",
  "M 112 118 L 146 132 L 168 166 L 196 178",
  "M 112 118 L 98 150 L 70 170 L 52 200",
];

const Cookie: React.FC<{ crack: number }> = ({ crack }) => (
  <svg width={224} height={224} viewBox="0 0 224 224" style={{ overflow: "visible" }}>
    <defs>
      <mask id="bite" maskUnits="userSpaceOnUse">
        <rect x={0} y={0} width={224} height={224} fill="#fff" />
        <circle cx={196} cy={34} r={40} fill="#000" />
        <circle cx={168} cy={14} r={22} fill="#000" />
      </mask>
    </defs>
    <g mask="url(#bite)">
      <circle cx={112} cy={112} r={108} fill={COOKIE} stroke={COOKIE_EDGE} strokeWidth={5} />
      {[
        [62, 58, 13],
        [120, 40, 10],
        [48, 120, 11],
        [160, 96, 12],
        [86, 176, 12],
        [150, 168, 10],
        [182, 136, 8],
        [34, 84, 7],
      ].map(([cx, cy, r]) => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={r} ry={r * 0.8} fill={CHIP} />
      ))}
      {crack > 0
        ? CRACKS.map((d) => {
            const c = evolvePath(crack, d);
            return (
              <path
                key={d}
                d={d}
                fill="none"
                stroke="#2A1608"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={c.strokeDasharray}
                strokeDashoffset={c.strokeDashoffset}
              />
            );
          })
        : null}
    </g>
  </svg>
);

// ---------- Scene ----------

export type Tip2LogoutProps = {
  /** Show public/tip2.mp4 in the footage band to line up beats. Off for export. */
  showReference?: boolean;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => t * t * (3 - 2 * t);

export const Tip2Logout: React.FC<Tip2LogoutProps> = ({ showReference = false }) => {
  const frame = useCurrentFrame();
  const pop = usePop();

  // ---- Monitor position (slides left for the drawer) ----
  const monSlide = pop(BEATS.cookies, 12);
  const monX = MON_X + MON_SHIFT * monSlide;
  const screenLeft = monX - SCREEN_W / 2;
  const toGlobal = (p: { x: number; y: number }) => ({
    x: screenLeft + p.x,
    y: SCREEN_TOP + p.y,
  });

  // ---- Beat 2: devices ----
  const monIn = pop(BEATS.devices, 12);
  const phoneIn = pop(BEATS.devices + 3, 12);
  const typeFrom = BEATS.devices + 16;
  const dots = Math.max(0, Math.min(8, Math.floor((frame - typeFrom) / 2) + 1));
  const submitAt = typeFrom + 8 * 2 + 4;
  const buttonFlash = frame >= submitAt && frame < submitAt + 3;
  const loggedIn = frame >= submitAt + 3;
  const loggedInTag = Math.max(0, pop(submitAt + 4, 8) * (1 - pop(BEATS.done, 6)));

  // ---- Beat 3: done ----
  const phoneOpacity =
    interpolate(frame, [BEATS.done, BEATS.done + 6], [1, 0.3], clamp) *
    interpolate(frame, [BEATS.cookies, BEATS.cookies + 6], [1, 0], clamp);
  const doneTag = Math.max(0, pop(BEATS.done + 6, 8) * (1 - pop(BEATS.close, 6)));

  // ---- Cursor path ----
  const cursorIn = pop(BEATS.done + 8, 14);
  const rest = { x: 590, y: 500 };
  const enterFrom = { x: 1120, y: 720 };
  const closeBtn = toGlobal(CLOSE_BTN);
  const near = { x: closeBtn.x + 26, y: closeBtn.y + 24 }; // stops just short
  const glide = easeInOut(interpolate(frame, [BEATS.close, BEATS.close + 18], [0, 1], clamp));
  const bounce = pop(BEATS.close + 18, 12);
  const bounced = { x: near.x + 46, y: near.y + 36 };
  const logoutBtn = toGlobal(LOGOUT_BTN);
  const clickPoint = { x: logoutBtn.x + 70, y: logoutBtn.y + 16 }; // keep the label readable
  const toLogout = easeInOut(interpolate(frame, [BEATS.logout + 2, BEATS.logout + 12], [0, 1], clamp));

  let cursor = {
    x: lerp(enterFrom.x, rest.x, cursorIn),
    y: lerp(enterFrom.y, rest.y, cursorIn),
  };
  if (frame >= BEATS.close) {
    cursor = { x: lerp(rest.x, near.x, glide), y: lerp(rest.y, near.y, glide) };
  }
  if (frame >= BEATS.close + 18) {
    cursor = { x: lerp(near.x, bounced.x, bounce), y: lerp(near.y, bounced.y, bounce) };
  }
  if (frame >= BEATS.logout + 2) {
    cursor = {
      x: lerp(bounced.x, clickPoint.x, toLogout),
      y: lerp(bounced.y, clickPoint.y, toLogout),
    };
  }
  const cursorScale = Math.max(0, 1 - pop(BEATS.cookies, 8));

  // ---- Beat 4: close ----
  const titleBar = Math.min(1, pop(BEATS.close, 8));
  const slamAt = BEATS.close + 18;
  const slam = pop(slamAt, 8);
  const slamOut = Math.max(0, 1 - pop(BEATS.logout, 6));
  const shakeIdx = frame - slamAt - 3;
  const slamShake = shakeIdx >= 0 && shakeIdx < 3 ? jitter(shakeIdx) * 0.8 : 0;

  // ---- Beat 5: logout ----
  const logoutIn = pop(BEATS.logout, 8);
  const clickAt = BEATS.logout + 12;
  const press = interpolate(frame, [clickAt, clickAt + 2, clickAt + 8], [1, 0.92, 1], clamp);
  const ripple = interpolate(frame, [clickAt, clickAt + 14], [0, 1], clamp);

  // ---- Beat 6: cookies ----
  const drawerIn = pop(BEATS.cookies + 4, 14);
  const tagIn = pop(BEATS.cookies + 14, 8);
  const cookieIn = pop(BEATS.cookies + 10, 10);
  const crackFrom = BEATS.tick - 20;
  const crumbleAt = crackFrom + 6;
  const crack = interpolate(frame, [crackFrom, crackFrom + 5], [0, 1], clamp);
  const crumbled = frame >= crumbleAt;
  const bob = Math.sin(((frame - BEATS.cookies) / 30) * Math.PI * 2 * 0.8) * 6;
  const glowPulse = (Math.sin(((frame - BEATS.cookies) / 30) * Math.PI * 2 * 1.2) + 1) / 2;

  // ---- Tick ----
  const dim = interpolate(frame, [BEATS.tick, BEATS.tick + 6], [1, 0.4], clamp);
  const ticked = frame >= BEATS.tick;

  // Drawer geometry (global)
  const drawerLeft = MON_X + MON_SHIFT + MON_W / 2 + 40; // final gap right of the monitor
  const DRAWER_W = 1080 - 40 - drawerLeft;
  const DRAWER_TOP = 110;
  const DRAWER_H = 500;
  const COOKIE_C = { x: DRAWER_W / 2, y: 320 };

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
          opacity: dim,
        }}
      >
        {/* Storage drawer – emerges from behind the monitor's right edge */}
        {frame >= BEATS.cookies + 4 ? (
          <div
            style={{
              position: "absolute",
              left: monX + MON_W / 2,
              top: DRAWER_TOP,
              width: 1080,
              height: DRAWER_H,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: drawerLeft - (monX + MON_W / 2),
                top: 0,
                width: DRAWER_W,
                height: DRAWER_H,
                boxSizing: "border-box",
                background: colors.panel,
                border: `4px solid ${colors.cyan}`,
                borderRadius: 28,
                overflow: "hidden",
                transform: `translateX(${(1 - drawerIn) * -(DRAWER_W + 60)}px)`,
              }}
            >
              <At
                x={DRAWER_W / 2}
                y={46}
                style={{
                  fontFamily: fonts.mono,
                  fontWeight: fontWeights.mono,
                  fontSize: 32,
                  color: colors.cyan,
                  whiteSpace: "nowrap",
                }}
              >
                BROWSER STORAGE
              </At>
              <At x={DRAWER_W / 2} y={124} transform={`scale(${tagIn})`}>
                <Tag bg={colors.danger} border={colors.danger}>
                  STORED HERE
                </Tag>
              </At>

              {!crumbled ? (
                <At
                  x={COOKIE_C.x}
                  y={COOKIE_C.y + bob}
                  transform={`scale(${1.15 * cookieIn})`}
                  style={{
                    filter: `drop-shadow(0 0 ${16 + 22 * glowPulse}px rgba(255, 59, 92, ${0.55 + 0.35 * glowPulse}))`,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Cookie crack={crack} />
                    <At
                      x={112}
                      y={120}
                      style={{
                        fontFamily: fonts.mono,
                        fontWeight: fontWeights.mono,
                        fontSize: 32,
                        color: colors.text,
                        background: colors.panel,
                        borderRadius: 12,
                        padding: "4px 12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      SESSION_ID
                    </At>
                  </div>
                </At>
              ) : (
                // Crumble: ~30 cyan particles fall and fade
                <svg
                  width={DRAWER_W}
                  height={DRAWER_H}
                  style={{ position: "absolute", inset: 0, overflow: "visible" }}
                >
                  {Array.from({ length: 30 }, (_, i) => {
                    const t = frame - crumbleAt;
                    const ang = random(`a${i}`) * Math.PI * 2;
                    const rad = Math.sqrt(random(`r${i}`)) * 100;
                    const vx = (random(`vx${i}`) - 0.5) * 7;
                    const vy = -2 - random(`vy${i}`) * 5;
                    const size = 7 + random(`s${i}`) * 9;
                    const x = COOKIE_C.x + Math.cos(ang) * rad + vx * t;
                    const y = COOKIE_C.y + bob + Math.sin(ang) * rad + vy * t + 0.9 * t * t;
                    const opacity = interpolate(t, [0, 4, 18], [1, 1, 0], clamp);
                    return (
                      <rect
                        key={i}
                        x={x - size / 2}
                        y={y - size / 2}
                        width={size}
                        height={size}
                        rx={2}
                        fill={colors.cyan}
                        opacity={opacity}
                        transform={`rotate(${random(`rot${i}`) * 90 + t * 12} ${x} ${y})`}
                      />
                    );
                  })}
                </svg>
              )}
            </div>
          </div>
        ) : null}

        {/* Phone (right) */}
        {frame >= BEATS.devices + 3 && phoneOpacity > 0 ? (
          <div style={{ opacity: phoneOpacity }}>
            <At x={PHONE_X} y={PHONE_Y} transform={`translateX(${(1 - phoneIn) * 460}px)`}>
              <PhoneIcon />
            </At>
            <At
              x={PHONE_X}
              y={205}
              transform={`translateX(${(1 - phoneIn) * 460}px) scale(${pop(BEATS.devices + 10, 8)})`}
            >
              <Tag>FRIEND'S PHONE</Tag>
            </At>
          </div>
        ) : null}

        {/* Monitor (left) */}
        {frame >= BEATS.devices ? (
          <>
            <div
              style={{
                position: "absolute",
                left: monX - MON_W / 2,
                top: MON_TOP,
                transform: `translateX(${(1 - monIn) * -520}px)`,
              }}
            >
              <MonitorFrame>
                {frame < BEATS.done ? (
                  <LoginScreen
                    dots={frame >= typeFrom ? dots : 0}
                    buttonFlash={buttonFlash}
                    loggedIn={loggedIn}
                  />
                ) : (
                  <DashboardScreen titleBar={frame >= BEATS.close ? titleBar : 0} />
                )}

                {/* Log out button on the dashboard */}
                {frame >= BEATS.logout ? (
                  <At
                    x={LOGOUT_BTN.x}
                    y={LOGOUT_BTN.y}
                    transform={`scale(${logoutIn * press})`}
                    style={{
                      ...poppins(32),
                      lineHeight: 1,
                      background: frame >= clickAt ? colors.cyan : colors.panel,
                      color: frame >= clickAt ? colors.panel : colors.text,
                      border: `3px solid ${colors.cyan}`,
                      borderRadius: 12,
                      padding: "10px 20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Log out
                  </At>
                ) : null}
              </MonitorFrame>
            </div>

            <At
              x={monX}
              y={MON_TOP - 40}
              transform={`translateX(${(1 - monIn) * -520}px) scale(${pop(BEATS.devices + 8, 8)})`}
            >
              <Tag>PUBLIC PC</Tag>
            </At>
          </>
        ) : null}

        {/* Logged in ✓ */}
        {loggedInTag > 0 ? (
          <At x={monX + 90} y={MON_TOP + MON_H - 10} transform={`scale(${loggedInTag})`}>
            <Tag bg={colors.cyan} fg={colors.panel} border={colors.cyan}>
              Logged in <Check size={30} color={colors.panel} />
            </Tag>
          </At>
        ) : null}

        {/* DONE ✓ */}
        {doneTag > 0 ? (
          <At x={monX + 120} y={MON_TOP + 6} transform={`scale(${doneTag})`}>
            <Tag bg={colors.cyan} fg={colors.panel} border={colors.cyan}>
              DONE <Check size={30} color={colors.panel} />
            </Tag>
          </At>
        ) : null}

        {/* CLOSE ≠ LOGOUT bar slams over the close button */}
        {frame >= slamAt && slamOut > 0 ? (
          <At
            x={closeBtn.x - 40 + slamShake}
            y={closeBtn.y}
            transform={`rotate(-4deg) scale(${(1.6 - 0.6 * slam) * slamOut})`}
            style={{
              background: colors.danger,
              borderRadius: 12,
              padding: "10px 26px 6px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              ...anton(46),
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
            }}
          >
            CLOSE <NotEqual /> LOGOUT
          </At>
        ) : null}

        {/* Click ripple */}
        {frame >= clickAt && ripple < 1 ? (
          <svg
            width={1080}
            height={BAND_H}
            style={{ position: "absolute", inset: 0 }}
          >
            <circle
              cx={clickPoint.x}
              cy={clickPoint.y}
              r={10 + 80 * ripple}
              fill="none"
              stroke={colors.cyan}
              strokeWidth={6 * (1 - ripple) + 1}
              opacity={1 - ripple}
            />
          </svg>
        ) : null}

        {/* Cursor */}
        {frame >= BEATS.done + 8 && cursorScale > 0 ? (
          <div
            style={{
              position: "absolute",
              left: cursor.x,
              top: cursor.y,
              transformOrigin: "0 0",
              transform: `scale(${cursorScale * (frame >= clickAt ? press : 1)})`,
            }}
          >
            <Cursor />
          </div>
        ) : null}
      </div>

      {/* ================= BOTTOM BAND ================= */}
      <Headline from={BEATS.second} to={BEATS.devices} enter="pop">
        <TipBadge n={2} />
      </Headline>

      <Headline from={BEATS.devices} to={BEATS.done}>
        <div style={poppins(64)}>
          <span style={{ color: colors.cyan }}>SOMEONE ELSE'S</span>
          <br />
          DEVICE
        </div>
      </Headline>

      <Headline from={BEATS.done} to={BEATS.close}>
        <div style={anton(110)}>WORK DONE?</div>
      </Headline>

      <Headline from={BEATS.close} to={BEATS.logout}>
        <div style={anton(110)}>
          DON'T JUST <span style={{ color: colors.danger }}>CLOSE</span>
        </div>
      </Headline>

      <Headline from={BEATS.logout} to={BEATS.cookies} enter="pop">
        <div style={{ ...anton(110), color: colors.cyan }}>LOG OUT</div>
      </Headline>

      <Headline from={BEATS.cookies} to={DURATION}>
        <div style={poppins(60)}>
          <span style={{ color: colors.cyan }}>COOKIES</span> STAY
          <br />
          ON THE DEVICE
        </div>
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
          checked={ticked ? 2 : 1}
          animateNewest={ticked}
          checkFrom={BEATS.tick}
          tickPop
          highlight={ticked ? undefined : 2}
        />
      </div>
    </AbsoluteFill>
  );
};
