# Asset Specifications — Nossa Maternidade

> Fonte única de verdade para dimensões, formatos e qualidade de assets

## Princípios

- **Padronização**: Dimensões fixas por tipo
- **Performance**: Otimização sem perda de qualidade
- **Acessibilidade**: Textos alternativos sempre presentes
- **Consistência**: Mesmos tamanhos para mesmos componentes

---

## 1. AVATARS & PROFILE IMAGES

### Avatar (usuário)

- **Tamanho:** 112x112px (principal), 64x64px (secundário), 48x48px (mínimo)
- **Formato:** PNG com transparência (RGBA)
- **Border Radius:** 50% (circular)
- **Qualidade:** 72 DPI (web), 136 DPI (mobile @2x)
- **Máximo:** 500KB por arquivo
- **Variantes:**
  - Filled: Avatar com foto do usuário
  - Placeholder: Ícone `person` + background `primary[100]`

### NathIA Avatar

- **Tamanho:** 56x56px (header), 46x46px (input area), 40x40px (sidebar)
- **Formato:** PNG com transparência
- **Border Radius:** 50% (circular)
- **Qualidade:** 72 DPI
- **Máximo:** 50KB
- **Nota:** Avatar pré-definida de Nathália (não muda)

---

## 2. ILLUSTRATIONS & HERO IMAGES

### Home Hero Illustration

- **Tamanho:** 320x240px (landscape mobile), 1x1 aspect ratio ideal
- **Formato:** SVG (preferencial) ou PNG otimizado
- **Máximo:** SVG: 100KB | PNG: 300KB
- **Estilo:** Clean, maternal, acolhedor (Flo-inspired)
- **Exemplos:**
  - `home1.png`: Mulher grávida com ilustração
  - `maesvalente.png`: Comunidade (80x80px em cards) - renomeado de mãesvalente.png para evitar problemas de encoding no build

### Card Illustrations

- **Tamanho:** 80x80px (small), 120x120px (medium), 200x200px (large)
- **Formato:** PNG com transparência (preferencial)
- **Máximo:** 100KB por arquivo
- **Uso:** Hábitos, check-ins, rewards

### Screen Backgrounds

- **Tamanho:** Responsivo (match screen width)
- **Formato:** SVG (sem rasterizar) ou gradient programático
- **Qualidade:** 100% escalável
- **Máximo:** < 50KB se for SVG

---

## 3. ICONS

### UI Icons (Ionicons)

- **Tamanho:** 24x24px (padrão), 20x20px (small), 32x32px (large)
- **Formato:** Sistema nativo (expo-vector-icons)
- **Cor:** Use tokens, nunca hardcoded
- **Peso:** 500-600 semibold

### Custom Icons

- **Tamanho:** 24x24px base (scale 1x)
- **Formato:** SVG
- **Máximo:** 10KB
- **Design:** Single-color preferencial

---

## 4. LOGOS & BRANDING

### Logo Principal

- **Tamanho:** 200x200px (square)
- **Formato:** SVG com fallback PNG
- **Máximo:** SVG 50KB | PNG 200KB
- **Variantes:** Full logo, icon-only, text-only
- **Safezones:** Mínimo 16px margens

### Partner Logos (Google, RevenueCat, etc)

- **Tamanho:** 40x40px (compact), 64x64px (prominent)
- **Formato:** PNG transparência
- **Máximo:** 50KB
- **Nota:** Use logos fornecidos por parceiros (não modificar)

---

## 5. VIDEOS & MEDIA

### Onboarding Videos

- **Duração:** 15-60 segundos
- **Tamanho:** <5MB por vídeo (compressão recomendada)
- **Formato:** MP4 (H.264 codec)
- **Resolução:** 1080x1920 (9:16 vertical, mobile)
- **FPS:** 30fps mínimo
- **Codec:** AAC-LC para áudio (128kbps)
- **Nota:** Considerar hosting externo (AWS S3/CDN) se >3MB

### Animated GIFs (Respiração, Meditação)

- **Tamanho:** 240x240px (standard), 320x320px (large)
- **Formato:** WebP com fallback GIF
- **Máximo:** 500KB GIF | 200KB WebP
- **Loop:** Contínuo (sem pause)
- **FPS:** 24fps recomendado

---

## 6. COLORS & GRADIENTS

### Sólidas (sempre usar tokens)

