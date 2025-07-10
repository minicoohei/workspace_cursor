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

// セットアップガイドの内容
const setupGuides = {
    mac: {
        title: 'Mac セットアップ手順',
        steps: [
            {
                title: 'ターミナルを開く',
                description: 'Spotlight検索（⌘+Space）で「Terminal」と入力して開きます。',
                code: 'open -a Terminal'
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
            },
            {
                title: '環境変数を設定',
                description: 'APIキーなどの設定を行います。',
                code: 'cp config/env.local.template .env.local\n# .env.localを編集してAPIキーを設定'
            },
            {
                title: 'Cursorでプロジェクトを開く',
                description: 'セットアップ完了後、Cursorで開きます。',
                code: 'cursor .'
            }
        ]
    },
    windows: {
        title: 'Windows セットアップ手順',
        steps: [
            {
                title: 'PowerShellを管理者として開く',
                description: 'スタートメニューで「PowerShell」を右クリック→「管理者として実行」'
            },
            {
                title: 'WSL2をインストール（推奨）',
                description: 'Windows Subsystem for Linux 2をインストールします。',
                code: 'wsl --install'
            },
            {
                title: 'プロジェクトディレクトリに移動',
                description: 'WSL内でプロジェクトフォルダに移動します。',
                code: 'cd /mnt/c/Users/YourName/Documents/work_space'
            },
            {
                title: '完全環境セットアップを実行',
                description: 'WSL内でセットアップスクリプトを実行します。',
                code: 'bash setup_complete_environment.sh'
            },
            {
                title: 'Cursorでプロジェクトを開く',
                description: 'Windows側のCursorでWSL内のプロジェクトを開きます。',
                code: 'cursor .'
            }
        ]
    },
    linux: {
        title: 'Linux セットアップ手順',
        steps: [
            {
                title: 'ターミナルを開く',
                description: 'Ctrl+Alt+T でターミナルを開きます。'
            },
            {
                title: '必要なパッケージをインストール',
                description: 'Node.js、Docker等の必要なパッケージを確認します。',
                code: 'sudo apt update && sudo apt install nodejs npm docker.io'
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
            },
            {
                title: 'Cursorでプロジェクトを開く',
                description: 'セットアップ完了後、Cursorで開きます。',
                code: 'cursor .'
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

// 完全セットアップボタンのイベント
completeSetupBtn.addEventListener('click', () => {
    startSetup('complete');
});

// 基本セットアップボタンのイベント
basicSetupBtn.addEventListener('click', () => {
    startSetup('basic');
});

// セットアップ開始
function startSetup(type) {
    progressSection.classList.remove('hidden');
    terminalSection.classList.remove('hidden');
    progressSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // ボタンを無効化
    completeSetupBtn.disabled = true;
    basicSetupBtn.disabled = true;
    
    // プログレスステップを表示
    const steps = setupSteps[type];
    let stepsHtml = '<div class="step-list">';
    steps.forEach(step => {
        stepsHtml += `<div class="step-item" id="step-${step.id}">
            <span class="step-icon">⏳</span>
            <span class="step-name">${step.name}</span>
        </div>`;
    });
    stepsHtml += '</div>';
    progressSteps.innerHTML = stepsHtml;
    
    // 実際のセットアップを実行
    executeSetup(type, steps);
}

// 実際のセットアップを実行
async function executeSetup(type, steps) {
    const scriptName = type === 'complete' ? 'setup_complete_environment.sh' : 'setup_cursor_environment.sh';
    
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

// OS選択ボタンのイベントリスナー
osButtons.forEach(button => {
    button.addEventListener('click', () => {
        // アクティブクラスの切り替え
        osButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 選択されたOSのガイドを表示
        const selectedOS = button.dataset.os;
        showSetupGuide(selectedOS);
    });
});

// セットアップガイドの表示
function showSetupGuide(os) {
    const guide = setupGuides[os];
    
    // ガイドコンテンツの生成
    let html = `<h4>${guide.title}</h4><ol class="step-list">`;
    
    guide.steps.forEach(step => {
        html += `
            <li>
                <h5>${step.title}</h5>
                <p>${step.description}</p>
                ${step.code ? `<div class="code-block"><code>${step.code}</code></div>` : ''}
            </li>
        `;
    });
    
    html += '</ol>';
    
    // 追加の情報
    html += `
        <div class="info-box">
            <h5>💡 ヒント</h5>
            <ul>
                <li>完全環境セットアップは5-10分程度かかります</li>
                <li>エラーが発生した場合は、docs/setup/のガイドを参照</li>
                <li>WSL2（Windows）やDocker Desktopが必要な場合があります</li>
            </ul>
        </div>
    `;
    
    guideContent.innerHTML = html;
    setupGuideSection.classList.remove('hidden');
    setupGuideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// コピーボタン機能の追加
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'CODE' && e.target.parentElement.classList.contains('code-block')) {
        const text = e.target.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = e.target.textContent;
            e.target.textContent = '✅ コピーしました！';
            setTimeout(() => {
                e.target.textContent = originalText;
            }, 2000);
        });
    }
}); 