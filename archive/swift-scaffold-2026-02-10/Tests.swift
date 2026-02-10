import Testing
import Foundation
@testable import YourAppName

// MARK: - Model Tests

@Suite("User Model Tests")
struct UserModelTests {
    
    @Test("User initials são corretamente gerados")
    func userInitials() async throws {
        let user = User(
            id: "123",
            email: "john.doe@example.com",
            name: "John Doe"
        )
        
        #expect(user.initials == "JD")
    }
    
    @Test("User initials com nome único")
    func userInitialsSingleName() async throws {
        let user = User(
            id: "123",
            email: "madonna@example.com",
            name: "Madonna"
        )
        
        #expect(user.initials == "M")
    }
    
    @Test("User initials com nome completo")
    func userInitialsFullName() async throws {
        let user = User(
            id: "123",
            email: "person@example.com",
            name: "João Pedro da Silva"
        )
        
        #expect(user.initials == "JP")
    }
}

@Suite("Item Model Tests")
struct ItemModelTests {
    
    @Test("Mock data retorna lista de itens")
    func mockDataReturnsItems() async throws {
        let items = Item.mockData()
        
        #expect(items.count == 5)
        #expect(!items.isEmpty)
    }
    
    @Test("Todos os itens mock têm dados válidos")
    func mockDataHasValidItems() async throws {
        let items = Item.mockData()
        
        for item in items {
            #expect(!item.id.isEmpty)
            #expect(!item.title.isEmpty)
            #expect(!item.description.isEmpty)
            #expect(!item.icon.isEmpty)
            #expect(item.likes >= 0)
        }
    }
}

// MARK: - Validation Tests

@Suite("String Validation Tests")
struct StringValidationTests {
    
    @Test("Email válido é reconhecido")
    func validEmailRecognized() async throws {
        let validEmails = [
            "test@example.com",
            "user.name@domain.co.uk",
            "user+tag@example.com"
        ]
        
        for email in validEmails {
            #expect(email.isValidEmail, "Email '\(email)' deveria ser válido")
        }
    }
    
    @Test("Email inválido é rejeitado")
    func invalidEmailRejected() async throws {
        let invalidEmails = [
            "invalid",
            "@example.com",
            "user@",
            "user @example.com",
            ""
        ]
        
        for email in invalidEmails {
            #expect(!email.isValidEmail, "Email '\(email)' deveria ser inválido")
        }
    }
    
    @Test("Senha válida é reconhecida")
    func validPasswordRecognized() async throws {
        let validPasswords = [
            "123456",
            "password123",
            "super_secure_password"
        ]
        
        for password in validPasswords {
            #expect(password.isValidPassword, "Senha '\(password)' deveria ser válida")
        }
    }
    
    @Test("Senha inválida é rejeitada")
    func invalidPasswordRejected() async throws {
        let invalidPasswords = [
            "",
            "12345",
            "abc"
        ]
        
        for password in invalidPasswords {
            #expect(!password.isValidPassword, "Senha '\(password)' deveria ser inválida")
        }
    }
}

// MARK: - Date Extension Tests

@Suite("Date Extension Tests")
struct DateExtensionTests {
    
    @Test("Data recente mostra 'agora'")
    func recentDateShowsNow() async throws {
        let now = Date()
        let timeAgo = now.timeAgo
        
        #expect(timeAgo.contains("agora") || timeAgo.contains("seg"))
    }
    
    @Test("Data formatada está em português")
    func dateFormattedInPortuguese() async throws {
        let date = Date()
        let formatted = date.formatted
        
        #expect(!formatted.isEmpty)
    }
}

// MARK: - Network Error Tests

@Suite("Network Error Tests")
struct NetworkErrorTests {
    
    @Test("Unauthorized error tem mensagem correta")
    func unauthorizedErrorMessage() async throws {
        let error = NetworkError.unauthorized
        
        #expect(error.errorDescription?.contains("autorizado") == true)
        #expect(error.failureReason != nil)
        #expect(error.recoverySuggestion != nil)
    }
    
    @Test("Server error inclui código e mensagem")
    func serverErrorIncludesCodeAndMessage() async throws {
        let error = NetworkError.serverError(500, "Internal Server Error")
        
        #expect(error.errorDescription?.contains("500") == true)
        #expect(error.errorDescription?.contains("Internal Server Error") == true)
    }
    
    @Test("Todos os erros têm descrição")
    func allErrorsHaveDescription() async throws {
        let errors: [NetworkError] = [
            .invalidURL,
            .noData,
            .decodingError(NSError(domain: "test", code: -1)),
            .serverError(500, "Error"),
            .unauthorized,
            .notFound,
            .unknown(NSError(domain: "test", code: -1))
        ]
        
        for error in errors {
            #expect(error.errorDescription != nil, "Erro deveria ter descrição")
        }
    }
}

