import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    if (!supabase) {
      // Fallback default
      return NextResponse.json({ id, views: 28000, likes: 1830 });
    }

    const { data, error } = await supabase
      .from("components_stats")
      .select("views, likes")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ id, views: 28000, likes: 1830 });
    }

    return NextResponse.json({ id, views: data.views, likes: data.likes });
  } catch {
    return NextResponse.json({ id, views: 28000, likes: 1830 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action"); // "view" | "like" | "unlike"

  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ success: true, message: "Local mock update" });
    }

    if (action === "view") {
      const { data, error } = await supabase.rpc("increment_component_views", {
        component_id: id,
      });
      return NextResponse.json({ success: !error, views: data });
    }

    if (action === "like" || action === "unlike") {
      const isLike = action === "like";
      const { data, error } = await supabase.rpc("toggle_component_like", {
        component_id: id,
        is_like: isLike,
      });
      return NextResponse.json({ success: !error, likes: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: true, message: "Fallback" });
  }
}
