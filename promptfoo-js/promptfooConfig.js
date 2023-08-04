const promptfoo = require("promptfoo");
let fs = require("fs")
let prompts = "";
try {
  prompts = fs.readFileSync('prompts.txt', 'utf8');
} catch (err) {
  console.error(err);
}
(async () => {
  let accuracy = 0
  let totalTests = 0;
  const results = await promptfoo.evaluate({
    prompts: [`${prompts}`],
    providers: [
      'openai:gpt-3.5-turbo',
    ],
    defaultTest:{
      assert:[
        {
        type: "javascript",
        value: (output, testCase)=>{
          let tempAcc = 0;
          // Output
          const response = JSON.parse(output)
          const {subjectTags, skillTags} = response
          const {Level1, Level2, Level3} = subjectTags

          // Expected
          const testCaseValue = testCase.assert[1].value
          const expected = JSON.parse(testCaseValue)
          const expectedSkillTags = expected.skillTags
          const expectedSubjectTags = expected.subjectTags
          const expectedLevel1 = expectedSubjectTags.Level1
          const expectedLevel2 = expectedSubjectTags.Level2
          const expectedLevel3 = expectedSubjectTags.Level3

          // Comparison
          if(Level1 === expectedLevel1) tempAcc += 50;
          if(Level2 === expectedLevel2) tempAcc += 30;
          if(Level3 === expectedLevel3) tempAcc += 20;
          accuracy += tempAcc;
          totalTests++; 
          console.log("=====================================================")
          console.log("output--> Level1", Level1, "expected--> Level1", expectedLevel1, expectedLevel1 === Level1)
          console.log("output--> Level2", Level2, "expected--> Level2", expectedLevel2, expectedLevel2 === Level2)
          console.log("output--> Level3", Level3, "expected--> Level3", expectedLevel3, expectedLevel3 === Level3)
          const pass = accuracy >= 90 ? true : false;
          return {
            pass,
            score: tempAcc,
            reason: pass ? 'output matched' : 'Output did not matched',
          };
        }
      }
      ]
    },
    tests: 'tests.csv',
    outputPath: 'output.json',
  });
  console.log('RESULTS:');
  console.log(results);
  console.log("total accuracy", accuracy, "Total Tests", totalTests);
  const finalAccuracy = accuracy/totalTests
  console.log("Commulative Accuracy",finalAccuracy);
})();
