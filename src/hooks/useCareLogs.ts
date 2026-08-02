import { useCallback, useEffect, useState } from 'react'
import { SEED_CARE_LOGS } from '../data/seedCareLogs'
import { STORAGE_KEYS } from '../config/constants'
import type { CareLog, CareLogInput } from '../types/careLog'

function loadLogs(): CareLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.careLogs)
    if (!raw) return SEED_CARE_LOGS
    const parsed = JSON.parse(raw) as CareLog[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CARE_LOGS
  } catch {
    return SEED_CARE_LOGS
  }
}

export function useCareLogs() {
  const [logs, setLogs] = useState<CareLog[]>(() => loadLogs())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.careLogs, JSON.stringify(logs))
  }, [logs])

  const addLog = useCallback((input: CareLogInput) => {
    const log: CareLog = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setLogs((prev) => [log, ...prev])
    return log
  }, [])

  const updateLog = useCallback((id: string, updates: Partial<CareLog>) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }, [])

  const deleteLog = useCallback((id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const resetCareLogs = useCallback(() => setLogs(SEED_CARE_LOGS), [])

  return { logs, addLog, updateLog, deleteLog, resetCareLogs }
}

export type CareLogsContextValue = ReturnType<typeof useCareLogs>
