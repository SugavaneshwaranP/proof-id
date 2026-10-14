// ============================================================================
// PROOF-ID / BACKED — CLIENT-SIDE IMAGE COMPRESSOR
// Prevents storage exhaustion and eliminates upload latency by downscaling
// images to max 1920x1080 and encoding to WebP at 85% quality before upload.
// ============================================================================

/**
 * Downscale and compress an image file in the browser using HTML5 Canvas.
 * Non-image files (PDFs, docs) pass through untouched.
 *
 * @param {File} file - Raw input File object
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum allowed width in pixels (default: 1920)
 * @param {number} options.maxHeight - Maximum allowed height in pixels (default: 1080)
 * @param {number} options.quality - WebP quality 0.0 - 1.0 (default: 0.85)
 * @returns {Promise<File>} Compressed File or original File
 */
export async function compressImage(file, { maxWidth = 1920, maxHeight = 1080, quality = 0.85 } = {}) {
  if (!file || !(file instanceof File)) return file;

  // Pass through non-image documents (e.g. PDF contracts, certificates)
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Pass through animated GIFs or SVGs to preserve vector/frames
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // If the original image is already within bounds and small, return early
        if (width === img.width && height === img.height && file.size < 500 * 1024) {
          resolve(file);
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Smooth image downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            console.log(
              `[ImageCompressor] ${(file.size / 1024).toFixed(1)} KB -> ${(compressedFile.size / 1024).toFixed(1)} KB (saved ${(100 - (compressedFile.size / file.size) * 100).toFixed(0)}%)`
            );

            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = event.target.result;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
