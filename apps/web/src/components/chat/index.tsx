"use client";

/**
 * Shared motion primitives for EnJoy chat surfaces.
 * Used by JoyaChatWidget (Joya) and SupportClient (EnJoy Support).
 * No new dependencies — Framer Motion only.
 */

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import React from "react";

/* ─── Brand tokens ─────────────────────────────────────────────── */
export const PURPLE = "#5A31F4";
export const PINK   = "#FF0080";
export const ORANGE = "#FF6B00";
export const AMBER  = "#F59E0B";

/* ─── Motion config ────────────────────────────────────────────── */
const SPRING_PANEL = { type: "spring" as const, stiffness: 280, damping: 24 };
const SPRING_BUBBLE = { type: "spring" as const, stiffness: 340, damping: 28 };

/* ══════════════════════════════════════════════════════════════════
   JoyaAvatar
   Living launcher avatar with bob, blink, layout-shared morph.
   layoutId="joya-avatar" makes it FLIP between FAB ↔ panel header.
══════════════════════════════════════════════════════════════════ */
export interface JoyaAvatarProps {
  size?: number;
  /** If true renders the full launcher button (bob + hover + tap). */
  asLauncher?: boolean;
  onClick?: () => void;
  hasUnread?: boolean;
  accent?: string;
}

