'use client'

import { useState, useEffect } from 'react'
import { PlayerStats, BossStats, TaskList, AddTaskForm, BattleArena, BattleSetup, SkillsPanel, ErrorBoundary, HowToPlayModal } from '@/components'
import { Swords } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import type { Task } from '@/types'

function GameContent() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isHowToOpen, setIsHowToOpen] = useState(false)
  const { battle, endBattle, checkDailyBoss } = useGameStore()

  useEffect(() => {
    checkDailyBoss()
  }, [checkDailyBoss])


  useEffect(() => {
    const hasSeenHowTo = localStorage.getItem('hasSeenHowToModal')
    if (!hasSeenHowTo) {
      setIsHowToOpen(true)
    }
  }, [])

  const handleCloseHowTo = () => {
    localStorage.setItem('hasSeenHowToModal', 'true')
    setIsHowToOpen(false)
  }

  const handleBattle = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCloseSetup = () => {
    setSelectedTask(null)
  }

  const handleCloseArena = () => {
    endBattle()
  }

  const isInBattle = battle.startTime && battle.taskId && (battle.phase === 'focus' || battle.phase === 'confirmation')

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Swords className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Pomodoro Battle
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Победи босса дня, выполняя задачи!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-10">
          <aside className="lg:sticky lg:top-8 lg:self-start space-y-4">
            <PlayerStats />
            <SkillsPanel />
          </aside>

          <main className="space-y-6">
            <BossStats />

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <TaskList onBattle={handleBattle} />
            </div>

            <AddTaskForm />
          </main>
        </div>
      </div>

      <HowToPlayModal isOpen={isHowToOpen} onClose={handleCloseHowTo} />

      {selectedTask && (
        <BattleSetup task={selectedTask} onClose={handleCloseSetup} />
      )}

      {isInBattle && (
        <BattleArena onClose={handleCloseArena} />
      )}

      {(battle.phase === 'victory' || battle.phase === 'defeat') && (
        <BattleArena onClose={handleCloseArena} />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <ErrorBoundary>
      <GameContent />
    </ErrorBoundary>
  )
}
