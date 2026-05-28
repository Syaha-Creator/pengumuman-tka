"use client";

import { FormEvent, useState } from "react";
import LookupCard from "@/components/LookupCard";
import ResultCard from "@/components/ResultCard";
import type { Student } from "@/types/student";

export default function Home() {
  const [nisn, setNisn] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!nisn.trim()) return;

    setLoading(true);
    setError("");
    setStudent(null);

    try {
      const res = await fetch(
        `/api/data?nisn=${encodeURIComponent(nisn.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "NISN tidak ditemukan.");
      } else {
        setStudent(data.student);
      }
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudent(null);
    setError("");
    setNisn("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      {!student ? (
        <LookupCard
          nisn={nisn}
          loading={loading}
          error={error}
          onNisnChange={setNisn}
          onSubmit={handleSearch}
        />
      ) : (
        <ResultCard student={student} onReset={handleReset} />
      )}

      <p className="mt-6 text-white/50 text-xs">
        Pengumuman Nilai TKA &copy; {new Date().getFullYear()}
      </p>
    </main>
  );
}
