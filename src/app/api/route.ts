// app/reference/route.ts
import { HtmlRenderingConfiguration } from '@scalar/core/libs/html-rendering';
import { ApiReference } from '@scalar/nextjs-api-reference';

const config: Partial<HtmlRenderingConfiguration> = {
  url: '/api/spec',
  title: 'mktour open api',
  showToolbar: 'never',
  hideClientButton: true,
  hideModels: true,
  documentDownloadType: 'json',
};

export const GET = ApiReference(config);
