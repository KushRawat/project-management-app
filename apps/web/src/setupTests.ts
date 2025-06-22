import '@testing-library/jest-dom';

// Polyfill ResizeObserver for JSDOM
class ResizeObserver {
  observe(_target: Element) {}
  unobserve(_target: Element) {}
  disconnect() {}
}
;(global as any).ResizeObserver = ResizeObserver;

