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
      // If undefined, it means track click, which we might want to ignore or handle specifically.
      // rc-slider by default moves the closest handle on track click.
      // For now, let's proceed if it's an array (multi-handle drag or direct set)
      return;
    }

    let newSliderState: ControlledValue;
    if (Array.isArray(newValue)) {
      newSliderState = newValue as ControlledValue;
    } else {
      // This case should ideally not happen if `range` is true and we expect an array.
      // If it does, it implies a single value update, which is not standard for a 3-point slider.
      // For safety, we can try to update the closest handle or ignore.
      // Let's assume `newValue` will be `ControlledValue` due to `range` prop.
      return; 
    }

    // Apply clampStep constraints if provided
    // Order: left <= center <= right
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
      finalCenter = Math.max(min, Math.min(finalCenter, max)); // Recenter if pushed by synced L/R

      // Ensure order and clampStep after sync
      finalLeft = Math.min(finalLeft, finalCenter - clampStep);
      finalRight = Math.max(finalRight, finalCenter + clampStep);

    } else {
        // Individual handles are being dragged or it's an initial set
        // Ensure order and apply clampStep
        finalLeft = Math.min(newSliderState[0], newSliderState[1] - clampStep, newSliderState[2] - 2 * clampStep);
        finalCenter = Math.max(finalLeft + clampStep, Math.min(newSliderState[1], newSliderState[2] - clampStep));
        finalRight = Math.max(finalCenter + clampStep, newSliderState[2]);
    }

    // Final boundary checks
    finalLeft = Math.max(min, Math.min(finalLeft, max));
    finalCenter = Math.max(min, Math.min(finalCenter, max));
    finalRight = Math.max(min, Math.min(finalRight, max));
    
    // Ensure they are still ordered after all adjustments
    if (finalLeft > finalCenter) finalLeft = finalCenter;
    if (finalCenter > finalRight) finalCenter = finalRight;
    if (finalLeft > finalRight) finalLeft = finalRight; // Should not happen if above are correct


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
      range // Enables multiple handles
      count={2} // For 3 handles (creates 3 handles, 2 ranges/tracks)
      disabled={disabled}
      onChange={(val) => handleValueChange(val as ControlledValue)} // Will be array due to range
      onBeforeChange={() => { /* Corresponds to onPressIn conceptually */ }}
      // onChangeComplete not directly available, use onAfterChange
      onAfterChange={() => {
        persistedPositionOrigin.current = undefined; // Reset after drag operation
      }}
      pushable={clampStep > 0 ? clampStep : true} // if clampStep=0, allow pushable without gap
      // allowCross={false} // Handled by ordering logic and pushable
      style={{ touchAction: "pan-y" }} // from example
      className={'relative flex h-9 w-full touch-none items-center'} // For the root .rc-slider styles
      handleRender={(origin, props) => {        
        return (
          <SliderThumb
            {...origin.props} // Pass existing props from rc-slider's handle
            value={controlledValue[props.index]!} // Pass the correct value for this thumb
            active={props.index === 1} // Center thumb is visually distinct as "active"
            onClickIn={() => {
              handlePressIn(props.index);
            }}
            // onTouchStartCapture={(e) => {
            //   // e.preventDefault(); // preventDefault can interfere with rc-slider's own touch handling
            //   handlePressIn(props.index);
            // }}
          />
        );
      }}
      // For the Tailwind CSS styles:
      classNames={{
        rail: 'absolute h-[3px] w-full bg-gray-300 dark:bg-gray-700',
        track: 'absolute h-[3px] bg-blue-500 dark:bg-blue-400', // More visible track
        handle: 'handle-class', // This will be overridden by handleRender
      }}
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