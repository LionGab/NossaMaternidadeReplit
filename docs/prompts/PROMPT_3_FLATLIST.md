════════════════════════════════════════════════════════════
CLAUDE CODE PROMPT - COPIAR ABAIXO
════════════════════════════════════════════════════════════

⚙️ TASK: Converter ScrollView → FlatList em CommunityScreen
📋 TYPE: performance
🎯 DONE: FlatList implementado, 50% menos memória, scroll suave com 20+ posts

──────────────────────────────────────────────────────────────
📍 SETUP CHECK
──────────────────────────────────────────────────────────────

1. Leia @CLAUDE.md → performance optimization patterns
2. git status → branch limpo
3. Localize componente: src/screens/CommunityScreen.tsx (linhas 423-460)
4. Baseline memory: verificar React DevTools Profiler (antes/depois)

──────────────────────────────────────────────────────────────
🧭 WORKFLOW: PERFORMANCE (Baseline → Plan → Optimize → Measure)
──────────────────────────────────────────────────────────────

1. BASELINE (ANTES)
   - Abrir CommunityScreen em app
   - React DevTools Profiler: iniciar recording
   - Scroll até o final (20-30 posts)
   - Medir: FPS, re-renders, render time
   - Baseline: [registrar números]
   - Tomar screenshot do Profiler

2. PLAN MODE (Shift+Tab 2x)
   - Análise:
     a) Arquivo: src/screens/CommunityScreen.tsx (linhas 423-460)
     b) Padrão atual:

     ```jsx
     <ScrollView>
       {displayPosts.map((post) => (
         <PostCard key={post.id} post={post} />
       ))}
     </ScrollView>
     ```

     c) Problemas:
     - ScrollView renderiza TODOS os posts sempre
     - 20 posts = render time 800ms+
     - Memória cresce linear
       d) Solução: FlatList com virtualization
     - FlatList renderiza apenas visible items (4-5 no topo)
     - Scroll suave mesmo com 100+ posts
     - Memory flat-line

   - Proposta:
     1. Importar FlatList do react-native
     2. Extrair renderItem função
     3. Adicionar keyExtractor
     4. Configs: initialNumToRender, maxToRenderPerBatch, windowSize
     5. Testar gates
   - Tempo estimado: 30 minutos
   - Aguardar aprovação

3. IMPLEMENTAÇÃO

   a) STEP 1: Remover ScrollView (5 min)
   - Localizar: src/screens/CommunityScreen.tsx:423
   - Remover: <ScrollView> ... </ScrollView>
   - Gates: typecheck

   b) STEP 2: Adicionar FlatList imports (2 min)

   ```typescript
   import { FlatList } from "react-native";
   ```

   c) STEP 3: Extrair renderItem (10 min)
   - Criar função: renderPost = ({ item, index })
   - Move: PostCard rendering aqui
   - Garantir: key e index passados
   - TDD: teste que renderPost({...}) retorna JSX

   d) STEP 4: Implementar FlatList (8 min)

   ```jsx
   <FlatList
     data={displayPosts}
     renderItem={renderPost}
     keyExtractor={(item) => item.id}
     initialNumToRender={5} // Renderizar 5 primeiros
     maxToRenderPerBatch={5} // Batch de 5 por vez
     windowSize={5} // 5 screens de buffer
     removeClippedSubviews={true}
     ListEmptyComponent={<EmptyState />}
   />
   ```

   e) STEP 5: Testes (5 min)
   [ ] npm run typecheck
   [ ] npm run lint
   [ ] npm start web (scroll)
   [ ] Profiler: FPS + render time

4. MEDIÇÃO (DEPOIS)
   - Abrir Profiler novamente
   - Scroll igual à baseline
   - Comparar: FPS, re-renders, render time
   - Expected improvement: +80% FPS, -50% render time
   - Se NÃO melhorar: debug props mutação, revisar renderItem

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO PROTOCOL
──────────────────────────────────────────────────────────────

✓ Medir baseline REAL (use Profiler, não chute)
✓ renderItem é função pura (sem side effects)
✓ keyExtractor = post.id (único e estável)
✓ displayPosts é array stável (não novo a cada render)
✓ PostCard memozado? Se não, considerar React.memo()

──────────────────────────────────────────────────────────────
⛔ STOP CONDITIONS
──────────────────────────────────────────────────────────────

1. 2 ESLint erros consecutivos → STOP
2. FPS < baseline (performance piorou) → STOP + reverte
3. Posts não renderizando → STOP + debugga keyExtractor
4. Arquivo > 350 LOC → Sugerir split renderItem em component

──────────────────────────────────────────────────────────────
🧪 GATES OBRIGATÓRIOS
──────────────────────────────────────────────────────────────

[ ] npm run typecheck
[ ] npm run lint
[ ] npm start web → scroll suave (30s test)
[ ] Profiler: FPS ≥ baseline (deve melhorar 20%+)
[ ] Visual: sem layout shifts, sem posts faltando

──────────────────────────────────────────────────────────────
📏 RESTRIÇÕES
──────────────────────────────────────────────────────────────

- NÃO mudar lógica de filtro (displayPosts.filter(...) untouched)
- NÃO remover props de PostCard
- NÃO usar ScrollView dentro FlatList (nested scroll problems)
- Preservar ListEmpty, ListHeader se existirem
- Diff < 100 linhas

──────────────────────────────────────────────────────────────
📋 CÓDIGO BASE (CopyPaste Template)
──────────────────────────────────────────────────────────────

// Remova:
<ScrollView showsVerticalScrollIndicator={false}>
{displayPosts.map((post, index) => renderPost(post, index))}
</ScrollView>

// Adicione:
const renderPost = ({ item, index }: { item: typeof displayPosts[0]; index: number }) => {
// Seu código original do map aqui
return <PostCard post={item} {...otherProps} />;
};

<FlatList
data={displayPosts}
renderItem={renderPost}
keyExtractor={(item) => item.id}
initialNumToRender={5}
maxToRenderPerBatch={5}
windowSize={5}
removeClippedSubviews={true}
ListEmptyComponent={<EmptyState />}
/>

──────────────────────────────────────────────────────────────
✅ SAÍDA FINAL
──────────────────────────────────────────────────────────────

BASELINE: [FPS antes] FPS, [render time] ms, [memory] MB
DEPOIS: [FPS depois] FPS, [render time] ms, [memory] MB
MELHORIA: +[X]% FPS, -[Y]% memory
ARQUIVOS: src/screens/CommunityScreen.tsx
COMANDOS: npm run typecheck ✅, npm run lint ✅, Profiler ✅
COMMITS: refactor(perf): CommunityScreen FlatList virtualization
PRÓXIMO: git push → PR

Rode: /clear

════════════════════════════════════════════════════════════
FIM DO PROMPT
════════════════════════════════════════════════════════════
