#!/bin/bash

# Get script directory
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

# Redirect all output to logs
exec 3>&1  # Save original stdout
exec > >(tee -a "$LOG_DIR/setup.log") 2>&1

# Cleanup and message function
cleanup() {
    echo "🔴 Wyłączam serwery..."
    kill $DJANGO_PID $REACT_PID 2> /dev/null
    exec 1>&3  # Restore original stdout
    echo -e "\nℹ️ Logi zapisane do: $LOG_DIR/"
    exit 0
}

main() {
    # Backend Setup
    echo "🛠️ Konfiguruję backend..."
    pushd "$SCRIPT_DIR/backend" > /dev/null || { echo "❌ Backend directory missing!"; exit 1; }

    # 1. Create venv if missing
    if [ ! -d "venv" ]; then
        echo "🔧 Tworzę środowisko wirtualne..."
        python -m venv venv > "$LOG_DIR/venv.log" 2>&1
    fi

    # 2. Install dependencies
    echo "📦 Instaluję zależności..."
    source venv/bin/activate
    pip install -r requirements.txt > "$LOG_DIR/pip.log" 2>&1

    # 3. Run migrations
    echo "🗄️ Uruchamiam migracje bazy danych..."
    python manage.py migrate > "$LOG_DIR/migrations.log" 2>&1

    # 4. Start Django server in background
    echo "🌐 Uruchamiam serwer Django na porcie 8000..."
    python manage.py runserver  > "$LOG_DIR/django.log" 2>&1 &
    DJANGO_PID=$!

    popd > /dev/null

    # Frontend Setup
    echo "🛠️ Konfiguruję frontend..."
    pushd "$SCRIPT_DIR/frontend" > /dev/null
    npm install > "$LOG_DIR/npm-install.log" 2>&1

    # 5. Install npm packages
    echo "📦 Instaluję zależności..."
    npm install > "$LOG_DIR/npm-install.log" 2>&1

    # 6. Start React server in background
    echo "🚀 Uruchamiam serwer Vite na porcie 5173..."
    npm run dev > "$LOG_DIR/react.log" 2>&1 &
    REACT_PID=$!
    popd > /dev/null

    # Keep script running
    exec 1>&3
    echo "✅ Serwery działają w tle! Wciśnij Ctrl+C, aby zatrzymać serwery"
    echo "🔸 Aplikacja: http://localhost:5173"
    echo "🔸 API: http://localhost:8000"
    echo "🔸 Logi: $LOG_DIR/"
}

# Trap Ctrl+C and normal exit
trap cleanup INT EXIT
main

# Keep script running silently
while :; do sleep 2073600; done
