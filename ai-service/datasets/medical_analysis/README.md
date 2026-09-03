# Trained Datasets for Medical Analysis

Subfolder ini digunakan untuk menampung file CSV dataset terlatih untuk analisis medis tingkat lanjut, triase klinis, dan ekstraksi parameter tanda vital.

## Format Spesifikasi CSV:
File CSV yang dimasukkan ke dalam folder ini memiliki skema kolom:
- `case_id`: ID studi kasus klinis teranotasi (contoh: `MED-0001`)
- `chief_complaint`: Keluhan utama pasien
- `symptoms_parsed`: Gejala klinis terstruktur (format JSON atau semicolon-separated)
- `vital_signs_ref`: Batas acuan tanda vital terkait (tekanan darah, suhu, HR)
- `clinical_assessment`: Hasil diagnosis banding / asesmen klinis
- `recommended_action`: Tindakan medis yang disarankan (contoh: `RAWAT_JALAN`, `KONSUL_SPESIALIS`, `IGD_SEGERA`)
- `icd10_code`: Kode acuan ICD-10 (contoh: `J06.9`, `K29.7`, `I10`)
- `accuracy_score`: Skor akurasi model validasi (0.00 - 1.00)

> **Catatan Keamanan:** Semua dataset harus memenuhi standar etika medis dan regulasi kerahasiaan data kesehatan.
