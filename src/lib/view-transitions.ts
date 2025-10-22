// View Transitions API utilities

export function startViewTransition(callback: () => void) {
  // Check if View Transitions API is supported
  if (!document.startViewTransition) {
    // Fallback for browsers that don't support View Transitions
    callback();
    return;
  }

  // Start the transition
  document.startViewTransition(callback);
}

export function startViewTransitionWithName(name: string, callback: () => void) {
  if (!document.startViewTransition) {
    callback();
    return;
  }

  // Start transition with custom name
  document.startViewTransition(() => {
    // Set the view transition name for the root element
    document.documentElement.style.viewTransitionName = name;
    callback();
  });
}

// Predefined transition types
export const transitions = {
  slide: (callback: () => void) => startViewTransition(callback),
  fade: (callback: () => void) => startViewTransitionWithName('modal', callback),
  scale: (callback: () => void) => startViewTransitionWithName('scale', callback),
} as const;

// Hook for React components
export function useViewTransition() {
  return {
    startTransition: startViewTransition,
    slide: transitions.slide,
    fade: transitions.fade,
    scale: transitions.scale,
  };
}
