const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 静的ファイルの配信
app.use(express.static(__dirname));
app.use(express.json());

// ヘルスチェック
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// セットアップスクリプト実行
app.post('/api/execute-setup', (req, res) => {
    const { script, type } = req.body;
    
    // セキュリティチェック
    const allowedScripts = ['setup_complete_environment.sh', 'setup_cursor_environment.sh'];
    if (!allowedScripts.includes(script)) {
        return res.status(400).json({ error: '無効なスクリプトです' });
    }
    
    // スクリプトファイルの存在確認
    const scriptPath = path.join(__dirname, '..', script);
    if (!fs.existsSync(scriptPath)) {
        return res.status(404).json({ error: 'スクリプトファイルが見つかりません' });
    }
    
    // レスポンスヘッダーの設定（ストリーミング用）
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*'
    });
    
    // スクリプト実行
    const child = spawn('bash', [scriptPath], {
        cwd: path.join(__dirname, '..'),
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stepIndex = 0;
    const steps = getStepsForType(type);
    
    // 実行開始
    res.write(JSON.stringify({
        type: 'output',
        message: `🚀 ${script} を実行開始...\n\n`
    }) + '\n');
    
    // 標準出力の処理
    child.stdout.on('data', (data) => {
        const output = data.toString();
        res.write(JSON.stringify({
            type: 'output',
            message: output
        }) + '\n');
        
        // ステップの進行を検出（簡易的な実装）
        if (output.includes('✅') && stepIndex < steps.length) {
            res.write(JSON.stringify({
                type: 'step_complete',
                step: steps[stepIndex]
            }) + '\n');
            stepIndex++;
            
            if (stepIndex < steps.length) {
                res.write(JSON.stringify({
                    type: 'step_start',
                    step: steps[stepIndex]
                }) + '\n');
            }
        }
    });
    
    // 標準エラー出力の処理
    child.stderr.on('data', (data) => {
        const output = data.toString();
        res.write(JSON.stringify({
            type: 'output',
            message: `⚠️ ${output}`
        }) + '\n');
    });
    
    // 実行完了
    child.on('close', (code) => {
        res.write(JSON.stringify({
            type: 'output',
            message: code === 0 ? 
                '\n🎉 セットアップが正常に完了しました！\n' :
                `\n❌ セットアップがエラーで終了しました (終了コード: ${code})\n`
        }) + '\n');
        
        res.write(JSON.stringify({
            type: 'complete',
            success: code === 0,
            exitCode: code
        }) + '\n');
        
        res.end();
    });
    
    // エラーハンドリング
    child.on('error', (error) => {
        res.write(JSON.stringify({
            type: 'output',
            message: `❌ スクリプト実行エラー: ${error.message}\n`
        }) + '\n');
        
        res.write(JSON.stringify({
            type: 'complete',
            success: false,
            error: error.message
        }) + '\n');
        
        res.end();
    });
});

// セットアップタイプに応じたステップを取得
function getStepsForType(type) {
    const steps = {
        complete: [
            { id: 'basic', name: '基本Cursor設定' },
            { id: 'vscode', name: 'VSCode拡張機能インストール' },
            { id: 'marp', name: 'Marp CLI環境構築' },
            { id: 'python', name: 'Python/Jupyter環境' },
            { id: 'env', name: '環境変数テンプレート作成' },
            { id: 'git', name: 'Git hooks設定' },
            { id: 'mcp', name: 'MCPサーバー設定' }
        ],
        basic: [
            { id: 'indexing', name: 'Indexing Docs設定' },
            { id: 'mcp-time', name: 'MCPタイムサーバー構築' },
            { id: 'rules', name: 'Project Rules適用' }
        ]
    };
    
    return steps[type] || [];
}

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 セットアップサーバーが起動しました: http://localhost:${PORT}`);
    console.log(`📁 静的ファイル配信: ${__dirname}`);
    console.log(`📋 利用可能なエンドポイント:`);
    console.log(`   GET  /api/health - ヘルスチェック`);
    console.log(`   POST /api/execute-setup - セットアップスクリプト実行`);
});

// 終了処理
process.on('SIGINT', () => {
    console.log('\n🛑 セットアップサーバーを停止します...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 セットアップサーバーを停止します...');
    process.exit(0);
}); 