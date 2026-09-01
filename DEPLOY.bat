@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo ================================================
echo   DEPLOY ENGLISH FUN ZONE
echo ================================================
where git >nul 2>nul
if errorlevel 1 ( echo [LOI] May chua cai Git. Tai tai: https://git-scm.com & pause & exit /b 1 )
git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo [INFO] Khoi tao kho git...
  git init
  git branch -M main
)
git remote get-url origin >nul 2>nul
if errorlevel 1 git remote add origin https://github.com/nguyenisnotwibu/english-fun-zone.git
echo [INFO] Cau hinh danh tinh git cho repo nay...
git config user.email "nguyenleader2002@gmail.com"
git config user.name "Nguyen Vu"
echo.
echo [INFO] Cac file da thay doi:
git status --short
echo.
echo [INFO] Lay du lieu tu GitHub...
git fetch origin main
echo.
set "MSG=%~1"
if not defined MSG set /p "MSG=Mo ta thay doi lan nay (Enter = tu dong theo ngay gio): "
if not defined MSG call :AUTOMSG
echo [INFO] Commit: %MSG%
git add -A
git commit -m "%MSG%"
echo [INFO] Gop voi ban tren GitHub (uu tien ban moi tren may)...
git merge origin/main --allow-unrelated-histories -X ours --no-edit
echo [INFO] Push len GitHub...
git push -u origin main
if errorlevel 1 ( echo [LOI] Push that bai - xem thong bao phia tren. & pause & exit /b 1 )
echo.
echo XONG! Doi ~1 phut roi mo:
echo   https://nguyenisnotwibu.github.io/english-fun-zone/index.html
echo   https://nguyenisnotwibu.github.io/english-fun-zone/grammar.html
pause
exit /b 0

:AUTOMSG
set "STAMP="
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"`) do set "STAMP=%%i"
if not defined STAMP set "STAMP=%DATE% %TIME%"
set "MSG=Cap nhat English Fun Zone %STAMP%"
exit /b 0
