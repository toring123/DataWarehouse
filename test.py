import clr
import sys
import os

dll_path = r"C:/Program Files/Microsoft.NET/ADOMD.NET/160"
sys.path.append(dll_path)
clr.AddReference("Microsoft.AnalysisServices.AdomdClient")

from pyadomd import Pyadomd
from functools import reduce

# Kết nối với SSAS
connection_string = "Data Source=LAPTOP-84HLVAJD;Initial Catalog=DW"

mdx_query = '''
    SELECT
      NON EMPTY { [Measures].[Tong So Luong Ban], [Measures].[Tong Doanh Thu] } ON COLUMNS,
      NON EMPTY
        Subset(CrossJoin([Dim Thoi Gian].[Thang].[Thang].ALLMEMBERS, [Dim Khach Hang].[Bang].[Bang].ALLMEMBERS), 50, 50) DIMENSION PROPERTIES MEMBER_CAPTION, MEMBER_UNIQUE_NAME ON ROWS
    FROM ( SELECT { [Dim Thoi Gian].[Nam].[Nam].&[2023], [Dim Thoi Gian].[Nam].[Nam].&[2024] } ON COLUMNS FROM ( SELECT { [Dim Thoi Gian].[Thang].[Thang].&[1], [Dim Thoi Gian].[Thang].[Thang].&[2] } ON COLUMNS FROM ( SELECT { [Dim Khach Hang].[Bang].[Bang].&[4], [Dim Khach Hang].[Bang].[Bang].&[5] } ON COLUMNS FROM [CubeBH_KH_MH_TG] ) ) )
    CELL PROPERTIES VALUE, BACK_COLOR, FORE_COLOR, FORMATTED_VALUE, FORMAT_STRING, FONT_NAME, FONT_SIZE, FONT_FLAGS
'''
cnt = 0
with Pyadomd(connection_string) as conn:
        with conn.cursor() as cur:
            cur.execute(mdx_query)
            rows = cur.fetchall()
            for row in rows:
                print(row)
                cnt += 1

print(cnt)

