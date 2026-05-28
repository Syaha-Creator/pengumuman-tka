"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Papa from "papaparse";

type Student = {
  NISN: string;
  Nama: string;
  TTL: string;
  "Nilai MTK": string | number;
  "Nilai Bahasa Indonesia": string | number;
};

type UploadStatus = "idle" | "uploading" | "success" | "error";

function AdminIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
      <path
        fillRule="evenodd"
        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    // Quick server-side validation by attempting a dummy upload
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, students: [] }),
    });
    const data = await res.json();

    if (res.status === 401) {
      setAuthError("Password salah. Coba lagi.");
    } else if (res.status === 400 || res.ok) {
      // 400 = password benar tapi data kosong → authenticated
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError(data.error || "Terjadi kesalahan server.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError("");
    setStudents([]);
    setUploadStatus("idle");
    setUploadMessage("");

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0) {
          setParseError("File CSV tidak dapat dibaca. Pastikan format benar.");
          return;
        }

        const rows = results.data;
        if (rows.length === 0) {
          setParseError("File CSV kosong atau tidak memiliki data.");
          return;
        }

        const required = ["NISN", "Nama", "TTL", "Nilai MTK", "Nilai Bahasa Indonesia"];
        const headers = Object.keys(rows[0]);
        const missing = required.filter(
          (col) => !headers.some((h) => h.trim() === col)
        );

        if (missing.length > 0) {
          setParseError(
            `Kolom yang diperlukan tidak ditemukan: ${missing.join(", ")}`
          );
          return;
        }

        setStudents(rows as unknown as Student[]);
      },
      error() {
        setParseError("Gagal membaca file. Pastikan file adalah CSV yang valid.");
      },
    });
  };

  const handleUpload = async () => {
    if (students.length === 0) return;
    setUploadStatus("uploading");
    setUploadMessage("");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, students }),
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadStatus("error");
        setUploadMessage(data.error || "Gagal menyimpan data.");
      } else {
        setUploadStatus("success");
        setUploadMessage(data.message || "Data berhasil disimpan.");
      }
    } catch {
      setUploadStatus("error");
      setUploadMessage("Terjadi kesalahan koneksi.");
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <AdminIcon />
            </div>
          </div>
          <h1 className="text-center text-xl font-bold text-gray-800 mb-1">
            Panel Admin
          </h1>
          <p className="text-center text-gray-400 text-sm mb-7">
            Masukkan password untuk melanjutkan
          </p>

          <form onSubmit={handleLogin}>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Password Admin
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-3 transition"
            />
            {authError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {authError}
              </div>
            )}
            <button
              type="submit"
              disabled={!password.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-indigo-200"
            >
              Masuk
            </button>
          </form>
        </div>
        <p className="mt-6 text-white/50 text-xs">Panel Admin &mdash; Akses Terbatas</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Upload Data Nilai</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Upload file CSV dengan data nilai siswa
            </p>
          </div>
          <button
            onClick={() => {
              setAuthenticated(false);
              setPassword("");
              setStudents([]);
              setFileName("");
              setUploadStatus("idle");
            }}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Keluar
          </button>
        </div>

        {/* Format info */}
        <div className="bg-indigo-50 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs font-semibold text-indigo-600 mb-1">
            Format kolom CSV yang diperlukan:
          </p>
          <code className="text-xs text-indigo-500 font-mono">
            NISN | Nama | TTL | Nilai MTK | Nilai Bahasa Indonesia
          </code>
          <p className="text-xs text-indigo-400 mt-1">
            Untuk file Excel, simpan dulu sebagai CSV (File &rarr; Save As &rarr; CSV)
          </p>
        </div>

        {/* File upload */}
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Pilih File CSV
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className={`border-2 border-dashed rounded-xl px-4 py-6 text-center transition ${
              fileName
                ? "border-indigo-300 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
            }`}
          >
            <svg
              className={`mx-auto w-8 h-8 mb-2 ${fileName ? "text-indigo-500" : "text-gray-300"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className={`text-sm ${fileName ? "text-indigo-600 font-medium" : "text-gray-400"}`}>
              {fileName || "Klik atau drag file CSV ke sini"}
            </p>
            {fileName && (
              <p className="text-xs text-indigo-400 mt-0.5">
                {students.length} baris data ditemukan
              </p>
            )}
          </div>
        </div>

        {/* Parse error */}
        {parseError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mt-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {parseError}
          </div>
        )}

        {/* Preview table */}
        {students.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">
                Preview Data ({students.length} siswa)
              </p>
              <span className="text-xs text-gray-400">
                Menampilkan {Math.min(5, students.length)} baris pertama
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-3 py-2 font-semibold">NISN</th>
                    <th className="px-3 py-2 font-semibold">Nama</th>
                    <th className="px-3 py-2 font-semibold">TTL</th>
                    <th className="px-3 py-2 font-semibold text-center">MTK</th>
                    <th className="px-3 py-2 font-semibold text-center">B. Indonesia</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((s, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-gray-600">{s.NISN}</td>
                      <td className="px-3 py-2 text-gray-800 font-medium">{s.Nama}</td>
                      <td className="px-3 py-2 text-gray-500">{s.TTL}</td>
                      <td className="px-3 py-2 text-center text-indigo-600 font-semibold">
                        {s["Nilai MTK"]}
                      </td>
                      <td className="px-3 py-2 text-center text-indigo-600 font-semibold">
                        {s["Nilai Bahasa Indonesia"]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload status */}
        {uploadStatus === "success" && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mt-4">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {uploadMessage}
          </div>
        )}
        {uploadStatus === "error" && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mt-4">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {uploadMessage}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleUpload}
          disabled={students.length === 0 || uploadStatus === "uploading"}
          className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-200"
        >
          {uploadStatus === "uploading" ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Simpan Data ({students.length} siswa)
            </>
          )}
        </button>
      </div>
      <p className="mt-6 text-white/50 text-xs">Panel Admin &mdash; Akses Terbatas</p>
    </main>
  );
}
