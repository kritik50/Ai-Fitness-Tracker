import { useState } from "react";
import { useAppContext } from "../context/useAppContext"
import type { ActivityEntry } from "../types";
import Card from "../components/ui/Card";
import { quickActivities } from "../assets/assets";
import { ActivityIcon, DumbbellIcon, PlusIcon, TimerIcon, Trash2Icon } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import api from "../configs/api";
import { getApiErrorMessage } from "../utils/api";
import "../Pages/ActivityLog.css"

const ActivityLog = () => {

  const {allActivityLogs, setAllActivityLogs} = useAppContext();

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({name: '', duration: 0, calories: 0})

  const today = new Date().toISOString().split('T')[0];
  const activities = allActivityLogs.filter((activity: ActivityEntry) => activity.createdAt?.split('T')[0] === today)

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(!formData.name.trim() || formData.duration <=0){
      return toast('Please enter valid data')
    }
    try {
      
      const {data} = await api.post('/api/activity-logs', {data: formData})

      setAllActivityLogs(prev => [...prev, data])
      setFormData({name: '', duration: 0, calories: 0})
      setShowForm(false)
    } catch (error: unknown) {
      console.log(error);
      toast.error(getApiErrorMessage(error));
    }
  }

  const handleQuickAdd = (activity: {name: string, rate: number})=>{
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate
    })
    setShowForm(true)
  }

  const handleDurationChange = (val: string | number)=>{
    const duration = Number(val);
    const activity = quickActivities.find(a => a.name === formData.name)

    let calories = formData.calories
    if(activity){
      calories = duration * activity.rate
    }

    setFormData({...formData, duration, calories})
  }

  const handleDelete = async (documentId: string)=>{
    if(!documentId){
      toast.error('Unable to delete this entry.');
      return;
    }

    try {
      const confirm = window.confirm('Are you sure you want to delete this entry?')
      if(!confirm) return;
      await api.delete(`/api/activity-logs/${documentId}`);
      setAllActivityLogs(prev => prev.filter((a)=> a.documentId !== documentId))
    } catch (error: unknown) {
      console.log(error);
      toast.error(getApiErrorMessage(error));
    }  
  }
  

  const totalMinutes: number = activities.reduce((sum, a)=> sum + a.duration, 0)

  return (
  <div className="activity-page">

    {/* Header */}
    <div className="activity-header">

      <div className="activity-header-row">

        <div>
          <h1 className="activity-title">Activity Log</h1>
          <p className="activity-subtitle">
            Track your workouts
          </p>
        </div>

        <div className="activity-summary">
          <p className="summary-label">
            Active Today
          </p>

          <p className="summary-value">
            {totalMinutes} min
          </p>
        </div>

      </div>

    </div>

    <div className="activity-grid">

      {/* Quick Add */}
      {!showForm && (
        <div className="quick-add-section">

          <Card>
            <h3 className="section-heading">
              Quick Add
            </h3>

            <div className="quick-add-grid">

              {quickActivities.map((activity) => (
                <button
                  key={activity.name}
                  onClick={() => handleQuickAdd(activity)}
                  className="quick-add-btn"
                >
                  {activity.emoji} {activity.name}
                </button>
              ))}

            </div>
          </Card>

          <Button
            className="custom-activity-btn"
            onClick={() => setShowForm(true)}
          >
            <PlusIcon className="btn-icon" />
            Add Custom Activity
          </Button>

        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="activity-form-card">

          <h3 className="form-title">
            New Activity
          </h3>

          <form className="activity-form" onSubmit={handleSubmit}>

            <Input
              label='Activity Name'
              placeholder='e.g., Morning Run'
              required
              value={formData.name}
              onChange={(v)=>setFormData({...formData, name: v.toString()})}
            />

            <div className="form-row">

              <Input
                label='Duration (min)'
                type="number"
                className="flex-1"
                placeholder='30'
                min={1}
                max={300}
                required
                value={formData.duration}
                onChange={handleDurationChange}
              />

              <Input
                label='Calories Burned'
                type="number"
                className="flex-1"
                placeholder='200'
                min={1}
                max={2000}
                required
                value={formData.calories}
                onChange={(v)=>setFormData({...formData, calories: Number(v)})}
              />

            </div>

            <div className="form-actions">

              <Button
                type='button'
                variant='secondary'
                className='flex-1'
                onClick={()=>{
                  setShowForm(false);
                  setFormData({name: '', duration: 0, calories: 0})
                }}
              >
                Cancel
              </Button>

              <Button type='submit' className='flex-1'>
                Add Activity
              </Button>

            </div>

          </form>

        </Card>
      )}

      {/* Empty State */}
      {activities.length === 0 ? (
        <Card className="empty-state-card">

          <div className="empty-state-content">

            <div className="empty-state-icon">
              <DumbbellIcon className="empty-icon-svg"/>
            </div>

            <h3 className="empty-title">
              No activities logged today
            </h3>

            <p className="empty-subtitle">
              Start moving and track your progress
            </p>

          </div>

        </Card>
      ) : (
        <Card>

          <div className="activity-list-header">

            <div className="activity-list-icon">
              <ActivityIcon className='list-icon-svg'/>
            </div>

            <div>
              <h3 className='list-title'>
                Today's Activities
              </h3>

              <p className='list-subtitle'>
                {activities.length} logged
              </p>
            </div>

          </div>

          <div className="activity-list">

            {activities.map((activity, idx)=>(
              <div
                key={activity.id}
                className="activity-item"
                style={{
                  animationDelay: `${idx * 0.06}s`
                }}
              >

                <div className="activity-left">

                  <div className="activity-item-icon">
                    <TimerIcon className='timer-icon'/>
                  </div>

                  <div>
                    <p className="activity-name">
                      {activity.name}
                    </p>

                    <p className="activity-time">
                      {new Date(activity?.createdAt || '').toLocaleTimeString(
                        'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                    </p>
                  </div>

                </div>

                <div className="activity-right">

                  <div className="activity-stats">
                    <p className="activity-duration">
                      {activity.duration} min
                    </p>

                    <p className="activity-calories">
                      {activity.calories} kcal
                    </p>
                  </div>

                  <button
                    onClick={()=>handleDelete(activity.documentId)}
                    className="delete-btn"
                  >
                    <Trash2Icon className='delete-icon'/>
                  </button>

                </div>

              </div>
            ))}

          </div>

          <div className="activity-total">

            <span className="total-label">
              Total Active Time
            </span>

            <span className="total-value">
              {totalMinutes} minutes
            </span>

          </div>

        </Card>
      )}

    </div>
  </div>
)
}
export default ActivityLog
