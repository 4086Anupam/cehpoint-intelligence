import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Card from '@/components/Card';
import TopBar from '@/components/TopBar';
import { isAuthenticated } from '@/lib/storage';
import { FileText, Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Discovery() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setFileName(file.name);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

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

      if (typeof window !== 'undefined') {
        const session = JSON.parse(localStorage.getItem('session') || '{}');
        session.businessProfile = profile;
        localStorage.setItem('session', JSON.stringify(session));
      }

      toast.success('Business profile extracted successfully!');
      
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
      e.target.value = '';
    }
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
                <label htmlFor="file-upload" className="block">
                  <div className={`border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
                    uploading 
                      ? 'border-gray-300 bg-gray-50' 
                      : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                  }`}>
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-sm font-medium text-gray-700">
                          Processing {fileName}...
                        </p>
                        <p className="text-xs text-gray-500">
                          Extracting and analyzing your business information
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-10 h-10 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, or TXT (max 10MB)
                        </p>
                      </div>
                    )}
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