export function JoyaAvatar({
  size = 40,
  asLauncher = false,
  onClick,
  hasUnread = false,
  accent = PURPLE,
}: JoyaAvatarProps) {
  const reduced = useReducedMotion();
  const [blink, setBlink] = useState(false);

  /* Pseudo-random blink every ~5s */
  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 4000 + Math.random() * 3000;
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); schedule(); }, 180);
      }, delay);
    };
    schedule();
    return () => clearTimeout(t);
  }, [reduced]);

  const face = (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      layoutId="joya-avatar"
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill={`url(#joya-grad-${size})`} />
      <defs>
        <radialGradient id={`joya-grad-${size}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7B52FF" />
          <stop offset="100%" stopColor={accent} />
        </radialGradient>
      </defs>

      {/* Left eye */}
      <motion.ellipse
        cx="14" cy="17"
        rx="2.8"
        ry={blink ? 0.25 : 2.8}
        fill="white"
        style={{ originX: "14px", originY: "17px" }}
        transition={{ duration: 0.08 }}
      />
      {/* Right eye */}
      <motion.ellipse
        cx="26" cy="17"
        rx="2.8"
        ry={blink ? 0.25 : 2.8}
        fill="white"
        style={{ originX: "26px", originY: "17px" }}
        transition={{ duration: 0.08 }}
      />

      {/* Smile */}
      <path
        d="M13.5 25 Q20 30.5 26.5 25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Cheek blush left */}
      <ellipse cx="11" cy="23" rx="2.5" ry="1.4" fill={PINK} opacity="0.3" />
      {/* Cheek blush right */}
      <ellipse cx="29" cy="23" rx="2.5" ry="1.4" fill={PINK} opacity="0.3" />
    </motion.svg>
  );

  if (!asLauncher) return face;

  /* Full launcher button */
  return (
    <motion.button
      onClick={onClick}
      aria-label="Open Joya AI chat"
      role="button"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        width: 62,
        height: 62,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: "transparent",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 6px 16px rgba(90,49,244,0.35))",
      }}
      animate={reduced ? {} : { y: [0, -4, 0] }}
      transition={reduced ? {} : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
      whileHover={
        reduced
          ? {}
          : {
              scale: 1.05,
              rotate: [-1, 1, 0],
              filter: "drop-shadow(0 8px 20px rgba(90,49,244,0.55))",
            }
      }
      whileTap={reduced ? {} : { scale: 0.92 }}
    >
      {/* Face */}
      <motion.svg
        width={42}
        height={42}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        layoutId="joya-avatar"
      >
        <circle cx="20" cy="20" r="20" fill={`url(#joya-fab-grad)`} />
        <defs>
          <radialGradient id="joya-fab-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7B52FF" />
            <stop offset="100%" stopColor={accent} />
          </radialGradient>
        </defs>
        <motion.ellipse
          cx="14" cy="17" rx="2.8"
          ry={blink ? 0.25 : 2.8}
          fill="white"
          transition={{ duration: 0.08 }}
        />
        <motion.ellipse
          cx="26" cy="17" rx="2.8"
          ry={blink ? 0.25 : 2.8}
          fill="white"
          transition={{ duration: 0.08 }}
        />
        <path d="M13.5 25 Q20 30.5 26.5 25" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
        <ellipse cx="11" cy="23" rx="2.5" ry="1.4" fill={PINK} opacity="0.3" />
        <ellipse cx="29" cy="23" rx="2.5" ry="1.4" fill={PINK} opacity="0.3" />
      </motion.svg>

      {/* Unread dot */}
      <AnimatePresence>
        {hasUnread && (
          <motion.span
            key="dot"
            aria-label="Nieuw bericht"
            role="status"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: PINK,
              border: "2px solid #0A0A12",
              boxShadow: `0 0 8px ${PINK}`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SupportAvatar
   Headset-icon avatar, amber accent, no blink, slower bob.
══════════════════════════════════════════════════════════════════ */
export interface SupportAvatarProps {
  size?: number;
}

export function SupportAvatar({ size = 32 }: SupportAvatarProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      animate={reduced ? {} : { y: [0, -3, 0] }}
      transition={reduced ? {} : { repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${AMBER}, #d97706)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 2px 10px rgba(245,158,11,0.4)`,
      }}
    >
      {/* Headset SVG */}
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11a9 9 0 0 1 18 0" />
        <rect x="2" y="11" width="4" height="8" rx="2" />
        <rect x="18" y="11" width="4" height="8" rx="2" />
        <path d="M22 17a6 6 0 0 1-6 4h-2" />
      </svg>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MessageBubble
   Animated entrance + long-press action row.
══════════════════════════════════════════════════════════════════ */
export interface MessageBubbleProps {
  role: "user" | "assistant";
  children: React.ReactNode;
  isLast?: boolean;
  accentGradient?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit:   { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export function MessageBubble({
  role,
  children,
  isLast = false,
  accentGradient = `linear-gradient(135deg,${PURPLE},${PINK})`,
  onCopy,
  onRegenerate,
}: MessageBubbleProps) {
  const reduced = useReducedMotion();
  const [showActions, setShowActions] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUser = role === "user";

  const startLongPress = useCallback(() => {
    longPressTimer.current = setTimeout(() => setShowActions(true), 500);
  }, []);
  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  return (
    <motion.div
      variants={bubbleVariants}
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      transition={SPRING_BUBBLE}
      style={{ position: "relative", display: "inline-block", maxWidth: "76%" }}
      onPointerDown={startLongPress}
      onPointerUp={cancelLongPress}
      onPointerLeave={cancelLongPress}
    >
      <motion.div
        animate={
          isLast && !reduced
            ? { boxShadow: [`0 0 0px rgba(90,49,244,0)`, `0 0 12px rgba(90,49,244,0.35)`, `0 0 0px rgba(90,49,244,0)`] }
            : {}
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          padding: "11px 15px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? accentGradient : "#141428",
          color: isUser ? "#fff" : "rgba(255,255,255,.88)",
          fontSize: 13,
          lineHeight: "1.55",
          fontWeight: isUser ? 500 : 400,
          border: isUser ? "none" : "1px solid rgba(90,49,244,.18)",
          cursor: "default",
        }}
      >
        {children}
      </motion.div>

      {/* Long-press action row */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
            style={{
              position: "absolute",
              [isUser ? "right" : "left"]: 0,
              bottom: "calc(100% + 6px)",
              display: "flex",
              gap: 6,
              background: "#1e1e36",
              border: "1px solid rgba(90,49,244,0.35)",
              borderRadius: 10,
              padding: "5px 8px",
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            {onCopy && (
              <ActionBtn
                onClick={() => { onCopy(); setShowActions(false); }}
                label="Kopieer"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                }
              />
            )}
            {onRegenerate && (
              <ActionBtn
                onClick={() => { onRegenerate(); setShowActions(false); }}
                label="Opnieuw"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                }
              />
            )}
            <ActionBtn
              onClick={() => setShowActions(false)}
              label="Sluiten"
              icon={<span style={{ fontSize: 12 }}>✕</span>}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionBtn({ onClick, label, icon }: { onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(255,255,255,0.07)",
        border: "none",
        borderRadius: 7,
        color: "rgba(255,255,255,0.75)",
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 8px",
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TypingDots
   Three bouncing dots with aria-live for screen readers.
   Collapses to final bubble via AnimatePresence mode="wait".
══════════════════════════════════════════════════════════════════ */
export interface TypingDotsProps {
  accent?: string;
  label?: string;
}

export function TypingDots({ accent = PURPLE, label = "Joya is aan het typen" }: TypingDotsProps) {
  const reduced = useReducedMotion();
  return (
    <div
      aria-live="polite"
      aria-label={label}
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "14px 18px",
        background: "#141428",
        borderRadius: "18px 18px 18px 4px",
        border: "1px solid rgba(90,49,244,.18)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          animate={
            reduced
              ? { opacity: [0.4, 1, 0.4] }
              : { y: [0, -6, 0], opacity: [0.5, 1, 0.5] }
          }
          transition={{
            repeat: Infinity,
            duration: 0.9,
            delay: i * 0.16,
            ease: "easeInOut",
          }}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: accent,
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SuggestionChip
   Quick-start prompt chips with stagger support.
══════════════════════════════════════════════════════════════════ */
export interface SuggestionChipProps {
  label: string;
  onClick: () => void;
  index?: number;
  accentColor?: string;
}

export function SuggestionChip({
  label,
  onClick,
  index = 0,
  accentColor = PURPLE,
}: SuggestionChipProps) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      aria-label={`Stel voor: ${label}`}
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{
        delay: reduced ? 0 : index * 0.03,
        type: "spring",
        stiffness: 320,
        damping: 22,
      }}
      whileHover={reduced ? {} : { y: -2 }}
      whileTap={reduced ? {} : { scale: 0.96 }}
      style={{
        padding: "6px 13px",
        borderRadius: 18,
        border: `1px solid ${accentColor}66`,
        background: `${accentColor}1a`,
        color: "rgba(255,255,255,0.88)",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
      }}
    >
      {label}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ChatInputBar
   Animated focus glow, animated send button, paper-plane icon.
══════════════════════════════════════════════════════════════════ */
export interface ChatInputBarProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  dir?: "ltr" | "rtl";
  accentColor?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  leadingSlot?: React.ReactNode;
  accentGradient?: string;
}

export function ChatInputBar({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder = "Typ een bericht…",
  disabled = false,
  isLoading = false,
  dir = "ltr",
  accentColor = PURPLE,
  inputRef,
  leadingSlot,
  accentGradient,
}: ChatInputBarProps) {
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const [flash, setFlash] = useState(false);
  const canSend = value.trim().length > 0 && !disabled && !isLoading;
  const gradient = accentGradient ?? `linear-gradient(135deg,${accentColor},${PINK})`;

  const handleSend = () => {
    if (!canSend) return;
    onSend();
    if (!reduced) {
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
    }
  };

  const glowColor = `${accentColor}33`; // 20% alpha

  return (
    <div
      dir={dir}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderTop: "1px solid rgba(255,255,255,.07)",
        background: "#0e0e1e",
        flexShrink: 0,
      }}
    >
      {leadingSlot}

      <motion.div
        style={{ flex: 1, borderRadius: 12 }}
        animate={{
          boxShadow: focused
            ? `0 0 0 3px ${glowColor}`
            : "0 0 0 0px transparent",
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-label={placeholder}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 12,
            padding: "10px 14px",
            color: "#fff",
            fontSize: 13,
            outline: "none",
            fontFamily: "inherit",
            textAlign: dir === "rtl" ? "right" : "left",
          }}
        />
      </motion.div>

      {/* Send button */}
      <motion.button
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Verstuur bericht"
        whileHover={canSend && !reduced ? { scale: 1.04 } : {}}
        whileTap={canSend && !reduced ? { scale: 0.96 } : {}}
        animate={{
          background: flash
            ? "#22c55e"
            : canSend
            ? gradient
            : "rgba(255,255,255,0.06)",
          opacity: canSend ? 1 : 0.45,
        }}
        transition={{ duration: 0.18 }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          border: "none",
          cursor: canSend ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "white",
        }}
      >
        {/* Paper-plane icon */}
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          animate={
            flash && !reduced
              ? { x: [0, 6, 0], scale: [1, 1.15, 1] }
              : { x: 0, scale: 1 }
          }
          transition={{ duration: 0.35 }}
        >
          <path
            d="M22 2L11 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ThinkingBanner
   "Joya is thinking…" indicator between input and last message.
══════════════════════════════════════════════════════════════════ */
export function ThinkingBanner({ label = "Joya denkt na…", accent = PURPLE }: { label?: string; accent?: string }) {
  return (
    <motion.div
      key="thinking"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22 }}
      aria-live="polite"
      aria-label={label}
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        fontSize: 11,
        color: `${accent}cc`,
        fontWeight: 600,
        borderTop: `1px solid ${accent}22`,
        background: `${accent}0a`,
        flexShrink: 0,
      }}
    >
      <TypingDots accent={accent} label={label} />
      <span style={{ marginLeft: 2 }}>{label}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PanelShell
   Shared open/close AnimatePresence wrapper.
   origin-bottom-right spring: scale 0.6→1, y 20→0.
   On mobile: full bottom-sheet with drag-to-close.
══════════════════════════════════════════════════════════════════ */
export interface PanelShellProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  children: React.ReactNode;
  panelStyle?: React.CSSProperties;
  backdropStyle?: React.CSSProperties;
}

export function PanelShell({
  open,
  onClose,
  isMobile,
  children,
  panelStyle,
  backdropStyle,
}: PanelShellProps) {
  const reduced = useReducedMotion();
  const dragStartY = useRef(0);

  const desktopVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6, y: 20, originX: 1, originY: 1 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit:   { opacity: 0, scale: 0.7, y: 16 },
  };
  const mobileVariants: Variants = {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: 0 },
    exit:   { opacity: 0, y: "100%" },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile only) */}
          {isMobile && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onClose}
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9998,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                background: "rgba(0,0,0,0.4)",
                ...backdropStyle,
              }}
            />
          )}

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Chat venster"
            variants={isMobile ? mobileVariants : desktopVariants}
            initial={reduced ? "visible" : "hidden"}
            animate="visible"
            exit={reduced ? "visible" : "exit"}
            transition={SPRING_PANEL}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.0, bottom: 0.4 }}
            onDragStart={() => { dragStartY.current = 0; }}
            onDragEnd={(_e, info) => {
              if (info.velocity.y > 300 || info.offset.y > 120) onClose();
            }}
            style={{
              position: "fixed",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              ...(isMobile
                ? {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: "8%",
                    borderRadius: "24px 24px 0 0",
                    background: "rgba(8,8,20,0.92)",
                    backdropFilter: "blur(32px)",
                    WebkitBackdropFilter: "blur(32px)",
                    border: "1px solid rgba(90,49,244,0.35)",
                    boxShadow: "0 -16px 60px rgba(0,0,0,.6)",
                    paddingBottom: "env(safe-area-inset-bottom)",
                  }
                : {
                    bottom: 90,
                    right: 20,
                    width: 395,
                    maxHeight: 590,
                    borderRadius: 22,
                    background: "#0A0A12",
                    border: "1px solid rgba(90,49,244,0.35)",
                    boxShadow: "0 24px 70px rgba(0,0,0,.7), 0 0 60px rgba(90,49,244,.15)",
                  }),
              ...panelStyle,
            }}
          >
            {/* Mobile grab handle */}
            {isMobile && (
              <div
                aria-hidden="true"
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.2)",
                  alignSelf: "center",
                  marginTop: 10,
                  flexShrink: 0,
                }}
              />
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* Re-export Framer primitives used by consumers */
export { motion, AnimatePresence, useReducedMotion };
export type { Variants };
export { SPRING_PANEL, SPRING_BUBBLE };
