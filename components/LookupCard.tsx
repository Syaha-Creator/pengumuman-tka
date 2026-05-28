import { FormEvent } from "react";

function SchoolIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      className="w-9 h-9"
    >
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
  );
}

type Props = {
  nisn: string;
  loading: boolean;
  error: string;
  onNisnChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
};

export default function LookupCard({
  nisn,
  loading,
  error,
  onNisnChange,
  onSubmit,
}: Props) {
  const schoolName =
    process.env.NEXT_PUBLIC_SCHOOL_NAME || "SDN 03 Saradan";
  const schoolSubtitle =
    process.env.NEXT_PUBLIC_SCHOOL_SUBTITLE ||
    "Pengumuman Nilai TKA 2025/2026";

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <SchoolIcon />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-1">
        {schoolName}
      </h1>
      <p className="text-center text-gray-400 text-sm mb-7">{schoolSubtitle}</p>

      {/* Form */}
      <form onSubmit={onSubmit}>
        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
          Nomor Induk Siswa (NISN)
        </label>
        <input
          type="text"
          value={nisn}
          onChange={(e) => onNisnChange(e.target.value)}
          placeholder="Masukkan NISN Anda"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-3 transition"
        />

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !nisn.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-200"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Mencari...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              Lihat Nilai Saya
            </>
          )}
        </button>
      </form>
    </div>
  );
}
