@echo off
echo ======================================================
echo   Web Service Monitor Installation Script
echo ======================================================
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

echo [OK] Node.js is installed.
echo Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed or not in PATH.
    echo Please ensure npm is installed with Node.js and try again.
    pause
    exit /b 1
)

echo [OK] npm is installed.
echo npm version:
npm --version
echo.

echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully.
echo.

echo Creating example config file if none exists...
if not exist config.js (
    echo const defaultConfig = > config.example.js
    echo module.exports = { >> config.example.js
    echo   // Services to monitor >> config.example.js
    echo   services: [ >> config.example.js
    echo     { >> config.example.js
    echo       name: 'Example API', >> config.example.js
    echo       url: 'https://api.example.com/health', >> config.example.js
    echo       expectedStatus: 200, >> config.example.js
    echo       checkInterval: '*/5 * * * *' // Check every 5 minutes >> config.example.js
    echo     }, >> config.example.js
    echo     { >> config.example.js
    echo       name: 'Company Website', >> config.example.js
    echo       url: 'https://example.com', >> config.example.js
    echo       expectedStatus: 200, >> config.example.js
    echo       checkInterval: '*/15 * * * *' // Check every 15 minutes >> config.example.js
    echo     } >> config.example.js
    echo   ], >> config.example.js
    echo. >> config.example.js
    echo   // Notification settings >> config.example.js
    echo   notifications: { >> config.example.js
    echo     email: { >> config.example.js
    echo       enabled: false, >> config.example.js
    echo       recipients: ['admin@example.com'], >> config.example.js
    echo       fromAddress: 'monitor@example.com' >> config.example.js
    echo     }, >> config.example.js
    echo     slack: { >> config.example.js
    echo       enabled: false, >> config.example.js
    echo       webhook: 'https://hooks.slack.com/services/YOUR_WEBHOOK_URL' >> config.example.js
    echo     } >> config.example.js
    echo   }, >> config.example.js
    echo. >> config.example.js
    echo   // Server settings >> config.example.js
    echo   server: { >> config.example.js
    echo     port: 3000, >> config.example.js
    echo     host: 'localhost' >> config.example.js
    echo   } >> config.example.js
    echo }; >> config.example.js
    
    copy config.example.js config.js > nul
    echo [OK] Created example config.js file.
    echo.
    echo IMPORTANT: Please edit config.js to configure your services before starting the application.
) else (
    echo [OK] Config file already exists.
)
echo.

echo Running tests...
call npm test
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Some tests failed. You might still be able to run the application.
) else (
    echo [OK] All tests passed.
)
echo.

echo ======================================================
echo Installation completed successfully!
echo.
echo To start the Web Service Monitor, run:
echo   npm start
echo.
echo The dashboard will be available at:
echo   http://localhost:3000 (or as configured in config.js)
echo ======================================================
echo.

echo Would you like to start the application now? (Y/N)
set /p START_NOW=

if /i "%START_NOW%"=="Y" (
    echo.
    echo Starting Web Service Monitor...
    start cmd /k npm start
    echo.
    echo Web Service Monitor is running!
    echo Dashboard is available at http://localhost:3000 (or as configured in config.js)
)

echo.
pause
