import { useCallback, useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface NetworkStatus {
  /** True when device has no connection or internet is not reachable */
  isOffline: boolean;
  /** True while checking network status */
  isChecking: boolean;
  /** Raw NetInfo state for advanced usage */
  netInfo: NetInfoState | null;
  /** Manually trigger a network recheck */
  retry: () => Promise<void>;
}

/**
 * Hook para monitorar status de conexão de rede
 * Usa @react-native-community/netinfo (já instalado no projeto)
 *
 * @example
 * const { isOffline, retry } = useNetworkStatus();
 * if (isOffline) {
 *   return <OfflineBanner onRetry={retry} />;
 * }
 */
export function useNetworkStatus(): NetworkStatus {
  const [netInfo, setNetInfo] = useState<NetInfoState | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Determina se está offline
  // isConnected === false OU isInternetReachable === false
  const isOffline =
    netInfo !== null && (netInfo.isConnected === false || netInfo.isInternetReachable === false);

  // Subscribe to network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state);
    });

    // Fetch initial state
    NetInfo.fetch().then(setNetInfo);

    return () => {
      unsubscribe();
    };
  }, []);

  // Manual retry function
  const retry = useCallback(async () => {
    setIsChecking(true);
    try {
      const state = await NetInfo.fetch();
      setNetInfo(state);
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    isOffline,
    isChecking,
    netInfo,
    retry,
  };
}

export default useNetworkStatus;
