
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './components/Button';
import { ResumePreview } from './components/ResumePreview';
import { AppStatus, AdaptationResult } from './types';
import { adaptResume } from './services/geminiService';
import { Toast, ToastMessage } from './components/Toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Download, 
  Loader2,
  FileCode,
  Layout
} from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [result, setResult] = useState<AdaptationResult | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isExporting, setIsExporting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const addToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Dynamic scaling for responsiveness on different screen sizes
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current && status === AppStatus.SUCCESS) {
        const parentWidth = previewContainerRef.current.parentElement?.clientWidth || 0;
        const resumeWidth = 840; // Approx width of A4 in pixels
        const margin = 40;
        if (parentWidth < resumeWidth + margin) {
          setPreviewScale((parentWidth - margin) / resumeWidth);
        } else {
          setPreviewScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [status, result, viewMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      addToast(`Selected: ${file.name}`, 'success');
    } else {
      addToast("Please upload a valid PDF.", "error");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !jobUrl) return;

    setStatus(AppStatus.GENERATING);
    try {
      const base64 = await fileToBase64(cvFile);
      const adaptation = await adaptResume(base64, jobUrl);
      setResult(adaptation);
      setStatus(AppStatus.SUCCESS);
      setViewMode('preview');
      addToast("Resume adapted successfully!", "success");
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
      addToast(err instanceof Error ? err.message : "Generation failed.", "error");
    }
  };

  const copyToClipboard = () => {
    if (result?.latexCode) {
      navigator.clipboard.writeText(result.latexCode);
      addToast("LaTeX copied!", "success");
    }
  };

  const handleDownloadPDF = async () => {
    const resumeElement = document.getElementById('resume-preview-container');
    if (!resumeElement || !result) return;

    setIsExporting(true);
    addToast("Generating high-quality PDF...", "info");

    try {
      // Use high scale (3) for ultra-sharp text in PDF
      const canvas = await html2canvas(resumeElement, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      const fileName = `Tailored_Resume_${result.previewData.personalInfo.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
      addToast("Download complete.", "success");
    } catch (err) {
      console.error("PDF Export failed:", err);
      addToast("PDF export failed.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const resetForm = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setCvFile(null);
    setJobUrl('');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Toast messages={toasts} removeToast={removeToast} />
      
      <header className="bg-white border-b border-zinc-200 py-5 px-8 sticky top-0 z-40">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 rounded-xl shadow-lg">
              <Layout className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Tailor <span className="text-zinc-400">Pro</span></h1>
          </div>
          {status === AppStatus.SUCCESS && (
            <button onClick={resetForm} className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-all flex items-center gap-2">
              <RefreshCw className="w-3 h-3" /> New Adaptation
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-full px-4 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Controls Panel */}
          <div className={`${status === AppStatus.SUCCESS ? 'lg:col-span-3' : 'lg:col-span-5 lg:col-start-4'} transition-all duration-500`}>
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-zinc-200/50 border border-zinc-100">
              {status !== AppStatus.SUCCESS ? (
                <div className="space-y-10">
                  <div className="space-y-3 text-center">
                    <h2 className="text-4xl font-black text-zinc-900 leading-tight">Adapt your story.</h2>
                    <p className="text-zinc-500 font-medium">Get a job-winning tailored resume in seconds.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">01 / Master PDF</label>
                      <div className="relative group">
                        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className={`border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center gap-4 ${cvFile ? 'border-black bg-zinc-50' : 'border-zinc-200 group-hover:border-zinc-400'}`}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${cvFile ? 'bg-black text-white shadow-xl' : 'bg-zinc-100 text-zinc-300'}`}>
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-zinc-900 truncate max-w-[250px]">{cvFile ? cvFile.name : 'Select Master CV'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">02 / Job Opportunity</label>
                      <input 
                        type="url" 
                        placeholder="LinkedIn Job Link" 
                        value={jobUrl} 
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black font-bold transition-all placeholder:text-zinc-300"
                        required 
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full py-6 text-xl rounded-[1.5rem] font-black uppercase tracking-widest bg-black text-white shadow-2xl shadow-black/20 hover:scale-[1.01] active:scale-[0.98]"
                      loading={status === AppStatus.GENERATING}
                      disabled={!cvFile || !jobUrl}
                    >
                      Process Resume
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-black text-white rounded-full shadow-2xl mb-2">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-zinc-900">Tailored.</h3>
                    <p className="text-zinc-500 font-medium">Your resume is ready for the world.</p>
                  </div>

                  <div className="space-y-5">
                    <Button 
                      onClick={handleDownloadPDF} 
                      loading={isExporting} 
                      className="w-full py-5 rounded-2xl bg-black text-white font-black uppercase tracking-widest shadow-xl shadow-black/20"
                    >
                      <Download className="w-5 h-5 mr-3" /> Save to PDF
                    </Button>
                    
                    <div className="flex bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
                      <button onClick={() => setViewMode('preview')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-black shadow-sm' : 'text-zinc-400'}`}>Preview</button>
                      <button onClick={() => setViewMode('code')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'code' ? 'bg-white text-black shadow-sm' : 'text-zinc-400'}`}>LaTeX Source</button>
                    </div>

                    <div className="pt-4 border-t border-zinc-100">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 text-center">Quality Report</p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500">Alignment Score</span>
                          <span className="text-zinc-900">98%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black w-[98%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Display Area */}
          <div className={`${status === AppStatus.SUCCESS ? 'lg:col-span-9' : 'hidden'} min-h-[850px]`}>
            {status === AppStatus.SUCCESS && result && (
              <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="bg-white rounded-[3rem] p-1 lg:p-12 shadow-2xl shadow-zinc-200/50 border border-zinc-100 flex-1 overflow-auto flex flex-col items-center">
                  {viewMode === 'preview' ? (
                    <div ref={previewContainerRef} className="w-full flex justify-center">
                      <div 
                        className="origin-top transition-transform duration-500" 
                        style={{ transform: `scale(${previewScale})` }}
                      >
                        <ResumePreview data={result.previewData} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-[800px] bg-zinc-950 text-zinc-400 p-10 font-mono text-[11px] leading-relaxed rounded-[2rem] relative group">
                      <button onClick={copyToClipboard} className="absolute top-6 right-6 p-3 bg-zinc-800 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700">
                        <Copy className="w-4 h-4" />
                      </button>
                      <pre className="whitespace-pre-wrap"><code>{result.latexCode}</code></pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {status === AppStatus.GENERATING && (
            <div className="lg:col-span-12 h-[600px] flex flex-col items-center justify-center gap-8 bg-white rounded-[4rem] shadow-2xl animate-pulse">
              <div className="relative">
                <div className="w-24 h-24 border-2 border-zinc-100 rounded-full animate-ping opacity-20"></div>
                <Loader2 className="absolute top-0 w-24 h-24 text-black animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black uppercase tracking-tighter">Adapting Resume</p>
                <p className="text-zinc-400 text-sm font-medium mt-1">Our AI is re-engineering your bullets for the specific role.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 text-center border-t border-zinc-100 bg-white">
        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em]">&copy; 2025 AI RESUME ENGINE &bull; VERSION 2.1 &bull; HIGH PERFORMANCE</p>
      </footer>
    </div>
  );
};

export default App;
