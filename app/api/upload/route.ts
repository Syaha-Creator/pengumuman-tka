import { NextRequest, NextResponse } from "next/server";
import { saveStudents, Student } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { password, students } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Password salah." },
        { status: 401 }
      );
    }

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: "Data siswa tidak valid atau kosong." },
        { status: 400 }
      );
    }

    const cleaned: Student[] = students.map((s) => ({
      NISN: String(s.NISN ?? s.nisn ?? "").trim(),
      Nama: String(s.Nama ?? s.nama ?? "").trim(),
      TTL: String(s.TTL ?? s.ttl ?? "").trim(),
      "Nilai MTK": s["Nilai MTK"] ?? s["nilai_mtk"] ?? s["mtk"] ?? "",
      "Nilai Bahasa Indonesia":
        s["Nilai Bahasa Indonesia"] ??
        s["nilai_bahasa_indonesia"] ??
        s["b_indonesia"] ??
        "",
    }));

    await saveStudents(cleaned);

    return NextResponse.json({
      success: true,
      count: cleaned.length,
      message: `${cleaned.length} data siswa berhasil disimpan.`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat menyimpan data." },
      { status: 500 }
    );
  }
}
