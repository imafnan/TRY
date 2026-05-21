import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://client-certificate.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Login proxy error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to connect to server. Please try again." },
      { status: 502 }
    );
  }
}
