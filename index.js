export default {
  async scheduled(event, env, ctx) {
    // Déclenché par le cron trigger
    await handleBotLogic();
  },
  async fetch(request, env, ctx) {
    // Permet de déclencher manuellement le bot via votre URL Cloudflare
    await handleBotLogic();
    return new Response('Bot Business déclenché avec succès !');
  }
};

async function handleBotLogic() {
  console.log("Démarrage de la récupération des actus...");

  // Exemple : Flux RSS de Google News (Business)
  const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";

  try {
    const response = await fetch(rssUrl);
    const rssText = await response.text();
    
    // Note : Pour une vraie automatisation, nous utiliserons un parseur XML ici
    // Pour l'instant, nous vérifions simplement que le flux est bien reçu
    if (response.ok) {
      console.log("Flux RSS récupéré avec succès.");
      // Ici, nous ajouterons bientôt la logique de transformation en image
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du flux :", error);
  }
}
