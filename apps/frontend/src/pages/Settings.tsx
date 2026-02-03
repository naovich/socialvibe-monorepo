import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Eye, Globe, Palette, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useSocialStore } from '../store';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, logout } = useSocialStore();
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    friends: true,
    stories: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Header */}
      <div className="sticky top-0 bg-bg-card/80 backdrop-blur-md border-b border-border-primary z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-bg-secondary rounded-full transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Notifications */}
        <section className="bg-bg-card border border-border-primary rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-warning" />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-text-secondary capitalize">{key}</span>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    value ? 'bg-warning' : 'bg-bg-tertiary'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-bg-primary rounded-full transition-transform ${
                      value ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-bg-card border border-border-primary rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-info" />
            <h2 className="text-xl font-bold">Privacy & Security</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-text-muted group-hover:text-text-primary" />
                <span className="text-text-secondary group-hover:text-text-primary">Account Privacy</span>
              </div>
              <span className="text-text-muted text-sm">Public</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-text-muted group-hover:text-text-primary" />
                <span className="text-text-secondary group-hover:text-text-primary">Blocked Accounts</span>
              </div>
              <span className="text-text-muted text-sm">0</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-text-muted group-hover:text-text-primary" />
                <span className="text-text-secondary group-hover:text-text-primary">Change Password</span>
              </div>
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-bg-card border border-border-primary rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary mb-3">Theme</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary-light'
                      : 'border-border-primary hover:border-border-hover'
                  }`}
                >
                  <div className="w-full h-16 bg-bg-primary rounded-lg mb-2" />
                  <span className="text-sm font-bold">Dark</span>
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary-light'
                      : 'border-border-primary hover:border-border-hover'
                  }`}
                >
                  <div className="w-full h-16 bg-bg-primary rounded-lg mb-2" />
                  <span className="text-sm font-bold">Light</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="bg-bg-card border border-border-primary rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-success" />
            <h2 className="text-xl font-bold">Language & Region</h2>
          </div>

          <button className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary rounded-xl transition-all group">
            <span className="text-text-secondary group-hover:text-text-primary">Language</span>
            <span className="text-text-muted text-sm">English (US)</span>
          </button>
        </section>

        {/* Help */}
        <section className="bg-bg-card border border-border-primary rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-warning" />
            <h2 className="text-xl font-bold">Help & Support</h2>
          </div>

          <div className="space-y-2">
            <button className="w-full text-left p-4 hover:bg-bg-secondary rounded-xl transition-all text-text-secondary hover:text-text-primary">
              Help Center
            </button>
            <button className="w-full text-left p-4 hover:bg-bg-secondary rounded-xl transition-all text-text-secondary hover:text-text-primary">
              Privacy Policy
            </button>
            <button className="w-full text-left p-4 hover:bg-bg-secondary rounded-xl transition-all text-text-secondary hover:text-text-primary">
              Terms of Service
            </button>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-error/10 hover:bg-error/20 border border-error/20 hover:border-error/30 rounded-3xl transition-all group"
        >
          <LogOut className="w-5 h-5 text-error" />
          <span className="font-bold text-error">Logout</span>
        </button>

        {/* Version */}
        <p className="text-center text-text-disabled text-sm py-4">
          SocialVibe v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
