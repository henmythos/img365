import React from 'react';
import { Link } from 'react-router-dom';
import { Image, FileText, Camera, Sparkles, Combine, Type, Scissors, Pen, Maximize, Crop, RotateCw, Wand2, FileSpreadsheet, Stamp } from 'lucide-react';

interface Tool {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  { path: '/convert', label: 'Image Converter', icon: <Image className="w-4 h-4" /> },
  { path: '/compress', label: 'Image Compressor', icon: <Image className="w-4 h-4" /> },
  { path: '/image-to-pdf', label: 'Image to PDF', icon: <FileText className="w-4 h-4" /> },
  { path: '/excel-to-pdf', label: 'Excel to PDF', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { path: '/merge-pdf', label: 'Merge PDF', icon: <Combine className="w-4 h-4" /> },
  { path: '/split-pdf', label: 'Split PDF', icon: <Scissors className="w-4 h-4" /> },
  { path: '/watermark', label: 'Watermark Tool', icon: <Stamp className="w-4 h-4" /> },
  { path: '/pdf-to-image', label: 'PDF to Image', icon: <FileText className="w-4 h-4" /> },
  { path: '/camera-to-pdf', label: 'Camera to PDF', icon: <Camera className="w-4 h-4" /> },
  { path: '/pdf-to-text', label: 'PDF to Text', icon: <Type className="w-4 h-4" /> },
  { path: '/crop-pdf', label: 'Crop PDF', icon: <Scissors className="w-4 h-4" /> },
  { path: '/sign-pdf', label: 'Sign PDF', icon: <Pen className="w-4 h-4" /> },
  { path: '/image-resize', label: 'Image Resize', icon: <Maximize className="w-4 h-4" /> },
  { path: '/image-crop', label: 'Image Crop', icon: <Crop className="w-4 h-4" /> },
  { path: '/image-rotate', label: 'Image Rotate', icon: <RotateCw className="w-4 h-4" /> },
  { path: '/smart-scan', label: 'Smart Scan', icon: <Wand2 className="w-4 h-4" /> },
];

export const ToolsMenu: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Access Tools
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group text-center"
          >
            <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
              {tool.icon}
            </span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {tool.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

