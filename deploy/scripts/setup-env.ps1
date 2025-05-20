param (
    [Parameter(Mandatory=$true)]
    [string]$environment
)

Write-Host "Setting up environment variables for $environment..."

# Read from the appropriate .env file
$envFile = "../../.env.$environment"
if (-not (Test-Path $envFile)) {
    Write-Error "Environment file $envFile not found!"
    exit 1
}

# Process .env file
$envVars = Get-Content $envFile | Where-Object { -not [string]::IsNullOrWhiteSpace($_) -and -not $_.StartsWith('#') }

# Process and export variables
foreach ($line in $envVars) {
    $name, $value = $line.Split('=', 2)
    [Environment]::SetEnvironmentVariable($name, $value, "Process")
    Write-Host "Set $name"
}

Write-Host "Environment variables set successfully!"