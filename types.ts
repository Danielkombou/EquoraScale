
export enum FileStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum DocumentType {
  RFQ = 'RFQ',
  PO = 'PO',
  QUOTATION = 'QUOTATION',
  INVOICE = 'INVOICE',
  GENERAL = 'GENERAL'
}

export interface FileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string; 
  createdAt: string;
  dueDate?: string;
  status: FileStatus;
  docType: DocumentType;
  tags: string[];
  content?: string; 
  summary?: string;
  blobUrl?: string; 
  isClassifying?: boolean; // Flag to show "Classifying..." in UI
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface AppState {
  files: FileRecord[];
  currentUser: User | null;
  isAuthenticated: boolean;
}

export enum ViewMode {
  EXPLORER = 'EXPLORER',
  TABLE = 'TABLE'
}
