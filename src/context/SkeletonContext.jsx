import React, { createContext, useContext, useState, useEffect } from 'react';

const SkeletonContext = createContext({
  showSkeleton: false,
  setShowSkeleton: () => {},
});

export const SkeletonProvider = ({ children, minDuration = 0 }) => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (minDuration > 0) {
      setShowSkeleton(true);
      const timer = setTimeout(() => setShowSkeleton(false), minDuration);
      return () => clearTimeout(timer);
    }
  }, [minDuration]);

  return (
    <SkeletonContext.Provider value={{ showSkeleton, setShowSkeleton }}>
      {children}
    </SkeletonContext.Provider>
  );
};

export const useSkeletonContext = () => {
  const context = useContext(SkeletonContext);
  if (!context) {
    return { showSkeleton: false, setShowSkeleton: () => {} };
  }
  return context;
};

export default SkeletonContext;
