import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useAppContext } from '../context/useAppContext';
import { useTheme } from '../context/useTheme';

const CaloriesChart = () => {

    const { allActivityLogs, allFoodLogs } = useAppContext();
    const { theme } = useTheme();

    const isDark = theme === 'dark';

    const getData = () => {
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const dailyFood = allFoodLogs.filter(log => log.createdAt?.split('T')[0] === dateString);
            const dailyActivity = allActivityLogs.filter(log => log.createdAt?.split('T')[0] === dateString);

            const intake = dailyFood.reduce((sum, item) => sum + item.calories, 0);
            const burn = dailyActivity.reduce((sum, item) => sum + (item.calories || 0), 0);

            data.push({
                name: dayName,
                Intake: intake,
                Burn: burn,
                date: dateString
            });
        }
        return data;
    };

    const data = getData();

    return (
        <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.6)'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                    <Tooltip
                        cursor={{ fill: isDark ? 'rgba(51, 65, 85, 0.2)' : 'rgba(241, 245, 249, 0.6)' }}
                        contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#fff',
                            borderRadius: '16px',
                            border: isDark ? '1px solid rgba(51, 65, 85, 0.5)' : '1px solid rgba(226, 232, 240, 0.6)',
                            boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.08)',
                            color: isDark ? '#f1f5f9' : '#0f172a',
                            padding: '12px 16px',
                        }}
                        labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, marginBottom: 4 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="Intake" fill="url(#intakeGradient)" radius={[6, 6, 0, 0]} barSize={14} name="Intake" />
                    <Bar dataKey="Burn" fill="url(#burnGradient)" radius={[6, 6, 0, 0]} barSize={14} name="Burn" />
                    <defs>
                        <linearGradient id="intakeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#ea580c" stopOpacity={0.7} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CaloriesChart;
