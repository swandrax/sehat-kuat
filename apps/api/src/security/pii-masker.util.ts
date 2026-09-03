/**
 * PII/PHI Masking Utility for HIPAA / PDP Law compliance
 * Redacts National ID (NIK), Card Numbers, Phone Numbers, and Emails in logs and AI pipelines.
 */
export class PiiMasker {
  static maskCardNumber(cardNumber?: string | null): string {
    if (!cardNumber) return '';
    const clean = cardNumber.replace(/\s+/g, '-');
    if (clean.length < 8) return '****';
    return clean.replace(/^(\d{4})[-\d]+(\d{4})$/, '$1-****-****-$2');
  }

  static maskNik(nik?: string | null): string {
    if (!nik) return '';
    if (nik.length === 16) {
      return `${nik.slice(0, 6)}******${nik.slice(12)}`;
    }
    return `${nik.slice(0, 3)}***${nik.slice(-3)}`;
  }

  static maskPhone(phone?: string | null): string {
    if (!phone) return '';
    if (phone.length <= 6) return '***';
    return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
  }

  static maskEmail(email?: string | null): string {
    if (!email || !email.includes('@')) return '***@***.com';
    const [user, domain] = email.split('@');
    const maskedUser = user.length <= 2 ? user[0] + '*' : user[0] + '***' + user.slice(-1);
    return `${maskedUser}@${domain}`;
  }

  /**
   * Deeply sanitize an object to strip or mask sensitive PII/PHI before logging or AI forwarding
   */
  static maskObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((item) => PiiMasker.maskObject(item));

    const masked: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lower = key.toLowerCase();
      if (lower.includes('password') || lower.includes('secret') || lower.includes('token')) {
        masked[key] = '[REDACTED]';
      } else if (lower.includes('cardnumber') || lower.includes('card_number')) {
        masked[key] = PiiMasker.maskCardNumber(String(value));
      } else if (lower.includes('nik')) {
        masked[key] = PiiMasker.maskNik(String(value));
      } else if (lower.includes('phone')) {
        masked[key] = PiiMasker.maskPhone(String(value));
      } else if (lower.includes('email')) {
        masked[key] = PiiMasker.maskEmail(String(value));
      } else if (typeof value === 'object') {
        masked[key] = PiiMasker.maskObject(value);
      } else {
        masked[key] = value;
      }
    }
    return masked;
  }
}
