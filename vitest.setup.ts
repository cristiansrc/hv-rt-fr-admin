import "@testing-library/jest-dom";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock document.elementFromPoint for TipTap/ProseMirror
vi.stubGlobal("elementFromPoint", vi.fn(() => null));
if (typeof document.elementFromPoint !== "function") {
  Object.defineProperty(document, "elementFromPoint", {
    value: vi.fn(() => null),
    configurable: true,
    writable: true,
  });
}
