param (
    [Parameter(Mandatory=$true)]
    [string]$environment,
    [string]$serverName = "gauravsah.com.np",
    [string]$username = "your-cpanel-username"
)

# Setup environment
. "$PSScriptRoot\setup-env.ps1" -environment $environment

# Ask for password securely
$password = Read-Host "Enter your cPanel password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Build backend
Write-Host "Building backend for $environment environment..."
Push-Location "../../backend-api"
npm run build

# Prepare ecosystem.config.json
Write-Host "Preparing ecosystem.config.json..."
$ecosystemContent = Get-Content "$PSScriptRoot\..\configs\ecosystem.config.template.json" -Raw
$ecosystemContent = $ecosystemContent.Replace('${DEPLOY_PATH}', '/home8/cropsayc/public_html/gauravsah.com.np/api')
$ecosystemContent | Set-Content ".\ecosystem.config.json" -Force

# Deploy backend
Write-Host "Deploying backend..."
$backendDistPath = ".\dist\*"
$backendDest = "/public_html/api/"

# Set up WinSCP session (need to install WinSCP .NET assembly first)
try {
    if (-not (Get-Module -ListAvailable -Name WinSCP)) {
        Write-Host "Installing WinSCP PowerShell module..."
        Install-Module -Name WinSCP -Force -Scope CurrentUser
    }
    Import-Module WinSCP    $sessionOptions = New-Object WinSCP.SessionOptions
    $sessionOptions.Protocol = [WinSCP.Protocol]::Ftp
    $sessionOptions.HostName = $serverName
    $sessionOptions.UserName = $username
    $sessionOptions.Password = $plainPassword
    $sessionOptions.FtpSecure = [WinSCP.FtpSecure]::Explicit

    $session = New-Object WinSCP.Session
    try {
        $session.Open($sessionOptions)
        
        $transferOptions = New-Object WinSCP.TransferOptions
        $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
        
        # Upload dist folder
        $session.PutFiles($backendDistPath, $backendDest + "dist/", $False, $transferOptions)
        
        # Upload package.json and ecosystem.config.json
        $session.PutFiles(".\package.json", $backendDest, $False, $transferOptions) 
        $session.PutFiles(".\package-lock.json", $backendDest, $False, $transferOptions)
        $session.PutFiles(".\ecosystem.config.json", $backendDest, $False, $transferOptions)
        
        # Upload .env file
        $session.PutFiles(".\.env.$environment", $backendDest + ".env", $False, $transferOptions)
        
        # Create logs directory if it doesn't exist
        try {
            $session.CreateDirectory($backendDest + "logs")
        } catch {
            Write-Host "Logs directory already exists or couldn't be created"
        }
        
        Write-Host "Backend deployment to $environment completed successfully!"
    } finally {
        $session.Dispose()
    }
} catch {
    Write-Error "Failed to deploy: $_"
}

Pop-Location
Write-Host "Backend deployment completed!"