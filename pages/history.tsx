import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TopBar from '@/components/TopBar';
import { isAuthenticated, getUser, saveSession } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import type { User, AnalysisStatus } from '@/types';
import { 
  Sparkles, Calendar, Building2, FileText, ExternalLink, 
  ChevronRight, Clock, Search, ArrowLeft, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface AnalysisHistoryItem {
  id: string;
  company_name: string;
  status: AnalysisStatus;
  created_at: string;
  business_profile_pdf_url: string | null;
  error_message?: string | null;
}

interface FullAnalysis {
  id: string;
  user_id: string;
  company_name: string;
  status: AnalysisStatus;
  parsed_data: any;
  business_profile: any;
  recommendations: any[];
  project_blueprint: any;
  business_profile_pdf_url: string | null;
  created_at: string;
}

export default function History() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        router.replace('/login');
        return;
      }

      if (!mounted) return;

      const currentUser = await getUser(true);
      if (mounted) {
        setUser(currentUser);
        if (currentUser) {
          await fetchHistory(currentUser.id);
        }
        setLoading(false);
      }
    };

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [router]);

  const fetchHistory = async (userId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/analysis-history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setHistoryItems(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load analysis history');
    }
  };

  const handleViewAnalysis = async (item: AnalysisHistoryItem) => {
    setLoadingAnalysis(item.id);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/analysis-history?id=${item.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const analysis: FullAnalysis = await response.json();
      
      // Handle based on status
      if (analysis.status === 'pending' || analysis.status === 'failed') {
        // For pending/failed, load the parsed data and go to questionnaire
        const profileData = analysis.parsed_data || analysis.business_profile;
        
        if (!profileData) {
          toast.error('No profile data found. Please upload again.');
          return;
        }
        
        saveSession({
          userId: user?.id || '',
          businessProfile: profileData,
          pendingAnalysisId: analysis.id,
          uploadedFile: analysis.business_profile_pdf_url ? {
            name: 'uploaded-document.pdf',
            type: 'application/pdf',
            content: analysis.business_profile_pdf_url,
          } : undefined,
          lastUpdated: analysis.created_at,
        });

        toast.success('Loading profile for analysis...');
        
        // Navigate to questionnaire to complete analysis
        router.push({
          pathname: '/questionnaire',
          query: { fromUpload: 'true', retryAnalysis: item.id }
        });
      } else {
        // For completed, go to dashboard
        saveSession({
          userId: user?.id || '',
          businessProfile: analysis.business_profile,
          recommendations: analysis.recommendations,
          projectBlueprint: analysis.project_blueprint,
          lastUpdated: analysis.created_at,
        });

        toast.success('Loading analysis...');
        
        router.push({
          pathname: '/dashboard',
          query: { analysisId: item.id }
        });
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
      toast.error('Failed to load analysis');
    } finally {
      setLoadingAnalysis(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const filteredItems = historyItems.filter(item =>
    item.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 page-transition">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          success: { duration: 2000 },
          error: { duration: 4000 },
        }}
      />
      <TopBar />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
              </div>
              <p className="text-gray-600 ml-12">
                View and manage your past business analyses
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => router.push('/discovery')}
            >
              <Sparkles className="w-4 h-4" />
              New Analysis
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              />
            </div>
          </div>

          {/* History List */}
          {filteredItems.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No matching analyses found' : 'No analyses yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try a different search term'
                  : 'Start by creating your first business analysis'
                }
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={() => router.push('/discovery')}>
                  <Sparkles className="w-4 h-4" />
                  Create First Analysis
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleViewAnalysis(item)}
                  className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${
                    item.status === 'pending' 
                      ? 'border-yellow-200 hover:border-yellow-400' 
                      : item.status === 'failed'
                      ? 'border-red-200 hover:border-red-400'
                      : 'border-transparent hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                        item.status === 'pending'
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : item.status === 'failed'
                          ? 'bg-gradient-to-br from-red-400 to-red-600'
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      }`}>
                        {item.status === 'pending' ? (
                          <Loader2 className="w-6 h-6" />
                        ) : item.status === 'failed' ? (
                          <AlertCircle className="w-6 h-6" />
                        ) : (
                          <Building2 className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.company_name}
                          </h3>
                          {/* Status Badge */}
                          {item.status === 'pending' && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                              Pending Analysis
                            </span>
                          )}
                          {item.status === 'failed' && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                              Analysis Failed
                            </span>
                          )}
                          {item.status === 'completed' && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(item.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatRelativeTime(item.created_at)}
                          </span>
                        </div>
                        {item.status === 'failed' && item.error_message && (
                          <p className="text-xs text-red-600 mt-1">
                            Error: {item.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {item.business_profile_pdf_url && (
                        <a
                          href={item.business_profile_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View uploaded document"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      <div className={`flex items-center gap-2 ${
                        item.status === 'pending' || item.status === 'failed'
                          ? 'text-orange-600'
                          : 'text-indigo-600'
                      }`}>
                        {loadingAnalysis === item.id ? (
                          <Sparkles className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span className="text-sm font-medium">
                              {item.status === 'pending' || item.status === 'failed' 
                                ? 'Analyze' 
                                : 'View'}
                            </span>
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {historyItems.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-500">
              Showing {filteredItems.length} of {historyItems.length} analyses
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
