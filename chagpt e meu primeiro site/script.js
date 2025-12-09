/**
 * script.js - Gerenciador de hábitos com proteção contra XSS
 */

// Sanitizador simples: escapa caracteres HTML perigosos
function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str; // textContent não interpreta HTML
    return div.innerHTML;
}

// Renderizador seguro de histórico
const guardarDiv = document.getElementById("guardar");

function renderHistorico() {
    guardarDiv.innerHTML = ''; // Limpa conteúdo anterior
    
    try {
        const historicoStr = localStorage.getItem('historico') || '[]';
        const historico = JSON.parse(historicoStr);
        
        // Validação: verifica se é um array
        if (!Array.isArray(historico)) {
            console.warn('Histórico inválido no localStorage');
            return;
        }
        
        historico.forEach((entry, index) => {
            // Validação: verifica se entry é um objeto válido
            if (typeof entry !== 'object' || entry === null) {
                console.warn(`Entrada inválida no histórico: ${index}`);
                return;
            }
            
            const novoGrupo = document.createElement('div');
            
            // Sanitiza cada campo antes de inserir
            const hab1 = sanitize(entry.hab1 || '');
            const hab2 = sanitize(entry.hab2 || '');
            const hab3 = sanitize(entry.hab3 || '');
            const hab4 = sanitize(entry.hab4 || '');
            const date = sanitize(entry.date || '');
            
            // Usa textContent + createElement para máxima segurança contra XSS
            const p1 = document.createElement('p');
            p1.textContent = '✔️ ' + hab1;
            
            const p2 = document.createElement('p');
            p2.textContent = '✔️ ' + hab2;
            
            const p3 = document.createElement('p');
            p3.textContent = '✔️ ' + hab3;
            
            const p4 = document.createElement('p');
            p4.textContent = '✔️ ' + hab4;
            
            const small = document.createElement('small');
            small.textContent = date;
            
            const hr = document.createElement('hr');
            
            novoGrupo.appendChild(p1);
            novoGrupo.appendChild(p2);
            novoGrupo.appendChild(p3);
            novoGrupo.appendChild(p4);
            novoGrupo.appendChild(small);
            novoGrupo.appendChild(hr);
            
            guardarDiv.appendChild(novoGrupo);
        });
    } catch (e) {
        console.error('Erro ao renderizar histórico:', e);
    }
}

// Restaurar inputs ao abrir a página
function restoreInputs() {
    try {
        document.getElementById("hab1").value = localStorage.getItem("hab1") || "";
        document.getElementById("hab2").value = localStorage.getItem("hab2") || "";
        document.getElementById("hab3").value = localStorage.getItem("hab3") || "";
        document.getElementById("hab4").value = localStorage.getItem("hab4") || "";
    } catch (e) {
        console.error('Erro ao restaurar inputs:', e);
    }
}

// --- New features: export/import, undo clear, confetti, sound, shortcuts ---

// Backup last history before clear so we can undo
function backupHistorico() {
    try {
        const h = localStorage.getItem('historico');
        if (h !== null) localStorage.setItem('historico_backup', h);
    } catch (e) { console.warn('Não foi possível criar backup do histórico', e); }
}

function undoClear() {
    try {
        const b = localStorage.getItem('historico_backup');
        if (!b) { alert('Nenhum backup disponível.'); return; }
        localStorage.setItem('historico', b);
        localStorage.removeItem('historico_backup');
        renderHistorico();
        alert('Histórico restaurado.');
    } catch (e) { console.error('Erro ao desfazer limpeza:', e); alert('Erro ao desfazer limpeza.'); }
}

document.getElementById('undoClear').addEventListener('click', function(){ undoClear(); });

// Export histórico como arquivo JSON
function exportHistorico() {
    try {
        const historico = localStorage.getItem('historico') || '[]';
        const blob = new Blob([historico], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historico_habitos.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (e) { console.error('Erro ao exportar histórico:', e); alert('Erro ao exportar.'); }
}

document.getElementById('exportBtn').addEventListener('click', exportHistorico);

// Import histórico (merge) a partir de arquivo JSON
document.getElementById('importFile').addEventListener('change', function(evt) {
    const f = evt.target.files && evt.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!Array.isArray(parsed)) { alert('Arquivo inválido. Deve ser um array JSON.'); return; }
            const current = JSON.parse(localStorage.getItem('historico') || '[]');
            const merged = current.concat(parsed);
            localStorage.setItem('historico', JSON.stringify(merged));
            renderHistorico();
            alert('Importação concluída.');
        } catch (err) { console.error('Erro ao importar:', err); alert('Erro ao importar. Veja o console.'); }
    };
    reader.readAsText(f);
    // reset input
    evt.target.value = '';
});

