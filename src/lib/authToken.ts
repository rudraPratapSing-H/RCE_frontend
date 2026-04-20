type TokenListener = (token: string | null) => void;

let accessToken: string | null = null;
const tokenListeners = new Set<TokenListener>();

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
  tokenListeners.forEach((listener) => listener(token));
};

export const subscribeAccessToken = (listener: TokenListener): (() => void) => {
  tokenListeners.add(listener);
  return () => tokenListeners.delete(listener);
};