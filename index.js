export default {
  async fetch(request, env) {
    // 1. Récupération des news depuis le flux RSS
    const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
    const xml = await fetch(rssUrl).then(r => r.text());
    const items = extractBuzzItems(xml);
    const bestArticle = items.sort((a, b) => b.score - a.score)[0];

    // 2. IA : Reformulation percutante (Llama-3)
    const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      prompt: `Reformule ce titre en une phrase courte et virale pour Instagram : ${bestArticle.title}`
    });
    const improvedTitle = aiResponse.response;
    
    // 3. IA : Génération d'image (Stable Diffusion)
    // Le prompt est basé sur le titre reformulé par l'IA
    const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: `Professional business news illustration, clean, minimalist, high quality, concept of: ${improvedTitle}`
    });

    // 4. Retourner l'image générée en format PNG
    return new Response(image, { headers: { "Content-Type": "image/png" } });
  }
};

// Fonction utilitaire pour filtrer les news par mots-clés
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
