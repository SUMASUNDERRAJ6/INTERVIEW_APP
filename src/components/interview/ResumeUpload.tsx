import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile?: File;
}

export const ResumeUpload = ({ onFileUpload, uploadedFile }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      onFileUpload(file);
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: isUploading || !!uploadedFile,
  });

  if (uploadedFile) {
    return (
      <Card className="border-success bg-success/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-success" />
            <div>
              <p className="font-medium text-success">Resume uploaded successfully!</p>
              <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50",
      isDragActive && "border-primary bg-primary/5",
      isUploading && "pointer-events-none opacity-50"
    )}>
      <CardContent className="p-8">
        <div {...getRootProps()} className="text-center">
          <input {...getInputProps()} />
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          
          {isUploading ? (
            <div>
              <p className="text-lg font-medium mb-2">Uploading your resume...</p>
              <p className="text-muted-foreground">Please wait while we process your file</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </p>
              <p className="text-muted-foreground mb-4">
                Drag and drop your resume, or click to browse
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Supports PDF and DOCX files</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};