// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "YourAppName",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "YourAppName",
            targets: ["YourAppName"]
        )
    ],
    dependencies: [
        // Sem dependências externas para manter o app leve e rápido
        // Todas as funcionalidades são nativas do Swift/SwiftUI
    ],
    targets: [
        .target(
            name: "YourAppName",
            dependencies: []
        ),
        .testTarget(
            name: "YourAppNameTests",
            dependencies: ["YourAppName"]
        )
    ]
)
