import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, LayoutGrid, BarChart2, BookOpen, CheckCircle2, Circle } from 'lucide-react';

const STAGES = [
  "예습", "강의", "정리/이해", "1회독", "2회독", 
  "정리", "3회독", "백지테스트", "모의고사"
];

const TOPICS_CONFIG = {
  A: { title: "Clinical and Pharmacy Practice", count: 6 },
  B: { title: "Professionalism", count: 2 },
  C: { title: "Chemistry", count: 3 },
  D: { title: "Pharmaceutics", count: 3 },
  E: { title: "Biology", count: 4 },
  F: { title: "Pharmacology and Therapeutics", count: 8 }
};

const TOPIC_KEYS = Object.keys(TOPICS_CONFIG);

const generateInitialData = () => {
  const data = {};
  TOPIC_KEYS.forEach(key => {
    const lectures = [];
    for (let i = 1; i <= TOPICS_CONFIG[key].count; i++) {
      lectures.push({ id: `${key}${i}`, title: `${TOPICS_CONFIG[key].title} ${i}` });
    }
    data[key] = lectures;
  });
  return data;
};

const App = () => {
  const [activeTopic, setActiveTopic] = useState("A");
  const [lecturesByTopic] = useState(generateInitialData());
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('cardio_study_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cardio_study_progress', JSON.stringify(progress));
  }, [progress]);

  const toggleStage = (lectureId, stageIndex) => {
    const key = `${lectureId}-${stageIndex}`;
    setProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getTopicProgress = (topicKey) => {
    const lectures = lecturesByTopic[topicKey];
    const totalPossible = lectures.length * STAGES.length;
    let completed = 0;
    
    lectures.forEach(l => {
      STAGES.forEach((_, idx) => {
        if (progress[`${l.id}-${idx}`]) completed++;
      });
    });
    
    return Math.round((completed / totalPossible) * 100) || 0;
  };

  const getTotalProgress = () => {
    let totalCompleted = 0;
    let totalSteps = 0;
    
    TOPIC_KEYS.forEach(key => {
      const lectures = lecturesByTopic[key];
      totalSteps += lectures.length * STAGES.length;
      lectures.forEach(l => {
        STAGES.forEach((_, idx) => {
          if (progress[`${l.id}-${idx}`]) totalCompleted++;
        });
      });
    });
    
    return Math.round((totalCompleted / totalSteps) * 100) || 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full mb-2 tracking-widest uppercase">
            Module: Cardiovascular
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
            <BookOpen className="w-9 h-9 text-slate-600" />
            Study Tracker
          </h1>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6 min-w-[280px]">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Progress</p>
              <p className="text-2xl font-black text-slate-800">{getTotalProgress()}%</p>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-700 transition-all duration-700 ease-out" 
                style={{ width: `${getTotalProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Topic Selection</h2>
          {TOPIC_KEYS.map(key => {
            const isActive = activeTopic === key;
            const prog = getTopicProgress(key);
            return (
              <button
                key={key}
                onClick={() => setActiveTopic(key)}
                className={`w-full flex flex-col p-4 rounded-xl transition-all border ${
                  isActive 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xl shadow-slate-200 translate-x-2' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded flex items-center justify-center font-bold text-sm ${
                      isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {key}
                    </span>
                    <span className="font-bold text-sm text-left line-clamp-1">{TOPICS_CONFIG[key].title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : 'opacity-20'}`} />
                </div>
                <div className="w-full h-1 bg-current opacity-10 rounded-full mt-1">
                  <div className="h-full bg-current opacity-100 rounded-full transition-all duration-500" style={{ width: `${prog}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                   <span className="text-[10px] opacity-60 uppercase font-bold">{TOPICS_CONFIG[key].count} Lectures</span>
                   <span className="text-[10px] font-bold">{prog}%</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Content Table */}
        <section className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                   <LayoutGrid className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    {TOPICS_CONFIG[activeTopic].title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Topic {activeTopic} &bull; {lecturesByTopic[activeTopic].length} Lectures</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 sticky left-0 bg-slate-50 z-20">ID</th>
                    {STAGES.map((stage, idx) => (
                      <th key={idx} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 min-w-[90px]">
                        {stage}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lecturesByTopic[activeTopic].map((lecture) => (
                    <tr key={lecture.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4 font-black text-slate-700 border-b border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                        {lecture.id}
                      </td>
                      {STAGES.map((_, stageIdx) => {
                        const isDone = progress[`${lecture.id}-${stageIdx}`];
                        return (
                          <td key={stageIdx} className="p-2 border-b border-slate-100 text-center">
                            <button
                              onClick={() => toggleStage(lecture.id, stageIdx)}
                              className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all ${
                                isDone 
                                ? 'bg-slate-800 text-white shadow-inner scale-95' 
                                : 'bg-white border border-slate-200 text-slate-100 hover:border-slate-400 hover:text-slate-300'
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4 stroke-[3px]" /> : <Circle className="w-2 h-2 fill-current opacity-20" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-800 p-6 rounded-2xl text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Progress</p>
                  <p className="text-3xl font-black">{getTopicProgress(activeTopic)}%</p>
                </div>
                <BarChart2 className="w-10 h-10 opacity-20" />
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Steps Finished</p>
                  <p className="text-3xl font-black text-slate-800">
                    {Object.values(progress).filter(Boolean).length}
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-slate-200" />
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;