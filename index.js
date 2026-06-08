export default {
  // Déclencheur automatique (Cron)
  async scheduled(event, env, ctx) {
    await handleBotLogic();
  },
  
  // Permet de déclencher manuellement via une requête HTTP
  async fetch(request, env, ctx) {
    await handleBotLogic();
    return new Response('Analyse et filtrage des actualités terminés.');
  }
};

async function handleBotLogic() {
  console.log("Initialisation de la collecte...");

  // Flux RSS Business de Google News
  const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";

  try {
    const response = await fetch(rssUrl);
    const xml = await response.text();
    
    const items = extractRssItems(xml);
    
    console.log(`Nombre d'articles trouvés : ${items.length}`);
    items.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });

  } catch (error) {
    console.error("Erreur critique :", error);
  }
}

function extractRssItems(xml) {
  const items = [];
  // Expression régulière pour extraire les titres
  const regex = /<title>([^<]+)<\/title>/g;
  let match;
  
  // Liste des mots-clés pour le filtrage Business/Finance
  const businessKeywords = [
    "bourse", "finance", "économie", "entreprise", "rachat", 
    "action", "marché", "inflation", "banque", "croissance",
    "résultats", "dividende", "investissement", "taux"
  ];
  
  // On ignore le premier titre qui est le nom du flux
  regex.exec(xml); 

  while ((match = regex.exec(xml)) !== null && items.length < 5) {
    const title = match[1].trim();
    
    // Vérification : le titre doit contenir au moins un mot-clé business
    const isBusiness = businessKeywords.some(keyword => 
      title.toLowerCase().includes(keyword)
    );
    
    // Filtre : doit être du business ET avoir une longueur significative
    if (isBusiness && title.length > 15) {
      items.push(title);
    }
  }
  return items;
}
