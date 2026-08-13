import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SuggestedToolsProps {
  tools: string[];
}

const toolPaths: Record<string, string> = {
  'Image Converter': '/convert',
  'Image Compressor': '/compress',
  'Compress': '/compress',
  'Convert': '/convert',
  'Image to PDF': '/image-to-pdf',
  'PDF to Image': '/pdf-to-image',
  'Camera to PDF': '/camera-to-pdf',
  'Excel to PDF': '/excel-to-pdf',
  'JPG to PDF': '/image-to-pdf',
  'PNG to PDF': '/image-to-pdf',
  'Merge PDF': '/merge-pdf',
  'Split PDF': '/split-pdf',
  'Watermark': '/watermark',
  'PDF to Text': '/pdf-to-text',
  'Crop PDF': '/crop-pdf',
  'Sign PDF': '/sign-pdf',
  'Image Resize': '/image-resize',
  'Image Crop': '/image-crop',
  'Image Rotate': '/image-rotate',
  'Smart Scan': '/smart-scan',
};

export const SuggestedTools: React.FC<SuggestedToolsProps> = ({ tools }) => {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Suggested Tools
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        You might also find these tools useful:
      </p>
      <div className="flex flex-wrap gap-3">
        {tools.map((toolName) => {
          const path = toolPaths[toolName];
          if (!path) return null;

          return (
            <Link
              key={toolName}
              to={path}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors group"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {toolName}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

