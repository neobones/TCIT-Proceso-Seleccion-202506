.PHONY: help setup dev start build test clean health lint type-check
.DEFAULT_GOAL := help

# Colores para output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

help: ## Mostrar ayuda de comandos disponibles
	@echo "$(BLUE)===========================================$(RESET)"
	@echo "$(BLUE)  POSTS MANAGER - Challenge Técnico TCIT$(RESET)"
	@echo "$(BLUE)===========================================$(RESET)"
	@echo ""
	@echo "$(GREEN)Comandos disponibles:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(BLUE)URLs de la aplicación:$(RESET)"
	@echo "  Frontend:  http://localhost:5173"
	@echo "  Backend:   http://localhost:3001"
	@echo "  Health:    http://localhost:3001/health"

setup: ## Instalar dependencias en ambos proyectos
	@echo "$(GREEN)📦 Instalando dependencias...$(RESET)"
	@npm run setup

dev: ## Ejecutar backend y frontend en modo desarrollo
	@echo "$(GREEN)🚀 Iniciando aplicación en modo desarrollo...$(RESET)"
	@npm run dev

start: ## Ejecutar backend y frontend en modo producción
	@echo "$(GREEN)🚀 Iniciando aplicación en modo producción...$(RESET)"
	@npm run start

build: ## Construir ambos proyectos
	@echo "$(GREEN)🔨 Construyendo aplicación...$(RESET)"
	@npm run build

test: ## Ejecutar tests en ambos proyectos
	@echo "$(GREEN)🧪 Ejecutando tests...$(RESET)"
	@npm run test

clean: ## Limpiar node_modules y archivos de build
	@echo "$(YELLOW)🧹 Limpiando archivos...$(RESET)"
	@npm run clean

fresh: clean setup ## Instalación limpia completa
	@echo "$(GREEN)✨ Instalación limpia completada$(RESET)"

health: ## Verificar estado del backend
	@echo "$(GREEN)🔍 Verificando estado del backend...$(RESET)"
	@npm run health

lint: ## Ejecutar linting en ambos proyectos
	@echo "$(GREEN)🔍 Ejecutando linting...$(RESET)"
	@npm run lint

type-check: ## Verificar tipos TypeScript
	@echo "$(GREEN)📝 Verificando tipos TypeScript...$(RESET)"
	@npm run type-check

backend-dev: ## Solo backend en modo desarrollo
	@echo "$(GREEN)🔧 Iniciando solo backend...$(RESET)"
	@npm run backend:dev

frontend-dev: ## Solo frontend en modo desarrollo
	@echo "$(GREEN)🎨 Iniciando solo frontend...$(RESET)"
	@npm run frontend:dev

migrate: ## Ejecutar migraciones de base de datos
	@echo "$(GREEN)🗄️  Ejecutando migraciones...$(RESET)"
	@npm run backend:migrate

logs: ## Ver logs del backend (si está corriendo)
	@echo "$(GREEN)📋 Mostrando logs...$(RESET)"
	@tail -f backend/logs/*.log 2>/dev/null || echo "$(RED)❌ No se encontraron logs$(RESET)"

info: ## Mostrar información del proyecto
	@echo "$(BLUE)===========================================$(RESET)"
	@echo "$(BLUE)  INFORMACIÓN DEL PROYECTO$(RESET)"
	@echo "$(BLUE)===========================================$(RESET)"
	@echo "Arquitectura: Clean Architecture + SOLID"
	@echo "Backend:      Node.js + TypeScript + SQLite"
	@echo "Frontend:     React + Redux + TypeScript"
	@echo "Testing:      Jest + Vitest"
	@echo "Build:        Vite + TSC"
	@echo ""
	@node --version 2>/dev/null && echo "Node.js: ✅" || echo "Node.js: ❌"
	@npm --version 2>/dev/null && echo "npm: ✅" || echo "npm: ❌" 