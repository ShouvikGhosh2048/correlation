import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { actual, guess } = await request.json();
        if (typeof actual !== 'number' || typeof guess !== 'number') {
            throw new Error();
        }

        await sql`INSERT INTO correlation (actual, guess) VALUES (${actual}, ${guess})`;
        return Response.json('Added.');
    } catch {
        return NextResponse.json({ error: "Couldn't create the correlation" }, { status: 500 });
    }
}