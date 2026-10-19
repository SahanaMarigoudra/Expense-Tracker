import React, { useState } from 'react';
import { X, User, Camera, Sparkles, Check } from 'lucide-react';

export type UserProfile = {
  name: string;
  tag: string;
  avatarUrl?: string;
  avatarColor: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
};

const COLOR_OPTIONS = [
  'from-violet-700 to-indigo-600',
  'from-emerald-600 to-teal-500',
  'from-rose-600 to-pink-500',
  'from-amber-600 to-orange-500',
  'from-cyan-600 to-blue-500',
  'from-fuchsia-600 to-purple-600',
];

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: Props) {
  const [name, setName] = useState(profile.name);
  const [tag, setTag] = useState(profile.tag);
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');

  if (!isOpen) return null;

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || 'User',
      tag: tag.trim() || 'Personal Account',
      avatarColor,
      avatarUrl: avatarUrl || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="rounded-3xl border w-full max-w-md shadow-2xl overflow-hidden bg-[#1C183D] border-[#2D265C] text-white">
        {/* Header */}
        <div className="p-6 border-b border-[#2D265C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 text-violet-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold">Edit Profile</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-semibold">
          {/* Avatar Preview & Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div
                className={`w-24 h-24 rounded-full ring-4 ring-violet-500/40 overflow-hidden bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white text-3xl font-black shadow-xl`}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-white"
                title="Upload Photo"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Change</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Direct upload and remove buttons */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="avatar-upload"
                className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 text-[11px] font-bold cursor-pointer transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </label>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-normal">
              Supported formats: JPG, PNG, WEBP (Max 5MB)
            </span>
          </div>

          {/* Color Gradients */}
          <div>
            <label className="block text-slate-400 mb-2">Avatar Theme Color</label>
            <div className="flex items-center justify-center gap-2.5">
              {COLOR_OPTIONS.map((grad, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setAvatarColor(grad);
                    setAvatarUrl('');
                  }}
                  className={`w-8 h-8 rounded-full bg-gradient-to-tr ${grad} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                    avatarColor === grad && !avatarUrl ? 'ring-2 ring-white scale-110' : ''
                  }`}
                >
                  {avatarColor === grad && !avatarUrl && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-slate-400 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Tag / Subtitle */}
          <div>
            <label className="block text-slate-400 mb-1">Account Subtitle / Tag</label>
            <input
              type="text"
              value={tag}
              onChange={e => setTag(e.target.value)}
              placeholder="e.g. Personal Account, Business, Investor"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Currency Display (Read-only notice) */}
          <div className="p-3 rounded-xl bg-[#120F2D] border border-[#2D265C] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Primary Currency</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              ₹ INR (Indian Rupee)
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2D265C]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition cursor-pointer active:scale-95"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
