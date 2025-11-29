export interface ImageState {
  data: string; // Base64 string including mime type header
  mimeType: string;
  name: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedContent {
  imageUrl?: string;
  text?: string;
}
