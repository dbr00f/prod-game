import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, Player, DailyBoss, GameState, BattleState, BattlePhase, Skill, LevelUpEvent } from '@/types'

const generateId = () => Math.random().toString(36).substring(2, 9)

const BOSS_NAMES = [
  'Теневой Страж',
  'Кристаллический Голем', 
  'Огненный Дракон',
  'Ледяной Титан',
  'Хаос Мастер',
  'Повелитель Бездны',
  'Костяной Рыцарь',
  'Громовой Великан',
  'Ядовитый Паук',
  'Магматический Голем',
]

const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

const generateDailyBoss = (date: string): DailyBoss => {
  const hash = hashCode(date)
  const nameIndex = hash % BOSS_NAMES.length
  const baseHp = 100 + (hash % 10) * 20
  const multiplier = 1 + Math.floor(hashCode(date + '-scale') % 100) / 100
  
  return {
    hp: Math.floor(baseHp * multiplier),
    maxHp: Math.floor(baseHp * multiplier),
    name: BOSS_NAMES[nameIndex],
    date,
    defeated: false,
  }
}

const initialPlayer: Player = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  baseDamage: 20,
  totalTasksCompleted: 0,
  totalTasksFailed: 0,
}

const initialBattle: BattleState = {
  taskId: null,
  taskTitle: '',
  duration: 25,
  startTime: null,
  phase: 'focus',
}

const initialSkills: Skill[] = [
  {
    id: 'shadow_strike',
    name: 'Удар Тени',
    description: 'Наносит 20 ед. урона боссу мгновенно',
    icon: 'ghost',
    requiredLevel: 2,
    lastUsed: null,
    cooldownType: 'daily',
  },
  {
    id: 'tactical_retreat',
    name: 'Тактическое отступление',
    description: 'Отменяет проваленную задачу без штрафа',
    icon: 'shield',
    requiredLevel: 3,
    lastUsed: null,
    cooldownType: 'daily',
  },
  {
    id: 'power_surge',
    name: 'Всплеск силы',
    description: 'Удваивает урон по боссу на следующую задачу',
    icon: 'zap',
    requiredLevel: 5,
    lastUsed: null,
    cooldownType: 'per_battle',
  },
]

