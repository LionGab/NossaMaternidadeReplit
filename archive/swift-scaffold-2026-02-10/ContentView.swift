import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var errorHandler: ErrorHandler
    
    var body: some View {
        Group {
            if appState.isLoading {
                LoadingView()
            } else if appState.user != nil {
                MainAppView()
            } else {
                AuthenticationView()
            }
        }
        .animation(.easeInOut, value: appState.isLoading)
        .animation(.easeInOut, value: appState.user)
    }
}

// MARK: - Loading View
struct LoadingView: View {
    var body: some View {
        ZStack {
            Color(.systemBackground)
                .ignoresSafeArea()
            
            VStack(spacing: 20) {
                ProgressView()
                    .scaleEffect(1.5)
                
                Text("Carregando...")
                    .font(.headline)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

// MARK: - Main App View
struct MainAppView: View {
    @EnvironmentObject private var appState: AppState
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Início", systemImage: "house.fill")
                }
                .tag(0)
            
            ExploreView()
                .tabItem {
                    Label("Explorar", systemImage: "magnifyingglass")
                }
                .tag(1)
            
            ProfileView()
                .tabItem {
                    Label("Perfil", systemImage: "person.fill")
                }
                .tag(2)
        }
    }
}

// MARK: - Home View
struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 16) {
                    if viewModel.isLoading {
                        ForEach(0..<5) { _ in
                            ShimmerPlaceholder()
                        }
                    } else if viewModel.items.isEmpty {
                        EmptyStateView(
                            icon: "tray",
                            title: "Nenhum conteúdo",
                            message: "Comece adicionando alguns itens"
                        )
                        .padding(.top, 100)
                    } else {
                        ForEach(viewModel.items) { item in
                            ItemCard(item: item)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Início")
            .refreshable {
                await viewModel.refresh()
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        viewModel.showAddSheet = true
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                    }
                }
            }
            .sheet(isPresented: $viewModel.showAddSheet) {
                AddItemView()
            }
        }
        .task {
            await viewModel.loadItems()
        }
    }
}

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var isLoading = false
    @Published var showAddSheet = false
    
    func loadItems() async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }
        
        do {
            // Simular carregamento - substituir por chamada real
            try await Task.sleep(for: .seconds(1))
            items = Item.mockData()
        } catch {
            print("❌ Erro ao carregar itens: \(error)")
        }
    }
    
    func refresh() async {
        items = []
        await loadItems()
    }
}

// MARK: - Item Card
struct ItemCard: View {
    let item: Item
    @State private var isLiked = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Imagem ou placeholder
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.blue.gradient)
                .frame(height: 200)
                .overlay {
                    Image(systemName: item.icon)
                        .font(.system(size: 60))
                        .foregroundStyle(.white)
                }
            
            VStack(alignment: .leading, spacing: 8) {
                Text(item.title)
                    .font(.headline)
                
                Text(item.description)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
                
                HStack {
                    Label("\(item.likes)", systemImage: "heart.fill")
                        .font(.caption)
                        .foregroundStyle(.pink)
                    
                    Spacer()
                    
                    Button {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                            isLiked.toggle()
                        }
                    } label: {
                        Image(systemName: isLiked ? "heart.fill" : "heart")
                            .foregroundStyle(isLiked ? .pink : .secondary)
                            .symbolEffect(.bounce, value: isLiked)
                    }
                }
            }
            .padding(.horizontal, 8)
        }
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
    }
}

// MARK: - Explore View
struct ExploreView: View {
    @State private var searchText = ""
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Text("🔍 Explorar")
                        .font(.largeTitle.bold())
                    
                    Text("Descubra novos conteúdos")
                        .foregroundStyle(.secondary)
                }
                .padding()
            }
            .navigationTitle("Explorar")
            .searchable(text: $searchText, prompt: "Buscar...")
        }
    }
}

// MARK: - Profile View
struct ProfileView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var errorHandler: ErrorHandler
    @State private var isSigningOut = false
    
    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack {
                        Circle()
                            .fill(Color.blue.gradient)
                            .frame(width: 60, height: 60)
                            .overlay {
                                Text(appState.user?.initials ?? "U")
                                    .font(.title2.bold())
                                    .foregroundStyle(.white)
                            }
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text(appState.user?.name ?? "Usuário")
                                .font(.headline)
                            
                            Text(appState.user?.email ?? "usuario@email.com")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 8)
                }
                
                Section("Configurações") {
                    NavigationLink {
                        Text("Notificações")
                    } label: {
                        Label("Notificações", systemImage: "bell.fill")
                    }
                    
                    NavigationLink {
                        Text("Privacidade")
                    } label: {
                        Label("Privacidade", systemImage: "lock.fill")
                    }
                }
                
                Section("Sobre") {
                    HStack {
                        Text("Versão")
                        Spacer()
                        Text(Bundle.main.appVersion)
                            .foregroundStyle(.secondary)
                    }
                    
                    HStack {
                        Text("Build")
                        Spacer()
                        Text(Bundle.main.buildNumber)
                            .foregroundStyle(.secondary)
                    }
                }
                
                Section {
                    Button(role: .destructive) {
                        Task {
                            await signOut()
                        }
                    } label: {
                        if isSigningOut {
                            ProgressView()
                        } else {
                            Text("Sair")
                        }
                    }
                    .disabled(isSigningOut)
                }
            }
            .navigationTitle("Perfil")
        }
    }
    
    private func signOut() async {
        isSigningOut = true
        defer { isSigningOut = false }
        
        do {
            try await appState.signOut()
        } catch {
            errorHandler.handle(error)
        }
    }
}

// MARK: - Supporting Views
struct ShimmerPlaceholder: View {
    @State private var isAnimating = false
    
    var body: some View {
        RoundedRectangle(cornerRadius: 16)
            .fill(Color(.systemGray5))
            .frame(height: 280)
            .overlay {
                LinearGradient(
                    colors: [.clear, .white.opacity(0.4), .clear],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .offset(x: isAnimating ? 400 : -400)
            }
            .clipped()
            .onAppear {
                withAnimation(.linear(duration: 1.5).repeatForever(autoreverses: false)) {
                    isAnimating = true
                }
            }
    }
}

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 60))
                .foregroundStyle(.secondary)
            
            Text(title)
                .font(.title2.bold())
            
            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(40)
    }
}

// MARK: - Bundle Extensions
extension Bundle {
    var appVersion: String {
        infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"
    }
    
    var buildNumber: String {
        infoDictionary?["CFBundleVersion"] as? String ?? "1"
    }
}
