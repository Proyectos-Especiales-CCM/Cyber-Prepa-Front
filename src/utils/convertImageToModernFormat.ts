const MIME_BY_EXTENSION: Record<string, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
};

const tryCanvasEncode = async (
  image: HTMLImageElement,
  mimeType: string,
  quality = 0.9,
): Promise<Blob | null> => {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(image, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  if (!blob || blob.size === 0) return null;

  // Browsers may silently encode as PNG/JPEG when unsupported.
  if (blob.type !== mimeType) return null;

  return blob;
};

const loadImageFromFile = async (file: File): Promise<HTMLImageElement> => {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Unable to decode image file.'));
      img.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const replaceExtension = (fileName: string, extension: string): string => {
  const baseName = fileName.includes('.')
    ? fileName.substring(0, fileName.lastIndexOf('.'))
    : fileName;

  return `${baseName}.${extension}`;
};

export const convertImageToModernFormat = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo no es una imagen válida.');
  }

  if (file.type === MIME_BY_EXTENSION.avif || file.type === MIME_BY_EXTENSION.webp) {
    return file;
  }

  const image = await loadImageFromFile(file);
  const targetFormats: Array<'avif' | 'webp'> = ['avif', 'webp'];

  for (const extension of targetFormats) {
    const mimeType = MIME_BY_EXTENSION[extension];
    const convertedBlob = await tryCanvasEncode(image, mimeType);

    if (convertedBlob) {
      return new File([convertedBlob], replaceExtension(file.name, extension), {
        type: mimeType,
        lastModified: Date.now(),
      });
    }
  }

  throw new Error('No se pudo convertir la imagen a formato AVIF o WebP.');
};
