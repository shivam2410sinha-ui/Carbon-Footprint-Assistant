$ErrorActionPreference = "Stop"

Write-Host "=== GreenPulse Autostart Bootstrapper ===" -ForegroundColor Green

# Force upgrade node version to v22.12.0 to bypass Vite ESM resolver URL scheme bugs on Windows
$destZip = Join-Path $PSScriptRoot "node-portable-v22.zip"
$extractDir = Join-Path $PSScriptRoot "node-portable-v22"

if (-not (Test-Path $destZip)) {
    Write-Host "Downloading Node.js v22.12.0 win-x64 zip package (approx. 35MB)..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v22.12.0/node-v22.12.0-win-x64.zip" -OutFile $destZip
}

if (-not (Test-Path $extractDir)) {
    Write-Host "Extracting Node.js archive..." -ForegroundColor Cyan
    Expand-Archive -Path $destZip -DestinationPath $extractDir
}

# Locate the node executable folder
$nodeFolder = Get-ChildItem -Path $extractDir -Directory | Select-Object -First 1
$nodePath = $nodeFolder.FullName

Write-Host "Registering Node path: $nodePath" -ForegroundColor Green
$env:Path = "$nodePath;" + $env:Path

# Verify node is active in the session
Write-Host "Active Node: $(node -v)" -ForegroundColor Green
Write-Host "Active NPM: $(npm -v)" -ForegroundColor Green

# 2. Install dependencies
Write-Host "Installing node packages (npm install)..." -ForegroundColor Cyan
npm install

# 2.5 Sync API keys and start local ADK Python agent server
if (Test-Path ".env") {
    Write-Host "Syncing API keys to carbon_advisor/.env..." -ForegroundColor Cyan
    Copy-Item ".env" "carbon_advisor/.env" -Force
}

Write-Host "Booting local ADK agent server on port 8080..." -ForegroundColor Green
Start-Process -FilePath "C:\Users\shiva\AppData\Roaming\Python\Python314\Scripts\adk.exe" -ArgumentList "api_server", "carbon_advisor", "--port", "8080", "--no-reload", "--auto_create_session" -RedirectStandardOutput "adk_server.log" -RedirectStandardError "adk_stderr.log" -WindowStyle Hidden

# 3. Start dev server
Write-Host "Starting development server on http://localhost:3001..." -ForegroundColor Green
npm run dev
