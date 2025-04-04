import { InterviewCreate } from "@/types";
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { adminDb } from "@/lib/firebaseAdmin";
export async function GET() {
  return NextResponse.json({ message: "testt" }, {});
}

export async function POST(req: Request) {
  try {
    const { level, role, techstack, type, userId, amount }: InterviewCreate =
      await req.json();
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `prepare questions for  an interview where
                job role is ${role}.
                job experience levet is ${level}.
                tech stack used in the job is: ${techstack}.
                focus between behavioural and technical questions should lean towards: ${type}.
                amount of questions required is: ${amount}.
                Please return only the questions, without any additional text.
                The questions are going to be read by a voice assistant so do not use "/" or or
                questions formatted tike this:
                Return them in an array [ "Question 1", "Question 2", "Question 3".....]`,
    });

    const interviewData = {
      level,
      role,
      techstack,
      type,
      userId,
      createdAt: new Date().toISOString(),
      description: "",
      imageUrl: "",
      questions: JSON.parse(text),
    };
    const { text: description } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `i need small interview description for this one here with that JSON 
        ${JSON.stringify(interviewData)}
        
        please keep it concise in range of 2-3 lines of text`,
    });
    interviewData.description = description;
    const tempaltesRef = adminDb.collection("templates");
    const interviewRef = await tempaltesRef.add(interviewData);
    const id = (await interviewRef.get()).id;

    return NextResponse.json({
      message: "created the interview template ",
      id,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "error happend in vapi generate route ",
    });
  }
}
