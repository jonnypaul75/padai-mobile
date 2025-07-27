// pdfWorkerSetup.ts
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Set workerSrc once here, early
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default pdfjsLib;