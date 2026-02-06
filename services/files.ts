import { apiFetch } from './api';
import { FileRecord, DocumentType, FileStatus } from '../types';

// Backend file response types
export interface BackendFile {
  id: number;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  ocrText?: string | null;
  folder?: {
    id: number;
    name: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendFolder {
  id: number;
  name: string;
  type: 'folder';
  createdAt?: string;
  updatedAt?: string;
  children?: (BackendFile | BackendFolder)[];
}

export interface FileListResponse {
  type: 'root' | 'folder';
  data: {
    folders?: BackendFolder[];
    files?: BackendFile[];
    id?: number;
    name?: string;
    children?: (BackendFile | BackendFolder)[];
  };
}

export interface UploadResponse {
  message: string;
  file: BackendFile;
  textExtracted: boolean;
  extractedTextLength: number;
}

export interface UploadMultipleResponse {
  message: string;
  successful: UploadResponse[];
  failed: Array<{
    fileName: string;
    error: string;
  }>;
  totalFiles: number;
  successfulCount: number;
  failedCount: number;
}

export interface UploadFolderResponse {
  message: string;
  jobId?: string;
  totalFiles?: number;
  status?: string;
  progressUrl?: string;
  successful?: UploadResponse[];
  failed?: Array<{ fileName: string; error: string }>;
  foldersCreated?: number;
  successfulCount?: number;
  failedCount?: number;
}

export interface JobStatusResponse {
  jobId: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress: {
    processed: number;
    total: number;
    percentage: number;
  };
  data?: {
    files?: BackendFile[];
    folderPath?: string;
  };
  result?: {
    message: string;
    successful: UploadResponse[];
    failed: Array<{ fileName: string; error: string }>;
  };
  failedReason?: string | null;
  attemptsMade: number;
  timestamp: number;
}

export interface ExtractTextResponse {
  message: string;
  extractedText: string;
  fileName: string;
  hasText: boolean;
}

// Convert backend file to frontend FileRecord
const mapBackendFileToFileRecord = (file: BackendFile, folderPath: string = 'Root'): FileRecord => {
  // Determine document type from filename or content (basic heuristic)
  let docType = DocumentType.GENERAL;
  const name = file.originalName.toLowerCase();
  if (name.includes('rfq') || name.includes('request for quotation')) {
    docType = DocumentType.RFQ;
  } else if (name.includes('po') || name.includes('purchase order')) {
    docType = DocumentType.PO;
  } else if (name.includes('quotation') || name.includes('quote')) {
    docType = DocumentType.QUOTATION;
  } else if (name.includes('invoice')) {
    docType = DocumentType.INVOICE;
  }

  return {
    id: String(file.id),
    name: file.originalName,
    type: file.mimeType,
    size: file.size,
    path: folderPath,
    createdAt: file.createdAt || new Date().toISOString(),
    status: FileStatus.COMPLETED,
    docType,
    tags: [],
    content: file.ocrText || undefined,
    blobUrl: file.path, // Use the Supabase URL as blob URL
  };
};

// List files and folders
export const listFiles = async (folderId?: number): Promise<FileListResponse> => {
  const query = folderId ? `?folderId=${folderId}` : '';
  return apiFetch<FileListResponse>(`/files/list${query}`, {
    method: 'GET',
  });
};

// Convert backend structure to flat FileRecord array
export const flattenFileStructure = (
  structure: FileListResponse,
  parentPath: string = 'Root'
): FileRecord[] => {
  const files: FileRecord[] = [];
  
  const processFolder = (folder: BackendFolder | BackendFile, currentPath: string) => {
    if ('type' in folder && folder.type === 'folder') {
      const folderPath = `${currentPath}/${folder.name}`;
      if (folder.children) {
        folder.children.forEach((item) => {
          if ('type' in item && item.type === 'folder') {
            processFolder(item as BackendFolder, folderPath);
          } else {
            files.push(mapBackendFileToFileRecord(item as BackendFile, folderPath));
          }
        });
      }
    } else {
      files.push(mapBackendFileToFileRecord(folder as BackendFile, currentPath));
    }
  };

  if (structure.type === 'root' && structure.data.folders) {
    structure.data.folders.forEach((folder) => {
      processFolder(folder, parentPath);
    });
  }
  
  if (structure.data.files) {
    structure.data.files.forEach((file) => {
      files.push(mapBackendFileToFileRecord(file, parentPath));
    });
  }

  if (structure.type === 'folder' && structure.data.children) {
    structure.data.children.forEach((item) => {
      if ('type' in item && item.type === 'folder') {
        processFolder(item as BackendFolder, `${parentPath}/${structure.data.name || ''}`);
      } else {
        files.push(mapBackendFileToFileRecord(item as BackendFile, `${parentPath}/${structure.data.name || ''}`));
      }
    });
  }

  return files;
};

// Get single file by ID
export const getFile = async (id: number): Promise<BackendFile> => {
  return apiFetch<BackendFile>(`/files/${id}`, {
    method: 'GET',
  });
};

// Upload single file
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiFetch<UploadResponse>('/files/upload', {
    method: 'POST',
    body: formData,
  });
};

// Upload multiple files
export const uploadMultipleFiles = async (files: File[]): Promise<UploadMultipleResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  return apiFetch<UploadMultipleResponse>('/files/upload-multiple', {
    method: 'POST',
    body: formData,
  });
};

// Upload folder structure
export const uploadFolder = async (
  files: File[],
  folderPath?: string
): Promise<UploadFolderResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  if (folderPath) {
    formData.append('folderPath', folderPath);
  }
  
  return apiFetch<UploadFolderResponse>('/files/upload-folder', {
    method: 'POST',
    body: formData,
  });
};

// Extract text from file
export const extractText = async (file: File): Promise<ExtractTextResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiFetch<ExtractTextResponse>('/files/extract-text', {
    method: 'POST',
    body: formData,
  });
};

// Delete file
export const deleteFile = async (id: number): Promise<void> => {
  await apiFetch(`/files/${id}`, {
    method: 'DELETE',
  });
};

// Rename file
export const renameFile = async (id: number, newName: string): Promise<BackendFile> => {
  return apiFetch<BackendFile>(`/files/${id}/rename`, {
    method: 'PATCH',
    body: { name: newName },
  });
};

// Get job status
export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  return apiFetch<JobStatusResponse>(`/files/job/${jobId}`, {
    method: 'GET',
  });
};

// Upload chunk (experimental)
export const uploadChunk = async (
  chunk: File,
  chunkIndex: number,
  totalChunks: number,
  uploadId: string,
  folderPath?: string
): Promise<any> => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('chunkIndex', String(chunkIndex));
  formData.append('totalChunks', String(totalChunks));
  formData.append('uploadId', uploadId);
  if (folderPath) {
    formData.append('folderPath', folderPath);
  }
  
  return apiFetch('/files/upload-chunk', {
    method: 'POST',
    body: formData,
  });
};
