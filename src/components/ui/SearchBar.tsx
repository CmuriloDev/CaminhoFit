'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar local ou atividade...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-8 py-2.5
          bg-zinc-100 hover:bg-zinc-200
          rounded-xl text-sm text-zinc-800
          placeholder:text-zinc-400
          border border-transparent
          focus:outline-none focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100
          transition-all duration-150
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}