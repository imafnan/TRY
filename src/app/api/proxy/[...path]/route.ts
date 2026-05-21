import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://client-certificate.onrender.com";

async function handler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const proxyPath = url.pathname.replace(/^\/api\/proxy/, "");
    const queryString = url.search;

    const incomingContentType = req.headers.get("content-type") || "";

    const forwardHeaders: Record<string, string> = {};

    const adminEmail = req.headers.get("x-admin-email");
    const adminPassword = req.headers.get("x-admin-password");
    if (adminEmail) forwardHeaders["x-admin-email"] = adminEmail;
    if (adminPassword) forwardHeaders["x-admin-password"] = adminPassword;

    if (incomingContentType) {
      forwardHeaders["Content-Type"] = incomingContentType;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: forwardHeaders,
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "DELETE") {
      if (incomingContentType.includes("multipart/form-data")) {
        fetchOptions.body = await req.arrayBuffer();
      } else {
        const body = await req.text();
        if (body) fetchOptions.body = body;
      }
    }

    const backendUrl = `${API_URL}${proxyPath}${queryString}`;
    console.log(`[Proxy] ${req.method} ${backendUrl}`);

    const response = await fetch(backendUrl, fetchOptions);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: true, message: "Operation completed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("[Proxy] Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to connect to server. Please try again." },
      { status: 502 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
};
