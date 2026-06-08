export default {
  async fetch(request, env) {
    try {
      // 1. Récupération des news
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rssResponse = await fetch(rssUrl);
      const xml = await rssResponse.text();
      const titleMatch = xml.match(/<title>(.*?)<\/title>/);
      const originalTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : "Finance Business News";

      // 2. IA : Reformulation (Llama-3.3 au lieu de 3)
      const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        prompt: `Reformule ce titre en une phrase courte et virale pour Instagram : ${originalTitle}`
      });
      const improvedTitle = aiResponse.response || originalTitle;

      // 3. IA : Génération d'image (Flux.1 au lieu de Stable Diffusion XL)
      const image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: `Professional business news illustration, clean, minimalist, high quality, concept of: ${improvedTitle}`
      });

      // 4. Retourner l'image générée
      return new Response(image, { 
        headers: { "Content-Type": "image/png" } 
      });

    } catch (err) {
      return new Response("Erreur IA mise à jour : " + err.message, { status: 500 });
    }
  }
};
