import Foundation

// MARK: - Supabase Client

final class SupabaseClient {
    static let shared = SupabaseClient()
    
    private let baseURL: URL
    private let apiKey: String
    
    let auth: AuthService
    let database: DatabaseService
    
    private init() {
        // Configuração - ler de .env ou Config.plist
        self.baseURL = URL(string: ProcessInfo.processInfo.environment["SUPABASE_URL"] ?? "https://your-project.supabase.co")!
        self.apiKey = ProcessInfo.processInfo.environment["SUPABASE_ANON_KEY"] ?? "your-anon-key"
        
        self.auth = AuthService(baseURL: baseURL, apiKey: apiKey)
        self.database = DatabaseService(baseURL: baseURL, apiKey: apiKey)
    }
}

// MARK: - Auth Service

final class AuthService {
    private let baseURL: URL
    private let apiKey: String
    private let urlSession: URLSession
    
    @Published private(set) var currentSession: SupabaseSession?
    
    init(baseURL: URL, apiKey: String) {
        self.baseURL = baseURL
        self.apiKey = apiKey
        
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        configuration.waitsForConnectivity = true
        self.urlSession = URLSession(configuration: configuration)
    }
    
    // MARK: - Public Methods
    
    var session: SupabaseSession? {
        get async throws {
            // Verificar sessão armazenada
            if let storedSession = await loadStoredSession() {
                if storedSession.expiresAt > Date() {
                    currentSession = storedSession
                    return storedSession
                } else {
                    // Tentar refresh
                    return try await refreshSession(storedSession.refreshToken)
                }
            }
            return nil
        }
    }
    
    func signIn(email: String, password: String) async throws -> SupabaseSession {
        let endpoint = baseURL.appendingPathComponent("auth/v1/token")
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        
        let body: [String: String] = [
            "email": email,
            "password": password,
            "grant_type": "password"
        ]
        
        request.httpBody = try JSONEncoder.default.encode(body)
        
        let (data, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }
        
        guard httpResponse.statusCode == 200 else {
            if httpResponse.statusCode == 401 {
                throw NetworkError.unauthorized
            }
            let message = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NetworkError.serverError(httpResponse.statusCode, message)
        }
        
        let session = try JSONDecoder.default.decode(SupabaseSession.self, from: data)
        currentSession = session
        await saveSession(session)
        
        return session
    }
    
    func signUp(email: String, password: String, metadata: [String: String] = [:]) async throws -> SupabaseSession {
        let endpoint = baseURL.appendingPathComponent("auth/v1/signup")
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        
        let body: [String: Any] = [
            "email": email,
            "password": password,
            "data": metadata
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }
        
        guard httpResponse.statusCode == 200 else {
            let message = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NetworkError.serverError(httpResponse.statusCode, message)
        }
        
        let session = try JSONDecoder.default.decode(SupabaseSession.self, from: data)
        currentSession = session
        await saveSession(session)
        
        return session
    }
    
    func signOut() async throws {
        guard let session = currentSession else { return }
        
        let endpoint = baseURL.appendingPathComponent("auth/v1/logout")
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(session.accessToken)", forHTTPHeaderField: "Authorization")
        
        _ = try await urlSession.data(for: request)
        
        currentSession = nil
        await clearStoredSession()
    }
    
    func refreshSession(_ refreshToken: String) async throws -> SupabaseSession {
        let endpoint = baseURL.appendingPathComponent("auth/v1/token")
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        
        let body: [String: String] = [
            "refresh_token": refreshToken,
            "grant_type": "refresh_token"
        ]
        
        request.httpBody = try JSONEncoder.default.encode(body)
        
        let (data, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }
        
        guard httpResponse.statusCode == 200 else {
            await clearStoredSession()
            throw NetworkError.unauthorized
        }
        
        let session = try JSONDecoder.default.decode(SupabaseSession.self, from: data)
        currentSession = session
        await saveSession(session)
        
        return session
    }
    
    // MARK: - Session Storage
    
