export default {
  async fetch(request, env) {
    try {
      // Test de la liaison IA
      if (!env.AI) {
        throw new Error("La liaison 'AI' n'est pas configurée dans wrangler.toml");
      }

      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt: "Réponds par une phrase simple : Connexion IA réussie."
      });

      return new Response(JSON.stringify(response), {
        headers: { "content-type": "application/json" }
      });
    } catch (e) {
      // Si ça plante, on affiche l'erreur au lieu d'un écran blanc 1101
      return new Response("Erreur : " + e.message, { status: 500 });
    }
  }
};
