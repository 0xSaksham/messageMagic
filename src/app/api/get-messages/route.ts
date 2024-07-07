import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: " Not Authenticated ",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // this matches the user with userId
      { $unwind: "$messages" }, // for arrays, this creates objects from arrays
      { $sort: { "messages.createdAt": -1 } }, //descending order sorting using created date
      { $group: { _id: "$_id", messages: { $push: "messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: " User Not Found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" An unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: " An unexpected error occured ",
      },
      { status: 500 }
    );
  }
}
