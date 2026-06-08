export default {
  async fetch(request, env) {
    try {
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rss = await fetch(rssUrl).then(r => r.text());
      const title = rss.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "Business";

      // On utilise SDXL Base, plus compatible et très stable
      const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `Professional business photography, sharp focus, 8k, high quality, theme: ${title}`,
        negative_prompt: "blurry, soft focus, painting, illustration, cartoon, low quality, distorted, watermark, text"
      });

      return new Response(image, {
        headers: { "Content-Type": "image/png" }
      });
    } catch (e) {
      return new Response("Erreur IA : " + e.message, { status: 500 });
    }
  }
};
