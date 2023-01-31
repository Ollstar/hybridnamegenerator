import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

let animalList = [];

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  animalList.push(animal);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animalList),
      temperature: 0.7,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animalList) {
  const animalHybrid = animalList.join("-");
  return `Suggest three super hero pet names for a hybrid animal created from the following animals: ${animalList}. If the animal list is just 1 animal, then the name should be for that animal.

  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Cat-Dog
  Names: Ruffclaw Elite, Kittycanine Defender, Barkmeow Justice
  Animal: ${animalHybrid}
  Names: `;
}
