import { Injectable, MessageEvent } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KnowledgeService } from './knowledge.service';
import { Observable } from 'rxjs';

export interface LogAIRequestDto {
  userId?: string;
  sessionId?: string;
  provider?: string;
  model: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  status?: string;
}

@Injectable()
export class AIService {
  constructor(
    private prisma: PrismaService,
    private knowledgeService: KnowledgeService,
  ) {}

  async logRequest(dto: LogAIRequestDto) {
    return this.prisma.aIRequest.create({
      data: {
        userId: dto.userId,
        sessionId: dto.sessionId,
        provider: dto.provider || 'openrouter',
        model: dto.model,
        latencyMs: dto.latencyMs,
        inputTokens: dto.inputTokens || 0,
        outputTokens: dto.outputTokens || 0,
        status: dto.status || 'SUCCESS',
      },
    });
  }

  async getRecentLogs(limit = 50) {
    return this.prisma.aIRequest.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  buildSystemPrompt(
    persona = 'RAMAH',
    customInstructions?: string,
    ragContext?: string,
  ): string {
    let base = '';
    switch (persona.toUpperCase()) {
      case 'MEDIS':
        base =
          'Anda adalah Asisten Medis Klinis Zavora Life. Berikan evaluasi klinis profesional, terstruktur dengan alur SOAP (Subjective, Objective, Assessment, Plan) secara obyektif, sebutkan kemungkinan diagnosis banding yang patut diverifikasi dokter, dan edukasi medis yang mendalam namun tetap santun.';
        break;
      case 'SEDERHANA':
        base =
          'Anda adalah Sahabat Sehat Keluarga Zavora Life. Gunakan gaya bahasa yang SANGAT RAMAH, HANGAT, dan SEDERHANA. Hindari istilah kedokteran yang sulit, gunakan perumpamaan yang mudah dipahami lansia, orang tua, maupun anak-anak, dengan nada bicara yang menenangkan.';
        break;
      case 'RINGKAS':
        base =
          'Anda adalah Asisten Cepat Zavora Life. Berikan jawaban yang ramah namun padat, to-the-point, berpoin-poin rapi, dan langsung mengarahkan pada tindakan atau pertolongan pertama yang relevan.';
        break;
      case 'RAMAH':
      default:
        base =
          'Anda adalah Asisten AI Kesehatan Zavora Life yang SANGAT RAMAH, PENUH EMPATI, dan HANGAT 😊. Sapa pengguna dengan santun dan bersahabat (misalnya: "Halo Kak! Salam sehat selalu ya...", "Jangan khawatir ya, mari kita diskusikan keluhannya bersama-sama..."). Dengarkan keluhan dengan tulus, bantu tenangkan rasa cemas atau takut, jelaskan kondisi dengan bahasa yang ramah dan positif, berikan tips perawatan mandiri dan hidrasi yang aman, serta anjurkan dengan lembut untuk membuat janji temu dengan dokter spesialis kami jika butuh pemeriksaan langsung.';
        break;
    }

    base +=
      ' PENTING: Anda BUKAN pengganti dokter definitif. Jangan memberikan vonis penyakit berat secara sepihak. Selalu tambahkan catatan ramah di akhir pesan bahwa saran ini merupakan langkah edukasi awal.';

    if (customInstructions) {
      base += `\n\n[Instruksi Kustom Pengguna]:\n${customInstructions}`;
    }

    if (ragContext) {
      base += `\n\n[Konteks Basis Data Medis Resmi Indonesia]:\n${ragContext}`;
    }

    return base;
  }

  // Stream AI consultation chunks using SSE
  streamConsultation(
    prompt: string,
    userId?: string,
    persona = 'RAMAH',
    customInstructions?: string,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const startTime = Date.now();
      const apiKey = process.env.OPENROUTER_API_KEY;
      const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

      if (!apiKey) {
        // Warm and empathetic fallback simulated response stream
        const simulatedWords = [
          'Halo Kak! ',
          'Salam sehat dan hangat dari Zavora Life 😊. ',
          'Terima kasih ya sudah mempercayakan keluhan kesehatan Kakak kepada kami. ',
          'Mendengar gejala yang Kakak ceritakan, jangan terlalu khawatir atau cemas dulu ya. ',
          'Saat ini tubuh Kakak kemungkinan sedang memberi sinyal untuk beristirahat lebih banyak dan memastikan cairan tubuh tercukupi dengan baik. ',
          'Untuk menjaga kesehatan dan mendapatkan evaluasi yang paling tepat serta aman, ',
          'Kakak sangat dianjurkan untuk berkonsultasi langsung dengan dokter spesialis kami di Zavora Life terdekat. ',
          'Apakah ada keluhan lain yang dirasakan seperti demam atau mual? ',
          'Saya siap mendengarkan dan mendampingi Kakak kapan saja!',
        ];

        let index = 0;
        const interval = setInterval(() => {
          if (index < simulatedWords.length) {
            subscriber.next({
              data: { token: simulatedWords[index], done: false },
            } as MessageEvent);
            index++;
          } else {
            subscriber.next({
              data: { done: true },
            } as MessageEvent);
            clearInterval(interval);
            subscriber.complete();

            this.logRequest({
              userId,
              model: 'simulated-fallback',
              latencyMs: Date.now() - startTime,
              status: 'SUCCESS',
            });
          }
        }, 70);

        return () => clearInterval(interval);
      }

      const ragContext = this.knowledgeService.getRAGContext(prompt);
      const systemPrompt = this.buildSystemPrompt(persona, customInstructions, ragContext);

      // Stream from OpenRouter API
      (async () => {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
              'HTTP-Referer': 'https://kliniksehat.id',
              'X-Title': 'KlinikSehat AI',
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: 'system',
                  content: systemPrompt,
                },
                { role: 'user', content: prompt },
              ],
              stream: true,
            }),
          });

          if (!response.body) {
            subscriber.error(new Error('No response body from OpenRouter'));
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data: '));

            for (const line of lines) {
              const dataStr = line.replace(/^data: /, '').trim();
              if (dataStr === '[DONE]') {
                subscriber.next({
                  data: { done: true },
                    } as MessageEvent);
                subscriber.complete();
                break;
              }

              try {
                const parsed = JSON.parse(dataStr);
                const token = parsed.choices?.[0]?.delta?.content || '';
                if (token) {
                  subscriber.next({
                    data: { token, done: false },
                        } as MessageEvent);
                }
              } catch (e) {
                // ignore unparseable chunks
              }
            }
          }

          // Record operational telemetry
          this.logRequest({
            userId,
            model,
            latencyMs: Date.now() - startTime,
            status: 'SUCCESS',
          });
        } catch (err: any) {
          // Graceful fallback on network error
          subscriber.next({
            data: {
              token: 'Mohon maaf, terjadi kendala koneksi ke model AI utama. Berdasarkan keluhan umum, disarankan untuk menjaga istirahat yang cukup, penuhi kebutuhan cairan, dan buat janji temu dengan dokter kami untuk evaluasi medis lebih lanjut.',
              done: false,
            },
            type: 'ai-chunk',
          } as MessageEvent);
          subscriber.next({
            data: { done: true },
            type: 'ai-chunk',
          } as MessageEvent);
          subscriber.complete();

          this.logRequest({
            userId,
            model: 'fallback-on-error',
            latencyMs: Date.now() - startTime,
            status: 'FALLBACK',
          });
        }
      })();
    });
  }

  // Structured AI Clinical Triage & SOAP analysis for patients and doctors
  async generateMedicalTriageSummary(symptoms: string): Promise<{
    summary: string;
    triageLevel: 'GREEN' | 'YELLOW' | 'RED';
    recommendedSpecialty: string;
    matchedDiseases?: any[];
    matchedMedicines?: any[];
    suggestedQuestions: string[];
    soapDraft: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    };
  }> {
    const isRedFlag = /(sesak napas parah|nyeri dada tembus|kehilangan kesadaran|pendarahan hebat|stroke|mati rasa mendadak)/i.test(
      symptoms,
    );
    const isModerate = /(demam tinggi|nyeri lambung|mual muntah berulang|pusing berputar|migrain parah|batuk berdarah)/i.test(
      symptoms,
    );

    let triageLevel: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
    let recommendedSpecialty = 'Dokter Umum';

    if (isRedFlag) {
      triageLevel = 'RED';
      recommendedSpecialty = 'Dokter Spesialis Jantung & Pembuluh Darah / IGD';
    } else if (isModerate) {
      triageLevel = 'YELLOW';
      if (/lambung|mual|pencernaan/i.test(symptoms)) {
        recommendedSpecialty = 'Dokter Spesialis Penyakit Dalam';
      } else if (/pusing|migrain|saraf/i.test(symptoms)) {
        recommendedSpecialty = 'Dokter Spesialis Saraf';
      } else {
        recommendedSpecialty = 'Dokter Spesialis Penyakit Dalam';
      }
    } else {
      if (/kulit|gatal|ruam/i.test(symptoms)) {
        recommendedSpecialty = 'Dokter Spesialis Kulit & Kelamin';
      } else if (/gigi|gusi/i.test(symptoms)) {
        recommendedSpecialty = 'Dokter Gigi';
      } else if (/mata|pandangan/i.test(symptoms)) {
        recommendedSpecialty = 'Dokter Spesialis Mata';
      }
    }

    const matchedDiseases = this.knowledgeService.searchDiseases(symptoms, 2);
    const matchedMedicines = this.knowledgeService.searchMedicines(symptoms, 2);

    return {
      summary: `Pasien mengeluhkan: "${symptoms}". Triase awal menunjukkan prioritas ${triageLevel}.`,
      triageLevel,
      recommendedSpecialty,
      matchedDiseases,
      matchedMedicines,
      suggestedQuestions: [
        'Sudah berapa lama gejala ini dirasakan?',
        'Apakah ada riwayat alergi obat atau makanan?',
        'Apakah sedang mengonsumsi obat rutin?',
      ],
      soapDraft: {
        subjective: `Pasien mengeluhkan: ${symptoms}. Tidak ada riwayat trauma dilaporkan.`,
        objective: 'Tanda vital dalam batas normal (perlu konfirmasi pemeriksaan fisik langsung).',
        assessment: `Klinis awal mengarah ke evaluasi ${recommendedSpecialty}. Tingkat urgensi: ${triageLevel}.`,
        plan: '1. Konsultasi dokter spesialis terkait\n2. Edukasi hidrasi & istirahat\n3. Observasi perburukan gejala',
      },
    };
  }

  async generateFriendlyResponse(
    prompt: string,
    persona = 'RAMAH',
    customInstructions?: string,
  ): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
    const ragContext = this.knowledgeService.getRAGContext(prompt);
    const systemPrompt = this.buildSystemPrompt(persona, customInstructions, ragContext);

    if (apiKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://kliniksehat.id',
            'X-Title': 'KlinikSehat AI',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const reply = json.choices?.[0]?.message?.content;
          if (reply) return reply;
        }
      } catch (e) {
        // fallback on error
      }
    }

    // Friendly local response generator
    const matched = this.knowledgeService.searchDiseases(prompt, 1);
    const diseaseTip =
      matched.length > 0
        ? ` Berdasarkan referensi data kesehatan kami tentang kondisi serupa (${matched[0].name}: ${matched[0].description.slice(0, 120)}...), penting untuk tidak menyepelekannya ya.`
        : '';

    return `Halo Kak! Salam sehat dan hangat dari Zavora Life 😊.\n\nTerima kasih banyak ya sudah berbagi keluhan kesehatan dengan kami. Mengenai "${prompt}", Kakak tidak perlu panik.${diseaseTip}\n\nLangkah awal yang sangat baik dilakukan adalah memperbanyak istirahat berkualitas, mencukupi hidrasi air putih hangat, dan menghindari aktivitas fisik berat terlebih dahulu. Agar penanganan lebih maksimal dan aman, kami sangat menyarankan Kakak untuk membuat janji temu dengan dokter spesialis kami di Zavora Life terdekat ya.\n\nSemoga lekas pulih dan sehat kembali! Ada hal lain yang ingin Kakak tanyakan?`;
  }
}
