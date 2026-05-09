import { PersonStandingIcon } from "lucide-react"


const Loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 transition-colors duration-300" style={{
      background: 'var(--surface-light)',
    }}>
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
          background: 'linear-gradient(135deg, #059669, #0d9488)',
          boxShadow: '0 4px 20px rgba(5, 150, 105, 0.3)',
          animation: 'float 2s ease-in-out infinite',
        }}>
          <PersonStandingIcon className="h-8 w-8 text-white"/>
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-2xl" style={{
          animation: 'pulseGlow 2s ease-in-out infinite',
        }}/>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">FitTrack</p>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#10b981',
                animation: `fadeIn 0.6s ${i * 0.15}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading
