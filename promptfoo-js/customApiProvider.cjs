// customApiProvider.js
const fetch =require("node-fetch")

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
    const data = await fetch("https://api.endpoints.anyscale.com/v1/chat/completions",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.TOKEN
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body : {
            "model": "meta-llama/Llama-2-70b-chat-hf",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
          }
    })
    // Use options like: `this.config.temperature`, `this.config.max_tokens`, etc.

    return {
      // Required
      output: data.json(),

      // Optional
      tokenUsage: {
        total: 10,
        prompt: 5,
        completion: 5,
      },
    };
  }
}

module.exports = CustomApiProvider;