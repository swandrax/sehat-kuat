import { Injectable, MessageEvent } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
  constructor(private prisma: PrismaService) {}

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

  // Stream AI consultation chunks using SSE
  streamConsultation(prompt: string, userId?: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const startTime = Date.now();
      const apiKey = process.env.OPENROUTER_API_KEY;
      const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

      if (!apiKey) {
        // Fallback simulated intelligent response stream if no API key
        const simulatedWords = [
          'Halo! ', 'Berdasarkan ', 'keluhan ', 'yang ', 'Anda ', 'sampaikan, ',
          'gejala ', 'ini ', 'dapat ', 'merupakan ', 'indikasi ', 'kondisi ', 'umum. ',
          'Disarankan ', 'untuk ', 'menjaga ', 'hidrasi ', 'dan ', 'segera ', 'membuat ',
          'janji ', 'temu ', 'dengan ', 'dokter ', 'spesialis ', 'kami ', 'di ', 'KlinikSehat.'
        ];

        let index = 0;
        const interval = setInterval(() => {
          if (index < simulatedWords.length) {
            subscriber.next({
              data: { text: simulatedWords[index], done: false },
              type: 'ai-chunk',
            } as MessageEvent);
            index++;
          } else {
            subscriber.next({
              data: { done: true },
              type: 'ai-chunk',
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
        }, 80);

        return () => clearInterval(interval);
      }

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
                  content:
                    'Anda adalah asisten medis cerdas KlinikSehat. Berikan informasi kesehatan yang ramah, informatif, dan selalu sarankan untuk berkonsultasi langsung dengan dokter spesialis di platform KlinikSehat jika diperlukan diagnosis pasti.',
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
                  type: 'ai-chunk',
                } as MessageEvent);
                subscriber.complete();
                break;
              }

              try {
                const parsed = JSON.parse(dataStr);
                const text = parsed.choices?.[0]?.delta?.content || '';
                if (text) {
                  subscriber.next({
                    data: { text, done: false },
                    type: 'ai-chunk',
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
          subscriber.error(err);
        }
      })();
    });
  }
}
