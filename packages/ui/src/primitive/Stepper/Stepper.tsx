import * as React from "react";
import { StepConnector, type StepConnectorProps } from "./StepConnector";
import { StepItem, type StepItemProps } from "./StepItem";

export interface StepDefinition {
  label: string;
  /** ステップが省略可能であることを示すサブラベル */
  subLabel?: string;
}

export interface StepperProps {
  steps: StepDefinition[];
  /** 現在アクティブなステップのインデックス（0始まり）*/
  activeStep: number;
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
}

const STEP_NUMBER_OFFSET = 1;
const LAST_CONNECTOR_INDEX_OFFSET = 1;

const resolveStatus = (index: number, activeStep: number): StepItemProps["status"] => {
  if (index < activeStep) {
    return "completed";
  }
  if (index === activeStep) {
    return "active";
  }
  return "inactive";
};

export const Stepper: React.FC<StepperProps> = ({ steps, activeStep, orientation = "horizontal" }) => {
  const containerClassName = orientation === "horizontal" ? "flex items-center w-full" : "flex flex-col";

  return (
    <div className={containerClassName} role="list" aria-label="ステップ">
      {steps.map((step, index) => {
        const stepItemProps: StepItemProps = {
          label: step.label,
          subLabel: step.subLabel,
          status: resolveStatus(index, activeStep),
          stepNumber: index + STEP_NUMBER_OFFSET,
        };
        const stepConnectorProps: StepConnectorProps = {
          completed: index < activeStep,
          orientation,
        };

        return (
          <React.Fragment key={step.label}>
            <div role="listitem">
              <StepItem {...stepItemProps} />
            </div>
            {index < steps.length - LAST_CONNECTOR_INDEX_OFFSET && <StepConnector {...stepConnectorProps} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Stepper.displayName = "Stepper";
