import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export const LivePreview = () => {
  const [previewContent, setPreviewContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/live_preview')
      .then((response) => response.text())
      .then((data) => setPreviewContent(data))
      .catch((error) => console.error('Error fetching preview:', error));
  }, []);

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Live Preview</Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full h-full">
          <DialogHeader>
            <DialogTitle>Live Preview</DialogTitle>
          </DialogHeader>
          <iframe
            srcDoc={previewContent}
            title="preview"
            sandbox="allow-scripts allow-same-origin"
            width="100%"
            height="95%"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
