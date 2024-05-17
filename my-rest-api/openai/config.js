const OpenAI = require('openai');

//import OpenAi from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();

const apiKey= "sk-proj-ws8AZQ19hhxFi1n5AWUeT3BlbkFJeDFxy8fdPlmCwHUsFghT"


// const configuration = new Configuration({
//   apiKey: apiKey,
// });

// const openai = new OpenAIApi(configuration);

// export default openai;


// New

const openai = new OpenAI({
  apiKey: apiKey // This is also the default, can be omitted
});

module.exports = openai;
