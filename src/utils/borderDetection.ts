/**
 * Lightweight client-side border detection for document scanning
 * Uses custom edge detection algorithms (no heavy dependencies)
 */

export interface Point {
  x: number;
  y: number;
}

export interface Contour {
  points: Point[];
  area: number;
}

/**
 * Detect edges in an image using Sobel operator
 */
export const detectEdges = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data.length);

  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          gx += gray * sobelX[kernelIdx];
          gy += gray * sobelY[kernelIdx];
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const edgeValue = Math.min(255, magnitude);

      const idx = (y * width + x) * 4;
      output[idx] = edgeValue;
      output[idx + 1] = edgeValue;
      output[idx + 2] = edgeValue;
      output[idx + 3] = 255;
    }
  }

  return new ImageData(output, width, height);
};

/**
 * Apply Gaussian blur to reduce noise
 */
const applyGaussianBlur = (imageData: ImageData, radius: number = 2): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data.length);

  // Simple box blur approximation (faster than true Gaussian)
  // Simple box blur approximation (faster than true Gaussian)
  const kernelSize = radius * 2 + 1;

  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      let r = 0, g = 0, b = 0;

      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
        }
      }

      const count = kernelSize * kernelSize;
      const idx = (y * width + x) * 4;
      output[idx] = r / count;
      output[idx + 1] = g / count;
      output[idx + 2] = b / count;
      output[idx + 3] = data[idx + 3];
    }
  }

  return new ImageData(output, width, height);
};

/**
 * Convert image to grayscale
 */
const toGrayscale = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    output[i] = gray;
    output[i + 1] = gray;
    output[i + 2] = gray;
    output[i + 3] = data[i + 3];
  }

  return new ImageData(output, imageData.width, imageData.height);
};

/**
 * Threshold image to binary
 */
const threshold = (imageData: ImageData, thresholdValue: number = 128): ImageData => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    const value = gray > thresholdValue ? 255 : 0;
    output[i] = value;
    output[i + 1] = value;
    output[i + 2] = value;
    output[i + 3] = 255;
  }

  return new ImageData(output, imageData.width, imageData.height);
};

/**
 * Calculate approximate area of a polygon
 */
const calculateArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
};

/**
 * Find contours using simple edge following
 */
const findContours = (imageData: ImageData, minArea: number = 1000): Contour[] => {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const visited = new Set<number>();
  const contours: Contour[] = [];

  const getPixel = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = (y * width + x) * 4;
    return data[idx] > 128;
  };

  const getKey = (x: number, y: number): number => y * width + x;

  // 8-connected neighbors
  const neighbors = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (getPixel(x, y) && !visited.has(getKey(x, y))) {
        const points: Point[] = [];
        const stack: Point[] = [{ x, y }];

        while (stack.length > 0) {
          const current = stack.pop()!;
          const key = getKey(current.x, current.y);

          if (visited.has(key)) continue;
          visited.add(key);
          points.push(current);

          for (const [dx, dy] of neighbors) {
            const nx = current.x + dx;
            const ny = current.y + dy;
            const nkey = getKey(nx, ny);

            if (getPixel(nx, ny) && !visited.has(nkey)) {
              stack.push({ x: nx, y: ny });
            }
          }
        }

        if (points.length >= minArea) {
          const area = calculateArea(points);
          contours.push({ points, area });
        }
      }
    }
  }

  return contours.sort((a, b) => b.area - a.area);
};

/**
 * Calculate distance from point to line segment
 */
const pointToLineDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx: number, yy: number;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Approximate contour to polygon using Douglas-Peucker algorithm (simplified)
 */
const approximatePolygon = (points: Point[], epsilon: number = 10): Point[] => {
  if (points.length <= 4) return points;

  // Find the point with maximum distance from line between first and last
  let maxDist = 0;
  let maxIndex = 0;
  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = pointToLineDistance(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  if (maxDist > epsilon) {
    const left = approximatePolygon(points.slice(0, maxIndex + 1), epsilon);
    const right = approximatePolygon(points.slice(maxIndex), epsilon);
    return [...left.slice(0, -1), ...right];
  } else {
    return [first, last];
  }
};

/**
 * Sort quadrilateral points in order: top-left, top-right, bottom-right, bottom-left
 */
const sortQuadrilateralPoints = (points: Point[]): Point[] => {
  if (points.length !== 4) return points;

  // Find center
  const center = {
    x: points.reduce((sum, p) => sum + p.x, 0) / 4,
    y: points.reduce((sum, p) => sum + p.y, 0) / 4,
  };

  // Sort by angle from center
  return points.map(p => ({
    point: p,
    angle: Math.atan2(p.y - center.y, p.x - center.x),
  }))
    .sort((a, b) => a.angle - b.angle)
    .map(p => p.point);
};

/**
 * Check if points form a valid quadrilateral
 */
const isValidQuadrilateral = (points: Point[]): boolean => {
  if (points.length !== 4) return false;

  // Check if points form a reasonable quadrilateral (not too small, not degenerate)
  const minArea = 10000; // Minimum area threshold
  const area = calculateArea(points);
  if (area < minArea) return false;

  // Check if points are not too close together
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    const dist = Math.sqrt(
      Math.pow(points[i].x - points[next].x, 2) +
      Math.pow(points[i].y - points[next].y, 2)
    );
    if (dist < 50) return false; // Minimum edge length
  }

  return true;
};

