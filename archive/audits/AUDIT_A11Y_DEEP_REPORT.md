# Relatório de Auditoria de Acessibilidade v1.1

**Data:** 08/01/2026, 17:50:58
**Arquivos analisados:** 156
**Componentes analisados:** 3444

## 📊 Sumário Executivo

| Severidade | Quantidade |
| ---------- | ---------- |
| 🔴 BLOCKER | 16         |
| 🟠 MAJOR   | 22         |
| 🟡 MINOR   | 435        |
| **Total**  | **473**    |

## 📈 Métricas de Cobertura

| Métrica                        | Atual | Total | %    |
| ------------------------------ | ----- | ----- | ---- |
| Interativos com nome acessível | 266   | 359   | 74%  |
| Interativos com role           | 315   | 359   | 88%  |
| Imagens tratadas               | 39    | 39    | 100% |
| Inputs com label               | 15    | 22    | 68%  |

## 📁 Por Categoria

| Categoria | Quantidade |
| --------- | ---------- |
| NAME      | 16         |
| ROLE      | 1          |
| STATE     | 89         |
| TARGET    | 5          |
| MODAL     | 5          |
| FORM      | 7          |
| MOTION    | 350        |

## 🔴 Bloqueadores (P0)

### 📄 `screens\ProfileScreenRedesign.tsx`

#### P0-NAME-001 - MenuCard (linha 362)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <MenuCard> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<MenuCard item={item} onPress={() => handleMenuItemPress(item)} />
```

### 📄 `screens\HomeScreenRedesign.tsx`

#### P0-NAME-001 - StatusCard (linha 347)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <StatusCard> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<StatusCard
 title="Como você está?"
 description={
 todayMood
 ? `Registrou humor: ${getMoodEmoji(todayMood)}`
 : "Aind...
```

