export default {
  async fetch(request, env) {
    try {
      // 1. Récupération du titre de l'actualité
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rss = await fetch(rssUrl).then(r => r.text());
      const title = rss.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "Business";

      // 2. Génération de l'image avec un prompt minimaliste pour éviter les incohérences
      const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `Minimalist graphic design, flat vector style, business concept representing: ${title}. 
                 Clean white background, professional color palette (navy blue and white), 
                 high quality geometric composition, organized and structured. 
                 NO complex machinery, NO realistic clutter, NO blurry elements, NO text.`,
        negative_prompt: "blurry, soft focus, painting, illustration, cartoon, low quality, distorted, watermark, text, realistic clutter, complex machinery"
      });

      // 3. Retour de l'image
      return new Response(image, {
        headers: { "Content-Type": "image/png" }
      });
    } catch (e) {
      return new Response("Erreur IA : " + e.message, { status: 500 });
    }
  }
};
