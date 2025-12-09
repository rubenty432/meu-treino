#!/usr/bin/env python3
"""
Pequeno CLI para gerenciar hábitos localmente (salva em habits.json)
Comandos: list, add <texto>, done <id>, clear
"""
import json
import sys
from pathlib import Path

DB = Path(__file__).parent / "habits.json"

def load():
    if not DB.exists():
        return []
    try:
        return json.loads(DB.read_text(encoding='utf-8'))
    except Exception:
        return []

def save(data):
    DB.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

def list_habits():
    data = load()
    if not data:
        print("Sem hábitos salvos.")
        return
    for i, h in enumerate(data, 1):
        status = "✔" if h.get('done') else " "
        print(f"{i}. [{status}] {h.get('text')}")

def add_habit(text):
    data = load()
    data.append({"text": text, "done": False})
    save(data)
    print("Hábito adicionado.")

def mark_done(idx):
    data = load()
    if idx < 1 or idx > len(data):
        print("Índice inválido.")
        return
    data[idx-1]['done'] = True
    save(data)
    print("Marcado como feito.")

def clear_all():
    save([])
    print("Histórico limpo.")

def main(argv):
    if not argv:
        print(__doc__)
        return
    cmd = argv[0]
    if cmd == 'list':
        list_habits()
    elif cmd == 'add' and len(argv) > 1:
        add_habit(' '.join(argv[1:]))
    elif cmd == 'done' and len(argv) == 2 and argv[1].isdigit():
        mark_done(int(argv[1]))
    elif cmd == 'clear':
        clear_all()
    else:
        print('Comando inválido. Use: list | add <texto> | done <id> | clear')

if __name__ == '__main__':
    main(sys.argv[1:])
