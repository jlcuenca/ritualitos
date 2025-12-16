# 🔑 Guía Rápida: Configurar API de Gemini

## Paso 1: Obtener tu API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key" o "Get API Key"
4. Copia la clave generada

## Paso 2: Configurar la API Key en tu proyecto

### Para Desarrollo Local:

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza `tu_clave_api_aqui` con tu API Key real:
   ```
   REACT_APP_GEMINI_API_KEY=AIzaSy...tu_clave_real_aqui
   ```
3. Guarda el archivo
4. **IMPORTANTE**: Reinicia el servidor de desarrollo:
   ```bash
   # Detén el servidor (Ctrl+C) y vuelve a iniciarlo
   npm start
   ```

### Para Despliegue en GitHub Pages:

⚠️ **ADVERTENCIA DE SEGURIDAD**: 

Cuando despliegas a GitHub Pages, la API key se incluye en el código compilado y **será visible** para cualquiera que inspeccione el código JavaScript de tu sitio.

**Opciones:**

1. **Para pruebas/demos**: Usa una API key con límites de uso restrictivos
2. **Para producción**: Considera crear un backend que maneje las llamadas a la API

## Paso 3: Desplegar a GitHub Pages

Una vez configurada tu API key en `.env`:

```bash
npm run deploy
```

Este comando:
1. Ejecuta `npm run build` (compila la app con la API key)
2. Sube el build a la rama `gh-pages`

## Paso 4: Configurar GitHub Pages

1. Ve a tu repositorio: https://github.com/jlcuenca/ritualitos
2. Click en **Settings** → **Pages**
3. En "Source", selecciona:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click en **Save**
5. Espera 1-2 minutos

Tu app estará en: **https://jlcuenca.github.io/ritualitos**

## 🔒 Mejores Prácticas de Seguridad

### ❌ NO HAGAS ESTO:
- Subir el archivo `.env` a GitHub
- Compartir tu API key públicamente
- Usar la misma API key para desarrollo y producción

### ✅ HAZ ESTO:
- Mantén `.env` en `.gitignore` (ya configurado)
- Usa diferentes API keys para desarrollo y producción
- Configura límites de uso en Google Cloud Console
- Considera usar un backend para producción

## 🆘 Solución de Problemas

### "La app no genera recomendaciones"
- Verifica que la API key esté correctamente configurada en `.env`
- Asegúrate de haber reiniciado el servidor después de editar `.env`
- Revisa la consola del navegador (F12) para ver errores

### "Invalid API Key"
- Verifica que copiaste la clave completa
- Asegúrate de que la API de Gemini esté habilitada en Google Cloud
- Verifica que no haya espacios antes o después de la clave

### "La app funciona local pero no en GitHub Pages"
- Asegúrate de que la API key estaba en `.env` cuando ejecutaste `npm run deploy`
- Verifica que la rama `gh-pages` se haya creado correctamente
- Revisa la configuración en Settings → Pages

## 📞 ¿Necesitas Ayuda?

Si tienes problemas, revisa:
1. La consola del navegador (F12 → Console)
2. La terminal donde corre `npm start`
3. El README.md del proyecto

---

**Nota**: Este proyecto usa Gemini 2.5 Flash. Asegúrate de que tu API key tenga acceso a este modelo.
