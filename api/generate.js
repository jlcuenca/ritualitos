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
        Actúa como 'Ritualitos', un sistema experto en psicología, vínculos humanos y simbología ancestral.
        
        PERFIL DE LA PERSONA:
        1. Vínculo: ${who}
        2. Clima Interno: ${climate}
        3. Herida/Necesidad: ${pain}
        4. Su Luz: ${light}
        5. Mensaje Silencioso: ${message}

        TAREA:
        Genera 3 recomendaciones de regalo/gesto altamente personalizadas.
        El tono debe ser cálido, humano, profundo y con toques de sabiduría ancestral.
        
        FORMATO JSON (IMPORTANTE: Solo devuelve el JSON, nada más):
        {
          "analisis": "Una frase poética y empática que resuma su estado actual y vuestro vínculo.",
          "material": {
            "titulo": "Nombre del objeto",
            "descripcion": "Qué es exactamente (sé específico, no genérico).",
            "significado": "El por qué emocional y simbólico."
          },
          "experiencial": {
            "titulo": "Nombre de la experiencia",
            "descripcion": "Qué harán (o hará) exactamente.",
            "significado": "Cómo esto sana o conecta."
          },
          "simbolico": {
            "titulo": "Nombre del ritual",
            "descripcion": "Un acto pequeño, psicomágico o simbólico.",
            "significado": "La intención espiritual/energética detrás."
          },
          "cierre": "Una frase final de bendición o buenos deseos."
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
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        let textResponse = data.candidates[0].content.parts[0].text;

        // Extraer JSON de bloques de código markdown de forma más robusta
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
        // Buscamos propiedades ignorando mayúsculas/minúsculas si es necesario
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
