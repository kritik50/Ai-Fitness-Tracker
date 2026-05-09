import { useState } from "react";
import { useAppContext } from "../context/useAppContext"
import { useTheme } from "../context/useTheme";
import type { ProfileFormData } from "../types";
import Card from "../components/ui/Card";
import { Calendar, LogOutIcon, MoonIcon, Scale, SunIcon, Target, User } from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import toast from "react-hot-toast";
import api from "../configs/api";
import { getApiErrorMessage } from "../utils/api";
import "../pages/Profile.css"


const Profile = () => {
  const {user, logout, fetchUser, allFoodLogs, allActivityLogs} = useAppContext();
  const { theme, toggleTheme } = useTheme()

  const getProfileFormData = (): ProfileFormData => ({
    age: user?.age || 0,
    weight: user?.weight || 0,
    height: user?.height || 0,
    goal: user?.goal || 'maintain',
    dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
    dailyCalorieBurn: user?.dailyCalorieBurn || 400,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>(getProfileFormData)

  const handleSave = async ()=>{
    try {
      await api.put('/api/profiles/me', formData)
      await fetchUser(user?.token || '')
      toast.success('Profile updated successfully')
    } catch (error: unknown) {
       console.log(error);
       toast.error(getApiErrorMessage(error, "Failed to update profile"));
    }
    setIsEditing(false)
  }

   const getStats = ()=>{
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allActivityLogs?.length || 0;

    return {totalFoodEntries, totalActivities}
   }

   const stats = getStats();

  if(!user || !formData) return null

  const profileInfoItems = [
    {
      label: 'Age',
      value: `${user.age} years`,
      icon: Calendar,
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.08))',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      iconColor: '#3b82f6',
    },
    {
      label: 'Weight',
      value: `${user.weight} kg`,
      icon: Scale,
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(168, 85, 247, 0.08))',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      iconColor: '#8b5cf6',
    },
    ...(user.height !== 0 ? [{
      label: 'Height',
      value: `${user.height} cm`,
      icon: User,
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 214, 160, 0.08))',
      border: '1px solid rgba(16, 185, 129, 0.15)',
      iconColor: '#10b981',
    }] : []),
    {
      label: 'Goal',
      value: goalLabels[user?.goal || 'gain'],
      icon: Target,
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(251, 146, 60, 0.08))',
      border: '1px solid rgba(249, 115, 22, 0.15)',
      iconColor: '#f97316',
    },
  ];

  return (
  <div className='profile-page'>

    {/* HEADER */}

    <div className="profile-header">

      <div className="profile-header-content">

        <h1 className="profile-title">
          Profile
        </h1>

        <p className="profile-subtitle">
          Manage your settings
        </p>

      </div>

    </div>

    <div className='profile-layout'>

      {/* LEFT */}

      <Card className="profile-main-card">

        <div className="profile-card-content">

          {/* TOP */}

          <div className="profile-top">

            <div className="profile-avatar">
              <User className='profile-avatar-icon' />
            </div>

            <div>

              <h2 className="profile-card-title">
                Your Profile
              </h2>

              <p className="profile-member-since">
                Member since {new Date(user?.createdAt || '').toLocaleDateString()}
              </p>

            </div>

          </div>

          {/* EDIT MODE */}

          {isEditing ? (

            <div className="profile-form">

              <Input
                label="Age"
                type='number'
                value={formData.age}
                onChange={(v)=>setFormData({...formData, age: Number(v)})}
                min={13}
                max={120}
              />

              <Input
                label="Weight (kg)"
                type='number'
                value={formData.weight}
                onChange={(v)=>setFormData({...formData, weight: Number(v)})}
                min={20}
                max={300}
              />

              <Input
                label="Height (cm)"
                type='number'
                value={formData.height}
                onChange={(v)=>setFormData({...formData, height: Number(v)})}
                min={100}
                max={250}
              />

              <Select
                label="Fitness Goal"
                value={formData.goal as string}
                onChange={(v)=> setFormData({...formData, goal: v as 'lose' | 'maintain' | 'gain'})}
                options={goalOptions}
              />

              <div className="profile-actions">

                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={()=>{
                    setIsEditing(false);
                    setFormData(getProfileFormData())
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSave}
                  className="flex-1"
                >
                  Save Changes
                </Button>

              </div>

            </div>

          ) : (

            <>
              <div className="profile-info-list">

                {profileInfoItems.map((item, idx) => {

                  const IconComp = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="profile-info-card"
                      style={{
                        animationDelay: `${idx * 0.06}s`
                      }}
                    >

                      <div
                        className="profile-info-icon"
                        style={{
                          background: item.gradient,
                          border: item.border,
                        }}
                      >
                        <IconComp
                          className="profile-info-svg"
                          style={{
                            color: item.iconColor
                          }}
                        />
                      </div>

                      <div>

                        <p className="profile-info-label">
                          {item.label}
                        </p>

                        <p className="profile-info-value">
                          {item.value}
                        </p>

                      </div>

                    </div>
                  )
                })}

              </div>

              <Button
                variant="secondary"
                onClick={()=>{
                  setFormData(getProfileFormData())
                  setIsEditing(true)
                }}
                className="edit-profile-btn"
              >
                Edit Profile
              </Button>

            </>
          )}

        </div>

      </Card>

      {/* RIGHT */}

      <div className="profile-sidebar">

        {/* STATS */}

        <Card className="stats-card">

          <div className="stats-card-content">

            <h3 className='stats-title'>
              Your Stats
            </h3>

            <div className="stats-grid">

              <div className="stat-box food">

                <p className="stat-number green">
                  {stats.totalFoodEntries}
                </p>

                <p className="stat-label">
                  Food entries
                </p>

              </div>

              <div className="stat-box activity">

                <p className="stat-number blue">
                  {stats.totalActivities}
                </p>

                <p className="stat-label">
                  Activities
                </p>

              </div>

            </div>

          </div>

        </Card>

        {/* MOBILE THEME BUTTON */}

        <div className='mobile-theme-wrap'>

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
          >

            {theme === 'light'
              ? <MoonIcon className='theme-icon'/>
              : <SunIcon className='theme-icon'/>
            }

            <span className="theme-text">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>

          </button>

        </div>

        {/* LOGOUT */}

        <Button
          variant="danger"
          onClick={logout}
          className="logout-btn"
        >
          <LogOutIcon className='logout-icon'/>
          Logout
        </Button>

      </div>

    </div>
  </div>
)
}

export default Profile