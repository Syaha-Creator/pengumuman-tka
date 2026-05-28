import { join } from "path";

export type Student = {
  NISN: string;
  Nama: string;
  TTL: string;
  "Nilai MTK": string | number;
  "Nilai Bahasa Indonesia": string | number;
};

const LOCAL_DATA_PATH = join(process.cwd(), "data", "students.json");

function isVercelBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function getStudents(): Promise<Student[]> {
  if (isVercelBlobConfigured()) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "students-data" });
    if (blobs.length === 0) return [];
    const latest = blobs.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    return res.json();
  } else {
    try {
      const { readFileSync } = await import("fs");
      const data = readFileSync(LOCAL_DATA_PATH, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

export async function saveStudents(students: Student[]): Promise<void> {
  if (isVercelBlobConfigured()) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "students-data" });
    if (blobs.length > 0) {
      await del(blobs.map((b) => b.url));
    }
    await put("students-data.json", JSON.stringify(students), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
  } else {
    const { mkdirSync, writeFileSync } = await import("fs");
    mkdirSync(join(process.cwd(), "data"), { recursive: true });
    writeFileSync(LOCAL_DATA_PATH, JSON.stringify(students, null, 2));
  }
}
