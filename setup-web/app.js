// セットアップステップの定義
const setupSteps = {
    complete: [
        { id: 'basic', name: '基本Cursor設定', progress: 15 },
        { id: 'vscode', name: 'VSCode拡張機能インストール', progress: 30 },
        { id: 'marp', name: 'Marp CLI環境構築', progress: 45 },
        { id: 'python', name: 'Python/Jupyter環境', progress: 60 },
        { id: 'env', name: '環境変数テンプレート作成', progress: 70 },
        { id: 'git', name: 'Git hooks設定', progress: 80 },
        { id: 'mcp', name: 'MCPサーバー設定', progress: 95 },
        { id: 'done', name: '完了！', progress: 100 }
    ],
    basic: [
        { id: 'indexing', name: 'Indexing Docs設定', progress: 25 },
        { id: 'mcp-time', name: 'MCPタイムサーバー構築', progress: 50 },
        { id: 'rules', name: 'Project Rules適用', progress: 75 },
        { id: 'done', name: '完了！', progress: 100 }
    ]
};

// セットアップガイドの定義
const setupGuides = {
    mac: {
        title: 'Mac セットアップ手順',
        icon: '🍎',
        steps: [
            {
                title: 'Homebrewをインストール',
                description: 'パッケージマネージャーのHomebrewをインストールします。',
                code: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
            },
            {
                title: 'Dockerをインストール',
                description: 'Docker Desktop for Macをインストールします。',
                code: 'brew install --cask docker'
            },
            {
                title: 'Node.jsをインストール',
                description: 'Node.js（LTS版）をインストールします。',
                code: 'brew install node'
            },
            {
                title: 'Pythonをインストール',
                description: 'Python 3.11以上をインストールします。',
                code: 'brew install python@3.11'
            },
            {
                title: 'プロジェクトディレクトリに移動',
                description: 'プロジェクトフォルダに移動します。',
                code: 'cd ~/Documents/WorkSpace/work_space'
            },
            {
                title: '完全環境セットアップを実行',
                description: 'すべての環境を自動構築します。',
                code: 'bash setup_complete_environment.sh'
            }
        ]
    },
    windows: {
        title: 'Windows セットアップ手順',
        icon: '🪟',
        steps: [
            {
                title: 'WSL2をインストール',
                description: 'Windows Subsystem for Linux 2をインストールします。',
                code: 'wsl --install'
            },
            {
                title: 'Docker Desktop for Windowsをインストール',
                description: 'Docker Desktop for Windowsをインストールします。',
                code: 'winget install Docker.DockerDesktop'
            },
            {
                title: 'Node.jsをインストール',
                description: 'Node.js（LTS版）をインストールします。',
                code: 'winget install OpenJS.NodeJS'
            },
            {
                title: 'Pythonをインストール',
                description: 'Python 3.11以上をインストールします。',
                code: 'winget install Python.Python.3.11'
            },
            {
                title: 'プロジェクトディレクトリに移動',
                description: 'WSL内でプロジェクトフォルダに移動します。',
                code: 'cd /mnt/c/Users/YourName/Documents/work_space'
            },
            {
                title: '完全環境セットアップを実行',
                description: 'すべての環境を自動構築します。',
                code: 'bash setup_complete_environment.sh'
            }
        ]
    },
    linux: {
        title: 'Linux セットアップ手順',
        icon: '🐧',
        steps: [
            {
                title: 'パッケージマネージャーを更新',
                description: 'システムのパッケージリストを更新します。',
                code: 'sudo apt update && sudo apt upgrade -y'
            },
            {
                title: 'Dockerをインストール',
                description: 'Docker Engine をインストールします。',
                code: 'curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh'
            },
            {
                title: 'Node.jsをインストール',
                description: 'Node.js（LTS版）をインストールします。',
                code: 'curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs'
            },
            {
                title: 'Pythonをインストール',
                description: 'Python 3.11以上をインストールします。',
                code: 'sudo apt install python3.11 python3.11-pip python3.11-venv -y'
            },
            {
                title: 'プロジェクトディレクトリに移動',
                description: 'プロジェクトフォルダに移動します。',
                code: 'cd ~/Documents/work_space'
            },
            {
                title: '完全環境セットアップを実行',
                description: 'すべての環境を自動構築します。',
                code: 'bash setup_complete_environment.sh'
            }
        ]
    }
};

// DOM要素の取得
const completeSetupBtn = document.getElementById('complete-setup-btn');
const basicSetupBtn = document.getElementById('basic-setup-btn');
const osButtons = document.querySelectorAll('.os-btn');
const setupGuideSection = document.getElementById('setup-guide');
const guideContent = document.getElementById('guide-content');
const terminalSection = document.getElementById('terminal-output');
const terminalContent = document.getElementById('terminal-content');
const progressSection = document.getElementById('setup-progress');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressSteps = document.getElementById('progress-steps');
const nextStepsSection = document.getElementById('next-steps');

