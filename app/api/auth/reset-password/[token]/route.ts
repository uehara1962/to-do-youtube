import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  // Extract token from params (Next.js 15+ async params)
  const resolvedParams = await params;
  const token = resolvedParams.token;

  // Also try to extract from URL path as fallback
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean); // Remove empty strings
  const tokenFromPath = pathParts[pathParts.length - 1];

  // Use token from params, fallback to path extraction
  const finalToken = token || tokenFromPath;

  // Additional validation: ensure tokenFromPath is not the route name itself
  const isValidToken =
    finalToken &&
    finalToken !== "undefined" &&
    finalToken !== "[token]" &&
    finalToken !== "reset-password" &&
    finalToken.length > 10; // Tokens are usually longer

  const { searchParams } = new URL(request.url);
  const callbackURL = decodeURIComponent(
    searchParams.get("callbackURL") || "/reset-password"
  );

  console.log("Reset password route:", {
    token,
    tokenFromPath,
    finalToken,
    pathname: url.pathname,
    pathParts,
    callbackURL,
    isValidToken,
  });

  if (!isValidToken) {
    return NextResponse.json(
      {
        error: "Token is required",
        debug: { token, tokenFromPath, pathname: url.pathname },
      },
      { status: 400 }
    );
  }

  // Redirect to the reset password page with the token
  // The Better Auth API route will handle token validation when the form is submitted
  const redirectUrl = new URL(callbackURL, request.url);
  redirectUrl.searchParams.set("token", finalToken);

  return NextResponse.redirect(redirectUrl);
}
