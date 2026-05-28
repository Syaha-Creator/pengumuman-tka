"use client";

import { FormEvent, useState } from "react";
import LookupCard from "@/components/LookupCard";
import ResultCard from "@/components/ResultCard";
import type { Student } from "@/types/student";

export default function Home() {
  const [nama, setNama] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !tanggalLahir.trim()) return;

    setLoading(true);
    setError("");
    setStudent(null);

    try {
      const params = new URLSearchParams({
        nama: nama.trim(),
        ttl: tanggalLahir.trim(),
      });
      const res = await fetch(`/api/data?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Data tidak ditemukan.");
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
    setNama("");
    setTanggalLahir("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      {!student ? (
        <LookupCard
          nama={nama}
          tanggalLahir={tanggalLahir}
          loading={loading}
          error={error}
          onNamaChange={setNama}
          onTanggalLahirChange={setTanggalLahir}
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
