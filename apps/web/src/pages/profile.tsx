import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { api } from '../utils/api';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email ?? '';

  // redirect if not authed
  useEffect(() => {
    if (status === 'unauthenticated') signIn('credentials');
  }, [status]);

  // mutation
  const changePwd = api.user.changePassword.useMutation({
    onSuccess: () => {
      setBanner({ type: 'success', message: 'Password changed!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err) => {
      setBanner({ type: 'error', message: err.message });
    },
  });

  // form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // banner state
  const [banner, setBanner] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  const handleChangePassword = () => {
    // simple front-end sanity checks
    if (!currentPassword) {
      setBanner({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (newPassword.length < 6) {
      setBanner({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setBanner({
        type: 'error',
        message: 'New password needs uppercase, lowercase & a symbol.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setBanner({ type: 'error', message: "Passwords don't match." });
      return;
    }

    // pass to backend
    changePwd.mutate({ currentPassword, newPassword, confirmPassword });
  };

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading…</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-6 py-12 space-y-6"
    >
      <h1 className="text-2xl font-semibold text-center">Profile</h1>

      {/* EMAIL */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-1">Email</h2>
        <p className="text-gray-700 break-all">{email}</p>
      </div>

      {/* BANNER */}
      {banner && (
        <div
          className={`
            rounded-lg px-4 py-2 text-center
            ${banner.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}
        >
          {banner.message}
        </div>
      )}

      {/* CHANGE PASSWORD */}
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-800">Change Password</h2>

        <div className="space-y-4">
          {[
            { label: 'Current password',       value: currentPassword,    onChange: setCurrentPassword },
            { label: 'New password',           value: newPassword,        onChange: setNewPassword },
            { label: 'Confirm new password',   value: confirmPassword,    onChange: setConfirmPassword },
          ].map(({ label, value, onChange }) => (
            <div key={label} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <input
                type="password"
                value={value}
                onChange={e => {
                  setBanner(null); // clear banner as soon as user types
                  onChange(e.target.value);
                }}
                className="h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                placeholder="••••••••"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleChangePassword}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </motion.div>
  );
}
