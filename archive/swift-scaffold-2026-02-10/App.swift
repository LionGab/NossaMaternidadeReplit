import SwiftUI

@main
struct TestFlightReadyApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var errorHandler = ErrorHandler()
    
    init() {
        configureApp()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(errorHandler)
                .task {
                    await appState.initialize()
                }
                .errorAlert(errorHandler: errorHandler)
        }
    }
    
    private func configureApp() {
        // Performance otimizada
        URLCache.shared.memoryCapacity = 50_000_000 // 50 MB
        URLCache.shared.diskCapacity = 100_000_000   // 100 MB
        
        #if DEBUG
        print("🚀 App iniciado em modo DEBUG")
        #else
        print("🚀 App iniciado em modo RELEASE - TestFlight")
        #endif
    }
}

// MARK: - App State Management
@MainActor
final class AppState: ObservableObject {
    @Published var isInitialized = false
    @Published var isLoading = false
    @Published var user: User?
    
    private let supabaseClient = SupabaseClient.shared
    
    func initialize() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            // Verificar sessão existente
            if let session = try await supabaseClient.auth.session {
                user = User(from: session.user)
                isInitialized = true
            }
        } catch {
            print("⚠️ Erro ao inicializar: \(error.localizedDescription)")
        }
    }
    
    func signIn(email: String, password: String) async throws {
        let session = try await supabaseClient.auth.signIn(
            email: email,
            password: password
        )
        user = User(from: session.user)
    }
    
    func signOut() async throws {
        try await supabaseClient.auth.signOut()
        user = nil
    }
}

// MARK: - Error Handling
@MainActor
final class ErrorHandler: ObservableObject {
    @Published var currentError: AppError?
    @Published var showError = false
    
    func handle(_ error: Error) {
        currentError = AppError(from: error)
        showError = true
        
        // Log para analytics/crash reporting
        logError(error)
    }
    
    private func logError(_ error: Error) {
        #if DEBUG
        print("❌ Erro capturado: \(error.localizedDescription)")
        #else
        // Integrar com Firebase Crashlytics ou similar
        // Crashlytics.crashlytics().record(error: error)
        #endif
    }
}

struct AppError: Identifiable {
    let id = UUID()
    let title: String
    let message: String
    let recoveryAction: (() -> Void)?
    
    init(from error: Error) {
        if let appError = error as? LocalizedError {
            self.title = appError.errorDescription ?? "Erro"
            self.message = appError.failureReason ?? appError.localizedDescription
        } else {
            self.title = "Erro Inesperado"
            self.message = error.localizedDescription
        }
        self.recoveryAction = nil
    }
    
    init(title: String, message: String, recoveryAction: (() -> Void)? = nil) {
        self.title = title
        self.message = message
        self.recoveryAction = recoveryAction
    }
}

// MARK: - Error Alert Modifier
extension View {
    func errorAlert(errorHandler: ErrorHandler) -> some View {
        alert(
            errorHandler.currentError?.title ?? "Erro",
            isPresented: $errorHandler.showError,
            presenting: errorHandler.currentError
        ) { error in
            if let action = error.recoveryAction {
                Button("Tentar Novamente", action: action)
            }
            Button("OK", role: .cancel) { }
        } message: { error in
            Text(error.message)
        }
    }
}
