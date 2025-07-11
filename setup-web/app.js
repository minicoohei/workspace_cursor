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

// 手動セットアップ警告の表示（XSS対策版）
function showManualSetupWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-box';
    
    const title = document.createElement('h4');
    title.textContent = '⚠️ 手動セットアップが必要です';
    
    const description = document.createElement('p');
    description.textContent = '自動セットアップサーバーが利用できません。下記の手順で手動セットアップを実行してください：';
    
    const steps = document.createElement('ol');
    
    const step1 = document.createElement('li');
    step1.textContent = 'ターミナルを開く';
    
    const step2 = document.createElement('li');
    step2.textContent = 'プロジェクトディレクトリに移動: ';
    const code1 = document.createElement('code');
    code1.textContent = 'cd ~/Documents/WorkSpace/work_space';
    step2.appendChild(code1);
    
    const step3 = document.createElement('li');
    step3.textContent = 'セットアップスクリプトを実行: ';
    const code2 = document.createElement('code');
    code2.textContent = 'bash setup_complete_environment.sh';
    step3.appendChild(code2);
    
    steps.appendChild(step1);
    steps.appendChild(step2);
    steps.appendChild(step3);
    
    const footer = document.createElement('p');
    footer.textContent = '詳細な手順は下記の「手動セットアップ」セクションを参照してください。';
    
    warningDiv.appendChild(title);
    warningDiv.appendChild(description);
    warningDiv.appendChild(steps);
    warningDiv.appendChild(footer);
    
    progressSection.appendChild(warningDiv);
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

// セットアップガイドを表示（XSS対策版）
function showSetupGuide(os) {
    const guide = setupGuides[os];
    
    // 既存のコンテンツをクリア
    guideContent.innerHTML = '';
    
    // ガイドヘッダーを作成
    const header = document.createElement('div');
    header.className = 'guide-header';
    
    const icon = document.createElement('span');
    icon.className = 'guide-icon';
    icon.textContent = guide.icon;
    
    const title = document.createElement('h4');
    title.textContent = guide.title;
    
    header.appendChild(icon);
    header.appendChild(title);
    
    // ガイドステップコンテナを作成
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'guide-steps';
    
    guide.steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'guide-step';
        
        // ステップ番号
        const stepNumber = document.createElement('div');
        stepNumber.className = 'step-number';
        stepNumber.textContent = index + 1;
        
        // ステップコンテンツ
        const stepContent = document.createElement('div');
        stepContent.className = 'step-content';
        
        const stepTitle = document.createElement('h5');
        stepTitle.textContent = step.title;
        
        const stepDescription = document.createElement('p');
        stepDescription.textContent = step.description;
        
        // コードブロック
        const codeBlock = document.createElement('div');
        codeBlock.className = 'code-block';
        
        const code = document.createElement('code');
        code.textContent = step.code;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '📋 コピー';
        copyBtn.addEventListener('click', () => copyToClipboard(step.code));
        
        codeBlock.appendChild(code);
        codeBlock.appendChild(copyBtn);
        
        stepContent.appendChild(stepTitle);
        stepContent.appendChild(stepDescription);
        stepContent.appendChild(codeBlock);
        
        stepDiv.appendChild(stepNumber);
        stepDiv.appendChild(stepContent);
        
        stepsContainer.appendChild(stepDiv);
    });
    
    guideContent.appendChild(header);
    guideContent.appendChild(stepsContainer);
    
    setupGuideSection.classList.remove('hidden');
    setupGuideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// クリップボードにコピー（XSS対策）
function copyToClipboard(text) {
    // 入力値のサニタイズ
    const sanitizedText = text.replace(/[<>&"']/g, (match) => {
        const map = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return map[match];
    });
    
    navigator.clipboard.writeText(sanitizedText).then(() => {
        console.log('コマンドをクリップボードにコピーしました');
    }).catch(err => {
        console.error('クリップボードへのコピーに失敗しました:', err);
    });
}

// DOM要素の安全な作成（XSS対策）
function createSafeElement(tag, textContent, className = null) {
    const element = document.createElement(tag);
    element.textContent = textContent;
    if (className) {
        element.className = className;
    }
    return element;
}

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}); 