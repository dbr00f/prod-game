'use client'

import { BookOpen, CheckCircle2, Clock3, Swords, X } from 'lucide-react'

interface HowToPlayModalProps {
  isOpen: boolean
  onClose: () => void
}

const STEPS = [
  'Создай новый квест в списке задач.',
  'Нажми «В бой!», выбери длительность и запусти таймер.',
  'После окончания времени подтверди, что задача выполнена.',
  'За выполненный квест босс получает урон и ты приближаешься к победе.',
]

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 max-w-lg w-full shadow-xl shadow-amber-500/10">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 text-amber-400">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold">Как играть</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 transition-colors"
            aria-label="Закрыть инструкцию"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-300 mb-5">
          Чтобы победить босса, нужно выполнять квесты и подтверждать их после таймера.
        </p>

        <div className="space-y-3 mb-6">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-start gap-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold shrink-0">
                {index + 1}
              </span>
              <p className="text-slate-200 text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            Новый квест
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-amber-400" />
            Запуск таймера
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Урон боссу
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-xl font-semibold text-slate-950 transition-all"
        >
          Понятно, начинаем!
        </button>
      </div>
    </div>
  )
}
