from datetime import datetime
from fastmcp import FastMCP
import pytz

mcp = FastMCP(name="TimeServer")

@mcp.tool()
def get_current_time() -> str:
    """現在の日本時間を返します。フォーマット: YYYY-MM-DD HH:MM:SS"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).strftime("%Y-%m-%d %H:%M:%S")

@mcp.tool()
def get_formatted_timestamp() -> str:
    """ドキュメント用のフォーマット済みタイムスタンプを返します。
    例: 最終更新: 2025-01-10 14:30:45 JST
    """
    jst = pytz.timezone('Asia/Tokyo')
    current_time = datetime.now(jst)
    return f"最終更新: {current_time.strftime('%Y-%m-%d %H:%M:%S')} JST"

@mcp.tool()
def get_iso_timestamp() -> str:
    """ISO 8601形式のタイムスタンプを返します。"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).isoformat()

@mcp.tool()
def get_date_only() -> str:
    """現在の日付のみを返します。フォーマット: YYYY-MM-DD"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).strftime("%Y-%m-%d")

@mcp.tool()
def get_time_only() -> str:
    """現在の時刻のみを返します。フォーマット: HH:MM:SS"""
    jst = pytz.timezone('Asia/Tokyo')
    return datetime.now(jst).strftime("%H:%M:%S")

if __name__ == "__main__":
    mcp.run() 