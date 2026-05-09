import {
  ActivityIcon,
  HomeIcon,
  Moon,
  Sun,
  Dumbbell,
  UserIcon,
  UtensilsIcon
} from "lucide-react"

import { useTheme } from "../context/useTheme"
import { NavLink } from "react-router-dom"
import "../components/Sidebar.css"

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon, subtitle: 'View your dashboard' },
    { path: '/food', label: 'Food', icon: UtensilsIcon, subtitle: 'Track your meals' },
    { path: '/activity', label: 'Activity', icon: ActivityIcon, subtitle: 'Log workouts' },
    { path: '/profile', label: 'Profile', icon: UserIcon, subtitle: 'Manage account' },
  ]

  const { theme, toggleTheme } = useTheme()

  return (
    <nav className={`sidebar ${theme}`} aria-label="Primary navigation">

      <div className="sidebar-content">

        {/* Header */}
        <div className="sidebar-header">

          <div className="sidebar-top-row">

            <div className="brand-section">

              <div className="brand-icon">
                <Dumbbell size={24} strokeWidth={2.5} />
              </div>

              <div>
                <p className="brand-tag">Fitness Suite</p>
                <h1 className="brand-title">FitTrack</h1>
              </div>

            </div>

            <span className="pro-badge">Pro</span>

          </div>

          <p className="sidebar-description">
            A calm workspace for movement, meals, and progress.
          </p>

        </div>

        {/* Navigation */}
        <div className="nav-section">

          <p className="nav-heading">Quick Links</p>

          <div className="nav-links">

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className="nav-link-wrapper"
              >
                {({ isActive }) => (
                  <div className={`nav-card ${isActive ? "active" : ""}`}>

                    {isActive && <div className="active-indicator" />}

                    <div className={`nav-icon-box ${isActive ? "active" : ""}`}>
                      <item.icon
                        size={18}
                        strokeWidth={2.2}
                        className="nav-icon"
                      />
                    </div>

                    <div className="nav-text">
                      <p className="nav-title">{item.label}</p>
                      <p className="nav-subtitle">{item.subtitle}</p>
                    </div>

                    <div className="nav-arrow">→</div>

                  </div>
                )}
              </NavLink>
            ))}

          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle-wrapper">

        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
        >

          <div className="theme-icon-box">
            {theme === 'light' ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </div>

          <div className="theme-text">
            <p className="theme-title">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </p>

            <p className="theme-subtitle">
              Switch workspace ambience
            </p>
          </div>

          <span className="theme-refresh">↺</span>

        </button>

      </div>
    </nav>
  )
}

export default Sidebar