import { BASE_URL } from '@/lib/config/urls';
import { appRouter } from '@/server/api';
import {
  generateOpenApiDocument,
  GenerateOpenApiDocumentOptions,
} from 'trpc-to-openapi';

const parameters: GenerateOpenApiDocumentOptions = {
  title: 'mktour open api',
  version: '1.0.0',
  baseUrl: `${BASE_URL}/api`,
  description: 'the list of availible mktour endpoints for external use',
  tags: ['users', 'auth', 'clubs', 'tournaments', 'players'],
};

export const openApiDocument = generateOpenApiDocument(appRouter, parameters);
