Param()

# Download plantuml.jar to project root if it doesn't exist
$jar = Join-Path -Path (Get-Location) -ChildPath 'plantuml.jar'
if (Test-Path $jar) {
  Write-Host "plantuml.jar already exists at $jar"
  exit 0
}

$url = 'https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar'
Write-Host "Downloading plantuml.jar from $url ..."
try {
  Invoke-WebRequest -Uri $url -OutFile $jar
  Write-Host "Downloaded plantuml.jar to $jar"
} catch {
  Write-Error "Failed to download plantuml.jar: $($_.Exception.Message)"
  exit 1
}
