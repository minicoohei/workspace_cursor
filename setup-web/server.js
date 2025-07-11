const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// セキュリティヘッダーの設定
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// 静的ファイルの提供
app.use(express.static(__dirname));

// JSONパーサー
app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// セットアップスクリプト実行エンドポイント
app.post('/api/execute-setup', (req, res) => {
    const { script, type } = req.body;
    
    // セキュリティチェック: 許可されたスクリプトのみ実行（パストラバーサル対策）
    const ALLOWED_SCRIPTS = {
        'setup_complete_environment.sh': path.join(__dirname, '..', 'setup_complete_environment.sh'),
        'setup_cursor_environment.sh': path.join(__dirname, '..', 'setup_cursor_environment.sh')
    };
    
    if (!ALLOWED_SCRIPTS[script]) {
        return res.status(400).json({ error: 'Unauthorized script' });
    }
    
    // 事前検証済みの安全なパスを使用
    const scriptPath = ALLOWED_SCRIPTS[script];
    
    // スクリプトファイルの存在チェック
    if (!fs.existsSync(scriptPath)) {
        return res.status(404).json({ error: 'Script not found' });
    }
    
    // レスポンスヘッダーの設定（ストリーミング用）
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // スクリプトを実行
    const child = spawn('bash', [scriptPath], {
        cwd: path.join(__dirname, '..'),
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stepIndex = 0;
    const steps = getStepsForType(type);
    
    // 標準出力の処理
    child.stdout.on('data', (data) => {
        const output = data.toString();
        
        // 進行状況の判定とステップ更新
        if (shouldAdvanceStep(output, stepIndex, steps)) {
            res.write(JSON.stringify({
                type: 'step_complete',
                step: stepIndex
            }) + '\n');
            stepIndex++;
            
            if (stepIndex < steps.length) {
                res.write(JSON.stringify({
                    type: 'step_start',
                    step: stepIndex,
                    name: steps[stepIndex].name
                }) + '\n');
            }
        }
        
        // 出力をクライアントに送信
        res.write(JSON.stringify({
            type: 'output',
            message: output
        }) + '\n');
    });
    
    // 標準エラーの処理
    child.stderr.on('data', (data) => {
        const error = data.toString();
        res.write(JSON.stringify({
            type: 'error',
            message: error
        }) + '\n');
    });
    
    // プロセス終了時の処理
    child.on('close', (code) => {
        res.write(JSON.stringify({
            type: 'complete',
            code: code,
            success: code === 0
        }) + '\n');
        res.end();
    });
    
    // エラーハンドリング
    child.on('error', (error) => {
        console.error('Script execution error:', error); // サーバーログに記録
        res.write(JSON.stringify({
            type: 'error',
            message: 'スクリプトの実行中にエラーが発生しました'
        }) + '\n');
        res.end();
    });
    
    // 最初のステップを開始
    if (steps.length > 0) {
        res.write(JSON.stringify({
            type: 'step_start',
            step: 0,
            name: steps[0].name
        }) + '\n');
    }
});

// セットアップタイプに応じたステップを取得
function getStepsForType(type) {
    const steps = {
        complete: [
            { name: 'Cursor基本環境構築', keywords: ['cursor', 'indexing', 'mcp'] },
            { name: 'VSCode拡張機能インストール', keywords: ['vscode', 'extension', 'install'] },
            { name: 'Marp CLI環境構築', keywords: ['marp', 'cli', 'slide'] },
            { name: 'Python・Jupyter環境構築', keywords: ['python', 'jupyter', 'venv'] },
            { name: '環境変数テンプレート作成', keywords: ['env', 'template', 'config'] },
            { name: 'Git hooks・セキュリティ設定', keywords: ['git', 'hook', 'security'] },
            { name: 'MCPサーバー群インストール', keywords: ['mcp', 'server', 'install'] }
        ],
        basic: [
            { name: 'Indexing Docs設定', keywords: ['indexing', 'docs'] },
            { name: 'MCPタイムサーバー構築', keywords: ['mcp', 'time', 'docker'] },
            { name: 'Project Rules適用', keywords: ['rules', 'project'] }
        ]
    };
    
    return steps[type] || [];
}

// ステップを進めるべきかどうかを判定
function shouldAdvanceStep(output, currentStep, steps) {
    if (currentStep >= steps.length) return false;
    
    const step = steps[currentStep];
    const lowerOutput = output.toLowerCase();
    
    // キーワードベースでステップの完了を判定
    return step.keywords.some(keyword => 
        lowerOutput.includes(keyword) && 
        (lowerOutput.includes('完了') || lowerOutput.includes('success') || lowerOutput.includes('✅'))
    );
}

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 セットアップサーバーが起動しました: http://localhost:${PORT}`);
    console.log(`📁 プロジェクトルート: ${path.join(__dirname, '..')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 サーバーを終了します...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 サーバーを終了します...');
    process.exit(0);
}); 