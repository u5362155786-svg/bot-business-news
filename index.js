export default {
  async fetch(request, env) {
    try {
      // 1. Récupération dynamique du titre
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rss = await fetch(rssUrl).then(r => r.text());
      const title = rss.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "Business News";

      // 2. Génération d'image avec un prompt de type "Design Graphique Contemporain"
      // L'utilisation de mots-clés spécifiques empêche l'IA de faire des "collages"
      const image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: `A single, iconic, modern graphic design illustration representing: "${title}". 
                 Style: High-end corporate branding, minimalist aesthetic, vector art, 
                 clean white space, bold navy blue and geometric accents. 
                 Composition: A single centered subject, uncluttered, professional, sleek. 
                 NO text, NO letters, NO multiple objects, NO collage, NO blurry, NO low quality.`
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
