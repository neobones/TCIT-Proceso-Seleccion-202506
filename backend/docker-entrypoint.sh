#!/bin/sh
set -e

echo "🔧 Iniciando configuración del backend..."

echo "🔄 Ejecutando migraciones..."
# Usar node directamente para ejecutar las migraciones compiladas
node dist/frameworks-drivers/database/migrate.js

echo "🚀 Iniciando servidor..."
# Ejecutar el servidor
exec npm start 