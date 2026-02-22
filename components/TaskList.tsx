'use client'

import { useGameStore } from '@/store/useGameStore'
import { Trash2, CheckCircle, XCircle, Clock, Shield, Sword } from 'lucide-react'
import type { Task } from '@/types'

interface TaskItemProps {
  task: Task
  onBattle: (task: Task) => void
}

function TaskItem({ task, onBattle }: TaskItemProps) {
  const { deleteTask, cancelFailTask, skills, player } = useGameStore()

  const today = new Date().toISOString().split('T')[0]
  const retreatSkill = skills.find((s) => s.id === 'tactical_retreat')
  const canUseRetreat = 
    task.status === 'failed' &&
    retreatSkill &&
    player.level >= retreatSkill.requiredLevel &&
    retreatSkill.lastUsed !== today

  const statusConfig = {
    pending: {
      border: 'border-slate-700 hover:border-amber-500/30',
      bg: 'bg-slate-800',
      icon: <Clock className="w-5 h-5 text-slate-400" />,
      text: '',
    },
    completed: {
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-500/10',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      text: 'line-through text-slate-500',
    },
    failed: {
      border: 'border-red-500/50',
      bg: 'bg-red-500/10',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      text: 'text-slate-500',
    },
  }

  const config = statusConfig[task.status]

  return (
    <div className={`${config.bg} border-2 ${config.border} rounded-xl p-4 transition-all duration-300 group`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <p className={`flex-1 font-medium ${config.text}`}>
          {task.title}
        </p>
        {task.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onBattle(task)}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-lg transition-all flex items-center gap-2 font-semibold text-sm text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Sword className="w-4 h-4" />
              <span>В бой!</span>
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
        {canUseRetreat && (
          <button
            onClick={() => cancelFailTask(task.id)}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg transition-all flex items-center gap-2 font-semibold text-sm text-white shadow-lg shadow-blue-500/20 active:scale-95"
            title="Тактическое отступление"
          >
            <Shield className="w-4 h-4" />
            <span>Отменить</span>
          </button>
        )}
      </div>
    </div>
  )
}

interface TaskListProps {
  onBattle: (task: Task) => void
}

export function TaskList({ onBattle }: TaskListProps) {
  const { tasks } = useGameStore()
  
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter((t) => t.date === today)
  const pendingCount = todayTasks.filter(t => t.status === 'pending').length
  const completedCount = todayTasks.filter(t => t.status === 'completed').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-amber-400">
          <Sword className="w-5 h-5" />
          Квесты на сегодня
        </h2>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-400">
            <span className="text-amber-400 font-semibold">{pendingCount}</span> активно
          </span>
          <span className="text-slate-400">
            <span className="text-emerald-400 font-semibold">{completedCount}</span> done
          </span>
        </div>
      </div>
      
      {todayTasks.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border-2 border-slate-800 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Sword className="w-8 h-8 text-amber-500/50" />
          </div>
          <p className="text-slate-400 font-medium">Нет активных квестов</p>
          <p className="text-sm text-slate-500 mt-1">Добавь первый квест и начни битву!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <TaskItem key={task.id} task={task} onBattle={onBattle} />
          ))}
        </div>
      )}
    </div>
  )
}
