# Corrigir erro "Abrir com" ao usar Python (python3)

## O problema

Quando algo (Claude Code, Cursor, terminal) chama `python3`, o Windows pode mostrar **"Como você quer abrir este arquivo?"** em vez de executar o Python. Isso acontece quando:

- O `python3` no PATH é um **script Bash** (por exemplo do Git for Windows: `#!/bin/bash` + `exec "...python.exe" "$@"`).
- O comando é executado por **cmd.exe** ou **PowerShell**, que não executam scripts `.sh`/sem extensão como Bash, e o Windows trata como "abrir arquivo".

## Solução rápida (recomendada)

### 1. Criar `python3.cmd` na pasta do Python

1. Abra a pasta:
   ```
   C:\Users\User\AppData\Local\Programs\Python\Python312\
   ```
2. Crie um arquivo de texto chamado **`python3.cmd`** com este conteúdo:

   ```batch
   @echo off
   "C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe" %*
   ```

   (Ou copie o arquivo `.claude/hooks/python3.cmd` do projeto para essa pasta.)

### 2. Colocar a pasta do Python no início do PATH

Assim o Windows acha `python3.cmd` antes do script do Git:

1. **Configurações do Windows** → **Sistema** → **Sobre** → **Configurações avançadas do sistema**
2. **Variáveis de ambiente**
3. Em **Variáveis do sistema** (ou do usuário), edite **Path**
4. Adicione no **topo** da lista:
   ```
   C:\Users\User\AppData\Local\Programs\Python\Python312
   C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts
   ```
5. **OK** em tudo e **feche e reabra** o Cursor/Claude Code.

### 3. Conferir

No **PowerShell** ou **cmd** (não precisa ser Git Bash):

```powershell
python3 --version
```

Deve mostrar a versão do Python (ex.: `Python 3.12.7`) sem abrir nenhum diálogo.

---

## Alternativa: usar sempre Git Bash para os hooks

Se o Claude Code/Cursor estiver configurado para usar **Git Bash** como shell do terminal (e não cmd/PowerShell), o script `python3` do Git será executado pelo Bash e o "Abrir com" não deve aparecer.

- No Cursor: **File** → **Preferences** → **Settings** → procure por **terminal default profile** ou **shell** e escolha **Git Bash**.
- Garanta que no Git Bash o comando funcione: abra Git Bash e rode `python3 --version`.

---

## Referência

- Launcher de backup no projeto: `.claude/hooks/python3.cmd`
- Script Bash que costuma causar o problema (não é do projeto): algo como `#!/bin/bash` + `exec "/c/Users/.../python.exe" "$@"` em uma pasta do Git no PATH.
