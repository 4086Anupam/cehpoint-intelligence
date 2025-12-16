import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sparkles, User as UserIcon, LogOut, IdCard } from 'lucide-react';
import { getUser, logout } from '@/lib/storage';
import type { User } from '@/types';
import toast from 'react-hot-toast';

export default function TopBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    getUser()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch((error) => console.error('Failed to load user', error));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const displayName = user?.companyName || 'Profile';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.replace('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
    }
  };

  return (
    <header className="sticky top-4 z-30 mx-4 md:mx-8 bg-white/85 backdrop-blur-lg border border-gray-200 rounded-xl shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/discovery" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">Cehpoint</p>
            <p className="text-xs text-gray-500">AI-Powered Solutions</p>
          </div>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 hover:opacity-80 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-gray-900 line-clamp-1">{displayName}</p>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">Welcome back</p>
              </div>
              <div className="flex flex-col">
                <button
                  className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 text-gray-800"
                  onClick={() => {
                    setOpen(false);
                    router.push('/profile');
                  }}
                >
                  <IdCard className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold">View Profile</span>
                </button>
                <button
                  className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
