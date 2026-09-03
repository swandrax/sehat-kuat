"use client";

import { useState, useRef } from "react";
import {
  ArrowLeft,
  ChevronRight,
  User,
  ShieldCheck,
  X,
  LogOut,
  Lock,
  Key,
  Users,
  CreditCard,
  Info,
  FileText,
  PhoneCall,
  Activity,
  HeartPulse,
  Printer,
  Download,
  Upload,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Plus,
  QrCode,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { ZavoraLogo } from "@/components/common/ZavoraLogo";
import { toast } from "sonner";

interface InsurancePolicyDetail {
  provider: string;
  policyCode: string;
  cardNumber: string;
  holderName: string;
  status: string;
  annualLimit: string;
  remainingLimit: string;
  roomLimit: string;
  coveragePct: string;
  validUntil: string;
  network: string[];
}

export default function PatientProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [showInsuranceBanner, setShowInsuranceBanner] = useState(true);

  // Active Modals State
  const [activeModal, setActiveModal] = useState<
    | null
    | "PROFILE_DATA"
    | "FAMILY_MEMBERS"
    | "CHANGE_PASSWORD"
    | "TRANSACTION_PIN"
    | "INSURANCE_DETAIL"
    | "CLAIM_PDF"
    | "APP_INFO"
    | "PRIVACY_POLICY"
    | "TERMS_SERVICE"
    | "CONTACT_HELP"
  >(null);

  // Patient Profile Data State
  const [patientData, setPatientData] = useState({
    name: user?.name || "Swandaru Tirta Sandhika",
    phone: user?.phone || "0877-8238-0077",
    email: user?.email || "pasien@zavoralife.id",
    nik: "3171051505900003",
    birthDate: "15 Mei 1990",
    bloodType: "O+",
    heightCm: 174,
    weightKg: 68,
    allergies: "Penisilin, Makanan Laut (Kepiting)",
    emergencyContactName: "Dewi Lestari (Istri)",
    emergencyContactPhone: "0812-3333-4444",
  });

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: "Dewi Lestari", relation: "Istri", bpjs: "0001889201992" },
    { id: 2, name: "Rayyan Sandhika", relation: "Anak", bpjs: "0002998319201" },
  ]);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newFamilyRelation, setNewFamilyRelation] = useState("Anak");

  // Insurance State
  const insurancePolicies: Record<string, InsurancePolicyDetail> = {
    zavora: {
      provider: "Zavora Life Protection Corporate",
      policyCode: "ZVR-CORP-88912-ID",
      cardNumber: "9920-4411-8891-0012",
      holderName: patientData.name,
      status: "CASHLESS AKTIF",
      annualLimit: "Rp 250.000.000",
      remainingLimit: "Rp 238.500.000",
      roomLimit: "Rp 2.000.000 / hari (VIP)",
      coveragePct: "100% Cashless di Jaringan Faskes",
      validUntil: "31 Des 2026",
      network: ["Klinik Zavora Life", "RS Citra Harapan", "RS Ananda", "RSUPN RSCM"],
    },
    admedika: {
      provider: "Admedika Healthcare",
      policyCode: "ADM-HLTH-99412-JKT",
      cardNumber: "0188-5522-3399-4411",
      holderName: patientData.name,
      status: "CASHLESS AKTIF",
      annualLimit: "Rp 150.000.000",
      remainingLimit: "Rp 142.000.000",
      roomLimit: "Rp 1.500.000 / hari (Kelas 1)",
      coveragePct: "90% Cashless",
      validUntil: "15 Okt 2026",
      network: ["Seluruh RS & Apotek Rekanan Admedika Indonesia"],
    },
    fullerton: {
      provider: "Fullerton Health Indonesia",
      policyCode: "FLR-2026-77890-INA",
      cardNumber: "4488-1122-9900-5566",
      holderName: patientData.name,
      status: "CASHLESS AKTIF",
      annualLimit: "Rp 180.000.000",
      remainingLimit: "Rp 175.000.000",
      roomLimit: "Rp 1.750.000 / hari (VIP)",
      coveragePct: "95% Cashless",
      validUntil: "20 Nov 2026",
      network: ["Jaringan Fullerton Health & Laboratorium Prodia"],
    },
  };

  const [selectedInsuranceKey, setSelectedInsuranceKey] = useState<string>("zavora");
  const selectedPolicy = insurancePolicies[selectedInsuranceKey] || insurancePolicies.zavora;

  // Autra-AI Claims Evaluation State
  const [autraAiEvaluating, setAutraAiEvaluating] = useState(false);
  const [autraAiVerdict, setAutraAiVerdict] = useState<{
    status: string;
    preAuthCode: string;
    verdict: string;
    timestamp: string;
  } | null>({
    status: "PRE_APPROVED_CASHLESS",
    preAuthCode: "AUTRA-PREAUTH-88912-OK",
    verdict: "Klaim Rawat Jalan & Resep Obat Disetujui 100% Cashless oleh Autra-AI Agentic Policy Engine.",
    timestamp: "Hari ini, 14:15 WIB",
  });

  // Password & PIN State
  const [passwordState, setPasswordState] = useState({ old: "", newPass: "", confirm: "" });
  const [pinState, setPinState] = useState("123456");

  // File Upload for Insurance Claim
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles((prev) => [...prev, file.name]);
      toast.success(`Berkas "${file.name}" berhasil diunggah untuk verifikasi Autra-AI!`);
    }
  };

  // Run Autra-AI Claim Evaluation
  const runAutraAiEvaluation = () => {
    setAutraAiEvaluating(true);
    toast.info("Autra-AI sedang mengevaluasi polis klaim asuransi...");

    setTimeout(() => {
      setAutraAiEvaluating(false);
      const preAuth = `AUTRA-PREAUTH-${Math.floor(10000 + Math.random() * 90000)}-OK`;
      setAutraAiVerdict({
        status: "PRE_APPROVED_CASHLESS",
        preAuthCode: preAuth,
        verdict: `Plafon asuransi ${selectedPolicy.provider} valid. Tindakan medis dan resep obat dicover penuh sesuai Polis Kode ${selectedPolicy.policyCode}.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      });
      toast.success("Evaluasi Autra-AI Selesai: Klaim Layak Cashless 100%!");
    }, 1200);
  };

  // Print PDF Claim Action
  const handlePrintPDF = () => {
    toast.info("Menyiapkan dokumen klaim PDF...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 select-none print:max-w-none print:m-0 print:p-0">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Pengaturan Profil</h1>
            <p className="text-xs text-slate-500">Kelola data medis, klaim asuransi, dan preferensi akun</p>
          </div>
        </div>

        <div className="hidden sm:block">
          <ZavoraLogo size="sm" showTagline={false} />
        </div>
      </div>

      {/* User Info Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 print:hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 border-2 border-emerald-400 text-white shadow-md flex items-center justify-center font-black text-2xl shrink-0">
          {patientData.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
              {patientData.name}
            </h2>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{patientData.phone}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
              Gold Member • Gol. Darah {patientData.bloodType}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 print:hidden">
        {/* Section 1: Akun & Medis */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Akun & Data Medis
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <ProfileMenuItem
              icon={<User className="w-4 h-4 text-emerald-600" />}
              label="Profil & Data Medis"
              sublabel="NIK, Golongan Darah, Alergi, Kontak Darurat"
              onClick={() => setActiveModal("PROFILE_DATA")}
            />
            <ProfileMenuItem
              icon={<Users className="w-4 h-4 text-blue-600" />}
              label="Anggota Keluarga Terdaftar"
              sublabel={`${familyMembers.length} anggota keluarga aktif`}
              onClick={() => setActiveModal("FAMILY_MEMBERS")}
            />
            <ProfileMenuItem
              icon={<Lock className="w-4 h-4 text-amber-600" />}
              label="Ubah Kata Sandi"
              sublabel="Perbarui kata sandi akun Zavora Life"
              onClick={() => setActiveModal("CHANGE_PASSWORD")}
            />
            <ProfileMenuItem
              icon={<Key className="w-4 h-4 text-purple-600" />}
              label="PIN Transaksi Zavora Life"
              sublabel="Keamanan 6 digit untuk verifikasi resep & klaim"
              onClick={() => setActiveModal("TRANSACTION_PIN")}
            />
          </div>
        </div>

        {/* Section 2: Sambungkan Asuransi & Autra-AI Claim Policies */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Klaim Asuransi Mitra
            </h3>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Autra-AI Agentic Policy
            </span>
          </div>

          {showInsuranceBanner && (
            <div className="bg-emerald-700 text-white p-4 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="font-bold leading-snug">
                  Sambungkan kartu asuransi kesehatan Anda untuk fasilitas cashless di seluruh jaringan Zavora Life.
                </p>
                <p className="text-[11px] text-emerald-100">
                  Ditenagai oleh <span className="font-bold text-white">Autra-AI</span> untuk pengecekan kelayakan klaim & ekspor PDF instan.
                </p>
              </div>
              <button
                onClick={() => setShowInsuranceBanner(false)}
                className="text-white/80 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <ProfileMenuItem
              icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              label="Zavora Life Protection Corporate"
              sublabel="Kode: ZVR-CORP-88912-ID • Plafon Rp 250.000.000"
              badge="Cashless"
              onClick={() => {
                setSelectedInsuranceKey("zavora");
                setActiveModal("INSURANCE_DETAIL");
              }}
            />
            <ProfileMenuItem
              icon={<ShieldCheck className="w-4 h-4 text-teal-600" />}
              label="Admedika Healthcare"
              sublabel="Kode: ADM-HLTH-99412-JKT • Rekanan Nasional"
              badge="Cashless"
              onClick={() => {
                setSelectedInsuranceKey("admedika");
                setActiveModal("INSURANCE_DETAIL");
              }}
            />
            <ProfileMenuItem
              icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
              label="Fullerton Health Indonesia"
              sublabel="Kode: FLR-2026-77890-INA • Plafon Rp 180.000.000"
              badge="Cashless"
              onClick={() => {
                setSelectedInsuranceKey("fullerton");
                setActiveModal("INSURANCE_DETAIL");
              }}
            />
          </div>
        </div>

        {/* Section 3: Informasi Aplikasi */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Aplikasi Zavora Life
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <ProfileMenuItem
              icon={<Info className="w-4 h-4 text-slate-500" />}
              label="Tentang Zavora Life"
              sublabel="Visi kesehatan, sertifikasi medis, dan ekosistem"
              onClick={() => setActiveModal("APP_INFO")}
            />
            <ProfileMenuItem
              icon={<Lock className="w-4 h-4 text-slate-500" />}
              label="Kebijakan Privasi Rekam Medis"
              sublabel="Kepatuhan UU PDP & Kemenkes SatuSehat"
              onClick={() => setActiveModal("PRIVACY_POLICY")}
            />
            <ProfileMenuItem
              icon={<FileText className="w-4 h-4 text-slate-500" />}
              label="Syarat & Ketentuan Layanan"
              sublabel="Ketentuan konsultasi, telemedisin, dan klaim"
              onClick={() => setActiveModal("TERMS_SERVICE")}
            />
            <ProfileMenuItem
              icon={<PhoneCall className="w-4 h-4 text-slate-500" />}
              label="Hubungi Bantuan Pasien"
              sublabel="Hotline 24 jam & layanan konseling pasien"
              onClick={() => setActiveModal("CONTACT_HELP")}
            />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 font-bold p-4 rounded-2xl flex items-center justify-between transition shadow-xs"
        >
          <span className="text-xs">Keluar dari Akun</span>
          <LogOut className="w-4 h-4 text-rose-500" />
        </button>

        {/* Footer Version */}
        <div className="text-center pt-2 text-[10px] text-slate-400 font-mono">
          Zavora Life Platform • v1.2.0 • Autra-AI Agentic Policies Integrated
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: PROFIL & DATA MEDIS
          ========================================================================= */}
      {activeModal === "PROFILE_DATA" && (
        <ModalWrapper title="Profil & Data Medis Pasien" onClose={() => setActiveModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Data medis pasien berhasil diperbarui!");
              setActiveModal(null);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={patientData.name}
                onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={patientData.phone}
                  onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">NIK (KTP)</label>
                <input
                  type="text"
                  value={patientData.nik}
                  onChange={(e) => setPatientData({ ...patientData, nik: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium font-mono"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Golongan Darah</label>
                <select
                  value={patientData.bloodType}
                  onChange={(e) => setPatientData({ ...patientData, bloodType: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold"
                >
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tinggi (cm)</label>
                <input
                  type="number"
                  value={patientData.heightCm}
                  onChange={(e) => setPatientData({ ...patientData, heightCm: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Berat (kg)</label>
                <input
                  type="number"
                  value={patientData.weightKg}
                  onChange={(e) => setPatientData({ ...patientData, weightKg: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Riwayat Alergi Obat / Makanan</label>
              <input
                type="text"
                value={patientData.allergies}
                onChange={(e) => setPatientData({ ...patientData, allergies: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kontak Darurat (Nama & No HP)</label>
              <input
                type="text"
                value={`${patientData.emergencyContactName} • ${patientData.emergencyContactPhone}`}
                onChange={(e) => setPatientData({ ...patientData, emergencyContactName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs mt-2"
            >
              Simpan Perubahan Data Medis
            </button>
          </form>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 2: ANGGOTA KELUARGA TERDAFTAR
          ========================================================================= */}
      {activeModal === "FAMILY_MEMBERS" && (
        <ModalWrapper title="Anggota Keluarga Terdaftar" onClose={() => setActiveModal(null)}>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              {familyMembers.map((fam) => (
                <div
                  key={fam.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{fam.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Hubungan: {fam.relation} • No Kartu: {fam.bpjs}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                    Tercakup Asuransi
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">Tambah Anggota Keluarga</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                />
                <select
                  value={newFamilyRelation}
                  onChange={(e) => setNewFamilyRelation(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold"
                >
                  <option value="Pasangan">Pasangan</option>
                  <option value="Anak">Anak</option>
                  <option value="Orang Tua">Orang Tua</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!newFamilyName.trim()) return;
                    setFamilyMembers([
                      ...familyMembers,
                      {
                        id: Date.now(),
                        name: newFamilyName,
                        relation: newFamilyRelation,
                        bpjs: `000${Math.floor(100000000 + Math.random() * 900000000)}`,
                      },
                    ]);
                    setNewFamilyName("");
                    toast.success("Anggota keluarga baru berhasil didaftarkan!");
                  }}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 3: UBAH KATA SANDI
          ========================================================================= */}
      {activeModal === "CHANGE_PASSWORD" && (
        <ModalWrapper title="Ubah Kata Sandi Akun" onClose={() => setActiveModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordState.newPass !== passwordState.confirm) {
                toast.error("Konfirmasi kata sandi tidak cocok!");
                return;
              }
              toast.success("Kata sandi berhasil diperbarui!");
              setActiveModal(null);
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kata Sandi Saat Ini</label>
              <input
                type="password"
                placeholder="Masukkan kata sandi lama"
                value={passwordState.old}
                onChange={(e) => setPasswordState({ ...passwordState, old: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={passwordState.newPass}
                onChange={(e) => setPasswordState({ ...passwordState, newPass: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                placeholder="Ulangi kata sandi baru"
                value={passwordState.confirm}
                onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs mt-2"
            >
              Simpan Kata Sandi Baru
            </button>
          </form>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 4: PIN TRANSAKSI ZAVORA LIFE
          ========================================================================= */}
      {activeModal === "TRANSACTION_PIN" && (
        <ModalWrapper title="PIN Transaksi & Klaim Cashless" onClose={() => setActiveModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("PIN 6 digit Zavora Life aktif & tersimpan aman!");
              setActiveModal(null);
            }}
            className="space-y-4 text-xs text-center"
          >
            <p className="text-slate-500">
              PIN ini digunakan untuk otorisasi klaim asuransi cashless dan pengambilan resep obat di apotek.
            </p>
            <div className="flex justify-center">
              <input
                type="password"
                maxLength={6}
                value={pinState}
                onChange={(e) => setPinState(e.target.value)}
                className="w-48 text-center tracking-[1em] text-xl font-mono font-black py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs"
            >
              Simpan PIN Transaksi
            </button>
          </form>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 5: DETAIL KLAIM ASURANSI & AUTRA-AI AGENTIC POLICIES
          ========================================================================= */}
      {activeModal === "INSURANCE_DETAIL" && (
        <ModalWrapper
          title={`Detail Polis & Klaim: ${selectedPolicy.provider}`}
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4 text-xs">
            {/* Policy Card Summary */}
            <div className="p-4 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
                  Kartu Asuransi Kesehatan Cashless
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold text-[9px] border border-white/30">
                  {selectedPolicy.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">{selectedPolicy.provider}</p>
                <p className="text-base font-mono font-bold tracking-widest mt-1">
                  {selectedPolicy.cardNumber}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px]">
                <div>
                  <span className="text-emerald-200 block">Pemegang Polis</span>
                  <span className="font-bold">{selectedPolicy.holderName}</span>
                </div>
                <div>
                  <span className="text-emerald-200 block">Kode Asuransi</span>
                  <span className="font-bold font-mono">{selectedPolicy.policyCode}</span>
                </div>
                <div>
                  <span className="text-emerald-200 block">Berlaku Hingga</span>
                  <span className="font-bold">{selectedPolicy.validUntil}</span>
                </div>
              </div>
            </div>

            {/* Coverage Limits Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 font-semibold block">Sisa Plafon Tahunan</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                  {selectedPolicy.remainingLimit}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">dari {selectedPolicy.annualLimit}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 font-semibold block">Batas Kamar Rawat Inap</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedPolicy.roomLimit}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Fasilitas Rawat Inap VIP</span>
              </div>
            </div>

            {/* Autra-AI Agentic Policy Engine Section */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                  <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Autra-AI Agentic Policy Evaluation</span>
                </div>
                <span className="text-[9px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Policy Auto-Audit
                </span>
              </div>

              {autraAiVerdict && (
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Pre-Approval Aktif
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {autraAiVerdict.preAuthCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {autraAiVerdict.verdict}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={runAutraAiEvaluation}
                disabled={autraAiEvaluating}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                {autraAiEvaluating ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Evaluasi Kelayakan Klaim dengan Autra-AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Document Upload for Claims */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Unggah Berkas / Bukti Kwitansi Medis
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Pilih File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </div>

              {uploadedFiles.length > 0 ? (
                <div className="space-y-1">
                  {uploadedFiles.map((fn, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]"
                    >
                      <span className="truncate max-w-[200px] text-slate-700 dark:text-slate-300">{fn}</span>
                      <span className="text-emerald-600 font-bold">Terverifikasi Autra-AI</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <p className="text-[11px] text-slate-400">
                    Klik untuk upload kwitansi RS / lembar e-resep (JPG, PNG, PDF)
                  </p>
                </div>
              )}
            </div>

            {/* Actions: Export to PDF */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModal("CLAIM_PDF")}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Export ke Dokumen Klaim (PDF)</span>
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 6: EXPORT DOKUMEN KLAIM ASURANSI RESMI (PDF VIEW & CETAK)
          ========================================================================= */}
      {activeModal === "CLAIM_PDF" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto print:p-0 print:bg-white">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none">
            {/* Document Action Bar (Hidden on print) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Dokumen Klaim Asuransi Resmi Zavora Life</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak / Simpan PDF
                </button>
                <button
                  onClick={() => setActiveModal("INSURANCE_DETAIL")}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Printable Statement Sheet (A4 Format) */}
            <div className="space-y-5 text-xs text-slate-800 print:text-black">
              {/* Header Letterhead */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-600">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ZavoraLogo size="sm" />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Jaringan Layanan Kesehatan Terpadu • Lisensi Kemenkes RI No. 881/YANKES/2024
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Jl. Jenderal Sudirman No. 45, Jakarta Pusat • Telp: (021) 555-1234
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Kode Klaim Medis:</span>
                  <p className="font-mono font-black text-sm text-emerald-700">
                    CLM-{Date.now().toString().slice(-8)}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">
                    Tgl: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  SURAT RESUME MEDIS & PERNYATAAN KLAIM ASURANSI CASHLESS
                </h2>
                <p className="text-[10px] text-slate-500">
                  Diterbitkan secara sah untuk pengajuan reimbursement dan fasilitas klaim penjaminan
                </p>
              </div>

              {/* Patient & Insurance Code Grid */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                <div className="space-y-1">
                  <p className="font-bold text-slate-500 uppercase text-[9px]">Identitas Pasien</p>
                  <p><span className="font-semibold">Nama:</span> {patientData.name}</p>
                  <p><span className="font-semibold">NIK:</span> {patientData.nik}</p>
                  <p><span className="font-semibold">No Rekam Medis:</span> RM-2026-008912</p>
                  <p><span className="font-semibold">Golongan Darah:</span> {patientData.bloodType}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-500 uppercase text-[9px]">Informasi Penjamin Asuransi</p>
                  <p><span className="font-semibold">Mitra Penjamin:</span> {selectedPolicy.provider}</p>
                  <p><span className="font-semibold">Kode Polis (Insurance Code):</span> <span className="font-mono font-bold text-emerald-700">{selectedPolicy.policyCode}</span></p>
                  <p><span className="font-semibold">Nomor Kartu:</span> {selectedPolicy.cardNumber}</p>
                  <p><span className="font-semibold">Status Klaim:</span> Cashless Pre-Approved 100%</p>
                </div>
              </div>

              {/* Diagnosis & Clinical Resume */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 border-b pb-1">Resume Klinis & Kode Diagnosis ICD-10</h4>
                <div className="grid grid-cols-3 gap-2 py-1 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Diagnosis Utama:</span>
                    <span className="font-bold">E11.9 - Diabetes Melitus Tipe 2</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Dokter Spesialis:</span>
                    <span className="font-bold">dr. Andi Setiawan, Sp.PD</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">No STR / SIP:</span>
                    <span className="font-mono font-bold">STR-3171-8892-2024</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  Pasien menjalani pemeriksaan berkala kadar gula darah dan pemantauan tanda vital. Terapi farmasi diberikan dengan kombinasi Metformin dan vitamin neurotropik. Kondisi klinis stabil, layak beraktivitas.
                </p>
              </div>

              {/* Itemized Billing Summary */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 border-b pb-1">Rincian Tindakan & e-Resep Medis</h4>
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-1">Uraian Layanan</th>
                      <th className="py-1">Qty</th>
                      <th className="py-1 text-right">Biaya (IDR)</th>
                      <th className="py-1 text-right">Ditanggung Asuransi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-1">Konsultasi Dokter Spesialis Penyakit Dalam</td>
                      <td className="py-1">1</td>
                      <td className="py-1 text-right">Rp 350.000</td>
                      <td className="py-1 text-right text-emerald-700 font-bold">Rp 350.000 (100%)</td>
                    </tr>
                    <tr>
                      <td className="py-1">Pemeriksaan Glukosa Darah Sewaktu (GDS)</td>
                      <td className="py-1">1</td>
                      <td className="py-1 text-right">Rp 95.000</td>
                      <td className="py-1 text-right text-emerald-700 font-bold">Rp 95.000 (100%)</td>
                    </tr>
                    <tr>
                      <td className="py-1">Metformin 500mg (28 tablet)</td>
                      <td className="py-1">1 box</td>
                      <td className="py-1 text-right">Rp 65.000</td>
                      <td className="py-1 text-right text-emerald-700 font-bold">Rp 65.000 (100%)</td>
                    </tr>
                    <tr className="border-t-2 border-slate-300 font-bold">
                      <td colSpan={2} className="py-1.5">Total Biaya & Hak Klaim Cashless</td>
                      <td className="py-1.5 text-right">Rp 510.000</td>
                      <td className="py-1.5 text-right text-emerald-700 font-black">Rp 510.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Autra-AI Pre-Approval Badge & Validation Signatures */}
              <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-[10px]">
                {/* Autra-AI Stamp */}
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center gap-2">
                  <QrCode className="w-9 h-9 text-emerald-700" />
                  <div>
                    <span className="font-bold text-emerald-900 block">DIVERIFIKASI OLEH AUTRA-AI</span>
                    <span className="font-mono text-emerald-700 block">Kode Pre-Auth: {autraAiVerdict?.preAuthCode}</span>
                    <span className="text-[9px] text-slate-500">Klausul Polis Terpenuhi 100%</span>
                  </div>
                </div>

                {/* Hospital Stamp & Doctor Signature */}
                <div className="text-center space-y-1">
                  <p className="text-slate-500">Dokter Penanggung Jawab,</p>
                  <div className="h-9 flex items-center justify-center font-serif italic text-sm text-slate-800 font-bold">
                    (dr. Andi Setiawan, Sp.PD)
                  </div>
                  <p className="font-mono text-[9px] text-slate-400">SIP: 503/442-Dinkes/2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 7: TENTANG ZAVORA LIFE
          ========================================================================= */}
      {activeModal === "APP_INFO" && (
        <ModalWrapper title="Tentang Zavora Life" onClose={() => setActiveModal(null)}>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="text-center pb-2">
              <ZavoraLogo size="md" />
            </div>
            <p>
              <strong>Zavora Life</strong> adalah ekosistem layanan kesehatan digital terintegrasi yang menghadirkan konsultasi dokter spesialis, rekam medis terstandarisasi, penjaminan klaim asuransi cashless, dan pemantauan tanda vital secara real-time.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
              <p><strong>Sertifikasi:</strong> ISO 27001 (Keamanan Informasi Medis)</p>
              <p><strong>Integrasi Nasional:</strong> Kemenkes SatuSehat Platform</p>
              <p><strong>AI Engine:</strong> Autra-AI Agentic Policy & Clinical Safety</p>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 8: KEBIJAKAN PRIVASI REKAM MEDIS
          ========================================================================= */}
      {activeModal === "PRIVACY_POLICY" && (
        <ModalWrapper title="Kebijakan Privasi Rekam Medis" onClose={() => setActiveModal(null)}>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-96 overflow-y-auto">
            <p>
              Zavora Life menjunjung tinggi kerahasiaan dan integritas data medis pasien sesuai dengan <strong>UU Pelindungan Data Pribadi (UU PDP No. 27 Tahun 2022)</strong> dan <strong>Permenkes No. 24 Tahun 2022 tentang Rekam Medis</strong>.
            </p>
            <h4 className="font-bold text-slate-900 dark:text-white">1. Penggunaan Data Medis</h4>
            <p>
              Seluruh riwayat konsultasi, hasil laboratorium, dan e-resep hanya dapat diakses oleh dokter yang bertugas dengan izin eksplisit pasien.
            </p>
            <h4 className="font-bold text-slate-900 dark:text-white">2. Keamanan & Enkripsi</h4>
            <p>
              Data klinis dienkripsi menggunakan standar AES-256 dan protokol TLS 1.3 pada saat transmisi maupun saat tersimpan di database.
            </p>
          </div>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 9: SYARAT & KETENTUAN LAYANAN
          ========================================================================= */}
      {activeModal === "TERMS_SERVICE" && (
        <ModalWrapper title="Syarat & Ketentuan Layanan" onClose={() => setActiveModal(null)}>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-96 overflow-y-auto">
            <p>
              Selamat datang di Zavora Life. Dengan menggunakan platform ini, Anda menyetujui syarat dan ketentuan berikut:
            </p>
            <h4 className="font-bold text-slate-900 dark:text-white">1. Konsultasi & Telemedisin</h4>
            <p>
              Konsultasi medis online bersifat skrining awal dan pemantauan klinis. Untuk keadaan darurat fatal, pasien diwajibkan segera mendatangi IGD rumah sakit terdekat.
            </p>
            <h4 className="font-bold text-slate-900 dark:text-white">2. Fasilitas Klaim Asuransi</h4>
            <p>
              Otorisasi klaim cashless dievaluasi berdasarkan polis aktif mitra asuransi melalui sistem pre-approval Autra-AI.
            </p>
          </div>
        </ModalWrapper>
      )}

      {/* =========================================================================
          MODAL 10: HUBUNGI BANTUAN PASIEN
          ========================================================================= */}
      {activeModal === "CONTACT_HELP" && (
        <ModalWrapper title="Pusat Bantuan & Layanan Pasien" onClose={() => setActiveModal(null)}>
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Tim Customer Care dan Konseling Pasien Zavora Life siap melayani Anda 24 jam sehari, 7 hari seminggu.
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/62811111111"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between hover:bg-emerald-100 transition"
              >
                <span>WhatsApp Hotline 24 Jam</span>
                <span>+62 811-1111-11</span>
              </a>
              <a
                href="mailto:support@zavoralife.id"
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-between hover:bg-slate-100 transition"
              >
                <span>Email Resmi Pasien</span>
                <span>support@zavoralife.id</span>
              </a>
            </div>
          </div>
        </ModalWrapper>
      )}

      <BottomNav />
    </div>
  );
}

function ProfileMenuItem({
  icon,
  label,
  sublabel,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">{icon}</div>
        <div className="min-w-0">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate leading-tight">
            {label}
          </span>
          {sublabel && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
            {badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}

function ModalWrapper({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
