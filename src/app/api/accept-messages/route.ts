import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// This session is available via backend only
// As user was already injected using sessions

// getServerSession requires authOptions as credentialsProvider here is needed

export async function POST(request: Request) {
  await dbConnect;

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: " Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    // Update the user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: " Unable to find user to update Acceptance Status",
        },
        {
          status: 404,
        }
      );
    }

    // Succefully updated Acceptance status
    return Response.json(
      {
        success: true,
        message: "Acceptance Status Updated Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(" Error Updating Message Acceptance Status", error);
    return Response.json(
      {
        success: false,
        message: "rror Updating Message Acceptance Status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: " User Not Found",
        },
        {
          status: 404,
        }
      );
    }

    // Returning users acceptance message status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Retrieving Message Update Status", error);
    return Response.json(
      {
        success: false,
        message: "Error Retrieving Message Update Status ",
      },
      {
        status: 500,
      }
    );
  }
}
