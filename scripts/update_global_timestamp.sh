#!/bin/bash
# global.mdcファイルのタイムスタンプを自動更新するスクリプト

# カラー出力用の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 global.mdcファイルのタイムスタンプを更新します...${NC}"

# スクリプトの実行ディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
GLOBAL_MDC_FILE="$PROJECT_ROOT/.cursor/rules/global.mdc"
TIMESTAMP_SCRIPT="$PROJECT_ROOT/scripts/get_timestamp.py"

# ファイルの存在確認
if [ ! -f "$GLOBAL_MDC_FILE" ]; then
    echo -e "${RED}❌ global.mdcファイルが見つかりません: $GLOBAL_MDC_FILE${NC}"
    exit 1
fi

if [ ! -f "$TIMESTAMP_SCRIPT" ]; then
    echo -e "${RED}❌ タイムスタンプスクリプトが見つかりません: $TIMESTAMP_SCRIPT${NC}"
    exit 1
fi

# 現在のタイムスタンプを取得
echo -e "${YELLOW}📅 現在のタイムスタンプを取得中...${NC}"
CURRENT_TIMESTAMP=$(python3 "$TIMESTAMP_SCRIPT" formatted)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ タイムスタンプの取得に失敗しました${NC}"
    exit 1
fi

echo -e "${GREEN}✅ タイムスタンプ取得完了: $CURRENT_TIMESTAMP${NC}"

# 現在のタイムスタンプを確認
OLD_TIMESTAMP=$(grep "最終更新:" "$GLOBAL_MDC_FILE" | tail -1)
echo -e "${BLUE}📝 現在のファイル: $OLD_TIMESTAMP${NC}"

# バックアップを作成
BACKUP_FILE="$GLOBAL_MDC_FILE.backup.$(date +%Y%m%d_%H%M%S)"
cp "$GLOBAL_MDC_FILE" "$BACKUP_FILE"
echo -e "${YELLOW}💾 バックアップ作成: $BACKUP_FILE${NC}"

# タイムスタンプを更新
# sedコマンドでファイル内の最終更新行を置換
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS用のsedコマンド
    sed -i '' "s/最終更新: [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9] JST/$CURRENT_TIMESTAMP/" "$GLOBAL_MDC_FILE"
else
    # Linux用のsedコマンド
    sed -i "s/最終更新: [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9] JST/$CURRENT_TIMESTAMP/" "$GLOBAL_MDC_FILE"
fi

# 更新の確認
if [ $? -eq 0 ]; then
    NEW_TIMESTAMP=$(grep "最終更新:" "$GLOBAL_MDC_FILE" | tail -1)
    echo -e "${GREEN}✅ タイムスタンプ更新完了: $NEW_TIMESTAMP${NC}"
    
    # バックアップファイルを削除するか確認
    echo -e "${YELLOW}🗑️  バックアップファイルを削除しますか？ (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm "$BACKUP_FILE"
        echo -e "${GREEN}✅ バックアップファイルを削除しました${NC}"
    else
        echo -e "${BLUE}📁 バックアップファイルを保持: $BACKUP_FILE${NC}"
    fi
else
    echo -e "${RED}❌ タイムスタンプの更新に失敗しました${NC}"
    echo -e "${YELLOW}💾 バックアップから復元中...${NC}"
    cp "$BACKUP_FILE" "$GLOBAL_MDC_FILE"
    echo -e "${GREEN}✅ バックアップから復元完了${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 global.mdcファイルのタイムスタンプ更新が完了しました！${NC}" 