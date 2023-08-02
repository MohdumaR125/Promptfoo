module.exports = {
  description: 'A translator built with LLM',
  prompts: ['prompts.txt'],
  providers: ['openai:gpt-3.5-turbo'],
  tests: [
    {
      vars: {
        question: `Which conservation principle is applicable in the case of the motion of a rocket?

        (1) Conservation of mass
        (2) Conservation of charge
        (3) Conservation of momentum
        (4) Conservation of energy`
      },
      assert: [
        {
        type: "similar",
        value: `{"subjectTags": [{"Level 1": "Physics", "Level 2": "Mechanics", "Level 3": "Laws of Motions"}], "Skills": ["Knowledge of principles and generalizations"]}`,
        threshold: 0.8
      },
    ]
    },
    
  ],
  outputPath: "output.json"
};