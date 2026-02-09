import { COLORS } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";

const PRIVACY_SECTIONS = [
  {
    title: "1. Informações que Coletamos",
    content: `Coletamos informações que você nos fornece diretamente:
• Dados de cadastro: nome, email, data prevista do parto
• Informações de saúde: estágio da gravidez, preferências de cuidado
• Conteúdo gerado: posts na comunidade, comentários, curtidas
• Dados de uso: interações com o app, preferências de notificação

Também coletamos automaticamente:
• Informações do dispositivo (modelo, sistema operacional)
• Dados de uso e analytics para melhorar o app
• Logs de erro para correção de bugs`,
  },
  {
    title: "2. Como Usamos suas Informações",
    content: `Utilizamos suas informações para:
• Personalizar sua experiência no app
• Enviar notificações relevantes sobre sua jornada
• Melhorar nossos serviços e funcionalidades
• Garantir a segurança da comunidade
• Processar pagamentos de assinaturas
• Responder a solicitações de suporte`,
  },
  {
    title: "3. Compartilhamento de Dados",
    content: `Não vendemos suas informações pessoais. Compartilhamos dados apenas:
• Com provedores de serviço que nos ajudam a operar o app (Supabase, RevenueCat)
• Quando exigido por lei ou ordem judicial
• Para proteger direitos, propriedade ou segurança
• Com seu consentimento explícito

Conteúdo público (posts na comunidade) é visível para outros usuários.`,
  },
  {
    title: "4. Segurança dos Dados",
    content: `Implementamos medidas de segurança para proteger suas informações:
• Criptografia de dados em trânsito e em repouso
• Controle de acesso baseado em funções
• Moderação de conteúdo com IA e equipe humana
• Backups regulares e recuperação de desastres
• Autenticação segura via Apple/Google Sign-In`,
  },
  {
    title: "5. Seus Direitos (LGPD)",
    content: `De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
• Acessar seus dados pessoais
• Corrigir dados incompletos ou desatualizados
• Solicitar anonimização ou exclusão de dados
• Revogar consentimento a qualquer momento
• Portabilidade dos seus dados
• Saber com quem compartilhamos seus dados

Para exercer seus direitos, entre em contato: privacidade@nossamaternidade.app`,
  },
  {
    title: "6. Retenção de Dados",
    content: `Mantemos suas informações enquanto sua conta estiver ativa ou conforme necessário para:
• Fornecer nossos serviços
• Cumprir obrigações legais
• Resolver disputas
• Fazer cumprir nossos acordos

Após exclusão da conta, dados são removidos em até 30 dias, exceto quando a lei exigir retenção.`,
  },
  {
    title: "7. Cookies e Tecnologias Similares",
    content: `Utilizamos cookies e tecnologias similares para:
• Manter sua sessão ativa
• Lembrar suas preferências
• Análise de uso e melhorias
• Prevenção de fraudes

Você pode gerenciar preferências de cookies nas configurações do app.`,
  },
  {
    title: "8. Menores de Idade",
    content: `O Nossa Maternidade é destinado a adultos. Não coletamos intencionalmente informações de menores de 18 anos. Se tomarmos conhecimento de que coletamos dados de menor, excluiremos imediatamente.`,
  },
  {
    title: "9. Alterações nesta Política",
    content: `Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através do app ou por email. Recomendamos revisar esta página regularmente.`,
  },
  {
    title: "10. Contato",
    content: `Para dúvidas sobre privacidade:
• Email: privacidade@nossamaternidade.app
• Dentro do app: Perfil > Ajuda > Privacidade

Controlador de Dados: Nossa Maternidade Ltda.
CNPJ: XX.XXX.XXX/0001-XX
Encarregado de Dados (DPO): dpo@nossamaternidade.app`,
  },
];

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Última atualização: 3 de fevereiro de 2026</Text>

        <Text style={styles.intro}>
          A Nossa Maternidade ("nós", "nosso" ou "app") está comprometida com a proteção da sua
          privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações
          pessoais.
        </Text>

        {PRIVACY_SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao usar o Nossa Maternidade, você concorda com esta Política de Privacidade.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    marginBottom: 16,
    fontStyle: "italic",
  },
  intro: {
    fontSize: 15,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 21,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  footerText: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});
