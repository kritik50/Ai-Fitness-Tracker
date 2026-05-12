import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User } from "lucide-react"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/useAppContext"
import type { ProfileFormData } from "../types"
import Button from "../components/ui/Button"
import { ageRanges, goalOptions } from "../assets/assets"
import Slider from "../components/ui/Slider"
import api from "../configs/api"
import { getApiErrorMessage } from "../utils/api"
import "../pages/Onboarding.css"


const Onboarding = () => {

   const [step, setStep] = useState(1)
   const {user, setOnboardingCompleted, fetchUser} = useAppContext()
   const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height:0,
    goal: 'maintain',
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400
   })

   const totalSteps = 3;

   const updateField = (field: keyof ProfileFormData, value: string | number)=>{
    setFormData({...formData, [field]: value})
   }

   const handleNext = async ()=>{
    if(step === 1){
      if(!formData.age || Number(formData.age) < 13 || Number(formData.age) > 120){
        return toast("Age is required")
      }
    }
    if(step < totalSteps){
      if(step === 2 && !formData.weight){
        return toast('Weight is required')
      }
      setStep(step + 1);
    }else{
      const userData = {
        ...formData,
        age: formData.age,
        weight: formData.weight,
        height: formData.height ? formData.height : null,
      };
      try {
        await api.put('/api/profiles/me', userData)
        toast.success('Profile updated successfully')
        setOnboardingCompleted(true)
        await fetchUser(user?.token || "")
      } catch (error: unknown) {
        console.log(error);
        toast.error(getApiErrorMessage(error, "Failed to complete onboarding"))
      }
      
    }
   }

  return (
    <>
      <Toaster />
      <div className="ob-page">
        <div className="ob-shell">

          {/* ── Brand header ── */}
          <div className="ob-header">
            <div className="ob-brand-row">
              <div className="ob-brand-icon">
                <PersonStanding style={{ width: 24, height: 24 }} />
              </div>
              <span className="ob-brand-name">FitTrack</span>
            </div>
            <p className="ob-subtitle">Let's personalize your experience</p>
          </div>

          {/* ── Progress bar ── */}
          <div className="ob-progress">
            <div className="ob-progress-track">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`ob-progress-seg${s <= step ? ' active' : ''}`}>
                  {s <= step && <div className="ob-progress-fill" />}
                </div>
              ))}
            </div>
            <span className="ob-step-label">Step {step} of {totalSteps}</span>
          </div>

          {/* ── Card ── */}
          <div className="ob-card">

            {/* Step 1 — Age */}
            {step === 1 && (
              <>
                <div className="ob-step-header">
                  <div className="ob-step-icon">
                    <User style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <h2 className="ob-step-title">How old are you?</h2>
                    <p className="ob-step-desc">This helps us calculate your needs</p>
                  </div>
                </div>

                <div className="ob-fields">
                  <div className="ob-field">
                    <label className="ob-label">
                      Age <span className="ob-label-required">*</span>
                    </label>
                    <input
                      className="ob-input"
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => updateField('age', e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="Enter your age"
                      min={13}
                      max={120}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2 — Measurements */}
            {step === 2 && (
              <>
                <div className="ob-step-header">
                  <div className="ob-step-icon">
                    <ScaleIcon style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <h2 className="ob-step-title">Your measurements</h2>
                    <p className="ob-step-desc">Help us track your progress</p>
                  </div>
                </div>

                <div className="ob-fields">
                  <div className="ob-field">
                    <label className="ob-label">
                      Weight (kg) <span className="ob-label-required">*</span>
                    </label>
                    <input
                      className="ob-input"
                      type="number"
                      value={formData.weight || ''}
                      onChange={(e) => updateField('weight', e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="e.g. 70"
                      min={20}
                      max={300}
                    />
                  </div>

                  <div className="ob-field">
                    <label className="ob-label">Height (cm) — Optional</label>
                    <input
                      className="ob-input"
                      type="number"
                      value={formData.height || ''}
                      onChange={(e) => updateField('height', e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="e.g. 175"
                      min={100}
                      max={250}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3 — Goal */}
            {step === 3 && (
              <>
                <div className="ob-step-header">
                  <div className="ob-step-icon">
                    <Target style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <h2 className="ob-step-title">What's your goal?</h2>
                    <p className="ob-step-desc">We'll tailor your experience</p>
                  </div>
                </div>

                {/* Goal options */}
                <div className="ob-goal-list">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`ob-goal-btn${formData.goal === option.value ? ' selected' : ''}`}
                      onClick={() => {
                        const age = Number(formData.age);
                        const range = ageRanges.find((r) => age <= r.max) || ageRanges[ageRanges.length - 1]

                        let intake = range.maintain;
                        let burn = range.burn;

                        if (option.value === 'lose') {
                          intake -= 400;
                          burn += 100;
                        } else if (option.value === 'gain') {
                          intake += 500;
                          burn -= 100;
                        }

                        setFormData({
                          ...formData,
                          goal: option.value as 'lose' | 'maintain' | 'gain',
                          dailyCalorieIntake: intake,
                          dailyCalorieBurn: burn,
                        })
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="ob-divider" />

                {/* Daily Targets */}
                <div>
                  <p className="ob-targets-heading">Daily Targets</p>
                  <div className="ob-sliders">
                    <Slider
                      label="Daily Calorie Intake"
                      min={1200} max={4000} step={50}
                      value={formData.dailyCalorieIntake}
                      onChange={(v) => updateField('dailyCalorieIntake', v)}
                      unit="kcal"
                      infoText="The total calories you plan to consume each day."
                    />
                    <Slider
                      label="Daily Calorie Burn"
                      min={100} max={2000} step={50}
                      value={formData.dailyCalorieBurn}
                      onChange={(v) => updateField('dailyCalorieBurn', v)}
                      unit="kcal"
                      infoText="The total calories you aim to burn through exercise and activity each day."
                    />
                  </div>
                </div>
              </>
            )}

          </div>{/* /ob-card */}

          {/* ── Navigation ── */}
          <div className="ob-nav">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step > 1 ? step - 1 : 1)}>
                <ArrowLeft style={{ width: 18, height: 18 }} />
                Back
              </Button>
            )}
            <Button onClick={handleNext}>
              {step === totalSteps ? 'Get Started' : 'Continue'}
              <ArrowRight style={{ width: 18, height: 18 }} />
            </Button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Onboarding