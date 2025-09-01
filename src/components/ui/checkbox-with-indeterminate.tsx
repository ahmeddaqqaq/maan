"use client";

import * as React from "react";
import { Checkbox } from "./checkbox";
import { Minus } from "lucide-react";

interface CheckboxWithIndeterminateProps {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function CheckboxWithIndeterminate({
  checked,
  indeterminate = false,
  onCheckedChange,
  ...props
}: CheckboxWithIndeterminateProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  if (indeterminate) {
    return (
      <div className="relative">
        <Checkbox
          {...props}
          ref={ref}
          checked={false}
          onCheckedChange={onCheckedChange}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Minus className="size-3 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <Checkbox
      {...props}
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
    />
  );
}
