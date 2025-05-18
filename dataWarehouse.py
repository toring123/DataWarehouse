import clr
import sys
import os

dll_path = r"C:/Program Files/Microsoft.NET/ADOMD.NET/160"
sys.path.append(dll_path)
clr.AddReference("Microsoft.AnalysisServices.AdomdClient")

from pyadomd import Pyadomd

# Kết nối với SSAS
connection_string = "Data Source=LAPTOP-84HLVAJD;Initial Catalog=DW"

def build_dimension_hierarchy(fact, dimension_name):
    mapping = {
        "Năm": "[Dim Thoi Gian].[Nam].[Nam]",
        "Quý": "[Dim Thoi Gian].[Quy].[Quy]",
        "Tháng": "[Dim Thoi Gian].[Thang].[Thang]",
        "Khách Hàng": "[Dim Khach Hang].[Ten Khach Hang].[Ten Khach Hang]",
        "Thành Phố": "[Dim Khach Hang].[Ten Thanh Pho].[Ten Thanh Pho]" if fact == "banHang" else "[Dim Cua Hang].[Ten Thanh Pho].[Ten Thanh Pho]",
        "Bang": "[Dim Khach Hang].[Bang].[Bang]" if fact == "banHang" else "[Dim Cua Hang].[Bang].[Bang]",
        "Cửa Hàng": "[Dim Cua Hang].[Ma Cua Hang].[Ma Cua Hang]",
        "Mặt Hàng": "[Dim Mat Hang].[Ma Mat Hang].[Ma Mat Hang]",
    }
    return mapping.get(dimension_name, None)

def build_hierarchy_set(dim, values, fact):
    hier = build_dimension_hierarchy(fact, dim)
    if not hier or not values:
        return None
    # Sử dụng &[value] để chỉ định member key, như trong truy vấn mẫu
    members = ', '.join(f'{hier}.&[{val}]' for val in values)
    return f'{{ {members} }}'

def get_result(fact: str, dimensions: list, filters: dict):
    if fact == "banHang":
        measure1 = "[Measures].[Tong So Luong Ban]"
        measure2 = "[Measures].[Tong Doanh Thu]"
        text1 = "Tổng Số Lượng"
        text2 = "Tổng Doanh Thu"
        cube = "[CubeBH_KH_MH_TG]"
    elif fact == "kho":
        measure1 = "[Measures].[Tong So Luong Nhap]"
        measure2 = "[Measures].[Tong So Luong Xuat]"
        text1 = "Tổng Số Lượng Nhập"
        text2 = "Tổng Số Lượng Xuất"
        cube = "[CubeKho_CH_MH_TG]"
    else:
        raise ValueError("Fact không hợp lệ: chỉ hỗ trợ 'banHang' hoặc 'kho'.")
    
    # Loại bỏ filter có value rỗng
    filters = {k: v for k, v in filters.items() if v}
    hierarchies = []

    # Xây dựng hierarchies cho ROWS với ALLMEMBERS
    for dim in dimensions:
        hier = build_dimension_hierarchy(fact, dim)
        if not hier:
            continue
        hierarchies.append(f"{hier}.ALLMEMBERS")

    if not hierarchies:
        raise ValueError("Không có dimension hợp lệ nào.")

    # Kết hợp dimensions bằng * (CrossJoin)
    rows_clause = " * ".join(hierarchies)
    rows_clause = f"{{ ({rows_clause}) }}"

    # Xây dựng subselect lồng nhau
    subselect_clauses = []
    for dim, val in filters.items():
        hier = build_dimension_hierarchy(fact, dim)
        if hier and val:
            values = val if isinstance(val, list) else [val]
            members = ", ".join(f"{hier}.&[{v}]" for v in values)
            subselect_clauses.append(f"SELECT {{ {members} }} ON COLUMNS")

    # Tạo FROM với subselect lồng
    if subselect_clauses:
        from_clause = f"{cube}"  # Khởi tạo với cube
        for subselect in reversed(subselect_clauses):  # Lồng ngược: Bang, Năm, Tháng
            from_clause = f"( {subselect} FROM {from_clause} )"
        from_clause = f"FROM {from_clause}"
    else:
        from_clause = f"FROM {cube}"

    mdx_query = f"""
    SELECT 
      NON EMPTY {{ {measure1}, {measure2} }} ON COLUMNS,
      NON EMPTY 
        {rows_clause} DIMENSION PROPERTIES MEMBER_CAPTION, MEMBER_UNIQUE_NAME ON ROWS
    {from_clause}
    CELL PROPERTIES VALUE, BACK_COLOR, FORE_COLOR, FORMATTED_VALUE, FORMAT_STRING, FONT_NAME, FONT_SIZE, FONT_FLAGS
    """

    print("=== MDX Query ===")
    print(mdx_query)

    result = []
    try:
        with Pyadomd(connection_string) as conn:
            with conn.cursor() as cur:
                cur.execute(mdx_query)
                rows = cur.fetchall()
                for row in rows:
                    print(row)
                    row_data = {}
                    if len(dimensions) == 1:
                        row_data[dimensions[0]] = row[0]
                    else:
                        for i, dim in enumerate(dimensions):
                            row_data[dim] = row[i*2]
                    row_data[text1] = row[-2]
                    row_data[text2] = row[-1]
                    
                    result.append(row_data)
    except Exception as e:
        print(f"Error executing MDX query: {e.Message}")
        if "was not found in the cube" in e.Message:
            print("Please verify the measure or dimension names in the cube using SSMS.")
        elif "cube does not exist" in e.Message:
            print("Please verify the cube name in SSMS and ensure it is deployed.")
        raise

    return result

# Ví dụ:
def main():
    fact = "kho"
    dimensions = ["Năm", "Tháng", "Bang", "Thành Phố", "Mặt Hàng"]
    filters = {
        "Năm": ["2023", "2024"],
        "Tháng": ["1", "2"],
        "Bang": ["4", "5"]  # Mã bang, ví dụ Hà Nội, TP.HCM
    }
    print(get_result(fact, dimensions, filters))

if __name__ == "__main__":
    main()