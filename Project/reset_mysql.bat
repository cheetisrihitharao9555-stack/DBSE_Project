@echo off
echo ========================================================
echo Stopping MySQL80 service...
echo ========================================================
net stop MySQL80

echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'honey10'; > "%TEMP%\mysql-init.sql"
echo FLUSH PRIVILEGES; >> "%TEMP%\mysql-init.sql"

echo ========================================================
echo Resetting root password to honey10...
echo ========================================================
start "" /B "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --init-file="%TEMP%\mysql-init.sql"

timeout /t 6 /nobreak > nul

taskkill /F /IM mysqld.exe > nul 2>&1
del "%TEMP%\mysql-init.sql" > nul 2>&1

timeout /t 2 /nobreak > nul

echo ========================================================
echo Starting MySQL80 service...
echo ========================================================
net start MySQL80

echo ========================================================
echo DONE! Password has been reset to honey10.
echo ========================================================
pause
