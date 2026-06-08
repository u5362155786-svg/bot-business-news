export default {
  async fetch(request, env) {
    try {
      // 1. Vérification de la liaison AI
      if (!env.AI) {
        return new Response("Erreur : La liaison 'AI' n'est pas configurée dans wrangler.toml", { status: 500 });
      }

      // 2. Récupération simple d'un titre
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rssResponse = await fetch(rssUrl);
      const xml = await rssResponse.text();
      
      // Extraction rapide du premier titre
      const titleMatch = xml.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : "Finance Business News";

      // 3. Appel de l'IA (Stable Diffusion)
      const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `Professional business news illustration about: ${title}, minimalist, high quality, 4k`
      });

      // 4. Retour de l'image
      return new Response(image, { 
        headers: { "Content-Type": "image/png" } 
      });

    } catch (err) {
      return new Response("Erreur critique : " + err.message, { status: 500 });
    }
  }
};
