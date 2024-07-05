import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  //POST method check: To let the users know that this route only accepts GET requests
  // TODO: Use this in all other routes
  // if (request.method !== "GET") {
  //   return Response.json(
  //     {
  //       success: false,
  //       message: " Method Not Allowed",
  //     },
  //     {
  //       status: 405,
  //     }
  //   );
  // }
  // Only used in Paqes Router, NextJS handles this now
  await dbConnect();

  // localhost:3000/check-unique-username?username=saksham?phone=android is the type of url
  try {
    const { searchParams } = new URL(request.url); // recives the url and finds the query we need

    const queryParams = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    //console.log(result); //TODO: Remove this line before deploying

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid Query Parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: " Username is already Taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error Checking Username", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      {
        status: 500,
      }
    );
  }
}
