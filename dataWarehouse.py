import clr
import sys
import os

dll_path = r"C:/Program Files/Microsoft.NET/ADOMD.NET/160"
sys.path.append(dll_path)
clr.AddReference("Microsoft.AnalysisServices.AdomdClient")

from pyadomd import Pyadomd
from functools import reduce

# Kết nối với SSAS
connection_string = "Provider=MSOLEDBSQL.1;Data Source=LAPTOP-84HLVAJD;Initial Catalog=DataWarehouse"

def build_dimension_hierarchy(fact, dimension_name):
    mapping = {
        "Năm": "[Dim Thoi Gian].[Nam]",
        "Quý": "[Dim Thoi Gian].[Quy]",
        "Tháng": "[Dim Thoi Gian].[Thang]",
        "Khách Hàng": "[Dim Khach Hang].[Ten Khach Hang]",
        "Thành Phố": "[Dim Khach Hang].[Ten Thanh Pho]" if fact == "banHang" else "[Dim Cua Hang].[Ten Thanh Pho]",
        "Bang": "[Dim Khach Hang].[Bang]" if fact == "banHang" else "[Dim Cua Hang].[Bang]",
        "Cửa Hàng": "[Dim Cua Hang].[Ma Cua Hang]",        
        "Mặt Hàng": "[Dim Mat Hang].[Ma Mat Hang].[Ma Mat Hang]",
    }
    return mapping.get(dimension_name, None)

def build_hierarchy_set(dim, values, fact):
    hier = build_dimension_hierarchy(fact, dim)
    if not hier or not values:
        return None
    members = ', '.join(f'{hier}.[{val}]' for val in values)
    return f'{{ {members} }}'

def get_result(fact: str, dimensions: list, filters: dict):
    hierarchies = []
    processed_filters = set()

    for dim in dimensions:
        if dim in filters:
            values = filters[dim]
            if not isinstance(values, list):
                values = [values]
            hset = build_hierarchy_set(dim, values, fact)
            if hset:
                hierarchies.append(hset)
                processed_filters.add(dim)
        else:
            hier = build_dimension_hierarchy(fact, dim)
            if hier:
                hierarchies.append(f"{hier}.MEMBERS")

    if not hierarchies:
        raise ValueError("Không có dimension hợp lệ nào.")

    if len(hierarchies) == 1:
        rows_clause = f"TopCount({hierarchies[0]}, 100, {'[Measures].[Tong Doanh Thu]' if fact == 'banHang' else '[Measures].[Tong So Luong Xuat]'})"
    else:
        def nested_crossjoin(x, y):
            return f"CrossJoin({x}, {y})"
        rows_clause = f"TopCount({reduce(nested_crossjoin, hierarchies)}, 100, {'[Measures].[Tong Doanh Thu]' if fact == 'banHang' else '[Measures].[Tong So Luong Xuat]'})"

    where_clauses = []
    for dim, val in filters.items():
        if dim in processed_filters:
            continue
        hier = build_dimension_hierarchy(fact, dim)
        if hier and val:
            values = val if isinstance(val, list) else [val]
            members = ", ".join(f"{hier}.[{v}]" for v in values)
            where_clauses.append(f"{{ {members} }}")

    where_clause = f"WHERE ( {', '.join(where_clauses)} )" if where_clauses else ""

    if fact == "banHang":
        measure1 = "[Measures].[Tong So Luong]"
        measure2 = "[Measures].[Tong Doanh Thu]"
        text1 = "Tổng Số Lượng"
        text2 = "Tổng Doanh Thu"
        cube = "[Cube_BanHang]"
    elif fact == "kho":
        measure1 = "[Measures].[Tong So Luong Nhap]"
        measure2 = "[Measures].[Tong So Luong Xuat]"
        text1 = "Tổng Số Lượng Nhập"
        text2 = "Tổng Số Lượng Xuất"
        cube = "[Cube_KhoHang]"

    mdx_query = f"""
    SELECT 
      NON EMPTY {{ {measure1}, {measure2} }} ON COLUMNS,
      NON EMPTY 
        {rows_clause} ON ROWS
    FROM {cube}
    {where_clause}
    """

    print("=== MDX Query ===")
    print(mdx_query)

    result = []
    with Pyadomd(connection_string) as conn:
        with conn.cursor() as cur:
            cur.execute(mdx_query)
            rows = cur.fetchall()
            for row in rows:
                if any(val is None for val in row[:len(dimensions)]):
                    continue
                row_data = {}
                if len(dimensions) == 1:
                    row_data[dimensions[0]] = row[0]
                else:
                    for i, dim in enumerate(dimensions):
                        row_data[dim] = row[i]
                row_data[text1] = row[-2] 
                row_data[text2] = row[-1]
                result.append(row_data)

    return result

# Ví dụ:
def main():
    fact = "banHang"
    dimensions = ["Thành Phố", "Bang", "Khách Hàng", "Tháng", "Mặt Hàng"]
    filters = {}
    print(get_result(fact, dimensions, filters))

    # fact = "kho"
    # dimensions = ["Tháng"]
    # filters = {"Cửa Hàng": ["12"]}
    # print(get_result(fact, dimensions, filters))

if __name__ == "__main__":
    main()