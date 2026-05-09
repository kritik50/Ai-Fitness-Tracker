import React, { useRef, useState, useCallback } from "react";
import { useAppContext } from "../context/useAppContext"
import type { FoodEntry, FoodFormData } from "../types";
import Card from "../components/ui/Card";
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets";
import Button from "../components/ui/Button";
import { Loader2Icon, PlusIcon, SparkleIcon, Trash2Icon, UtensilsCrossedIcon, FlameIcon, ClockIcon, SparklesIcon } from "lucide-react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import toast from "react-hot-toast";
import api from "../configs/api";
import { getApiErrorMessage } from "../utils/api";
import "../pages/FoodLog.css"

const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs } = useAppContext();

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FoodFormData>({
    name: '',
    calories: 0,
    mealType: ''
  })
  const [loading, setLoading] = useState(false)
  const [estimating, setEstimating] = useState(false)   // ← NEW
  const inputRef = useRef<HTMLInputElement>(null)

  const today = new Date().toISOString().split('T')[0];
  const entries = allFoodLogs.filter((entry: FoodEntry) => entry.createdAt?.split('T')[0] === today)

  // ── AUTO-ESTIMATE on food name blur ────────────────────────
  const handleNameBlur = useCallback(async (name: string) => {
    if (!name.trim() || formData.calories > 0) return;   // skip if already filled

    setEstimating(true)
    try {
      const { data } = await api.post('/api/food-logs/estimate-calories', { name: name.trim() })
      if (data.calories) {
        setFormData(prev => ({ ...prev, calories: data.calories }))
        toast.success(`~${data.calories} kcal estimated`, { icon: '🤖', duration: 2000 })
      }
    } catch {
      // silent — user can still type manually
    } finally {
      setEstimating(false)
    }
  }, [formData.calories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.calories || formData.calories <= 0 || !formData.mealType) {
      return toast.error('Please enter valid data')
    }

    try {
      const { data } = await api.post('/api/food-logs', { data: formData })
      setAllFoodLogs(prev => [...prev, data])
      setFormData({ name: '', calories: 0, mealType: '' })
      setShowForm(false)
    } catch (error: unknown) {
      console.log(error);
      toast.error(getApiErrorMessage(error));
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!documentId) { toast.error('Unable to delete this entry.'); return; }

    try {
      const confirm = window.confirm('Are you sure you want to delete this entry?');
      if (!confirm) return;

      await api.delete(`/api/food-logs/${documentId}`)
      setAllFoodLogs(prev => prev.filter((e) => e.documentId !== documentId))
    } catch (error: unknown) {
      console.log(error)
      toast.error(getApiErrorMessage(error));
    }
  }

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)

  const groupedEntries: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]> = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) acc[entry.mealType] = [];
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>)

  const handleQuickAdd = (mealType: FoodEntry["mealType"]) => {
    setFormData((current) => ({ ...current, mealType }))
    setShowForm(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true)
    const payload = new FormData();
    payload.append('image', file)
    try {
      const { data } = await api.post('/api/image-analysis', payload);
      const result = data.result;
      let mealType: FoodEntry["mealType"] | "" = "";

      const hour = new Date().getHours()
      if (hour >= 0 && hour < 12)       mealType = 'breakfast';
      else if (hour >= 12 && hour < 16) mealType = 'lunch';
      else if (hour >= 16 && hour < 18) mealType = 'snack';
      else if (hour >= 18 && hour < 24) mealType = 'dinner';

      if (!mealType || !result.name || !result.calories) return toast.error('Missing data')

      const { data: newEntry } = await api.post('/api/food-logs', { data: { name: result.name, calories: result.calories, mealType } })
      setAllFoodLogs(prev => [...prev, newEntry])

      if (inputRef.current) inputRef.current.value = ''
    } catch (error: unknown) {
      console.log(error);
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="food-page">

      {/* HEADER */}
      <div className="food-header">
        <div className="food-header-row">
          <div>
            <h1 className="food-title">Food Log</h1>
            <p className="food-subtitle">Track your daily intake</p>
          </div>
          <div className="food-summary">
            <p className="summary-label">Today's Total</p>
            <p className="summary-value">{totalCalories} kcal</p>
          </div>
        </div>
      </div>

      <div className="food-grid">

        {/* QUICK ACTIONS */}
        {!showForm && (
          <div className="quick-section">
            <Card>
              <h3 className="section-heading">Quick Add</h3>
              <div className="quick-grid">
                {quickActivitiesFoodLog.map((activity) => (
                  <button
                    key={activity.name}
                    onClick={() => handleQuickAdd(activity.name as FoodEntry["mealType"])}
                    className="quick-btn"
                  >
                    {activity.emoji} {activity.name}
                  </button>
                ))}
              </div>
            </Card>

            <Button className='food-action-btn' onClick={() => setShowForm(true)}>
              <PlusIcon className='btn-icon' />
              Add Food Entry
            </Button>

            <Button className='food-action-btn secondary' onClick={() => { inputRef.current?.click() }}>
              <SparkleIcon className='btn-icon' />
              AI Food Snap
            </Button>

            <input onChange={handleImageChange} type="file" accept="image/*" hidden ref={inputRef} />

            {loading && (
              <div className="loading-overlay">
                <div className="loading-card">
                  <Loader2Icon className="loading-spinner" />
                  <p className="loading-text">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <Card className="food-form-card">
            <h3 className="form-title">New Food Entry</h3>

            <form className="food-form" onSubmit={handleSubmit}>

              {/* Food Name — triggers calorie estimate on blur */}
              <div className="field-group">
                <label className="field-label">Food Name</label>
                <div className="field-wrapper">
                  <UtensilsCrossedIcon className="field-icon" />
                  <Input
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v.toString(), calories: 0 })}
                    onBlur={(e) => handleNameBlur((e.target as HTMLInputElement).value)}
                    placeholder="e.g., Grilled Chicken Salad"
                    required
                    className="food-input"
                  />
                </div>
              </div>

              {/* Calories — auto-filled, editable */}
              <div className="field-group">
                <label className="field-label">
                  Calories
                  {estimating && (
                    <span className="calories-estimating">
                      <SparklesIcon className="estimating-icon" />
                      Estimating…
                    </span>
                  )}
                  {!estimating && formData.calories > 0 && (
                    <span className="calories-auto-badge">AI estimate</span>
                  )}
                </label>
                <div className="field-wrapper">
                  <FlameIcon className="field-icon" />
                  {estimating ? (
                    <div className="food-input-skeleton" />
                  ) : (
                    <Input
                      type="number"
                      value={formData.calories || ''}
                      onChange={(v) => setFormData({ ...formData, calories: Number(v) })}
                      placeholder="Auto-filled or enter manually"
                      required
                      min={1}
                      className="food-input"
                    />
                  )}
                </div>
              </div>

              {/* Meal Type */}
              <div className="field-group">
                <label className="field-label">Meal Type</label>
                <div className="field-wrapper">
                  <ClockIcon className="field-icon" />
                  <Select
                    value={formData.mealType}
                    onChange={(v) => setFormData({ ...formData, mealType: v.toString() })}
                    options={mealTypeOptions}
                    placeholder="Select meal type"
                    required
                    className="food-select"
                  />
                </div>
              </div>

              <div className="form-actions">
                <Button
                  className='flex-1'
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', calories: 0, mealType: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className='flex-1' disabled={estimating}>
                  Add Entry
                </Button>
              </div>

            </form>
          </Card>
        )}

        {/* EMPTY */}
        {entries.length === 0 ? (
          <Card className="empty-food-card">
            <div className="empty-food-content">
              <div className="empty-food-icon">
                <UtensilsCrossedIcon className='empty-icon-svg' />
              </div>
              <h3 className="empty-food-title">No food logged today</h3>
              <p className="empty-food-subtitle">Start tracking your meals to stay on target</p>
            </div>
          </Card>
        ) : (
          <div className="meal-groups">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, mealIdx) => {
              const mealTypeKey = mealType as keyof typeof groupedEntries;
              if (!groupedEntries[mealTypeKey]) return null;

              const MealIcon = mealIcons[mealTypeKey];
              const mealCalories = groupedEntries[mealTypeKey].reduce((sum, e) => sum + e.calories, 0);

              return (
                <Card key={mealType} className="meal-card">
                  <div style={{ animation: `fadeUp 0.5s ${0.1 + mealIdx * 0.08}s both` }}>
                    <div className="meal-header">
                      <div className="meal-left">
                        <div className={`meal-icon ${mealColors[mealTypeKey]}`}>
                          <MealIcon className='meal-icon-svg' />
                        </div>
                        <div>
                          <h3 className="meal-title">{mealType}</h3>
                          <p className="meal-count">{groupedEntries[mealTypeKey].length} items</p>
                        </div>
                      </div>
                      <p className="meal-calories">{mealCalories} kcal</p>
                    </div>

                    <div className="food-list">
                      {groupedEntries[mealTypeKey].map((entry) => (
                        <div key={entry.id} className="food-item">
                          <div className="food-item-left">
                            <p className="food-name">{entry.name}</p>
                            <p className="food-type">{entry.mealType}</p>
                          </div>
                          <div className="food-item-right">
                            <span className="food-calories">{entry.calories} kcal</span>
                            <button onClick={() => handleDelete(entry?.documentId || '')} className='delete-food-btn'>
                              <Trash2Icon className='delete-food-icon' />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default FoodLog