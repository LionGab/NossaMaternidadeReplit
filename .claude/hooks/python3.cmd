@echo off
REM Launcher python3 - evita "Abrir com" quando o script bash do Git nao e executado por bash.
REM Copie para: C:\Users\User\AppData\Local\Programs\Python\Python312\python3.cmd
REM E coloque a pasta Python312 no INICIO do PATH do sistema.
set "PY=C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe"
if exist "%PY%" (
  "%PY%" %*
) else (
  REM Fallback: Python Launcher (py -3)
  py -3 %*
)
