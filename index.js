async function handleRequest(request) {
  const url = new URL(request.url);
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');

  // Define allowed domains for the Referer check
  const allowedDomains = [
    'live.statusarea.link',
    'hshr.site',
    'www.statusarea.link',
    'statusarea.link',
    'https://hshr-play.blogspot.com'
  ];

  // Middleware to check Referer header
  const referer = request.headers.get('Referer');
  if (!referer || !allowedDomains.some(domain => referer.includes(domain))) {
    return new Response("Unauthorized access. Please visit <a href='https://www.statusarea.link'>www.statusarea.link</a>", {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Route to serve specific files
  let filePath = url.pathname === "/" ? "HMsurya.html" : url.pathname.slice(1);
  let contentType = getContentType(filePath);

  try {
    const fileContent = await STATIC_ASSETS.get(filePath);
    if (fileContent) {
      headers.set('Content-Type', contentType);
      return new Response(fileContent, { headers });
    }
    return new Response('File not found', { status: 404 });
  } catch (error) {
    return new Response('Error retrieving file', { status: 500 });
  }
}

// Helper function to determine Content-Type based on file extension
function getContentType(pathname) {
  if (pathname.endsWith('.html')) return 'text/html';
  if (pathname.endsWith('.js')) return 'application/javascript';
  if (pathname.endsWith('.css')) return 'text/css';
  if (pathname.endsWith('.json')) return 'application/json';
  return 'text/plain';
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
