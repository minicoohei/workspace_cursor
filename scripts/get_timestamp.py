#!/usr/bin/env python3
"""
日本時間のタイムスタンプを取得するヘルパースクリプト
"""

from datetime import datetime
import pytz

def get_formatted_timestamp():
    """ドキュメント用のフォーマット済みタイムスタンプを返します。
    例: 最終更新: 2025-01-28 14:30:45 JST
    """
    jst = pytz.timezone('Asia/Tokyo')
    current_time = datetime.now(jst)
    return f"最終更新: {current_time.strftime('%Y-%m-%d %H:%M:%S')} JST"

def get_current_time():
    """現在の日本時間を返します。フォーマット: YYYY-MM-DD HH:MM:SS"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).strftime("%Y-%m-%d %H:%M:%S")

def get_iso_timestamp():
    """ISO 8601形式のタイムスタンプを返します。"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).isoformat()

def get_date_only():
    """現在の日付のみを返します。フォーマット: YYYY-MM-DD"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).strftime("%Y-%m-%d")

def get_time_only():
    """現在の時刻のみを返します。フォーマット: HH:MM:SS"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).strftime("%H:%M:%S")

if __name__ == "__main__":
    import sys
    
    # コマンドライン引数に応じて異なる形式を出力
    if len(sys.argv) > 1:
        if sys.argv[1] == "formatted":
            print(get_formatted_timestamp())
        elif sys.argv[1] == "current":
            print(get_current_time())
        elif sys.argv[1] == "iso":
            print(get_iso_timestamp())
        elif sys.argv[1] == "date":
            print(get_date_only())
        elif sys.argv[1] == "time":
            print(get_time_only())
        else:
            print("使用方法: python get_timestamp.py [formatted|current|iso|date|time]")
            sys.exit(1)
    else:
        # デフォルトはフォーマット済みタイムスタンプ
        print(get_formatted_timestamp()) 