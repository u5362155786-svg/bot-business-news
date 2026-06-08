export default {
  async fetch(request, env) {
    try {
      // 1. Récupération info
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rss = await fetch(rssUrl).then(r => r.text());
      const title = rss.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "Business News";

      // 2. Génération image
      const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `Professional, clean, minimalist illustration about: ${title}`
      });

      // 3. Diagnostic : Vérifions ce que l'IA nous renvoie
      // Si c'est un tableau de données, on crée un Blob, sinon on affiche l'erreur
      return new Response(response, {
        headers: { "Content-Type": "image/png" }
      });

    } catch (e) {
      return new Response("Erreur détaillée : " + e.message + "\nStack: " + e.stack, { status: 500 });
    }
  }
};
