import { getErrorMessage } from '../../utils/error-utils';
import React, { useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { useSocialStore } from '../../store';
import { usersAPI, uploadAPI } from '../../services/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser } = useSocialStore();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || '',
    coverImage: currentUser?.coverImage || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const url = await uploadAPI.uploadImage(file);
      setFormData({ ...formData, avatar: url });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadAPI.uploadImage(file);
      setFormData({ ...formData, coverImage: url });
    } catch (error) {
      console.error('Failed to upload cover:', error);
      alert('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await usersAPI.updateMe(formData);
      setCurrentUser({
        ...currentUser,
        name: updated.name,
        bio: updated.bio,
        avatar: updated.avatar,
        coverImage: updated.coverImage,
      });
      onClose();
    } catch (error: unknown) {
      console.error('Failed to update profile:', error);
      alert(getErrorMessage(error, 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-black text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Cover Image
            </label>
            <div className="relative h-48 rounded-2xl overflow-hidden bg-white/5 group">
              <img
                src={formData.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'}
                className="w-full h-full object-cover"
                alt="Cover"
              />
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-white">
                  {uploadingCover ? (
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8" />
                      <span className="text-sm font-bold">Change Cover</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                />
              </label>
            </div>
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={formData.avatar}
                  className="w-24 h-24 rounded-full border-4 border-[#1a1a1a] object-cover"
                  alt="Avatar"
                />
                <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                  {uploadingAvatar ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
              <div className="text-sm text-gray-400">
                <p>Click to upload new avatar</p>
                <p className="text-xs">JPG, PNG or GIF (max 10MB)</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
              placeholder="Tell us about yourself..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.bio.length}/200
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 rounded-xl font-bold text-white transition-all disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
