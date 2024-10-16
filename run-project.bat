@echo off
:menu
cls
echo ================================
echo Select an option to run the .NET project:
echo ================================
echo 1. dotnet run --no-build
echo 2. dotnet run
echo 3. dotnet watch run
echo 4. Migrations
echo 5. Exit
echo ================================
set /p choice=Enter your choice (1-5): 

if %choice%==1 goto run_no_build
if %choice%==2 goto run
if %choice%==3 goto watch_run
if %choice%==4 goto migrations
if %choice%==5 goto exit

:start_vite
start cmd /k "npm run dev --prefix FE\ho-tro-du-lich.web"
goto %1

:run_no_build
call :start_vite
start cmd /k "dotnet run --no-build --project BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj"
pause
goto menu

:run
call :start_vite
start cmd /k "dotnet run --project BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj"
pause
goto menu

:watch_run
call :start_vite
start cmd /k "dotnet watch run --project BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj"
pause
goto menu

:migrations
cls
echo ================================
echo Migrations Options:
echo ================================
echo 1. List Migrations
echo 2. Add Migration
echo 3. Remove Migration
echo 4. Update Database
echo 5. Back to Main Menu
echo ================================
set /p migration_choice=Enter your choice (1-5): 

if %migration_choice%==1 goto list_migrations
if %migration_choice%==2 goto add_migration
if %migration_choice%==3 goto remove_migration
if %migration_choice%==4 goto update_database
if %migration_choice%==5 goto menu

:list_migrations
start cmd /k "dotnet ef migrations list --project .\BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj"
pause
goto migrations

:add_migration
set /p migration_name=Enter the migration name: 
start cmd /k "dotnet ef migrations add %migration_name% --project .\BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj --startup-project .\BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj"
pause
goto migrations

:remove_migration
set /p migration_name=Enter the migration name to remove: 
start cmd /k "dotnet ef migrations remove --project .\BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj --startup-project .\BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj"
pause
goto migrations

:update_database
start cmd /k "dotnet ef database update --project .\BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj --startup-project .\BE\HoTroDuLichAI.API\HoTroDuLichAI.API.csproj"
pause
goto migrations

:exit
exit