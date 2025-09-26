export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const webhookUrl = process.env.N8N_WEBHOOK_URL;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set");
}

if (!webhookUrl) {
  throw new Error("N8N_WEBHOOK_URL is not configured");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const caption = formData.get("caption");
    const file = formData.get("file");

    if (typeof caption !== "string" || !caption.trim()) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const filePayload = `data:${file.type};base64,${base64}`;

    const payload = {
      user_id: user.id,
      caption,
      file: filePayload
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type") ?? "";
    const status = response.status;

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status });
    }

    const text = await response.text();
    return new NextResponse(text, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}
