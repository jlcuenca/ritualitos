# 🌟 Ritualitos

Una aplicación web que ayuda a encontrar el regalo o gesto perfecto inspirado en la raíz, la emoción y el alma de las personas que amas.

## 🚀 Características

- **Análisis profundo**: Responde 5 preguntas sobre la persona para quien buscas el regalo
- **IA Generativa**: Usa la API de Gemini para generar recomendaciones personalizadas
- **Tres tipos de recomendaciones**:
  - 🎁 **Material**: Un objeto significativo
  - ☀️ **Experiencial**: Una experiencia compartida
  - 🪶 **Simbólico**: Un ritual o gesto psicomágico
- **Diseño hermoso**: Interfaz moderna con Tailwind CSS y animaciones suaves

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Una API Key de Google Gemini ([Obtener aquí](https://makersuite.google.com/app/apikey))

## 🔧 Instalación

1. **Clona el repositorio**:
```bash
git clone https://github.com/jlcuenca/ritualitos.git
cd ritualitos
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Configura la API Key**:
   - Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   - Abre el archivo `.env` y reemplaza `tu_clave_api_de_gemini_aqui` con tu API Key real de Gemini:
   ```
   REACT_APP_GEMINI_API_KEY=tu_clave_real_aqui
   ```

## 🎮 Uso

### Desarrollo Local

Inicia el servidor de desarrollo:
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Build de Producción

Crea una versión optimizada para producción:
```bash
npm run build
```

### Despliegue en GitHub Pages

1. **Asegúrate de tener configurada tu API Key** en el archivo `.env`

2. **Ejecuta el comando de deploy**:
```bash
npm run deploy
```

3. **Configura GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - En "Source", selecciona la rama `gh-pages` y carpeta `/ (root)`
   - Guarda los cambios

4. **Accede a tu aplicación** en: `https://jlcuenca.github.io/ritualitos`

## 🔒 Seguridad de la API Key

⚠️ **IMPORTANTE**: 

- El archivo `.env` está en `.gitignore` y **NO se sube a GitHub**
- Para GitHub Pages, la API key se "incrusta" en el build
- **Considera los riesgos**: En aplicaciones estáticas, la API key es visible en el código del navegador
- **Recomendación**: Para producción real, usa un backend que maneje las llamadas a la API

### Alternativa Segura (Recomendada para Producción)

Para mayor seguridad, considera:
1. Crear un backend (Node.js, Python, etc.) que maneje las llamadas a Gemini
2. El frontend solo llama a tu backend
3. La API key permanece segura en el servidor

## 🛠️ Tecnologías Utilizadas

- **React** 19.2.1 - Framework de UI
- **Tailwind CSS** 3.x - Estilos y diseño
- **Lucide React** - Iconos
- **Google Gemini API** - IA Generativa
- **gh-pages** - Despliegue en GitHub Pages

## 📁 Estructura del Proyecto

```
ritualitos/
├── public/              # Archivos públicos
├── src/
│   ├── App.js          # Componente principal
│   ├── index.css       # Estilos globales
│   └── index.js        # Punto de entrada
├── .env                # Variables de entorno (NO en Git)
├── .env.example        # Ejemplo de configuración
├── tailwind.config.js  # Configuración de Tailwind
├── postcss.config.js   # Configuración de PostCSS
└── package.json        # Dependencias y scripts
```

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.js` para personalizar la paleta de colores.

### Modificar Preguntas

Las preguntas están en el array `questions` dentro de `src/App.js`.

### Ajustar el Prompt de IA

El prompt para Gemini está en la función `generateRitual()` en `src/App.js`.

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm test` - Ejecuta los tests
- `npm run deploy` - Despliega a GitHub Pages

## 🐛 Solución de Problemas

### Error: "API Key no válida"
- Verifica que tu API Key de Gemini sea correcta
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de cambiar `.env`

### La aplicación no carga en GitHub Pages
- Verifica que la rama `gh-pages` exista
- Revisa la configuración en Settings → Pages
- Espera unos minutos después del deploy

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**jlcuenca**

- GitHub: [@jlcuenca](https://github.com/jlcuenca)

## 🙏 Agradecimientos

- Google Gemini por la API de IA
- La comunidad de React y Tailwind CSS
- Todos los que creen en el poder de los gestos significativos

---

Hecho con ❤️ y ✨ para tejer vínculos más profundos
