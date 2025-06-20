@echo off
echo.
echo ================================================
echo    POSTS MANAGER - Challenge Técnico TCIT
echo ================================================
echo.
echo Iniciando Backend y Frontend simultáneamente...
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo Health:   http://localhost:3001/health
echo.
echo ================================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm run setup
    echo.
)

REM Ejecutar en modo desarrollo
echo 🚀 Iniciando aplicación...
npm run dev 