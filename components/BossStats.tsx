'use client'

import { useGameStore } from '@/store/useGameStore'
import { Skull, Trophy, Calendar } from 'lucide-react'

export function BossStats() {
  const { dailyBoss } = useGameStore()
  const hpPercent = (dailyBoss.hp / dailyBoss.maxHp) * 100

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }

  if (dailyBoss.defeated) {
    return (
      <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border-2 border-emerald-500/50 rounded-xl p-6 relative overflow-hidden">
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30">
            <Trophy className="w-12 h-12 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mb-2">БОСС ПОВЕРЖЕН!</p>
          <p className="text-slate-400 text-lg">{dailyBoss.name}</p>
          <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(dailyBoss.date)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-red-950 to-slate-900 border-2 border-red-900/50 rounded-xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center border-2 border-red-500/30">
          <Skull className="w-9 h-9 text-red-400 animate-pulse" />
        </div>
        <div>
          <p className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-1">Босс Дня</p>
          <p className="font-bold text-2xl text-white">{dailyBoss.name}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Здоровье</span>
          <span className="text-red-400 font-bold">{dailyBoss.hp} / {dailyBoss.maxHp}</span>
        </div>
        <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 transition-all duration-500"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {formatDate(dailyBoss.date)}
      </p>
    </div>
  )
}
