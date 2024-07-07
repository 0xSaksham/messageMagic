import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from "next/dist/shared/lib/constants";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: " User Not Found",
        },
        { status: 404 }
      );
    }

    // Check if user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: " User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    // Push the message to user's message array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: " Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(" Error Adding Messages ", error);
    return Response.json(
      {
        success: false,
        message: " Internal Server Error ",
      },
      { status: 500 }
    );
  }
}
