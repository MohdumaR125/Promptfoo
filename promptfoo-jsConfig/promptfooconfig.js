module.exports = {
  description: 'A translator built with LLM',
  prompts: ['prompts.txt'],
  providers: ['openai:gpt-3.5-turbo'],
  tests: [
    {
      vars: {
        question: "what is fs?"
      },
      assert: [
        {
        type: "equals",
        value: "fs"
      },
    ]
    },
    
  ],
  outputPath: "output.html"
};