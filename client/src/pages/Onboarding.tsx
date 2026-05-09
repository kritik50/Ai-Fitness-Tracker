import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User } from "lucide-react"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/useAppContext"
import type { ProfileFormData } from "../types"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { ageRanges, goalOptions } from "../assets/assets"
import Slider from "../components/ui/Slider"
import api from "../configs/api"
import { getApiErrorMessage } from "../utils/api"


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
      <div className="onboarding-container">
        {/* Header */}
        <div className="p-6 pt-12 onboarding-wrapper" style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #059669, #0d9488)',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
            }}>
              <PersonStanding className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">FitTrack</h1>
          </div>
          <p className="text-slate-400 dark:text-slate-500 mt-4 font-medium">Let's personalize your experience</p>
        </div>

         {/* Progress Indicator */}
         <div className="px-6 mb-8 onboarding-wrapper" style={{ animation: 'fadeInUp 0.5s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <div className="flex gap-2 max-w-2xl"> 
              {[1,2,3].map((s)=>(
                <div key={s} className="h-2 flex-1 rounded-full overflow-hidden" style={{
                  background: s <= step ? 'transparent' : 'rgba(148, 163, 184, 0.15)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  {s <= step && (
                    <div className="h-full w-full rounded-full" style={{
                      background: 'linear-gradient(90deg, #059669, #10b981)',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.25)',
                      animation: 'progressFill 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 font-medium">Step {step} of {totalSteps}</p>
         </div>

          {/* Form Content */}
          <div className="flex-1 px-6 onboarding-wrapper">
            {step === 1 && (
              <div className="space-y-6" style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <div className="flex items-center gap-4 mb-8">

                  <div className="size-12 rounded-2xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 214, 160, 0.08))',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                  <User className="size-6 text-emerald-500"/>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">How old are you?</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">This helps us calculate your needs</p>
                  </div>
                </div>
                <Input label="Age" type="number" className="max-w-2xl" value={formData.age} onChange={(v)=>updateField('age', v)} placeholder="Enter your age" min={13} max={120} required/>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 onboarding-wrapper" style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <div className="flex items-center gap-4 mb-8">

                  <div className="size-12 rounded-2xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 214, 160, 0.08))',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                  <ScaleIcon className="size-6 text-emerald-500"/>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Your measurements</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Help us track your progress</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 max-w-2xl">

                  <Input label="Weight (kg)" type="number" value={formData.weight} onChange={(v)=>updateField('weight', v)} placeholder="Enter your weight" min={20} max={300} required/>

                  <Input label="Height (cm) - Optional" type="number" value={formData.height} onChange={(v)=>updateField('height', v)} placeholder="Enter your height" min={100} max={250} />

                </div>
                
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 onboarding-wrapper" style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <div className="flex items-center gap-4 mb-8">

                  <div className="size-12 rounded-2xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 214, 160, 0.08))',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                  <Target className="size-6 text-emerald-500"/>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">What's your goal?</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">We'll tailor your experience</p>
                  </div>
                </div>


                {/* options  */}
                <div className="space-y-3 max-w-lg">
                  {goalOptions.map((option)=>(
                    <button 
                    key={option.value}
                    onClick={()=>{
                      const age = Number(formData.age);
                      const range = ageRanges.find((r)=>age <= r.max) || ageRanges[ageRanges.length - 1]

                      let intake = range.maintain;
                      let burn = range.burn;

                      if(option.value === 'lose'){
                        intake -= 400;
                        burn += 100;
                      }else if(option.value === 'gain'){
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
                    className="onboarding-option-btn"
                    style={formData.goal === option.value ? {
                      borderColor: '#10b981',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2), 0 4px 16px rgba(16, 185, 129, 0.1)',
                      background: 'rgba(16, 185, 129, 0.04)',
                    } : {}}>
                      <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{option.label}</span>
                    </button>
                  ))}
                </div>

                <div className="my-6 max-w-lg" style={{ borderTop: '1px solid var(--surface-card-border)' }}></div>

                {/* Daily Targets  */}
                <div className="space-y-8 max-w-lg">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Daily Targets</h3>

                  <div className="space-y-6">

                    <Slider label="Daily Calorie Intake" min={120} max={4000} step={50} value={formData.dailyCalorieIntake} onChange={(v)=>updateField('dailyCalorieIntake', v)} unit="kcal" infoText="The total calories you plan to consume each day."/>

                    <Slider label="Daily Calorie Burn" min={100} max={2000} step={50} value={formData.dailyCalorieBurn} onChange={(v)=>updateField('dailyCalorieBurn', v)} unit="kcal" infoText="The total calories you aim to burn through exercise and activity each day."/>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Navigation Buttons */}
          <div className="p-6 pb-10 onboarding-wrapper">
            <div className="flex gap-3 lg:justify-end">
              {step > 1 && (
                <Button variant="secondary" onClick={()=>setStep(step > 1 ? step - 1 : 1)} className="max-lg:flex-1 lg:px-10">
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5"/>
                    Back
                  </span>
                </Button>
              )}
              <Button onClick={handleNext} className="max-lg:flex-1 lg:px-10">
                  <span className="flex items-center justify-center gap-2">
                    {step === totalSteps ? 'Get Started' : 'Continue'}
                    <ArrowRight className="w-5 h-5"/>
                  </span>
                </Button>
            </div>
          </div>

      </div>
    </>
  )
}

export default Onboarding