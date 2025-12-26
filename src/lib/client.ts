import { treaty } from '@elysiajs/eden';
import type { App } from '../app/api/[[...slugs]]/route';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const client = treaty<App>(getBaseUrl()).api;
