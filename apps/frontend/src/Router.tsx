import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Groups from './pages/Groups';
import Group from './pages/Group';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group/:groupId" element={<Group />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
