'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { Skull, Trophy, AlertTriangle, Sword, Volume2, VolumeX } from 'lucide-react'

interface BattleArenaProps {
  onClose: () => void
}

const CONFIRMATION_DURATION = 5 * 60 * 1000

export function BattleArena({ onClose }: BattleArenaProps) {
  const { battle, confirmVictory, endBattle, failTask, setBattlePhase } = useGameStore()
  const [timeLeft, setTimeLeft] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)
  const hasPlayedAlert = useRef(false)

  const playBeep = useCallback(() => {
    if (!soundEnabled) return
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = battle.phase === 'confirmation' ? 880 : 660
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch {
      // Audio not supported
    }
  }, [soundEnabled, battle.phase])

  useEffect(() => {
    if (!battle.startTime || !battle.taskId) return

    const tick = () => {
      const now = Date.now()
      const focusEndTime = battle.startTime! + battle.duration * 60 * 1000
      
      if (battle.phase === 'focus') {
        const remaining = focusEndTime - now
        if (remaining <= 0) {
          setBattlePhase('confirmation')
          if (!hasPlayedAlert.current) {
            playBeep()
            hasPlayedAlert.current = true
          }
          setTimeLeft(CONFIRMATION_DURATION)
        } else {
          setTimeLeft(remaining)
        }
      } else if (battle.phase === 'confirmation') {
        const confirmationEndTime = focusEndTime + CONFIRMATION_DURATION
        const remaining = confirmationEndTime - now
        if (remaining <= 0) {
          failTask(battle.taskId!)
          setBattlePhase('defeat')
        } else {
          setTimeLeft(remaining)
        }
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [battle.startTime, battle.duration, battle.phase, battle.taskId, failTask, setBattlePhase, playBeep])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressPercent = () => {
    if (!battle.startTime) return 0
    const totalDuration = battle.phase === 'confirmation' 
      ? CONFIRMATION_DURATION 
      : battle.duration * 60 * 1000
    return Math.max(0, Math.min(100, (1 - timeLeft / totalDuration) * 100))
  }

  const handleVictory = () => {
    confirmVictory()
    playBeep()
  }

  const handleDefeat = () => {
    if (battle.taskId) {
      failTask(battle.taskId)
    }
    setBattlePhase('defeat')
  }

  const handleClose = () => {
    endBattle()
    onClose()
  }

  if (battle.phase === 'victory') {
    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-emerald-400 mb-2">ПОБЕДА!</h2>
          <p className="text-slate-400 mb-2">{battle.taskTitle}</p>
          <p className="text-amber-400 font-bold text-xl mb-6">+25 XP</p>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 rounded-xl font-semibold transition-all text-white"
          >
            Продолжить
          </button>
        </div>
      </div>
    )
  }

  if (battle.phase === 'defeat') {
    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center">
            <Skull className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-2">ПОРАЖЕНИЕ</h2>
          <p className="text-slate-400 mb-2">{battle.taskTitle}</p>
          <p className="text-red-400 font-bold mb-6">Босс восстановил HP</p>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300 rounded-xl font-semibold transition-all text-white"
          >
            Войти в бой снова
          </button>
        </div>
      </div>
    )
  }

  const isConfirmation = battle.phase === 'confirmation'
  const bgColor = isConfirmation ? 'from-red-950 to-slate-950' : 'from-slate-950 to-slate-900'
  const progressColor = isConfirmation ? 'from-red-500 to-orange-500' : 'from-amber-500 to-amber-400'

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${bgColor} flex items-center justify-center p-4 z-50`}>
      <div className={`bg-slate-900 border-2 ${isConfirmation ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl p-6 max-w-md w-full`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sword className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-amber-400">БОЙ</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>

        <div className="text-center mb-6">
          <div className={`w-24 h-24 mx-auto mb-4 rounded-xl ${isConfirmation ? 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse' : 'bg-gradient-to-r from-red-600 to-red-500'} flex items-center justify-center border-2 border-red-500/50`}>
            <Skull className="w-12 h-12 text-white" />
          </div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Задача:</p>
          <p className="font-semibold text-lg">{battle.taskTitle}</p>
        </div>

        {isConfirmation && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">ВНИМАНИЕ!</span>
            </div>
            <p className="text-sm text-red-300 mt-1">
              Босс готовит ответный удар! Подтверди победу за {formatTime(timeLeft)} или проиграешь!
            </p>
          </div>
        )}

        <div className="mb-6">
          <div className={`text-5xl font-mono font-bold text-center mb-4 ${isConfirmation ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-1000`}
              style={{ width: `${getProgressPercent()}%` }}
            />
          </div>
          <p className="text-center text-sm text-slate-500 mt-2">
            {isConfirmation ? 'Время подтверждения' : 'Время фокуса'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleVictory}
            disabled={battle.phase === 'focus'}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              battle.phase === 'focus'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-2 border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white shadow-lg shadow-emerald-500/20 active:scale-95'
            }`}
          >
            <Trophy className="w-6 h-6" />
            Я победил!
          </button>

          <button
            onClick={handleDefeat}
            className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-colors"
          >
            Сдаться
          </button>
        </div>
      </div>
    </div>
  )
}
