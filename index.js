export default {
  async fetch(request, env) {
    try {
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const xml = await fetch(rssUrl).then(r => r.text());
      const title = xml.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "ACTU BUSINESS";

      // Génération SVG avec texte auto-ajusté
      const words = title.split(' ');
      let lines = [];
      let currentLine = "";
      words.forEach(w => {
        if ((currentLine + w).length < 20) currentLine += w + " ";
        else { lines.push(currentLine); currentLine = w + " "; }
      });
      lines.push(currentLine);

      const svg = `
      <svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="1080" height="1080" fill="#1a1a1a"/>
        <rect y="880" width="1080" height="200" fill="#cc0000"/>
        <text x="540" y="300" font-family="Arial" font-size="60" fill="white" text-anchor="middle" font-weight="bold">
          ${lines.map((line, i) => `<tspan x="540" dy="${i * 70}">${line.toUpperCase()}</tspan>`).join('')}
        </text>
        <text x="540" y="980" font-family="Arial" font-size="40" fill="white" text-anchor="middle" font-weight="bold">
          FLASH BUSINESS
        </text>
      </svg>`;

      return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
    } catch (e) {
      return new Response("Erreur: " + e.message, { status: 500 });
    }
  }
};
