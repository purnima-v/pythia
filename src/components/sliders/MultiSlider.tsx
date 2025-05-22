"use client";
import Slider from "rc-slider";
import { type FC, useEffect, useRef, useState } from "react";

import "rc-slider/assets/index.css"; // Import RC slider base styles
import "./slider.css";

import SliderThumb from "./primitives/thumb";

export type MultiSliderValue = {
  left: number; // Represents Q1 (25th percentile index/value)
  center: number; // Represents Median (50th percentile index/value)
  right: number; // Represents Q3 (75th percentile index/value)
};

type ControlledValue = [number, number, number];

type Props = {
  value: MultiSliderValue;
  min: number; // Min value for the slider (e.g., 0 for index-based)
  max: number; // Max value for the slider (e.g., xValues.length - 1)
  step: number;
  clampStep?: number; // Minimum distance between thumbs
  onChange: (value: MultiSliderValue) => void;
  // shouldSyncWithDefault?: boolean; // This logic might be handled by parent now
  disabled?: boolean;
  // Add mode for theming if SliderThumb needs it, or pass themed styles directly
  // mode: 'pro' | 'novice'; 
};

const MultiSlider: FC<Props> = ({
  value,
  min,
  max,
  step,
  clampStep = 0, // Default to 0 if not provided, meaning thumbs can touch if step allows
  onChange,
  disabled = false,
}) => {
  const [controlledValue, setControlledValue] = useState<ControlledValue>([
    value.left,
    value.center,
    value.right,
  ]);
  // allowCross is managed by rc-slider's pushable prop, setting to true for desired behavior
  // const [allowCross, setAllowCross] = useState(true);
  
  // This ref was used to manage custom drag behavior for center thumb syncing.
  // rc-slider's `pushable` and `draggableTrack` might offer alternatives or require different logic.
  // For now, we simplify and rely on rc-slider's built-in capabilities first.
  const persistedPositionOrigin = useRef<ControlledValue | null | undefined>(
    undefined // Default to undefined to block initial track clicks if desired
  );

  useEffect(() => {
    // Sync controlledValue when the prop `value` changes from parent
    // This ensures the slider updates if the parent component changes the values programmatically.
    const newLeft = Math.max(min, Math.min(max, value.left));
    const newCenter = Math.max(min, Math.min(max, value.center));
    const newRight = Math.max(min, Math.min(max, value.right));
    setControlledValue([newLeft, newCenter, newRight]);
  }, [value, min, max]);

  const handleValueChange = (newValue: number | number[]) => {
    if (persistedPositionOrigin.current === undefined && !Array.isArray(newValue)) {
      return;
    }

    let newSliderState: ControlledValue;
    if (Array.isArray(newValue)) {
      newSliderState = newValue as ControlledValue;
    } else {
      return; 
    }

    // Apply clampStep constraints if provided
    let finalLeft = newSliderState[0];
    let finalCenter = newSliderState[1];
    let finalRight = newSliderState[2];

    if (persistedPositionOrigin.current !== null && persistedPositionOrigin.current !== undefined) {
      // Center thumb is being dragged, try to maintain relative distances
      const origin = persistedPositionOrigin.current;
      const centerDiff = finalCenter - origin[1];
      finalLeft = origin[0] + centerDiff;
      finalRight = origin[2] + centerDiff;

      // Ensure bounds are respected after sync
      finalLeft = Math.max(min, Math.min(finalLeft, max));
      finalRight = Math.max(min, Math.min(finalRight, max));
      finalCenter = Math.max(min, Math.min(finalCenter, max));

      // Ensure order and clampStep after sync
      finalLeft = Math.min(finalLeft, finalCenter - clampStep);
      finalRight = Math.max(finalRight, finalCenter + clampStep);
    } else {
      // Individual handles are being dragged
      // First, ensure the order is maintained
      if (finalLeft > finalCenter) finalLeft = finalCenter;
      if (finalCenter > finalRight) finalCenter = finalRight;
      if (finalLeft > finalRight) finalLeft = finalRight;

      // Calculate the distance from center to each marker
      const leftDistance = finalCenter - finalLeft;
      const rightDistance = finalRight - finalCenter;

      // Determine which marker is being dragged
      const isLeftDragging = Math.abs(finalLeft - newSliderState[0]) > Math.abs(finalRight - newSliderState[2]);

      if (isLeftDragging) {
        // Left marker is being dragged
        finalLeft = Math.max(min, Math.min(finalCenter - clampStep, finalLeft));
        finalRight = finalCenter + (finalCenter - finalLeft); // Mirror the left distance
      } else {
        // Right marker is being dragged
        finalRight = Math.min(max, Math.max(finalCenter + clampStep, finalRight));
        finalLeft = finalCenter - (finalRight - finalCenter); // Mirror the right distance
      }

      // Ensure markers stay within bounds and maintain order
      finalLeft = Math.max(min, Math.min(finalLeft, finalCenter - clampStep));
      finalRight = Math.max(finalCenter + clampStep, Math.min(finalRight, max));
    }

    // Final boundary checks
    finalLeft = Math.max(min, Math.min(finalLeft, max));
    finalCenter = Math.max(min, Math.min(finalCenter, max));
    finalRight = Math.max(min, Math.min(finalRight, max));

    const newOutputValue: MultiSliderValue = {
      left: finalLeft,
      center: finalCenter,
      right: finalRight,
    };
    setControlledValue([finalLeft, finalCenter, finalRight]);
    onChange(newOutputValue);
  };

  const handlePressIn = (index: number) => {
    // index 0: left, 1: center, 2: right
    if (index === 1) { // Center handle
      persistedPositionOrigin.current = [...controlledValue]; // Store current state for relative dragging
    } else { // Left or Right handle
      persistedPositionOrigin.current = null; // Indicates individual handle drag
    }
  };

  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={controlledValue}
      range
      count={2}
      disabled={disabled}
      onChange={(val) => handleValueChange(val as ControlledValue)}
      onBeforeChange={() => { /* Corresponds to onPressIn conceptually */ }}
      onAfterChange={() => {
        persistedPositionOrigin.current = undefined;
      }}
      pushable={clampStep > 0 ? clampStep : true}
      allowCross={false}
      style={{ touchAction: "pan-y" }}
      className={'relative flex h-9 w-full touch-none items-center'}
      handleRender={(origin, props) => {        
        return (
          <SliderThumb
            {...origin.props}
            value={controlledValue[props.index]!}
            active={props.index === 1}
            onClickIn={() => {
              handlePressIn(props.index);
            }}
          />
        );
      }}
      classNames={{
        rail: 'absolute h-[3px] w-full bg-gray-300 dark:bg-gray-700',
        track: 'absolute h-[3px] bg-blue-500 dark:bg-blue-400',
        handle: 'handle-class',
      }}
      included={true}
    />
  );
};

// calculateCenterMovementDiff was part of the original Metaculus example logic
// It helped maintain relative distances when dragging the center thumb.
// Our current simplified logic in handleValueChange for center drag might need refinement
// if precise relative movement is crucial and not handled well by simple offset addition.
// Keeping it here for reference.
/*
type Position = { origin: number; value: number };
function calculateCenterMovementDiff(
  persistedValue: Position,
  value: Position
) {
  const persistedValueDiff = persistedValue.value - persistedValue.origin;
  const valueDiff = value.value - value.origin;
  return persistedValueDiff - valueDiff;
}
*/

export default MultiSlider; 