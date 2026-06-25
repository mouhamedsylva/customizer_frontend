@echo off
echo ========================================
echo Verification des fichiers Configurateur
echo ========================================
echo.

set "error_count=0"

echo [1/4] Verification du layout...
if exist "layout\theme.liquid" (
    echo [OK] layout\theme.liquid
) else (
    echo [ERREUR] layout\theme.liquid MANQUANT
    set /a error_count+=1
)
echo.

echo [2/4] Verification des templates...
if exist "templates\page.configurateur.liquid" (
    echo [OK] templates\page.configurateur.liquid
) else (
    echo [ERREUR] templates\page.configurateur.liquid MANQUANT
    set /a error_count+=1
)
echo.

echo [3/4] Verification des sections...
if exist "sections\configurateur.liquid" (
    echo [OK] sections\configurateur.liquid
) else (
    echo [ERREUR] sections\configurateur.liquid MANQUANT
    set /a error_count+=1
)
echo.

echo [4/4] Verification des assets...
set "assets_ok=0"
set "assets_missing="

for %%f in (
    "configurateur.css"
    "conf-sidebar.css"
    "conf-recap.css"
    "conf-canvas.css"
    "configurateur.js"
    "conf-canvas.js"
    "conf-cart.js"
    "conf-pricing.js"
    "conf-product-switch.js"
    "conf-recap.js"
    "conf-upload.js"
    "products-textile.js"
    "products-drapeaux.js"
    "products-patches.js"
    "products-coins.js"
    "visa.svg"
    "mastercard.svg"
    "paypal.svg"
    "applepay.svg"
) do (
    if exist "assets\%%~f" (
        set /a assets_ok+=1
    ) else (
        echo [ERREUR] assets\%%~f MANQUANT
        set /a error_count+=1
    )
)

echo [OK] %assets_ok% fichiers assets trouves
echo.

echo ========================================
if %error_count%==0 (
    echo [SUCCESS] Tous les fichiers sont presents!
    echo Vous pouvez maintenant executer: shopify theme push
) else (
    echo [ERREUR] %error_count% fichier^(s^) manquant^(s^)!
    echo Verifiez les fichiers manquants ci-dessus.
)
echo ========================================
echo.

pause
