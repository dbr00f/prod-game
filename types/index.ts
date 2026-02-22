export interface Task {
  id: string
  title: string
  date: string
  status: 'pending' | 'completed' | 'failed'
}

export interface Player {
  level: number
  xp: number
  xpToNext: number
  baseDamage: number
  totalTasksCompleted: number
  totalTasksFailed: number
}

export interface DailyBoss {
  hp: number
  maxHp: number
  name: string
  date: string
  defeated: boolean
}

export type BattlePhase = 'focus' | 'confirmation' | 'victory' | 'defeat'

export interface BattleState {
  taskId: string | null
  taskTitle: string
  duration: number
  startTime: number | null
  phase: BattlePhase
}

export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  requiredLevel: number
  lastUsed: string | null
  cooldownType: 'daily' | 'per_battle' | 'passive'
}

export interface LevelUpEvent {
  show: boolean
  newLevel: number
}

export interface GameState {
  tasks: Task[]
  player: Player
  dailyBoss: DailyBoss
  battle: BattleState
  skills: Skill[]
  levelUpEvent: LevelUpEvent
  addTask: (title: string, date: string) => void
  deleteTask: (id: string) => void
  completeTask: (id: string) => void
  failTask: (id: string) => void
  addXp: (amount: number) => void
  damageBoss: (amount: number) => void
  startBattle: (taskId: string, taskTitle: string, duration: number) => void
  confirmVictory: () => void
  endBattle: () => void
  setBattlePhase: (phase: BattlePhase) => void
  useSkill: (skillId: string) => void
  cancelFailTask: (taskId: string) => void
  showLevelUp: (level: number) => void
  hideLevelUp: () => void
  checkDailyBoss: () => void
}
