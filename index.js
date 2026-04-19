import { GoogleGenAI, Type } from '@google/genai';
import express from 'express';
import 'dotenv/config'; // Load environment variables from a .env file into process.env. This is useful for managing configuration settings, such as API keys, without hardcoding them in your code.

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Configure the client
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});



// Crypto currency tool
async function cryptoCurrency({coin}) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
    const data = await response.json();
    return data;
}

// weather tool
async function weatherInformation({city}) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=e0f3046d51a745d3990160308260902&q=${city}&aqi=no`);
    const data = await response.json();
    return data;
}


// cryptcurrency wale ki information karke

const cryptoInfo = {
    name:"cryptoCurrency",
    description: "We can give you the current price or other information related to cryptocurrency like bitcoin and ethereum etc",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin:{
                type:Type.STRING,
                description: "It will be the name of the cryptocurrency like bitcoin, ethereum, etc"
            }
        },
        required:['coin']
    }
}

//Weather information wale ki information karke
const weatherInfo = {
    name: "weatherInformation",
    description: "You can get the current weather information of any city like london, goa etc",
    parameters:{
        type:Type.OBJECT,
        properties:{
            city:{
                type:Type.STRING,
                description:"Name of the city for which I have to fetch weather information like london, goa etc"
            }
        },
        required:['city']
    }
}

// tools array which will be given to llm
const tools = [{
    functionDeclarations: [cryptoInfo,weatherInfo]
}];

const toolFunctions = { //object which will have the mapping of function name and the actual function to call
    "cryptoCurrency": cryptoCurrency,
    "weatherInformation": weatherInformation
}

const History = [];

// 
async function runAgent() {
  while(true) { 
    const result = await ai.models.generateContent({ // give llm/ai model the tools and the history of conversation and give output in json format
        model: "gemini-2.0-flash",
        contents: History,
        config: { tools },
    });
    
    if(result.functionCalls && result.functionCalls.length > 0) {
        console.log("My function is called");
        const functionCall = result.functionCalls[0];

        const {name, args} = functionCall;
        
        // if(name=="cryptoCurrency"){
        //     const response = await cryptoCurrency(args);
        // }
        // else if(name=="weatherInformation"){
        //     const response = await weatherInformation(args);
        // }
        
        const response = await toolFunctions[name](args); // call the actual function using the mapping object and get the response -- cryptoCurrency(args) or weatherInformation(args)

        const functionResponsePart = {
            name: functionCall.name,
            response: {
                result: response,
            },
        };
        // Send the function response back to the model.
       History.push({
       role: "model",
        parts: [{functionCall: functionCall}],
        });

        History.push({
            role:'user',
            parts:[{functionResponse: functionResponsePart}]
        })
       }
       else{
        History.push({
            role:'model',
            parts:[{text:result.text}]
        });
        console.log(result.text);
        return result.text;
    }
  }
}

// Express Routes
app.post('/chat', async (req, res) => {
    try {
        const question = req.body.message;
        if(!question) {
            return res.status(400).json({error: "Message is required"});
        }
        
        History.push({
            role:'user',
            parts:[{text:question}]
        });
        
        const answer = await runAgent();
        res.json({reply: answer});
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.post('/clear', (req, res) => {
    History.length = 0; // Clear history array
    res.json({success: true});
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});