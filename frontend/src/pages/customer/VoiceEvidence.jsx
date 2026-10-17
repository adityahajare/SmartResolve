import React, { useState } from 'react';
import { Mic, Square, CheckCircle, Upload, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VoiceEvidence = () => {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [acousticEmotion, setAcousticEmotion] = useState(null);

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      // Realistic simulation of Whisper STT + Acoustic Tone Extraction
      setTranscript('UPI transaction deducted ₹4,500 on 14th Oct from my account but the checkout portal showed timeout. Need immediate reversal as per RBI guidelines.');
      setAcousticEmotion({
        pitchVariation: 'High (Stressed)',
        detectedTone: 'Frustrated / Urgent',
        intensityBoost: '+20 pts',
        speechRate: '162 wpm (Fast)'
      });
    } else {
      setRecording(true);
      setTranscript('');
      setAcousticEmotion(null);
    }
  };

  const handleProceed = () => {
    navigate(`/raise?description=${encodeURIComponent(transcript)}&channel=voice`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
          <Mic className="w-6 h-6 text-fuchsia-400" /> Voice Evidence & Speech-To-Text Ingestion
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Record your grievance or upload call recordings. Whisper STT transcribes speech while the acoustic engine analyzes vocal stress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Recording Studio (7 Cols) */}
        <div className="md:col-span-7 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-8 shadow-2xl text-center space-y-6 flex flex-col items-center justify-center">
          <div className="relative">
            {recording && (
              <div className="absolute -inset-4 rounded-full bg-rose-500/30 animate-ping"></div>
            )}
            <button
              onClick={toggleRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all shadow-[0_0_30px_rgba(217,70,239,0.4)] ${
                recording 
                  ? 'bg-rose-600 scale-105' 
                  : 'bg-gradient-to-tr from-fuchsia-600 to-indigo-600 hover:scale-105'
              }`}
            >
              {recording ? <Square className="w-9 h-9 fill-current" /> : <Mic className="w-9 h-9" />}
            </button>
          </div>

          <div>
            <h3 className="font-bold text-white text-base">
              {recording ? 'Recording Voice Stream...' : 'Tap to Record Voice Grievance'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {recording 
                ? 'Speak clearly. Explain what happened, transaction reference, amount, and deadline.'
                : 'Supports English, Hindi, and multi-lingual grievance speech.'}
            </p>
          </div>

          {transcript && (
            <div className="w-full text-left bg-[#1e1538] border border-fuchsia-950/80 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-fuchsia-400 block tracking-wider">
                Transcribed Audio (Whisper STT):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{transcript}</p>
            </div>
          )}

          {transcript && (
            <button
              onClick={handleProceed}
              className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-2"
            >
              Continue with Voice Evidence <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Acoustic Stress & Tone Diagnostics (5 Cols) */}
        <div className="md:col-span-5 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3 pb-2 border-b border-fuchsia-950/60">
              <Volume2 className="w-4 h-4 text-fuchsia-400" /> Acoustic Emotion & Pitch Analysis
            </h3>

            {acousticEmotion ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80 flex justify-between items-center">
                  <span className="text-slate-400">Detected Vocal Tone</span>
                  <span className="font-bold text-rose-400">{acousticEmotion.detectedTone}</span>
                </div>

                <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80 flex justify-between items-center">
                  <span className="text-slate-400">Pitch Stress Deviation</span>
                  <span className="font-bold text-amber-400">{acousticEmotion.pitchVariation}</span>
                </div>

                <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80 flex justify-between items-center">
                  <span className="text-slate-400">Speaking Velocity</span>
                  <span className="font-mono text-cyan-300">{acousticEmotion.speechRate}</span>
                </div>

                <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80 flex justify-between items-center">
                  <span className="text-slate-400">Acoustic Priority Boost</span>
                  <span className="font-bold text-emerald-400">{acousticEmotion.intensityBoost}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Sparkles className="w-6 h-6 mx-auto text-slate-600" />
                <p className="text-xs">Record audio to view acoustic waveform analysis and vocal anger metrics.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-[#1a1230] rounded-xl border border-fuchsia-950/60 text-[11px] text-slate-400">
            Acoustic emotion is combined with NLP text sentiment to yield a reliable composite priority score.
          </div>
        </div>
      </div>
    </div>
  );
};
