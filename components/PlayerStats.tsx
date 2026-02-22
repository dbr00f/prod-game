'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { Star, Sparkles, Sword, Trophy, XCircle } from 'lucide-react'

export function PlayerStats() {
  const { player, levelUpEvent, hideLevelUp } = useGameStore()
  const [prevXp, setPrevXp] = useState(player.xp)
  const [isAnimating, setIsAnimating] = useState(false)

  const xpPercent = (player.xp / player.xpToNext) * 100

  useEffect(() => {
    if (player.xp !== prevXp) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      setPrevXp(player.xp)
      return () => clearTimeout(timer)
    }
  }, [player.xp, prevXp])

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Star className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Герой</p>
            <p className="font-bold text-xl">Уровень {player.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800">
            <Sword className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Урон</p>
            <p className="font-bold text-red-400">{player.baseDamage}</p>
          </div>
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800">
            <Trophy className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Побед</p>
            <p className="font-bold text-emerald-400">{player.totalTasksCompleted}</p>
          </div>
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800">
            <XCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Пораж.</p>
            <p className="font-bold text-red-400">{player.totalTasksFailed}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-blue-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Опыт
            </span>
            <span className={`text-amber-400 font-bold transition-all ${isAnimating ? 'scale-110' : ''}`}>
              {player.xp} / {player.xpToNext}
            </span>
          </div>
          <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out ${isAnimating ? 'shadow-lg shadow-blue-500/50' : ''}`}
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {levelUpEvent.show && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-3xl bg-amber-500/50 animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-amber-400 animate-ping" style={{ animationDuration: '2s' }} />
              <Sparkles className="w-32 h-32 text-amber-400 mx-auto relative z-10 animate-bounce" />
            </div>
            <h2 className="text-5xl font-black bg-gradient-to-r from-amber-400 via-white to-amber-400 bg-clip-text text-transparent mb-2 animate-pulse">
              LEVEL UP!
            </h2>
            <p className="text-3xl text-white mb-2 font-bold">Уровень {levelUpEvent.newLevel}</p>
            <p className="text-slate-400 mb-8 text-lg">
              Твой урон вырос! Новые способности разблокированы!
            </p>
            <button
              onClick={hideLevelUp}
              className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg text-slate-950 hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/30 active:scale-95"
            >
              Продолжить
            </button>
          </div>
        </div>
      )}
    </>
  )
}
