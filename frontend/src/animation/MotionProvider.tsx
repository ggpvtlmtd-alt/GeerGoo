import React, { createContext, useContext, useState } from "react";
import { LayoutGroup } from "framer-motion";

export type AnimationPhase = "loading" | "camera-push" | "revealing" | "complete";

interface MotionContextType {
  phase: AnimationPhase;
  setPhase: (phase: AnimationPhase) => void;
  isComplete: boolean;
}

const MotionContext = createContext<MotionContextType>({
  phase: "loading",
  setPhase: () => {},
  isComplete: false,
});

export const useMotion = () => useContext(MotionContext);

interface MotionProviderProps {
  children: React.ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
  const [phase, setPhase] = useState<AnimationPhase>("loading");

  return (
    <MotionContext.Provider
      value={{
        phase,
        setPhase,
        isComplete: phase === "complete",
      }}
    >
      <LayoutGroup>{children}</LayoutGroup>
    </MotionContext.Provider>
  );
};

export default MotionProvider;
