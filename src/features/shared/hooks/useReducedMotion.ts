import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

// Per docs/design-reference.md's accessibility floor: skip non-essential
// motion (staggered entrance, magnetic pull) when the OS-level reduce-motion
// setting is on. Never skip functional feedback (press states) based on this.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
