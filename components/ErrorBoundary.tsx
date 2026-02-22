'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  handleClearStorage = () => {
    localStorage.removeItem('pomodoro-battle-storage')
    this.handleReset()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              Что-то пошло не так
            </h2>
            <p className="text-slate-400 mb-6">
              Произошла ошибка. Попробуй обновить страницу или сбросить данные.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-xs text-red-400 bg-slate-950 p-3 rounded-lg mb-4 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-semibold text-slate-950 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Обновить
              </button>
              <button
                onClick={this.handleClearStorage}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-colors"
              >
                Сбросить данные
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