// セットアップボタンのイベントリスナー
completeSetupBtn.addEventListener('click', () => startSetup('complete'));
basicSetupBtn.addEventListener('click', () => startSetup('basic'));

// セットアップ開始
function startSetup(type) {
    // ボタンを無効化
    completeSetupBtn.disabled = true;
    basicSetupBtn.disabled = true;
    
    // プログレスセクションを表示
    progressSection.classList.remove('hidden');
    terminalSection.classList.remove('hidden');
    
    // プログレスセクションまでスクロール
    progressSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // セットアップステップを定義
    const steps = type === 'complete' ? [
        { id: 'basic', name: 'Cursor基本環境構築', progress: 10 },
        { id: 'vscode', name: 'VSCode拡張機能インストール', progress: 25 },
        { id: 'marp', name: 'Marp CLI環境構築', progress: 40 },
        { id: 'python', name: 'Python・Jupyter環境構築', progress: 55 },
        { id: 'env', name: '環境変数テンプレート作成', progress: 70 },
        { id: 'git', name: 'Git hooks・セキュリティ設定', progress: 85 },
        { id: 'mcp', name: 'MCPサーバー群インストール', progress: 100 }
    ] : [
        { id: 'indexing', name: 'Indexing Docs設定', progress: 30 },
        { id: 'mcp-time', name: 'MCPタイムサーバー構築', progress: 70 },
        { id: 'rules', name: 'Project Rules適用', progress: 100 }
    ];
    
    // ステップ表示を作成
    let stepsHtml = '<div class="steps-container">';
    steps.forEach(step => {
        stepsHtml += `
            <div class="step-item" id="step-${step.id}">
                <span class="step-icon">⏳</span>
                <span class="step-name">${step.name}</span>
            </div>
        `;
    });
    stepsHtml += '</div>';
    progressSteps.innerHTML = stepsHtml;
    
    // 実際のセットアップを実行
    executeSetup(type, steps);
}

// 実際のセットアップを実行
async function executeSetup(type, steps) {
    const scriptName = type === 'complete' ? 'setup_complete_environment.sh' : 
                      'setup_cursor_environment.sh';
    
    terminalContent.textContent = `🚀 ${scriptName} を実行中...\n\n`;
    
    let currentProcessId = null;
    
    try {
        // サーバーが実行中かチェック
        const serverCheck = await fetch('/api/health').catch(() => null);
        
        if (!serverCheck) {
            // サーバーが起動していない場合の処理
            terminalContent.textContent += '❌ セットアップサーバーが起動していません。\n';
            terminalContent.textContent += '手動でセットアップを実行してください:\n\n';
            terminalContent.textContent += `bash ${scriptName}\n\n`;
            terminalContent.textContent += '詳細な手順は下記の「手動セットアップ」を参照してください。\n';
            
            // 手動セットアップガイドを表示
            showManualSetupWarning();
            return;
        }
        
        // スクリプト実行リクエスト
        const response = await fetch('/api/execute-setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script: scriptName,
                type: type
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // ストリーミングレスポンスを処理
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let currentStepIndex = 0;
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const data = JSON.parse(line);
                        
                        // プロセスIDを保存
                        if (data.type === 'process_started') {
                            currentProcessId = data.processId;
                        }
                        
                        // ユーザー入力が必要な場合
                        if (data.type === 'input_required') {
                            const userInput = await showInputDialog(data.prompt);
                            if (userInput !== null && currentProcessId) {
                                await sendUserInput(currentProcessId, userInput);
                            }
                        }
                        
                        handleSetupProgress(data, steps, currentStepIndex);
                        
                        if (data.type === 'step_complete') {
                            currentStepIndex++;
                        }
                    } catch (e) {
                        // 通常のテキスト出力として処理
                        terminalContent.textContent += line + '\n';
                        terminalSection.scrollTop = terminalSection.scrollHeight;
                    }
                }
            }
        }
        
        // セットアップ完了
        terminalContent.textContent += '\n🎉 セットアップが完了しました！\n';
        progressText.textContent = '完了！環境構築に成功しました 🎉';
        
        // 次のステップを表示
        nextStepsSection.classList.remove('hidden');
        nextStepsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('セットアップエラー:', error);
        terminalContent.textContent += `\n❌ エラーが発生しました: ${error.message}\n`;
        terminalContent.textContent += '\n手動でセットアップを実行してください:\n';
        terminalContent.textContent += `bash ${scriptName}\n\n`;
        
        showManualSetupWarning();
    } finally {
        // ボタンを再度有効化
        completeSetupBtn.disabled = false;
        basicSetupBtn.disabled = false;
    }
}

