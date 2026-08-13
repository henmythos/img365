export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateImageSchema = (imageName: string, format: string, size: number) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": imageName,
    "encodingFormat": format,
    "contentSize": formatFileSize(size),
    "uploadDate": new Date().toISOString(),
    "isAccessibleForFree": true,
  };
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getCompressionRatio = (originalSize: number, compressedSize: number): number => {
  return Math.round((1 - compressedSize / originalSize) * 100);
};

export const isValidImageFile = (file: File): boolean => {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/bmp',
    'image/tiff',
    'image/heic',
    'image/heif',
  ];
  
  return validTypes.includes(file.type) || 
         file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|avif|bmp|tiff|tif|heic|heif)$/);
};