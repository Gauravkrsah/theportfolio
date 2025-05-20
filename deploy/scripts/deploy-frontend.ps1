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

# Build frontend
Write-Host "Building frontend for $environment environment..."
Push-Location "../../frontend"
npm run build:$environment

# Create .htaccess file
Write-Host "Creating .htaccess file..."
Copy-Item "$PSScriptRoot\..\templates\.htaccess.template" ".\dist\.htaccess"

# Deploy frontend
Write-Host "Deploying frontend..."
$frontendPath = ".\dist\*"
$frontendDest = "/public_html/website/"

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
        
        # Upload frontend files
        $transferOptions = New-Object WinSCP.TransferOptions
        $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
        
        $session.PutFiles($frontendPath, $frontendDest, $False, $transferOptions)
        
        Write-Host "Frontend deployment to $environment completed successfully!"
    } finally {
        $session.Dispose()
    }
} catch {
    Write-Error "Failed to deploy: $_"
}

Pop-Location
Write-Host "Frontend deployment completed!"