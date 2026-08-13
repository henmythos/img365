import * as mpSelfie from '@mediapipe/selfie_segmentation';

// Handle various export formats (ESM, CJS, UMD)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelfieSegmentation = mpSelfie.SelfieSegmentation || (mpSelfie as any).default?.SelfieSegmentation || (window as any).SelfieSegmentation;
type Results = mpSelfie.Results;
type SelfieSegmentationClass = mpSelfie.SelfieSegmentation;

// Using a singleton class or generic manager to hold the model instance
let selfieSegmentation: SelfieSegmentationClass | null = null;

interface SegmentationOptions {
    feathering: number; // 0 to 10+
    onProgress?: (text: string) => void;
}

const initModel = async (): Promise<SelfieSegmentationClass> => {
    if (selfieSegmentation) return selfieSegmentation;

    return new Promise((resolve) => {
        const segmenter = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            },
        });

        segmenter.setOptions({
            modelSelection: 1, // 1: Landscape (faster, lower latency), 0: General
            selfieMode: false, // We process uploaded images, not mirror webcam
        });

        segmenter.onResults(() => {
            // Dummy listener to ensure initialization
        });

        selfieSegmentation = segmenter;
        resolve(segmenter);
    });
};

export const segmentAndComposite = async (
    image: HTMLImageElement,
    options: SegmentationOptions
): Promise<Blob> => {
    const segmenter = await initModel();

    return new Promise((resolve, reject) => {
        // Create an offscreen canvas to process the result
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Failed to create canvas context'));
            return;
        }

        // Define the onResults callback for THIS specific execution
        // Note: MediaPipe is designed for streams, so we hook into onResults
        const onResults = (results: Results) => {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the mask
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ctx.drawImage(results.segmentationMask as any, 0, 0, canvas.width, canvas.height);

            // Composite the image ONLY where the mask is opaque (person)
            // "source-in" = Keep source (image) only where destination (mask) is
            ctx.globalCompositeOperation = 'source-in';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ctx.drawImage(results.image as any, 0, 0, canvas.width, canvas.height);

            ctx.restore();

            // Apply feathering if requested
            // We can't easily feather "after" composite correctly without more work.
            // Better feather strategy:
            // 1. Draw mask
            // 2. Blur mask
            // 3. Composite image over blurred mask
            if (options.feathering > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                applyFeathering(ctx, results.segmentationMask as any, results.image as any, canvas.width, canvas.height, options.feathering);
            }

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
            }, 'image/png');
        };

        // Override the global listener for this request
        segmenter.onResults(onResults);

        // Process the image
        segmenter.send({ image: image }).catch(reject);
    });
};

const applyFeathering = (
    ctx: CanvasRenderingContext2D,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mask: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    original: any,
    width: number,
    height: number,
    amount: number
) => {
    // Clear previous composition
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // 1. Draw mask
    ctx.drawImage(mask, 0, 0, width, height);

    // 2. Blur the mask for soft edges
    ctx.filter = `blur(${amount}px)`;
    // Redraw mask over itself to reinforce core opacity while blurring edges? 
    // Or just blur existing:
    // ctx.drawImage(mask, 0, 0, width, height); 
    // Note: To blur what's already on canvas, we just set filter before drawing? 
    // No, filter applies to drawing operations. 
    // Strategy: Draw mask with blur.

    // Re-clear to do it right
    ctx.restore();
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    ctx.filter = `blur(${amount}px)`;
    ctx.drawImage(mask, 0, 0, width, height);
    ctx.filter = 'none';

    // 3. Composite original image
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(original, 0, 0, width, height);

    ctx.restore();
};
