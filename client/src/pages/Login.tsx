import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, PersonStandingIcon } from "lucide-react"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/useAppContext"
import { Toaster } from "react-hot-toast"
import "../pages/Login.css"

/* ─── Floating stat cards rendered inside the right panel ─── */
const RightPanel = () => {
  const bars = [55, 70, 45, 80, 65, 90, 75]
  const days  = ['M','T','W','T','F','S','S']
  const done  = [0, 1, 2, 3, 4]

  return (
    <div className="login-right">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="right-grid" />

      {/* SVG gradient defs */}
      <svg width="0" height="0" style={{ position:'absolute' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#10b981" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>
      </svg>

      <div className="scene">

        {/* Central glowing sphere */}
        <div className="sphere-wrap">
          <div className="sphere-ring-2" />
          <div className="sphere-ring" />
          <div className="sphere" />
        </div>

        {/* Card 1 — Weekly Calories */}
        <div className="float-card card-stats">
          <div className="card-stats-label">Weekly Calories</div>
          <div className="card-stats-value">
            14<span className="card-stats-unit">k</span>
          </div>
          <div className="card-stats-meta">↑ 12% vs last week</div>
          <div className="bar-chart">
            {bars.map((h, i) => (
              <div
                key={i}
                className={`bar${i === 5 ? ' active' : ''}`}
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Card 2 — Heart Rate */}
        <div className="float-card card-heart">
          <div className="card-heart-header">
            <span className="heart-icon">❤</span>
            <span className="card-heart-title">Heart Rate</span>
          </div>
          <div className="heart-bpm">
            142<span>bpm</span>
          </div>
          <svg className="ecg-svg" viewBox="0 0 130 36" preserveAspectRatio="none">
            <polyline
              className="ecg-path"
              points="0,18 15,18 20,18 24,4 28,32 32,18 50,18 54,14 58,22 62,18 80,18 84,4 88,32 92,18 110,18 114,14 118,22 122,18 130,18"
            />
          </svg>
        </div>

        {/* Card 3 — Daily Goal ring */}
        <div className="float-card card-ring">
          <div className="ring-label">Daily Goal</div>
          <div className="ring-wrap">
            <svg className="ring-svg" viewBox="0 0 80 80">
              <circle className="ring-bg"   cx="40" cy="40" r="30" />
              <circle className="ring-fill" cx="40" cy="40" r="30" />
            </svg>
            <div className="ring-center">
              <div className="ring-pct">75%</div>
              <div className="ring-sub">complete</div>
            </div>
          </div>
        </div>

        {/* Card 4 — Streak */}
        <div className="float-card card-streak">
          <div className="streak-header">
            <span className="streak-title">Streak</span>
            <span className="streak-badge">🔥 Active</span>
          </div>
          <div className="streak-days">
            {days.map((d, i) => (
              <div
                key={i}
                className={`streak-dot${done.includes(i) ? ' done' : ''}${i === 4 ? ' today' : ''}`}
              >
                <span>{d}</span>
              </div>
            ))}
          </div>
          <div className="streak-count">
            <strong>18 days</strong> in a row 🏆
          </div>
        </div>

      </div>

      <div className="right-tagline">
        <div className="right-tagline-title">Track. Improve. Conquer.</div>
        <div className="right-tagline-sub">Your fitness journey starts here</div>
      </div>
    </div>
  )
}

/* ─── Main Login Component ─── */
const Login = () => {
  const [state, setState]               = useState('login')
  const [username, setUsername]         = useState('')
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { login, signup, user } = useAppContext()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (state === 'login') {
      await login({ email, password })
    } else {
      await signup({ username, email, password })
    }
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  return (
    <>
      <Toaster />
      <div className="login-page-container">

        {/* ── LEFT: Auth form ── */}
        <div className="login-left">
          <form onSubmit={handleSubmit} className="login-form">

            {/* Brand */}
            <div className="brand" style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
              <div className="brand-icon">
                <PersonStandingIcon />
              </div>
              <span className="brand-name">FitTrack</span>
            </div>

            {/* Title */}
            <h2 className="form-title" style={{ animation: 'fadeInUp 0.5s 0.05s cubic-bezier(0.16,1,0.3,1) both' }}>
              {state === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="form-subtitle" style={{ animation: 'fadeInUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both' }}>
              {state === 'login'
                ? 'Enter your credentials to access your dashboard.'
                : 'Fill in your details to get started today.'}
            </p>

            {/* Username (signup only) */}
            {state !== 'login' && (
              <div className="field-group" style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
                <label className="field-label">Username</label>
                <div className="field-wrapper">
                  <AtSignIcon className="field-icon" />
                  <input
                    type="text"
                    placeholder="enter a username"
                    className="login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="field-group" style={{ animation: 'fadeInUp 0.5s 0.15s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="field-label">Email</label>
              <div className="field-wrapper">
                <MailIcon className="field-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group" style={{ animation: 'fadeInUp 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="field-label">Password</label>
              <div className="field-wrapper">
                <LockIcon className="field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <div className="form-divider" style={{ animation: 'fadeInUp 0.5s 0.22s cubic-bezier(0.16,1,0.3,1) both' }} />

            {/* Submit */}
            <div className="submit-wrapper" style={{ animation: 'fadeInUp 0.5s 0.25s cubic-bezier(0.16,1,0.3,1) both' }}>
              <button type="submit" className="login-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="btn-spinner">
                    <svg className="spin-icon" width="16" height="16" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {state === 'login' ? 'Signing in…' : 'Creating account…'}
                  </span>
                ) : (
                  state === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>

            {/* Auth switch */}
            <div className="auth-switch" style={{ animation: 'fadeInUp 0.5s 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
              {state === 'login' ? (
                <>
                  Don't have an account?
                  <button type="button" className="auth-switch-btn" onClick={() => setState('sign-up')}>
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button type="button" className="auth-switch-btn" onClick={() => setState('login')}>
                    Sign in
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* ── RIGHT: 3D visual panel ── */}
        <RightPanel />
      </div>
    </>
  )
}

export default Login