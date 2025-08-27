import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';

interface FullScreenPreviewProps {
  htmlContent: string;
  onClose: () => void;
}

export const FullScreenPreview = ({ htmlContent, onClose }: FullScreenPreviewProps) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-6xl max-h-4xl bg-transparent rounded-lg overflow-hidden">
        <iframe srcDoc={htmlContent} className="w-full h-full border-0" />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white z-10"
      >
        <X className="w-6 h-6" />
      </Button>
    </div>,
    document.body
  );
};