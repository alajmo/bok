export const log = {
  debug: (...args: any[]) => console.debug("[DEBUG]", ...args),
  info: (...args: any[]) => console.info("[INFO]", ...args),
  warning: (...args: any[]) => console.warn("[WARN]", ...args),
  error: (...args: any[]) => console.error("[ERROR]", ...args),
};
