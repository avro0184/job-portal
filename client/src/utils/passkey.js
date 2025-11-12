import CryptoJS from "crypto-js";
import { useRouter } from "next/router";

export const getDecryptedPasskey = (slug, token) => {
  try {
    const storedData = sessionStorage.getItem(slug);
    if (!storedData) return null;

    // Parse stored JSON (contains value + expiry time)
    const { value: encryptedPasskey, expiresAt } = JSON.parse(storedData);

    // Check if passkey expired
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(slug);
      const router = useRouter();
      router.push("/study/generated-question");
      return null;
    }

    // Decrypt using user token as AES key
    const bytes = CryptoJS.AES.decrypt(encryptedPasskey, token);
    const decryptedPasskey = bytes.toString(CryptoJS.enc.Utf8);

    // Return only if valid text found
    if (decryptedPasskey && decryptedPasskey.trim()) {
      return decryptedPasskey;
    }

    console.warn("Decrypted passkey is empty or invalid.");
    return null;
  } catch (err) {
    console.error("Failed to decrypt stored passkey:", err);
    sessionStorage.removeItem(slug); // Clean corrupted data
    return null;
  }
};


export const generateSecurePasskey = () => {
    // 16-character secure random string
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let key = "";
    const cryptoObj = window.crypto || window.msCrypto;
    const randomValues = new Uint32Array(16);
    cryptoObj.getRandomValues(randomValues);
    for (let i = 0; i < randomValues.length; i++) {
      key += charset[randomValues[i] % charset.length];
    }
    return key;
  };
