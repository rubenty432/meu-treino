/**
 * stats.js - Dashboard de estatísticas com Chart.js
 */

function loadStatsData() {
    try {
        const historico = JSON.parse(localStorage.getItem('historico') || '[]');
        
        // Cálculos
        const totalEntries = historico.length;
        const completeSessions = historico.filter(h => 
            (h.hab1 || '') && (h.hab2 || '') && (h.hab3 || '') && (h.hab4 || '')
        ).length;
        const successRate = totalEntries > 0 ? Math.round((completeSessions / totalEntries) * 100) : 0;
        
        // Streak: contar dias consecutivos (simplificado: dias de entrada)
        const dates = historico.map(h => new Date(h.date).toDateString()).filter((v, i, a) => a.indexOf(v) === i);
        let streak = 0;
        if (dates.length > 0) {
            const today = new Date();
            let current = new Date(today);
            for (let d of dates.sort((a,b) => new Date(b) - new Date(a))) {
                const checkDate = new Date(d);
                if (Math.abs(current - checkDate) / (1000 * 60 * 60 * 24) <= 1) {
                    streak++;
                    current = new Date(checkDate);
                } else break;
            }
        }
        
        // Frequência de hábitos
        const habitCounts = {};
        historico.forEach(h => {
            if (h.hab1) habitCounts['Hábito 1'] = (habitCounts['Hábito 1'] || 0) + 1;
            if (h.hab2) habitCounts['Hábito 2'] = (habitCounts['Hábito 2'] || 0) + 1;
            if (h.hab3) habitCounts['Hábito 3'] = (habitCounts['Hábito 3'] || 0) + 1;
            if (h.hab4) habitCounts['Hábito 4'] = (habitCounts['Hábito 4'] || 0) + 1;
        });
        
        // Atualizar cards
        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('completeSessions').textContent = completeSessions;
        document.getElementById('successRate').textContent = successRate + '%';
        document.getElementById('currentStreak').textContent = streak + ' dias';
        
        // Gráfico de frequência
        const ctx1 = document.getElementById('habitsChart').getContext('2d');
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: Object.keys(habitCounts),
                datasets: [{
                    data: Object.values(habitCounts),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
        
        // Gráfico de tendência (últimos 7 dias)
        const last7Days = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days[d.toLocaleDateString('pt-BR')] = 0;
        }
        historico.forEach(h => {
            const dateStr = new Date(h.date).toLocaleDateString('pt-BR');
            if (dateStr in last7Days) last7Days[dateStr]++;
        });
        
        const ctx2 = document.getElementById('trendChart').getContext('2d');
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: Object.keys(last7Days),
                datasets: [{
                    label: 'Entradas por dia',
                    data: Object.values(last7Days),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
        
    } catch (e) {
        console.error('Erro ao carregar estatísticas:', e);
    }
}

document.addEventListener('DOMContentLoaded', loadStatsData);
