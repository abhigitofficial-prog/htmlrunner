export type Language = 'html' | 'css' | 'js';

export type LayoutMode = 'horizontal' | 'vertical' | 'tabs' | 'three-col';

export type DeviceMode = 'full' | 'desktop' | 'tablet' | 'mobile';

export interface ConsoleEntry {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  content: string;
  timestamp: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  css: string;
  js: string;
}
