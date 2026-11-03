import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

const PRODUCTION_ORIGIN = 'https://content-smith-umber.vercel.app';
const PREVIEW_ORIGIN =
  'https://content-smith-dnlulmfd2-himanshubansal806-9575s-projects.vercel.app';
const UNAPPROVED_ORIGIN = 'https://unapproved.example';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.CLIENT_URL = `${PRODUCTION_ORIGIN}/, ${PREVIEW_ORIGIN}/`;
  vi.resetModules();

  const { createApp } = await import('../src/app.js');
  const app = createApp();

  await new Promise<void>((resolve) => {
    server = app.listen(0, resolve);
  });

  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe('CORS', () => {
  it('allows the production origin on GET responses', async () => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: PRODUCTION_ORIGIN },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe(PRODUCTION_ORIGIN);
  });

  it('allows the production origin on OPTIONS preflight for health and projects', async () => {
    for (const path of ['/api/health', '/api/projects']) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'OPTIONS',
        headers: {
          Origin: PRODUCTION_ORIGIN,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'content-type,authorization',
        },
      });

      expect(response.status).toBe(204);
      expect(response.headers.get('access-control-allow-origin')).toBe(PRODUCTION_ORIGIN);
      expect(response.headers.get('access-control-allow-methods')).toContain('GET');
      expect(response.headers.get('access-control-allow-methods')).toContain('POST');
      expect(response.headers.get('access-control-allow-methods')).toContain('PUT');
      expect(response.headers.get('access-control-allow-methods')).toContain('PATCH');
      expect(response.headers.get('access-control-allow-methods')).toContain('DELETE');
      expect(response.headers.get('access-control-allow-methods')).toContain('OPTIONS');
      expect(response.headers.get('access-control-allow-headers')).toContain('Content-Type');
      expect(response.headers.get('access-control-allow-headers')).toContain('Authorization');
    }
  });

  it('allows a configured preview origin after trimming whitespace and trailing slashes', async () => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: PREVIEW_ORIGIN },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe(PREVIEW_ORIGIN);
  });

  it('does not allow an unapproved origin on GET or OPTIONS', async () => {
    const getResponse = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: UNAPPROVED_ORIGIN },
    });
    const optionsResponse = await fetch(`${baseUrl}/api/projects`, {
      method: 'OPTIONS',
      headers: {
        Origin: UNAPPROVED_ORIGIN,
        'Access-Control-Request-Method': 'GET',
      },
    });

    expect(getResponse.headers.get('access-control-allow-origin')).toBeNull();
    expect(optionsResponse.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('keeps CORS headers when the error handler returns an error', async () => {
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        Origin: PRODUCTION_ORIGIN,
        'Content-Type': 'application/json',
      },
      body: '{',
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.headers.get('access-control-allow-origin')).toBe(PRODUCTION_ORIGIN);
  });
});