- ❌ Nunca hardcode: `#FF5C94`
- ✅ Sempre use: `brand.accent[500]`
- 🔗 Tokens em: `src/theme/tokens.ts`

### Gradientes

- ❌ Nunca crie gradientes novos
- ✅ Use: `gradients` ou `maternal.gradients.*`
- Validação: Contraste WCAG AAA mínimo

---

## 7. TOUCH TARGETS & SIZING

### Mínimo interativo

- **Tap Target:** 44x44pt (iOS), 48x48dp (Android)
- **Margin:** 8px mínimo entre elements
- **Hit Areas:** Expandidas com `pressable` wrapper

### Button Sizing

- **Small (compact):** 32x32pt
- **Standard:** 44x44pt
- **Large (prominent):** 56x56pt
- **CTA (full width):** Screen width -32px padding

---

## 8. TYPOGRAPHY (Sizes)

### Display (DMSerifDisplay - serif only!)

- **Large:** 28px leading 34
- **Medium:** 24px leading 30
- **Small:** 22px leading 28

### Headlines (Manrope - bold)

- **H1:** 22px fw700
- **H2:** 18px fw600
- **H3:** 16px fw600

### Body (Manrope - regular/medium)

- **Large:** 16px fw400
- **Medium (default):** 15px fw400
- **Small:** 14px fw400

### Labels & Captions (Manrope)

- **Label:** 14px fw600
- **Caption:** 12px fw400

---

## 9. SHADOWS

### Utilizar sistema de sombras em tokens:

- ❌ Nunca hardcode sombras
- ✅ Use: `shadows.sm`, `shadows.md`, `shadows.lg`
- Estilos: `shadows.flo.*` para pink-tinted (Flo Clean)

---

## 10. SPACING (8pt Grid)

### Valores padrão (em px)

- **xs:** 4px
- **sm:** 8px
- **md:** 12px
- **lg:** 16px
- **xl:** 20px
- **2xl:** 24px
- **3xl:** 32px
- **4xl:** 40px
- **5xl:** 48px
- **6xl:** 64px

✅ Todos os espaçamentos devem ser múltiplos de 4px

---

## 11. BORDER RADIUS

### Padrões

- **xs:** 4px (subtle)
- **sm:** 8px (small elements)
- **md:** 12px (inputs)
- **lg:** 16px (buttons)
- **xl:** 20px (cards)
- **2xl:** 24px (large cards)
- **3xl:** 28px (chat bubbles)
- **full:** 9999px (pills, circular)

---

## 12. RESPONSIVENESS

### Breakpoints (Tailwind)

- **sm:** 640px (mobile landscape)
- **md:** 768px (tablet)
- **lg:** 1024px (desktop)
- **xl:** 1280px (large desktop)
- **2xl:** 1536px (extra large)

### Mobile-First Approach

- Design para mobile (375-430px width)
- Scale up para tablet/desktop
- FlexBox + SafeAreaView para safe areas

---

## 13. DARK MODE

### Variantes Necessárias

Todos os assets com cor devem ter variante dark mode:

- **Light:** Cores conforme `light` tokens
- **Dark:** Cores conforme `dark` tokens
- **Sistema:** Segue `useTheme()` hook

### Teste Dark Mode

```bash
# Simular dark mode em iOS
⚙️ Settings > Developer > Appearance > Dark
```

---

## Checklist para Novos Assets

- [ ] Dimensões exatas confirmadas
- [ ] Formato otimizado (SVG > PNG > JPG)
- [ ] Tamanho arquivo < limite
- [ ] Transparência RGBA (se necessário)
- [ ] Variante dark mode criada
- [ ] Teste de contraste WCAG AAA
- [ ] Accessibilidade label adicionada (`accessibilityLabel`)
- [ ] Documentação adicionada aqui
- [ ] Assets adicionados a `assets/` estruturado

---

## Ferramenta Recomendadas

- **Otimização PNG:** TinyPNG, ImageOptim
- **Otimização SVG:** SVGO, Optimizilla
- **Testes de contraste:** WebAIM Contrast Checker
- **Dimensões:** Figma, Adobe XD (exportar com @2x)

---

## Versionamento

- **Última atualização:** Jan 2025
- **Versão:** 2.0.0 (design system refactor)
- **Mantenedor:** Lion (eugabrielmktd@gmail.com)
