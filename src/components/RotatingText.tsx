"use client";

import { useState, useEffect, useRef } from "react";

interface RotatingTextProps {
  words: string[];
  interval?: number;
}

export function RotatingText({ words, interval = 3000 }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure the longest word on mount
  useEffect(() => {
    if (measureRef.current) {
      const span = measureRef.current;
      let max = 0;
      words.forEach((word) => {
        span.textContent = word;
        max = Math.max(max, span.offsetWidth);
      });
      setMaxWidth(max);
    }
  }, [words]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <>
      {/* Hidden span to measure words */}
      <span
        ref={measureRef}
        className="absolute invisible whitespace-nowrap font-bold text-[#0D9488]"
        aria-hidden="true"
      />
      <span
        className="inline-block text-center font-bold text-[#0D9488]"
        style={{ width: maxWidth ? `${maxWidth}px` : "auto" }}
      >
        <span
          className={`inline-block transition-opacity duration-300 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {words[currentIndex]}
        </span>
      </span>
    </>
  );
}
