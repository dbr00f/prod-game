'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { Plus, Swords } from 'lucide-react'

export function AddTaskForm() {
  const [title, setTitle] = useState('')
  const { addTask } = useGameStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const today = new Date().toISOString().split('T')[0]
    addTask(title.trim(), today)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Swords className="w-5 h-5 text-amber-400" />
        <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Новый квест</span>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название квеста..."
          className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl transition-all flex items-center gap-2 font-bold text-slate-950 shadow-lg shadow-amber-500/20 disabled:shadow-none active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Квест</span>
        </button>
      </div>
    </form>
  )
}
