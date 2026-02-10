import Foundation

// MARK: - Models

struct User: Identifiable, Codable {
    let id: String
    let email: String
    let name: String
    let createdAt: Date
    
    var initials: String {
        name.components(separatedBy: " ")
            .compactMap { $0.first }
            .map { String($0) }
            .joined()
            .uppercased()
            .prefix(2)
            .description
    }
    
    init(id: String, email: String, name: String, createdAt: Date = Date()) {
        self.id = id
        self.email = email
        self.name = name
        self.createdAt = createdAt
    }
    
    init(from supabaseUser: SupabaseUser) {
        self.id = supabaseUser.id
        self.email = supabaseUser.email
        self.name = supabaseUser.userMetadata["name"] as? String ?? "Usuário"
        self.createdAt = supabaseUser.createdAt
    }
}

struct Item: Identifiable, Codable {
    let id: String
    let title: String
    let description: String
    let icon: String
    let likes: Int
    let createdAt: Date
    let userId: String
    
    static func mockData() -> [Item] {
        [
            Item(
                id: UUID().uuidString,
                title: "Primeiro Item",
                description: "Este é um exemplo de item na lista",
                icon: "star.fill",
                likes: 42,
                createdAt: Date(),
                userId: "mock"
            ),
            Item(
                id: UUID().uuidString,
                title: "Segundo Item",
                description: "Outro exemplo incrível de conteúdo",
                icon: "heart.fill",
                likes: 128,
                createdAt: Date(),
                userId: "mock"
            ),
            Item(
                id: UUID().uuidString,
                title: "Terceiro Item",
                description: "Mais um item interessante para você explorar",
                icon: "bolt.fill",
                likes: 89,
                createdAt: Date(),
                userId: "mock"
            ),
            Item(
                id: UUID().uuidString,
                title: "Quarto Item",
                description: "Conteúdo fantástico com muitos detalhes",
                icon: "flame.fill",
                likes: 256,
                createdAt: Date(),
                userId: "mock"
            ),
            Item(
                id: UUID().uuidString,
                title: "Quinto Item",
                description: "Último exemplo desta lista incrível",
                icon: "sparkles",
                likes: 512,
                createdAt: Date(),
                userId: "mock"
            )
        ]
    }
}

// MARK: - API Response Types

struct APIResponse<T: Codable>: Codable {
    let data: T?
    let error: APIError?
    let message: String?
}

struct APIError: Codable, LocalizedError {
    let code: String
    let message: String
    
    var errorDescription: String? { message }
}

// MARK: - Supabase Types

struct SupabaseUser: Codable {
    let id: String
    let email: String
    let userMetadata: [String: Any]
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case userMetadata = "user_metadata"
        case createdAt = "created_at"
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        email = try container.decode(String.self, forKey: .email)
        createdAt = try container.decode(Date.self, forKey: .createdAt)
        
        // Decodificar userMetadata como dicionário
        if let metadata = try? container.decode([String: String].self, forKey: .userMetadata) {
            userMetadata = metadata
        } else {
            userMetadata = [:]
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(email, forKey: .email)
        try container.encode(createdAt, forKey: .createdAt)
    }
}

struct SupabaseSession: Codable {
    let accessToken: String
    let refreshToken: String
    let expiresAt: Date
    let user: SupabaseUser
    
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresAt = "expires_at"
        case user
    }
}

// MARK: - Network Error

enum NetworkError: LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case serverError(Int, String)
    case unauthorized
    case notFound
    case unknown(Error)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "URL inválida"
        case .noData:
            return "Nenhum dado recebido"
        case .decodingError(let error):
            return "Erro ao processar dados: \(error.localizedDescription)"
        case .serverError(let code, let message):
            return "Erro do servidor (\(code)): \(message)"
        case .unauthorized:
            return "Não autorizado. Por favor, faça login novamente"
        case .notFound:
            return "Recurso não encontrado"
        case .unknown(let error):
            return "Erro desconhecido: \(error.localizedDescription)"
        }
    }
    
    var failureReason: String? {
        switch self {
        case .unauthorized:
            return "Sua sessão expirou ou você não tem permissão para acessar este recurso"
        case .serverError(_, let message):
            return message
        default:
            return errorDescription
        }
    }
    
    var recoverySuggestion: String? {
        switch self {
        case .unauthorized:
            return "Tente fazer login novamente"
        case .serverError:
            return "Verifique sua conexão e tente novamente"
        default:
            return "Por favor, tente novamente mais tarde"
        }
    }
}

// MARK: - Validation

extension String {
    var isValidEmail: Bool {
        let emailRegex = #"^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"#
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: self)
    }
    
    var isValidPassword: Bool {
        count >= 6
    }
}

// MARK: - Date Extensions

extension Date {
    var timeAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .short
        return formatter.localizedString(for: self, relativeTo: Date())
    }
    
    var formatted: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        formatter.locale = Locale(identifier: "pt_BR")
        return formatter.string(from: self)
    }
}

// MARK: - JSON Decoder

extension JSONDecoder {
    static var `default`: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return decoder
    }
}

extension JSONEncoder {
    static var `default`: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.keyEncodingStrategy = .convertToSnakeCase
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return encoder
    }
}

// MARK: - URL Extensions

extension URL {
    func appending(queryItems: [URLQueryItem]) -> URL? {
        guard var components = URLComponents(url: self, resolvingAgainstBaseURL: false) else {
            return nil
        }
        components.queryItems = (components.queryItems ?? []) + queryItems
        return components.url
    }
}
