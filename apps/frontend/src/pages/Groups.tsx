import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Users, Lock, Globe } from 'lucide-react';
import { groupsAPI } from '../services/api';
import CreateGroupModal from '../components/groups/CreateGroupModal';

interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isPrivate: boolean;
  isMember: boolean;
  membersCount: number;
  postsCount: number;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await groupsAPI.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary">
      {/* Header */}
      <div className="sticky top-0 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/10 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/5 rounded-full transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black">Groups</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Create Group</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">Loading groups...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <p className="text-text-muted text-lg">No groups found</p>
            <p className="text-text-secondary text-sm mt-2">
              {searchQuery ? 'No groups match your search' : 'Create the first group!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/group/${group.id}`)}
                className="bg-[#1a1a1a] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-orange-500/50 transition-all group"
              >
                {/* Cover */}
                <div className="h-32 bg-gradient-to-br from-orange-500/20 to-purple-500/20 relative">
                  {group.avatar ? (
                    <img src={group.avatar} alt={group.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-text-primary/20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {group.isPrivate ? (
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1 text-xs">
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1 text-xs">
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-black text-xl text-text-primary mb-2 group-hover:text-orange-500 transition-colors">
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="text-sm text-text-muted line-clamp-2 mb-4">{group.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-text-muted">
                      <span>{group.membersCount} members</span>
                      <span>{group.postsCount} posts</span>
                    </div>
                    {group.isMember && (
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-lg text-xs font-bold">
                        Member
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={loadGroups}
      />
    </div>
  );
};

export default Groups;