// セットアップ進行状況の処理
function handleSetupProgress(data, steps, currentStepIndex) {
    switch (data.type) {
        case 'output':
            terminalContent.textContent += data.message;
            terminalSection.scrollTop = terminalSection.scrollHeight;
            break;
            
        case 'step_start':
            if (currentStepIndex < steps.length) {
                const step = steps[currentStepIndex];
                const stepElement = document.getElementById(`step-${step.id}`);
                if (stepElement) {
                    stepElement.querySelector('.step-icon').textContent = '🔄';
                    stepElement.classList.add('active');
                }
                
                progressFill.style.width = `${step.progress}%`;
                progressText.textContent = `${step.name} (${step.progress}%)`;
            }
            break;
            
        case 'step_complete':
            if (currentStepIndex < steps.length) {
                const step = steps[currentStepIndex];
                const stepElement = document.getElementById(`step-${step.id}`);
                if (stepElement) {
                    stepElement.querySelector('.step-icon').textContent = '✅';
                    stepElement.classList.remove('active');
                    stepElement.classList.add('completed');
                }
            }
            break;
    }
}

// 手動セットアップ警告の表示
function showManualSetupWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-box';
    warningDiv.innerHTML = `
        <h4>⚠️ 手動セットアップが必要です</h4>
        <p>自動セットアップサーバーが利用できません。下記の手順で手動セットアップを実行してください：</p>
        <ol>
            <li>ターミナルを開く</li>
            <li>プロジェクトディレクトリに移動: <code>cd ~/Documents/WorkSpace/work_space</code></li>
            <li>セットアップスクリプトを実行: <code>bash setup_complete_environment.sh</code></li>
        </ol>
        <p>詳細な手順は下記の「手動セットアップ」セクションを参照してください。</p>
    `;
    
    progressSection.appendChild(warningDiv);
}

// ユーザー入力ダイアログを表示
async function showInputDialog(prompt) {
    return new Promise((resolve) => {
        // 既存のダイアログがあれば削除
        const existingDialog = document.getElementById('input-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        // ダイアログHTML作成
        const dialogHtml = `
            <div id="input-dialog" class="input-dialog-overlay">
                <div class="input-dialog">
                    <h3>入力が必要です</h3>
                    <p class="input-prompt">${escapeHtml(prompt)}</p>
                    <div class="input-options">
                        <button onclick="window.resolveInput('y')" class="btn-yes">はい (Y)</button>
                        <button onclick="window.resolveInput('n')" class="btn-no">いいえ (N)</button>
                        <button onclick="window.resolveInput('')" class="btn-skip">スキップ (Enter)</button>
                    </div>
                    <div class="input-custom">
                        <input type="text" id="custom-input" placeholder="カスタム入力" onkeypress="if(event.key==='Enter') window.resolveCustomInput()">
                        <button onclick="window.resolveCustomInput()">送信</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
        
        // フォーカスを設定
        document.getElementById('custom-input').focus();
        
        // グローバル関数として定義（一時的）
        window.resolveInput = (value) => {
            document.getElementById('input-dialog').remove();
            delete window.resolveInput;
            delete window.resolveCustomInput;
            resolve(value);
        };
        
        window.resolveCustomInput = () => {
            const value = document.getElementById('custom-input').value;
            window.resolveInput(value);
        };
    });
}

// サーバーに入力を送信
async function sendUserInput(processId, input) {
    try {
        const response = await fetch('/api/send-input', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ processId, input })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('入力送信エラー:', error);
        terminalContent.textContent += `\n❌ 入力送信エラー: ${error.message}\n`;
    }
}

// HTMLエスケープ関数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// OS選択ボタンのイベントリスナー
document.querySelectorAll('.os-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const os = e.currentTarget.dataset.os;
        
        // すべてのボタンから active クラスを削除
        document.querySelectorAll('.os-btn').forEach(b => b.classList.remove('active'));
        
        // クリックされたボタンに active クラスを追加
        e.currentTarget.classList.add('active');
        
        // セットアップガイドを表示
        showSetupGuide(os);
    });
});

// セットアップガイドを表示
function showSetupGuide(os) {
    const guide = setupGuides[os];
    
    let html = `
        <div class="guide-header">
            <span class="guide-icon">${guide.icon}</span>
            <h4>${guide.title}</h4>
        </div>
        <div class="guide-steps">
    `;
    
    guide.steps.forEach((step, index) => {
        html += `
            <div class="guide-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <h5>${step.title}</h5>
                    <p>${step.description}</p>
                    <div class="code-block">
                        <code>${step.code}</code>
                        <button class="copy-btn" onclick="copyToClipboard('${step.code.replace(/'/g, "\\'")}')">
                            📋 コピー
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    guideContent.innerHTML = html;
    setupGuideSection.classList.remove('hidden');
    setupGuideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// クリップボードにコピー
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // 成功時の処理（必要に応じて）
        console.log('コマンドをクリップボードにコピーしました');
    }).catch(err => {
        console.error('クリップボードへのコピーに失敗しました:', err);
    });
}

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}); 