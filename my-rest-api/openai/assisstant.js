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

const runAssistant = async () => {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: "Hi, generate me a workout plan, here are my details Age: 19 ,Height: 180m ,gender: male ,Workout goal: 2 hours of light workout per day ,experience : light gym experience ,Gym equipment available: dumbell",
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_pwQCji34kaPYh4oOoPkJ9xB3",
        instructions: "",    
    });

    console.log(run);

    const checkStatusAndPrintMessages = async (threadId, runId) => {
        let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (runStatus.status === 'requires_action') {
            console.log("Requires Action");
            const requiredActions = runStatus.required_action.submit_tool_outputs.tool_calls;
            console.log(requiredActions);
            console.log(requiredActions[0].function.arguments );
            // Handle the required actions
        } else
        if(runStatus.status === "completed"){
            let messages = await openai.beta.threads.messages.list(threadId);
           // messages.data.forEach((msg) => {
               // const role = msg.role;
                const content = msg.content[0].text.value; 
                // console.log(
                //     `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
                // );
          //  });
          console.log(messages);
        } else {
            console.log(runStatus.status);
            console.log("Run is not completed yet.");
        }  
    };

    setTimeout(() => {
        checkStatusAndPrintMessages(thread.id, run.id)
    }, 60000 );
};

//runAssistant();

// const run = await openai.beta.threads.runs.create(thread.id, {
//     // assistant_id: assistant.id,
//     assistant_id: "asst_pwQCji34kaPYh4oOoPkJ9xB3",
//     instructions: "",    
// });

// console.log(run)

// const checkStatusAndPrintMessages = async (threadId, runId) => {
//     let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
//     if(runStatus.status === "completed"){
//         let messages = await openai.beta.threads.messages.list(threadId);
//         messages.data.forEach((msg) => {
//             const role = msg.role;
//             const content = msg.content[0].text.value; 
//             console.log(
//                 `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
//             );
//         });
//     } else {
//         console.log("Run is not completed yet.");
//     }  
// };

// setTimeout(() => {
//     checkStatusAndPrintMessages(thread.id, run.id)
// }, 20000 );