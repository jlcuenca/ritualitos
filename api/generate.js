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

        // Limpiar bloques de código markdown si existen
        if (textResponse.startsWith('```')) {
            textResponse = textResponse.replace(/^```(json)?\s*/, '').replace(/\s*```$/, '');
        }
        const jsonResponse = JSON.parse(textResponse);

        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: 'Error generating ritual', details: error.message });
    }
}
