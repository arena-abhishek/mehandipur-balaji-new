import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;

  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).substring(1);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": `image/${ext}`,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
}
