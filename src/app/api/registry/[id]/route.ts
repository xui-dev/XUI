import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const componentDir = path.join(process.cwd(), "registry", "components", id);

    const metaPath = path.join(componentDir, "meta.json");
    const indexPath = path.join(componentDir, "index.tsx");

    // Check if component exists
    try {
      await fs.access(metaPath);
      await fs.access(indexPath);
    } catch {
      return NextResponse.json(
        { error: `Component '${id}' not found in registry.` },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const metaData = JSON.parse(await fs.readFile(metaPath, "utf-8"));
    const codeContent = await fs.readFile(indexPath, "utf-8");

    const payload = {
      ...metaData,
      files: [
        {
          name: metaData.files?.[0]?.name || `${id}.tsx`,
          content: codeContent,
          target: metaData.files?.[0]?.target || `components/xui/${id}.tsx`,
        },
      ],
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error fetching component" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
