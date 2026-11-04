/**
 * Royal Wedding Music Controller - Groom's Edition (Ashish & Shivangi)
 * Features seamless background audio with Web Audio API Shehnai & Tanpura synth fallback
 */

(function () {
  let isPlaying = false;
  let audioContext = null;
  let synthInterval = null;
  let audioElem = null;

  // Indian Classical Raag Yaman / Auspicious Wedding Frequencies (Hz)
  const SA = 220.0; // A3 (Kharaj / Root)
  const PA = 330.0; // E4 (Pancham)
  const notes = [
    SA, // Sa
    247.2, // Re
    277.2, // Ga
    311.1, // Ma
    PA, // Pa
    370.0, // Dha
    415.3, // Ni
    440.0, // Sa'
    370.0, 330.0, 311.1, 277.2, 247.2, SA
  ];

  const audioUrls = [
    'https://cdn.pixabay.com/download/audio/2022/10/14/audio_993d0a6c25.mp3?filename=indian-traditional-background-music-122485.mp3',
    'https://assets.mixkit.co/music/preview/mixkit-spirit-of-the-east-664.mp3'
  ];

  function initAudio() {
    if (!audioElem) {
      audioElem = new Audio();
      audioElem.crossOrigin = 'anonymous';
      audioElem.loop = true;
      audioElem.volume = 0.55;
      audioElem.src = audioUrls[0];
    }
  }

  function startWebAudioSynth() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.18, audioContext.currentTime);
      masterGain.connect(audioContext.destination);

      // Tanpura Drone Sa
      const droneSa = audioContext.createOscillator();
      const droneSaGain = audioContext.createGain();
      droneSa.type = 'sawtooth';
      droneSa.frequency.setValueAtTime(SA, audioContext.currentTime);
      droneSaGain.gain.setValueAtTime(0.04, audioContext.currentTime);
      
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, audioContext.currentTime);

      droneSa.connect(filter);
      filter.connect(droneSaGain);
      droneSaGain.connect(masterGain);
      droneSa.start();

      // Tanpura Drone Pa
      const dronePa = audioContext.createOscillator();
      const dronePaGain = audioContext.createGain();
      dronePa.type = 'sine';
      dronePa.frequency.setValueAtTime(PA, audioContext.currentTime);
      dronePaGain.gain.setValueAtTime(0.05, audioContext.currentTime);
      dronePa.connect(dronePaGain);
      dronePaGain.connect(masterGain);
      dronePa.start();

      // Melodic Shehnai notes
      let noteIndex = 0;
      synthInterval = setInterval(() => {
        if (!isPlaying) return;
        playShehnaiNote(notes[noteIndex % notes.length], masterGain);
        noteIndex++;
      }, 1600);

      window._droneStop = () => {
        try {
          droneSa.stop();
          dronePa.stop();
          clearInterval(synthInterval);
        } catch (e) {}
      };
    } catch (e) {
      console.warn('Web Audio synthesis fallback:', e);
    }
  }

  function playShehnaiNote(freq, destination) {
    if (!audioContext || audioContext.state === 'suspended') return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    const vibrato = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();
    vibrato.frequency.setValueAtTime(5.5, audioContext.currentTime);
    vibratoGain.gain.setValueAtTime(freq * 0.015, audioContext.currentTime);
    vibrato.connect(osc.frequency);
    vibrato.start();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, audioContext.currentTime);
    filter.Q.setValueAtTime(2.5, audioContext.currentTime);

    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 1.5);
    vibrato.stop(now + 1.5);
  }

  window.playRoyalMusic = function () {
    initAudio();
    isPlaying = true;
    updateMusicUI(true);

    const playPromise = audioElem.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        startWebAudioSynth();
      });
    }
  };

  window.pauseRoyalMusic = function () {
    isPlaying = false;
    updateMusicUI(false);
    if (audioElem) audioElem.pause();
    if (window._droneStop) window._droneStop();
  };

  window.toggleRoyalMusic = function () {
    if (isPlaying) {
      window.pauseRoyalMusic();
    } else {
      window.playRoyalMusic();
    }
  };

  function updateMusicUI(active) {
    const btn = document.getElementById('musicToggleBtn');
    if (!btn) return;
    if (active) {
      btn.classList.add('playing');
      btn.title = 'Pause Music';
    } else {
      btn.classList.remove('playing');
      btn.title = 'Play Wedding Shehnai Music';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('musicToggleBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleRoyalMusic();
      });
    }
  });
})();

