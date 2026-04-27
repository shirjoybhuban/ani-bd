"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onDebouncedChange: (value: string) => void;
  delay?: number;
}

export function SearchInput({ onDebouncedChange, delay = 500 }: SearchInputProps) {
  const [innerValue, setInnerValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onDebouncedChange(innerValue.trim());
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, innerValue, onDebouncedChange]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInnerValue(event.target.value);
  };

  return (
    <Input
      className="max-w-xl"
      value={innerValue}
      onChange={onChange}
      type="text"
      placeholder="Search anime..."
      aria-label="Search anime"
    />
  );
}
