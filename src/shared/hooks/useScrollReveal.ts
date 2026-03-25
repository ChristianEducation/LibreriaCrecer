"use client";

import { useCallback, useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>() {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.07,
        rootMargin: "0px 0px -36px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return elementRef;
}

export function useScrollRevealMultiple<T extends HTMLElement>(baseDelayMs = 0, stepMs = 120) {
  const elementsRef = useRef(new Map<number, T>());
  const observersRef = useRef(new Map<number, IntersectionObserver>());

  const registerRef = useCallback(
    (index: number) => (node: T | null) => {
      const previousNode = elementsRef.current.get(index);
      if (previousNode && previousNode !== node) {
        observersRef.current.get(index)?.disconnect();
        observersRef.current.delete(index);
        elementsRef.current.delete(index);
      }

      if (!node) {
        return;
      }

      node.style.transitionDelay = `${baseDelayMs + index * stepMs}ms`;
      elementsRef.current.set(index, node);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.07,
          rootMargin: "0px 0px -36px 0px",
        },
      );

      observer.observe(node);
      observersRef.current.set(index, observer);
    },
    [baseDelayMs, stepMs],
  );

  useEffect(() => {
    return () => {
      observersRef.current.forEach((observer) => observer.disconnect());
      observersRef.current.clear();
      elementsRef.current.clear();
    };
  }, []);

  return registerRef;
}
