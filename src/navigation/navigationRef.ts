import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "../types/navigation";

/**
 * Navigation ref global
 * Permite navegação fora de componentes de tela (ex.: deep linking),
 * sem depender de `useNavigation()` (que exige estar dentro de um Navigator).
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
