// データビジュアライザー - Cursor AI Live Coding Demo

// グローバル変数
let currentData = [];
let animationId = null;

// DOM要素の取得
const elements = {
    generateBtn: document.getElementById('generate-btn'),
    clearBtn: document.getElementById('clear-btn'),
    animateBtn: document.getElementById('animate-btn'),
    dataCount: document.getElementById('data-count'),
    countDisplay: document.getElementById('count-display'),
    chart: document.getElementById('chart'),
    avgValue: document.getElementById('avg-value'),
    maxValue: document.getElementById('max-value'),
    minValue: document.getElementById('min-value'),
    codeContent: document.getElementById('code-content'),
    tabs: document.querySelectorAll('.tab')
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    showCode('html');
});

// イベントリスナーの設定
function setupEventListeners() {
    elements.generateBtn.addEventListener('click', generateAndVisualize);
    elements.clearBtn.addEventListener('click', clearVisualization);
    elements.animateBtn.addEventListener('click', toggleAnimation);
    elements.dataCount.addEventListener('input', updateCountDisplay);
    
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showCode(tab.dataset.tab);
        });
    });
}

// データ数の表示更新
function updateCountDisplay() {
    elements.countDisplay.textContent = elements.dataCount.value;
}

// ランダムデータの生成
function generateRandomData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            label: `項目${i + 1}`,
            value: Math.floor(Math.random() * 90) + 10
        });
    }
    return data;
}

// データの統計情報を計算
function calculateStats(data) {
    if (data.length === 0) return { avg: 0, max: 0, min: 0 };
    
    const values = data.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
        avg: Math.round(sum / values.length),
        max: Math.max(...values),
        min: Math.min(...values)
    };
}

// 統計情報の表示
function updateStats(stats) {
    elements.avgValue.textContent = stats.avg || '-';
    elements.maxValue.textContent = stats.max || '-';
    elements.minValue.textContent = stats.min || '-';
}

// データ生成と可視化
function generateAndVisualize() {
    const count = parseInt(elements.dataCount.value);
    currentData = generateRandomData(count);
    visualizeData(currentData);
    
    const stats = calculateStats(currentData);
    updateStats(stats);
}

// データの可視化（棒グラフ）
function visualizeData(data, animated = true) {
    const svg = elements.chart;
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // SVGをクリア
    svg.innerHTML = '';
    
    // 背景グループ
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // スケールの計算
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // グラデーションの定義
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'barGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#3498db;stop-opacity:1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#2980b9;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // 棒グラフの描画
    data.forEach((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = i * (barWidth + barSpacing) + barSpacing / 2;
        const y = chartHeight - barHeight;
        
        // 棒
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', 'url(#barGradient)');
        rect.setAttribute('rx', '4');
        rect.setAttribute('ry', '4');
        rect.style.cursor = 'pointer';
        
        if (animated) {
            rect.style.animation = `growBar 0.5s ease-out ${i * 0.05}s forwards`;
            rect.style.height = '0';
            rect.style.y = chartHeight;
            rect.style.setProperty('--bar-height', `${barHeight}px`);
            
            setTimeout(() => {
                rect.style.height = `${barHeight}px`;
                rect.style.y = y;
            }, i * 50);
        }
        
        // ホバー効果
        rect.addEventListener('mouseenter', function() {
            this.style.fill = '#e74c3c';
            showTooltip(d, x + barWidth / 2, y - 10);
        });
        
        rect.addEventListener('mouseleave', function() {
            this.style.fill = 'url(#barGradient)';
            hideTooltip();
        });
        
        g.appendChild(rect);
        
        // ラベル
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + barWidth / 2);
        text.setAttribute('y', chartHeight + 20);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', '#7f8c8d');
        text.textContent = d.label;
        g.appendChild(text);
        
        // 値の表示
        const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueText.setAttribute('x', x + barWidth / 2);
        valueText.setAttribute('y', y - 5);
        valueText.setAttribute('text-anchor', 'middle');
        valueText.setAttribute('font-size', '14');
        valueText.setAttribute('font-weight', 'bold');
        valueText.setAttribute('fill', '#2c3e50');
        valueText.textContent = d.value;
        
        if (animated) {
            valueText.style.opacity = '0';
            setTimeout(() => {
                valueText.style.transition = 'opacity 0.3s';
                valueText.style.opacity = '1';
            }, (i + 1) * 50 + 300);
        }
        
        g.appendChild(valueText);
    });
}

// ツールチップの表示
function showTooltip(data, x, y) {
    // ツールチップの実装（必要に応じて）
}

function hideTooltip() {
    // ツールチップを隠す
}

// 可視化のクリア
function clearVisualization() {
    elements.chart.innerHTML = '';
    currentData = [];
    updateStats({ avg: 0, max: 0, min: 0 });
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        elements.animateBtn.innerHTML = '<span class="icon">▶️</span>アニメーション';
    }
}

// アニメーションのトグル
function toggleAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        elements.animateBtn.innerHTML = '<span class="icon">▶️</span>アニメーション';
    } else {
        startAnimation();
        elements.animateBtn.innerHTML = '<span class="icon">⏸️</span>停止';
    }
}

// アニメーション開始
function startAnimation() {
    let frame = 0;
    
    function animate() {
        if (frame % 60 === 0) { // 1秒ごとに更新
            generateAndVisualize();
        }
        frame++;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// コードプレビューの表示
function showCode(type) {
    const codeSnippets = {
        html: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>データビジュアライザー</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <!-- Cursorで生成したインタラクティブなUI -->
        <button id="generate-btn">データ生成</button>
        <div id="chart-container">
            <svg id="chart"></svg>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        
        css: `/* Cursorで作成したモダンなスタイル */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.btn {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}`,
        
        js: `// Cursor AIと作成したインタラクティブな機能
function generateData() {
    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            label: \`項目\${i + 1}\`,
            value: Math.random() * 100
        });
    }
    return data;
}

function visualize(data) {
    // SVGを使った美しい可視化
    // Cursorに「棒グラフを描画して」と依頼
}`
    };
    
    elements.codeContent.textContent = codeSnippets[type] || '';
}

// デバッグ用：コンソールにデータを表示
function logData() {
    console.log('Current Data:', currentData);
    console.log('Stats:', calculateStats(currentData));
}