export default {
  async fetch(request, env) {
    try {
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const xml = await fetch(rssUrl).then(r => r.text());
      // On simplifie l'extraction pour être rapide
      const title = xml.match(/<title>(.*?)<\/title>/)?.[1] || "Actu Business";

      // Tentative d'IA avec un timeout implicite
      const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `Minimalist professional business background for: ${title}`
      });

      return new Response(image, { headers: { "Content-Type": "image/png" } });
    } catch (err) {
      // En cas d'erreur IA, on renvoie une image de couleur simple au lieu de planter
      return new Response("IA indisponible temporairement", { status: 503 });
    }
  }
};
