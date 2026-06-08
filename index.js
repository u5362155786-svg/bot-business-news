export default {
  async fetch(request) {
    const title = "ACTUALITÉ BUSINESS"; // Titre simple pour tester
    
    const svg = `
      <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#cc0000"/>
        <text x="50%" y="50%" font-family="Arial" font-size="30" fill="white" text-anchor="middle" font-weight="bold">
          ${title}
        </text>
      </svg>`;

    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml" }
    });
  }
};
