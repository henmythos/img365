import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Image, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  Camera, 
  Combine, 
  Type, 
  Scissors, 
  Pen, 
  Maximize, 
  Crop, 
  RotateCw, 
  Wand2,
  Stamp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ToolSearchItem {
  path: string;
  label: string;
  description: string;
  category: 'PDF' | 'Image';
  icon: React.ReactNode;
}

const ALL_TOOLS: ToolSearchItem[] = [
  { path: '/convert', label: 'Image Converter', description: 'Convert HEIC, PNG, WebP, AVIF, JPG', category: 'Image', icon: <Image className="w-4 h-4 text-blue-500" /> },
  { path: '/compress', label: 'Image Compressor', description: 'Reduce image file size with quality control', category: 'Image', icon: <Image className="w-4 h-4 text-emerald-500" /> },
  { path: '/image-to-pdf', label: 'Image to PDF', description: 'Convert JPG, PNG, WebP photos into PDF', category: 'PDF', icon: <FileText className="w-4 h-4 text-blue-600" /> },
  { path: '/excel-to-pdf', label: 'Excel to PDF', description: 'Convert XLSX, XLS, CSV to PDF with sequence', category: 'PDF', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> },
  { path: '/pdf-to-image', label: 'PDF to Image', description: 'Extract PDF pages as high-res JPG/PNG', category: 'PDF', icon: <FileText className="w-4 h-4 text-amber-500" /> },
  { path: '/camera-to-pdf', label: 'Camera to PDF', description: 'Scan physical documents to PDF via camera', category: 'PDF', icon: <Camera className="w-4 h-4 text-purple-500" /> },
  { path: '/merge-pdf', label: 'Merge PDF', description: 'Combine multiple PDFs into single document', category: 'PDF', icon: <Combine className="w-4 h-4 text-indigo-500" /> },
  { path: '/split-pdf', label: 'Split PDF', description: 'Extract ranges or separate PDF pages into ZIP', category: 'PDF', icon: <Scissors className="w-4 h-4 text-red-500" /> },
  { path: '/watermark', label: 'Watermark Tool', description: 'Add custom text stamp & opacity to PDF & photos', category: 'PDF', icon: <Stamp className="w-4 h-4 text-purple-500" /> },
  { path: '/pdf-to-text', label: 'PDF to Text', description: 'Extract raw text content from PDF files', category: 'PDF', icon: <Type className="w-4 h-4 text-teal-500" /> },
  { path: '/crop-pdf', label: 'Crop PDF', description: 'Trim PDF page margins and boundaries', category: 'PDF', icon: <Scissors className="w-4 h-4 text-red-500" /> },
  { path: '/sign-pdf', label: 'Sign PDF', description: 'Add drawn or uploaded signature to PDF', category: 'PDF', icon: <Pen className="w-4 h-4 text-blue-500" /> },
  { path: '/image-resize', label: 'Image Resize', description: 'Resize pixel dimensions and scale images', category: 'Image', icon: <Maximize className="w-4 h-4 text-cyan-500" /> },
  { path: '/image-crop', label: 'Image Crop', icon: <Crop className="w-4 h-4 text-pink-500" />, description: 'Crop photos to custom aspect ratios', category: 'Image' },
  { path: '/image-rotate', label: 'Image Rotate', icon: <RotateCw className="w-4 h-4 text-orange-500" />, description: 'Rotate 90° or flip images horizontally/vertically', category: 'Image' },
  { path: '/smart-scan', label: 'Smart Scan', icon: <Wand2 className="w-4 h-4 text-purple-500" />, description: 'Auto-contrast and document enhancement', category: 'Image' },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/convert', label: 'Convert' },
    { path: '/compress', label: 'Compress' },
    { path: '/image-to-pdf', label: 'Image to PDF' },
    { path: '/excel-to-pdf', label: 'Excel to PDF' },
    { path: '/merge-pdf', label: 'Merge PDF' },
    { path: '/why-us', label: 'Why img365.in' },
    { path: '/blog', label: 'Blog' },
  ];

  // Shortcut Listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = ALL_TOOLS.filter(t => 
    t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTool = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="p-2 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors shadow-md">
                <Image className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                img365.in
              </span>
            </Link>

            {/* Nav Items & Search */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Quick Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-xs transition-colors border border-gray-200 dark:border-gray-700"
                title="Search Tools (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search tools...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">
                  Ctrl K
                </kbd>
              </button>

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>
            </nav>

            {/* Mobile View Controls */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Search tools"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium transition-colors py-1 ${
                      isActive(item.path)
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Global Tool Search Command Palette Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Type a tool name (e.g. excel, merge, compress, sign)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg text-xs"
              >
                ESC
              </button>
            </div>

            {/* Tool List Results */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <button
                    key={tool.path}
                    onClick={() => handleSelectTool(tool.path)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:scale-105 transition-transform">
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {tool.label}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-sm">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded font-semibold">
                      {tool.category}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-gray-500 dark:text-gray-400">
                  No matching tools found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};