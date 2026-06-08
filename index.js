export default {
  // Déclencheur automatique (Cron)
  async scheduled(event, env, ctx) {
    await handleBotLogic();
  },
  
  // Test manuel via navigateur
  async fetch(request, env, ctx) {
    const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
    const response = await fetch(rssUrl);
    const xml = await response.text();
    
    const items = extractBuzzItems(xml);
    // On sélectionne le premier article (le plus buzzant)
    const bestArticle = items.length > 0 ? items.sort((a, b) => b.score - a.score)[0] : { title: "Pas d'actu disponible" };
    
    // Génération et affichage de l'image SVG
    const svg = generateImage(bestArticle.title);
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
  }
};

async function handleBotLogic() {
  console.log("Initialisation de la collecte...");
  const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
  
  try {
    const response = await fetch(rssUrl);
    const xml = await response.text();
    const items = extractBuzzItems(xml);
    
    if (items.length > 0) {
      const bestArticle = items.sort((a, b) => b.score - a.score)[0];
      console.log(`TOP BUZZ : ${bestArticle.title}`);
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
}

function extractBuzzItems(xml) {
  const items = [];
  const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<description>(.*?)<\/description>[\s\S]*?<\/item>/g;
  let match;
  const buzzWords = ["rachat", "chute", "record", "scandale", "explosion", "inedit", "urgence", "bourse", "finance", "banque"];

  while ((match = regex.exec(xml)) !== null && items.length < 10) {
    const title = match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
    const desc = match[2].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
    let score = buzzWords.filter(word => title.toLowerCase().includes(word)).length;
    items.push({ title, desc, score });
  }
  return items;
}

function generateImage(title) {
  // Découpage intelligent du texte pour faire des lignes
  const words = title.split(' ');
  let lines = [];
  let currentLine = "";
  
  words.forEach(word => {
    if ((currentLine + word).length < 25) {
      currentLine += word + " ";
    } else {
      lines.push(currentLine);
      currentLine = word + " ";
    }
  });
  lines.push(currentLine);

  return `
  <svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="1080" fill="#1a1a1a"/>
    <rect y="880" width="1080" height="200" fill="#cc0000"/>
    <text x="540" y="400" font-family="Arial" font-size="50" fill="white" text-anchor="middle" font-weight="bold">
      ${lines.map((line, i) => `<tspan x="540" dy="${i * 60}">${line}</tspan>`).join('')}
    </text>
    <text x="540" y="980" font-family="Arial" font-size="40" fill="white" text-anchor="middle" font-weight="bold">
      FLASH BUSINESS - L'ACTU EN DIRECT
    </text>
  </svg>`;
}
