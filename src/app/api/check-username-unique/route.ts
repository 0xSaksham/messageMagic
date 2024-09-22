import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const usernameParam = request.nextUrl.searchParams.get('username');

    if (!usernameParam) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is required',
        },
        { status: 400 }
      );
    }

    const result = UsernameQuerySchema.safeParse({ username: usernameParam });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
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
      return NextResponse.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}
