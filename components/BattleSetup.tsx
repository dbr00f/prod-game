'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { Flame, Clock, X, Sword } from 'lucide-react'
import type { Task } from '@/types'

interface BattleSetupProps {
  task: Task
  onClose: () => void
}

const PRESET_DURATIONS = [1, 5, 15, 25, 45, 60]

export function BattleSetup({ task, onClose }: BattleSetupProps) {
  const [duration, setDuration] = useState(25)
  const { startBattle } = useGameStore()

  const handleStartBattle = () => {
    startBattle(task.id, task.title, duration)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-amber-400">Начать бой</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Задача:</p>
          <p className="font-semibold text-lg">{task.title}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="font-medium">Длительность боя</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {PRESET_DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  duration === d
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950'
                    : 'bg-slate-950 border-2 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                {d} мин
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Свое время:</span>
            <input
              type="number"
              min="1"
              max="120"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
              className="w-20 bg-slate-950 border-2 border-slate-800 rounded-xl px-3 py-2 text-center focus:outline-none focus:border-amber-500/50"
            />
            <span className="text-sm text-slate-400">мин</span>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6">
          <p className="text-sm text-red-400">
            <strong>Важно:</strong> После окончания времени у тебя будет 5 минут на подтверждение победы!
          </p>
        </div>

        <button
          onClick={handleStartBattle}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-xl font-bold text-lg text-slate-950 shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Sword className="w-6 h-6" />
          В БОЙ!
        </button>
      </div>
    </div>
  )
}
