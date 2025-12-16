import React, { useState } from 'react';
import { Sparkles, Heart, Feather, Gift, Sun, CloudRain, Moon, ArrowRight, RefreshCw } from 'lucide-react';



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

  // Lógica de Generación vía Backend (Serverless)
  const generateRitual = async () => {
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
      // Llamada a NUESTRO backend (Serverless Function)
      // En desarrollo local (si usas `vercel dev`): http://localhost:3000/api/generate
      // En producción (Vercel): /api/generate

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
      });

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("API Error Details:", errorData);
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          }
          if (errorData.details) {
            errorMessage += ` (${errorData.details})`;
          }
        } catch (e) {
          console.error("Could not parse error response JSON", e);
        }
        throw new Error(errorMessage);
      }

      const jsonResponse = await response.json();

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

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2C2420] tracking-tight">
            Ritualitos
          </h1>

          <p className="text-base sm:text-lg text-[#6B5D55] leading-relaxed">
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
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-stone-100/50 p-6 md:p-12 relative overflow-hidden">

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
            className="w-full h-40 md:h-56 p-4 bg-[#FAF9F6] border-none rounded-xl text-[#4A403A] text-lg placeholder-stone-300 focus:ring-2 focus:ring-orange-200 resize-none transition-all"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Tarjeta Material */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xl shadow-stone-100/50 hover:shadow-2xl hover:shadow-stone-200/50 transition-all border-t-4 border-stone-200">
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
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xl shadow-stone-100/50 hover:shadow-2xl hover:shadow-stone-200/50 transition-all border-t-4 border-orange-200">
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
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xl shadow-stone-100/50 hover:shadow-2xl hover:shadow-stone-200/50 transition-all border-t-4 border-emerald-200">
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

            {/* Call to Action - Materializar */}
            <div className="bg-[#2C2420] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
              <div className="relative z-10 space-y-6">
                <Sparkles className="w-8 h-8 text-orange-400 mx-auto" />
                <h3 className="text-2xl md:text-3xl font-serif text-white">
                  ¿Quieres convertir este ritual en realidad?
                </h3>
                <p className="text-stone-300 max-w-xl mx-auto">
                  Déjanos tus datos y te ayudaremos a materializar este regalo con nuestra curaduría especial.
                  Es realidad tu regalo.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const email = formData.get('email');
                    const phone = formData.get('phone');

                    const subject = "Solicitud de Ritual Real - Ritualitos";
                    const body = `
Hola Ritualistas,

Quiero hacer realidad el siguiente ritual generado:

--- PERFIL ---
Vínculo: ${answers.who}
Clima: ${answers.climate}
Necesidad: ${answers.pain}
Luz: ${answers.light}
Mensaje: ${answers.message}

--- RITUAL GENERADO ---
Objeto: ${ritualData.material.titulo}
Experiencia: ${ritualData.experiencial.titulo}
Símbolo: ${ritualData.simbolico.titulo}

--- MIS DATOS ---
Correo: ${email}
Teléfono: ${phone}

¿Qué opinan? Quiero conseguir mi ritual real.
                    `;

                    window.location.href = `mailto:contacto@ritualitos.mx?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className="max-w-md mx-auto space-y-4 mt-6"
                >
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    className="w-full px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Tu teléfono (WhatsApp)"
                    className="w-full px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    type="submit"
                    className="w-full px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors shadow-lg shadow-orange-900/50"
                  >
                    Materializar mi regalo
                  </button>
                </form>
              </div>
            </div>

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