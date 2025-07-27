// PdfViewer.tsx
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

interface PdfViewerProps {
    fileUrl: string | Uint8Array;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl }) => {
    const toolbarPluginInstance = toolbarPlugin();

    const { Toolbar } = toolbarPluginInstance;

  // ✅ Set scroll mode to horizontal on mount


    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                <Toolbar />
            </div>
            <div style={{ flex: 1 }}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
<Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                </Worker>
            </div>
        </div>
    );
};

export default PdfViewer;
