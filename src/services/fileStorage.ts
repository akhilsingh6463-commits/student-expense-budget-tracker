import { ReceiptAttachment } from '../types/transaction';
import { validateReceiptFile } from '../utils/validators';

/**
 * Encapsulates receipt file processing and base64 serialization
 */
export const fileStorageService = {
  /**
   * Process and convert a file to a ReceiptAttachment object
   */
  async processReceiptFile(file: File): Promise<ReceiptAttachment> {
    const validation = validateReceiptFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid file');
    }

    // If it's an image, optimize it before storing in localStorage
    if (file.type.startsWith('image/') && file.type !== 'image/gif') {
      try {
        const compressedDataUrl = await this.compressImage(file, 1200, 0.8);
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: compressedDataUrl,
          uploadedAt: new Date().toISOString(),
        };
      } catch {
        // Fallback to raw base64 if compression fails
      }
    }

    const rawDataUrl = await this.readFileAsDataUrl(file);
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl: rawDataUrl,
      uploadedAt: new Date().toISOString(),
    };
  },

  /**
   * Reads a file as Base64 Data URL
   */
  readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to data URL'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('File read error'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Compresses image using HTML5 Canvas to preserve localStorage capacity
   */
  compressImage(file: File, maxDimension: number = 1000, quality: number = 0.75): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image for compression'));
      };

      img.src = objectUrl;
    });
  },
};
