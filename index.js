export default {
  async fetch(request, env) {
    try {
      // 1. Récupération des news
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rssResponse = await fetch(rssUrl);
      const xml = await rssResponse.text();
      const titleMatch = xml.match(/<title>(.*?)<\/title>/);
      const originalTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : "Finance Business News";

      // 2. IA : Reformulation percutante (Llama-3)
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        prompt: `Reformule ce titre en une phrase courte et virale pour Instagram : ${originalTitle}`
      });
      const improvedTitle = aiResponse.response || originalTitle;

      // 3. IA : Génération d'image (Stable Diffusion)
      const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `Professional business news illustration, clean, minimalist, high quality, concept of: ${improvedTitle}`
      });

      // 4. Retourner l'image générée
      return new Response(image, { 
        headers: { "Content-Type": "image/png" } 
      });

    } catch (err) {
      return new Response("Erreur IA : " + err.message, { status: 500 });
    }
  }
};
