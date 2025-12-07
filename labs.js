/**
 * labs.js - Interactive multi-language labs
 */

const labs = {
    js: {
        title: "JavaScript 🟨",
        description: "Calculadora de hábitos com validação",
        code: `// Calculadora de Hábitos em JavaScript
function calculateStreak(entries) {
    const unique = [...new Set(entries.map(e => 
        new Date(e.date).toDateString()))];
    let streak = 0;
    const today = new Date();
    for (let date of unique.sort((a,b) => new Date(b) - new Date(a))) {
        const diff = (today - new Date(date)) / (1000*60*60*24);
        if (diff <= 1) streak++; else break;
    }
    return streak;
}

// Uso
const entries = JSON.parse(localStorage.getItem('historico') || '[]');
const streak = calculateStreak(entries);
console.log(\`Streak atual: \${streak} dias\`);`
    },
    python: {
        title: "Python 🐍",
        description: "Análise de dados com Pandas",
        code: `# Análise de Hábitos em Python
import pandas as pd
from datetime import datetime

def analyze_habits(data):
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    
    # Taxa de sucesso
    success_rate = len(df[df['hab1'].notna()]) / len(df)
    
    # Frequência de hábitos
    frequencies = {
        'Hábito 1': len(df[df['hab1'].notna()]),
        'Hábito 2': len(df[df['hab2'].notna()]),
        'Hábito 3': len(df[df['hab3'].notna()]),
        'Hábito 4': len(df[df['hab4'].notna()])
    }
    
    return {
        'success_rate': success_rate * 100,
        'frequencies': frequencies,
        'total_entries': len(df)
    }

# Uso: analyze_habits(json.loads(localStorage_data))`
    },
    go: {
        title: "Go 🏃",
        description: "Servidor HTTP rápido",
        code: `// Servidor Go para API de hábitos
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
)

type Habit struct {
    Hab1 string \`json:"hab1"\`
    Hab2 string \`json:"hab2"\`
    Hab3 string \`json:"hab3"\`
    Hab4 string \`json:"hab4"\`
    Date string \`json:"date"\`
}

func getHabits(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    habits := []Habit{}
    json.NewEncoder(w).Encode(habits)
}

func main() {
    http.HandleFunc("/api/habits", getHabits)
    log.Println("Server running on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}`
    },
    rust: {
        title: "Rust 🦀",
        description: "Sistema seguro em Rust",
        code: `// Gerenciador de hábitos em Rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Habit {
    hab1: String,
    hab2: String,
    hab3: String,
    hab4: String,
    date: String,
}

fn calculate_streak(habits: &[Habit]) -> u32 {
    let mut streak = 0;
    for habit in habits.iter().rev() {
        if !habit.hab1.is_empty() {
            streak += 1;
        } else {
            break;
        }
    }
    streak
}

fn main() {
    let habits = vec![];
    let streak = calculate_streak(&habits);
    println!("Streak: {} days", streak);
}`
    },
    ts: {
        title: "TypeScript 📘",
        description: "Tipagem estática e segurança",
        code: `// TypeScript com tipos e interfaces
interface Habit {
    hab1: string;
    hab2: string;
    hab3: string;
    hab4: string;
    date: Date;
}

interface StatsResult {
    totalEntries: number;
    successRate: number;
    streak: number;
}

function calculateStats(habits: Habit[]): StatsResult {
    const total = habits.length;
    const completed = habits.filter(h => 
        h.hab1 && h.hab2 && h.hab3 && h.hab4
    ).length;
    
    return {
        totalEntries: total,
        successRate: (completed / total) * 100,
        streak: calculateStreak(habits)
    };
}

const result: StatsResult = calculateStats([]);
console.log(result);`
    },
    java: {
        title: "Java ☕",
        description: "Aplicação Enterprise",
        code: `// Spring Boot REST API para Hábitos
@RestController
@RequestMapping("/api/habits")
public class HabitController {
    
    @Autowired
    private HabitRepository habitRepository;
    
    @GetMapping
    public List<Habit> getAllHabits() {
        return habitRepository.findAll();
    }
    
    @PostMapping
    public Habit createHabit(@RequestBody Habit habit) {
        return habitRepository.save(habit);
    }
    
    @GetMapping("/{id}/streak")
    public Integer calculateStreak(@PathVariable Long id) {
        return habitRepository.findStreakById(id);
    }
}`
    },
    csharp: {
        title: "C# 🔷",
        description: "Backend .NET Core",
        code: `// C# com Entity Framework Core
using Microsoft.EntityFrameworkCore;

public class HabitContext : DbContext {
    public DbSet<Habit> Habits { get; set; }
    
    public int CalculateStreak(int habitId) {
        var entries = Habits
            .Where(h => h.Id == habitId)
            .OrderByDescending(h => h.Date)
            .ToList();
        
        int streak = 0;
        foreach (var entry in entries) {
            if (!string.IsNullOrEmpty(entry.Description))
                streak++;
            else
                break;
        }
        return streak;
    }
}`
    },
    php: {
        title: "PHP 🐘",
        description: "API REST com Laravel",
        code: `// Laravel API para Hábitos
Route::apiResource('habits', HabitController::class);

class HabitController extends Controller {
    public function index() {
        return Habit::all();
    }
    
    public function store(Request $request) {
        $habit = Habit::create($request->validated());
        return $habit;
    }
    
    public function streak($id) {
        $entries = Habit::find($id)
            ->entries()
            ->latest()
            ->get();
        
        return count($entries);
    }
}`
    },
    ruby: {
        title: "Ruby 💎",
        description: "Rails Framework",
        code: `# Rails API para Gerenciamento de Hábitos
class HabitsController < ApplicationController
  def index
    @habits = Habit.all
    render json: @habits
  end
  
  def create
    @habit = Habit.new(habit_params)
    if @habit.save
      render json: @habit, status: :created
    else
      render json: @habit.errors, status: :unprocessable_entity
    end
  end
  
  def streak
    @habit = Habit.find(params[:id])
    streak = @habit.calculate_streak
    render json: { streak: streak }
  end
  
  private
  def habit_params
    params.require(:habit).permit(:name, :description)
  end
end`
    },
    kotlin: {
        title: "Kotlin 🎯",
        description: "App Android nativo",
        code: `// Kotlin para Android com Coroutines
data class Habit(
    val id: Int,
    val hab1: String,
    val hab2: String,
    val hab3: String,
    val hab4: String,
    val date: String
)

class HabitViewModel : ViewModel() {
    private val _habits = MutableLiveData<List<Habit>>()
    val habits: LiveData<List<Habit>> = _habits
    
    fun loadHabits() {
        viewModelScope.launch {
            try {
                val data = habitRepository.getAllHabits()
                _habits.value = data
            } catch (e: Exception) {
                Log.e("HabitVM", "Error loading habits", e)
            }
        }
    }
}`
    },
    sql: {
        title: "SQL 🗄️",
        description: "Queries avançadas",
        code: `-- Análise de Hábitos com SQL
SELECT 
    h.id,
    h.name,
    COUNT(e.id) as total_entries,
    COUNT(CASE WHEN e.completed THEN 1 END) as completed,
    ROUND(100.0 * COUNT(CASE WHEN e.completed THEN 1 END) / 
          COUNT(e.id), 2) as success_rate,
    MAX(e.date) as last_entry
FROM habits h
LEFT JOIN entries e ON h.id = e.habit_id
GROUP BY h.id, h.name
ORDER BY success_rate DESC;

-- Calcular Streak
WITH ranked_entries AS (
    SELECT 
        habit_id,
        date,
        ROW_NUMBER() OVER (PARTITION BY habit_id ORDER BY date DESC) -
        ROW_NUMBER() OVER (PARTITION BY habit_id ORDER BY date) as grp
    FROM entries
    WHERE completed = true
)
SELECT 
    habit_id,
    COUNT(*) as streak
FROM ranked_entries
WHERE grp = 0
GROUP BY habit_id;`
    },
    bash: {
        title: "Bash 🐚",
        description: "Scripts DevOps",
        code: `#!/bin/bash
# Script para deploy automático de hábitos

# Build do projeto
echo "Building project..."
npm run build

# Deploy no Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=.

# Health check
echo "Health check..."
curl -s https://meu-treino.netlify.app/health | jq .

# Backup de dados
echo "Backing up data..."
tar -czf backup-$(date +%Y%m%d).tar.gz .
aws s3 cp backup-*.tar.gz s3://my-backups/

echo "✅ Deploy completo!"
`
    }
};

function openLab(labId) {
    const lab = labs[labId];
    const modal = document.getElementById('labModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${lab.title}</h2>
        <p><strong>${lab.description}</strong></p>
        <div class="code-block">${escapeHtml(lab.code)}</div>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
            💡 Dica: Copie o código acima e adapte para seu projeto!
        </p>
    `;
    
    modal.classList.add('active');
}

function closeLab() {
    document.getElementById('labModal').classList.remove('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fechar modal ao clicar fora
document.getElementById('labModal').addEventListener('click', function(e) {
    if (e.target === this) closeLab();
});
