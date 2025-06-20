#!/bin/bash

echo ""
echo "================================================"
echo "   POSTS MANAGER - Challenge Técnico TCIT"
echo "================================================"
echo ""
echo "Iniciando Backend y Frontend simultáneamente..."
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo "Health:   http://localhost:3001/health"
echo ""
echo "================================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm run setup
    echo ""
fi

# Ejecutar en modo desarrollo
echo "🚀 Iniciando aplicación..."
npm run dev 