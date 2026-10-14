import React, { useState } from 'react';
import { Download, X, Copy, Check, FileCode, HardDriveDownload } from 'lucide-react';
import { generateCleanExport, generateStandaloneOfflineEditorHtml } from '../utils/bundler';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  html,
  css,
  js
}) => {
  const [copied, setCopied] = useState(false);
  const [projectTitle, setProjectTitle] = useState('My-Code-Project');

  if (!isOpen) return null;

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadProject = () => {
    const cleanHtml = generateCleanExport(html, css, js, projectTitle);
    const filename = `${projectTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'index'}.html`;
    downloadFile(cleanHtml, filename);
  };

  const handleDownloadOfflineStudio = () => {
    const offlineStudioHtml = generateStandaloneOfflineEditorHtml();
    downloadFile(offlineStudioHtml, 'aethercode-offline-editor.html');
  };

  const handleCopyCombined = async () => {
    const cleanHtml = generateCleanExport(html, css, js, projectTitle);
    try {
      await navigator.clipboard.writeText(cleanHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0d0d10] border border-neutral-800 rounded-xl shadow-2xl p-6 text-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-neutral-300" />
            <h2 className="text-base font-semibold text-white">Export & Offline Bundles</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 py-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500 font-mono"
              placeholder="my-cool-project"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Option 1: Export Current Creation as Single HTML */}
            <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>Export Project</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Combines your HTML, CSS, and JS into a standalone .html file that runs locally offline.
                </p>
              </div>
              <button
                onClick={handleDownloadProject}
                className="w-full py-2 px-3 bg-white text-black font-semibold rounded-lg text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .html</span>
              </button>
            </div>

            {/* Option 2: Export Complete Offline Editor Studio */}
            <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                  <HardDriveDownload className="w-4 h-4 text-amber-400" />
                  <span>Standalone Studio</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Download the entire live editor application as a single offline HTML file with zero dependencies.
                </p>
              </div>
              <button
                onClick={handleDownloadOfflineStudio}
                className="w-full py-2 px-3 bg-neutral-800 text-white hover:bg-neutral-700 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 border border-neutral-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Studio</span>
              </button>
            </div>
          </div>

          {/* Quick Copy */}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
            <span className="text-xs text-neutral-400">Copy bundled HTML source code</span>
            <button
              onClick={handleCopyCombined}
              className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
