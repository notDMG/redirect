export interface RedirectRequest {
  initData: string;
  startParam: string;
}

export interface RedirectResponse {
  url?: string;
  error?: string;
}