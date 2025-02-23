// src/components/LoginModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function LoginModal() {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, closeLoginModal } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email"
            required 
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required 
          />
          <div className="modal-actions">
            <button type="submit">Login</button>
            <button type="button" onClick={closeLoginModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;