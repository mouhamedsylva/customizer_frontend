# Script PowerShell pour créer automatiquement la page Configurateur
# Usage: .\create-page.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Création automatique page Configurateur" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Shopify CLI est installé
$shopifyVersion = shopify version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERREUR] Shopify CLI n'est pas installé!" -ForegroundColor Red
    Write-Host "Installez-le depuis: https://shopify.dev/docs/api/shopify-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Shopify CLI détecté: $shopifyVersion" -ForegroundColor Green
Write-Host ""

# Demander le store
$store = Read-Host "Entrez l'URL de votre store (ex: mon-store.myshopify.com)"
if ([string]::IsNullOrWhiteSpace($store)) {
    Write-Host "[ERREUR] URL du store requise!" -ForegroundColor Red
    exit 1
}

# Demander le token d'accès
Write-Host ""
Write-Host "Pour obtenir un token d'accès Admin API:" -ForegroundColor Yellow
Write-Host "1. Allez dans: Shopify Admin > Apps > Develop apps" -ForegroundColor Yellow
Write-Host "2. Créez une app avec les permissions: write_pages, read_pages" -ForegroundColor Yellow
Write-Host "3. Copiez le 'Admin API access token'" -ForegroundColor Yellow
Write-Host ""

$token = Read-Host "Entrez votre Admin API access token" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

if ([string]::IsNullOrWhiteSpace($tokenPlain)) {
    Write-Host "[ERREUR] Token requis!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[INFO] Création de la page Configurateur..." -ForegroundColor Cyan

# Créer la page via GraphQL
$query = @"
mutation {
  pageCreate(page: {
    title: "Configurateur"
    body: "<p>Personnalisez votre produit</p>"
    handle: "configurateur"
  }) {
    page {
      id
      title
      handle
      onlineStoreUrl
    }
    userErrors {
      field
      message
    }
  }
}
"@

$headers = @{
    "X-Shopify-Access-Token" = $tokenPlain
    "Content-Type" = "application/json"
}

$body = @{
    query = $query
} | ConvertTo-Json

$apiUrl = "https://$store/admin/api/2024-01/graphql.json"

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body
    
    if ($response.data.pageCreate.userErrors.Count -gt 0) {
        Write-Host "[ERREUR] Erreur lors de la création:" -ForegroundColor Red
        $response.data.pageCreate.userErrors | ForEach-Object {
            Write-Host "  - $($_.message)" -ForegroundColor Red
        }
        exit 1
    }
    
    $pageUrl = $response.data.pageCreate.page.onlineStoreUrl
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Page créée avec succès!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "URL de la page: $pageUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANT: La page utilise automatiquement le template 'page.configurateur'" -ForegroundColor Yellow
    Write-Host "Si le design n'apparaît pas, pushez d'abord le thème:" -ForegroundColor Yellow
    Write-Host "  shopify theme push" -ForegroundColor White
    
} catch {
    Write-Host "[ERREUR] Échec de la requête API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
