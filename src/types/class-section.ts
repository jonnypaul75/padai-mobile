import type { ApiResponse } from "./common";

export interface ClassResponseData {
    class_id: number;
    class_name: string;
}
export type ClassApiResponse = ApiResponse<ClassResponseData[]>;


export interface SubjectResponseData {
    subject_id: number;
    subject_name: string;
}
export type SubjectApiResponse = ApiResponse<SubjectResponseData[]>;

export interface ChapterResponseData {
    chapter_id: number;
    subject_id: number;
    chapter_name: string;
    created_by: string | null;
    created_on: string;  // Date string like "/Date(-62135596800000)/"
    updated_by: string | null;
    updated_on: string;  // Date string like "/Date(-62135596800000)/"
}

export type ChapterApiResponse = ApiResponse<ChapterResponseData[]>;