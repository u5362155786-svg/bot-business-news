export default {
  async fetch(request, env) {
    try {
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const rss = await fetch(rssUrl).then(r => r.text());
      const title = rss.match(/<title>(.*?)<\/title>/)?.[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || "Business News";

      const image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: `Professional, clean, minimalist illustration about: ${title}`
      });

      return new Response(image, {
        headers: { "Content-Type": "image/png" }
      });
    } catch (e) {
      return new Response("Erreur : " + e.message, { status: 500 });
    }
  }
};
