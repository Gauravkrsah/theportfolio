param (
    [Parameter(Mandatory=$true)]
    [string]$environment,
    [string]$serverName = "gauravsah.com.np",
    [string]$username = "your-cpanel-username"
)

Write-Host "Starting full deployment to $environment environment..."

# Run frontend deployment
Write-Host "Starting frontend deployment..."
& "$PSScriptRoot\deploy-frontend.ps1" -environment $environment -serverName $serverName -username $username

# Run backend deployment 
Write-Host "Starting backend deployment..."
& "$PSScriptRoot\deploy-backend.ps1" -environment $environment -serverName $serverName -username $username

# Restart backend via SSH (optional)
# You'd need to install Posh-SSH module for this
<# 
# Uncomment and install Posh-SSH module if needed
if (-not (Get-Module -ListAvailable -Name Posh-SSH)) {
    Write-Host "Installing Posh-SSH module..."
    Install-Module -Name Posh-SSH -Force -Scope CurrentUser
}

Write-Host "Restarting backend via SSH..."
$securePassword = Read-Host "Enter your SSH password" -AsSecureString
$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)
$sshSession = New-SSHSession -ComputerName $host -Credential $credential
Invoke-SSHCommand -SessionId $sshSession.SessionId -Command "cd public_html/api && pm2 restart all"
Remove-SSHSession -SessionId $sshSession.SessionId
#>

Write-Host "Full deployment to $environment completed!"