import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

// Uploaded files are written outside `public/` (see /api/admin/upload) so they
// are servable immediately, without needing a server restart to be picked up
// by Next's static public-asset resolver. This route reads them from disk on
// each request instead.
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");

// Random-UUID + known extension only — blocks path traversal and arbitrary reads.
const SAFE_FILENAME = /^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif)$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!SAFE_FILENAME.test(filename)) {
    return NextResponse.json({ error: "Không tìm thấy ảnh" }, { status: 404 });
  }

  const extension = filename.split(".").pop()!.toLowerCase();
  const contentType = CONTENT_TYPES[extension];

  try {
    const buffer = await readFile(path.join(UPLOAD_DIR, filename));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy ảnh" }, { status: 404 });
  }
}
