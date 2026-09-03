# Trained Datasets for AI Chatbot

Subfolder ini dialokasikan untuk menyimpan file dataset CSV yang telah melalui proses training dan validasi untuk chatbot konsultasi kesehatan KlinikSehat.

## Format Spesifikasi CSV:
File CSV yang dimasukkan ke dalam folder ini harus memiliki header kolom standar:
- `id`: Identifier unik baris data (contoh: `CB-0001`)
- `intent`: Kategori niat pengguna (contoh: `symptom_inquiry`, `medication_guidance`, `triage_request`)
- `user_query`: Pertanyaan atau input gejala pasien
- `response_id`: Respon yang telah divalidasi oleh dokter/ahli medis
- `specialization_tag`: Tag spesialisasi terkait (contoh: `UMUM`, `PENYAKIT_DALAM`, `ANAK`, `KULIT`)
- `risk_level`: Tingkat risiko (`LOW`, `MEDIUM`, `HIGH`)
- `created_at`: Waktu pencatatan training

> **Catatan:** Jangan mengunggah data identitas pribadi pasien (PII) ke dalam dataset ini. Semua data training wajib melalui proses anonimisasi.
