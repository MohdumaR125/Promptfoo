const promptfoo = require("promptfoo");
// const fs = require()
// const text = require("./prompts.txt");
(async () => {
  const results = await promptfoo.evaluate({
    prompts: ['Rephrase this in English: {{body}}', 'Rephrase this like a pirate: {{body}}'],
    providers: [
      'openai:gpt-3.5-turbo',
    ],
    tests: {
        vars: {
          body: "Kaise ho tum?",
        },
        assert: [
          {
            type: 'contains',
            value: "How",
          },
        ],
      },
    outputPath: "output.txt"
  });
  console.log('RESULTS:');
  console.log(results);
})();