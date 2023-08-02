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
    {
      vars: {
        question: `The soft silvery metalic element which ionizes easily when heated or exposed to light and is present in atomic clocks is :

        (1) Cerium (2) Cesium
        (3) Calcium (4) Califonrium`
      },
      assert: [
        {
        type: "similar",
        value: `{"subjectTags": [{"Level 1": "Chemistry", "Level 2": "In-Organic Chemistry", "Level 3": "Elements"}], "Skills": ["Recognizing	 Knowledge of specific details and elements"]}`,
        threshold: 0.8
      },
    ]
    },
    {
      vars: {
        question: `In a certain code language, 'mee muk pic' is 'roses are yellow', 'nil dic' is 'white flowers' and 'pic muk dic' is 'flowers are fruits'. What is the code for 'white' in that code language?`
      },
      assert: [
        {
        type: "similar",
        value: `{"subjectTags": [{"Level 1": "Reasoning", "Level 2": "Verbal Reasoning", "Level 3": "Coding and Decoding"}], "Skills": ["Interpreting"]}`,
        threshold: 0.8
      },
    ]
    },
    
  ],
  outputPath: "output.json"
};