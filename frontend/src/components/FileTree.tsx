import { useState } from 'react';
import { ChevronRight, Code } from 'lucide-react';

interface FileTreeProps {
  files: { path: string }[];
  onSelectFile: (path: string) => void;
}

export const FileTree = ({ files, onSelectFile }: FileTreeProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-64 bg-muted/20 p-4 rounded-lg">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold">Files</h3>
        <ChevronRight className={`w-5 h-5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>
      {expanded && (
        <ul>
          {files.map((file) => (
            <li
              key={file.path}
              onClick={() => onSelectFile(file.path)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
            >
              <Code className="w-4 h-4" />
              <span>{file.path}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};