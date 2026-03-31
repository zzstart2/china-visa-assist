import { useState, useRef } from 'react';
import './FileUploader.css';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesChange?: (files: File[]) => void;
  label?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
}

function FileUploader({ 
  accept = '*', 
  multiple = true, 
  maxSize = 10,
  onFilesChange,
  label = 'Drag files here or click to upload'
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generatePreview = (file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const validFiles: UploadedFile[] = [];
    
    Array.from(newFiles).forEach(file => {
      if (file.size <= maxSize * 1024 * 1024) {
        validFiles.push({
          file,
          preview: generatePreview(file)
        });
      }
    });
    
    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(f => f.file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated.map(f => f.file));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="file-uploader">
      <div 
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <div className="upload-icon">📁</div>
        <p className="upload-label">{label}</p>
        <p className="upload-hint">Max file size: {maxSize}MB</p>
      </div>
      
      {files.length > 0 && (
        <div className="file-list">
          {files.map((item, index) => (
            <div key={index} className="file-item">
              {item.preview ? (
                <img src={item.preview} alt={item.file.name} className="file-preview" />
              ) : (
                <div className="file-icon">📄</div>
              )}
              <div className="file-info">
                <span className="file-name">{item.file.name}</span>
                <span className="file-size">{formatSize(item.file.size)}</span>
              </div>
              <button 
                type="button"
                className="file-remove"
                onClick={() => removeFile(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUploader;