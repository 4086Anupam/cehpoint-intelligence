import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TopBar from '@/components/TopBar';
import { getUser, isAuthenticated } from '@/lib/storage';
import type { User } from '@/types';
import { Sparkles, Mail, CalendarClock, Building2 } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        router.replace('/login');
        return;
      }
      const u = await getUser(true);
      if (mounted) {
        setUser(u);
        setLoading(false);
      }
    };

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 page-transition">
      <TopBar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">Your Profile</h1>
            <p className="text-lg text-gray-600 font-medium">Manage your personal and company details</p>
          </div>

          <Card className="mb-8 overflow-hidden !p-0 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 w-full relative">
              <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center shadow-inner">
                  <Building2 className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="pt-16 pb-8 px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{user?.companyName || 'Company Name'}</h2>
                <p className="text-sm text-gray-500 font-medium">Enterprise Account</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-4 hover:bg-blue-50/50 transition-colors">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="font-semibold text-gray-900 break-all">{user?.email || '—'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-4 hover:bg-blue-50/50 transition-colors">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Member Since</p>
                    <p className="font-semibold text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={() => router.back()} className="px-6">Back</Button>
            <Button variant="primary" onClick={() => router.push('/discovery')} className="shadow-lg shadow-indigo-200">Go to Discovery</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
