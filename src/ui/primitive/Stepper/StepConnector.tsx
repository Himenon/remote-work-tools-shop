import * as React from "react";

export interface StepConnectorProps {
  completed: boolean;
  orientation: "horizontal" | "vertical";
}

export const StepConnector: React.FC<StepConnectorProps> = ({ completed, orientation }) => {
  const colorClassName = completed ? "bg-indigo-600" : "bg-gray-300";
  const shapeClassName = orientation === "horizontal" ? "flex-1 h-0.5 mx-2" : "ml-4 w-0.5 h-6";
  return <div className={`${shapeClassName} ${colorClassName}`} aria-hidden />;
};

StepConnector.displayName = "StepConnector";
