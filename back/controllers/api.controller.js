module.exports.getRequest = async (req, res) => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: `${req.body.prompt}, , donne moi la reponse la plus clair possible en mettant en forme avec des balises HTML simplifiés (pas de style a l'interieur) fais attention a ne pas depasser la limite de caractéres (500), ajoute  "&#129302" a la fin de la réponse`,
      temperature: 0.3,
      max_tokens: 4000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    })
    .then((resp) => {
      res.send(resp.data.choices[0].text);
    })
    .catch(() => {
      res.send("error");
    });
};
