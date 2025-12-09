# Meu Treino — O Melhor Gerenciador de Hábitos 🚀

Um site progressivo (PWA) para rastrear hábitos diários com estatísticas avançadas, sincronização offline, modo escuro, e muito mais.

## Características Principais

### 📊 Estatísticas & Análises
- **Dashboard Interativo** com gráficos em tempo real (Chart.js)
- **Streaks** — contador de dias consecutivos de hábitos
- **Taxa de Sucesso** — percentual de sessões completas
- **Gráfico de Tendências** — últimos 7 dias
- **Frequência de Hábitos** — análise em pizza dos 4 hábitos

### 🌙 UI/UX Avançada
- **Modo Escuro** — alternância dinâmica com persistência
- **Animações Fluidas** — transições suaves em toda a interface
- **Responsividade Perfeita** — funciona em desktop, tablet, mobile
- **Glassmorphism** — design moderno com gradientes e sombras
- **Modo Divertido** — tema colorido com animações

### 🎉 Diversão & Interatividade
- **Confetti Animado** — efeito visual ao salvar hábitos
- **Efeito Sonoro** — beep ao marcar hábitos como feitos
- **Atalhos de Teclado**:
  - `Ctrl+S` = Salvar
  - `Ctrl+Shift+F` = Alternar Modo Divertido
  - `Ctrl+E` = Exportar JSON

### 💾 Gerenciamento de Dados
- **Export/Import** — baixar e carregar histórico em JSON
- **Desfazer Limpeza** — recuperar histórico deletado
- **Backup Automático** — antes de operações críticas

### 📱 PWA & Offline
- **Instalar como App** — botão "📲 Instalar" em navegadores suportados
- **Suporte Offline** — Service Worker com caching inteligente
- **Sincronização Local** — todos os dados em `localStorage`
- **Manifest.json** — ícones e metadados PWA

### 🔒 Segurança
- **Validação XSS** — sanitização de todas as entradas
- **CSP Headers** — Content Security Policy configurada
- **HTTPS obrigatório** — recomendado para produção
- **Minificação & Ofuscação** — JavaScript comprimido

## Stack Tecnológico

- **Frontend**: HTML5, CSS3 (com gradientes, animações, grid), JavaScript vanilla
- **Gráficos**: Chart.js 3.9.1
- **Persistência**: localStorage + Service Worker
- **PWA**: manifest.json + service worker para offline
- **Build**: Terser para minificação JS

## Como Usar

### Localmente (Node.js)

```powershell
cd node_project
npm install
npm start
# Abra http://localhost:3000/habitos.html
```

### Localmente (Go)

```powershell
cd go_project
go run main.go
# Abra http://localhost:8080/habitos.html
```

### Python CLI (para treinar hábitos)

```powershell
python python_project/app.py list
python python_project/app.py add "Ler 30 minutos"
python python_project/app.py done 1
python python_project/app.py clear
```

## Funcionalidades em Detalhe

### Página Principal (`treino1.html`)
- Boas-vindas e contexto do site
- Link para repositório GitHub
- Botão para acessar página de hábitos

### Gerenciador de Hábitos (`habitos.html`)
- 4 inputs para hábitos customizáveis
- Botão **Salvar Hábitos** (salva + renderiza confetti)
- Botão **Marcar como Feito** para cada hábito (beep + feedback visual)
- Botão **Limpar Histórico** (com confirmação)
- Botão **Desfazer Limpeza** (recupera last backup)
- Botão **Exportar JSON** (baixa o histórico)
- Input **Importar** (merge de arquivo JSON)
- Botão **Modo Divertido** (tema colorido + animações)
- Histórico completo com datas (aria-live para acessibilidade)

### Dashboard de Estatísticas (`stats.html`)
- 4 cards principais: Total, Sessões, Taxa, Streak
- Gráfico de frequência (pizza) — cada hábito
- Gráfico de tendência (linha) — últimos 7 dias
- Design animado com gradientes

### Dark Mode (Global)
- Alternância 🌙 ☀️ na menu
- Aplicado a todos os elementos
- Salvo em `localStorage`

### PWA & Offline
- Instalável como app nativo em suporta (botão 📲)
- Service Worker (sw.js) com caching smart
- Funciona completamente offline
- Sincroniza dados ao reconectar

## Atalhos de Teclado

| Atalho | Função |
|--------|--------|
| `Ctrl+S` | Salvar hábitos |
| `Ctrl+Shift+F` | Toggle Modo Divertido |
| `Ctrl+E` | Exportar histórico JSON |

## Segurança

- ✅ **CSP Headers** — bloqueia scripts não-confiáveis
- ✅ **Sanitização XSS** — escapa todas as strings renderizadas
- ✅ **HTTPS** — recomendado (Netlify/Vercel providencia)
- ✅ **No dados sensíveis** — só localStorage local
- ✅ **Permissões reduzidas** — geolocalização, câmera, microfone bloqueadas

## Deploy Recomendado

### Netlify (Melhor para PWA)

```bash
# 1. Crie uma conta em https://netlify.com
# 2. Conecte seu repositório GitHub
# 3. Build command: (deixe vazio)
# 4. Publish directory: . (raiz do projeto)
# 5. Deploy!
```

A Netlify + seu `_headers` = CSP + HSTS + HTTPS automático.

### GitHub Pages

```bash
cd seu_fork
git branch -b gh-pages
git push origin gh-pages
# Settings → Pages → select gh-pages branch
```

### Vercel

```bash
vercel
```

## Contribuições

Este projeto foi criado com ❤️ para ajudar você a construir hábitos melhores.

Se tiver sugestões, abra uma issue no GitHub: https://github.com/rubenty432/meu-treino

## Licença

MIT — Use livremente para aprender e adaptar!

---

**Feito com amor por um desenvolvedor apaixonado por código limpo e bom design.** 🚀
