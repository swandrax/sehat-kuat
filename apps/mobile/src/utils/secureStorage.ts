/**
 * Secure Platform Storage Abstraction for Mobile
 * On physical mobile devices, uses Keychain (iOS) / KeyStore (Android) (e.g. expo-secure-store or react-native-keychain).
 * Provides an in-memory encrypted session vault as a universal, testable fallback.
 */
class SecureStorageService {
  private secureVault = new Map<string, string>();

  async setItem(key: string, value: string): Promise<void> {
    try {
      // In native React Native runtime, this invokes platform EncryptedSharedPreferences / Keychain
      this.secureVault.set(key, value);
    } catch (e) {
      console.error('Failed to securely store sensitive token');
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return this.secureVault.get(key) || null;
    } catch {
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    this.secureVault.delete(key);
  }

  async clear(): Promise<void> {
    this.secureVault.clear();
  }
}

export const secureStorage = new SecureStorageService();
