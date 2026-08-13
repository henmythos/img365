interface ProcessingOptions {
  format: string;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  maxSizeMB?: number;
}

export const processImage = async (file: File, options: ProcessingOptions): Promise<Blob> => {
  let processedFile: File | Blob = file;

  // Normalize JPG format to JPEG for processing
  const normalizedFormat = options.format === 'jpg' ? 'jpeg' : options.format;

  // Handle HEIC files
  if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
    try {
      const heic2any = (await import('heic2any')).default;
      const convertedBlob = await heic2any({
        blob: file,
        toType: `image/${normalizedFormat}`,
        quality: options.quality,
      });

      processedFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    } catch (error) {
      console.error('Error converting HEIC:', error);
      throw new Error('Failed to convert HEIC file');
    }
  }

  // Compression options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compressionOptions: any = {
    maxSizeMB: options.maxSizeMB || 50,
    maxWidthOrHeight: Math.max(options.maxWidth || 3840, options.maxHeight || 2160),
    useWebWorker: true,
    fileType: `image/${normalizedFormat}`,
    initialQuality: options.quality,
    alwaysKeepResolution: true,
  };

  try {
    const imageCompression = (await import('browser-image-compression')).default;
    const compressedFile = await imageCompression(processedFile as File, compressionOptions);

    // Convert to desired format if needed
    if (normalizedFormat !== 'auto') {
      return await convertToFormat(compressedFile, normalizedFormat, options.quality);
    }

    return compressedFile;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
};

const convertToFormat = async (file: File | Blob, format: string, quality: number): Promise<Blob> => {
  let imgBitmap: ImageBitmap;
  try {
    imgBitmap = await createImageBitmap(file);
  } catch {
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    URL.revokeObjectURL(url);
    imgBitmap = await createImageBitmap(img);
  }

  const canvas = document.createElement('canvas');
  canvas.width = imgBitmap.width;
  canvas.height = imgBitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(imgBitmap, 0, 0);
  imgBitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, `image/${format}`, quality)
  );

  if (!blob) throw new Error('Failed to convert image');
  return blob;
};

export const getSupportedFormats = () => {
  return [
    { value: 'jpeg', label: 'JPEG', extension: 'jpg' },
    { value: 'jpg', label: 'JPG', extension: 'jpg' },
    { value: 'png', label: 'PNG', extension: 'png' },
    { value: 'webp', label: 'WebP', extension: 'webp' },
    { value: 'avif', label: 'AVIF', extension: 'avif' },
    { value: 'bmp', label: 'BMP', extension: 'bmp' },
  ];
};

export const detectImageFormat = (file: File): string => {
  const extension = file.name.toLowerCase().split('.').pop();
  const mimeType = file.type.toLowerCase();

  if (mimeType.includes('heic') || mimeType.includes('heif') || extension === 'heic') {
    return 'HEIC';
  }
  if (mimeType.includes('jpeg') || extension === 'jpg' || extension === 'jpeg') {
    return 'JPEG';
  }
  if (mimeType.includes('png') || extension === 'png') {
    return 'PNG';
  }
  if (mimeType.includes('webp') || extension === 'webp') {
    return 'WebP';
  }
  if (mimeType.includes('avif') || extension === 'avif') {
    return 'AVIF';
  }
  if (mimeType.includes('bmp') || extension === 'bmp') {
    return 'BMP';
  }
  if (mimeType.includes('tiff') || extension === 'tiff' || extension === 'tif') {
    return 'TIFF';
  }

  return 'Unknown';
};