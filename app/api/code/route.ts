import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
//import { ChatCompletionRequestMessage,OpenAI} from "openai";
//import {OpenAI} from 'openai';

//const openai = new OpenAI({
 // apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
//});
import {OpenAI} from 'openai';
//import { API_KEY } from "@clerk/nextjs/dist/types/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});


import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";



//const openai = new OpenAI(configuration);

const instructionMessage = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    //const response = await openai.createChatCompletion({
    //  model: "gpt-3.5-turbo",
    //  messages: [instructionMessage, ...messages]
   // });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": "Hello!"}],
    });
    console.log(chatCompletion.choices[0].message);

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(Response);
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
