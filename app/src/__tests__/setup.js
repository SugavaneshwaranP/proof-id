// ============================================================================
// PROOF-ID / BACKED — VITEST NODE ENVIRONMENT SETUP & POLYFILLS
// Provides lightweight window & storage mocks so tests run with zero extra dependencies.
// ============================================================================

class MemoryStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const memLocalStorage = new MemoryStorage();
const memSessionStorage = new MemoryStorage();

globalThis.localStorage = memLocalStorage;
globalThis.sessionStorage = memSessionStorage;

if (typeof globalThis.window === "undefined") {
  globalThis.window = {
    location: {
      pathname: "/",
      search: "",
      href: "https://backed.network/",
      origin: "https://backed.network",
    },
    history: {
      pushState: () => {},
      replaceState: () => {},
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    scrollTo: () => {},
    localStorage: memLocalStorage,
    sessionStorage: memSessionStorage,
  };
} else {
  globalThis.window.localStorage = memLocalStorage;
  globalThis.window.sessionStorage = memSessionStorage;
}

class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1;
    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSING = 2;
    this.CLOSED = 3;
  }
  addEventListener() {}
  removeEventListener() {}
  send() {}
  close() {}
}

globalThis.WebSocket = MockWebSocket;
if (typeof globalThis.window !== "undefined") {
  globalThis.window.WebSocket = MockWebSocket;
}
