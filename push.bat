@echo off
echo ============================================
echo   PUSH DU THEME SHOPIFY - Massacre Officiel
echo ============================================
echo.
echo Utilise --nodelete pour eviter les erreurs sur
echo les fichiers proteges (theme.liquid, gift_card, etc.)
echo.

shopify theme push --store customizer-fh5lguwi.myshopify.com --theme 155789033635 --allow-live --nodelete

echo.
echo Push termine !
pause
