import { useEffect, useState } from "react"
import {
  Activity, ScaleIcon, SparklesIcon,
  TrendingUpIcon, ZapIcon, Flame, UtensilsCrossed
} from "lucide-react"

import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/useAppContext"
import type { ActivityEntry, FoodEntry } from "../types"
import CaloriesChart from "../components/CaloriesChart"
import api from "../configs/api"
import { getApiErrorMessage } from "../utils/api"
import "../pages/Dashboard.css"

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs } = useAppContext()
  const [coachTips, setCoachTips]       = useState<string[]>([])
  const [coachLoading, setCoachLoading] = useState(false)
  const [coachError, setCoachError]     = useState("")

  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000
  const today = new Date().toISOString().split('T')[0]
  const todayFood       = allFoodLogs.filter((entry: FoodEntry)     => entry.createdAt?.split('T')[0] === today)
  const todayActivities = allActivityLogs.filter((entry: ActivityEntry) => entry.createdAt?.split('T')[0] === today)

  // Get dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return { text: 'Good morning', emoji: '🌅' }
    } else if (hour < 17) {
      return { text: 'Good afternoon', emoji: '☀️' }
    } else {
      return { text: 'Good evening', emoji: '🌙' }
    }
  }

  const greeting = getGreeting()

  useEffect(() => {
    if (!user?.token) {
      setCoachTips([])
      setCoachError("")
      return
    }

    let isMounted = true

    const fetchCoachInsights = async () => {
      setCoachLoading(true)
      setCoachError("")

      try {
        const { data } = await api.get<{ tips: string[] }>("/api/ai-coach/insight")
        if (!isMounted) return
        setCoachTips(Array.isArray(data.tips) ? data.tips.slice(0, 3) : [])
      } catch (error: unknown) {
        console.log(error)
        if (!isMounted) return
        setCoachTips([])
        setCoachError(getApiErrorMessage(error, "Unable to load coach insights right now."))
      } finally {
        if (isMounted) setCoachLoading(false)
      }
    }

    void fetchCoachInsights()
    return () => { isMounted = false }
  }, [user?.token, allFoodLogs.length, allActivityLogs.length])

  const totalCalories: number     = todayFood.reduce((sum, item) => sum + item.calories, 0)
  const remainingCalories: number = DAILY_CALORIE_LIMIT - totalCalories
  const totalActiveMinutes: number = todayActivities.reduce((sum, item) => sum + item.duration, 0)
  const totalBurned: number       = todayActivities.reduce((sum, item) => sum + (item.calories || 0), 0)

  const motivation = getMotivationalMessage(totalCalories, totalActiveMinutes, DAILY_CALORIE_LIMIT)

  const caloriesPct = Math.min((totalCalories / DAILY_CALORIE_LIMIT) * 100, 100)
  const burnedPct   = Math.min((totalBurned / (user?.dailyCalorieBurn || 400)) * 100, 100)

  return (
    <div className="dashboard">
      <div className="dashboard-inner">

        {/* ── Header ── */}
        <header className="dash-header">
          <p className="dash-eyebrow">Overview Dashboard</p>
          <h1 className="dash-title">{greeting.text}, {user?.username} {greeting.emoji}</h1>

          <div className="motivation-badge">
            <div className="motivation-emoji-wrap">
              <span>{motivation.emoji}</span>
            </div>
            <p className="motivation-text">{motivation.text}</p>
          </div>
        </header>

        {/* ── Grid ── */}
        <div className="dash-grid">

          {/* ─────────────────────────────
              CALORIES CARD (col-span-6)
          ───────────────────────────── */}
          <div className="col-6">
            <div className="dash-card calories-card" style={{ height: '100%' }}>

              {/* Consumed section */}
              <div className="cal-section">
                <div className="cal-meta">
                  <div className="icon-badge icon-badge--orange">
                    <UtensilsCrossed />
                  </div>
                  <span className="card-label">Consumed</span>
                </div>

                <div className="cal-row">
                  <div className="cal-number-row">
                    <span className="card-value">{totalCalories}</span>
                    <span className="card-value-unit">/ {DAILY_CALORIE_LIMIT} kcal</span>
                  </div>
                  <span className={`status-pill ${remainingCalories >= 0 ? 'status-pill--green' : 'status-pill--rose'}`}>
                    {remainingCalories >= 0
                      ? `${remainingCalories} left`
                      : `${Math.abs(remainingCalories)} over`}
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill progress-fill--orange"
                    style={{ width: `${caloriesPct}%` }}
                  />
                </div>
              </div>

              <div className="card-divider" />

              {/* Burned section */}
              <div className="cal-section">
                <div className="cal-meta">
                  <div className="icon-badge icon-badge--rose">
                    <Flame />
                  </div>
                  <span className="card-label">Burned</span>
                </div>

                <div className="cal-number-row" style={{ marginBottom: 14 }}>
                  <span className="card-value">{totalBurned}</span>
                  <span className="card-value-unit">/ {user?.dailyCalorieBurn || 400} kcal</span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill progress-fill--rose"
                    style={{ width: `${burnedPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────
              STAT CARDS (Active + Workouts)
          ───────────────────────────── */}
          <div className="stat-cards-col">

            {/* Active Minutes */}
            <div className="dash-card stat-card">
              <div className="stat-card-inner">
                <div className="icon-badge icon-badge--blue">
                  <Activity />
                </div>
                <div>
                  <p className="card-label" style={{ marginBottom: 6 }}>Active Time</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span className="card-value">{totalActiveMinutes}</span>
                    <span className="card-value-unit">min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Workouts */}
            <div className="dash-card stat-card" style={{ animationDelay: '0.28s' }}>
              <div className="stat-card-inner">
                <div className="icon-badge icon-badge--violet">
                  <ZapIcon />
                </div>
                <div>
                  <p className="card-label" style={{ marginBottom: 6 }}>Workouts</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span className="card-value">{todayActivities.length}</span>
                    <span className="card-value-unit">sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────
              RIGHT COLUMN — BODY METRICS
          ───────────────────────────── */}
          <div className="metrics-col">

            {/* Goal card */}
            {user && (
              <div className="dash-card goal-card">
                <div className="goal-card-inner">
                  <div className="icon-badge icon-badge--teal">
                    <TrendingUpIcon />
                  </div>
                  <div className="goal-text-wrap">
                    <p className="card-label" style={{ marginBottom: 4 }}>Current Goal</p>
                    <p className="goal-value">
                      {user.goal === 'lose'     && 'Lose Weight'}
                      {user.goal === 'maintain' && 'Maintain Weight'}
                      {user.goal === 'gain'     && 'Gain Muscle'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Body metrics card */}
            {user && user.weight && (
              <div className="dash-card body-card">
                <div className="body-card-inner">
                  <div className="body-card-header">
                    <div className="icon-badge icon-badge--indigo">
                      <ScaleIcon />
                    </div>
                    <h3 className="body-card-title">Body Metrics</h3>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">Weight</span>
                    <span className="metric-value">{user.weight} kg</span>
                  </div>

                  {user.height && (
                    <div className="metric-row">
                      <span className="metric-label">Height</span>
                      <span className="metric-value">{user.height} cm</span>
                    </div>
                  )}

                  {user.height && (() => {
                    const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
                    const bmiColor = (b: number) => {
                      if (b < 18.5) return '#60a5fa'
                      if (b < 25)   return '#4ade80'
                      if (b < 30)   return '#fb923c'
                      return '#fb7185'
                    }
                    return (
                      <div className="bmi-wrap">
                        <div className="bmi-header">
                          <span className="card-label">BMI Score</span>
                          <span className="bmi-score" style={{ color: bmiColor(Number(bmi)) }}>
                            {bmi}
                          </span>
                        </div>
                        <div className="bmi-bar">
                          <div className="bmi-seg" style={{ background: '#60a5fa' }} />
                          <div className="bmi-seg" style={{ background: '#4ade80' }} />
                          <div className="bmi-seg" style={{ background: '#fb923c' }} />
                          <div className="bmi-seg" style={{ background: '#fb7185' }} />
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Today's Summary */}
            <div className="dash-card summary-card">
              <div className="summary-card-inner">
                <h3 className="summary-title">Today's Summary</h3>
                <div className="summary-row">
                  <span className="summary-key">Meals Logged</span>
                  <span className="summary-val">{todayFood.length}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-key">Total Calories</span>
                  <span className="summary-val">{totalCalories}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-key">Active Min</span>
                  <span className="summary-val">{totalActiveMinutes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────
              AI COACH CARD (col-span-6)
          ───────────────────────────── */}
          <div className="dash-card coach-card">
            <div className="coach-card-inner">
              <div className="coach-header">
                <div className="icon-badge icon-badge--green">
                  <SparklesIcon />
                </div>
                <div className="coach-title-wrap">
                  <h3 className="coach-title">Agentic Health Coach</h3>
                  <p className="coach-subtitle">AI-Generated Insights</p>
                </div>
              </div>

              <div className="coach-body">
                {coachLoading ? (
                  <div className="coach-loading">
                    <svg className="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
                    </svg>
                    <span>Analyzing your health patterns…</span>
                  </div>
                ) : coachError ? (
                  <div className="coach-error">{coachError}</div>
                ) : coachTips.length === 0 ? (
                  <div className="coach-empty">
                    <SparklesIcon />
                    <span>Log more meals and activities to unlock personalized coach insights.</span>
                  </div>
                ) : (
                  <div className="coach-tips">
                    {coachTips.map((tip, index) => (
                      <div
                        key={index}
                        className="tip-card"
                        style={{ animation: `slideInRight 0.5s ${index * 0.1}s cubic-bezier(0.16,1,0.3,1) both` }}
                      >
                        <span className="tip-index">0{index + 1}</span>
                        <p className="tip-text">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────
              WEEKLY CHART (col-span-6)
          ───────────────────────────── */}
          <div className="dash-card chart-card">
            <div className="chart-card-inner">
              <div className="chart-header">
                <h3 className="chart-title">Weekly Overview</h3>
                <p className="chart-subtitle">Calories vs Activity</p>
              </div>
              <div className="chart-wrap">
                <CaloriesChart />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard