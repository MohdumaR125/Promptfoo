// customApiProvider.js
const fetch =require("node-fetch")
const OpenAI =require("openai");

class CustomApiProvider {
  constructor(options) {
    // Provider ID can be overridden by the config file (e.g. when using multiple of the same provider)
    this.providerId = options.id || 'custom provider';

    // options.config contains any custom options passed to the provider
    this.config = options.config;
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt) {
    // Add your custom API logic here
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
  });
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    "functions": [
      {
        "name": "parse_subject_tags",
        "description": "paring subject tags of level1, level2 and level3 for question",
        "parameters": {
          "type": "object",
          "properties": {
            "Level1": {
              "type": "string",
              "description": "Level1 which includes subject name, e.g. History"
            },
            "Level2": {
              "type": "string",
              "description": "Level2 which includes Topic name, e.g. indus valley civilization"
            },
            "Level3": {
              "type": "string",
              "description": "Level3 which includes sub-topic name, e.g.harrapan civilization"
            }
          },
          "required": ["Level1","Level2","Level3"]
        }
      }
    ]
});
    // Use options like: `this.config.temperature`, `this.config.max_tokens`, etc.
    
    return {
      // Required
      output: await chatCompletion.choices[0].message.function_call.arguments,

      // Optional
      // 
      
    };
  }
}

module.exports = CustomApiProvider;