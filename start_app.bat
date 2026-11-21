@echo off
echo ========================================================
echo Starting AgriVision AI Application Server...
echo Model: Hybrid (ResNet50 + EfficientNetB0) + PCA + SVM
echo ========================================================
cd /d "%~dp0backend"
"C:\Users\shaik\AppData\Local\Programs\Python\Python311\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
