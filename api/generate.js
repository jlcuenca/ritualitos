export default async function handler(req, res) {
    // Configuración CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Obtener API Key del entorno seguro del servidor
    const apiKey = process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY no está configurada en las variables de entorno.");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const { who, climate, pain, light, message } = req.body;

        const prompt = `
        Eres 'Ritualitos', un sistema experto en psicología, vínculos y simbología ancestral.
        Tu misión es transformar el perfil de una persona en 3 recomendaciones significativas.

        DATOS DE ENTRADA:
        - Vínculo: ${who}
        - Clima Interno: ${climate}
        - Herida/Necesidad: ${pain}
        - Su Luz: ${light}
        - Mensaje Silencioso: ${message}

        REGLAS CRÍTICAS:
        1. Responde ÚNICAMENTE con un objeto JSON válido.
        2. No incluyas texto antes ni después del JSON.
        3. No uses bloques de código (sin \`\`\`json). Solo el texto plano del objeto JSON.
        4. El tono debe ser poético, cálido y profundo.
        5. Evita temas prohibidos o dañinos; si el contenido es sensible, mantén un enfoque de apoyo emocional suave.

        ESTRUCTURA JSON REQUERIDA:
        {
          "analisis": "Frase corta y poética sobre su estado.",
          "material": { "titulo": "...", "descripcion": "...", "significado": "..." },
          "experiencial": { "titulo": "...", "descripcion": "...", "significado": "..." },
          "simbolico": { "titulo": "...", "descripcion": "...", "significado": "..." },
          "cierre": "Frase final de luz."
        }
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Verificar si la respuesta fue bloqueada por seguridad
        if (data.candidates && data.candidates[0].finishReason === 'SAFETY') {
            return res.status(400).json({
                error: 'Contenido Sensible',
                details: 'La intención es profunda, pero por favor intenta expresar tus respuestas con palabras más suaves para que el ritual pueda florecer.'
            });
        }

        if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts) {
            throw new Error("Respuesta incompleta de la IA");
        }

        let textResponse = data.candidates[0].content.parts[0].text;

        // Extraer JSON de bloques de código markdown o texto plano de forma más robusta
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            textResponse = jsonMatch[0];
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(textResponse);
        } catch (parseError) {
            console.error("Failed to parse AI response:", textResponse);
            throw new Error("Invalid JSON format from AI");
        }

        // --- VALIDACIÓN Y NORMALIZACIÓN FLEXIBLE ---
        const getProp = (obj, key) => {
            if (!obj) return null;
            return obj[key] || obj[key.toLowerCase()] || obj[key.charAt(0).toUpperCase() + key.slice(1)];
        };

        const finalResponse = {
            analisis: getProp(jsonResponse, 'analisis') || "Un ritual para honrar vuestra conexión.",
            material: {
                titulo: getProp(jsonResponse.material, 'titulo') || "Objeto Ritual",
                descripcion: getProp(jsonResponse.material, 'descripcion') || "Un detalle con alma.",
                significado: getProp(jsonResponse.material, 'significado') || "Nutrir el vínculo."
            },
            experiencial: {
                titulo: getProp(jsonResponse.experiencial, 'titulo') || "Encuentro Esencial",
                descripcion: getProp(jsonResponse.experiencial, 'descripcion') || "Una vivencia compartida.",
                significado: getProp(jsonResponse.experiencial, 'significado') || "Volver a vuestra raíz."
            },
            simbolico: {
                titulo: getProp(jsonResponse.simbolico, 'titulo') || "Acto de Poder",
                descripcion: getProp(jsonResponse.simbolico, 'descripcion') || "Un pequeño gesto sagrado.",
                significado: getProp(jsonResponse.simbolico, 'significado') || "Manifestar la intención."
            },
            cierre: getProp(jsonResponse, 'cierre') || "Que la luz guíe vuestro camino."
        };

        res.status(200).json(finalResponse);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: 'Error generating ritual', details: error.message });
    }
}
