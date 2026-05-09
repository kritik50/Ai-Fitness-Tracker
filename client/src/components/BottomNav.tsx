import { Activity, Home, User, Utensils } from "lucide-react"
import { NavLink } from "react-router-dom"

const BottomNav = () => {

    const navItems = [
        {path: '/', label: 'Home', icon:Home},
        {path: '/food', label: 'Food', icon: Utensils},
        {path: '/activity', label: 'Activity', icon: Activity},
        {path: '/profile', label: 'Profile', icon: User},
    ]

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 px-3 pb-safe lg:hidden transition-all duration-300 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-[74px]">
        {navItems.map((item)=> (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
          >
            <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-[20px] transition-all duration-300">
              <item.icon className="size-5" style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
              <span className="text-[10px] font-semibold tracking-[0.08em] uppercase">{item.label}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
