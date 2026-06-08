export default {
  async scheduled(event, env, ctx) {
    await handleBotLogic();
  },
  async fetch(request, env, ctx) {
    await handleBotLogic();
    return new Response('Analyse des news terminée.');
  }
};

async function handleBotLogic() {
  console.log("Initialisation de la collecte...");

  const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";

  try {
    const response = await fetch(rssUrl);
    const xml = await response.text();
    
    // Extraction simplifiée des titres (le format RSS est en XML)
    const items = extractRssItems(xml);
    
    console.log(`Nombre d'articles trouvés : ${items.length}`);
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
    });

  } catch (error) {
    console.error("Erreur de récupération :", error);
  }
}

function extractRssItems(xml) {
  const items = [];
  // Utilisation d'expressions régulières pour extraire les balises <title>
  const regex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = regex.exec(xml)) !== null) {
    const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(match[1]);
    if (titleMatch) {
      items.push({ title: titleMatch[1] });
    }
  }
  return items.slice(0, 5); // On ne garde que les 5 premiers pour votre carrousel
}
