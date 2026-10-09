const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const projectRoot = __dirname;
const port = Number(process.env.PORT) || 3000;
const apiKey = process.env.RAPIDAPI_KEY;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};
const requestWindows = new Map();
const requestLimit = 30;
const requestWindowMs = 60_000;

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(body));
}

function allowSearch(clientAddress) {
  const now = Date.now();
  const current = requestWindows.get(clientAddress);
  const window = !current || now - current.startedAt >= requestWindowMs
    ? { startedAt: now, count: 0 }
    : current;
  window.count += 1;
  requestWindows.set(clientAddress, window);
  return window.count <= requestLimit;
}

async function handleMovieSearch(request, response, url) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  const query = (url.searchParams.get('query') || '').trim();
  if (query.length < 1 || query.length > 100) {
    return sendJson(response, 400, { error: 'Enter a movie title of 1 to 100 characters.' });
  }
  if (!allowSearch(request.socket.remoteAddress || 'unknown')) {
    return sendJson(response, 429, { error: 'Too many searches. Please try again shortly.' });
  }
  if (!apiKey) {
    return sendJson(response, 503, { error: 'Movie search has not been configured.' });
  }

  try {
    const upstreamUrl = new URL('https://imdb146.p.rapidapi.com/v1/find/');
    upstreamUrl.searchParams.set('query', query);
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'imdb146.p.rapidapi.com',
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!upstream.ok) return sendJson(response, 502, { error: 'The movie data service is unavailable.' });

    const data = await upstream.json();
    const results = data?.titleResults?.results;
    if (!Array.isArray(results)) return sendJson(response, 502, { error: 'The movie data service returned an unexpected response.' });
    return sendJson(response, 200, { titleResults: { results: results.slice(0, 10) } });
  } catch {
    return sendJson(response, 502, { error: 'The movie data service could not be reached.' });
  }
}

async function handleStaticFile(request, response, pathname) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end();
  }

  const requestPath = pathname === '/' ? '/index.html' : pathname;
  const resolvedPath = path.resolve(projectRoot, `.${requestPath}`);
  if (resolvedPath !== projectRoot && !resolvedPath.startsWith(`${projectRoot}${path.sep}`)) {
    response.writeHead(403);
    return response.end();
  }

  try {
    const content = await readFile(resolvedPath);
    response.writeHead(200, {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': mimeTypes[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    return response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Not found.');
  }
}

const server = createServer((request, response) => {
  let url;
  try {
    url = new URL(request.url, 'http://localhost');
  } catch {
    return sendJson(response, 400, { error: 'Invalid request URL.' });
  }

  if (url.pathname.endsWith('/api/movies/search')) {
    void handleMovieSearch(request, response, url);
  } else {
    void handleStaticFile(request, response, url.pathname);
  }
});

const host = process.env.HOST || '0.0.0.0';
server.listen(port, host, () => {
  process.stdout.write(`Movie Finder server listening on http://${host}:${port}\n`);
});
