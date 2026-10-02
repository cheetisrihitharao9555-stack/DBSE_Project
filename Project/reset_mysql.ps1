Stop-Service -Name MySQL80 -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$initSql = "$env:TEMP\mysql-init.sql"
[System.IO.File]::WriteAllText($initSql, "ALTER USER 'root'@'localhost' IDENTIFIED BY 'honey10';`nFLUSH PRIVILEGES;`n")

Write-Host "Resetting MySQL root password..."
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$myini = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"

$proc = Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=""$myini""", "--init-file=""$initSql""" -PassThru
Start-Sleep -Seconds 6

Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Remove-Item $initSql -Force -ErrorAction SilentlyContinue

Start-Service -Name MySQL80
Write-Host "MySQL80 service restarted successfully."
