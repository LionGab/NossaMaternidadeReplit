import SwiftUI

struct AuthenticationView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var errorHandler: ErrorHandler
    
    @State private var email = ""
    @State private var password = ""
    @State private var isSigningIn = false
    @State private var showSignUp = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 30) {
                    // Logo/Header
                    VStack(spacing: 16) {
                        Circle()
                            .fill(Color.blue.gradient)
                            .frame(width: 100, height: 100)
                            .overlay {
                                Image(systemName: "app.fill")
                                    .font(.system(size: 50))
                                    .foregroundStyle(.white)
                            }
                            .shadow(color: .blue.opacity(0.3), radius: 20)
                        
                        Text("Bem-vindo")
                            .font(.largeTitle.bold())
                        
                        Text("Entre para continuar")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.top, 60)
                    
                    // Form
                    VStack(spacing: 20) {
                        CustomTextField(
                            icon: "envelope.fill",
                            placeholder: "Email",
                            text: $email
                        )
                        .textContentType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                        
                        CustomTextField(
                            icon: "lock.fill",
                            placeholder: "Senha",
                            text: $password,
                            isSecure: true
                        )
                        .textContentType(.password)
                        
                        Button {
                            Task {
                                await signIn()
                            }
                        } label: {
                            if isSigningIn {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text("Entrar")
                                    .font(.headline)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(Color.blue.gradient)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .disabled(!isFormValid || isSigningIn)
                        .opacity(isFormValid ? 1 : 0.6)
                        
                        Button {
                            showSignUp = true
                        } label: {
                            Text("Criar conta")
                                .font(.subheadline)
                                .foregroundStyle(.blue)
                        }
                    }
                    .padding(.horizontal, 30)
                    
                    Spacer()
                }
            }
            .scrollDismissesKeyboard(.interactively)
            .background(Color(.systemBackground))
            .sheet(isPresented: $showSignUp) {
                SignUpView()
            }
        }
    }
    
    private var isFormValid: Bool {
        !email.isEmpty && email.contains("@") && password.count >= 6
    }
    
    private func signIn() async {
        isSigningIn = true
        defer { isSigningIn = false }
        
        do {
            try await appState.signIn(email: email, password: password)
        } catch {
            errorHandler.handle(error)
        }
    }
}

// MARK: - Sign Up View
struct SignUpView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var errorHandler: ErrorHandler
    
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var isCreatingAccount = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    Text("Criar Conta")
                        .font(.largeTitle.bold())
                        .padding(.top, 20)
                    
                    VStack(spacing: 16) {
                        CustomTextField(
                            icon: "person.fill",
                            placeholder: "Nome completo",
                            text: $name
                        )
                        .textContentType(.name)
                        
                        CustomTextField(
                            icon: "envelope.fill",
                            placeholder: "Email",
                            text: $email
                        )
                        .textContentType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                        
                        CustomTextField(
                            icon: "lock.fill",
                            placeholder: "Senha",
                            text: $password,
                            isSecure: true
                        )
                        .textContentType(.newPassword)
                        
                        CustomTextField(
                            icon: "lock.fill",
                            placeholder: "Confirmar senha",
                            text: $confirmPassword,
                            isSecure: true
                        )
                        .textContentType(.newPassword)
                        
                        if !password.isEmpty && password.count < 6 {
                            HStack {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundStyle(.orange)
                                Text("A senha deve ter no mínimo 6 caracteres")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                Spacer()
                            }
                        }
                        
                        if !confirmPassword.isEmpty && password != confirmPassword {
                            HStack {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(.red)
                                Text("As senhas não coincidem")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                Spacer()
                            }
                        }
                        
                        Button {
                            Task {
                                await createAccount()
                            }
                        } label: {
                            if isCreatingAccount {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text("Criar Conta")
                                    .font(.headline)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(Color.green.gradient)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .disabled(!isFormValid || isCreatingAccount)
                        .opacity(isFormValid ? 1 : 0.6)
                    }
                    .padding(.horizontal, 30)
                    
                    Spacer()
                }
            }
            .scrollDismissesKeyboard(.interactively)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private var isFormValid: Bool {
        !name.isEmpty &&
        !email.isEmpty &&
        email.contains("@") &&
        password.count >= 6 &&
        password == confirmPassword
    }
    
    private func createAccount() async {
        isCreatingAccount = true
        defer { isCreatingAccount = false }
        
        do {
            // Implementar criação de conta com Supabase
            try await Task.sleep(for: .seconds(1))
            dismiss()
        } catch {
            errorHandler.handle(error)
        }
    }
}

// MARK: - Custom Text Field
struct CustomTextField: View {
    let icon: String
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    
    @State private var isSecureVisible = false
    @FocusState private var isFocused: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(.secondary)
                .frame(width: 20)
            
            if isSecure && !isSecureVisible {
                SecureField(placeholder, text: $text)
                    .focused($isFocused)
            } else {
                TextField(placeholder, text: $text)
                    .focused($isFocused)
            }
            
            if isSecure {
                Button {
                    isSecureVisible.toggle()
                } label: {
                    Image(systemName: isSecureVisible ? "eye.slash.fill" : "eye.fill")
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay {
            RoundedRectangle(cornerRadius: 12)
                .strokeBorder(isFocused ? Color.blue : Color.clear, lineWidth: 2)
        }
    }
}

// MARK: - Add Item View
struct AddItemView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var description = ""
    @State private var selectedIcon = "star.fill"
    @State private var isSaving = false
    
    let iconOptions = ["star.fill", "heart.fill", "bolt.fill", "flame.fill", "sparkles"]
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Informações") {
                    TextField("Título", text: $title)
                    
                    TextField("Descrição", text: $description, axis: .vertical)
                        .lineLimit(3...6)
                }
                
                Section("Ícone") {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 16) {
                            ForEach(iconOptions, id: \.self) { icon in
                                Button {
                                    selectedIcon = icon
                                } label: {
                                    Image(systemName: icon)
                                        .font(.title)
                                        .frame(width: 60, height: 60)
                                        .background(selectedIcon == icon ? Color.blue : Color(.secondarySystemBackground))
                                        .foregroundStyle(selectedIcon == icon ? .white : .primary)
                                        .clipShape(Circle())
                                }
                            }
                        }
                        .padding(.vertical, 8)
                    }
                }
            }
            .navigationTitle("Novo Item")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        Task {
                            await saveItem()
                        }
                    } label: {
                        if isSaving {
                            ProgressView()
                        } else {
                            Text("Salvar")
                        }
                    }
                    .disabled(!isFormValid || isSaving)
                }
            }
        }
    }
    
    private var isFormValid: Bool {
        !title.isEmpty && !description.isEmpty
    }
    
    private func saveItem() async {
        isSaving = true
        defer { isSaving = false }
        
        // Implementar salvamento
        try? await Task.sleep(for: .seconds(1))
        dismiss()
    }
}

#Preview("Authentication") {
    AuthenticationView()
        .environmentObject(AppState())
        .environmentObject(ErrorHandler())
}

#Preview("Sign Up") {
    SignUpView()
        .environmentObject(AppState())
        .environmentObject(ErrorHandler())
}
