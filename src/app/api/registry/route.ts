import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const registryPath = path.join(process.cwd(), "registry", "registry.json");
    const data = await fs.readFile(registryPath, "utf-8");
    const registry = JSON.parse(data);

    return NextResponse.json(registry, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load components registry" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
