@echo off
cd /d "%~dp0"
echo ================================================
echo   DEPLOY ENGLISH FUN ZONE + NGU PHAP MASTER
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
echo [INFO] Lay du lieu tu GitHub...
git fetch origin main
echo [INFO] Commit thay doi...
git add -A
git commit -m "Add Ngu Phap Master: 20 chuyen de, 400 cau hoi tu sach Tong on ngu phap"
echo [INFO] Gop voi ban tren GitHub (uu tien ban moi tren may)...
git merge origin/main --allow-unrelated-histories -X ours --no-edit
echo [INFO] Push len GitHub...
git push -u origin main
if errorlevel 1 ( echo [LOI] Push that bai - xem thong bao phia tren. & pause & exit /b 1 )
echo.
echo XONG! Doi ~1 phut roi mo:
echo https://nguyenisnotwibu.github.io/english-fun-zone/grammar.html
pause
