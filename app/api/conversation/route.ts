import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
//import { configuration, OpenAI} from "openai";
import { checkSubscription } from "@/lib/subscription";

//const configuration = new configuration({
 // apiKey: process.env.OPENAI_API_KEY,
//});

//const openai = new OpenAI(configuration);


import {OpenAI} from 'openai';
//import { API_KEY } from "@clerk/nextjs/dist/types/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

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

    //const response = await openai.chat.completions.create({
     // model: "gpt-3.5-turbo",
     // messages
    //});

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": "Hello!"}],
    });
    //console.log(chatCompletion.choices[0].message);

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(Response);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
/*import { auth } from "@clerk/nextjs";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'openai';
import { NextResponse } from "next/server";
import { checkSubscription, checkUserLimit, incrementUserLimit } from "@/lib/user-limit";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY!,
};

const openai = new OpenAI(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { messages } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("Miss OpenAI API Key.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const reachToLimit = await checkUserLimit();
    const isPro = await checkSubscription();

    if (!reachToLimit && !isPro) {
      return  NextResponse.json({ message: "You are reach to limit. Please upgrade to higher plan.", status: 403 }, { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response, {
      onCompletion: async () => {
        if (!isPro) {
          await incrementUserLimit();
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}*/
