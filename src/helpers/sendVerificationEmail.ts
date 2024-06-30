import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// emails always takes time so, use async hamesha
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Message Magic Verification Code",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    return {
      success: true,
      message: " Email Sent Successfully",
    };
  } catch (emailError) {
    console.error("Error Sending Verification Email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
