export default {
  async fetch(request, env) {
    try {
      // 1. On récupère le titre réel de l'actualité
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rss = await fetch(rssUrl).then(r => r.text());
      const title = rss.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "Actualité Business";

      // 2. On demande à l'IA une image spécifique à ce titre
      // J'ai ajouté des détails pour un style "Business" propre
      const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `A high-quality, professional, modern business news header image. Clean layout, minimalist style, corporate aesthetic, representing the theme: ${title}. High definition, no text on image.`
      });

      return new Response(image, {
        headers: { "Content-Type": "image/png" }
      });
    } catch (e) {
      return new Response("Erreur : " + e.message, { status: 500 });
    }
  }
};
