'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = 'login' | 'signup';

export default function AuthModal({ onClose }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    const err = mode === 'login'
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);

    setLoading(false);

    if (err) {
      setError(err);
    } else if (mode === 'signup') {
      setSuccess(true);
    } else {
      onClose();
    }
  };

  const content = (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      <div
        className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div
          className="pointer-events-auto w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle mobile */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-zinc-200 rounded-full" />
          </div>

          <div className="px-6 pt-4 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">
                  {mode === 'login' ? 'Entrar' : 'Criar conta'}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {mode === 'login'
                    ? 'Acesse seus favoritos em qualquer dispositivo'
                    : 'Salve seus locais preferidos'
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center text-zinc-500 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">📬</div>
                <p className="font-semibold text-zinc-900 mb-1">Verifique seu email</p>
                <p className="text-sm text-zinc-400">
                  Enviamos um link de confirmação para <strong>{email}</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-2.5 py-3 border border-zinc-200 rounded-2xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-all active:scale-95"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-xs text-zinc-400">ou</span>
                  <div className="flex-1 h-px bg-zinc-100" />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="w-full pl-9 pr-4 py-3 bg-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500 px-1">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !email || !password}
                  className="w-full py-3.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold text-sm transition-all active:scale-95 shadow-sm shadow-green-200"
                >
                  {loading
                    ? <Loader2 size={16} className="animate-spin mx-auto" />
                    : mode === 'login' ? 'Entrar' : 'Criar conta'
                  }
                </button>

                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                  className="w-full text-xs text-zinc-400 hover:text-zinc-700 transition-colors py-1"
                >
                  {mode === 'login'
                    ? 'Não tem conta? Criar agora'
                    : 'Já tem conta? Entrar'
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}