import { NextRequest, NextResponse } from "next/server";
import { getStudents } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const nisn = request.nextUrl.searchParams.get("nisn")?.trim();

  if (!nisn) {
    return NextResponse.json(
      { error: "Parameter NISN diperlukan" },
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

    const student = students.find(
      (s) => String(s.NISN).trim() === nisn
    );

    if (!student) {
      return NextResponse.json(
        { error: "NISN tidak ditemukan. Periksa kembali nomor NISN Anda." },
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
