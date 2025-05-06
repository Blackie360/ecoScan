// Types for points system
export interface PointsTransaction {
  id: string
  amount: number
  reason: string
  timestamp: string
}

export interface PointsState {
  balance: number
  transactions: PointsTransaction[]
}

// Points awarded for different actions
export const POINTS_VALUES = {
  SCAN_ITEM: 10,
  SCAN_RECYCLABLE: 5, // Bonus for recyclable items
  DAILY_FIRST_SCAN: 15, // Bonus for first scan of the day
}

// Initialize points from localStorage or with default values
export function getPointsState(): PointsState {
  if (typeof window === "undefined") {
    return { balance: 0, transactions: [] }
  }

  const storedState = localStorage.getItem("ecoscan_points")
  if (storedState) {
    try {
      return JSON.parse(storedState)
    } catch (e) {
      console.error("Error parsing points data:", e)
      return { balance: 0, transactions: [] }
    }
  }

  return { balance: 0, transactions: [] }
}

// Save points state to localStorage
export function savePointsState(state: PointsState): void {
  if (typeof window === "undefined") return

  localStorage.setItem("ecoscan_points", JSON.stringify(state))
}

// Add points and record the transaction
export function addPoints(amount: number, reason: string): PointsState {
  const state = getPointsState()

  const transaction: PointsTransaction = {
    id: Date.now().toString(),
    amount,
    reason,
    timestamp: new Date().toISOString(),
  }

  const newState: PointsState = {
    balance: state.balance + amount,
    transactions: [transaction, ...state.transactions].slice(0, 50), // Keep only the last 50 transactions
  }

  savePointsState(newState)
  return newState
}

// Check if this is the first scan of the day
export function isFirstScanOfDay(): boolean {
  const state = getPointsState()
  if (state.transactions.length === 0) return true

  const lastScanDate = new Date(state.transactions[0].timestamp).toDateString()
  const today = new Date().toDateString()

  return lastScanDate !== today
}

// Get recent transactions
export function getRecentTransactions(count = 5): PointsTransaction[] {
  const state = getPointsState()
  return state.transactions.slice(0, count)
}
