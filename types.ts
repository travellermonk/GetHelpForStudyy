
export interface Slide {
  slideNumber: number;
  title: string;
  bulletPoints: string[];
  visualSuggestion: string;
}

export interface PPTOutline {
  topic: string;
  presentationTitle: string;
  targetAudience: string;
  slides: Slide[];
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
