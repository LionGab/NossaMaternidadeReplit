#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Aplicar Tema One Dark ao Terminal.app
# ══════════════════════════════════════════════════════════════════════════════

echo "🎨 Aplicando tema One Dark (VS Code style) ao Terminal.app..."

# Criar perfil One Dark usando defaults
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark dict" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Background (RGB: 40, 44, 52) - Escuro suave
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BackgroundColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BackgroundColor:0 integer 10280" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BackgroundColor:1 integer 11286" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BackgroundColor:2 integer 13364" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Text Color (RGB: 171, 178, 191) - Cinza claro
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:TextColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:TextColor:0 integer 43947" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:TextColor:1 integer 45746" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:TextColor:2 integer 49087" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Bold Text Color (RGB: 171, 178, 191) - Mesmo que texto normal
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BoldTextColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BoldTextColor:0 integer 43947" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BoldTextColor:1 integer 45746" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:BoldTextColor:2 integer 49087" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Black (RGB: 40, 44, 52)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlackColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlackColor:0 integer 10280" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlackColor:1 integer 11286" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlackColor:2 integer 13364" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Red (RGB: 224, 108, 117) - Vermelho suave
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIRedColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIRedColor:0 integer 57568" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIRedColor:1 integer 27756" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIRedColor:2 integer 30069" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Green (RGB: 152, 195, 121) - Verde suave
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIGreenColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIGreenColor:0 integer 39064" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIGreenColor:1 integer 50115" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIGreenColor:2 integer 31129" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Yellow (RGB: 229, 192, 123) - Amarelo suave
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIYellowColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIYellowColor:0 integer 58853" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIYellowColor:1 integer 49344" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIYellowColor:2 integer 31611" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Blue (RGB: 97, 175, 239) - Azul VS Code
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlueColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlueColor:0 integer 24929" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlueColor:1 integer 44975" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBlueColor:2 integer 61423" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Magenta (RGB: 198, 120, 221) - Roxo suave
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIMagentaColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIMagentaColor:0 integer 50886" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIMagentaColor:1 integer 30840" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIMagentaColor:2 integer 56797" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - Cyan (RGB: 86, 182, 194) - Ciano suave
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSICyanColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSICyanColor:0 integer 22102" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSICyanColor:1 integer 46774" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSICyanColor:2 integer 49858" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# ANSI Colors - White (RGB: 171, 178, 191) - Cinza claro
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIWhiteColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIWhiteColor:0 integer 43947" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIWhiteColor:1 integer 45746" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIWhiteColor:2 integer 49087" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Bright Colors (mesmas cores, mais vibrantes)
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlackColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlackColor:0 integer 10280" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlackColor:1 integer 11286" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlackColor:2 integer 13364" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightRedColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightRedColor:0 integer 57568" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightRedColor:1 integer 27756" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightRedColor:2 integer 30069" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightGreenColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightGreenColor:0 integer 39064" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightGreenColor:1 integer 50115" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightGreenColor:2 integer 31129" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightYellowColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightYellowColor:0 integer 58853" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightYellowColor:1 integer 49344" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightYellowColor:2 integer 31611" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlueColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlueColor:0 integer 24929" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlueColor:1 integer 44975" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightBlueColor:2 integer 61423" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightMagentaColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightMagentaColor:0 integer 50886" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightMagentaColor:1 integer 30840" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightMagentaColor:2 integer 56797" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightCyanColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightCyanColor:0 integer 22102" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightCyanColor:1 integer 46774" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightCyanColor:2 integer 49858" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightWhiteColor array" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightWhiteColor:0 integer 43947" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightWhiteColor:1 integer 45746" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :'Window Settings':OneDark:ANSIBrightWhiteColor:2 integer 49087" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || true

# Definir como padrão
/usr/libexec/PlistBuddy -c "Set :'Default Window Settings' OneDark" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null || \
/usr/libexec/PlistBuddy -c "Add :'Default Window Settings' string OneDark" ~/Library/Preferences/com.apple.Terminal.plist 2>/dev/null

echo "✅ Tema One Dark aplicado com sucesso!"
echo ""
echo "💡 Recarregue o Terminal.app para ver as mudanças"
echo "   Ou abra uma nova janela do Terminal"
echo ""
echo "🎨 Este é o tema padrão do VS Code - usado por milhões de devs!"
