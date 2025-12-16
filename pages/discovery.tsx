import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Card from '@/components/Card';
import TopBar from '@/components/TopBar';
import { isAuthenticated, getSession, saveSession, getUser } from '@/lib/storage';
import { FileText, Upload, AlertCircle, CheckCircle, Loader, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Discovery() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;

    const ensureAuth = async () => {
      const authed = await isAuthenticated();
      if (!authed && mounted) {
        router.replace('/login');
      }
    };

    ensureAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleQuestionnaire = () => {
    router.push('/questionnaire');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Check by both MIME type and file extension for better compatibility
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
    
    if (!isValidType) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      console.log('Invalid file type:', file.type, 'Extension:', fileExtension);
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Store the file
    console.log('Setting selected file:', file.name);
    setSelectedFile(file);
    toast.success(`File "${file.name}" selected. Click "Analyze Document" to proceed.`);
    
    // Reset input value to allow re-selecting the same file
    e.target.value = '';
  };

  const handleAnalyzeDocument = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      

      const parseResponse = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData,
      });

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.error || 'Failed to parse file');
      }

      const { content, fileName: parsedFileName } = await parseResponse.json();

      const analyzeResponse = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, fileName: parsedFileName }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Failed to analyze document');
      }

      const profile = await analyzeResponse.json();

      // Save business profile to session using proper storage function
      const currentSession = getSession();
      const user = await getUser();
      saveSession({
        userId: currentSession?.userId || user?.id || '',
        lastUpdated: new Date().toISOString(),
        ...currentSession,
        businessProfile: profile
      });

      toast.success('Business profile extracted successfully!');
      
      // Clear selected file after successful processing
      setSelectedFile(null);
      
      setTimeout(() => {
        router.push({
          pathname: '/questionnaire',
          query: { fromUpload: 'true' }
        });
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to process your document. Please try again or use the questionnaire.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <TopBar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Discovery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your business information to receive AI-powered, personalized IT and security recommendations
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8 space-y-6">
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Upload Business Profile
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Save time by uploading your business profile document. Our AI will extract all the information and suggest tailored services for your needs.
              </p>
              
              <div className="max-w-md mx-auto">
                {!selectedFile ? (
                  <label htmlFor="file-upload" className="block">
                    <div className="border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-10 h-10 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, or TXT (max 10MB)
                        </p>
                      </div>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    {/* Selected file display */}
                    <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          disabled={uploading}
                          className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Analyze button */}
                    <Button 
                      fullWidth 
                      size="lg" 
                      onClick={handleAnalyzeDocument}
                      disabled={uploading}
                      variant="primary"
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="w-5 h-5 animate-spin" />
                          Analyzing Document...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Analyze Document
                        </span>
                      )}
                    </Button>

                    {uploading && (
                      <p className="text-xs text-center text-gray-500">
                        Extracting and analyzing your business information...
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Smart Information Extraction</h3>
                    <p className="text-sm text-blue-800">
                      Our AI analyzes your document to extract business details, challenges, goals, and technology needs. If any critical information is missing, you&apos;ll be prompted to provide it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 my-4">
              <div className="h-px bg-gray-300 w-20"></div>
              <span className="text-sm font-medium">OR</span>
              <div className="h-px bg-gray-300 w-20"></div>
            </div>
          </div>
          
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Complete Business Questionnaire
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Prefer to fill in details manually? Answer our comprehensive 7-section questionnaire to help us understand your business needs
              </p>
              <Button fullWidth size="lg" onClick={handleQuestionnaire} variant="outline">
                Start Questionnaire
              </Button>
            </div>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Our AI analyzes your business information comprehensively</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>We identify opportunities for automation, security, and growth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>You receive personalized service recommendations with clear business impact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Review a high-level project blueprint tailored to your needs</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
