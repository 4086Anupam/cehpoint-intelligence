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
import toast from 'react-hot-toast';

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
      <TopBar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="!p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analysis History</h1>
            </div>
            <p className="text-gray-500 ml-14 font-medium">
              View and manage your past business analyses
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/discovery')}
            className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search history by company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md transition-all placeholder:text-gray-400 text-gray-900"
            />
          </div>
        </div>

        {/* History List */}
        {filteredItems.length === 0 ? (
          <Card className="text-center py-20 bg-white/50 backdrop-blur-sm border-dashed border-2 border-gray-200 shadow-none">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-gray-50/50">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No matching analyses found' : 'No analyses yet'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              {searchTerm
                ? 'Try a different search term or check for typos'
                : 'Start by creating your first business analysis to get insights'
              }
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={() => router.push('/discovery')}>
                <Sparkles className="w-4 h-4 mr-2" />
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
                className={`group bg-white rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${item.status === 'pending'
                    ? 'border-yellow-200 hover:border-yellow-300'
                    : item.status === 'failed'
                      ? 'border-red-200 hover:border-red-300'
                      : 'border-gray-100 hover:border-indigo-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${item.status === 'pending'
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-200'
                        : item.status === 'failed'
                          ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200'
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200'
                      }`}>
                      {item.status === 'pending' ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : item.status === 'failed' ? (
                        <AlertCircle className="w-7 h-7" />
                      ) : (
                        <Building2 className="w-7 h-7" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {item.company_name}
                        </h3>
                        {/* Status Badge */}
                        {item.status === 'pending' && (
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full">
                            Pending
                          </span>
                        )}
                        {item.status === 'failed' && (
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-100 rounded-full">
                            Failed
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-600 border border-green-100 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(item.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </div>

                      {item.status === 'failed' && item.error_message && (
                        <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded-lg inline-block border border-red-100 max-w-md">
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
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="View uploaded document"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${item.status === 'pending' || item.status === 'failed'
                        ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
                        : 'bg-gray-50 text-gray-600 group-hover:bg-indigo-600 group-hover:text-white'
                      }`}>
                      {loadingAnalysis === item.id ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span className="text-sm font-semibold">
                            {item.status === 'pending' || item.status === 'failed'
                              ? 'Analyze'
                              : 'View Report'}
                          </span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
              Showing {filteredItems.length} of {historyItems.length} analyses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
