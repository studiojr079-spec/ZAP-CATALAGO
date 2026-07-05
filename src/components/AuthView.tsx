/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, ArrowRight, Check, Key, Shield, HelpCircle, LogOut, LayoutGrid } from 'lucide-react';
import { AppUser, Store } from '../types';
// import { auth } from '../lib/firebase';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getUserProfile, saveUserProfile, getUserProfileByEmail, saveStore, generateSlug, saveCategory, saveProduct } from '../lib/db';
import { INITIAL_STORE, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../lib/initialData';

interface AuthViewProps {
  onLoginSuccess: (user: AppUser) => void;
  currentUser: AppUser | null;
  onLogout: () => void;
}

export default function AuthView({ onLoginSuccess, currentUser, onLogout }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (currentUser) {
    return (
      <div id="profile-container" className="p-8 max-w-md mx-auto bg-[#18121e] rounded-[32px] shadow-2xl border border-white/5 mt-10">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#FF2D7A] to-[#ff5d9e] rounded-full flex items-center justify-center mx-auto text-white text-3xl font-black shadow-lg shadow-[#FF2D7A]/20">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-black text-white mt-6 tracking-tight">{currentUser.name}</h2>
          <p className="text-[#8E8E93] text-sm mt-1 font-medium">{currentUser.email}</p>
          <span className="inline-block px-4 py-1.5 bg-[#FF2D7A]/10 text-[#FF2D7A] rounded-full text-[10px] font-black mt-4 uppercase tracking-widest border border-[#FF2D7A]/20">
            Plano Pro Ativo
          </span>
        </div>

        <div className="space-y-4 border-t border-white/5 pt-8">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#8E8E93]" />
              <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Cargo</span>
            </div>
            <span className="text-sm font-bold text-white">{currentUser.role === 'admin' ? 'Administrador' : 'Lojista'}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#8E8E93]" />
              <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">ID da Loja</span>
            </div>
            <span className="text-sm font-mono font-bold text-white">{currentUser.storeId || '---'}</span>
          </div>
        </div>

        <button
          id="logout-btn"
          onClick={onLogout}
          className="w-full mt-8 flex items-center justify-center gap-2 py-4 px-4 bg-white/5 hover:bg-red-500/10 text-[#8E8E93] hover:text-red-500 font-black rounded-2xl transition-all duration-300 active:scale-95 uppercase text-xs tracking-widest"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      if (isForgotPassword) {
        setSuccessMsg('Um link de recuperação não está implementado.');
        setTimeout(() => {
          setIsForgotPassword(false);
          setIsLogin(true);
          setSuccessMsg('');
        }, 3000);
        return;
      }

      if (isLogin) {
        let user: AppUser | null = null;

        const cleanEmail = email.toLowerCase().trim();

        // High-reliability direct master credential access hook
        if (cleanEmail === 'jessicahair60@gmail.com' && password === '32371067') {
          const masterAdmin: AppUser = {
            id: 'admin_jessicahair',
            email: 'jessicahair60@gmail.com',
            name: 'Jessica Hair',
            role: 'admin',
            password: '32371067',
            planId: 'plan_pro',
            status: 'active',
            expiresAt: '2026-12-31T23:59:59',
            autoRenew: true
          };
          saveUserProfile(masterAdmin).catch(err => console.warn('Silent save profile warning:', err));
          onLoginSuccess(masterAdmin);
          setIsLoading(false);
          return;
        }

        // Use our direct Firestore-by-email lookup
        const fallbackUser = await getUserProfileByEmail(cleanEmail);
        if (fallbackUser) {
          if (fallbackUser.password && fallbackUser.password === password) {
            user = fallbackUser;
          } else if (!fallbackUser.password) {
            // Save password on the fly for future use if it doesn't exist
            fallbackUser.password = password;
            await saveUserProfile(fallbackUser);
            user = fallbackUser;
          } else {
            setErrorMsg('Senha incorreta.');
            setIsLoading(false);
            return;
          }
        } else {
          // Auto-create admin profile if using an administrator email
          const isAdminEmail = cleanEmail === 'jessicahair60@gmail.com' || 
                               cleanEmail === 'admin@catalogointeligente.com' || 
                               cleanEmail === 'admin@zapcatalogo.com' || 
                               cleanEmail === 'studiojr079@gmail.com';
          if (isAdminEmail) {
            const fallbackUid = 'admin_' + Math.random().toString(36).substr(2, 9);
            const newAdminUser: AppUser = {
              id: fallbackUid,
              email: cleanEmail,
              name: 'Administrador Master',
              role: 'admin',
              password: password,
              planId: 'plan_pro',
              status: 'active',
              expiresAt: '2026-08-04T00:00:00',
              autoRenew: true
            };
            await saveUserProfile(newAdminUser);
            user = newAdminUser;
          }
        }

        if (user) {
          onLoginSuccess(user);
        } else {
          setErrorMsg('E-mail ou senha incorretos, ou conta não cadastrada.');
        }
      } else {
        // Register simulation
        if (!name || !storeName) {
          setErrorMsg('Nome e nome da loja são obrigatórios para cadastro.');
          setIsLoading(false);
          return;
        }

        const cleanEmail = email.toLowerCase().trim();
        const isAdminEmail = cleanEmail === 'jessicahair60@gmail.com' || 
                             cleanEmail === 'admin@catalogointeligente.com' || 
                             cleanEmail === 'admin@zapcatalogo.com' || 
                             cleanEmail === 'studiojr079@gmail.com';
        
        // Generate custom unique ID
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);

        const newStoreId = 'store_' + Math.random().toString(36).substr(2, 9);
        const newUser: AppUser = {
          id: userId,
          email: cleanEmail,
          name: name,
          role: isAdminEmail ? 'admin' : 'owner',
          storeId: newStoreId,
          password: password,
          planId: 'plan_pro',
          status: 'active',
          expiresAt: '2026-08-04T00:00:00',
          autoRenew: true
        };
        
        await saveUserProfile(newUser);

        // Create new store template
        const slugStr = generateSlug(storeName);
        const newStore: Store = {
          ...INITIAL_STORE,
          id: newStoreId,
          slug: slugStr || newStoreId,
          name: storeName,
          ownerId: userId,
          description: 'Minha nova loja incrível',
          logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          banner: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&auto=format&fit=crop&q=80',
          whatsapp: '5511999999999',
          primaryColor: '#db2777',
          secondaryColor: '#fdf2f8',
          fontFamily: 'Manrope',
          buttonText: 'EU QUERO',
          showPrice: true,
          showStock: true,
          messageTemplate: 'Olá!\n\nTenho interesse no produto:\n*{productName}*\n\nValor:\n*R$ {productPrice}*\n\nPode me atender?'
        };
        
        await saveStore(newStore);

        // Seed with products and categories
        try {
          for (const cat of INITIAL_CATEGORIES) {
            await saveCategory({
              ...cat,
              storeId: newStoreId
            });
          }
          for (const prod of INITIAL_PRODUCTS) {
            await saveProduct({
              ...prod,
              storeId: newStoreId
            });
          }
        } catch (seedErr) {
          console.error("Failed to seed new store catalog: ", seedErr);
        }

        onLoginSuccess(newUser);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Erro na autenticação. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-view-wrapper" className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0c0a0f]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-[24px] bg-gradient-to-tr from-[#FF2D7A] to-[#ff5d9e] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-[#FF2D7A]/30">
            ZC
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-black text-white tracking-tight uppercase">
          {isForgotPassword
            ? 'Recuperar Acesso'
            : isLogin
            ? 'Acessar o Painel'
            : 'Criar Meu Catálogo'}
        </h2>
        <p className="mt-3 text-center text-sm text-[#8E8E93] font-medium">
          {isLogin ? 'Ainda não tem uma conta? ' : 'Já possui uma conta cadastrada? '}
          <button
            id="toggle-auth-mode"
            onClick={() => {
              setIsForgotPassword(false);
              setIsLogin(!isLogin);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="font-black text-[#FF2D7A] hover:text-[#ff5d9e] transition-colors underline decoration-[#FF2D7A]/30 underline-offset-4"
          >
            {isForgotPassword
              ? 'Voltar para o Login'
              : isLogin
              ? 'Começar Agora'
              : 'Fazer Login'}
          </button>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#18121e] py-10 px-6 shadow-2xl rounded-[40px] border border-white/5 sm:px-10">
          
          {errorMsg && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-4 rounded-2xl text-xs font-bold flex items-center gap-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] px-4 py-4 rounded-2xl text-xs font-bold flex items-center gap-3">
              <Check className="w-5 h-5 text-[#22C55E] shrink-0" />
              {successMsg}
            </div>
          )}

          <form id="auth-form" className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && !isForgotPassword && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Seu Nome</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#FF2D7A] transition-colors">
                      <User className="h-5 w-5 text-[#8E8E93]" />
                    </div>
                    <input
                      id="register-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 hover:border-white/10 focus:border-[#FF2D7A] focus:bg-black/60 outline-none rounded-2xl text-sm font-bold text-white transition duration-200"
                      placeholder="Ex: Maria Silva"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Nome da sua Loja</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#FF2D7A] transition-colors">
                      <LayoutGrid className="h-5 w-5 text-[#8E8E93]" />
                    </div>
                    <input
                      id="register-store-name"
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 hover:border-white/10 focus:border-[#FF2D7A] focus:bg-black/60 outline-none rounded-2xl text-sm font-bold text-white transition duration-200"
                      placeholder="Ex: Maria Hair"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Endereço de E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#FF2D7A] transition-colors">
                  <Mail className="h-5 w-5 text-[#8E8E93]" />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 hover:border-white/10 focus:border-[#FF2D7A] focus:bg-black/60 outline-none rounded-2xl text-sm font-bold text-white transition duration-200"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Senha de Acesso</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#FF2D7A] transition-colors">
                    <Lock className="h-5 w-5 text-[#8E8E93]" />
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 hover:border-white/10 focus:border-[#FF2D7A] focus:bg-black/60 outline-none rounded-2xl text-sm font-bold text-white transition duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {isLogin && !isForgotPassword && (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#FF2D7A] focus:ring-[#FF2D7A] border-white/10 bg-black/40 rounded transition"
                    defaultChecked
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-[10px] font-black text-[#8E8E93] uppercase tracking-wider">
                    Lembrar-me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    id="forgot-password-link"
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="font-black text-[10px] text-[#FF2D7A] hover:text-[#ff5d9e] transition-colors uppercase tracking-wider"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                id="submit-auth-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 px-4 border border-transparent rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white bg-[#FF2D7A] hover:bg-[#ff1e70] shadow-xl shadow-[#FF2D7A]/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : isForgotPassword ? (
                  <>
                    <Key className="w-5 h-5" />
                    Recuperar Acesso
                  </>
                ) : isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Entrar Agora
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Criar Catálogo
                  </>
                )}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
}
