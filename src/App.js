import React, { useState } from 'react';
import { Sparkles, Heart, Feather, Gift, Sun, CloudRain, Moon, ArrowRight, RefreshCw } from 'lucide-react';

// Configuración de la API de Gemini
// La clave se obtiene de las variables de entorno
const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";

const RitualitosApp = () => {
  const [step, setStep] = useState('landing'); // landing, form, loading, results, error
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    who: '',
    climate: '',
    pain: '',
    light: '',
    message: ''
  });
  const [ritualData, setRitualData] = useState(null);
  const [loadingText, setLoadingText] = useState('Conectando con la intención...');

  const questions = [
    {
      id: 'who',
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      question: "¿Quién es y qué es para ti?",
      placeholder: "Ej: Mi hermana mayor, nuestro vínculo es de complicidad y admiración...",
      helper: "Define su rol y la esencia de su conexión hoy."
    },
    {
      id: 'climate',
      icon: <CloudRain className="w-6 h-6 text-indigo-500" />,
      question: "¿Cuál es su 'clima' actual?",
      placeholder: "Ej: Está en un invierno emocional, introspectiva, un poco cansada...",
      helper: "Primavera (renovación), Verano (plenitud), Otoño (soltar), Invierno (pausa)."
    },
    {
      id: 'pain',
      icon: <Moon className="w-6 h-6 text-slate-500" />,
      question: "¿Qué le duele o qué le falta?",
      placeholder: "Ej: Le falta tiempo para sí misma, necesita validación, sanar una pérdida...",
      helper: "Identifica su herida o su necesidad más profunda."
    },
    {
      id: 'light',
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      question: "¿Qué enciende su luz?",
      placeholder: "Ej: La naturaleza, cocinar para otros, la música antigua...",
      helper: "Aquello que le roba una sonrisa genuina."
    },
    {
      id: 'message',
      icon: <Feather className="w-6 h-6 text-emerald-600" />,
      question: "Si hablaras sin palabras, ¿qué le dirías?",
      placeholder: "Ej: 'No estás sola', 'Gracias por ser mi raíz', 'Vuela alto'...",
      helper: "La intención pura detrás del regalo."
    }
  ];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      generateRitual();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      setStep('landing');
    }
  };

  // Lógica de Generación con IA
  const generateRitual = async () => {
    if (!apiKey) {
      setStep('error');
      console.error("API Key is missing");
      alert("Falta la clave de API. Por favor configura REACT_APP_GEMINI_API_KEY en el archivo .env");
      return;
    }

    setStep('loading');

    // Rotación de mensajes de carga
    const messages = [
      "Interpretando su energía...",
      "Buscando en las raíces...",
      "Tejiendo el significado...",
      "Creando el ritual perfecto..."
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    }, 2000);

    try {
      const prompt = `
        Actúa como 'Ritualitos', un sistema experto en psicología, vínculos humanos y simbología ancestral.
        
        PERFIL DE LA PERSONA:
        1. Vínculo: ${answers.who}
        2. Clima Interno: ${answers.climate}
        3. Herida/Necesidad: ${answers.pain}
        4. Su Luz: ${answers.light}
        5. Mensaje Silencioso: ${answers.message}

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

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
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

      const data = await response.json();
      let textResponse = data.candidates[0].content.parts[0].text;

      // Limpiar la respuesta de bloques de código markdown si existen
      textResponse = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');

      const jsonResponse = JSON.parse(textResponse); // Parseamos el JSON

      setRitualData(jsonResponse);
      clearInterval(interval);
      setStep('results');

    } catch (error) {
      console.error("Error:", error);
      clearInterval(interval);
      setStep('error');
    }
  };

  const restart = () => {
    setAnswers({ who: '', climate: '', pain: '', light: '', message: '' });
    setCurrentQuestion(0);
    setStep('landing');
    setRitualData(null);
  };

  // --- COMPONENTES DE VISTA ---

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#4A403A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-stone-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-md w-full text-center z-10 space-y-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-xl shadow-orange-100/50">
              <Sparkles className="w-10 h-10 text-orange-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2420] tracking-tight">
            Ritualitos
          </h1>

          <p className="text-lg text-[#6B5D55] leading-relaxed">
            Aquí no buscamos regalos, tejemos vínculos. <br />
            Un espacio para encontrar el gesto perfecto <br />
            inspirado en la raíz, la emoción y el alma.
          </p>

          <button
            onClick={() => setStep('form')}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 bg-[#2C2420] rounded-full hover:bg-[#4A403A] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
          >
            Comenzar el Ritual
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    const q = questions[currentQuestion];
    const isLast = currentQuestion === questions.length - 1;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-stone-100/50 p-8 md:p-12 relative overflow-hidden">

          {/* Barra de progreso */}
          <div className="absolute top-0 left-0 h-1 bg-stone-100 w-full">
            <div
              className="h-full bg-orange-400 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="mb-8">
            <button onClick={handleBack} className="text-stone-400 hover:text-stone-600 text-sm flex items-center mb-6">
              ← {currentQuestion === 0 ? 'Inicio' : 'Anterior'}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-stone-50 rounded-2xl">
                {q.icon}
              </div>
              <span className="text-stone-400 text-sm font-medium tracking-widest uppercase">
                Paso {currentQuestion + 1} de {questions.length}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif text-[#2C2420] mb-3">
              {q.question}
            </h2>
            <p className="text-[#8C8179] text-sm md:text-base">
              {q.helper}
            </p>
          </div>

          <textarea
            autoFocus
            value={answers[q.id]}
            onChange={handleInputChange}
            placeholder={q.placeholder}
            className="w-full h-32 md:h-40 p-4 bg-[#FAF9F6] border-none rounded-xl text-[#4A403A] text-lg placeholder-stone-300 focus:ring-2 focus:ring-orange-200 resize-none transition-all"
          />

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!answers[q.id].trim()}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center ${answers[q.id].trim()
                ? 'bg-[#2C2420] text-white hover:bg-[#4A403A] shadow-lg'
                : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                }`}
            >
              {isLast ? 'Revelar Ritual' : 'Continuar'}
              {isLast ? <Sparkles className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-orange-100 rounded-full animate-spin-slow"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-orange-400 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-400 w-8 h-8 animate-pulse" />
        </div>
        <h3 className="mt-8 text-xl font-serif text-[#2C2420] animate-pulse">
          {loadingText}
        </h3>
        <p className="mt-2 text-stone-400 text-sm">
          Respirando la esencia de tus respuestas...
        </p>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">Hubo un problema al conectar con la esencia.</p>
        <button onClick={() => setStep('form')} className="text-stone-600 underline">Intentar de nuevo</button>
      </div>
    )
  }

  if (step === 'results' && ritualData) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Header Análisis */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
              <Sparkles className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2420]">Tu Guía de Conexión</h2>
            <p className="text-lg text-[#6B5D55] max-w-2xl mx-auto italic font-serif">
              "{ritualData.analisis}"
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Tarjeta Material */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-stone-100/50 hover:shadow-2xl hover:shadow-stone-200/50 transition-all border-t-4 border-stone-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-stone-100 rounded-lg"><Gift className="w-5 h-5 text-stone-600" /></div>
                <h3 className="font-serif text-xl text-[#2C2420]">El Objeto</h3>
              </div>
              <h4 className="text-lg font-bold text-orange-900 mb-2">{ritualData.material.titulo}</h4>
              <p className="text-[#6B5D55] mb-4 text-sm leading-relaxed">{ritualData.material.descripcion}</p>
              <div className="bg-[#FDFBF7] p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Intención</p>
                <p className="text-sm text-stone-600 italic">{ritualData.material.significado}</p>
              </div>
            </div>

            {/* Tarjeta Experiencial */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-stone-100/50 hover:shadow-2xl hover:shadow-stone-200/50 transition-all border-t-4 border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-50 rounded-lg"><Sun className="w-5 h-5 text-orange-500" /></div>
                <h3 className="font-serif text-xl text-[#2C2420]">La Experiencia</h3>
              </div>
              <h4 className="text-lg font-bold text-orange-900 mb-2">{ritualData.experiencial.titulo}</h4>
              <p className="text-[#6B5D55] mb-4 text-sm leading-relaxed">{ritualData.experiencial.descripcion}</p>
              <div className="bg-[#FDFBF7] p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Conexión</p>
                <p className="text-sm text-stone-600 italic">{ritualData.experiencial.significado}</p>
              </div>
            </div>

            {/* Tarjeta Simbólica */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-stone-100/50 hover:shadow-2xl hover:shadow-stone-200/50 transition-all border-t-4 border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg"><Feather className="w-5 h-5 text-emerald-600" /></div>
                <h3 className="font-serif text-xl text-[#2C2420]">El Ritual</h3>
              </div>
              <h4 className="text-lg font-bold text-orange-900 mb-2">{ritualData.simbolico.titulo}</h4>
              <p className="text-[#6B5D55] mb-4 text-sm leading-relaxed">{ritualData.simbolico.descripcion}</p>
              <div className="bg-[#FDFBF7] p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Símbolo</p>
                <p className="text-sm text-stone-600 italic">{ritualData.simbolico.significado}</p>
              </div>
            </div>

          </div>

          <div className="text-center pb-12">
            <p className="text-stone-500 mb-8 font-serif italic text-lg">{ritualData.cierre}</p>
            <button
              onClick={restart}
              className="inline-flex items-center px-6 py-2 border border-stone-200 rounded-full text-stone-500 hover:bg-white hover:text-[#2C2420] transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Crear otro ritual
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
};

export default RitualitosApp;