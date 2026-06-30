@echo off
title Ziyaattin Aydin Website

cd /d "C:\Users\ziyaa\Ziyaattin-Aydin-Website"

if not exist package.json (
    echo HATA: package.json bulunamadi.
    echo Klasor yolunu kontrol et:
    echo C:\Users\ziyaa\Ziyaattin-Aydin-Website
    pause
    exit /b 1
)

if not exist node_modules (
    echo Bagimliliklar kuruluyor...
    call npm install
    if errorlevel 1 goto error
)

start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

echo Proje baslatiliyor...
call npm run dev
if errorlevel 1 goto error

exit /b 0

:error
echo.
echo Proje baslatilirken bir hata olustu.
pause
exit /b 1