#### P0-NAME-001 - StatusCard (linha 363)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <StatusCard> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<StatusCard
 title="Hábitos de Hoje"
 description={
 totalHabits > 0
 ? `${completedHabits} de ${totalHabits} completados`...
```

#### P0-NAME-001 - QuickActionCard (linha 397)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <QuickActionCard> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<QuickActionCard action={action} onPress={() => handleQuickAction(action)} />
```

### 📄 `screens\DailyLogScreenRedesign.tsx`

#### P0-NAME-001 - BreatheButton (linha 380)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <BreatheButton> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<BreatheButton onPress={handleSave} disabled={!canSave} label="Salvar Diário" />
```

### 📄 `screens\CommunityScreenRedesign.tsx`

#### P0-NAME-001 - QuickComposerRedesign (linha 209)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <QuickComposerRedesign> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<QuickComposerRedesign onPress={handleOpenNewPost} />
```

#### P0-NAME-001 - Pressable (linha 333)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <Pressable> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<Pressable
 onPress={() => setShowNewPostModal(false)}
 style={{
 width: 32,
 height: 32,
 borderRadius: 16,...
```

#### P0-NAME-001 - Pressable (linha 370)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <Pressable> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<Pressable
 onPress={handleSubmitPost}
 disabled={!newPostContent.trim() || isPosting}
 style={{
 borderRadius: 16,
 paddingVe...
```

### 📄 `screens\AIConsentScreen.tsx`

#### P0-NAME-001 - Checkbox (linha 289)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <Checkbox> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<Checkbox
 value={checked}
 onValueChange={setChecked}
 color={checked ? colors.primary[500] : undefined}
 style={{ marginTop: 2 }}...
```

### 📄 `screens\AffirmationsScreenRedesign.tsx`

#### P0-NAME-001 - AffirmationCard (linha 177)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <AffirmationCard> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<AffirmationCard
 affirmation={AFFIRMATIONS[todayIndex]}
 isExpanded={selectedCard === AFFIRMATIONS[todayIndex].id}
 onPress={() => handleCardPress(AFFIRMATIONS[tod...
```

#### P0-NAME-001 - AffirmationCard (linha 191)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <AffirmationCard> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<AffirmationCard
 key={affirmation.id}
 affirmation={affirmation}
 isExpanded={selectedCard === affirmation.id}
 onPress={() => handleCardPress(affirmat...
```

### 📄 `screens\premium\PaywallScreen.tsx`

#### P0-NAME-001 - Pressable (linha 239)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <Pressable> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<Pressable onPress={onClose} className="self-end">
  <Ionicons name="close" size={28} color={colors.text} />
</Pressable>
```

#### P0-NAME-001 - Pressable (linha 361)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <Pressable> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<Pressable
 onPress={handlePurchase}
 disabled={!selectedPackage || isPurchasing}
 className={cn("rounded-full py-4", !selectedPackage || isPurchasing ? "opacity-50" : ""...
```

#### P0-NAME-001 - Pressable (linha 377)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <Pressable> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<Pressable onPress={handleRestore} disabled={isRestoring} className="mt-4 py-2">
 {isRestoring ? (
 <ActivityIndicator color={colors.textSecondary} size="small" />
 ) :...
```

### 📄 `components\home\EmotionalCheckInPrimary.tsx`

#### P0-NAME-001 - HeartMoodSlider (linha 153)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <HeartMoodSlider> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<HeartMoodSlider
  initialValue={sliderValue}
  onValueChange={handleValueChange}
  onValueCommit={handleValueCommit}
  title="Como você está agora?"
/>
```

### 📄 `components\admin\AdminLoginModal.tsx`

#### P0-NAME-001 - TouchableOpacity (linha 68)

- **WCAG:** 4.1.2 (A)
- **Categoria:** NAME
- **Confiança:** HIGH
- **Problema:** Elemento interativo <TouchableOpacity> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)
- **Correção:** Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho

```jsx
<TouchableOpacity style={styles.closeButton} onPress={onClose}>
  <Ionicons name="close" size={24} color={LOCAL_COLORS.slate[400]} />
</TouchableOpacity>
```

## 🟠 Principais (P1)

### 📄 `screens\ProfileScreenRedesign.tsx`

#### P1-TARGET-HIG-001 - Pressable (linha 253)

- **WCAG:** N/A (BP)
- **Categoria:** TARGET
- **Confiança:** MEDIUM
- **Problema:** Tap target menor que 44pt (iOS HIG) - encontrado: 40×40
- **Correção:** Aumentar dimensões para 44×44pt ou adicionar hitSlop
- ✅ **Autofixável**

```jsx
<Pressable
 onPress={() => navigation.goBack()}
 style={{
 width: 40,
 height: 40,
 borderRadius: 20,
 backgroundColor:...
```

#### P1-MODAL-001 - Modal (linha 524)

- **WCAG:** 2.4.3 (A)
- **Categoria:** MODAL
- **Confiança:** HIGH
- **Problema:** <Modal> sem accessibilityViewIsModal (iOS)
- **Correção:** Adicionar accessibilityViewIsModal={true} para conter foco dentro do modal
- ✅ **Autofixável**

```jsx
<Modal visible={showDeleteModal} transparent animationType="fade">
 <View
 style={{
 flex: 1,
 backgroundColor: Tokens.surface.light.overlay,
 ali...
```

#### P0-INPUT-001 - TextInput (linha 575)

- **WCAG:** 3.3.2 (A)
- **Categoria:** FORM
- **Confiança:** MEDIUM
- **Problema:** <TextInput> usando apenas placeholder como label (não persistente)
- **Correção:** Adicionar accessibilityLabel="descrição do campo"
- ✅ **Autofixável**

```jsx
<TextInput
 value={deleteReason}
 onChangeText={setDeleteReason}
 placeholder="Motivo (opcional)"
 placeholderTextColor={PROFILE...
```

#### P0-INPUT-001 - TextInput (linha 641)

- **WCAG:** 3.3.2 (A)
- **Categoria:** FORM
- **Confiança:** MEDIUM
- **Problema:** <TextInput> usando apenas placeholder como label (não persistente)
- **Correção:** Adicionar accessibilityLabel="descrição do campo"
- ✅ **Autofixável**

```jsx
<TextInput
 value={confirmText}
 onChangeText={setConfirmText}
 placeholder="Digite DELETAR"
 placeholderTextColor={PROFILE_COLO...
```

### 📄 `screens\ProfileScreen.tsx`

#### P1-TARGET-HIG-001 - Pressable (linha 321)

- **WCAG:** N/A (BP)
- **Categoria:** TARGET
- **Confiança:** MEDIUM
- **Problema:** Tap target menor que 44pt (iOS HIG) - encontrado: 36×36
- **Correção:** Aumentar dimensões para 44×44pt ou adicionar hitSlop
- ✅ **Autofixável**

```jsx
<Pressable
 onPress={() => navigation.navigate("EditProfile")}
 accessibilityLabel="Adicionar foto"
 accessibilityRole="button"...
```

### 📄 `screens\DailyLogScreenRedesign.tsx`

#### P1-TARGET-HIG-001 - Pressable (linha 196)

- **WCAG:** N/A (BP)
- **Categoria:** TARGET
- **Confiança:** MEDIUM
- **Problema:** Tap target menor que 44pt (iOS HIG) - encontrado: 40×40
- **Correção:** Aumentar dimensões para 44×44pt ou adicionar hitSlop
- ✅ **Autofixável**

```jsx
<Pressable
 onPress={() => navigation.goBack()}
 style={{
 width: 40,
 height: 40,
 borderRadius: 20,
 backgroundColor:...
```

#### P1-STATE-002 - MoodCard (linha 295)

- **WCAG:** 4.1.2 (A)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** <MoodCard> com estado selecionado/checked sem accessibilityState correspondente
- **Correção:** Adicionar accessibilityState={{ selected: true }} ou {{ checked: true }}
- ✅ **Autofixável**

```jsx
<MoodCard
  mood={mood}
  isSelected={selectedMood === mood.id}
  onSelect={() => handleMoodSelect(mood.id)}
/>
```

#### P1-STATE-002 - FeelingChip (linha 330)

- **WCAG:** 4.1.2 (A)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** <FeelingChip> com estado selecionado/checked sem accessibilityState correspondente
- **Correção:** Adicionar accessibilityState={{ selected: true }} ou {{ checked: true }}
- ✅ **Autofixável**

```jsx
<FeelingChip
  feeling={feeling}
  isSelected={selectedFeelings.has(feeling.id)}
  onToggle={() => handleFeelingToggle(feeling.id)}
/>
```

### 📄 `screens\CycleTrackerScreenRedesign.tsx`

#### P1-TARGET-HIG-001 - Pressable (linha 183)

- **WCAG:** N/A (BP)
- **Categoria:** TARGET
- **Confiança:** MEDIUM
- **Problema:** Tap target menor que 44pt (iOS HIG) - encontrado: 40×40
- **Correção:** Aumentar dimensões para 44×44pt ou adicionar hitSlop
- ✅ **Autofixável**

```jsx
<Pressable
 onPress={() => navigation.goBack()}
 style={{
 width: 40,
 height: 40,
 borderRadius: 20,
 backgroundColor:...
```

#### P1-STATE-002 - SymptomCard (linha 354)

- **WCAG:** 4.1.2 (A)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** <SymptomCard> com estado selecionado/checked sem accessibilityState correspondente
- **Correção:** Adicionar accessibilityState={{ selected: true }} ou {{ checked: true }}
- ✅ **Autofixável**

```jsx
<SymptomCard
  symptom={symptom}
  isSelected={selectedSymptoms.has(symptom.id)}
  onToggle={() => handleSymptomToggle(symptom.id)}
/>
```

### 📄 `screens\CommunityScreenRedesign.tsx`

#### P1-MODAL-001 - Modal (linha 296)

- **WCAG:** 2.4.3 (A)
- **Categoria:** MODAL
- **Confiança:** HIGH
- **Problema:** <Modal> sem accessibilityViewIsModal (iOS)
- **Correção:** Adicionar accessibilityViewIsModal={true} para conter foco dentro do modal
- ✅ **Autofixável**

```jsx
<Modal visible={showNewPostModal} transparent animationType="slide">
 <View
 style={{
 flex: 1,
 backgroundColor: Tokens.overlay.dark,
 justifyCon...
```

#### P1-TARGET-HIG-001 - Pressable (linha 333)

- **WCAG:** N/A (BP)
- **Categoria:** TARGET
- **Confiança:** MEDIUM
- **Problema:** Tap target menor que 44pt (iOS HIG) - encontrado: 32×32
- **Correção:** Aumentar dimensões para 44×44pt ou adicionar hitSlop
- ✅ **Autofixável**

```jsx
<Pressable
 onPress={() => setShowNewPostModal(false)}
 style={{
 width: 32,
 height: 32,
 borderRadius: 16,...
```

#### P0-INPUT-001 - TextInput (linha 349)

- **WCAG:** 3.3.2 (A)
- **Categoria:** FORM
- **Confiança:** MEDIUM
- **Problema:** <TextInput> usando apenas placeholder como label (não persistente)
- **Correção:** Adicionar accessibilityLabel="descrição do campo"
- ✅ **Autofixável**

```jsx
<TextInput
 value={newPostContent}
 onChangeText={setNewPostContent}
 placeholder="Compartilhe como você está se sentindo..."
 placeholderTextCo...
```

### 📄 `screens\auth\EmailAuthScreen.tsx`

#### P1-STATE-001 - Pressable (linha 254)

- **WCAG:** 4.1.2 (A)
- **Categoria:** STATE
- **Confiança:** HIGH
- **Problema:** <Pressable> com disabled sem accessibilityState.disabled
- **Correção:** Adicionar accessibilityState={{ disabled: true }} ou aria-disabled={true}
- ✅ **Autofixável**

```jsx
<Pressable
 onPress={onToggle}
 disabled={disabled}
 style={styles.toggleTrack}
 accessibilityRole="switch"
 accessibilityState={{ checked: !isLogin }...
```

### 📄 `components\community\ReportModal.tsx`

#### P1-MODAL-001 - Modal (linha 134)

- **WCAG:** 2.4.3 (A)
- **Categoria:** MODAL
- **Confiança:** HIGH
- **Problema:** <Modal> sem accessibilityViewIsModal (iOS)
- **Correção:** Adicionar accessibilityViewIsModal={true} para conter foco dentro do modal
- ✅ **Autofixável**

```jsx
<Modal
 visible={visible}
 transparent
 animationType="none"
 statusBarTranslucent
 onRequestClose={handleClose}
 >
 <KeyboardAvoidingView
 behavior={Pl...
```

#### P1-ROLE-001 - AnimatedPressable (linha 146)

- **WCAG:** 4.1.2 (A)
- **Categoria:** ROLE
- **Confiança:** HIGH
- **Problema:** <AnimatedPressable> interativo sem role definido
- **Correção:** Adicionar role="button" ou accessibilityRole="button"
- ✅ **Autofixável**

```jsx
<AnimatedPressable
  entering={FadeIn.duration(200)}
  exiting={FadeOut.duration(200)}
  style={styles.backdrop}
  onPress={handleClose}
/>
```

#### P0-INPUT-001 - TextInput (linha 247)

- **WCAG:** 3.3.2 (A)
- **Categoria:** FORM
- **Confiança:** MEDIUM
- **Problema:** <TextInput> usando apenas placeholder como label (não persistente)
- **Correção:** Adicionar accessibilityLabel="descrição do campo"
- ✅ **Autofixável**

```jsx
<TextInput
 style={styles.textInput}
 placeholder="Conte mais sobre o problema..."
 placeholderTextColor={neutral[400]}...
```

### 📄 `components\admin\PostCreator.tsx`

#### P1-MODAL-001 - Modal (linha 60)

- **WCAG:** 2.4.3 (A)
- **Categoria:** MODAL
- **Confiança:** HIGH
- **Problema:** <Modal> sem accessibilityViewIsModal (iOS)
- **Correção:** Adicionar accessibilityViewIsModal={true} para conter foco dentro do modal
- ✅ **Autofixável**

```jsx
<Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
 <GradientBackground style={{ flex: 1 }}>
 <SafeAreaView style={styles.container}>
 <View style={s...
```

#### P0-INPUT-001 - TextInput (linha 78)

- **WCAG:** 3.3.2 (A)
- **Categoria:** FORM
- **Confiança:** MEDIUM
- **Problema:** <TextInput> usando apenas placeholder como label (não persistente)
- **Correção:** Adicionar accessibilityLabel="descrição do campo"
- ✅ **Autofixável**

```jsx
<TextInput
 style={[
 styles.input,
 {
 backgroundColor: theme.surface.elevated,
 borderColor: theme.border....
```

#### P0-INPUT-001 - TextInput (linha 97)

- **WCAG:** 3.3.2 (A)
- **Categoria:** FORM
- **Confiança:** MEDIUM
- **Problema:** <TextInput> usando apenas placeholder como label (não persistente)
- **Correção:** Adicionar accessibilityLabel="descrição do campo"
- ✅ **Autofixável**

```jsx
<TextInput
 style={[
 styles.input,
 styles.textArea,
 {
 backgroundColor: theme.surface.elevated,...
```

### 📄 `components\admin\AdminLoginModal.tsx`

#### P1-MODAL-001 - Modal (linha 52)

- **WCAG:** 2.4.3 (A)
- **Categoria:** MODAL
- **Confiança:** HIGH
- **Problema:** <Modal> sem accessibilityViewIsModal (iOS)
- **Correção:** Adicionar accessibilityViewIsModal={true} para conter foco dentro do modal
- ✅ **Autofixável**

```jsx
<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
 <KeyboardAvoidingView
 behavior={Platform.OS === "ios" ? "padding" : "height"}
 style={styles...
```

#### P0-INPUT-001 - TextInput (linha 79)

- **WCAG:** 3.3.2 (A)
- **Categoria:** FORM
- **Confiança:** MEDIUM
- **Problema:** <TextInput> usando apenas placeholder como label (não persistente)
- **Correção:** Adicionar accessibilityLabel="descrição do campo"
- ✅ **Autofixável**

```jsx
<TextInput
 style={[styles.input, error && styles.inputError]}
 value={pin}
 onChangeText={(t) => {
 setPin(t);
 setError(false);...
```

## 🟡 Menores (P2)

### 📄 `screens\RestSoundsScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 397)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={item.id}
 entering={FadeInUp.delay(index * 80)
 .duration(500)
 .springify()}
 style={{ marginBottom: Tok...
```

#### P2-STATUS-001 - ActivityIndicator (linha 502)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={restColors.textPrimary} />
```

#### P2-MOTION-001 - Animated.View (linha 515)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(400)}
 style={{
 marginTop: Tokens.spacing.lg,
 paddingTop: To...
```

### 📄 `screens\ProfileScreenRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 233)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(500)}
 style={{
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "space-between",...
```

#### P2-MOTION-001 - Animated.View (linha 271)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(100).duration(600)}>
 <LinearGradient
 colors={PROFILE_COLORS.heroGradient}
 start={{ x: 0, y: 0 }}
 end={{ x: 1,...
```

#### P2-MOTION-001 - Animated.View (linha 361)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View key={item.id} entering={FadeInUp.delay(200 + index * 50).duration(600)}>
  <MenuCard item={item} onPress={() => handleMenuItemPress(item)} />
</Animated.View>
```

#### P2-MOTION-001 - Animated.View (linha 368)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(500).duration(600)}>
 <Pressable
 onPress={handleThemeToggle}
 accessibilityRole="button"
 accessibilityLabel={`Te...
```

#### P2-MOTION-001 - Animated.View (linha 437)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(550).duration(600)}>
 <Pressable
 onPress={handleLogout}
 style={{
 borderRadius: 16,
 padding: 20...
```

#### P2-MOTION-001 - Animated.View (linha 465)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(600).duration(600)}>
 <LinearGradient
 colors={PROFILE_COLORS.dangerGradient}
 start={{ x: 0, y: 0 }}
 end={{ x: 1...
```

#### P2-STATUS-001 - ActivityIndicator (linha 674)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={PROFILE_COLORS.dangerText} />
```

### 📄 `screens\ProfileScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 246)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(600).springify()}
 style={{
 paddingTop: insets.top + spacing.xl,
 paddingHorizontal: spacing["2xl"],...
```

#### P2-MOTION-001 - Animated.View (linha 442)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(200).duration(600).springify()}
 style={{ paddingHorizontal: spacing["2xl"], marginBottom: spacing["3xl"] }}
 >...
```

#### P2-MOTION-001 - Animated.View (linha 458)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={interest}
 entering={FadeInUp.delay(300 + index * 50)
 .duration(600)
 .springify()}
 >...
```

#### P2-MOTION-001 - Animated.View (linha 495)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(300).duration(600).springify()}
 style={{ paddingHorizontal: spacing["2xl"], marginBottom: spacing["3xl"] }}
 >
 <Text...
```

#### P2-MOTION-001 - Animated.View (linha 666)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(350).duration(600).springify()}
 style={{ paddingHorizontal: spacing["2xl"], marginBottom: spacing["3xl"] }}
 >
 <Text...
```

#### P2-MOTION-001 - Animated.View (linha 790)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(400).duration(600).springify()}
 style={{ paddingHorizontal: spacing["2xl"] }}
 >
 <Text
 style={{...
```

#### P2-MOTION-001 - Animated.View (linha 860)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(500).duration(600).springify()}
 style={{ paddingHorizontal: spacing["2xl"], marginTop: spacing["2xl"] }}
 >
 <Pressable...
```

#### P2-MOTION-001 - Animated.View (linha 895)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(600).duration(600).springify()}
 style={{ paddingHorizontal: spacing["2xl"], marginTop: spacing["3xl"] }}
 >
 <Text...
```

#### P2-STATUS-001 - ActivityIndicator (linha 1347)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={colors.primary[500]} />
```

### 📄 `screens\NotificationPreferencesScreen.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 289)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={colors.primary[500]} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 359)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={colors.primary[500]} />
```

#### P2-MOTION-001 - Animated.View (linha 370)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(100).springify()}
 style={{
 marginTop: 24,
 padding: 20,
 backgroundColor: cardBg,
 bord...
```

#### P2-MOTION-001 - Animated.View (linha 440)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={section.title}
 entering={FadeInDown.delay(200 + sectionIndex * 100).springify()}
 style={{ marginTop: 32 }}
 >
 <View st...
```

#### P2-MOTION-001 - Animated.View (linha 540)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(800).springify()} style={{ marginTop: 32 }}>
 <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
 <Ionicons...
```

### 📄 `screens\NotificationPermissionScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 181)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={SlideInRight.duration(600).delay(delay).springify()}
 accessibilityRole="text"
 accessibilityLabel={`${title}: ${message}`}
 style={{
 backgro...
```

#### P2-MOTION-001 - Animated.View (linha 302)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.duration(800).springify()}
 style={{
 alignItems: "center",
 marginBottom: sizes.sectionMargin,
 }}
 >
 <View
 st...
```

#### P2-MOTION-001 - Animated.View (linha 394)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(600).delay(ANIMATION_DELAYS.title).springify()}
 style={{ marginBottom: sizes.isCompact ? SPACING.md : SPACING.xl }}
 >...
```

#### P2-MOTION-001 - Animated.View (linha 414)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(600).delay(ANIMATION_DELAYS.subtitle).springify()}
 style={{ marginBottom: sizes.sectionMargin }}
 >
 <Text...
```

#### P2-MOTION-001 - Animated.View (linha 432)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(400).delay(ANIMATION_DELAYS.previews)}
 style={{
 marginBottom: sizes.sectionMargin,
 }}
 >
 {NOTI...
```

#### P2-MOTION-001 - Animated.View (linha 449)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(600).delay(ANIMATION_DELAYS.benefits).springify()}
 style={{
 backgroundColor: Tokens.premium.glass.strong,
 b...
```

#### P2-MOTION-001 - Animated.View (linha 467)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(600).delay(ANIMATION_DELAYS.buttons).springify()}
 >
 {/* Botão principal */}
 <Button
 variant="accent"...
```

#### P2-MOTION-001 - Animated.View (linha 510)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(400).delay(ANIMATION_DELAYS.footer)}
 style={{
 alignItems: "center",
 marginTop: sizes.isCompact ? SPACIN...
```

### 📄 `screens\NewPostScreen.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 228)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={Tokens.neutral[0]} />
```

### 📄 `screens\NathIADisabledScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 65)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(600).springify()}
 style={{ alignItems: "center" }}
 >
 {/* Icon */}
 <View
 style={{...
```

### 📄 `screens\MyPostsScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 230)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(100).duration(200)}
 style={[
 styles.rejectionCard,
 { backgroundColor: isDark ? semantic.dark.errorLigh...
```

#### P2-STATUS-001 - ListSkeleton (linha 286)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ListSkeleton type="post" count={3} />
```

### 📄 `screens\MyCareScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 104)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(500)} style={styles.header}>
 <View style={styles.headerTop}>
 <View>
 <Text style={[styles.greeting, { color: colors.neutr...
```

#### P2-MOTION-001 - Animated.View (linha 125)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(100).duration(500)}>
 <Pressable
 onPress={() => navigation.navigate("Affirmations")}
 style={[styles.affirmationCard, { bac...
```

#### P2-MOTION-001 - Animated.View (linha 145)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
 <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Seu momento</Text>
 <View...
```

#### P2-MOTION-001 - Animated.View (linha 177)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
 <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Acesso rápido</Text>
 <Vi...
```

#### P2-MOTION-001 - Animated.View (linha 205)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
 <Pressable
 onPress={() => navigation.navigate("Assistant")}
 style={({ pressed...
```

#### P2-MOTION-001 - Animated.View (linha 237)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.footer}>
 <Text style={[styles.footerText, { color: colors.neutral[400] }]}>
 Cuidar de você é cuidar...
```

### 📄 `screens\MundoDaNathScreenRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 169)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(600)} style={{ paddingHorizontal: 20 }}>
 <LinearGradient
 colors={MUNDO_COLORS.heroGradient}
 start={{ x: 0, y: 0 }}...
```

#### P2-STATUS-001 - ActivityIndicator (linha 324)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={MUNDO_COLORS.rose} />
```

#### P2-MOTION-001 - Animated.View (linha 355)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={post.id}
 entering={FadeInUp.delay(200 + index * 80).duration(600)}
 >
 <MundoPostCard post={post} isPremium={isPremi...
```

### 📄 `screens\MundoDaNathScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 85)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(index * 80).duration(500)}
 style={[
 {
 backgroundColor: bgCard,
 borderRadius: Tokens.radius.xl,
 marginBot...
```

#### P2-MOTION-001 - Animated.View (linha 457)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(600)} style={{ alignItems: "center" }}>
 <View
 style={{
 width: 120,
 height: 120,
 borderRadi...
```

#### P2-STATUS-001 - ActivityIndicator (linha 572)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={Tokens.nathAccent.rose} />
```

### 📄 `screens\MaeValenteProgressScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 289)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(400)}
 style={{
 paddingHorizontal: Tokens.spacing["2xl"],
 marginBottom: Tokens.spacing["2xl"],...
```

#### P2-MOTION-001 - Animated.View (linha 311)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(400).delay(100)}
 style={{ paddingHorizontal: Tokens.spacing["2xl"], marginBottom: Tokens.spacing["2xl"] }}
 >
 <Vie...
```

#### P2-MOTION-001 - Animated.View (linha 365)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(400).delay(200)}
 style={{ paddingHorizontal: Tokens.spacing["2xl"], marginBottom: Tokens.spacing["2xl"] }}
 >
 <Tex...
```

#### P2-MOTION-001 - Animated.View (linha 411)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(400).delay(300)}
 style={{ paddingHorizontal: Tokens.spacing["2xl"], marginBottom: Tokens.spacing["2xl"] }}
 >
 <Tex...
```

### 📄 `screens\LoginScreenRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 177)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.ctaButtonShadow, !disabled && glowStyle]}>
 <LinearGradient
 colors={
 disabled
 ? [Tokens.premium.glass.medium, Tokens.premiu...
```

#### P2-STATUS-001 - ActivityIndicator (linha 189)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={COLORS.textPrimary} size="small" />
```

#### P2-MOTION-001 - Animated.View (linha 333)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.delay(100).duration(800)} style={styles.logoContainer}>
 <Image
 source={require("../../assets/logo.png")}
 style={styles....
```

#### P2-MOTION-001 - Animated.Text (linha 344)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(300).duration(600).springify()}
 style={styles.heroLabel}
 >
 NOSSA MATERNIDADE
 </...
```

#### P2-MOTION-001 - Animated.Text (linha 351)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(450).duration(600).springify()}
 style={styles.heroTitle}
 >
 Sua jornada{"\n"}começa aqui...
```

#### P2-MOTION-001 - Animated.Text (linha 358)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(600).duration(600).springify()}
 style={styles.heroSubtitle}
 >
 por Nathalia Valente...
```

#### P2-MOTION-001 - Animated.View (linha 367)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(750).duration(500)} style={styles.statsRow}>
 <View style={styles.stat}>
 <Text style={styles.statValue}>40M+</Text>...
```

#### P2-MOTION-001 - Animated.View (linha 386)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={SlideInUp.delay(900).duration(600).springify()}
 style={[styles.cardContainer, { paddingBottom: insets.bottom + 16 }]}
 >
 <Glas...
```

#### P2-MOTION-001 - Animated.View (linha 449)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)} style={styles.successContainer}>
 <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
 <Text st...
```

### 📄 `screens\HomeScreenRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 225)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(500)}
 style={{
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "space-between",...
```

#### P2-MOTION-001 - Animated.View (linha 283)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(100).duration(600)}>
 <LinearGradient
 colors={HOME_COLORS.heroGradient}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y:...
```

#### P2-MOTION-001 - Animated.View (linha 346)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(200).duration(600)}>
 <StatusCard
 title="Como você está?"
 description={
 todayMood...
```

#### P2-MOTION-001 - Animated.View (linha 362)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(250).duration(600)}>
 <StatusCard
 title="Hábitos de Hoje"
 description={
 totalHabits > 0...
```

#### P2-MOTION-001 - Animated.View (linha 393)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={action.id}
 entering={FadeInUp.delay(300 + index * 50).duration(600)}
 >
 <QuickActionCard action={action} onPress={() => han...
```

### 📄 `screens\HomeScreen.tsx`

#### P2-MOTION-001 - AnimatedScrollView (linha 201)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedScrollView
 contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
 showsVerticalScrollIndicator={false}
 onScroll={scrollHandler...
```

#### P2-MOTION-001 - Animated.View (linha 216)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(500).springify()} style={styles.header}>
 <View style={styles.headerLeft}>
 {/* Ilustração maternal */}
 <Image...
```

#### P2-MOTION-001 - Animated.View (linha 274)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(50).duration(600).springify()}>
 <HeroCard
 motivationalMessage={motivationalMessage}
 onPress={handleNathiaChat}...
```

#### P2-MOTION-001 - Animated.View (linha 284)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(100).duration(500).springify()}>
 <ProgressSection
 completedHabits={completedHabits}
 totalHabits={totalHabits}...
```

#### P2-STATUS-001 - ProgressSection (linha 285)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressSection
  completedHabits={completedHabits}
  totalHabits={totalHabits}
  onPress={handleHabits}
  isDark={isDark}
/>
```

#### P2-MOTION-001 - Animated.View (linha 294)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(150).duration(500).springify()}
 style={[styles.sectionCard, isDark ? styles.sectionCardDark : styles.sectionCardLight]}
 >...
```

### 📄 `screens\HabitsScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 77)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(100 + index * 50)
 .duration(500)
 .springify()}
 >
 <Pressable
 onPress={handlePress}
 accessibi...
```

#### P2-MOTION-001 - Animated.View (linha 322)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(600)}
 style={{
 alignItems: "center",
 paddingHorizontal: cleanDesign.spacing.screenPadding,
 marginB...
```

#### P2-MOTION-001 - Animated.View (linha 347)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(300)}
 style={{
 marginHorizontal: cleanDesign.spacing.screenPadding,
 marginBottom: SPACING.lg,...
```

#### P2-MOTION-001 - Animated.View (linha 374)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(200).duration(500)}
 style={{
 marginHorizontal: cleanDesign.spacing.screenPadding,
 marginBottom: cleanDesign.spacin...
```

#### P2-MOTION-001 - Animated.View (linha 455)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(500).duration(600).springify()}
 style={{
 marginHorizontal: cleanDesign.spacing.screenPadding,
 marginTop: cleanDe...
```

### 📄 `screens\HabitsEnhancedScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 133)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.motivationalContainer}>
 <Text style={styles.motivationalEmoji}>{message.emoji}</Text>
 <Text style={styles.motivati...
```

#### P2-MOTION-001 - Animated.View (linha 233)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.habitCard,
 { borderColor: habit.completed ? habit.color : COLORS.neutral[100] },
 cardAnimatedStyle,
 ]}
 >...
```

#### P2-MOTION-001 - Animated.View (linha 286)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={checkAnimatedStyle}>
  <Ionicons name="checkmark" size={18} color={COLORS.text.inverse} />
</Animated.View>
```

#### P2-MOTION-001 - Animated.View (linha 416)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={category}
 entering={FadeInDown.delay(index * 100).duration(500)}
 style={styles.categoryCard}
 >
 <View style={styles.ca...
```

#### P2-MOTION-001 - Animated.View (linha 517)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(400)} style={styles.sectionContainer}>
 <Text style={styles.sectionTitle}>Esta Semana</Text>
 <WeeklyHeatmap habits={habits} />...
```

#### P2-MOTION-001 - Animated.View (linha 530)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(400)} style={styles.sectionContainer}>
 <Text style={styles.sectionTitle}>Este Mês</Text>
 <MonthlyStats habits={habits} />...
```

#### P2-MOTION-001 - Animated.View (linha 567)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(600)} style={styles.heroSection}>
 <View style={styles.heroAvatarContainer}>
 <Image
 source={MYCARE_IMAGE}...
```

#### P2-STATUS-001 - ProgressCircle (linha 596)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressCircle percentage={completionPercentage} />
```

#### P2-MOTION-001 - Animated.ScrollView (linha 617)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
>
  {ListHeader}
</Animated.ScrollView>
```

### 📄 `screens\DailyLogScreenRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 176)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(500)}
 style={{
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "space-between",...
```

#### P2-MOTION-001 - Animated.View (linha 214)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(100).duration(600)}>
 <LinearGradient
 colors={selectedMoodData?.gradient || LOG_COLORS.heroGradient}
 start={{ x: 0, y: 0 }}...
```

#### P2-MOTION-001 - Animated.View (linha 294)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View key={mood.id} entering={FadeInUp.delay(200 + index * 50).duration(600)}>
 <MoodCard
 mood={mood}
 isSelected={selectedMood === mood.id}...
```

#### P2-MOTION-001 - Animated.View (linha 326)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={feeling.id}
 entering={FadeInUp.delay(400 + index * 30).duration(600)}
 >
 <FeelingChip
 feeling={feeling}...
```

#### P2-MOTION-001 - Animated.View (linha 352)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(600).duration(600)}>
 <TextInput
 value={notes}
 onChangeText={setNotes}
 placeholder="Escreva como você se sente....
```

#### P2-MOTION-001 - Animated.View (linha 379)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(700).duration(600)}>
  <BreatheButton onPress={handleSave} disabled={!canSave} label="Salvar Diário" />
</Animated.View>
```

### 📄 `screens\DailyLogScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 208)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(400)}>
 <Text style={{ color: textMain, fontSize: 20, fontWeight: "600" }}>
 {formatDate(today)}
 </Text>...
```

#### P2-MOTION-001 - Animated.View (linha 240)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.duration(600)}
 style={{ alignItems: "center", width: "100%" }}
 >
 <Text
 style={{
 colo...
```

#### P2-MOTION-001 - Animated.View (linha 261)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={mood.id}
 entering={FadeInUp.delay(100 + index * 60).duration(500)}
 className="w-[23%] items-center mb-6"
 >...
```

#### P2-MOTION-001 - Animated.View (linha 294)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.duration(600)} className="items-center w-full">
 {/* Selected Mood Display */}
 <View
 className="w-32 h-32 rounded-3xl items-ce...
```

#### P2-MOTION-001 - Animated.View (linha 354)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 progressBarStyle,
 {
 position: "absolute",
 left: 0,...
```

#### P2-MOTION-001 - Animated.View (linha 368)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 emojiAnimatedStyle,
 {
 position: "absolute",
 left: 0,...
```

### 📄 `screens\CycleTrackerScreenRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 163)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(500)}
 style={{
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "space-between",...
```

#### P2-MOTION-001 - Animated.View (linha 201)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(100).duration(600)}>
 <LinearGradient
 colors={phaseInfo.gradient}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y: 1 }}...
```

#### P2-MOTION-001 - Animated.View (linha 289)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(200).duration(600)}
 style={{
 backgroundColor: Tokens.overlay.cardHighlight,
 borderRadius: 20,
 paddi...
```

#### P2-MOTION-001 - Animated.View (linha 350)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={symptom.id}
 entering={FadeInUp.delay(300 + index * 50).duration(600)}
 >
 <SymptomCard
 symptom={symptom}...
```

#### P2-MOTION-001 - Animated.View (linha 364)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(600).duration(600)}>
 <Pressable
 onPress={handleSaveLog}
 style={{
 borderRadius: 16,
 paddingVer...
```

### 📄 `screens\CycleTrackerScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 366)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(600).springify()}>
 <Text
 style={{
 color: textMain,
 fontSize: 30,
 f...
```

#### P2-MOTION-001 - Animated.View (linha 386)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(100).duration(600).springify()}
 className="mx-6 mb-6"
 >
 <View
 className="rounded-3xl overflow-h...
```

#### P2-MOTION-001 - Animated.View (linha 420)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 position: "absolute",
 width: 100,
 height: 100...
```

#### P2-MOTION-001 - Animated.View (linha 491)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(200).duration(600).springify()}
 className="mx-6 mb-6"
 >
 <View
 className="rounded-3xl p-5"
 st...
```

#### P2-MOTION-001 - Animated.View (linha 616)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(300).duration(600).springify()}
 className="mx-6 mb-6"
 >
 <Pressable
 onPress={handleLogPeriod}...
```

#### P2-MOTION-001 - Animated.View (linha 639)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(400).duration(600).springify()}
 className="mx-6 mb-6"
 >
 <View
 className="rounded-3xl p-5"...
```

### 📄 `screens\CommunityScreenRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 150)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(600)} style={{ paddingHorizontal: 20 }}>
 <LinearGradient
 colors={COMMUNITY_COLORS.heroGradient}
 start={{ x: 0, y: 0 }}...
```

#### P2-MOTION-001 - Animated.View (linha 205)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(100).duration(600)}
 style={{ paddingHorizontal: 20, marginBottom: 24 }}
 >
 <QuickComposerRedesign onPress={handleOpenNe...
```

#### P2-STATUS-001 - ActivityIndicator (linha 382)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={Tokens.neutral[0]} />
```

### 📄 `screens\CommunityScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 196)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(600)} style={styles.heroContent}>
 {/* Mães Valente Hero Image */}
 <View style={styles.heroIconContainer}>
 <Image...
```

#### P2-STATUS-001 - ListSkeleton (linha 289)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ListSkeleton type="post" count={3} />
```

#### P2-MOTION-001 - Animated.View (linha 319)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(300).duration(400)}
 style={[
 styles.fab,
 fabAnimatedStyle,
 {
 b...
```

### 📄 `screens\ComingSoonScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 57)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(800).duration(600)}
 className="absolute rounded-full"
 style={{
 top: "15%",
 left: "8%",
 width: 6,...
```

#### P2-MOTION-001 - Animated.View (linha 69)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(1000).duration(600)}
 className="absolute rounded-full"
 style={{
 top: "22%",
 right: "12%",
 width: 4,...
```

#### P2-MOTION-001 - Animated.View (linha 81)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(1200).duration(600)}
 className="absolute rounded-full"
 style={{
 top: "65%",
 left: "5%",
 width: 5,...
```

#### P2-MOTION-001 - Animated.View (linha 93)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(1400).duration(600)}
 className="absolute rounded-full"
 style={{
 top: "72%",
 right: "8%",
 width: 4,...
```

#### P2-MOTION-001 - Animated.View (linha 164)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(200).duration(500).springify()}
 style={[
 {
 width: 112,
 height: 112,
 borderRadius: 56,
 alignIt...
```

#### P2-MOTION-001 - Animated.View (linha 202)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(600).duration(500)}
 className="flex-row items-center px-4 py-2 rounded-full"
 style={{
 backgroundColor: isDark ? Tokens.premium.glass.light...
```

#### P2-MOTION-001 - Animated.View (linha 289)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(400)}
 className="flex-row items-center px-5"
 style={{ paddingTop: insets.top + 12 }}
 >
 <Pressable
 onPress...
```

#### P2-MOTION-001 - AnimatedIcon (linha 310)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedIcon iconName={iconName} isDark={isDark} />
```

#### P2-MOTION-001 - Animated.Text (linha 313)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(300).duration(500).springify()}
 className="text-center font-bold mt-8 mb-3"
 style={{
 fontSize: typography.displayM...
```

#### P2-MOTION-001 - Animated.Text (linha 328)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(400).duration(500).springify()}
 className="text-center mb-6 max-w-[300px]"
 style={{
 fontSize: typography.bodyLarge...
```

#### P2-MOTION-001 - Animated.View (linha 348)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(500).duration(500).springify()}
 style={primaryAnimStyle}
 >
 <Pressable
 onPress={handlePrimaryAction}...
```

#### P2-MOTION-001 - Animated.View (linha 380)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(600).duration(500).springify()}
 className="mt-3"
 style={secondaryAnimStyle}
 >
 <Pressable...
```

#### P2-MOTION-001 - Animated.View (linha 414)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(700).duration(500)}
 className="flex-row items-center justify-center mt-8"
 >
 <Ionicons name="heart" size={14} color={isDa...
```

### 📄 `screens\BreathingExerciseScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 247)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 width: 200,
 height: 200,
 borderRadius: 100,
 backgroundColor: techn...
```

### 📄 `screens\AssistantScreenRedesign.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 536)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={neutral[0]} size="small" />
```

### 📄 `screens\AssistantScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 375)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(400)} style={styles.header}>
 {/* History Button - Icon changed for clarity */}
 <Pressable
 onPress={() => setShowHistor...
```

#### P2-MOTION-001 - Animated.View (linha 473)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.loadingContainer}>
 <View style={styles.loadingAvatarWrapper}></View>
 <View style={styles.load...
```

#### P2-STATUS-001 - LoadingDots (linha 476)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<LoadingDots variant="primary" size="sm" />
```

### 📄 `screens\AIConsentScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 119)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(600).springify()} style={{ gap: spacing.xl }}>
 {/* Icon Header */}
 <View style={{ alignItems: "center", marginTop: spacing["2xl"] }}>...
```

### 📄 `screens\AffirmationsScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 239)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.delay(100).duration(500)}>
 <Pressable
 onPress={() => navigation.goBack()}
 className="w-11 h-11 rounded-full items-center just...
```

#### P2-MOTION-001 - Animated.View (linha 251)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.delay(200).duration(500)}>
 <Pressable
 onPress={handleChangeTheme}
 className="w-11 h-11 rounded-full items-center justify-cent...
```

#### P2-MOTION-001 - Animated.View (linha 266)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(300).duration(600)}>
 <Text
 className="text-sm text-center uppercase tracking-widest mb-8"
 style={{ color: Tokens.pr...
```

#### P2-MOTION-001 - Animated.View (linha 275)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedTextStyle}>
 <View className="rounded-3xl p-8" style={{ backgroundColor: Tokens.overlay.dark }}>
 <Text
 className="text-6xl fon...
```

#### P2-MOTION-001 - Animated.View (linha 303)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center mt-6">
 <View
 className="px-4 py-2 rounded-full"
 style={{ backgroundColor:...
```

#### P2-MOTION-001 - Animated.View (linha 319)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(600).duration(500)}
 className="px-8 pb-8"
 style={{ paddingBottom: insets.bottom + 24 }}
 >
 {/* Navigation */...
```

#### P2-MOTION-001 - Animated.View (linha 376)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedHeartStyle}>
 <Ionicons
 name={isFavorite ? "heart" : "heart-outline"}
 size={26}
 color={isFavorite...
```

### 📄 `navigation\RootNavigator.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 62)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={COLORS.primary[500]} />
```

#### P2-STATUS-001 - LazyLoadingFallback (linha 72)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<LazyLoadingFallback />
```

### 📄 `navigation\MainTabNavigator.tsx`

#### P2-MOTION-001 - Animated.View (linha 105)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 width: 44,
 height: 44,
 borderRadius: 22,
 alignItems: "center",
 justifyContent: "center",
 //...
```

#### P2-MOTION-001 - Animated.View (linha 153)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 marginTop: -20,
 alignItems: "center",
 justifyContent: "center",
 width: 60,
 },
 an...
```

#### P2-MOTION-001 - AnimatedTabIcon (linha 315)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedTabIcon name={focused ? "home" : "home-outline"} focused={focused} color={color} />
```

#### P2-MOTION-001 - AnimatedTabIcon (linha 330)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedTabIcon name={focused ? "people" : "people-outline"} focused={focused} color={color} />
```

#### P2-MOTION-001 - AnimatedTabIcon (linha 371)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedTabIcon name={focused ? "heart" : "heart-outline"} focused={focused} color={color} />
```

#### P2-MOTION-001 - AnimatedTabIcon (linha 386)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedTabIcon name={focused ? "checkbox" : "checkbox-outline"} focused={focused} color={color} />
```

### 📄 `context\ToastContext.tsx`

#### P2-STATUS-001 - ToastContext.Provider (linha 66)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ToastContext.Provider
 value={{
 toasts,
 showToast,
 dismissToast,
 showSuccess,
 showError,
 showInfo,
 showWarning,
 }}
 >...
```

#### P2-STATUS-001 - Toast (linha 79)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<Toast
 key={toast.id}
 message={toast.message}
 type={toast.type}
 duration={toast.duration}
 action={toast.action}
 onDismiss={() => dismi...
```

### 📄 `components\VoiceMessagePlayer.tsx`

#### P2-MOTION-001 - Animated.View (linha 114)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[{ backgroundColor: color, width: 3, borderRadius: 1.5 }, bar1Style]} />
```

#### P2-MOTION-001 - Animated.View (linha 115)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[{ backgroundColor: color, width: 3, borderRadius: 1.5 }, bar2Style]} />
```

#### P2-MOTION-001 - Animated.View (linha 116)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[{ backgroundColor: color, width: 3, borderRadius: 1.5 }, bar3Style]} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 200)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={iconColor} />
```

#### P2-STATUS-001 - AudioWaveIndicator (linha 205)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<AudioWaveIndicator color={iconColor} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 282)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={isPlaying ? Tokens.neutral[0] : iconColor} />
```

#### P2-STATUS-001 - ProgressBar (linha 293)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar progress={voice.progress} color={iconColor} />
```

### 📄 `components\PremiumGate.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 205)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={PRIMARY_COLOR} />
```

### 📄 `components\OfflineBanner.tsx`

#### P2-MOTION-001 - Animated.View (linha 65)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={SlideInUp.duration(300)}
 exiting={SlideOutUp.duration(300)}
 style={{
 position: "absolute",
 top: 0,
 left: 0,
 right: 0,...
```

#### P2-MOTION-001 - Animated.View (linha 84)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(100)}
 exiting={FadeOut}
 style={{
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "space-be...
```

#### P2-STATUS-001 - ActivityIndicator (linha 149)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={warningColors.iconColor} />
```

### 📄 `components\HeartMoodSlider.tsx`

#### P2-MOTION-001 - Animated.View (linha 183)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.trackFill, fillAnimatedStyle]} />
```

#### P2-MOTION-001 - Animated.View (linha 187)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
 <Animated.View style={heartIconStyle}>
 <Ionicons name="heart" size={HEART_SIZE} color={neutral[0]} />...
```

#### P2-MOTION-001 - Animated.View (linha 188)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={heartIconStyle}>
  <Ionicons name="heart" size={HEART_SIZE} color={neutral[0]} />
</Animated.View>
```

### 📄 `components\EmptyStateFavorites.tsx`

#### P2-MOTION-001 - Animated.View (linha 22)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.delay(100).duration(400)}
 className={cn(
 "w-[120px] h-[120px] rounded-full items-center justify-center mb-6",
 isDark ? "bg-prima...
```

#### P2-MOTION-001 - Animated.Text (linha 37)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(200).duration(400)}
 className={cn(
 "text-xl font-bold text-center mb-3",
 isDark ? "text-neutral-100" : "text-neutral-800...
```

#### P2-MOTION-001 - Animated.View (linha 48)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(300).duration(400)}
 className="flex-row flex-wrap items-center justify-center mb-6"
 >
 <Text
 className={cn(...
```

#### P2-MOTION-001 - Animated.View (linha 77)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(400).duration(400)}
 className={cn(
 "flex-row items-start p-4 rounded-xl gap-3",
 isDark ? "bg-warning-900/30" : "bg-warni...
```

### 📄 `components\DailyCheckIn.tsx`

#### P2-MOTION-001 - Animated.View (linha 367)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={ZoomIn.duration(300).springify()}
 style={{
 backgroundColor: checkInColors.modalBg,
 borderRadius: radius["2xl"],...
```

#### P2-MOTION-001 - Animated.Text (linha 421)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeIn.duration(300)}
 style={{
 fontSize: typography.titleLarge.fontSize,
 fontWeight: typography.titleLarge.font...
```

#### P2-MOTION-001 - Animated.View (linha 436)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={ZoomIn.duration(400).springify()}
 style={{ alignItems: "center", paddingVertical: spacing.xl }}
 >
 <View...
```

#### P2-MOTION-001 - Animated.View (linha 466)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={option.value}
 entering={FadeInUp.delay(index * 50)
 .duration(300)
 .springify()}...
```

### 📄 `components\CommunityComposer.tsx`

#### P2-MOTION-001 - Animated.View (linha 256)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(200)}
 style={{
 backgroundColor: composerColors.cardBg,
 borderRadius: 20,
 padding: 16,
 marginBottom: 16,...
```

#### P2-MOTION-001 - Animated.View (linha 294)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View key={type.id} entering={FadeInUp.delay(index * 50).duration(200)}>
 <Pressable
 onPress={() => handleTypeSelect(type.id)}
 accessibilityRole="but...
```

#### P2-STATUS-001 - ActivityIndicator (linha 434)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={composerColors.postTextActive} style={{ marginRight: 8 }} />
```

### 📄 `components\AnimatedSplashScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 100)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
 <Image
 source={require("../../assets/logo.png")}
 style={styles.logo}
 resizeMode="contain"...
```

#### P2-MOTION-001 - Animated.Text (linha 110)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
  Sua jornada maternal começa aqui ✨
</Animated.Text>
```

### 📄 `screens\premium\PaywallScreenRedesign.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 292)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={MATERNAL_COLORS.rose} />
```

#### P2-MOTION-001 - Animated.View (linha 367)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={{
 opacity: fadeAnim,
 transform: [{ translateY: slideAnim }],
 }}
 >
 <LinearGradient
 colors={MATERNA...
```

#### P2-MOTION-001 - Animated.View (linha 406)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={idx}
 style={{
 opacity: featureAnims[idx].fade,
 transform: [{ translateY: featureAnims[idx].slide }],...
```

#### P2-MOTION-001 - Animated.View (linha 624)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 className="mt-10 px-6"
 style={{
 transform: [{ scale: pulseAnim }],
 }}
 >
 <Pressable
 onPress={handlePurchase...
```

#### P2-STATUS-001 - ActivityIndicator (linha 654)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={Tokens.neutral[0]} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 680)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={MATERNAL_COLORS.textSecondary} size="small" />
```

### 📄 `screens\premium\PaywallScreen.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 196)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={colors.primary} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 368)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={colors.card} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 379)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={colors.textSecondary} size="small" />
```

### 📄 `screens\onboarding\OnboardingWelcomeRedesign.tsx`

#### P2-MOTION-001 - Animated.View (linha 211)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 position: "absolute",
 top: SCREEN_HEIGHT * 0.1,
 left: -80,
 width: 240,
 heig...
```

#### P2-MOTION-001 - Animated.View (linha 232)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 position: "absolute",
 top: SCREEN_HEIGHT * 0.25,
 right: -60,
 width: 180,
 he...
```

#### P2-MOTION-001 - Animated.View (linha 253)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 position: "absolute",
 bottom: SCREEN_HEIGHT * 0.3,
 left: SCREEN_WIDTH * 0.6,
 width: 140,...
```

#### P2-MOTION-001 - Animated.View (linha 284)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(600)}
 style={{
 alignSelf: "flex-start",
 flexDirection: "row",
 alignItems: "center",
 b...
```

#### P2-MOTION-001 - Animated.Text (linha 328)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(100).duration(600)}
 style={{
 fontSize: 42,
 lineHeight: 50,
 fontWeight: "700",
 color: W...
```

#### P2-MOTION-001 - Animated.Text (linha 343)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(200).duration(600)}
 style={{
 fontSize: 18,
 lineHeight: 28,
 color: WELCOME_COLORS.secondary,...
```

#### P2-MOTION-001 - Animated.View (linha 367)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(600).duration(600)} style={{ width: "100%" }}>
 <Animated.View style={breatheStyle}>
 <Pressable
 onPress={handleStart}...
```

#### P2-MOTION-001 - Animated.View (linha 368)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={breatheStyle}>
 <Pressable
 onPress={handleStart}
 style={{
 overflow: "hidden",
 borderRadius: 28,...
```

#### P2-MOTION-001 - Animated.Text (linha 412)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeIn.delay(700).duration(400)}
 style={{
 textAlign: "center",
 fontSize: 14,
 color: WELCOME_COLORS.secondary,...
```

### 📄 `screens\onboarding\OnboardingWelcomePremium.tsx`

#### P2-MOTION-001 - Animated.View (linha 137)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(800)}
 style={[styles.heroContainer, { height: heroHeight }]}
 >
 <LinearGradient
 colors={[
 Tokens.gradi...
```

#### P2-MOTION-001 - Animated.Text (linha 178)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(400).duration(600).springify()}
 style={styles.greeting}
 accessibilityRole="header"
 >
 Oi, eu sou a...
```

#### P2-MOTION-001 - Animated.Text (linha 187)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(500).duration(600).springify()}
 style={styles.title}
 accessibilityRole="header"
 >
 Vamos começar s...
```

#### P2-MOTION-001 - Animated.Text (linha 196)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={FadeInUp.delay(600).duration(600).springify()}
 style={styles.subtitle}
 >
 Me diga em que fase você está da maternidade.{"\n"}L...
```

#### P2-MOTION-001 - Animated.View (linha 214)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(700).duration(600).springify()}
 style={styles.buttonContainer}
 >
 {/* Glow halo (animated) */}
 <Animated.V...
```

#### P2-MOTION-001 - Animated.View (linha 219)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.buttonGlow, glowAnimatedStyle]} />
```

#### P2-MOTION-001 - Animated.View (linha 241)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.delay(800).duration(400)}>
 <Pressable
 onPress={handleSkip}
 style={styles.skipButton}
 accessibilityLabel="Responder onb...
```

### 📄 `screens\onboarding\OnboardingSummary.tsx`

#### P2-STATUS-001 - ProgressBar (linha 158)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={7} totalSteps={7} />
```

#### P2-MOTION-001 - Animated.View (linha 167)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)}>
 <Text
 style={[
 styles.title,
 {
 color: theme.text.primary,
 },...
```

#### P2-MOTION-001 - Animated.View (linha 181)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(100).duration(300)}>
 <View
 style={[
 styles.card,
 {
 backgroundColor:...
```

#### P2-MOTION-001 - Animated.View (linha 238)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(200).duration(300)}>
 <View
 style={[
 styles.card,
 {
 backgroundColor:...
```

#### P2-MOTION-001 - Animated.View (linha 275)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(300).duration(300)}>
 <View
 style={[
 styles.card,
 {
 backgroundColor:...
```

#### P2-MOTION-001 - Animated.View (linha 316)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(400).duration(300)}>
 <View
 style={[
 styles.card,
 {
 backgroundColor:...
```

#### P2-MOTION-001 - Animated.View (linha 343)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(500).duration(300)}>
 <View
 style={[
 styles.card,
 {
 backgroundColor:...
```

### 📄 `screens\onboarding\OnboardingStage.tsx`

#### P2-STATUS-001 - ProgressBar (linha 122)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={1} totalSteps={7} />
```

#### P2-MOTION-001 - Animated.View (linha 135)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(100).duration(400)}>
 <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
 Me conta: onde você está agora?...
```

#### P2-MOTION-001 - Animated.View (linha 149)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={cardData.stage}
 entering={FadeInDown.delay(200 + index * 80).duration(400)}
 style={{ width: "47.5%" }}...
```

### 📄 `screens\onboarding\OnboardingSeason.tsx`

#### P2-STATUS-001 - ProgressBar (linha 126)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={6} totalSteps={7} />
```

#### P2-MOTION-001 - Animated.View (linha 137)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)}>
 <Text
 style={[
 styles.title,
 {
 color: theme.text.primary,
 },...
```

#### P2-MOTION-001 - Animated.View (linha 154)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View key={preset.key} entering={FadeInDown.delay(index * 50).duration(300)}>
 <Pressable
 onPress={() => handleSelectPreset(preset.key)}...
```

#### P2-MOTION-001 - Animated.View (linha 229)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)} style={styles.previewContainer}>
 <Text
 style={[
 styles.previewLabel,
 {...
```

### 📄 `screens\onboarding\OnboardingPaywall.tsx`

#### P2-STATUS-001 - ProgressBar (linha 296)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={8} totalSteps={8} />
```

#### P2-MOTION-001 - Animated.View (linha 305)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)}>
 {/* Banner Extra Care */}
 {needsExtraCareFlag && (
 <View
 style={[
 styles.extraCar...
```

#### P2-STATUS-001 - ActivityIndicator (linha 490)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={Tokens.neutral[0]} />
```

### 📄 `screens\onboarding\OnboardingEmotionalState.tsx`

#### P2-STATUS-001 - ProgressBar (linha 81)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={4} totalSteps={7} />
```

#### P2-MOTION-001 - Animated.View (linha 90)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)}>
 <Text
 style={[
 styles.title,
 {
 color: theme.text.primary,
 },...
```

#### P2-MOTION-001 - Animated.View (linha 107)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={option.state}
 entering={FadeInDown.delay(index * 80).duration(300)}
 style={styles.optionWrapper}
 >...
```

### 📄 `screens\onboarding\OnboardingDate.tsx`

#### P2-STATUS-001 - ProgressBar (linha 177)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={2} totalSteps={7} />
```

#### P2-MOTION-001 - Animated.View (linha 187)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)}>
 <Text
 style={[
 styles.title,
 {
 color: theme.text.primary,
 },...
```

### 📄 `screens\onboarding\OnboardingConcerns.tsx`

#### P2-STATUS-001 - ProgressBar (linha 106)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={3} totalSteps={7} />
```

#### P2-MOTION-001 - Animated.View (linha 115)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(100).duration(400)}>
 <Text
 style={[
 styles.title,
 {
 color: theme.text.primary...
```

#### P2-MOTION-001 - AnimatedCounter (linha 129)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedCounter current={data.concerns.length} max={3} size="medium" />
```

#### P2-MOTION-001 - Animated.View (linha 138)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={cardData.concern}
 entering={FadeInDown.delay(200 + index * 60).duration(400)}
 style={styles.cardWrapper}...
```

### 📄 `screens\onboarding\OnboardingCheckIn.tsx`

#### P2-STATUS-001 - ProgressBar (linha 126)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressBar currentStep={5} totalSteps={7} />
```

#### P2-MOTION-001 - Animated.View (linha 136)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)}>
 {/* Foto da Nath com Thales */}
 <View style={styles.imageContainer}>
 <Image
 source={CHECKIN_IMAGE}...
```

#### P2-MOTION-001 - Animated.View (linha 235)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)} style={styles.timeContainer}>
 <Text
 style={[
 styles.timeLabel,
 {...
```

### 📄 `screens\auth\ForgotPasswordScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 101)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 <Pressable
 onPress={handlePress}
 onPressIn={() => (scale.value = withSpring(0.97))}
 onPressOut={() => (scale.value = withSpring(...
```

#### P2-MOTION-001 - Animated.View (linha 206)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(300)} style={styles.header}>
 <Pressable
 onPress={() => navigation.goBack()}
 style={styles.backButton}
 accessi...
```

#### P2-MOTION-001 - Animated.View (linha 223)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(100).duration(400)}>
 <Text style={styles.title}>Esqueceu a senha?</Text>
 <Text style={styles.subtitle}>
 A...
```

#### P2-MOTION-001 - Animated.View (linha 231)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(200).duration(400)}
 style={styles.inputContainer}
 >
 <View style={styles.inputWrapper}>...
```

#### P2-MOTION-001 - Animated.View (linha 269)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
 <Ionicons name="alert-circle" size={16} color={DS.error} />
 <Text style={styles.erro...
```

#### P2-MOTION-001 - Animated.View (linha 276)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(300).duration(400)}
 style={styles.buttonContainer}
 >
 <PressableScale
 onPr...
```

#### P2-STATUS-001 - ActivityIndicator (linha 292)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={DS.white} />
```

#### P2-MOTION-001 - Animated.View (linha 305)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.duration(400)} style={styles.successContainer}>
 <View style={styles.successIcon}>
 <Ionicons name="mail-open-outline" size={48} color={...
```

#### P2-MOTION-001 - Animated.View (linha 334)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(200).duration(400)}
 style={styles.backToLoginContainer}
 >
 <PressableScale
 o...
```

### 📄 `screens\auth\EmailAuthScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 172)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[styles.inputWrapper, animatedBorderStyle, error && styles.inputError]}
 >
 <Ionicons
 name={icon as keyof typeof Ionicons.glyphMap}...
```

#### P2-MOTION-001 - Animated.View (linha 217)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.fieldErrorContainer}>
 <Ionicons name="alert-circle" size={14} color={DS.error} />
 <Text style={styles.fieldErrorT...
```

#### P2-MOTION-001 - Animated.View (linha 253)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(50)} style={styles.toggleContainer}>
 <Pressable
 onPress={onToggle}
 disabled={disabled}
 style={styles.toggleTrack}...
```

#### P2-MOTION-001 - Animated.View (linha 266)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.toggleSlider, sliderStyle]} />
```

#### P2-MOTION-001 - Animated.View (linha 310)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 <Pressable
 onPress={handlePress}
 onPressIn={() => (scale.value = withSpring(0.97))}
 onPressOut={() => (scale.value = wit...
```

#### P2-MOTION-001 - Animated.View (linha 537)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(100)}>
 <Text style={styles.title}>
 {isLogin ? "Bem-vinda de volta!" : "Crie sua conta"}
 </Text>...
```

#### P2-MOTION-001 - Animated.View (linha 552)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View layout={Layout.springify()} style={styles.form}>
 {/* Name (only for signup) */}
 {!isLogin && (
 <Animated.View entering={FadeInDown.d...
```

#### P2-MOTION-001 - Animated.View (linha 555)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(150)} exiting={FadeOut.duration(150)}>
 <AnimatedInput
 icon="person-outline"
 label="Nome"...
```

#### P2-MOTION-001 - AnimatedInput (linha 556)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedInput
 icon="person-outline"
 label="Nome"
 value={name}
 onChangeText={(text) => {...
```

#### P2-MOTION-001 - Animated.View (linha 578)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(isLogin ? 150 : 200)}>
 <AnimatedInput
 icon="mail-outline"
 label="E-mail"
 val...
```

#### P2-MOTION-001 - AnimatedInput (linha 579)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedInput
 icon="mail-outline"
 label="E-mail"
 value={email}
 onChangeText={(text) => {
 set...
```

#### P2-MOTION-001 - Animated.View (linha 600)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(isLogin ? 200 : 250)}>
 <AnimatedInput
 icon="lock-closed-outline"
 label="Senha"...
```

#### P2-MOTION-001 - AnimatedInput (linha 601)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedInput
 icon="lock-closed-outline"
 label="Senha"
 value={password}
 onChangeText={(text) => {...
```

#### P2-MOTION-001 - Animated.View (linha 627)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(300)} exiting={FadeOut.duration(150)}>
 <AnimatedInput
 icon="lock-closed-outline"
 label="Con...
```

#### P2-MOTION-001 - AnimatedInput (linha 628)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedInput
 icon="lock-closed-outline"
 label="Confirmar senha"
 value={confirmPassword}
 onChangeText={(tex...
```

#### P2-MOTION-001 - Animated.View (linha 653)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(250)}>
 <Pressable
 onPress={() => navigation.navigate("ForgotPassword")}
 style={styles.forgo...
```

#### P2-MOTION-001 - Animated.View (linha 668)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
 <Ionicons name="alert-circle" size={18} color={DS.error} />
 <Text style={styles.erro...
```

#### P2-MOTION-001 - Animated.View (linha 676)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.successContainer}>
 <Ionicons name="checkmark-circle" size={18} color={DS.success} />
 <Text style={sty...
```

#### P2-MOTION-001 - Animated.View (linha 683)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(isLogin ? 300 : 350)}
 style={styles.submitContainer}
 >
 <PressableScale onPress={handleSubmit...
```

#### P2-STATUS-001 - ActivityIndicator (linha 699)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={DS.white} size="small" />
```

#### P2-MOTION-001 - Animated.View (linha 713)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(isLogin ? 350 : 400)}
 style={styles.switchModeContainer}
 >
 <Text style={styles.switchModeTex...
```

### 📄 `screens\auth\AuthLandingScreen.tsx`

#### P2-MOTION-001 - Animated.View (linha 224)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.auroraBlob,
 {
 top: "10%",
 left: "-20%",
 width: SCREEN_WIDTH * 0.8,
 height: SCREEN_WIDT...
```

#### P2-MOTION-001 - Animated.View (linha 237)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.auroraBlob,
 {
 top: "40%",
 right: "-30%",
 width: SCREEN_WIDTH * 0.7,
 height: SCREEN_WID...
```

#### P2-MOTION-001 - Animated.View (linha 250)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.auroraBlob,
 {
 bottom: "5%",
 left: "-10%",
 width: SCREEN_WIDTH * 0.6,
 height: SCREEN_WI...
```

#### P2-MOTION-001 - Animated.View (linha 273)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
  entering={FadeIn.delay(1000).duration(800)}
  style={[styles.particle, { top: "15%", left: "10%", width: 6, height: 6 }]}
/>
```

#### P2-MOTION-001 - Animated.View (linha 277)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
  entering={FadeIn.delay(1200).duration(800)}
  style={[styles.particle, { top: "25%", right: "15%", width: 4, height: 4 }]}
/>
```

#### P2-MOTION-001 - Animated.View (linha 281)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
  entering={FadeIn.delay(1400).duration(800)}
  style={[styles.particle, { top: "35%", left: "80%", width: 5, height: 5 }]}
/>
```

#### P2-MOTION-001 - Animated.View (linha 285)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
  entering={FadeIn.delay(1600).duration(800)}
  style={[styles.particle, { top: "60%", left: "5%", width: 4, height: 4 }]}
/>
```

#### P2-MOTION-001 - Animated.View (linha 289)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
  entering={FadeIn.delay(1800).duration(800)}
  style={[styles.particle, { top: "70%", right: "20%", width: 6, height: 6 }]}
/>
```

#### P2-MOTION-001 - Animated.View (linha 327)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 <Pressable
 onPress={handlePress}
 onPressIn={() => (scale.value = withSpring(0.97))}
 onPressOut={() => (scale.value = withSpring(...
```

#### P2-STATUS-001 - ActivityIndicator (linha 382)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={isDark ? DS.white : DS.text.primary} size="small" />
```

#### P2-MOTION-001 - Animated.View (linha 444)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.heartPulse, animatedStyle]}>
  <Ionicons name="heart" size={16} color={brand.accent[500]} />
</Animated.View>
```

#### P2-MOTION-001 - Animated.View (linha 454)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.delay(800).duration(600)} style={styles.trustBadge}>
 <View style={styles.trustContent}>
 <Ionicons name="heart" size={14} color={brand.accent[500]} />...
```

#### P2-MOTION-001 - Animated.View (linha 590)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(600)} style={[styles.header, logoAnimatedStyle]}>
 <View style={styles.logoContainer}>
 <Image source={LOGO} style={styles.logo} accessib...
```

#### P2-MOTION-001 - Animated.View (linha 599)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(200).springify()}>
  <Text style={styles.headline}>Sua jornada{"\n"}comeca aqui</Text>
</Animated.View>
```

#### P2-MOTION-001 - Animated.View (linha 604)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(350).springify()}>
 <Text style={styles.subheadline}>
 Rotinas, apoio e cuidado diario{"\n"}para cada fase da{" "}
 <Tex...
```

#### P2-MOTION-001 - Animated.View (linha 612)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(450).springify()} style={styles.creatorBadge}>
 <View style={styles.creatorBadgeGradient}>
 <Text style={styles.creatorBadgeText}>por...
```

#### P2-MOTION-001 - Animated.View (linha 624)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(500).springify()}
 style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 24) }]}
 >
 {/* Error message...
```

#### P2-MOTION-001 - Animated.View (linha 630)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
 <Ionicons name="alert-circle" size={18} color={DS.error} />
 <Text style={styles.errorText}>{...
```

#### P2-MOTION-001 - Animated.View (linha 682)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(600)} style={styles.messageContainer}>
 <Text style={styles.message}>Voce nao esta sozinha</Text>
 <HeartPulse />
 </Animate...
```

#### P2-MOTION-001 - Animated.View (linha 688)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(700)} style={styles.legalContainer}>
 <Text style={styles.legal}>
 Ao continuar, voce concorda com nossos{" "}
 <Text...
```

### 📄 `screens\admin\AdminPostsListScreen.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 85)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 156)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
```

### 📄 `screens\admin\AdminDashboardScreen.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 93)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
```

#### P2-STATUS-001 - ActivityIndicator (linha 231)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
```

### 📄 `components\ui\Toast.tsx`

#### P2-MOTION-001 - Animated.View (linha 97)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.container, animatedStyle]}>
 <Pressable
 onPress={dismiss}
 style={[
 styles.toast,
 {
 backgroundColor: bgColor,...
```

### 📄 `components\ui\StickerButton.tsx`

#### P2-MOTION-001 - AnimatedPressable (linha 61)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 onPress={handlePress}
 onPressIn={handlePressIn}
 onPressOut={handlePressOut}
 accessibilityRole="button"
 accessibilityLabel={accessibility...
```

### 📄 `components\ui\SkeletonLoader.tsx`

#### P2-MOTION-001 - Animated.View (linha 86)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 className={cn(isDark ? "bg-neutral-700" : "bg-neutral-200", className)}
 style={[
 {
 width: width as DimensionValue,
 height,
 border...
```

#### P2-STATUS-001 - SkeletonLoader (linha 121)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={sizeValue} height={sizeValue} circular className={className} />
```

#### P2-STATUS-001 - SkeletonLoader (linha 141)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="60%" height={20} className="mb-3" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 142)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="100%" height={16} className="mb-2" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 143)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="80%" height={16} />
```

#### P2-STATUS-001 - AvatarSkeleton (linha 172)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<AvatarSkeleton size="md" className="mr-3" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 174)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="70%" height={16} className="mb-2" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 175)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="50%" height={14} />
```

#### P2-STATUS-001 - SkeletonLoader (linha 177)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={24} height={24} borderRadius={6} />
```

#### P2-STATUS-001 - SkeletonLoader (linha 212)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={200} height={14} className="mb-2" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 213)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={150} height={14} className="mb-2" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 214)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={100} height={14} />
```

#### P2-STATUS-001 - SkeletonLoader (linha 244)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="100%" height={140} borderRadius={16} className="mb-4" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 247)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="40%" height={24} className="mb-3" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 248)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="100%" height={16} className="mb-2" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 249)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="90%" height={16} className="mb-4" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 252)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="50%" height={44} borderRadius={16} />
```

#### P2-STATUS-001 - AvatarSkeleton (linha 276)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<AvatarSkeleton size="md" className="mr-3" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 278)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={120} height={14} className="mb-1" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 279)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={80} height={12} />
```

#### P2-STATUS-001 - SkeletonLoader (linha 284)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="100%" height={14} className="mb-2" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 285)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="95%" height={14} className="mb-2" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 286)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width="60%" height={14} className="mb-4" />
```

#### P2-STATUS-001 - SkeletonLoader (linha 290)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={60} height={24} borderRadius={12} />
```

#### P2-STATUS-001 - SkeletonLoader (linha 291)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={60} height={24} borderRadius={12} />
```

#### P2-STATUS-001 - SkeletonLoader (linha 292)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonLoader width={60} height={24} borderRadius={12} />
```

#### P2-STATUS-001 - SkeletonComponent (linha 325)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<SkeletonComponent key={index} />
```

### 📄 `components\ui\ScreenHeader.tsx`

#### P2-MOTION-001 - Animated.View (linha 266)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(500).springify()}>{content}</Animated.View>
```

### 📄 `components\ui\RowCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 81)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(animationDelay).duration(500).springify()}>
 <Pressable
 onPress={handlePress}
 accessibilityLabel={accessibilityLabel || title}...
```

### 📄 `components\ui\PressableScale.tsx`

#### P2-MOTION-001 - AnimatedPressable (linha 123)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 onPress={onPress}
 onPressIn={handlePressIn}
 onPressOut={handlePressOut}
 disabled={disabled}
 accessibilityRole="button"
 accessibilityState={...
```

### 📄 `components\ui\PremiumEmptyState.tsx`

#### P2-MOTION-001 - Animated.View (linha 50)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
 {/* Avatar/Image Circle */}
 <View
 style={[
 styles.imageCircle,
 { borderColo...
```

### 📄 `components\ui\PremiumCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 156)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.card,
 {
 padding,
 borderRadius,
 borderWidth: animatedBorder ? 0 : 1,
 borderColor: variantStyles.borde...
```

#### P2-MOTION-001 - AnimatedPressable (linha 206)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 onPress={handlePress}
 onPressIn={handlePressIn}
 onPressOut={handlePressOut}
 style={[animatedContainerStyle, { minHeight: accessibility.minTapTarg...
```

#### P2-MOTION-001 - Animated.View (linha 219)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedContainerStyle}>{wrappedContent}</Animated.View>
```

### 📄 `components\ui\LoadingState.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 25)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size={size} color={brand.primary[500]} />
```

### 📄 `components\ui\LoadingDots.tsx`

#### P2-MOTION-001 - AnimatedDot (linha 99)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedDot
 key={index}
 size={currentSize.dot}
 color={getColor(index)}
 delay={index * 150}
 marginLeft={index > 0 ? currentSize.gap : 0}...
```

#### P2-MOTION-001 - Animated.View (linha 171)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 width: size,
 height: size,
 borderRadius: size / 2,
 backgroundColor: color,
 marginLeft,
 },...
```

### 📄 `components\ui\GlowEffect.tsx`

#### P2-MOTION-001 - Animated.View (linha 83)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.glow,
 {
 backgroundColor: color,
 shadowColor: color,
 shadowOffset: { width: 0, height: 0 },...
```

#### P2-MOTION-001 - Animated.View (linha 164)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.pulseGlow,
 {
 backgroundColor: color,
 borderRadius: 9999,
 position: "absolute",
 top: -s...
```

#### P2-MOTION-001 - Animated.View (linha 238)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 position: "absolute",
 top: 0,
 left: 0,
 width: width * 0.5,
 height: "100%",
 b...
```

### 📄 `components\ui\FloCleanCard.tsx`

#### P2-MOTION-001 - AnimatedPressable (linha 79)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 onPress={onPress}
 onPressIn={handlePressIn}
 onPressOut={handlePressOut}
 style={animatedStyle}
 accessibilityRole="button"
 access...
```

### 📄 `components\ui\FAB.tsx`

#### P2-MOTION-001 - Animated.View (linha 159)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(animationDelay).duration(400)}>
  {buttonContent}
</Animated.View>
```

### 📄 `components\ui\EmptyState.tsx`

#### P2-MOTION-001 - Animated.View (linha 132)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={animated ? FadeIn.delay(100).duration(400) : undefined}
 className={cn(ICON_CONTAINER_CLASSES[variant], isDark ? "bg-primary-900" : "bg-primary-50")}...
```

#### P2-MOTION-001 - Animated.Text (linha 149)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={animated ? FadeInUp.delay(200).duration(400) : undefined}
 className={cn(
 "text-center font-bold",
 variant === "compact" ? "text-base" :...
```

#### P2-MOTION-001 - Animated.Text (linha 163)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
 entering={animated ? FadeInUp.delay(300).duration(400) : undefined}
 className={cn(
 "text-center text-[15px] leading-[22px] max-w-[280px]",...
```

#### P2-MOTION-001 - Animated.View (linha 177)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={animated ? FadeInUp.delay(350).duration(400) : undefined}
 className="flex-row flex-wrap justify-center gap-2 mb-5 max-w-[320px]"
 >
 {s...
```

#### P2-MOTION-001 - Animated.View (linha 219)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={animated ? FadeInUp.delay(400).duration(400) : undefined}>
 <Pressable
 onPress={handleAction}
 accessibilityRole="button"
 acces...
```

#### P2-MOTION-001 - Animated.View (linha 240)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(300)}>{content}</Animated.View>
```

#### P2-MOTION-001 - Animated.View (linha 245)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={animated ? FadeIn.duration(300) : undefined} className="flex-1">
  {content}
</Animated.View>
```

### 📄 `components\ui\Card.tsx`

#### P2-MOTION-001 - Animated.View (linha 137)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(animationDelay).duration(500).springify()}
 className={cardClassName}
 style={style}
 {...props}
 >
 {children}...
```

#### P2-MOTION-001 - Animated.View (linha 174)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(animationDelay).duration(500).springify()}
 className={cardClassName}
 style={style}
 {...props}
 >
 {children}...
```

### 📄 `components\ui\Button.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 353)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={textColor} />
```

#### P2-MOTION-001 - AnimatedPressable (linha 402)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 {...accessibilityProps}
 accessibilityRole="button"
 accessibilityState={{ disabled: isDisabled }}
 onPress={handlePress}
 onPress...
```

#### P2-MOTION-001 - Animated.View (linha 430)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 {
 position: "absolute",
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,...
```

#### P2-MOTION-001 - AnimatedPressable (linha 451)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 {...accessibilityProps}
 accessibilityRole="button"
 accessibilityState={{ disabled: isDisabled }}
 onPress={handlePress}
 onPress...
```

#### P2-MOTION-001 - AnimatedPressable (linha 481)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 {...accessibilityProps}
 accessibilityRole="button"
 accessibilityState={{ disabled: isDisabled }}
 onPress={handlePress}
 onPressIn={handle...
```

### 📄 `components\ui\AppCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 115)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
  entering={FadeInUp.delay(animationDelay).duration(500).springify()}
  style={combinedStyle}
  {...props}
>
  {children}
</Animated.View>
```

### 📄 `components\ui\AppButton.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 128)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={currentVariant.text} />
```

### 📄 `components\ui\AnimatedBadge.tsx`

#### P2-MOTION-001 - Animated.View (linha 313)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[styles.container, containerStyle, style]}
 accessibilityLabel={a11yLabel}
 accessibilityRole="text"
 >
 {/* Glow effect layer */}
 <Animated.V...
```

#### P2-MOTION-001 - Animated.View (linha 319)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.glow,
 {
 backgroundColor: colors.glow,
 borderRadius: radius.full,
 },
 glowStyle,
 ]}...
```

#### P2-MOTION-001 - AnimatedBadge (linha 388)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedBadge
  type="streak"
  value={days}
  size={size}
  animated={animate}
  celebrate={isMilestone}
  style={style}
/>
```

#### P2-MOTION-001 - AnimatedBadge (linha 433)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedBadge
  type="achievement"
  label={title}
  icon={icon}
  size={size}
  animated
  celebrate={unlocked}
  style={combinedStyle}
/>
```

### 📄 `components\premium\PaywallGate.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 71)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={Tokens.brand.primary[500]} />
```

### 📄 `components\paywall\PremiumBadge.tsx`

#### P2-MOTION-001 - Animated.View (linha 107)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.badgeContainer, glowStyle]}>
 <Animated.View style={animatedStyle}>
 <LinearGradient
 colors={[goldColor, Tokens.semantic.light.warning, Tok...
```

#### P2-MOTION-001 - Animated.View (linha 108)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 <LinearGradient
 colors={[goldColor, Tokens.semantic.light.warning, Tokens.premium.special.goldDark]}
 start={{ x: 0, y: 0 }}...
```

### 📄 `components\paywall\PlanCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 55)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(delay).duration(400).springify()}>
 <Pressable
 onPress={handlePress}
 accessibilityRole="radio"
 accessibilityLabel={`${p...
```

#### P2-MOTION-001 - Animated.View (linha 63)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[styles.planCard, isSelected && styles.planCardSelected, animatedStyle]}
 >
 {/* Popular badge */}
 {isPopular && (...
```

### 📄 `components\paywall\FloatingOrb.tsx`

#### P2-MOTION-001 - Animated.View (linha 75)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.orb,
 {
 width: size,
 height: size,
 borderRadius: size / 2,
 backgroundColor: color,...
```

### 📄 `components\paywall\FeatureItem.tsx`

#### P2-MOTION-001 - Animated.View (linha 19)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(delay).duration(400).springify()}
 style={styles.featureItem}
 >
 <View style={styles.featureIcon}>
 <Ionicons
 name={i...
```

### 📄 `components\paywall\CTAButton.tsx`

#### P2-MOTION-001 - Animated.View (linha 81)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.ctaShadow, !disabled && glowStyle]}>
 <Animated.View style={animatedStyle}>
 <LinearGradient
 colors={
 disabled...
```

#### P2-MOTION-001 - Animated.View (linha 82)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 <LinearGradient
 colors={
 disabled
 ? [overlay.lightInvertedMedium, overlay.lightInverted]...
```

#### P2-STATUS-001 - ActivityIndicator (linha 94)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={premium.text.primary} size="small" />
```

### 📄 `components\onboarding\VideoPlayer.tsx`

#### P2-STATUS-001 - ActivityIndicator (linha 132)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
```

### 📄 `components\onboarding\StageCard.tsx`

#### P2-MOTION-001 - AnimatedView (linha 68)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedView style={[styles.card, animatedCardStyle, animatedSelectionStyle]}>
 {/* Gradient Background com Icone */}
 <View style={styles.gradientContainer}>
 <LinearGradie...
```

#### P2-MOTION-001 - Animated.View (linha 90)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.checkmarkContainer, animatedCheckmarkStyle]}>
 <LinearGradient
 colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
 sty...
```

### 📄 `components\onboarding\ProgressBar.tsx`

#### P2-MOTION-001 - Animated.View (linha 67)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedBarStyle}>
 <LinearGradient
 colors={Tokens.gradients.accent}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y: 0 }}
 sty...
```

### 📄 `components\onboarding\PremiumCard.tsx`

#### P2-MOTION-001 - AnimatedPressable (linha 67)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
 onPress={disabled ? undefined : onPress}
 onPressIn={onPress ? handlePressIn : undefined}
 onPressOut={onPress ? handlePressOut : undefined}
 disabled={disa...
```

#### P2-MOTION-001 - AnimatedView (linha 78)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedView
 style={[
 styles.card,
 animatedBorderStyle,
 disabled && !isSelected && styles.cardDisabled,
 style,
 ]}
 >
 {/* G...
```

### 📄 `components\onboarding\FloatingBubbles.tsx`

#### P2-MOTION-001 - Animated.View (linha 128)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.bubble,
 {
 backgroundColor: color,
 width: size,
 height: size,
 borderRadius: size / 2,
 top:...
```

### 📄 `components\onboarding\ConcernCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 97)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
 <View style={[styles.iconCircle, { backgroundColor: `${data.iconColor}20` }]}>
 <Ionicons
 name={da...
```

#### P2-MOTION-001 - Animated.View (linha 108)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.badge, animatedBadgeStyle]}>
 <LinearGradient
 colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
 style={styles.badgeGradien...
```

#### P2-MOTION-001 - AnimatedView (linha 152)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedView
 style={[
 styles.card,
 { backgroundColor: theme.surface.card },
 animatedCardStyle,
 disabled && !isSelected && styles.cardDis...
```

#### P2-MOTION-001 - AnimatedView (linha 172)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedView
 style={[
 styles.card,
 { backgroundColor: theme.surface.card },
 animatedCardStyle,
 disabled && !isSelected && styles.cardDisabled,...
```

### 📄 `components\onboarding\AbstractHero.tsx`

#### P2-MOTION-001 - Animated.View (linha 41)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(800)}
 style={[styles.container, { height }, style]}
 accessibilityElementsHidden
 importantForAccessibility="no-hide-descendants"...
```

### 📄 `components\login\SocialButton.tsx`

#### P2-MOTION-001 - Animated.View (linha 42)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 <Pressable
 onPress={handlePress}
 onPressIn={() => {
 scale.value = withSpring(0.97, { damping: 15 });
 }}...
```

#### P2-STATUS-001 - ActivityIndicator (linha 65)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator color={premium.text.primary} size="small" />
```

### 📄 `components\login\FloatingParticle.tsx`

#### P2-MOTION-001 - Animated.View (linha 112)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.particle,
 {
 left: particle.x,
 top: particle.y,
 width: particle.size,
 height: particle.size,...
```

### 📄 `components\login\EmailInput.tsx`

#### P2-MOTION-001 - Animated.View (linha 42)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[styles.inputContainer, animatedBorderStyle, error && styles.inputError]}
 >
 <Ionicons
 name="mail-outline"
 size={18}...
```

#### P2-MOTION-001 - Animated.View (linha 67)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(200)} style={styles.errorContainer}>
 <Ionicons name="alert-circle" size={14} color={semantic.dark.error} />
 <Text style={styles.e...
```

### 📄 `components\home\QuickActionsBar.tsx`

#### P2-MOTION-001 - Animated.View (linha 70)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.actionWrapper, animatedStyle]}>
 <Pressable
 onPress={onPress}
 onPressIn={handlePressIn}
 onPressOut={handlePressOut}
 accessibilit...
```

#### P2-MOTION-001 - Animated.View (linha 153)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(200).duration(500)}
 style={[
 styles.container,
 {
 backgroundColor: cardBg,
 borderColor,
 },...
```

### 📄 `components\home\ProgressSection.tsx`

#### P2-STATUS-001 - ProgressRing (linha 68)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ProgressRing progress={habitsProgress} size={56} strokeWidth={5} isDark={isDark} />
```

### 📄 `components\home\ProgressRing.tsx`

#### P2-MOTION-001 - AnimatedCircle (linha 89)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedCircle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 stroke="url(#progressGradient)"
 strokeWidth={strokeWidth}
 fill="transparent"...
```

### 📄 `components\home\NathiaAdviceCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 67)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(100).duration(500)}>
 <Pressable
 onPress={handlePress}
 accessibilityLabel="Conselho da NathIA"
 accessibilityRole="button"...
```

### 📄 `components\home\InstagramSentimentBar.tsx`

#### P2-MOTION-001 - Animated.View (linha 206)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 accessible
 accessibilityRole="adjustable"
 accessibilityLabel={accessibilityLabel}
 accessibilityValue={{
 min: 0,...
```

#### P2-MOTION-001 - Animated.View (linha 228)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.trackFill, { backgroundColor: trackFillColor }, fillStyle]} />
```

#### P2-MOTION-001 - Animated.View (linha 237)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 style={[
 styles.thumb,
 {
 borderColor: thumbBorderColor,
 backgroundColor: isDark ? colors.neutral[8...
```

#### P2-MOTION-001 - Animated.Text (linha 259)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
  style={[styles.label, { color: isDark ? colors.neutral[500] : colors.neutral[400] }]}
>
  BAIXO
</Animated.Text>
```

#### P2-MOTION-001 - Animated.Text (linha 264)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.Text
  style={[styles.label, { color: isDark ? colors.neutral[500] : colors.neutral[400] }]}
>
  ALTO
</Animated.Text>
```

### 📄 `components\home\HeroCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 60)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={cardAnimatedStyle}>
 <Pressable
 onPress={onPress}
 style={({ pressed }) => [
 styles.heroCard,
 {
 borderColor:...
```

#### P2-MOTION-001 - Animated.View (linha 136)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.heroCTA, ctaGlowStyle]}>
 <LinearGradient
 colors={[ctaPrimary.main, ctaPrimary.light]}
 start={{ x: 0, y: 0 }}...
```

### 📄 `components\home\HealthInsightCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 92)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(150).duration(500)}>
 <Pressable
 onPress={handlePrimaryAction}
 accessibilityLabel={`Insight de saúde: ${topInsight.title}`}
 acc...
```

#### P2-MOTION-001 - Animated.View (linha 143)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInRight.delay(200).duration(300)}>
 <Pressable
 onPress={handlePrimaryAction}
 style={({ pressed }) => [
 s...
```

### 📄 `components\home\FeatureCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 42)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={staggeredFadeUp(index, 80)}>
 <PressableScale onPress={onPress} spring="snappy">
 <View
 accessibilityLabel={title}
 accessibilityRol...
```

### 📄 `components\home\EmotionalCheckInPrimary.tsx`

#### P2-MOTION-001 - Animated.View (linha 162)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(400)}
 style={[
 styles.feedbackContainer,
 {
 backgroundColor: isDark ? colors.neutral[800] : brand...
```

### 📄 `components\home\BelongingCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 56)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.delay(150).duration(500)} style={animatedStyle}>
 <Pressable
 onPress={handlePress}
 onPressIn={handlePressIn}
 onPressOut={handlePressO...
```

### 📄 `components\community\ReportModal.tsx`

#### P2-MOTION-001 - AnimatedPressable (linha 146)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<AnimatedPressable
  entering={FadeIn.duration(200)}
  exiting={FadeOut.duration(200)}
  style={styles.backdrop}
  onPress={handleClose}
/>
```

#### P2-MOTION-001 - Animated.View (linha 154)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={SlideInDown.springify().damping(20)}
 exiting={SlideOutDown.springify().damping(20)}
 style={[styles.modal, { paddingBottom: insets.bottom + spa...
```

#### P2-MOTION-001 - Animated.View (linha 173)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(300)} style={styles.successContainer}>
 <View style={styles.successIcon}>
 <Ionicons name="checkmark-circle" size={64} color={sem...
```

#### P2-MOTION-001 - Animated.View (linha 243)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.descriptionContainer}>
 <Text style={styles.sectionTitle}>
 Detalhes adicionais <Text style={styles.o...
```

#### P2-MOTION-001 - Animated.View (linha 264)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
 <Ionicons name="alert-circle" size={20} color={semantic.light.error} />
 <Text style=...
```

#### P2-STATUS-001 - ActivityIndicator (linha 293)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={neutral[0]} />
```

### 📄 `components\community\QuickComposerCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 69)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.duration(400).springify()}
 style={[animatedStyle, styles.container]}
 >
 <Pressable
 onPress={handlePress}
 onPr...
```

### 📄 `components\community\PostTypeSelector.tsx`

#### P2-MOTION-001 - Animated.View (linha 92)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.typeButtonWrapper, animatedStyle]}>
 <Pressable
 onPress={handlePress}
 onPressIn={handlePressIn}
 onPressOut={handlePressOut}
 disa...
```

### 📄 `components\community\PostStatusBadge.tsx`

#### P2-MOTION-001 - Animated.View (linha 77)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(200)}
 style={[
 styles.badge,
 {
 backgroundColor: config.bgColor,
 borderColor: config.borderCol...
```

### 📄 `components\community\PostCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 70)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(index * 60)
 .duration(450)
 .springify()}
 style={[styles.container, animatedStyle]}
 >
 <Pressable...
```

### 📄 `components\community\NewPostModal.tsx`

#### P2-MOTION-001 - Animated.View (linha 201)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeIn.duration(200)}
 style={[
 styles.header,
 {
 paddingTop: insets.top + spacing.md,
 borderBottom...
```

#### P2-MOTION-001 - Animated.View (linha 222)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={submitAnimatedStyle}>
 <Pressable
 onPress={handleSubmit}
 onPressIn={handleSubmitPressIn}
 onPressOut={handleSubmitPressOut...
```

#### P2-STATUS-001 - ActivityIndicator (linha 236)

- **WCAG:** 4.1.3 (AA)
- **Categoria:** STATE
- **Confiança:** MEDIUM
- **Problema:** Componente de status sem accessibilityLiveRegion
- **Correção:** Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"
- ✅ **Autofixável**

```jsx
<ActivityIndicator size="small" color={neutral[0]} />
```

#### P2-MOTION-001 - Animated.View (linha 251)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.userRow}>
 <Avatar
 size={48}
 source={user?.avatarUrl ? { uri: user.avatarUrl } : n...
```

#### P2-MOTION-001 - Animated.View (linha 268)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(150).duration(300)}>
 <PostTypeSelector
 selectedType={postType}
 onSelectType={setPostType}
 disabled={...
```

#### P2-MOTION-001 - Animated.View (linha 277)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(200).duration(300)}
 style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}
 >
 <TextInput...
```

#### P2-MOTION-001 - Animated.View (linha 304)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.duration(300)} style={styles.mediaPreview}>
 {mediaType === "image" ? (
 <Image
 source={{ uri: selectedMedia }}...
```

#### P2-MOTION-001 - Animated.View (linha 330)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(250).duration(300)} style={styles.mediaButtons}>
 <Pressable
 onPress={handlePickImage}
 disabled={isSubmitting}...
```

### 📄 `components\community\ModerationInfoCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 33)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.container}>
 <View style={styles.header}>
 <View style={styles.iconContainer}>
 <Ionicons name...
```

### 📄 `components\community\EmptyStateCommunity.tsx`

#### P2-MOTION-001 - Animated.View (linha 131)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInUp.duration(400).springify()} style={styles.container}>
 {/* Icon */}
 <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>...
```

#### P2-MOTION-001 - Animated.View (linha 143)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedButtonStyle}>
 <Pressable
 onPress={handlePress}
 onPressIn={handlePressIn}
 onPressOut={handlePressOut}...
```

#### P2-MOTION-001 - Animated.View (linha 165)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(200).duration(400)}
 style={styles.templatesContainer}
 >
 <Text style={styles.templatesTitle}>Ou escolha um iníc...
```

### 📄 `components\community\CommunityPostCardPremium.tsx`

#### P2-MOTION-001 - Animated.View (linha 127)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.duration(500).springify()}
 style={[styles.container, premiumShadow, { backgroundColor: bgCard }]}
 >
 {/* Header */}
 <View st...
```

#### P2-MOTION-001 - Animated.View (linha 212)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={likeAnimatedStyle}>
 <Ionicons
 name={liked ? "heart" : "heart-outline"}
 size={24}
 color={liked ? Tokens.brand.acc...
```

### 📄 `components\community\CommunityPostCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 218)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(index * 60).duration(450)}
 style={[styles.container, animatedStyle]}
 >
 <Pressable
 onPress={() => onPress(post.id)}...
```

### 📄 `components\chat\VoiceRecordingInput.tsx`

#### P2-MOTION-001 - Animated.View (linha 52)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
  entering={FadeIn}
  style={[styles.recordingDot, { backgroundColor: semantic.light.error }]}
/>
```

### 📄 `components\chat\MessageBubble.tsx`

#### P2-MOTION-001 - Animated.View (linha 77)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.cursor, animatedStyle]}>
  <View style={styles.cursorBar} />
</Animated.View>
```

#### P2-MOTION-001 - Animated.View (linha 102)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(Math.min(index * 15, 150)).duration(250)}
 className={cn("flex-row mb-3 px-3", isUser ? "justify-end" : "justify-start")}
 >
 {/* Message...
```

### 📄 `components\chat\ChatInputAreaPremium.tsx`

#### P2-MOTION-001 - Animated.View (linha 167)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn.duration(200)} style={styles.imagePreviewContainer}>
 <Image
 source={{ uri: imageUri }}
 style={styles.imagePreview}...
```

#### P2-MOTION-001 - Animated.View (linha 221)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.sendButtonGlow, glowAnimatedStyle]} />
```

### 📄 `components\chat\ChatInputArea.tsx`

#### P2-MOTION-001 - Animated.View (linha 146)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeIn} style={styles.imagePreviewContainer}>
 <Image
 source={{ uri: selectedImage.uri }}
 style={styles.imagePreview}
 accessib...
```

### 📄 `components\chat\ChatHistorySidebar.tsx`

#### P2-MOTION-001 - Animated.View (linha 67)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={SlideInLeft.duration(300)}
 exiting={SlideOutLeft.duration(300)}
 style={[styles.sidebar, { paddingTop: insets.top, backgroundColor: bgSidebar }...
```

### 📄 `components\chat\ChatEmptyState.tsx`

#### P2-MOTION-001 - Animated.View (linha 90)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.welcomeCard}>
 <LinearGradient
 colors={[brand.accent[50], Tokens.brand.accent[100]]}
 style={st...
```

#### P2-MOTION-001 - Animated.View (linha 143)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 key={index}
 entering={FadeInUp.delay(500 + index * 80).springify()}
 style={styles.promptItem}
 >
 <Pressable...
```

### 📄 `components\onboarding\stories\StoryButton.tsx`

#### P2-MOTION-001 - Animated.View (linha 87)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[animatedStyle, isPrimary && glowStyle]}>
 {isPrimary ? (
 <LinearGradient
 colors={
 disabled
 ? [GLASS.bor...
```

### 📄 `components\onboarding\stories\SelectionCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 71)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 {/* Glow effect */}
 <Animated.View
 style={[styles.cardGlow, glowStyle, isCompact && styles.cardGlowCompact]}
 />...
```

#### P2-MOTION-001 - Animated.View (linha 73)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={[styles.cardGlow, glowStyle, isCompact && styles.cardGlowCompact]} />
```

### 📄 `components\onboarding\stories\ObjectiveChip.tsx`

#### P2-MOTION-001 - Animated.View (linha 53)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View style={animatedStyle}>
 <View style={[styles.chip, selected && styles.chipSelected]}>
 <Ionicons name={icon} size={18} color={selected ? brand.accent[300] : TEXT.b...
```

### 📄 `components\onboarding\stories\NathSpeaks.tsx`

#### P2-MOTION-001 - Animated.View (linha 21)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInUp.delay(delay).duration(500).springify()}
 style={styles.nathContainer}
 >
 <View style={styles.nathAvatarWrap}>
 <Image
 sourc...
```

### 📄 `components\onboarding\stories\EpisodeCard.tsx`

#### P2-MOTION-001 - Animated.View (linha 20)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(delay).duration(400).springify()}
 style={styles.episodeCard}
 >
 <View style={styles.episodeDay}>
 <Text style={styles.episode...
```

### 📄 `components\onboarding\stories\EmotionalOption.tsx`

#### P2-MOTION-001 - Animated.View (linha 27)

- **WCAG:** 2.3.3 (AAA)
- **Categoria:** MOTION
- **Confiança:** MEDIUM
- **Problema:** Componente animado pode não respeitar preferência de reduced motion
- **Correção:** Usar useReducedMotion() de react-native-reanimated e condicionar animações

```jsx
<Animated.View
 entering={FadeInDown.delay(350 + index * 60).duration(300)}
 style={styles.emotionalItem}
 >
 <Pressable
 onPress={() => {
 onSelect...
```

## 🔍 Verificações Manuais Necessárias

Os itens abaixo têm baixa confiança e precisam de revisão manual:

- **screens\RestSoundsScreen.tsx:344** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\RestSoundsScreen.tsx:404** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreenRedesign.tsx:369** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreenRedesign.tsx:438** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreenRedesign.tsx:497** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreenRedesign.tsx:703** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:522** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:569** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:616** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:816** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:864** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:911** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:1285** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ProfileScreen.tsx:1307** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\PostDetailScreen.tsx:75** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\PostDetailScreen.tsx:89** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NotificationPreferencesScreen.tsx:475** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NotificationPreferencesScreen.tsx:566** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NotificationPreferencesScreen.tsx:611** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NotificationPermissionScreen.tsx:181** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NotificationPermissionScreen.tsx:253** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NotificationPermissionScreen.tsx:485** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NewPostScreen.tsx:149** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NewPostScreen.tsx:158** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NathIADisabledScreen.tsx:197** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\NathIADisabledScreen.tsx:223** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MyPostsScreen.tsx:167** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MyCareScreen.tsx:126** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MyCareScreen.tsx:150** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MyCareScreen.tsx:181** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MyCareScreen.tsx:206** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MundoDaNathScreenRedesign.tsx:188** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MundoDaNathScreenRedesign.tsx:423** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MundoDaNathScreen.tsx:306** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\MundoDaNathScreen.tsx:520** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\HomeScreenRedesign.tsx:429** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\HomeScreenRedesign.tsx:541** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\HabitsScreen.tsx:82** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\HabitsEnhancedScreen.tsx:227** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\DailyLogScreenRedesign.tsx:398** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\DailyLogScreenRedesign.tsx:453** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\DailyLogScreenRedesign.tsx:526** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\DailyLogScreen.tsx:213** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\DailyLogScreen.tsx:266** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\DailyLogScreen.tsx:315** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\CycleTrackerScreenRedesign.tsx:365** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\CycleTrackerScreenRedesign.tsx:408** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\CycleTrackerScreen.tsx:294** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\CommunityScreenRedesign.tsx:411** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\CommunityScreenRedesign.tsx:554** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\CommunityScreenRedesign.tsx:577** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ComingSoonScreen.tsx:352** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\ComingSoonScreen.tsx:385** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\AIConsentScreen.tsx:279** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\AIConsentScreen.tsx:319** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\AIConsentScreen.tsx:341** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\AIConsentScreen.tsx:367** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\AffirmationsScreenRedesign.tsx:279** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **navigation\MainTabNavigator.tsx:146** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\DailyCheckIn.tsx:169** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\DailyCheckIn.tsx:292** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\DailyCheckIn.tsx:472** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\CommunityComposer.tsx:184** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\CommunityComposer.tsx:226** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\CommunityComposer.tsx:295** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\premium\PaywallScreenRedesign.tsx:318** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\premium\PaywallScreenRedesign.tsx:413** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\premium\PaywallScreenRedesign.tsx:475** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\premium\PaywallScreenRedesign.tsx:569** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingWelcomeRedesign.tsx:369** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingWelcomePremium.tsx:222** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingWelcomePremium.tsx:242** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSummary.tsx:150** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSummary.tsx:248** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSummary.tsx:289** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSummary.tsx:326** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSummary.tsx:353** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSummary.tsx:379** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingStage.tsx:106** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingStage.tsx:168** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSeason.tsx:118** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSeason.tsx:155** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingSeason.tsx:255** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingPaywall.tsx:497** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingPaywall.tsx:517** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingEmotionalState.tsx:73** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingEmotionalState.tsx:112** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingEmotionalState.tsx:215** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingDate.tsx:169** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingDate.tsx:236** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingDate.tsx:290** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingConcerns.tsx:97** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingConcerns.tsx:165** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingCheckIn.tsx:118** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingCheckIn.tsx:246** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\onboarding\OnboardingCheckIn.tsx:307** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\auth\ForgotPasswordScreen.tsx:323** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\auth\ForgotPasswordScreen.tsx:338** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\auth\EmailAuthScreen.tsx:254** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\auth\EmailAuthScreen.tsx:654** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\auth\EmailAuthScreen.tsx:720** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\auth\AuthLandingScreen.tsx:691** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\auth\AuthLandingScreen.tsx:700** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\admin\AdminDashboardScreen.tsx:170** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **screens\admin\AdminDashboardScreen.tsx:203** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\Toast.tsx:98** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\Toast.tsx:115** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\RowCard.tsx:82** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\ErrorState.tsx:72** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\EmptyState.tsx:182** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\EmptyState.tsx:220** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\Badge.tsx:181** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\ui\AlertModal.tsx:93** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\premium\PaywallGate.tsx:115** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\premium\PaywallGate.tsx:209** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\paywall\PlanCard.tsx:56** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\onboarding\StageCard.tsx:59** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\onboarding\AnimatedCounter.tsx:75** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\QuickActionsBar.tsx:71** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\ProgressSection.tsx:50** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\NathiaAdviceCard.tsx:68** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\HeroCard.tsx:61** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\HealthInsightCard.tsx:93** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\FeatureCard.tsx:44** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\EmotionalCheckInPrimary.tsx:174** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\home\BelongingCard.tsx:57** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\ReportModal.tsx:194** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\ReportModal.tsx:272** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\QuickComposerCard.tsx:73** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\QuickComposerCard.tsx:125** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\QuickComposerCard.tsx:137** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\QuickComposerCard.tsx:149** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\PostTypeSelector.tsx:93** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\PostCard.tsx:76** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\PostCard.tsx:93** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\PostCard.tsx:173** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\PostCard.tsx:200** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\NewPostModal.tsx:194** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\NewPostModal.tsx:331** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\NewPostModal.tsx:342** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\EmptyStateCommunity.tsx:144** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\EmptyStateCommunity.tsx:172** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\ComposerCard.tsx:67** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\ComposerCard.tsx:114** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\CommunityPostCard.tsx:325** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\community\CommunityPostCard.tsx:348** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\chat\ChatInputAreaPremium.tsx:151** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\chat\ChatInputArea.tsx:124** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\chat\ChatHistorySidebar.tsx:67** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\chat\ChatHistorySidebar.tsx:89** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\chat\ChatHistorySidebar.tsx:111** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\chat\ChatEmptyState.tsx:148** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\admin\AdminPostCard.tsx:107** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\admin\AdminPostCard.tsx:166** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\admin\AdminPostCard.tsx:180** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\onboarding\stories\SelectionCard.tsx:60** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\onboarding\stories\ObjectiveChip.tsx:42** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)
- **components\onboarding\stories\EmotionalOption.tsx:31** - accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)

## 🔑 Fingerprints (para baseline)

```
3764c89eb03e721d | P0-NAME-001 | screens\ProfileScreenRedesign.tsx:362
c75dc7993b4646b3 | P0-NAME-001 | screens\HomeScreenRedesign.tsx:347
ff66dd7844d5d7f2 | P0-NAME-001 | screens\HomeScreenRedesign.tsx:363
1669370050e88ea2 | P0-NAME-001 | screens\HomeScreenRedesign.tsx:397
a2bc13f20ef41cbb | P0-NAME-001 | screens\DailyLogScreenRedesign.tsx:380
dde9a79ea6c3ce57 | P0-NAME-001 | screens\CommunityScreenRedesign.tsx:209
96de3342efa008a1 | P0-NAME-001 | screens\CommunityScreenRedesign.tsx:333
52d101964e0ffe36 | P0-NAME-001 | screens\CommunityScreenRedesign.tsx:370
31387db1b810a1cd | P0-NAME-001 | screens\AIConsentScreen.tsx:289
cd6a2d12282a6272 | P0-NAME-001 | screens\AffirmationsScreenRedesign.tsx:177
d806c4af71e37031 | P0-NAME-001 | screens\AffirmationsScreenRedesign.tsx:191
06cf5e276babda61 | P0-NAME-001 | screens\premium\PaywallScreen.tsx:239
1fd7d4173ae8abe6 | P0-NAME-001 | screens\premium\PaywallScreen.tsx:361
71aad032c9f723b8 | P0-NAME-001 | screens\premium\PaywallScreen.tsx:377
62c21721be4a1a88 | P0-NAME-001 | components\home\EmotionalCheckInPrimary.tsx:153
0a01ee6933ac797f | P0-NAME-001 | components\admin\AdminLoginModal.tsx:68
2962e41d17ce37d3 | P1-TARGET-HIG-001 | screens\ProfileScreenRedesign.tsx:253
bc8a604549bf0698 | P1-MODAL-001 | screens\ProfileScreenRedesign.tsx:524
a9e5975771ad86a2 | P0-INPUT-001 | screens\ProfileScreenRedesign.tsx:575
ea081a9d7bcecbe5 | P0-INPUT-001 | screens\ProfileScreenRedesign.tsx:641
... e mais 453 findings
```
