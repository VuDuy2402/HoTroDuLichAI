# HoTroDuLichAI

## Hướng Dẫn Cài Đặt và Chạy Dự Án

### 1. Cài Đặt Phần Mềm Cần Thiết

Trước khi bắt đầu, hãy cài đặt các phần mềm sau:

- **.NET SDK với .NET 8**
  - Tải về từ: [Download .NET SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

- **Node.js**
  - Tải về từ: [Download Node.js](https://nodejs.org/)

- **SQL Server**
  - Tải về từ: [Download SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

- **SQL Server Management Studio (SSMS)**
  - Tải về từ: [Download SSMS](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

- **Visual Studio Code**
  - Tải về từ: [Download VSCode](https://code.visualstudio.com/)

- **Visual Studio**
  - Tải về từ: [Download Visual Studio](https://visualstudio.microsoft.com/)

- **Git**
  - Tải về từ: [Download Git](https://git-scm.com/)

### 2. Chạy Dự Án

#### Bước 1: Mở Dự Án

1. Mở terminal hoặc command prompt.
2. Điều hướng đến thư mục gốc của dự án.

```bash
cd đường-dẫn-tới-thư-mục-gốc-của-dự-án
```
# Bước 2: Khôi Phục Các Gói
Chạy lệnh sau để khôi phục các gói cần thiết:

```bash
dotnet restore
```

# Bước 3: Cài Đặt Các Gói Node.js
Điều hướng đến thư mục frontend:

```bash
cd FE/ho-tro-du-lich.web
```
Chạy lệnh sau để cài đặt các gói Node.js:

```bash
npm install
```

# Bước 4: Cấu Hình Connection String
Mở file `appsettings.json` nằm trong thư mục `BE/HoTroDuLichAI.API`:
```json
{
    "ConnectionStrings": {
        "DefaultConnection": "Server=YOUR_SERVER; Database=YOUR_DATABASE_NAME; User Id=YOUR_USER_ID; Password=YOUR_USER_PASSWORD; Trusted_Connection=true; TrustServerCertificate=True;"
    }
}
```

# Bước 5: Chạy Dự Án
Quay lại thư mục gốc:

```bash
cd ..
```

Chạy lệnh sau để khởi động dự án:

```bash
run-project.bat
```

# Bước 6: Chạy Migrations

1. **Chọn option 4 để vào menu migrations**:
   - Mở terminal hoặc command prompt.
   - Chạy lệnh `run-project.bat` để khởi động dự án.
   - Khi menu xuất hiện, nhấn phím `4` và sau đó nhấn `Enter` để vào menu migrations.

2. **Chọn option 2 để thêm một migration mới**:
   - Trong menu migrations, nhấn phím `2` và sau đó nhấn `Enter`.
   - Nhập tên migration của bạn và nhấn `Enter`.

3. **Quay lại menu chính**:
   - Tắt cửa sổ Terminal migrations đã bật lên sau khi chạy xong và quay trở lại Terminal chính của chương trình.

4. **Chọn option 4 để cập nhật database cho migrations**:
   - Trong menu chính, nhấn phím `Enter` để vào lại menu migrations.
   - Chọn option `4` để cập nhật database với các migrations mới. Nhấn `Enter` để xác nhận.


# Bước 7: Khởi Động Dự Án
Sau khi hoàn tất các bước trên, trở lại menu chính. Chọn option 1, 2, hoặc 3 để chạy dự án.

### Lưu Ý
Đảm bảo rằng SQL Server đang chạy và bạn đã cấu hình đúng connection string.
Kiểm tra lại các yêu cầu phần mềm để tránh lỗi khi khởi động dự án.
Cảm ơn bạn đã sử dụng dự án HoTroDuLichAI! Nếu có bất kỳ câu hỏi nào, hãy liên hệ với nhóm phát triển.