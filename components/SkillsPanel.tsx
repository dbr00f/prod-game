'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { Ghost, Shield, Zap, Lock, CheckCircle } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  ghost: <Ghost className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
}

export function SkillsPanel() {
  const { skills, player, useSkill } = useGameStore()
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const canUseSkill = (skill: typeof skills[0]) => {
    if (player.level < skill.requiredLevel) return false
    if (skill.cooldownType === 'daily' && skill.lastUsed === today) return false
    return true
  }

  const getTimeUntilReset = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}ч ${minutes}м`
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h3 className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Способности
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        {skills.map((skill) => {
          const isUnlocked = player.level >= skill.requiredLevel
          const isUsedToday = skill.cooldownType === 'daily' && skill.lastUsed === today
          const canUse = canUseSkill(skill)

          return (
            <div key={skill.id} className="relative">
              <button
                onClick={() => canUse && useSkill(skill.id)}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                disabled={!canUse}
                className={`w-full aspect-square rounded-lg transition-all flex flex-col items-center justify-center relative ${
                  !isUnlocked
                    ? 'bg-slate-950 border-2 border-slate-800 cursor-not-allowed opacity-50'
                    : isUsedToday
                    ? 'bg-slate-950 border-2 border-slate-800 cursor-not-allowed'
                    : 'bg-slate-800 border-2 border-amber-500/30 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95'
                }`}
              >
                <div className={`${isUnlocked && !isUsedToday ? 'text-amber-400' : 'text-slate-600'}`}>
                  {!isUnlocked ? <Lock className="w-6 h-6" /> : iconMap[skill.icon]}
                </div>
                
                {!isUnlocked && (
                  <span className="absolute -bottom-1 -right-1 bg-slate-700 text-slate-300 text-xs px-1.5 rounded font-bold">
                    {skill.requiredLevel}
                  </span>
                )}
                
                {isUsedToday && (
                  <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-emerald-400 bg-slate-900 rounded-full" />
                )}
              </button>

              {hoveredSkill === skill.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-950 border border-slate-700 rounded-lg p-3 z-50 shadow-xl">
                  <p className="font-bold text-amber-400 text-sm mb-1">{skill.name}</p>
                  <p className="text-xs text-slate-400 mb-2">{skill.description}</p>
                  {!isUnlocked && (
                    <p className="text-xs text-red-400">Требуется уровень {skill.requiredLevel}</p>
                  )}
                  {isUsedToday && (
                    <p className="text-xs text-emerald-400">Доступно через {getTimeUntilReset()}</p>
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-950 border-r border-b border-slate-700 rotate-45" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {player.level < 5 && (
        <p className="text-xs text-slate-500 mt-4 text-center">
          Разблокируй способности на уровнях 2, 3, 5
        </p>
      )}
    </div>
  )
}
