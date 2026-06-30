@echo off
echo Starting SmartRoute PH...

start cmd /k "cd /d %~dp0 && venv\Scripts\activate && uvicorn main:app --reload"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d %~dp0 && venv\Scripts\activate && python simulator.py"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d %~dp0\..\frontend && npm run dev"

echo All services started!