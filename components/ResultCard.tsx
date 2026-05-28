import type { Student } from "@/types/student";

type Props = {
  student: Student;
  onReset: () => void;
};

function getKeterangan(nilai: number): { label: string; color: string } {
  if (nilai >= 80) return { label: "Baik Sekali", color: "text-emerald-600 bg-emerald-50" };
  if (nilai >= 60) return { label: "Baik", color: "text-blue-600 bg-blue-50" };
  if (nilai >= 40) return { label: "Memadai", color: "text-amber-600 bg-amber-50" };
  return { label: "Kurang", color: "text-red-500 bg-red-50" };
}

function ScoreBox({
  subject,
  value,
}: {
  subject: string;
  value: string | number;
}) {
  const score = parseFloat(String(value));
  const ket = getKeterangan(score);
  return (
    <div className="flex-1 bg-white rounded-2xl border border-indigo-100 p-5 flex flex-col items-center gap-2 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">
        {subject}
      </p>
      <p className="text-4xl font-bold text-indigo-600">{value}</p>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ket.color}`}>
        {ket.label}
      </span>
    </div>
  );
}

export default function ResultCard({ student, onReset }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg mt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest">
            Hasil Nilai TKA 2025/2026
          </p>
          <span className="inline-flex items-center gap-1 bg-green-400/20 border border-green-300/30 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Ditemukan
          </span>
        </div>
        <h2 className="text-white text-2xl font-bold leading-tight">{student.Nama}</h2>
      </div>

      {/* Info section */}
      <div className="px-8 py-5 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">NISN</p>
            <p className="text-sm font-semibold text-gray-700 font-mono">{student.NISN}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Tempat, Tanggal Lahir</p>
            <p className="text-sm font-semibold text-gray-700">{student.TTL}</p>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="px-8 py-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Nilai</p>
        <div className="flex gap-4">
          <ScoreBox subject="Matematika" value={student["Nilai MTK"]} />
          <ScoreBox subject="Bahasa Indonesia" value={student["Nilai Bahasa Indonesia"]} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-6">
        <button
          onClick={onReset}
          className="w-full text-sm text-indigo-500 hover:text-indigo-700 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Cari Siswa Lain
        </button>
      </div>
    </div>
  );
}
