@echo off
cd /d "%~dp0"
echo ================================================
echo   DAY CAP NHAT ENGLISH FUN ZONE LEN GITHUB PAGES
echo ================================================
git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo [LOI] Thu muc nay chua phai la kho git.
  echo Neu kho git nam o cho khac, hay copy index.html sang do roi push.
  echo Hoac chay 3 lenh sau de noi voi repo tren GitHub:
  echo    git init ^&^& git branch -M main
  echo    git remote add origin https://github.com/nguyenisnotwibu/english-fun-zone.git
  echo    git pull origin main --allow-unrelated-histories
  pause & exit /b 1
)
git add -A
git commit -m "Them 4 chu de thi co ban: HTTD co ban, QKD, tuong lai, QKTD"
git push
if errorlevel 1 ( echo [LOI] Push that bai - xem thong bao phia tren. & pause & exit /b 1 )
echo.
echo XONG! Doi ~1 phut roi mo: https://nguyenisnotwibu.github.io/english-fun-zone/
pause
