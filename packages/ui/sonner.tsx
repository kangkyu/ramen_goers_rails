import * as React from "react";

// Simple wrapper for toast notifications
const Toaster: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  return <div className="toaster group" {...props} />;
};

export { Toaster };
