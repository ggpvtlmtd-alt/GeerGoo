import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import "./SplashScreen.css";

type Status = "loading" | "text-fade" | "traveling" | "complete";

interface Props {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: Props) {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    // 1. Loading phase (0s - 2.0s)
    const textFadeTimeout = setTimeout(() => {
      setStatus("text-fade");
    }, 2000);

    // 2. Text fade-away phase (2.0s - 2.4s)
    const travelTimeout = setTimeout(() => {
      setStatus("traveling");
    }, 2400);

    // 3. Icon travel phase (2.4s - 3.6s)
    const completeTimeout = setTimeout(() => {
      setStatus("complete");
    }, 3600);

    return () => {
      clearTimeout(textFadeTimeout);
      clearTimeout(travelTimeout);
      clearTimeout(completeTimeout);
    };
  }, []);

  return (
    <LayoutGroup>
      <div
        className={`app-reveal-wrapper status-${status} ${
          status === "complete" ? "splash-complete" : "splash-active"
        }`}
      >
        {/* Main Page Content (Mounts and fades in during traveling state) */}
        <AnimatePresence>
          {(status === "traveling" || status === "complete") && (
            <motion.div
              className="main-content-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Splash Screen Overlay */}
        <AnimatePresence>
          {(status === "loading" || status === "text-fade") && (
            <motion.div
              className="splash-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Soft Blue Halo Glow */}
              <motion.div
                className="splash-halo"
                animate={{
                  scale: [0.92, 1.08, 0.92],
                  opacity: [0.45, 0.75, 0.45],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="splash-center-content">
                {/* 1. ONLY the Icon Animates with layoutId */}
                <motion.div
                  layoutId="appLogoIcon"
                  className="splash-icon-wrapper"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1.0,
                    opacity: 1,
                    filter: [
                      "drop-shadow(0 0 8px rgba(59, 130, 246, 0.15))",
                      "drop-shadow(0 0 24px rgba(59, 130, 246, 0.35))",
                      "drop-shadow(0 0 8px rgba(59, 130, 246, 0.15))",
                    ],
                  }}
                  transition={{
                    opacity: { duration: 0.7, ease: "easeOut" },
                    scale: { duration: 0.7, ease: "easeOut" },
                    filter: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                    layout: { type: "spring", stiffness: 75, damping: 15, mass: 0.8 },
                  }}
                >
                  <img
                    src="/logo-icon.png"
                    className="splash-icon-img"
                    alt="GeerGoo Icon"
                  />
                </motion.div>

                {/* 2. Text & Loading Details (Fades out BEFORE icon travels) */}
                <AnimatePresence>
                  {status === "loading" && (
                    <motion.div
                      className="splash-text-group"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Title */}
                      <motion.h2
                        className="splash-title"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                      >
                        GeerGoo
                      </motion.h2>

                      {/* Tagline */}
                      <motion.p
                        className="splash-subtitle"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
                      >
                        AI Powered Root Cause Analysis for Developers
                      </motion.p>

                      {/* Loading Progress Bar */}
                      <motion.div
                        className="splash-loader-container"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                      >
                        <motion.div
                          className="splash-loader-bar"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 1.8,
                            ease: [0.1, 0.8, 0.2, 1],
                          }}
                        />
                      </motion.div>

                      {/* Initializing AI Engine text */}
                      <motion.p
                        className="splash-loading-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.55 }}
                      >
                        Initializing AI Engine...
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
