import { getErrorMessage } from '../../utils/error-utils';
import React, { useState } from 'react';
import { X, Users, Lock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groupsAPI } from '../../services/api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      setLoading(true);
      await groupsAPI.create({
        name: name.trim(),
        description: description.trim() || undefined,
        isPrivate,
      });

      onCreated();
      onClose();
      setName('');
      setDescription('');
      setIsPrivate(false);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create group'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#1a1a1a] rounded-3xl max-w-lg w-full border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-xl">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-black text-white">Create Group</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Group Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                maxLength={50}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <p className="text-xs text-gray-500 mt-1">{name.length}/50</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this group about?"
                rows={4}
                maxLength={200}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/200</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">Privacy</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    !isPrivate
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Globe className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="font-bold text-sm">Public</p>
                  <p className="text-xs text-gray-500 mt-1">Anyone can join</p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    isPrivate
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Lock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="font-bold text-sm">Private</p>
                  <p className="text-xs text-gray-500 mt-1">Invite only</p>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || loading}
                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
              >
                {loading ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateGroupModal;
