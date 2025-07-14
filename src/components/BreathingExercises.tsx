import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, Heart, Zap } from 'lucide-react';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  technique: string;
  duration: number;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
  backgroundMusic?: string;
}

const BreathingExercises = () => {
  const [exercises] = useState<BreathingExercise[]>([
    {
      id: '1',
      name: '4-7-8 Breathing',
      description: 'A powerful technique for instant relaxation and better sleep',
      technique: 'Inhale for 4, hold for 7, exhale for 8',
      duration: 240,
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 8,
      benefits: ['Reduces anxiety', 'Improves sleep', 'Lowers stress'],
      difficulty: 'beginner',
      audioUrl: 'https://www.soundjay.com/misc/sounds/breathing-1.wav',
      backgroundMusic: 'https://www.soundjay.com/misc/sounds/calm-music-1.wav'
    },
    {
      id: '2',
      name: 'Box Breathing',
      description: 'Navy SEAL technique for focus and stress management',
      technique: 'Equal counts for inhale, hold, exhale, hold',
      duration: 300,
      inhale: 4,
      hold: 4,
      exhale: 4,
      cycles: 12,
      benefits: ['Improves focus', 'Reduces stress', 'Enhances performance'],
      difficulty: 'intermediate',
      audioUrl: 'https://www.soundjay.com/misc/sounds/breathing-2.wav',
      backgroundMusic: 'https://www.soundjay.com/misc/sounds/focus-music-1.wav'
    },
    {
      id: '3',
      name: 'Wim Hof Method',
      description: 'Energizing breathwork for vitality and cold resistance',
      technique: '30 deep breaths followed by retention',
      duration: 600,
      inhale: 2,
      hold: 0,
      exhale: 1,
      cycles: 30,
      benefits: ['Increases energy', 'Boosts immunity', 'Improves resilience'],
      difficulty: 'advanced',
      audioUrl: 'https://www.soundjay.com/misc/sounds/breathing-3.wav',
      backgroundMusic: 'https://www.soundjay.com/misc/sounds/energy-music-1.wav'
    },
    {
      id: '4',
      name: 'Coherent Breathing',
      description: 'Balanced breathing for heart rate variability',
      technique: '5 seconds in, 5 seconds out',
      duration: 300,
      inhale: 5,
      hold: 0,
      exhale: 5,
      cycles: 30,
      benefits: ['Balances nervous system', 'Improves HRV', 'Reduces blood pressure'],
      difficulty: 'beginner',
      audioUrl: 'https://www.soundjay.com/misc/sounds/breathing-4.wav',
      backgroundMusic: 'https://www.soundjay.com/misc/sounds/heart-music-1.wav'
    },
    {
      id: '5',
      name: 'Alternate Nostril',
      description: 'Yogic breathing for balance and clarity',
      technique: 'Breathe through one nostril at a time',
      duration: 480,
      inhale: 4,
      hold: 2,
      exhale: 4,
      cycles: 20,
      benefits: ['Balances brain hemispheres', 'Improves concentration', 'Calms mind'],
      difficulty: 'intermediate',
      audioUrl: 'https://www.soundjay.com/misc/sounds/breathing-5.wav',
      backgroundMusic: 'https://www.soundjay.com/misc/sounds/yoga-music-1.wav'
    },
    {
      id: '6',
      name: 'Bellows Breath',
      description: 'Rapid breathing for energy and alertness',
      technique: 'Quick, forceful breaths through the nose',
      duration: 180,
      inhale: 1,
      hold: 0,
      exhale: 1,
      cycles: 60,
      benefits: ['Increases alertness', 'Boosts metabolism', 'Energizes body'],
      difficulty: 'advanced',
      audioUrl: 'https://www.soundjay.com/misc/sounds/breathing-6.wav',
      backgroundMusic: 'https://www.soundjay.com/misc/sounds/power-music-1.wav'
    }
  ]);

  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [breathingAudio, setBreathingAudio] = useState<HTMLAudioElement | null>(null);
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const difficultyIcons = {
    beginner: Wind,
    intermediate: Heart,
    advanced: Zap
  };

  useEffect(() => {
    if (isActive && selectedExercise && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isActive && selectedExercise && timeLeft === 0) {
      // Move to next phase
      if (currentPhase === 'inhale') {
        if (selectedExercise.hold > 0) {
          setCurrentPhase('hold');
          setTimeLeft(selectedExercise.hold);
        } else {
          setCurrentPhase('exhale');
          setTimeLeft(selectedExercise.exhale);
        }
      } else if (currentPhase === 'hold') {
        setCurrentPhase('exhale');
        setTimeLeft(selectedExercise.exhale);
      } else if (currentPhase === 'exhale') {
        if (currentCycle < selectedExercise.cycles - 1) {
          setCurrentCycle(currentCycle + 1);
          setCurrentPhase('inhale');
          setTimeLeft(selectedExercise.inhale);
        } else {
          // Exercise complete
          setIsActive(false);
          setCurrentCycle(0);
          setCurrentPhase('inhale');
        }
      }
    }
  }, [isActive, timeLeft, currentPhase, currentCycle, selectedExercise]);

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setCurrentPhase('inhale');
    setTimeLeft(exercise.inhale);
    setCurrentCycle(0);
    setIsActive(true);

    // Setup audio
    if (exercise.audioUrl) {
      const audio = new Audio(exercise.audioUrl);
      audio.loop = true;
      setBreathingAudio(audio);
    }

    if (exercise.backgroundMusic) {
      const bgAudio = new Audio(exercise.backgroundMusic);
      bgAudio.loop = true;
      bgAudio.volume = 0.3;
      bgAudio.play();
      setBackgroundAudio(bgAudio);
    }
  };

  const pauseExercise = () => {
    setIsActive(!isActive);
    if (backgroundAudio) {
      if (isActive) {
        backgroundAudio.pause();
      } else {
        backgroundAudio.play();
      }
    }
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    if (selectedExercise) {
      setTimeLeft(selectedExercise.inhale);
    }
    
    if (breathingAudio) {
      breathingAudio.pause();
      breathingAudio.currentTime = 0;
    }
    if (backgroundAudio) {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
    }
  };

  const closeExercise = () => {
    setSelectedExercise(null);
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    
    if (breathingAudio) {
      breathingAudio.pause();
      setBreathingAudio(null);
    }
    if (backgroundAudio) {
      backgroundAudio.pause();
      setBackgroundAudio(null);
    }
  };

  const getPhaseInstruction = () => {
    if (!selectedExercise) return '';
    
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return '';
    }
  };

  const getCircleScale = () => {
    if (!selectedExercise) return 1;
    
    const totalPhaseTime = currentPhase === 'inhale' ? selectedExercise.inhale :
                          currentPhase === 'hold' ? selectedExercise.hold :
                          selectedExercise.exhale;
    
    const progress = (totalPhaseTime - timeLeft) / totalPhaseTime;
    
    if (currentPhase === 'inhale') {
      return 1 + (progress * 0.5);
    } else if (currentPhase === 'exhale') {
      return 1.5 - (progress * 0.5);
    }
    return 1.5;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Guided{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
              Breathing Exercises
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Master the art of conscious breathing with our guided exercises designed to reduce stress, improve focus, and enhance overall well-being.
          </p>
        </div>

        {/* Exercises Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exercises.map((exercise) => {
            const DifficultyIcon = difficultyIcons[exercise.difficulty];
            return (
              <div
                key={exercise.id}
                className="bg-stone-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                onClick={() => startExercise(exercise)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <DifficultyIcon className="w-5 h-5 text-forest-600" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  <span className="text-sm text-stone-500">{Math.floor(exercise.duration / 60)} min</span>
                </div>
                
                <h3 className="text-xl font-semibold text-stone-800 mb-2 group-hover:text-forest-600 transition-colors">
                  {exercise.name}
                </h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  {exercise.description}
                </p>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-stone-700 mb-2">Technique:</div>
                  <div className="text-sm text-stone-600 bg-white p-3 rounded-lg">
                    {exercise.technique}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-stone-700 mb-2">Benefits:</div>
                  <div className="flex flex-wrap gap-2">
                    {exercise.benefits.map((benefit, index) => (
                      <span key={index} className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-forest-600 text-white py-3 rounded-xl font-semibold hover:bg-forest-700 transition-colors flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Start Exercise</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Breathing Exercise Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
              <button
                onClick={closeExercise}
                className="absolute top-4 right-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-800"
              >
                ×
              </button>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-stone-800 mb-2">{selectedExercise.name}</h3>
                <p className="text-stone-600">Cycle {currentCycle + 1} of {selectedExercise.cycles}</p>
              </div>
              
              {/* Breathing Circle */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-forest-600 to-sage-500 flex items-center justify-center transition-transform duration-1000 ease-in-out"
                    style={{ transform: `scale(${getCircleScale()})` }}
                  >
                    <div className="text-white text-center">
                      <div className="text-lg font-semibold">{getPhaseInstruction()}</div>
                      <div className="text-2xl font-bold">{timeLeft}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={pauseExercise}
                  className="w-12 h-12 bg-forest-600 text-white rounded-full flex items-center justify-center hover:bg-forest-700 transition-colors"
                >
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={resetExercise}
                  className="w-12 h-12 bg-stone-200 text-stone-600 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BreathingExercises;