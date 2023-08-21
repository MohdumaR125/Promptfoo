import promptfoo from "promptfoo";
import fs from "fs";

let prompts = "";
try {
  prompts = fs.readFileSync('prompts.txt', 'utf8');
} catch (err) {
  console.error(err);
}
(async () => {
  let accuracy = 0
  let totalSubjectAccuracy = 0;
  let totalSkillAccuracy = 0;
  let totalTests = 0;
  const results = await promptfoo.evaluate({
    prompts: [`${prompts}`],
    providers: [
      'openai:gpt-3.5-turbo',
    ],
    defaultTest: {
      assert: [
        {
          type: "javascript",
          value: (output, testCase) => {
            console.log("======================================================")
            totalTests++;
            console.log(`<<< TEST ${totalTests}`);
            let testAccuracy = 0;
            let subjectAccuracy = 0
            let skillAccuracy = 0
            // Output
            const response = JSON.parse(output)
            const { subjectTags, skillTags } = response
            const { Level1, Level2, Level3 } = subjectTags

            // Expected
            const testCaseValue = testCase.assert[1].value
            const expected = JSON.parse(testCaseValue)
            const expectedSkillTags = expected.skillTags
            const expectedSubjectTags = expected.subjectTags
            const expectedLevel1 = expectedSubjectTags.Level1
            const expectedLevel2 = expectedSubjectTags.Level2
            const expectedLevel3 = expectedSubjectTags.Level3
            let outputCount = 0;
            let expectedCount = 0;

            // Sequence 
            let sequence = [];
            let isSequence = true;

            if (Level1) outputCount += 1;
            if (Level2) outputCount += 1;
            if (Level3) outputCount += 1;
            if (expectedLevel1) expectedCount += 1;
            if (expectedLevel2) expectedCount += 1;
            if (expectedLevel3) expectedCount += 1;


            const expectedSubjectTagsArr = Object.values(expectedSubjectTags).flat();
            const subjectTagsArr = Object.values(subjectTags);
            expectedSubjectTagsArr.forEach( (el, index) => {
              // Matching
              const isMatch = subjectTagsArr.some(async (element, i) => {
                if (element === el) {
                  sequence.push(i);
                  return true;
                }
                const isSimilar = await promptfoo.assertions.matchesSimilarity(el, element, 0.9)
                // console.log(expectedLevel3, "====", Level3);
                // console.log(el, "====", element);
                // console.log("Similarity ====> ", isSimilar)
                if(isSimilar.pass) return true; 
                return false;
              });

                // If expected count is 1
                if (expectedCount === 1) {
                  if (isMatch) {
                    subjectAccuracy = 100;
                  } else {
                    isSequence = false;
                  }

                  // If expected count is 2
                } else if (expectedCount === 2) {
                  if (index === 0) {
                    if (isMatch) subjectAccuracy += 60;
                    else sequence.push(null);
                  }
                  if (index === 1) {
                    if (isMatch) subjectAccuracy += 40;
                    else sequence.push(null);
                  }

                  // If expected count is 3
                } else if (expectedCount === 3) {
                  if (index === 0) {
                    if (isMatch) subjectAccuracy += 50;
                    else sequence.push(null);
                  }
                  if (index === 1) {
                    if (isMatch) subjectAccuracy += 20;
                    else sequence.push(null);
                  }
                  if (index === 2) {
                    if (isMatch) subjectAccuracy += 30;
                    else sequence.push(null);
                  }

                }

            });

            // Check Sequence 
            let max = 0;
            sequence.forEach((el, i) => {
              if (el !== null) {
                if (max <= el) {
                  max = el;
                } else {
                  isSequence = false
                }
              }
            })

            // Subject Comparison
            console.log("output--> Level1:", Level1, " === ", "expected--> Level1:", expectedLevel1)
            console.log("output--> Level2:", Level2, " === ", "expected--> Level2:", expectedLevel2)
            console.log("output--> Level3:", Level3, " === ", "expected--> Level3:", expectedLevel3)


            // Skill Tags Comparison
            let correctTags = 0;
            let expectedSkillTagsLength = expectedSkillTags.length
            for (let i = 0; i < expectedSkillTagsLength; i++) {
              if (skillTags.includes(expectedSkillTags[i])) {
                correctTags++;
              }
            }
            console.log("Output skillTags -->", skillTags)
            console.log("Expected skillTags -->", expectedSkillTags)
            console.log("Correct Skill Tags", correctTags);

            if (correctTags === 0) skillAccuracy += 0;
            // Only 1 tag is correct and other tags are wrong in output
            else if (correctTags === 1 && expectedSkillTagsLength === 2) skillAccuracy += 50;
            // Only 1 tag is correct and other tags are wrong in output
            else if (correctTags === 1 && expectedSkillTagsLength === 3) skillAccuracy += 33;
            // Only 2 tags are correct and other tags are wrong in output
            else if (correctTags === 2 && expectedSkillTagsLength === 3) skillAccuracy += 66;
            // All expected and output tags are matched
            else if (correctTags === expectedSkillTagsLength) skillAccuracy += 100;

            totalSubjectAccuracy += subjectAccuracy
            totalSkillAccuracy += skillAccuracy
            testAccuracy = (subjectAccuracy + skillAccuracy) / 2
            accuracy += testAccuracy
            const pass = testAccuracy >= 90 ? true : false;

            //Write Logs in file
            const filePath = 'customLog.txt';
            const newText = `output--> Level1: ${Level1}  ===  expected--> Level1: ${expectedLevel1},
            output--> Level2: ${Level2} === expected--> Level2: ${expectedLevel2},
            output--> Level3: ${Level3} === expected--> Level3: ${expectedLevel3},`

            
              // Append new text to the existing file
              fs.appendFile(filePath, newText, (err) => {
                if (err) {
                  console.error('Error appending text:', err);
                } else {
                  console.log('Text appended successfully!');
                }
              });
            


            // Logs
            console.log("Subject Tags Accuracy", subjectAccuracy);
            console.log("Skill Tags Accuracy", skillAccuracy);
            console.log("Test Accuracy", testAccuracy)
            console.log("======================================================")
            return {
              pass: true,
              score: 0,
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
  const finalAccuracy = accuracy / totalTests
  const finalSubjectAccuracy = totalSubjectAccuracy / totalTests
  const finalSkillAccuracy = totalSkillAccuracy / totalTests
  console.log("Total Subject Accuracy: ", finalSubjectAccuracy)
  console.log("Total Skill Accuracy: ", finalSkillAccuracy)
  console.log("Overall Prompt Accuracy", finalAccuracy);
})();
