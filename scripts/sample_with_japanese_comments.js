/**
 * サンプルスクリプト - 日本語コメント付き
 * このファイルは、Cursorでの日本語コメントの書き方を示すサンプルです
 */

// ユーザー情報を管理するクラス
class UserManager {
    constructor() {
        // ユーザーリストを初期化
        this.users = [];
    }

    /**
     * 新しいユーザーを追加する
     * @param {string} name - ユーザー名
     * @param {string} email - メールアドレス
     * @returns {Object} 作成されたユーザーオブジェクト
     */
    addUser(name, email) {
        // 入力値の検証
        if (!name || !email) {
            throw new Error('名前とメールアドレスは必須です');
        }

        // メールアドレスの形式をチェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('正しいメールアドレスの形式で入力してください');
        }

        // ユーザーオブジェクトを作成
        const newUser = {
            id: Date.now(), // 簡易的なID生成
            name: name,
            email: email,
            createdAt: new Date().toLocaleString('ja-JP') // 日本時間で記録
        };

        // リストに追加
        this.users.push(newUser);
        
        console.log(`新しいユーザー「${name}」を追加しました`);
        return newUser;
    }

    /**
     * 全ユーザーを取得する
     * @returns {Array} ユーザーリスト
     */
    getAllUsers() {
        return this.users;
    }

    /**
     * ユーザーを検索する
     * @param {string} keyword - 検索キーワード（名前またはメール）
     * @returns {Array} 検索結果
     */
    searchUsers(keyword) {
        // キーワードが空の場合は全件返す
        if (!keyword) {
            return this.users;
        }

        // 名前またはメールアドレスで部分一致検索
        return this.users.filter(user => 
            user.name.includes(keyword) || 
            user.email.includes(keyword)
        );
    }
}

// 使用例
function main() {
    console.log('=== ユーザー管理システム デモ ===');
    
    // マネージャーのインスタンスを作成
    const manager = new UserManager();

    try {
        // ユーザーを追加
        manager.addUser('田中太郎', 'tanaka@example.com');
        manager.addUser('佐藤花子', 'sato@example.com');
        manager.addUser('鈴木一郎', 'suzuki@example.com');

        // 全ユーザーを表示
        console.log('\n--- 登録済みユーザー一覧 ---');
        const allUsers = manager.getAllUsers();
        allUsers.forEach(user => {
            console.log(`ID: ${user.id}, 名前: ${user.name}, メール: ${user.email}`);
        });

        // ユーザーを検索
        console.log('\n--- 「田中」で検索 ---');
        const searchResult = manager.searchUsers('田中');
        searchResult.forEach(user => {
            console.log(`検索結果: ${user.name} (${user.email})`);
        });

    } catch (error) {
        console.error('エラーが発生しました:', error.message);
    }
}

// エクスポート（他のファイルから使用する場合）
module.exports = UserManager;

// スクリプトとして直接実行された場合
if (require.main === module) {
    main();
} 