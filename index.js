export default {
  async scheduled(event, env, ctx) {
    await handleBotLogic();
  },
  async fetch(request, env, ctx) {
    await handleBotLogic();
    return new Response('Analyse terminée, vérifiez les logs.');
  }
};

async function handleBotLogic() {
  console.log("Initialisation de la collecte...");

  // Flux RSS Business de Google News
  const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";

  try {
    const response = await fetch(rssUrl);
    const xml = await response.text();
    
    // On utilise une méthode plus simple pour trouver les titres
    const items = [];
    const regex = /<title>([^<]+)<\/title>/g;
    let match;
    
    // On saute les premiers titres qui sont souvent le nom du flux
    regex.exec(xml); 

    while ((match = regex.exec(xml)) !== null && items.length < 5) {
      const title = match[1].trim();
      // On exclut les titres qui ressemblent à des noms de sites ou balises
      if (!title.includes("<![CDATA[")) {
        items.push(title);
      }
    }
    
    console.log(`Nombre d'articles trouvés : ${items.length}`);
    items.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });

  } catch (error) {
    console.error("Erreur critique :", error);
  }
}
