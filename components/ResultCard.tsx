import { Student } from "@/lib/storage";

type Props = {
  student: Student;
  onReset: () => void;
};

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`font-semibold text-right max-w-[60%] ${
          highlight ? "text-indigo-600 text-lg" : "text-gray-800 text-sm"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ResultCard({ student, onReset }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mt-4 w-full max-w-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-indigo-600">Hasil Nilai TKA</h2>
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Ditemukan
        </span>
      </div>

      <div className="mb-5">
        <Row label="NISN" value={String(student.NISN)} />
        <Row label="Nama" value={student.Nama} />
        <Row label="Tempat, Tanggal Lahir" value={student.TTL} />
      </div>

      <div className="bg-indigo-50 rounded-xl p-4 mb-5">
        <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-3">
          Nilai
        </p>
        <Row
          label="Matematika"
          value={String(student["Nilai MTK"])}
          highlight
        />
        <Row
          label="Bahasa Indonesia"
          value={String(student["Nilai Bahasa Indonesia"])}
          highlight
        />
      </div>

      <button
        onClick={onReset}
        className="w-full text-sm text-indigo-500 hover:text-indigo-700 font-medium py-2 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        ← Cari NISN Lain
      </button>
    </div>
  );
}
