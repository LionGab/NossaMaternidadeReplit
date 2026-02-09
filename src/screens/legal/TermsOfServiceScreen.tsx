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

const TERMS_SECTIONS = [
  {
    title: "1. Aceitação dos Termos",
    content: `Ao acessar ou usar o aplicativo Nossa Maternidade, você concorda em estar vinculado a estes Termos de Uso. Se não concordar com qualquer parte dos termos, você não deve usar o aplicativo.

Estes termos constituem um acordo legal entre você e Nossa Maternidade Ltda.`,
  },
  {
    title: "2. Descrição do Serviço",
    content: `O Nossa Maternidade é um aplicativo de suporte à maternidade que oferece:
• Acompanhamento personalizado da gravidez e pós-parto
• Comunidade de mães para compartilhar experiências
• Conteúdo educativo sobre maternidade
• Ferramentas de bem-estar e autocuidado
• Recursos premium via assinatura

O app NÃO substitui aconselhamento médico profissional.`,
  },
  {
    title: "3. Conta de Usuário",
    content: `Para usar certas funcionalidades, você precisa criar uma conta:
• Você é responsável por manter a confidencialidade da sua conta
• Deve fornecer informações precisas e atualizadas
• Não pode compartilhar credenciais com terceiros
• Deve notificar imediatamente sobre uso não autorizado
• É responsável por todas as atividades em sua conta

Reservamo-nos o direito de suspender contas que violem estes termos.`,
  },
  {
    title: "4. Conteúdo do Usuário",
    content: `Ao publicar conteúdo na comunidade, você:
• Mantém a propriedade do seu conteúdo original
• Nos concede licença não exclusiva para exibir, distribuir e promover
• Garante que o conteúdo não viola direitos de terceiros
• Concorda que não há expectativa de privacidade em posts públicos

Proibimos conteúdo que seja:
• Ofensivo, difamatório ou discriminatório
• Spam, propaganda ou autopromoção excessiva
• Desinformação sobre saúde
• Ilegal ou que viole direitos de terceiros
• Sexual ou violento`,
  },
  {
    title: "5. Moderação de Conteúdo",
    content: `Utilizamos sistemas de moderação para manter a comunidade segura:
• Moderação automática por inteligência artificial
• Revisão humana de conteúdo sinalizado
• Denúncia por usuários da comunidade

Podemos remover conteúdo ou suspender contas que violem nossas diretrizes, sem aviso prévio.`,
  },
  {
    title: "6. Assinaturas e Pagamentos",
    content: `Oferecemos planos de assinatura premium:
• Preços são exibidos antes da compra
• Cobranças são processadas via App Store/Play Store
• Assinaturas são renovadas automaticamente
• Cancelamento deve ser feito na loja de apps
• Não oferecemos reembolsos proporcionais

Funcionalidades gratuitas podem ser alteradas a qualquer momento.`,
  },
  {
    title: "7. Propriedade Intelectual",
    content: `Todo o conteúdo do app (exceto conteúdo de usuários) é de nossa propriedade:
• Marca, logo, design e interface
• Textos, imagens e ilustrações
• Código fonte e tecnologia
• Algoritmos e funcionalidades

É proibido copiar, modificar, distribuir ou criar obras derivadas sem autorização.`,
  },
  {
    title: "8. Isenção de Responsabilidade Médica",
    content: `IMPORTANTE: O Nossa Maternidade é um app de apoio e informação. NÃO fornecemos:
• Diagnósticos médicos
• Prescrições de medicamentos
• Tratamentos de saúde
• Substituição de consultas médicas

Sempre consulte profissionais de saúde qualificados para decisões médicas. Não nos responsabilizamos por decisões tomadas com base no conteúdo do app.`,
  },
  {
    title: "9. Limitação de Responsabilidade",
    content: `Na máxima extensão permitida por lei:
• O app é fornecido "como está"
• Não garantimos disponibilidade ininterrupta
• Não nos responsabilizamos por danos indiretos
• Nossa responsabilidade total é limitada ao valor pago nos últimos 12 meses

Isso não afeta direitos garantidos por lei (como Código de Defesa do Consumidor).`,
  },
  {
    title: "10. Encerramento",
    content: `Você pode encerrar sua conta a qualquer momento nas configurações do app.

Podemos encerrar ou suspender sua conta por:
• Violação destes termos
• Conduta prejudicial à comunidade
• Inatividade prolongada
• Solicitação legal

Após encerramento, você perde acesso aos dados e conteúdo.`,
  },
  {
    title: "11. Alterações nos Termos",
    content: `Podemos modificar estes termos periodicamente. Notificaremos sobre mudanças significativas através do app. O uso continuado após alterações constitui aceitação dos novos termos.`,
  },
  {
    title: "12. Lei Aplicável e Foro",
    content: `Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida no foro da comarca de São Paulo/SP, renunciando a qualquer outro.`,
  },
  {
    title: "13. Contato",
    content: `Para dúvidas sobre estes termos:
• Email: termos@nossamaternidade.app
• Dentro do app: Perfil > Ajuda > Termos de Uso

Nossa Maternidade Ltda.
CNPJ: XX.XXX.XXX/0001-XX`,
  },
];

export default function TermsOfServiceScreen() {
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
        <Text style={styles.headerTitle}>Termos de Uso</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Última atualização: 3 de fevereiro de 2026</Text>

        <Text style={styles.intro}>
          Bem-vindo ao Nossa Maternidade! Estes Termos de Uso ("Termos") regem seu acesso e uso do
          aplicativo e serviços oferecidos. Por favor, leia atentamente antes de usar.
        </Text>

        {TERMS_SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao usar o Nossa Maternidade, você confirma que leu, entendeu e concorda com estes Termos
            de Uso.
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
