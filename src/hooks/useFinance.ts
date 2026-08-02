import { useCallback, useEffect, useMemo, useState } from 'react'
import { SEED_FINANCE } from '../data/seedFinance'
import { STORAGE_KEYS } from '../config/constants'
import type { FinanceTransaction, FinanceTransactionInput } from '../types/finance'

function loadFinance(): FinanceTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.finance)
    if (!raw) return SEED_FINANCE
    const parsed = JSON.parse(raw) as FinanceTransaction[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_FINANCE
  } catch {
    return SEED_FINANCE
  }
}

function sameMonth(iso: string, ref = new Date()): boolean {
  const d = new Date(iso)
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear()
}

export function useFinance() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => loadFinance())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.finance, JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = useCallback((input: FinanceTransactionInput) => {
    const tx: FinanceTransaction = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      amount: Math.round(Math.abs(input.amount) * 100) / 100,
    }
    setTransactions((prev) => [tx, ...prev])
    return tx
  }, [])

  const updateTransaction = useCallback(
    (id: string, updates: Partial<FinanceTransaction>) => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === id
            ? {
                ...tx,
                ...updates,
                amount:
                  updates.amount != null
                    ? Math.round(Math.abs(updates.amount) * 100) / 100
                    : tx.amount,
              }
            : tx,
        ),
      )
    },
    [],
  )

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }, [])

  const resetFinance = useCallback(() => setTransactions(SEED_FINANCE), [])

  const summary = useMemo(() => {
    const monthTx = transactions.filter((tx) => sameMonth(tx.occurredAt))
    const monthIncome = monthTx
      .filter((tx) => tx.kind === 'receita')
      .reduce((sum, tx) => sum + tx.amount, 0)
    const monthExpense = monthTx
      .filter((tx) => tx.kind === 'despesa')
      .reduce((sum, tx) => sum + tx.amount, 0)
    const allIncome = transactions
      .filter((tx) => tx.kind === 'receita')
      .reduce((sum, tx) => sum + tx.amount, 0)
    const allExpense = transactions
      .filter((tx) => tx.kind === 'despesa')
      .reduce((sum, tx) => sum + tx.amount, 0)

    return {
      monthIncome,
      monthExpense,
      monthBalance: monthIncome - monthExpense,
      allIncome,
      allExpense,
      allBalance: allIncome - allExpense,
    }
  }, [transactions])

  return {
    transactions,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetFinance,
  }
}

export type FinanceContextValue = ReturnType<typeof useFinance>
