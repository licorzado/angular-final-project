import { RenderMode, ServerRoute } from '@angular/ssr';

// Cart state lives in the browser, and routes have params, so render on request.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