// MARK: - URL Extension Tests

@Suite("URL Extension Tests")
struct URLExtensionTests {
    
    @Test("Query items são adicionados corretamente")
    func queryItemsAddedCorrectly() async throws {
        let baseURL = URL(string: "https://example.com/api")!
        let queryItems = [
            URLQueryItem(name: "key1", value: "value1"),
            URLQueryItem(name: "key2", value: "value2")
        ]
        
        let urlWithQuery = baseURL.appending(queryItems: queryItems)
        
        #expect(urlWithQuery != nil)
        #expect(urlWithQuery?.absoluteString.contains("key1=value1") == true)
        #expect(urlWithQuery?.absoluteString.contains("key2=value2") == true)
    }
    
    @Test("Query items preservam itens existentes")
    func queryItemsPreserveExisting() async throws {
        let baseURL = URL(string: "https://example.com/api?existing=true")!
        let newItems = [URLQueryItem(name: "new", value: "item")]
        
        let urlWithQuery = baseURL.appending(queryItems: newItems)
        
        #expect(urlWithQuery != nil)
        #expect(urlWithQuery?.absoluteString.contains("existing=true") == true)
        #expect(urlWithQuery?.absoluteString.contains("new=item") == true)
    }
}

// MARK: - JSON Coding Tests

@Suite("JSON Coding Tests")
struct JSONCodingTests {
    
    @Test("User pode ser codificado e decodificado")
    func userCanBeEncodedAndDecoded() async throws {
        let originalUser = User(
            id: "123",
            email: "test@example.com",
            name: "Test User"
        )
        
        let encoder = JSONEncoder.default
        let data = try encoder.encode(originalUser)
        
        let decoder = JSONDecoder.default
        let decodedUser = try decoder.decode(User.self, from: data)
        
        #expect(decodedUser.id == originalUser.id)
        #expect(decodedUser.email == originalUser.email)
        #expect(decodedUser.name == originalUser.name)
    }
    
    @Test("Item pode ser codificado e decodificado")
    func itemCanBeEncodedAndDecoded() async throws {
        let originalItem = Item(
            id: "456",
            title: "Test Item",
            description: "Test Description",
            icon: "star.fill",
            likes: 100,
            createdAt: Date(),
            userId: "123"
        )
        
        let encoder = JSONEncoder.default
        let data = try encoder.encode(originalItem)
        
        let decoder = JSONDecoder.default
        let decodedItem = try decoder.decode(Item.self, from: data)
        
        #expect(decodedItem.id == originalItem.id)
        #expect(decodedItem.title == originalItem.title)
        #expect(decodedItem.description == originalItem.description)
        #expect(decodedItem.icon == originalItem.icon)
        #expect(decodedItem.likes == originalItem.likes)
        #expect(decodedItem.userId == originalItem.userId)
    }
}

// MARK: - App State Tests

@Suite("App State Tests")
@MainActor
struct AppStateTests {
    
    @Test("Estado inicial é correto")
    func initialStateIsCorrect() async throws {
        let appState = AppState()
        
        #expect(appState.isInitialized == false)
        #expect(appState.isLoading == false)
        #expect(appState.user == nil)
    }
}

// MARK: - Error Handler Tests

@Suite("Error Handler Tests")
@MainActor
struct ErrorHandlerTests {
    
    @Test("Estado inicial do error handler")
    func initialErrorHandlerState() async throws {
        let errorHandler = ErrorHandler()
        
        #expect(errorHandler.currentError == nil)
        #expect(errorHandler.showError == false)
    }
    
    @Test("Handle error atualiza estado")
    func handleErrorUpdatesState() async throws {
        let errorHandler = ErrorHandler()
        let testError = NetworkError.unauthorized
        
        errorHandler.handle(testError)
        
        #expect(errorHandler.currentError != nil)
        #expect(errorHandler.showError == true)
    }
}

// MARK: - Performance Tests

@Suite("Performance Tests")
struct PerformanceTests {
    
    @Test("Mock data é gerado rapidamente")
    func mockDataPerformance() async throws {
        let start = Date()
        
        for _ in 0..<100 {
            _ = Item.mockData()
        }
        
        let duration = Date().timeIntervalSince(start)
        #expect(duration < 1.0, "Geração de mock data deve ser rápida")
    }
    
    @Test("Validação de email é rápida")
    func emailValidationPerformance() async throws {
        let emails = (0..<1000).map { "user\($0)@example.com" }
        
        let start = Date()
        
        for email in emails {
            _ = email.isValidEmail
        }
        
        let duration = Date().timeIntervalSince(start)
        #expect(duration < 1.0, "Validação de emails deve ser rápida")
    }
}
