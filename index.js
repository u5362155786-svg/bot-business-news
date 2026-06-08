export default {
  async fetch(request, env) {
    // On génère un SVG simple directement
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="blue"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" fill="white" text-anchor="middle">
          Connexion Worker OK !
        </text>
      </svg>`;

    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml" }
    });
  }
};
