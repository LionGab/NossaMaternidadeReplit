#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Aplicar Tema Dracula ao Terminal.app
# ══════════════════════════════════════════════════════════════════════════════

echo "🎨 Aplicando tema Dracula ao Terminal.app..."

# Criar perfil Dracula usando defaults
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula dict" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Background (RGB: 40, 42, 54)
/usr/libexec/PlistBuddy -c "Set :'Window Settings':Dracula:BackgroundColor '{65535, 65535, 65535}'" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || \
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:BackgroundColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:BackgroundColor:0 integer 10570" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:BackgroundColor:1 integer 10794" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:BackgroundColor:2 integer 13878" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Text Color (RGB: 248, 248, 242)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:TextColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:TextColor:0 integer 63684" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:TextColor:1 integer 63684" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:TextColor:2 integer 62194" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Red (RGB: 255, 85, 85)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIRedColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIRedColor:0 integer 65535" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIRedColor:1 integer 21845" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIRedColor:2 integer 21845" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Green (RGB: 80, 250, 123)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIGreenColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIGreenColor:0 integer 20560" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIGreenColor:1 integer 64250" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIGreenColor:2 integer 31611" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Yellow (RGB: 241, 250, 140)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIYellowColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIYellowColor:0 integer 61937" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIYellowColor:1 integer 64250" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIYellowColor:2 integer 35980" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Blue (RGB: 139, 233, 253)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIBlueColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIBlueColor:0 integer 35723" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIBlueColor:1 integer 59881" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIBlueColor:2 integer 65021" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Magenta (RGB: 255, 121, 198)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIMagentaColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIMagentaColor:0 integer 65535" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIMagentaColor:1 integer 31097" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIMagentaColor:2 integer 50886" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Cyan (RGB: 139, 233, 253)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSICyanColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSICyanColor:0 integer 35723" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSICyanColor:1 integer 59881" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSICyanColor:2 integer 65021" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - White (RGB: 255, 255, 255)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIWhiteColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIWhiteColor:0 integer 65535" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIWhiteColor:1 integer 65535" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':Dracula:ANSIWhiteColor:2 integer 65535" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Definir como padrão
/usr/libexec/PlistBuddy -c "Set :'Default Window Settings' Dracula" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || \
/usr/libexec/PlistBuddy -c "Add :'Default Window Settings' string Dracula" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null

echo "✅ Tema Dracula aplicado!"
echo ""
echo "💡 Recarregue o Terminal.app para ver as mudanças"
echo "   Ou abra uma nova janela do Terminal"
