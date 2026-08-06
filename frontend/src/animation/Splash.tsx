import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import "./Splash.css";

const LOADING_STEPS = [
  "Initializing AI Engine...",
  "Loading Security Models...",
  "Connecting Telemetry...",
  "Preparing Diagnostics...",
  "Launching GeerGoo...",
];

export type SplashPhase = "loading" | "camera-push" | "revealing" | "complete";

interface SplashProps {
  children: React.ReactNode;
}

export default function Splash({ children }: SplashProps) {
  const [phase, setPhase] = useState<SplashPhase>("loading");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // 1. Text cycle across 1.9s loading phase (~380ms per step)
    const textInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        clearInterval(textInterval);
        return prev;
      });
    }, 380);

    // 2. Camera Push Transition begins at 1.9s
    const cameraPushTimer = setTimeout(() => {
      setPhase("camera-push");
    }, 1900);

    // 3. Overlapping Reveal starts at ~2.1s (~70% of total intro, page rendering underneath)
    const revealTimer = setTimeout(() => {
      setPhase("revealing");
    }, 2100);

    // 4. Complete transition at 3.4s
    const completeTimer = setTimeout(() => {
      setPhase("complete");
    }, 3400);

    return () => {
      clearInterval(textInterval);
      clearTimeout(cameraPushTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const isBackdropVisible = phase === "loading" || phase === "camera-push";
  const isContentVisible = phase === "revealing" || phase === "complete";

  return (
    <LayoutGroup>
      <div
        className={`gg-page-reveal-wrapper phase-${phase} ${
          isContentVisible ? "gg-splash-revealing" : ""
        } ${phase === "complete" ? "gg-splash-complete" : ""}`}
      >
        {/* Main Page Content (Renders underneath overlay starting at ~70%) */}
        {isContentVisible && (
          <motion.div
            className="gg-main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        )}

        {/* Camera Push Backdrop Canvas */}
        <AnimatePresence>
          {isBackdropVisible && (
            <motion.div
              className="gg-splash-backdrop"
              initial={{ scale: 1.0, filter: "blur(0px)", opacity: 1 }}
              animate={
                phase === "camera-push"
                  ? {
                      scale: 1.05,
                      filter: "blur(11px)",
                      opacity: 0,
                    }
                  : {
                      scale: 1.0,
                      filter: "blur(0px)",
                      opacity: 1,
                    }
              }
              exit={{ opacity: 0 }}
              transition={
                phase === "camera-push"
                  ? {
                      duration: 0.9,
                      ease: [0.25, 0.1, 0.25, 1],
                    }
                  : { duration: 0.4 }
              }
            >
              {/* Restrained Ambient Blue Halo */}
              <motion.div
                className="gg-splash-halo"
                animate={{
                  scale: [0.96, 1.04, 0.96],
                  opacity: [0.35, 0.55, 0.35],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Centered Content Stack: Logo stacked ABOVE GeerGoo title with 28px vertical spacing */}
              <div className="gg-splash-content-stack">
                {/* 1. Logo Container (Top Element) */}
                <div className="gg-splash-logo-container">
                  <motion.div
                    layoutId="appLogoIcon"
                    className="gg-splash-logo-wrapper"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{
                      opacity: 1,
                      scale: [1.0, 1.03, 1.0],
                      rotate: [0, 1, 0, -1, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.45, ease: "easeOut" },
                      scale: {
                        duration: 1.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      rotate: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      layout: {
                        type: "spring",
                        stiffness: 80,
                        damping: 17,
                        mass: 0.8,
                      },
                    }}
                  >
                    <img
                      src="/logo-icon.png"
                      className="gg-splash-logo-img"
                      alt="GeerGoo Icon"
                    />
                  </motion.div>
                </div>

                {/* 2. Text, Subtitle, Progress Bar, and Cycler Stack (Positioned directly below logo) */}
                <motion.div
                  className="gg-splash-info-group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: phase === "camera-push" ? 0 : 1,
                    y: phase === "camera-push" ? -10 : 0,
                  }}
                  transition={{
                    opacity: { duration: phase === "camera-push" ? 0.3 : 0.45 },
                    y: { duration: 0.45 },
                  }}
                >
                  <h2 className="gg-splash-title">GeerGoo</h2>
                  <p className="gg-splash-subtitle">
                    Autonomous AI Diagnostics for Cloud Infrastructure
                  </p>

                  {/* Eased Progress Bar */}
                  <div className="gg-splash-loader-container">
                    <motion.div
                      className="gg-splash-loader-bar"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 1.9,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>

                  {/* Cross-Fading Text Messages */}
                  <div className="gg-splash-text-cycler">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={stepIndex}
                        className="gg-splash-status-text"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        {LOADING_STEPS[stepIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
