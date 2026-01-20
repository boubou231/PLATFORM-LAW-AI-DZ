
import React from 'react';
import { View } from '../types';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  view: View;
  onClick: (view: View) => void;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, view, onClick }) => {
  return (
    <div 
      onClick={() => onClick(view)}
      className="bg-white p-10 rounded-[2.5rem] shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_25px_70px_rgba(180,83,9,0.12)] hover:border-[#b45309]/40 transition-all duration-700 cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#f8f5f2] opacity-0 group-hover:opacity-100 transition-opacity -mr-16 -mt-16 rounded-full"></div>
      
      <div className="w-16 h-16 bg-gradient-to-br from-[#052e26] to-[#011a16] rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:from-[#b45309] group-hover:to-[#8a4207] transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 border border-white/5">
        <div className="text-3xl text-[#f3e5d8] transition-transform duration-500 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black mb-4 text-[#052e26] group-hover:text-[#b45309] transition-colors">{title}</h3>
      <p className="text-slate-500 leading-relaxed mb-8 text-base font-medium">{description}</p>
      
      <div className="flex items-center text-[#b45309] text-xs font-black tracking-[0.2em] uppercase group-hover:translate-x-[-8px] transition-transform">
        <span className="border-b-2 border-[#b45309]/20 pb-1">دخول الخدمة</span>
        <span className="mr-3 text-lg">←</span>
      </div>
    </div>
  );
};

export default FeatureCard;
