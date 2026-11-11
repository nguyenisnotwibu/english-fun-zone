@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo ================================================
echo   DEPLOY ENGLISH FUN ZONE
echo ================================================
where git >nul 2>nul
if errorlevel 1 ( echo [LOI] May chua cai Git. Tai tai: https://git-scm.com & pause & exit /b 1 )

echo [INFO] Don dep khoa git con sot lai (neu co)...
if exist ".git\HEAD.lock"             del /f /q ".git\HEAD.lock"
if exist ".git\index.lock"            del /f /q ".git\index.lock"
if exist ".git\config.lock"           del /f /q ".git\config.lock"
if exist ".git\ORIG_HEAD.lock"        del /f /q ".git\ORIG_HEAD.lock"
if exist ".git\refs\heads\main.lock"  del /f /q ".git\refs\heads\main.lock"
if exist ".git\objects\maintenance.lock" del /f /q ".git\objects\maintenance.lock"
for /f "delims=" %%F in ('dir /b /a-d ".git\_stale*" 2^>nul') do del /f /q ".git\%%F" >nul 2>nul
if exist ".git\_stale" rd /s /q ".git\_stale" >nul 2>nul
for /f "delims=" %%F in ('dir /b /s ".git\objects\tmp_obj_*" 2^>nul') do del /f /q "%%F" >nul 2>nul

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
where node >nul 2>nul
if not errorlevel 1 (
  echo [INFO] Kiem tra toan bo du lieu ^(de thi, lop 4-12, ngu phap, IELTS^)...
  node tools\check-data.js
  if errorlevel 1 ( echo [LOI] Du lieu co loi - sua truoc khi day len. & pause & exit /b 1 )
)
set "MSG=%~1"
if not defined MSG set /p "MSG=Mo ta thay doi lan nay (Enter = tu dong theo ngay gio): "
if not defined MSG call :AUTOMSG
echo [INFO] Commit: %MSG%
git add -A
git commit -m "%MSG%"

echo.
echo [INFO] Kiem tra commit da thanh cong chua...
set "DIRTY="
for /f "delims=" %%L in ('git status --porcelain 2^>nul') do set "DIRTY=1"
if defined DIRTY (
  echo.
  echo ================================================
  echo   [LOI] COMMIT THAT BAI - CHUA DAY LEN GITHUB
  echo ================================================
  echo Van con file chua duoc commit:
  git status --short
  echo.
  echo Cach xu ly: dong het cua so Git/VS Code dang mo thu muc nay,
  echo roi chay lai file DEPLOY-AUTO.bat mot lan nua.
  echo.
  pause
  exit /b 1
)
echo [OK] Da commit sach se.

echo [INFO] Gop voi ban tren GitHub (neu tren GitHub co thay doi moi)...
git merge origin/main --no-edit
if errorlevel 1 (
  git merge --abort >nul 2>nul
  echo.
  echo ================================================
  echo   [LOI] BAN TREN GITHUB XUNG DOT VOI BAN TREN MAY
  echo ================================================
  echo Tren GitHub co thay doi ma may nay chua co, va no dung cung cho voi
  echo thay doi cua thay. Script KHONG tu ghi de de tranh mat du lieu.
  echo Ban tren may van nguyen ven ^(da commit^). Hay nho Claude gop giup,
  echo hoac mo GitHub xem commit moi nhat la gi roi chay lai.
  echo.
  pause
  exit /b 1
)
echo [INFO] Push len GitHub...
git push -u origin main
if errorlevel 1 ( echo [LOI] Push that bai - xem thong bao phia tren. & pause & exit /b 1 )

echo.
echo [INFO] Kiem tra da dong bo voi GitHub chua...
git fetch origin main >nul 2>nul
for /f "delims=" %%A in ('git rev-parse HEAD') do set "LOCAL=%%A"
for /f "delims=" %%B in ('git rev-parse origin/main') do set "REMOTE=%%B"
if not "%LOCAL%"=="%REMOTE%" (
  echo [LOI] Ban tren may va tren GitHub VAN KHAC NHAU.
  echo   Tren may   : %LOCAL%
  echo   Tren GitHub: %REMOTE%
  pause
  exit /b 1
)
echo [OK] Da dong bo. Commit: %LOCAL%
echo [INFO] Nen gon kho git...
git gc --quiet >nul 2>nul

echo.
echo XONG! Doi ~1 phut roi mo (nho bam Ctrl+F5 de bo cache):
echo   https://nguyenisnotwibu.github.io/english-fun-zone/index.html
echo   https://nguyenisnotwibu.github.io/english-fun-zone/admin.html
echo   https://nguyenisnotwibu.github.io/english-fun-zone/grammar.html
pause
exit /b 0

:AUTOMSG
set "STAMP="
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"`) do set "STAMP=%%i"
if not defined STAMP set "STAMP=%DATE% %TIME%"
set "MSG=Cap nhat English Fun Zone %STAMP%"
exit /b 0
