import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import { z } from "zod";

// Zod implementation as assignment

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    // When recieving username, this turns space " " to %20 👇
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 400 }
      );
    }

    // Checking if the code is correct and is not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update users verified status
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      // Code is expired
      return Response.json(
        {
          success: false,
          message:
            "Verification Code is Expired. Please get a new verification code",
        },
        {
          status: 418, // I'm a teapot
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Wrong Verification Code Entered. Try again",
        },
        {
          status: 401, // Unauthorized
        }
      );
    }
  } catch (error) {
    console.error("Error Verifying User");
    return Response.json(
      {
        success: false,
        message: "Error Verifying User",
      },
      {
        status: 500,
      }
    );
  }
}
