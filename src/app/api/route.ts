// app/reference/route.ts
import { HtmlRenderingConfiguration } from '@scalar/core/libs/html-rendering';
import { ApiReference } from '@scalar/nextjs-api-reference';

const config: Partial<HtmlRenderingConfiguration> = {
  url: '/api/spec',
  title: 'mktour open api',
  showDeveloperTools: 'never',
  hideClientButton: true,
  hideModels: true,
  documentDownloadType: 'json',
  pageTitle: 'mktour open api',
};

export const GET = ApiReference(config);
