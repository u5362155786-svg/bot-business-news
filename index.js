export default {
  async fetch(request, env, ctx) {
    const rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr";
    const xml = await fetch(rssUrl).then(r => r.text());
    
    // 1. Extraction et sélection du meilleur sujet
    const items = extractBuzzItems(xml);
    const bestArticle = items.sort((a, b) => b.score - a.score)[0];
    
    // 2. IA : Reformulation du titre (Llama-3)
    const aiTitle = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      prompt: `Reformule ce titre en une phrase courte et percutante pour Instagram : ${bestArticle.title}`
    });
    
    // 3. IA : Génération d'image (Stable Diffusion)
    const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: `Professional business news illustration, clean, minimalist, high quality, concept of: ${bestArticle.title}`
    });
    
    // 4. Construction de la réponse (Image générée)
    return new Response(image, { headers: { "Content-Type": "image/png" } });
  }
};

function extractBuzzItems(xml) {
  const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<\/item>/g;
  let match;
  const items = [];
  const buzzWords = ["rachat", "chute", "record", "scandale", "banque", "finance"];

  while ((match = regex.exec(xml)) !== null && items.length < 5) {
    const title = match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
    const score = buzzWords.filter(word => title.toLowerCase().includes(word)).length;
    items.push({ title, score });
  }
  return items;
}