const initialLevelUpEvent: LevelUpEvent = {
  show: false,
  newLevel: 1,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      tasks: [],
      player: initialPlayer,
      dailyBoss: generateDailyBoss(new Date().toISOString().split('T')[0]),
      battle: initialBattle,
      skills: initialSkills,
      levelUpEvent: initialLevelUpEvent,

      checkDailyBoss: () => {
        const today = new Date().toISOString().split('T')[0]
        const { dailyBoss, tasks } = get()

        if (dailyBoss.date !== today) {
          const oldDate = dailyBoss.date
          const pendingTasks = tasks.filter(t => t.date === oldDate && t.status === 'pending')
          
          pendingTasks.forEach(() => {
            set((state) => ({
              player: {
                ...state.player,
                totalTasksFailed: state.player.totalTasksFailed + 1,
              },
            }))
          })

          set((state) => ({
            tasks: state.tasks.map(t => 
              t.date === oldDate && t.status === 'pending' 
                ? { ...t, status: 'failed' as const } 
                : t
            ),
            dailyBoss: generateDailyBoss(today),
          }))
        }
      },

      addTask: (title: string, date: string) => {
        const newTask: Task = {
          id: generateId(),
          title,
          date,
          status: 'pending',
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },

      completeTask: (id: string) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task || task.status !== 'pending') return

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'completed' as const } : t
          ),
          player: {
            ...state.player,
            totalTasksCompleted: state.player.totalTasksCompleted + 1,
          },
        }))

        get().addXp(25)
        get().damageBoss(get().player.baseDamage)
      },

      failTask: (id: string) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task || task.status !== 'pending') return

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'failed' as const } : t
          ),
          dailyBoss: {
            ...state.dailyBoss,
            hp: Math.min(state.dailyBoss.hp + 15, state.dailyBoss.maxHp),
          },
          player: {
            ...state.player,
            totalTasksFailed: state.player.totalTasksFailed + 1,
          },
        }))
      },

      addXp: (amount: number) => {
        const state = get()
        let newXp = state.player.xp + amount
        let newLevel = state.player.level
        let newXpToNext = state.player.xpToNext
        let newBaseDamage = state.player.baseDamage
        let levelUpOccurred = false

        while (newXp >= newXpToNext) {
          newXp -= newXpToNext
          newLevel += 1
          newXpToNext = Math.floor(newXpToNext * 1.5)
          newBaseDamage = Math.floor(newBaseDamage * 1.1)
          levelUpOccurred = true
        }

        set({
          player: {
            ...state.player,
            level: newLevel,
            xp: newXp,
            xpToNext: newXpToNext,
            baseDamage: newBaseDamage,
          },
        })

        if (levelUpOccurred) {
          get().showLevelUp(newLevel)
        }
      },

      damageBoss: (amount: number) => {
        set((state) => {
          const newHp = state.dailyBoss.hp - amount
          if (newHp <= 0) {
            return {
              dailyBoss: {
                ...state.dailyBoss,
                hp: 0,
                defeated: true,
              },
              player: {
                ...state.player,
                xp: state.player.xp + 50,
              },
            }
          }
          return {
            dailyBoss: { ...state.dailyBoss, hp: newHp },
          }
        })
      },

      startBattle: (taskId: string, taskTitle: string, duration: number) => {
        set({
          battle: {
            taskId,
            taskTitle,
            duration,
            startTime: Date.now(),
            phase: 'focus',
          },
        })
      },

      confirmVictory: () => {
        const { battle, completeTask } = get()
        if (!battle.taskId) return

        completeTask(battle.taskId)
        set((state) => ({
          battle: { ...state.battle, phase: 'victory' as BattlePhase },
        }))
      },

      endBattle: () => {
        set({ battle: initialBattle })
      },

      setBattlePhase: (phase: BattlePhase) => {
        set((state) => ({
          battle: { ...state.battle, phase },
        }))
      },

      useSkill: (skillId: string) => {
        const { skills, player } = get()
        const skill = skills.find((s) => s.id === skillId)
        if (!skill) return
        if (player.level < skill.requiredLevel) return

        const today = new Date().toISOString().split('T')[0]
        if (skill.cooldownType === 'daily' && skill.lastUsed === today) return

        if (skillId === 'shadow_strike') {
          get().damageBoss(20)
        }

        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === skillId ? { ...s, lastUsed: today } : s
          ),
        }))
      },

      cancelFailTask: (taskId: string) => {
        const { skills, player, dailyBoss } = get()
        const retreatSkill = skills.find((s) => s.id === 'tactical_retreat')
        if (!retreatSkill) return
        if (player.level < retreatSkill.requiredLevel) return

        const today = new Date().toISOString().split('T')[0]
        if (retreatSkill.lastUsed === today) return

        const task = get().tasks.find((t) => t.id === taskId)
        if (!task || task.status !== 'failed') return

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'pending' as const } : t
          ),
          dailyBoss: {
            ...state.dailyBoss,
            hp: Math.max(dailyBoss.hp - 15, 1),
          },
          skills: state.skills.map((s) =>
            s.id === 'tactical_retreat' ? { ...s, lastUsed: today } : s
          ),
          player: {
            ...state.player,
            totalTasksFailed: state.player.totalTasksFailed - 1,
          },
        }))
      },

      showLevelUp: (level: number) => {
        set({ levelUpEvent: { show: true, newLevel: level } })
      },

      hideLevelUp: () => {
        set({ levelUpEvent: { show: false, newLevel: 1 } })
      },
    }),
    {
      name: 'pomodoro-battle-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkDailyBoss()
        }
      },
    }
  )
)
