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
    },
    lua: {
        title: "Lua 🌙",
        description: "Scripting leve e rápido",
        code: `-- Lua para Roblox/Games
local function calculateStreak(entries)
    local streak = 0
    local today = os.date("%d/%m/%Y")
    
    for i = #entries, 1, -1 do
        if entries[i].date == today then
            streak = streak + 1
        else
            break
        end
    end
    
    return streak
end

local Habit = {}
Habit.__index = Habit

function Habit.new(name)
    return setmetatable({
        name = name,
        entries = {},
        streak = 0
    }, Habit)
end

function Habit:logEntry()
    table.insert(self.entries, {date = os.date("%d/%m/%Y")})
    self.streak = calculateStreak(self.entries)
end

local myHabit = Habit.new("Exercício")
myHabit:logEntry()
print("Streak: " .. myHabit.streak .. " dias")`
    },
    swift: {
        title: "Swift 🍎",
        description: "iOS App nativo",
        code: `// Swift para iOS
import SwiftUI

struct Habit: Identifiable {
    let id = UUID()
    var name: String
    var entries: [Date] = []
    
    var streak: Int {
        var count = 0
        let calendar = Calendar.current
        var checkDate = Date()
        
        for entry in entries.sorted(by: >) {
            if calendar.isDateInToday(entry) || 
               calendar.isDateInYesterday(entry) {
                count += 1
            } else {
                break
            }
        }
        return count
    }
}

struct ContentView: View {
    @State var habits: [Habit] = []
    
    var body: some View {
        List(habits) { habit in
            VStack(alignment: .leading) {
                Text(habit.name).font(.headline)
                Text("Streak: \\(habit.streak) dias")
                    .font(.subheadline)
                    .foregroundColor(.green)
            }
        }
    }
}`
    },
    dart: {
        title: "Dart 🎯",
        description: "Flutter Cross-Platform",
        code: `// Dart com Flutter
import 'package:flutter/material.dart';

class Habit {
  final String name;
  final List<DateTime> entries;
  
  Habit({required this.name, this.entries = const []});
  
  int calculateStreak() {
    int streak = 0;
    final now = DateTime.now();
    
    for (var entry in entries.toList().reversed) {
      final difference = now.difference(entry).inDays;
      if (difference <= 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
}

class HabitCard extends StatelessWidget {
  final Habit habit;
  
  HabitCard({required this.habit});
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text(habit.name, style: TextStyle(fontSize: 18)),
            Text('Streak: ${habit.calculateStreak()} dias',
              style: TextStyle(color: Colors.green))
          ],
        ),
      ),
    );
  }
}`
    },
    cpplusplus: {
        title: "C++ ⚡",
        description: "Performance extrema",
        code: `// C++ 17 para sistemas de alto desempenho
#include <vector>
#include <string>
#include <chrono>

struct Habit {
    std::string name;
    std::vector<std::chrono::system_clock::time_point> entries;
};

class HabitTracker {
private:
    std::vector<Habit> habits;
    
public:
    int calculateStreak(const Habit& habit) {
        int streak = 0;
        auto now = std::chrono::system_clock::now();
        
        for (auto it = habit.entries.rbegin(); 
             it != habit.entries.rend(); ++it) {
            auto diff = std::chrono::duration_cast
                <std::chrono::hours>(now - *it);
            
            if (diff.count() <= 24) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
};

int main() {
    HabitTracker tracker;
    return 0;
}`
    },
    r: {
        title: "R 📊",
        description: "Data Science e Análise",
        code: `# R para análise de hábitos
library(dplyr)
library(ggplot2)

# Carregar dados
habits_data <- read.csv("habits.csv")

# Análise descritiva
habits_summary <- habits_data %>%
  group_by(habit_name) %>%
  summarise(
    total_entries = n(),
    completion_rate = mean(completed) * 100,
    last_entry = max(date),
    .groups = 'drop'
  ) %>%
  arrange(desc(completion_rate))

# Visualização
ggplot(habits_summary, aes(x = habit_name, y = completion_rate)) +
  geom_col(fill = "#667eea") +
  geom_text(aes(label = paste0(round(completion_rate), "%")), 
            vjust = -0.5) +
  labs(title = "Taxa de Conclusão por Hábito",
       x = "Hábito", y = "Taxa (%)") +
  theme_minimal()

print(habits_summary)`
    },
    scala: {
        title: "Scala 🔥",
        description: "FP + OOP",
        code: `// Scala - Functional Programming
import scala.collection.mutable

case class Habit(name: String, entries: List[String])

object HabitAnalyzer {
  def calculateStreak(habit: Habit): Int = {
    habit.entries
      .reverse
      .takeWhile(_ => true)
      .length
  }
  
  def filterByCompletion(habits: List[Habit], 
                         minStreak: Int): List[Habit] = {
    habits.filter(h => calculateStreak(h) >= minStreak)
  }
  
  def analyzeAll(habits: List[Habit]): Map[String, Int] = {
    habits.map(h => (h.name, calculateStreak(h))).toMap
  }
}

val habits = List(
  Habit("Exercício", List("01/12", "02/12", "03/12")),
  Habit("Leitura", List("01/12", "02/12"))
)

val analysis = HabitAnalyzer.analyzeAll(habits)
println(analysis)`
    },
    elixir: {
        title: "Elixir 💜",
        description: "Programação Funcional",
        code: `# Elixir para tempo real
defmodule HabitTracker do
  def calculate_streak(entries) do
    entries
    |> Enum.reverse()
    |> Enum.reduce_while(0, fn _entry, acc ->
      if acc < length(entries) do
        {:cont, acc + 1}
      else
        {:halt, acc}
      end
    end)
  end
  
  def get_habit_stats(habit_id) do
    entries = get_entries(habit_id)
    
    %{
      name: get_habit_name(habit_id),
      total_entries: length(entries),
      streak: calculate_streak(entries),
      last_entry: List.first(entries),
      completion_rate: 
        (length(entries) / 30) * 100
    }
  end
end

# Uso com Phoenix LiveView para real-time updates
{:ok, stats} = HabitTracker.get_habit_stats(1)
IO.inspect(stats)`
    },
    clojure: {
        title: "Clojure 🍀",
        description: "LISP moderno",
        code: `; Clojure para processamento de dados
(defn calculate-streak [entries]
  (->> entries
       reverse
       (take-while identity)
       count))

(defn analyze-habits [data]
  (map #(assoc % 
    :streak (calculate-streak (:entries %))
    :completion-rate (* 100 (/ (count (:entries %)) 30)))
    data))

(defn best-habits [habits threshold]
  (filter #(>= (:completion-rate %) threshold) habits))

; Dados de exemplo
(def my-habits
  [{:name "Exercício"
    :entries [true true true false true]}
   {:name "Leitura"
    :entries [true true true true true]}])

(def analyzed (analyze-habits my-habits))
(println (best-habits analyzed 80))`
    },
    perl: {
        title: "Perl 🐪",
        description: "Expressões Regulares",
        code: `#!/usr/bin/perl
# Perl para processamento de logs

use strict;
use warnings;
use DateTime;

sub calculate_streak {
    my @entries = @_;
    my $streak = 0;
    
    foreach my $entry (reverse @entries) {
        $streak++ if defined $entry;
    }
    
    return $streak;
}

sub parse_habit_log {
    my $file = shift;
    open my $fh, '<', $file or die "Cannot open: $!";
    
    my %habits;
    while (<$fh>) {
        chomp;
        my ($date, $habit, $completed) = split /,/;
        
        push @{$habits{$habit}}, $completed;
    }
    close $fh;
    
    foreach my $habit (keys %habits) {
        my $streak = calculate_streak(
            @{$habits{$habit}}
        );
        print "$habit: streak = $streak\\n";
    }
}

parse_habit_log("habits.log");`
    },
    groovy: {
        title: "Groovy 🔗",
        description: "Java Dinâmico",
        code: `// Groovy para scripting JVM
@Grab('org.json:json:20210307')
import groovy.json.JsonSlurper

class HabitManager {
    List habits = []
    
    def addHabit(String name) {
        habits << [name: name, entries: []]
    }
    
    def logEntry(String habitName) {
        def habit = habits.find { it.name == habitName }
        habit?.entries?.add(new Date())
    }
    
    def getStreak(String habitName) {
        def habit = habits.find { it.name == habitName }
        return habit?.entries?.size() ?: 0
    }
    
    def getStats() {
        return habits.collect { habit ->
            [
                name: habit.name,
                total: habit.entries.size(),
                streak: getStreak(habit.name)
            ]
        }
    }
}

def manager = new HabitManager()
manager.addHabit("Exercício")
manager.logEntry("Exercício")
println manager.getStats()`
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
