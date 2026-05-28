import { NextRequest, NextResponse } from "next/server";
import { getStudents } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const nama = request.nextUrl.searchParams.get("nama")?.trim();
  const ttl = request.nextUrl.searchParams.get("ttl")?.trim();

  if (!nama || !ttl) {
    return NextResponse.json(
      { error: "Nama dan tanggal lahir diperlukan" },
      { status: 400 }
    );
  }

  try {
    const students = await getStudents();

    if (students.length === 0) {
      return NextResponse.json(
        { error: "Data nilai belum tersedia. Hubungi pihak sekolah." },
        { status: 404 }
      );
    }

    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

    const student = students.find(
      (s) =>
        normalize(s.Nama) === normalize(nama) &&
        normalize(s.TTL).includes(normalize(ttl))
    );

    if (!student) {
      return NextResponse.json(
        {
          error:
            "Data tidak ditemukan. Pastikan nama dan tanggal lahir sesuai dengan data sekolah.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (err) {
    console.error("Error fetching student data:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi." },
      { status: 500 }
    );
  }
}
