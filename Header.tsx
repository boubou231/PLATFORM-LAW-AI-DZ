
import React from 'react';
import { View, User } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, user, onLogout }) => {
  return (
    <header className="bg-[#052e26] text-white shadow-xl border-b border-[#b45309]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setView(View.Home)}>
            <div className="w-12 h-12 bg-gradient-to-br from-[#b45309] to-[#8a4207] rounded-xl flex items-center justify-center mr-3 ml-4 shadow-[0_0_20px_rgba(180,83,9,0.4)] border border-white/10">
               <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#f3e5d8] fill-current">
                 <path d="M12 3L3 6v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-3zm0 4.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm3 9H9v-1.5h6v1.5zm-3-11.2c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7zm6 3.7c-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2-1.9-4.2-4.2-4.2zm-12 0c-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2-1.9-4.2-4.2-4.2z" />
               </svg>
            </div>
            <h1 className="text-xl font-black text-[#f3e5d8] tracking-tight">منصة القانون الجزائرية</h1>
          </div>
          
          <nav className="hidden lg:flex space-x-reverse space-x-2 overflow-x-auto">
            {[
              { id: View.Home, label: 'الرئيسية' },
              { id: View.Consultation, label: 'استشارة' },
              { id: View.FileAnalysis, label: 'تحليل وثائق' },
              { id: View.Research, label: 'بحث أكاديمي' },
              { id: View.ContractDrafting, label: 'عقود' },
              { id: View.Radar, label: 'الرادار 📡' },
              { id: View.Resources, label: 'المصادر 📚' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  currentView === item.id ? 'bg-[#b45309]/20 text-[#b45309]' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-2xl border border-white/10 group relative">
                <span className="text-[10px] font-black text-[#f3e5d8]">{user.username}</span>
                <div className="w-10 h-10 bg-gradient-to-br from-[#b45309] to-[#8a4207] rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <button 
                  onClick={onLogout}
                  className="absolute top-full left-0 mt-2 w-full bg-[#8a4207] text-white py-2 rounded-lg text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-white/10"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView(View.Auth)}
                className="bg-white/10 text-white px-5 py-2 rounded-xl font-black text-[10px] hover:bg-white/20 transition-all border border-white/20"
              >
                دخول / تسجيل
              </button>
            )}
            <button onClick={() => setView(View.Contact)} className="bg-[#b45309] text-white px-5 py-2 rounded-xl font-black text-[10px] shadow-lg hover:bg-[#8a4207] transition-all border border-white/10">
              الدعم التقني
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
