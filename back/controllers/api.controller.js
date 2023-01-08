module.exports.getRequest = async (req, res) => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: `${req.body.prompt}, ajoute des balises HTML "<br>" a chaque fin de phrase.`,
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
