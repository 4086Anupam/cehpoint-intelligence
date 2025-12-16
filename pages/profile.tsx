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
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600">Manage your account details</p>
          </div>

          <Card className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-xl font-bold text-gray-900">{user?.companyName || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{user?.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarClock className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            <Button variant="primary" onClick={() => router.push('/discovery')}>Go to Discovery</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