// Modify clear to backup first
const originalClearHandler = document.getElementById('clearHistory').onclick;
document.getElementById('clearHistory').addEventListener('click', function(){
    backupHistorico();
    // proceed with existing clear logic by triggering the element click original flow
    // We'll just reuse the same logic already defined above by calling the handler body directly.
    // For simplicity, re-run the clear logic here:
    if (!confirm('Tem certeza que deseja limpar o histórico? Esta ação não pode ser desfeita.')) return;
    try {
        localStorage.removeItem('historico');
        localStorage.removeItem('done1');
        localStorage.removeItem('done2');
        localStorage.removeItem('done3');
        localStorage.removeItem('done4');
        renderHistorico();
        document.getElementById('res1').textContent = '';
        document.getElementById('res2').textContent = '';
        document.getElementById('res3').textContent = '';
        document.getElementById('res4').textContent = '';
    } catch (e) { console.error('Erro ao limpar histórico:', e); alert('Não foi possível limpar o histórico. Veja o console.'); }
});

// Confetti simple implementation
function createConfettiCanvas(){
    let c = document.getElementById('confetti-canvas');
    if (!c) {
        c = document.createElement('canvas');
        c.id = 'confetti-canvas';
        c.style.position = 'fixed';
        c.style.top = '0';
        c.style.left = '0';
        c.style.width = '100%';
        c.style.height = '100%';
        c.style.pointerEvents = 'none';
        c.style.zIndex = 9999;
        document.body.appendChild(c);
    }
    return c;
}

function showConfetti(duration = 1500) {
    const canvas = createConfettiCanvas();
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const pieces = [];
    for (let i=0;i<80;i++) pieces.push({x:Math.random()*w, y:Math.random()*h - h, r:Math.random()*6+4, d:Math.random()*40+10, c:['#ff595e','#ffca3a','#8ac926','#1982c4','#6a4c93'][Math.floor(Math.random()*5)], vx:(Math.random()-0.5)*2, vy:Math.random()*3+2});
    const start = performance.now();
    function draw(now){
        const t = now - start;
        ctx.clearRect(0,0,w,h);
        pieces.forEach(p=>{
            p.x += p.vx; p.y += p.vy; p.vy += 0.05;
            ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.r, p.r*0.6);
        });
        if (t < duration) requestAnimationFrame(draw);
        else ctx.clearRect(0,0,w,h);
    }
    requestAnimationFrame(draw);
}

// Sound (small beep) base64 data URI
const beepAudio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=');

// Play confetti + sound when saving
const oldSaveBtn = document.getElementById('salvar');
oldSaveBtn.addEventListener('click', function(){
    try{ showConfetti(1200); beepAudio.play().catch(()=>{}); } catch(e){}
});

// Play sound on mark done
['botao1','botao2','botao3','botao4'].forEach(id=>{
    document.getElementById(id).addEventListener('click', function(){ try{ beepAudio.play().catch(()=>{}); }catch(e){} });
});

// Keyboard shortcuts: Ctrl+S -> save, Ctrl+Shift+F -> toggle fun, Ctrl+E -> export
document.addEventListener('keydown', function(e){
    if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); document.getElementById('salvar').click(); }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') { e.preventDefault(); document.getElementById('toggleFun').click(); }
    if (e.ctrlKey && e.key.toLowerCase() === 'e') { e.preventDefault(); document.getElementById('exportBtn').click(); }
});

// Restaurar checks ao abrir a página
function restoreChecks() {
    try {
        if (localStorage.getItem('done1') === 'true') {
            document.getElementById('res1').textContent = '✔️';
        }
        if (localStorage.getItem('done2') === 'true') {
            document.getElementById('res2').textContent = '✔️';
        }
        if (localStorage.getItem('done3') === 'true') {
            document.getElementById('res3').textContent = '✔️';
        }
        if (localStorage.getItem('done4') === 'true') {
            document.getElementById('res4').textContent = '✔️';
        }
    } catch (e) {
        console.error('Erro ao restaurar checks:', e);
    }
}

