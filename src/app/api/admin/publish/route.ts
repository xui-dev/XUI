import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      secretKey,
      id,
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      categoryLabel,
      categoryLabelAr,
      dependencies,
      code,
    } = body;

    // 1. Verify admin password/key
    const expectedSecret = process.env.ADMIN_SECRET_KEY || "xui-admin-2026";
    if (!secretKey || secretKey !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid admin secret key." },
        { status: 401 }
      );
    }

    if (!id || !title || !code) {
      return NextResponse.json(
        { error: "Missing required fields: id, title, and code are required." },
        { status: 400 }
      );
    }

    const cleanId = id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    const parsedDeps = Array.isArray(dependencies)
      ? dependencies
      : typeof dependencies === "string"
      ? dependencies.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    // 2. Write files locally into registry/components/[id]/
    const registryDir = path.join(process.cwd(), "registry");
    const componentDir = path.join(registryDir, "components", cleanId);
    await fs.mkdir(componentDir, { recursive: true });

    const metaData = {
      name: cleanId,
      title,
      titleAr: titleAr || title,
      description: description || "",
      descriptionAr: descriptionAr || description || "",
      category: category || "patterns",
      categoryLabel: categoryLabel || category || "Patterns",
      categoryLabelAr: categoryLabelAr || categoryLabel || "أنماط",
      author: "Aymen",
      authorHandle: "@aymen_dev",
      dependencies: parsedDeps,
      registryDependencies: [],
      files: [
        {
          name: `${cleanId}.tsx`,
          path: `registry/components/${cleanId}/index.tsx`,
          target: `components/xui/${cleanId}.tsx`,
        },
      ],
    };

    await fs.writeFile(
      path.join(componentDir, "index.tsx"),
      code,
      "utf-8"
    );
    await fs.writeFile(
      path.join(componentDir, "meta.json"),
      JSON.stringify(metaData, null, 2),
      "utf-8"
    );

    // 3. Update master registry.json
    const registryJsonPath = path.join(registryDir, "registry.json");
    let registryIndex = {
      $schema: "https://xui.dev/schema/registry.json",
      name: "xui",
      homepage: "https://xui.dev",
      repository: "https://github.com/xui-dev/XUI-components-",
      version: "1.0.0",
      items: [] as any[],
    };

    try {
      const existingData = await fs.readFile(registryJsonPath, "utf-8");
      registryIndex = JSON.parse(existingData);
    } catch {
      // Create new
    }

    // Replace or append
    const existingIndex = registryIndex.items.findIndex(
      (item) => item.name === cleanId
    );
    if (existingIndex >= 0) {
      registryIndex.items[existingIndex] = metaData;
    } else {
      registryIndex.items.push(metaData);
    }

    await fs.writeFile(
      registryJsonPath,
      JSON.stringify(registryIndex, null, 2),
      "utf-8"
    );

    // 4. If GitHub Token is provided, push directly to xui-dev/XUI-components-
    let githubStatus = "Saved locally in registry";
    const githubToken = process.env.GITHUB_TOKEN;

    if (githubToken) {
      try {
        const repoOwner = "xui-dev";
        const repoName = "XUI-components-";

        // Helper to commit a file to GitHub via REST API
        const commitFileToGitHub = async (filePath: string, fileContent: string) => {
          const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
          let sha: string | undefined;

          // Check if file exists to get sha
          const checkRes = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "XUI-Admin",
            },
          });

          if (checkRes.ok) {
            const fileInfo = await checkRes.json();
            sha = fileInfo.sha;
          }

          // Create or update file
          await fetch(apiUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "XUI-Admin",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `feat(registry): publish component ${cleanId}`,
              content: Buffer.from(fileContent).toString("base64"),
              ...(sha ? { sha } : {}),
            }),
          });
        };

        await commitFileToGitHub(`components/${cleanId}/index.tsx`, code);
        await commitFileToGitHub(
          `components/${cleanId}/meta.json`,
          JSON.stringify(metaData, null, 2)
        );
        await commitFileToGitHub(
          `registry.json`,
          JSON.stringify(registryIndex, null, 2)
        );

        githubStatus = `Committed & published to github.com/${repoOwner}/${repoName}`;
      } catch (err) {
        console.error("GitHub API commit error:", err);
        githubStatus = "Local save succeeded; GitHub API commit failed (check token)";
      }
    }

    // 5. Initialize row in Supabase
    try {
      const supabase = await createClient();
      if (supabase) {
        await supabase
          .from("components_stats")
          .insert({ id: cleanId, views: 1, likes: 0 })
          .select()
          .single();
      }
    } catch {
      // Safe fallback
    }

    return NextResponse.json({
      success: true,
      id: cleanId,
      githubStatus,
      message: `Component '${cleanId}' published successfully!`,
      cliCommand: `npx xui add ${cleanId}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
