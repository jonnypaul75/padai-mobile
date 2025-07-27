// Root interface
export interface ChapterDataResponse {
    chapters: Chapter[];
  }
  
  // Each chapter
  export interface Chapter {
    id: string;
    title: string;
    info?: string;
    image: string;
    content?: ChapterContent;
  }
  
  // Chapter content with dynamic resource categories
  export interface ChapterContent {
    resources: Record<string, ResourceItem[]>;
  }
  
  // Generic resource item, allowing for multiple types
  export interface ResourceItem {
    id: string;
    name: string;
    url?: string;
    content?: string; // For embedded types like 'json'
    contentType: ContentType;
    language?: string;
    script?: string;
    htmlView ?: string;
  }
  
  export type ContentType =
    | "web-link"
    | "html"
    | "youtube-video"
    | "video"
    | "interactive"; // e.g., quizzes, flashcards
  
  export type Language = {
    code: string;
    name: string;
    script: string;
  };
  
  export type LanguageData = {
    languages: Language[];
  };
  
  export type LanguageOption = {
  value: string;
  label: string;
  script: string;
};