/**
 * Find the largest quadrilateral contour (document shape)
 */
export const findDocumentContour = (imageData: ImageData): Point[] | null => {
  try {
    // Preprocess: grayscale -> blur -> edges -> threshold
    let processed = toGrayscale(imageData);
    processed = applyGaussianBlur(processed, 2);
    processed = detectEdges(processed);
    processed = threshold(processed, 50);

    // Find contours
    const contours = findContours(processed, 5000);

    if (contours.length === 0) return null;

    // Try to find a quadrilateral in the largest contours
    for (const contour of contours.slice(0, 3)) {
      const approximated = approximatePolygon(contour.points, 20);

      // Look for 4-sided polygons (documents)
      if (approximated.length >= 4 && approximated.length <= 6) {
        // Sort points to get proper order (top-left, top-right, bottom-right, bottom-left)
        const sorted = sortQuadrilateralPoints(approximated.slice(0, 4));
        if (isValidQuadrilateral(sorted)) {
          return sorted;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding document contour:', error);
    return null;
  }
};

/**
 * Crop canvas to the detected document contour using perspective transform
 */
export const cropToContour = (
  canvas: HTMLCanvasElement,
  contour: Point[]
): HTMLCanvasElement => {
  if (contour.length !== 4) {
    throw new Error('Contour must have exactly 4 points');
  }

  const srcCanvas = canvas;
  const ctx = srcCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Calculate destination dimensions
  const width1 = Math.sqrt(
    Math.pow(contour[1].x - contour[0].x, 2) +
    Math.pow(contour[1].y - contour[0].y, 2)
  );
  const width2 = Math.sqrt(
    Math.pow(contour[2].x - contour[3].x, 2) +
    Math.pow(contour[2].y - contour[3].y, 2)
  );
  const height1 = Math.sqrt(
    Math.pow(contour[3].x - contour[0].x, 2) +
    Math.pow(contour[3].y - contour[0].y, 2)
  );
  const height2 = Math.sqrt(
    Math.pow(contour[2].x - contour[1].x, 2) +
    Math.pow(contour[2].y - contour[1].y, 2)
  );

  const maxWidth = Math.max(width1, width2);
  const maxHeight = Math.max(height1, height2);

  // Create destination canvas
  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = Math.round(maxWidth);
  dstCanvas.height = Math.round(maxHeight);
  const dstCtx = dstCanvas.getContext('2d');
  if (!dstCtx) throw new Error('Could not get destination canvas context');

  // Get source image data
  const srcImageData = ctx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

  // Simple bilinear interpolation for perspective transform
  const srcData = srcImageData.data;
  const dstData = new Uint8ClampedArray(dstCanvas.width * dstCanvas.height * 4);

  for (let y = 0; y < dstCanvas.height; y++) {
    for (let x = 0; x < dstCanvas.width; x++) {
      // Normalized coordinates in destination
      const u = x / dstCanvas.width;
      const v = y / dstCanvas.height;

      // Find corresponding point in source using bilinear interpolation
      const topX = contour[0].x + (contour[1].x - contour[0].x) * u;
      const topY = contour[0].y + (contour[1].y - contour[0].y) * u;
      const bottomX = contour[3].x + (contour[2].x - contour[3].x) * u;
      const bottomY = contour[3].y + (contour[2].y - contour[3].y) * u;

      const srcX = Math.round(topX + (bottomX - topX) * v);
      const srcY = Math.round(topY + (bottomY - topY) * v);

      if (srcX >= 0 && srcX < srcCanvas.width && srcY >= 0 && srcY < srcCanvas.height) {
        const srcIdx = (srcY * srcCanvas.width + srcX) * 4;
        const dstIdx = (y * dstCanvas.width + x) * 4;

        dstData[dstIdx] = srcData[srcIdx];
        dstData[dstIdx + 1] = srcData[srcIdx + 1];
        dstData[dstIdx + 2] = srcData[srcIdx + 2];
        dstData[dstIdx + 3] = srcData[srcIdx + 3];
      }
    }
  }

  dstCtx.putImageData(new ImageData(dstData, dstCanvas.width, dstCanvas.height), 0, 0);
  return dstCanvas;
};
