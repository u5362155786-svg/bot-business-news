export default {
  async fetch(request, env) {
    try {
      // 1. Récupération du titre de l'actualité
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rss = await fetch(rssUrl).then(r => r.text());
      const title = rss.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "Business";

      // 2. Génération avec Flux.1 (plus cohérent et moderne)
      // Ce modèle comprend beaucoup mieux les concepts de "design" que SDXL
      const image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: `A high-end, modern business news illustration for ${title}. 
                 Style: Professional, ultra-minimalist, sleek corporate design. 
                 Color palette: Deep navy blue, white, and a single accent of bright orange. 
                 Focus: Clean composition, smooth gradients, no chaotic elements, 
                 no text, no letters, wide angle, 8k resolution, cinematic lighting.`
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