// Event listeners para marcar como feito
document.getElementById("botao1").addEventListener("click", () => {
    document.getElementById("res1").textContent = "✔️";
    try {
        localStorage.setItem('done1', 'true');
    } catch (e) {
        console.error('Erro ao salvar done1:', e);
    }
});

document.getElementById("botao2").addEventListener("click", () => {
    document.getElementById("res2").textContent = "✔️";
    try {
        localStorage.setItem('done2', 'true');
    } catch (e) {
        console.error('Erro ao salvar done2:', e);
    }
});

document.getElementById("botao3").addEventListener("click", () => {
    document.getElementById("res3").textContent = "✔️";
    try {
        localStorage.setItem('done3', 'true');
    } catch (e) {
        console.error('Erro ao salvar done3:', e);
    }
});

document.getElementById("botao4").addEventListener("click", () => {
    document.getElementById("res4").textContent = "✔️";
    try {
        localStorage.setItem('done4', 'true');
    } catch (e) {
        console.error('Erro ao salvar done4:', e);
    }
});

// Salvar hábitos
document.getElementById("salvar").addEventListener("click", function() {
    try {
        const hab1 = document.getElementById("hab1").value.trim();
        const hab2 = document.getElementById("hab2").value.trim();
        const hab3 = document.getElementById("hab3").value.trim();
        const hab4 = document.getElementById("hab4").value.trim();

        // Salvar entradas
        localStorage.setItem("hab1", hab1);
        localStorage.setItem("hab2", hab2);
        localStorage.setItem("hab3", hab3);
        localStorage.setItem("hab4", hab4);

        // Adicionar ao histórico
        const historicoStr = localStorage.getItem('historico') || '[]';
        const historico = JSON.parse(historicoStr);
        
        if (Array.isArray(historico)) {
            historico.push({
                hab1: hab1,
                hab2: hab2,
                hab3: hab3,
                hab4: hab4,
                date: new Date().toLocaleString()
            });
            localStorage.setItem('historico', JSON.stringify(historico));
        }

        renderHistorico();

        // Resetar inputs
        document.getElementById("hab1").value = "";
        document.getElementById("hab2").value = "";
        document.getElementById("hab3").value = "";
        document.getElementById("hab4").value = "";
        document.getElementById("hab1").focus();
    } catch (e) {
        console.error('Erro ao salvar hábitos:', e);
        alert('Erro ao salvar hábitos. Verifique o console.');
    }
});

// Limpar histórico (keep saved current inputs if wanted)
document.getElementById('clearHistory').addEventListener('click', function() {
    if (!confirm('Tem certeza que deseja limpar o histórico? Esta ação não pode ser desfeita.')) return;
    try {
        localStorage.removeItem('historico');
        localStorage.removeItem('done1');
        localStorage.removeItem('done2');
        localStorage.removeItem('done3');
        localStorage.removeItem('done4');
        renderHistorico();
        // Limpa checkmarks visuais
        document.getElementById('res1').textContent = '';
        document.getElementById('res2').textContent = '';
        document.getElementById('res3').textContent = '';
        document.getElementById('res4').textContent = '';
    } catch (e) {
        console.error('Erro ao limpar histórico:', e);
        alert('Não foi possível limpar o histórico. Veja o console.');
    }
});

// Fun Mode: toggle visual theme stored in localStorage
function applyFunMode(enabled) {
    if (enabled) document.body.classList.add('fun');
    else document.body.classList.remove('fun');
}

document.getElementById('toggleFun').addEventListener('click', function() {
    try {
        const current = localStorage.getItem('funMode') === 'true';
        localStorage.setItem('funMode', (!current).toString());
        applyFunMode(!current);
        this.textContent = !current ? 'Modo Normal' : 'Modo Divertido 🎉';
    } catch (e) {
        console.error('Erro ao alternar modo divertido:', e);
    }
});

// Apply fun mode on load if set
document.addEventListener('DOMContentLoaded', function() {
    try {
        const fun = localStorage.getItem('funMode') === 'true';
        applyFunMode(fun);
        const btn = document.getElementById('toggleFun');
        if (btn) btn.textContent = fun ? 'Modo Normal' : 'Modo Divertido 🎉';
    } catch (e) {
        console.error('Erro ao aplicar modo divertido no carregamento:', e);
    }
});

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    restoreInputs();
    restoreChecks();
    renderHistorico();
});
