// import OpenAI from "openai";
//import openai from './config.js';


const openai = require('./config.js');
// const openai = new OpenAI();

// const assistant = await openai.beta.assistants.create({
//     name: "Math Tutor",
//     instructions:
//         "You are a personal math tutor. Write and run code to answer math questions.",
//     tools: [{ type: "code_interpreter" }],
//     model: "gpt-3.5-turbo",
// });

// const parameterTest = async (age, height, gender) => {
//     return `Hi, generate me a workout plan, here are my details Age: ${age} ,Height: ${height}
// }


const runAssistant = async (age, height, gender, goal, weight, experience, gym_equipment) => {
    const thread = await openai.beta.threads.create();
    let result = "";
// const content =  `Hi, generate me a 7-day workout plan, here are my details Age: ${age}, Height: ${height}, gender: ${gender}, Workout goal: ${goal}, experience: ${experience}, Gym equipment available: ${gym_equipment}`;
//     console.log(content);


    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Hi, generate me a workout plan, here are my details Age: ${age} years old, Height: ${height},Weight:  ${weight},Gender: ${gender}, Workout goal: ${goal}, experience: ${experience}, Gym equipment available: ${gym_equipment}`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_pwQCji34kaPYh4oOoPkJ9xB3",
        instructions: "",    
    });

    const checkStatusAndPrintMessages = async (threadId, runId) => {
        let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (runStatus.status === 'requires_action') {
            console.log("Requires Action");
            const requiredActions = runStatus.required_action.submit_tool_outputs.tool_calls;
           // console.log(requiredActions[0].function.arguments);
            result = requiredActions[0].function.arguments;
            return result;
        } else if (runStatus.status === "completed") {
            let messages = await openai.beta.threads.messages.list(threadId);
            result = messages.data[0].content[0].text.value;
            return result;
        } else {
            console.log(runStatus.status);
            console.log("Run is not completed yet.");
            return null;
        }  
    };

    const waitForAction = async (threadId, runId) => {
        let result = null;
        while (!result) {
            result = await checkStatusAndPrintMessages(threadId, runId);
            if (!result) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        return result;
    };

    return waitForAction(thread.id, run.id);
};

module.exports = { runAssistant };