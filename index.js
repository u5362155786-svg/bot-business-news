export default {
  async fetch(request, env) {
    try {
      // 1. Récupération des news
      const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
      const response = await fetch(rssUrl);
      const xml = await response.text();
      const items = extractBuzzItems(xml);
      
      if (items.length === 0) return new Response("Aucune news trouvée", { status: 404 });
      
      const bestArticle = items.sort((a, b) => b.score - a.score)[0];

      // 2. IA : Reformulation (Llama-3)
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        prompt: `Reformule ce titre en une phrase courte pour Instagram : ${bestArticle.title}`
      });
      const improvedTitle = aiResponse.response || bestArticle.title;

      // 3. IA : Génération d'image (Stable Diffusion)
      const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: `Professional business illustration: ${improvedTitle}`
      });

      return new Response(image, { headers: { "Content-Type": "image/png" } });
      
    } catch (err) {
      // Si une erreur survient, on l'affiche au lieu de faire planter le worker
      return new Response("Erreur lors de l'exécution : " + err.message, { status: 500 });
    }
  }
};

function extractBuzzItems(xml) {
  const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<\/item>/g;
  let match;
  const items = [];
  const buzzWords = ["rachat", "chute", "record", "scandale", "banque", "finance", "action"];

  while ((match = regex.exec(xml)) !== null && items.length < 5) {
    const title = match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
    const score = buzzWords.filter(word => title.toLowerCase().includes(word)).length;
    items.push({ title, score });
  }
  return items;
}