    private func saveSession(_ session: SupabaseSession) async {
        let encoder = JSONEncoder.default
        if let encoded = try? encoder.encode(session) {
            UserDefaults.standard.set(encoded, forKey: "supabase_session")
        }
    }
    
    private func loadStoredSession() async -> SupabaseSession? {
        guard let data = UserDefaults.standard.data(forKey: "supabase_session") else {
            return nil
        }
        
        let decoder = JSONDecoder.default
        return try? decoder.decode(SupabaseSession.self, from: data)
    }
    
    private func clearStoredSession() async {
        UserDefaults.standard.removeObject(forKey: "supabase_session")
    }
}

// MARK: - Database Service

final class DatabaseService {
    private let baseURL: URL
    private let apiKey: String
    private let urlSession: URLSession
    
    init(baseURL: URL, apiKey: String) {
        self.baseURL = baseURL
        self.apiKey = apiKey
        
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        configuration.waitsForConnectivity = true
        self.urlSession = URLSession(configuration: configuration)
    }
    
    // MARK: - CRUD Operations
    
    func select<T: Codable>(
        from table: String,
        columns: [String] = ["*"],
        filter: [String: Any]? = nil
    ) async throws -> [T] {
        var endpoint = baseURL
            .appendingPathComponent("rest/v1")
            .appendingPathComponent(table)
        
        var queryItems: [URLQueryItem] = [
            URLQueryItem(name: "select", value: columns.joined(separator: ","))
        ]
        
        if let filter = filter {
            for (key, value) in filter {
                queryItems.append(URLQueryItem(name: key, value: "eq.\(value)"))
            }
        }
        
        endpoint = endpoint.appending(queryItems: queryItems) ?? endpoint
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "GET"
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        
        if let accessToken = await getAccessToken() {
            request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        }
        
        let (data, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }
        
        guard httpResponse.statusCode == 200 else {
            let message = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NetworkError.serverError(httpResponse.statusCode, message)
        }
        
        return try JSONDecoder.default.decode([T].self, from: data)
    }
    
    func insert<T: Codable>(
        into table: String,
        values: T
    ) async throws -> T {
        let endpoint = baseURL
            .appendingPathComponent("rest/v1")
            .appendingPathComponent(table)
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")
        
        if let accessToken = await getAccessToken() {
            request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        }
        
        request.httpBody = try JSONEncoder.default.encode(values)
        
        let (data, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }
        
        guard httpResponse.statusCode == 201 else {
            let message = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NetworkError.serverError(httpResponse.statusCode, message)
        }
        
        let results = try JSONDecoder.default.decode([T].self, from: data)
        guard let first = results.first else {
            throw NetworkError.noData
        }
        
        return first
    }
    
    func update<T: Codable>(
        table: String,
        id: String,
        values: T
    ) async throws -> T {
        let endpoint = baseURL
            .appendingPathComponent("rest/v1")
            .appendingPathComponent(table)
            .appending(queryItems: [URLQueryItem(name: "id", value: "eq.\(id)")])!
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "PATCH"
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")
        
        if let accessToken = await getAccessToken() {
            request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        }
        
        request.httpBody = try JSONEncoder.default.encode(values)
        
        let (data, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }
        
        guard httpResponse.statusCode == 200 else {
            let message = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NetworkError.serverError(httpResponse.statusCode, message)
        }
        
        let results = try JSONDecoder.default.decode([T].self, from: data)
        guard let first = results.first else {
            throw NetworkError.noData
        }
        
        return first
    }
    
    func delete(from table: String, id: String) async throws {
        let endpoint = baseURL
            .appendingPathComponent("rest/v1")
            .appendingPathComponent(table)
            .appending(queryItems: [URLQueryItem(name: "id", value: "eq.\(id)")])!
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "DELETE"
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        
        if let accessToken = await getAccessToken() {
            request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        }
        
        let (_, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }
        
        guard httpResponse.statusCode == 204 else {
            throw NetworkError.serverError(httpResponse.statusCode, "Delete failed")
        }
    }
    
    // MARK: - Helper
    
    private func getAccessToken() async -> String? {
        // Obter token do AuthService
        return nil // Implementar integração
    }
}
