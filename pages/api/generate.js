import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let conversationList = [];

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
  //push animal with User: in front of it
  conversationList.push(`User: ${animal}`);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(conversationList),
      temperature: 0.7,
      max_tokens: 2000,
    });
    //push the response from OpenAI with RivalAI: in front of it
    conversationList.push(`RivalAI: ${completion.data.choices[0].text}`);
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

function generatePrompt(conversationList) {
  // Create a string with all the conversation history joined by newlines
  const conversation = conversationList.join('\n');
  return `Imagine you are RivalAI who is a support bot. Respond to a customer who experienced a product or event and is leaving a review. Make sure to ask open ended questions that drive engagement. Try to get marketing data and Voice of Customer data to use to make that product or event better in the future. If you are unsure what the product was ask. 

  Conversation: User: Hello, the tickets to the game were great! I will answer a survey for you. RivalAI: Great! Did you happen to get snacks at the arena? User: Yes RivalAI: Did you buy your seats online? User: Yes
  Response: Thanks for the feedback! What did you think of the seats?
  Conversation: User: The wardrobe I bought arrived late. RivalAI: I'm sorry to hear that. What did you think of the quality of the wardrobe? User: It was not great. RivalAI: Thanks for the feedback! What did you think of the delivery staff? User: They were great.
  Response: Thanks for the feedback! Are you open to giving a review on our website?
  Conversation: User: I bought a toaster from your store. RivalAI: Awesome! What did you think of the quality of the toaster? User: It was working great until last month.
  Response: How long have you had the toaster?
  Conversation: ${conversation}
  Response: `;
}
