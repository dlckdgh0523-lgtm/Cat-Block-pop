let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

// Cute meow - line clear
export function playMeow(skin: string = "cat") {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    if (skin === "pig") {
      // Happy oink
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(250, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.2);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.28);
      return;
    }
    if (skin === "dog") {
      // Happy bark
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(650, t + 0.05);
      osc.frequency.exponentialRampToValueAtTime(350, t + 0.15);
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.2);
      setTimeout(() => playTone(500, 0.08, "square", 0.08), 180);
      return;
    }
    if (skin === "fox") {
      // Excited yip
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(700, t);
      osc.frequency.exponentialRampToValueAtTime(1100, t + 0.06);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.18);
      g.gain.setValueAtTime(0.14, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.25);
      return;
    }
    if (skin === "rabbit") {
      // Excited squeak
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1100, t + 0.2);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.25);
      return;
    }
    if (skin === "bear") {
      // Satisfied rumble
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.1);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.3);
      const lfo = ctx.createOscillator();
      const lG = ctx.createGain();
      lfo.frequency.value = 10; lG.gain.value = 15;
      lfo.connect(lG); lG.connect(osc.frequency);
      lfo.start(t); lfo.stop(t + 0.35);
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.38);
      return;
    }

    // Default cat meow
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.25);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.35);
  } catch {}
}

// Happy chirp - combo
export function playChirp(skin: string = "cat") {
  if (skin === "pig") {
    // Double oink combo
    playTone(250, 0.08, "sawtooth", 0.12);
    setTimeout(() => playTone(300, 0.08, "sawtooth", 0.12), 80);
    setTimeout(() => playTone(400, 0.12, "sawtooth", 0.1), 160);
    return;
  }
  if (skin === "dog") {
    // Excited yap-yap-yap
    playTone(500, 0.06, "square", 0.1);
    setTimeout(() => playTone(600, 0.06, "square", 0.1), 60);
    setTimeout(() => playTone(700, 0.06, "square", 0.1), 120);
    setTimeout(() => playTone(800, 0.1, "square", 0.08), 180);
    return;
  }
  if (skin === "fox") {
    // Triple yip ascending
    playTone(800, 0.06, "triangle", 0.1);
    setTimeout(() => playTone(1000, 0.06, "triangle", 0.1), 70);
    setTimeout(() => playTone(1200, 0.1, "triangle", 0.08), 140);
    return;
  }
  if (skin === "rabbit") {
    // Hop-hop-hop
    playTone(400, 0.05, "sine", 0.12);
    setTimeout(() => playTone(600, 0.05, "sine", 0.12), 80);
    setTimeout(() => playTone(900, 0.08, "sine", 0.1), 160);
    return;
  }
  if (skin === "bear") {
    // Deep combo growl
    playTone(100, 0.1, "sawtooth", 0.12);
    setTimeout(() => playTone(120, 0.1, "sawtooth", 0.12), 100);
    setTimeout(() => playTone(150, 0.15, "sawtooth", 0.1), 200);
    return;
  }
  // Default cat
  playTone(900, 0.1, "sine", 0.15);
  setTimeout(() => playTone(1100, 0.1, "sine", 0.15), 80);
  setTimeout(() => playTone(1300, 0.15, "sine", 0.12), 160);
}

// Place sound - block placed
export function playPlace(skin: string = "cat") {
  if (skin === "pig") {
    playTone(200, 0.06, "sawtooth", 0.08);
    setTimeout(() => playTone(280, 0.05, "sawtooth", 0.06), 40);
    return;
  }
  if (skin === "dog") {
    playTone(350, 0.06, "sine", 0.1);
    setTimeout(() => playTone(450, 0.05, "sine", 0.08), 40);
    return;
  }
  if (skin === "fox") {
    playTone(500, 0.05, "triangle", 0.08);
    setTimeout(() => playTone(650, 0.04, "triangle", 0.06), 35);
    return;
  }
  if (skin === "rabbit") {
    playTone(700, 0.04, "sine", 0.08);
    setTimeout(() => playTone(900, 0.03, "sine", 0.06), 30);
    return;
  }
  if (skin === "bear") {
    playTone(150, 0.1, "sine", 0.12);
    setTimeout(() => playTone(200, 0.08, "sine", 0.08), 60);
    return;
  }
  // Default cat
  playTone(600, 0.08, "sine", 0.1);
  setTimeout(() => playTone(800, 0.06, "sine", 0.08), 50);
}

// Soft hiss - invalid placement
export function playHiss(skin: string = "cat") {
  try {
    if (skin === "pig") {
      // Annoyed grunt
      playTone(150, 0.12, "sawtooth", 0.1);
      return;
    }
    if (skin === "dog") {
      // Low growl
      playTone(120, 0.15, "sawtooth", 0.08);
      setTimeout(() => playTone(100, 0.1, "sawtooth", 0.06), 100);
      return;
    }
    if (skin === "fox") {
      // Warning bark
      playTone(600, 0.06, "triangle", 0.08);
      setTimeout(() => playTone(400, 0.08, "triangle", 0.06), 80);
      return;
    }
    if (skin === "rabbit") {
      // Foot stomp
      playTone(80, 0.1, "sine", 0.15);
      return;
    }
    if (skin === "bear") {
      // Deep warning rumble
      playTone(60, 0.2, "sawtooth", 0.1);
      return;
    }

    // Default cat hiss
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(3000, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + 0.15);
  } catch {}
}

// Sad sound - game over
export function playSad(skin: string = "cat") {
  if (skin === "pig") {
    // Sad oink descending
    playTone(300, 0.2, "sawtooth", 0.12);
    setTimeout(() => playTone(220, 0.25, "sawtooth", 0.1), 200);
    setTimeout(() => playTone(150, 0.4, "sawtooth", 0.08), 420);
    return;
  }
  if (skin === "dog") {
    // Sad whimper
    playTone(600, 0.15, "sine", 0.12);
    setTimeout(() => playTone(500, 0.15, "sine", 0.1), 150);
    setTimeout(() => playTone(350, 0.3, "sine", 0.1), 300);
    setTimeout(() => playTone(300, 0.4, "sine", 0.08), 500);
    return;
  }
  if (skin === "fox") {
    // Sad descending chirps
    playTone(700, 0.1, "triangle", 0.1);
    setTimeout(() => playTone(550, 0.12, "triangle", 0.08), 150);
    setTimeout(() => playTone(400, 0.2, "triangle", 0.08), 300);
    return;
  }
  if (skin === "rabbit") {
    // Quiet sad thumps
    playTone(200, 0.15, "sine", 0.12);
    setTimeout(() => playTone(150, 0.2, "sine", 0.1), 200);
    setTimeout(() => playTone(100, 0.35, "sine", 0.08), 400);
    return;
  }
  if (skin === "bear") {
    // Deep sad growl
    playTone(120, 0.3, "sawtooth", 0.12);
    setTimeout(() => playTone(90, 0.35, "sawtooth", 0.1), 280);
    setTimeout(() => playTone(60, 0.5, "sawtooth", 0.08), 560);
    return;
  }
  // Default cat
  playTone(500, 0.2, "sine", 0.15);
  setTimeout(() => playTone(400, 0.2, "sine", 0.12), 180);
  setTimeout(() => playTone(300, 0.4, "sine", 0.1), 360);
}

// Pop sound - cells clearing
export function playPop() {
  playTone(1000, 0.06, "sine", 0.1);
}

// ─── Cat-type-specific break sounds ───
export function playCatBreak(catType: number) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    switch (catType) {
      case 0: {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.12);
        osc.frequency.exponentialRampToValueAtTime(700, t + 0.25);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.3);
        break;
      }
      case 1: {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(250, t + 0.35);
        g.gain.setValueAtTime(0.18, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.4);
        break;
      }
      case 2: {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(350, t + 0.08);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.12);
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = "square";
        osc2.frequency.setValueAtTime(800, t + 0.06);
        g2.gain.setValueAtTime(0.08, t + 0.06);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc2.connect(g2); g2.connect(ctx.destination);
        osc2.start(t + 0.06); osc2.stop(t + 0.12);
        break;
      }
      case 3: {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(1000, t + 0.2);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.25);
        break;
      }
      case 4: {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, t);
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 25;
        lfoGain.gain.value = 40;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t); lfo.stop(t + 0.35);
        g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.35);
        break;
      }
      case 5: {
        [0, 60, 120].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(700 + i * 150, t + delay / 1000);
          g.gain.setValueAtTime(0.14, t + delay / 1000);
          g.gain.exponentialRampToValueAtTime(0.001, t + delay / 1000 + 0.1);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t + delay / 1000);
          osc.stop(t + delay / 1000 + 0.1);
        });
        break;
      }
    }
  } catch {}
}

// ─── Item Sounds ───

// 츄르 아이템: "냐옹!" - short happy meow
export function playChuruSound(skin: string = "cat") {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    if (skin === "pig") {
      // Pig snort + munch
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.2);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.35);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.4);
      setTimeout(() => {
        playTone(120, 0.15, "sawtooth", 0.1);
      }, 500);
      return;
    }
    if (skin === "dog") {
      // Happy bark + panting
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(350, t);
      osc.frequency.exponentialRampToValueAtTime(550, t + 0.05);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.15);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.2);
      setTimeout(() => playTone(500, 0.08, "square", 0.08), 200);
      setTimeout(() => playTone(450, 0.06, "square", 0.06), 350);
      return;
    }
    if (skin === "fox") {
      // Fox chirp sequence
      [0, 80, 160].forEach((d, i) => {
        setTimeout(() => playTone(700 + i * 200, 0.08, "triangle", 0.12), d);
      });
      setTimeout(() => playTone(400, 0.15, "triangle", 0.08), 300);
      return;
    }
    if (skin === "rabbit") {
      // Soft crunch (carrot eating)
      [0, 120, 240, 360].forEach((d) => {
        setTimeout(() => {
          playTone(1200 + Math.random() * 400, 0.04, "square", 0.06);
          playTone(200, 0.06, "sine", 0.08);
        }, d);
      });
      return;
    }
    if (skin === "bear") {
      // Deep satisfied growl + slurp
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);
      const lfo = ctx.createOscillator();
      const lG = ctx.createGain();
      lfo.frequency.value = 8; lG.gain.value = 15;
      lfo.connect(lG); lG.connect(osc.frequency);
      lfo.start(t); lfo.stop(t + 0.45);
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.5);
      return;
    }

    // Default cat sound
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.35);
    g.gain.setValueAtTime(0.22, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.4);
    // Burp
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(200, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);
      g2.gain.setValueAtTime(0.1, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc2.connect(g2); g2.connect(ctx.destination);
      osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.2);
    }, 600);
  } catch {}
}

// 고양이풀: "냐아아아옹" - long drawn out meow
export function playCatnipSound(skin: string = "cat") {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    if (skin === "pig") {
      // Excited oinking
      [0, 150, 300, 450].forEach((d, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(200 + i * 30, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(350 + i * 30, ctx.currentTime + 0.05);
          osc.frequency.exponentialRampToValueAtTime(180 + i * 20, ctx.currentTime + 0.12);
          g.gain.setValueAtTime(0.12, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
        }, d);
      });
      return;
    }
    if (skin === "dog") {
      // Extended howl
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(600, t + 0.2);
      osc.frequency.linearRampToValueAtTime(550, t + 0.6);
      osc.frequency.linearRampToValueAtTime(400, t + 0.9);
      osc.frequency.exponentialRampToValueAtTime(250, t + 1.1);
      g.gain.setValueAtTime(0.18, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.5);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 1.2);
      const lfo = ctx.createOscillator();
      const lG = ctx.createGain();
      lfo.frequency.value = 5; lG.gain.value = 25;
      lfo.connect(lG); lG.connect(osc.frequency);
      lfo.start(t + 0.3); lfo.stop(t + 1.0);
      return;
    }
    if (skin === "fox") {
      // Rapid yipping
      [0, 100, 200, 350, 500, 700].forEach((d, i) => {
        setTimeout(() => {
          playTone(600 + (i % 3) * 200, 0.06, "triangle", 0.1);
        }, d);
      });
      return;
    }
    if (skin === "rabbit") {
      // Rapid thumping + squeak
      [0, 150, 300].forEach((d) => {
        setTimeout(() => playTone(100, 0.08, "sine", 0.15), d);
      });
      setTimeout(() => playTone(1200, 0.1, "sine", 0.08), 500);
      return;
    }
    if (skin === "bear") {
      // Long growl
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.3);
      osc.frequency.linearRampToValueAtTime(90, t + 0.8);
      osc.frequency.exponentialRampToValueAtTime(60, t + 1.1);
      const lfo = ctx.createOscillator();
      const lG = ctx.createGain();
      lfo.frequency.value = 12; lG.gain.value = 20;
      lfo.connect(lG); lG.connect(osc.frequency);
      lfo.start(t); lfo.stop(t + 1.1);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 1.2);
      return;
    }

    // Default cat sound
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.linearRampToValueAtTime(900, t + 0.15);
    osc.frequency.linearRampToValueAtTime(850, t + 0.5);
    osc.frequency.linearRampToValueAtTime(700, t + 0.8);
    osc.frequency.exponentialRampToValueAtTime(400, t + 1.0);
    g.gain.setValueAtTime(0.2, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 1.1);
    // Vibrato overlay
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 6;
    lfoG.gain.value = 30;
    lfo.connect(lfoG); lfoG.connect(osc.frequency);
    lfo.start(t + 0.2); lfo.stop(t + 1.0);
  } catch {}
}

// 꾹꾹이: soft rhythmic paw sounds
export function playKneadSound(skin: string = "cat") {
  try {
    if (skin === "pig") {
      // Hoof taps
      [0, 300, 600].forEach((delay) => {
        setTimeout(() => {
          playTone(180, 0.12, "square", 0.1);
          setTimeout(() => playTone(220, 0.08, "square", 0.06), 50);
        }, delay);
      });
      return;
    }
    if (skin === "dog") {
      // Scratchy paw
      [0, 250, 500].forEach((delay) => {
        setTimeout(() => {
          playTone(300, 0.15, "sawtooth", 0.06);
          setTimeout(() => playTone(400, 0.1, "sine", 0.1), 40);
        }, delay);
      });
      return;
    }
    if (skin === "fox") {
      // Light tap-tap
      [0, 200, 400, 550].forEach((delay) => {
        setTimeout(() => {
          playTone(500 + Math.random() * 200, 0.05, "triangle", 0.08);
        }, delay);
      });
      return;
    }
    if (skin === "rabbit") {
      // Soft thumps
      [0, 280, 560].forEach((delay) => {
        setTimeout(() => {
          playTone(120, 0.15, "sine", 0.18);
          setTimeout(() => playTone(150, 0.1, "sine", 0.1), 80);
        }, delay);
      });
      return;
    }
    if (skin === "bear") {
      // Heavy paw thuds
      [0, 400, 800].forEach((delay) => {
        setTimeout(() => {
          playTone(80, 0.2, "sine", 0.2);
          setTimeout(() => playTone(100, 0.15, "sine", 0.12), 80);
        }, delay);
      });
      return;
    }

    // Default cat sound
    [0, 350, 700].forEach((delay) => {
      setTimeout(() => {
        playTone(250, 0.2, "sine", 0.15);
        setTimeout(() => playTone(300, 0.12, "sine", 0.08), 60);
      }, delay);
    });
  } catch {}
}

// Purchase cha-ching
export function playPurchase() {
  playTone(800, 0.08, "sine", 0.12);
  setTimeout(() => playTone(1000, 0.08, "sine", 0.12), 60);
  setTimeout(() => playTone(1200, 0.15, "sine", 0.1), 120);
}

// ─── BGM Base Class ───
const NOTE: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C2: 65.41, G2: 98.00, E2: 82.41, F2: 87.31, A2: 110.00, D2: 73.42, B2: 123.47,
};

export class BGMPlayer {
  private ctx: AudioContext | null = null;
  private schedulerId: number | null = null;
  private nextNoteTime = 0;
  private melodyIdx = 0;
  private masterGain: GainNode | null = null;
  private _isPlaying = false;

  constructor(
    private bpm: number,
    private melodyNotes: string[],
    private bassNotes: string[],
    private chordNotes: string[],
    private melodyType: OscillatorType = "triangle",
    private volume: number = 0.18,
  ) {}

  get isPlaying() { return this._isPlaying; }

  start() {
    if (this._isPlaying) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
      this._isPlaying = true;
      this.melodyIdx = 0;
      this.nextNoteTime = this.ctx.currentTime + 0.1;
      this.scheduleAhead();
    } catch {}
  }

  stop() {
    this._isPlaying = false;
    if (this.schedulerId !== null) {
      clearTimeout(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
    this.masterGain = null;
  }

  private get eighth() { return 60 / this.bpm / 2; }

  private scheduleAhead() {
    if (!this._isPlaying || !this.ctx || !this.masterGain) return;
    while (this.nextNoteTime < this.ctx.currentTime + 0.6) {
      const eighth = this.eighth;
      const idx = this.melodyIdx % this.melodyNotes.length;

      this.playNote(NOTE[this.melodyNotes[idx]], this.nextNoteTime, eighth * 0.85, this.melodyType, 0.22);

      if (this.melodyIdx % 2 === 0) {
        const bassIdx = Math.floor(this.melodyIdx / 2) % this.bassNotes.length;
        this.playNote(NOTE[this.bassNotes[bassIdx]], this.nextNoteTime, eighth * 1.8, "sine", 0.18);
      }

      const chordIdx = idx % this.chordNotes.length;
      this.playNote(NOTE[this.chordNotes[chordIdx]], this.nextNoteTime, eighth * 0.6, "sine", 0.06);

      this.nextNoteTime += eighth;
      this.melodyIdx++;
    }
    this.schedulerId = window.setTimeout(() => this.scheduleAhead(), 250);
  }

  private playNote(freq: number, time: number, duration: number, type: OscillatorType, volume: number) {
    if (!this.ctx || !this.masterGain || !freq) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + duration + 0.01);
    } catch {}
  }
}

// ─── Game BGM (upbeat, music-box) ───
export const gameBgm = new BGMPlayer(
  108,
  ['E5','G5','A5','G5', 'E5','D5','C5','D5', 'E5','G5','A5','C5', 'A5','G5','E5','C5',
   'D5','E5','G5','E5', 'D5','C5','A4','C5', 'D5','E5','G5','A5', 'G5','E5','D5','C5'],
  ['C3','C3','G3','G3', 'A3','A3','E3','E3', 'F3','F3','C3','C3', 'G3','G3','C3','C3'],
  ['C4','E4','G4','E4', 'C4','E4','G4','E4', 'A3','C4','E4','C4', 'A3','C4','E4','C4',
   'F3','A3','C4','A3', 'C4','E4','G4','E4', 'G3','B3','D4','B3', 'C4','E4','G4','E4'],
  "triangle",
  0.16,
);

// ─── Lobby BGM (gentle, dreamy, slower) ───
export const lobbyBgm = new BGMPlayer(
  80,
  ['C5','E5','G5','E5', 'C5','A4','G4','A4', 'C5','D5','E5','D5', 'C5','A4','G4','C5',
   'A4','C5','E5','C5', 'G4','A4','C5','A4', 'G4','E4','G4','A4', 'G4','E4','C4','E4'],
  ['C2','C2','G2','G2', 'A2','A2','E2','E2', 'F2','F2','C2','C2', 'G2','G2','C2','C2'],
  ['E4','G4','C5','G4', 'E4','G4','C5','G4', 'C4','E4','A4','E4', 'C4','E4','A4','E4',
   'F4','A4','C5','A4', 'E4','G4','C5','G4', 'G4','B4','D5','B4', 'E4','G4','C5','G4'],
  "sine",
  0.12,
);

// Keep backward compat alias
export const bgm = gameBgm;

// ─── Skin-specific Game BGM Variants ───
// Pig: bouncy, playful, slightly lower pitch
export const pigGameBgm = new BGMPlayer(
  100,
  ['C5','E5','G5','E5', 'C5','A4','C5','E5', 'D5','F5','A5','F5', 'D5','C5','A4','C5',
   'E5','G5','A5','G5', 'E5','C5','E5','G5', 'C5','E5','D5','C5', 'A4','C5','E5','C5'],
  ['C3','C3','E3','E3', 'F3','F3','G3','G3', 'A3','A3','F3','F3', 'G3','G3','C3','C3'],
  ['C4','E4','G4','E4', 'F4','A4','C5','A4', 'D4','F4','A4','F4', 'G4','B4','D5','B4'],
  "square",
  0.14,
);

// Dog: energetic, faster, major key
export const dogGameBgm = new BGMPlayer(
  120,
  ['G5','A5','B4','G5', 'E5','D5','E5','G5', 'A5','G5','E5','D5', 'C5','D5','E5','G5',
   'A5','G5','E5','C5', 'D5','E5','G5','A5', 'B4','D5','G5','D5', 'E5','G5','A5','G5'],
  ['G3','G3','C3','C3', 'D3','D3','G3','G3', 'C3','C3','G3','G3', 'D3','D3','G3','G3'],
  ['G4','B4','D5','B4', 'C4','E4','G4','E4', 'D4','G4','B4','G4', 'C4','E4','G4','E4'],
  "triangle",
  0.16,
);

// Fox: mysterious, minor key, slightly eerie
export const foxGameBgm = new BGMPlayer(
  96,
  ['E5','G5','A5','E5', 'D5','E5','G5','D5', 'C5','E5','G5','A5', 'G5','E5','D5','C5',
   'A4','C5','E5','A4', 'G4','A4','C5','E5', 'D5','C5','A4','G4', 'A4','C5','D5','E5'],
  ['A3','A3','E3','E3', 'D3','D3','A3','A3', 'C3','C3','G3','G3', 'A3','A3','E3','E3'],
  ['A3','C4','E4','C4', 'D4','F4','A4','F4', 'E4','G4','B4','G4', 'A3','C4','E4','C4'],
  "sawtooth",
  0.12,
);

// Rabbit: light, airy, fast staccato
export const rabbitGameBgm = new BGMPlayer(
  116,
  ['C5','E5','G5','C5', 'D5','G5','E5','C5', 'F5','A5','G5','E5', 'D5','C5','E5','G5',
   'A5','G5','E5','C5', 'D5','E5','C5','G4', 'A4','C5','E5','G5', 'E5','C5','G4','C5'],
  ['C3','C3','F3','F3', 'G3','G3','C3','C3', 'F3','F3','G3','G3', 'C3','C3','G3','G3'],
  ['C4','E4','G4','E4', 'F4','A4','C5','A4', 'G4','B4','D5','B4', 'C4','E4','G4','E4'],
  "sine",
  0.14,
);

// Bear: slow, deep, powerful
export const bearGameBgm = new BGMPlayer(
  88,
  ['C5','E5','G5','E5', 'C5','G4','C5','E5', 'D5','G5','E5','C5', 'A4','C5','G4','C5',
   'E5','C5','G4','E4', 'G4','C5','E5','C5', 'D5','G5','E5','D5', 'C5','G4','E4','C4'],
  ['C2','C2','G2','G2', 'F2','F2','C2','C2', 'G2','G2','E2','E2', 'C2','C2','G2','G2'],
  ['C4','E4','G4','E4', 'F4','A4','C5','A4', 'G3','C4','E4','C4', 'G3','B3','D4','B3'],
  "triangle",
  0.15,
);

// ─── Get skin-specific game BGM ───
export function getSkinGameBgm(skin: string): BGMPlayer {
  switch (skin) {
    case "pig": return pigGameBgm;
    case "dog": return dogGameBgm;
    case "fox": return foxGameBgm;
    case "rabbit": return rabbitGameBgm;
    case "bear": return bearGameBgm;
    default: return gameBgm;
  }
}

// ─── Stop ALL background music ───
export function stopAllBgm() {
  lobbyBgm.stop();
  gameBgm.stop();
  pigGameBgm.stop();
  dogGameBgm.stop();
  foxGameBgm.stop();
  rabbitGameBgm.stop();
  bearGameBgm.stop();
}

// ─── Skin-specific break sounds ───
export function playPigBreak() {
  // Oink / snort sound
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.15);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.2);
  } catch {}
}

export function playDogBreak() {
  // Bark / yip sound
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.12);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.15);
  } catch {}
}

export function playFoxBreak() {
  // Fox chirp
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [0, 50, 100].forEach((d, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800 + i * 200, t + d / 1000);
      g.gain.setValueAtTime(0.1, t + d / 1000);
      g.gain.exponentialRampToValueAtTime(0.001, t + d / 1000 + 0.06);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t + d / 1000); osc.stop(t + d / 1000 + 0.06);
    });
  } catch {}
}

export function playRabbitBreak() {
  // Soft thump
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.15);
  } catch {}
}

export function playBearBreak() {
  // Deep growl
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);
    const lfo = ctx.createOscillator();
    const lG = ctx.createGain();
    lfo.frequency.value = 15; lG.gain.value = 20;
    lfo.connect(lG); lG.connect(osc.frequency);
    lfo.start(t); lfo.stop(t + 0.3);
    g.gain.setValueAtTime(0.14, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.35);
  } catch {}
}

export function playSkinBreak(skin: string) {
  switch (skin) {
    case "pig": playPigBreak(); break;
    case "dog": playDogBreak(); break;
    case "fox": playFoxBreak(); break;
    case "rabbit": playRabbitBreak(); break;
    case "bear": playBearBreak(); break;
    default: break; // cat uses playCatBreak
  }
}

// ─── Lobby Touch Reaction Sounds (per skin) ───
export function playTouchReaction(skin: string) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    switch (skin) {
      case "cat": {
        // Happy purr + chirp
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(320, t);
        osc1.frequency.exponentialRampToValueAtTime(480, t + 0.08);
        osc1.frequency.exponentialRampToValueAtTime(520, t + 0.15);
        osc1.frequency.exponentialRampToValueAtTime(400, t + 0.3);
        g1.gain.setValueAtTime(0.12, t);
        g1.gain.exponentialRampToValueAtTime(0.08, t + 0.15);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc1.connect(g1); g1.connect(ctx.destination);
        osc1.start(t); osc1.stop(t + 0.35);
        // Purr vibrato
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(60, t + 0.2);
        const lfo = ctx.createOscillator();
        const lG = ctx.createGain();
        lfo.frequency.value = 22; lG.gain.value = 15;
        lfo.connect(lG); lG.connect(osc2.frequency);
        lfo.start(t + 0.2); lfo.stop(t + 0.6);
        g2.gain.setValueAtTime(0, t);
        g2.gain.setValueAtTime(0.06, t + 0.2);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc2.connect(g2); g2.connect(ctx.destination);
        osc2.start(t + 0.2); osc2.stop(t + 0.6);
        break;
      }
      case "pig": {
        // Cute squeal
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(500, t + 0.06);
        osc.frequency.exponentialRampToValueAtTime(420, t + 0.12);
        osc.frequency.exponentialRampToValueAtTime(350, t + 0.25);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.3);
        break;
      }
      case "dog": {
        // Happy bark + pant
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(350, t);
        osc.frequency.exponentialRampToValueAtTime(550, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.12);
        // Second happy bark
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = "square";
        osc2.frequency.setValueAtTime(400, t + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(620, t + 0.2);
        osc2.frequency.exponentialRampToValueAtTime(450, t + 0.28);
        g2.gain.setValueAtTime(0.08, t + 0.15);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc2.connect(g2); g2.connect(ctx.destination);
        osc2.start(t + 0.15); osc2.stop(t + 0.3);
        break;
      }
      case "fox": {
        // Playful chirp sequence
        [0, 80, 160].forEach((d, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(600 + i * 180, t + d / 1000);
          osc.frequency.exponentialRampToValueAtTime(800 + i * 200, t + d / 1000 + 0.04);
          osc.frequency.exponentialRampToValueAtTime(500 + i * 150, t + d / 1000 + 0.08);
          g.gain.setValueAtTime(0.08, t + d / 1000);
          g.gain.exponentialRampToValueAtTime(0.001, t + d / 1000 + 0.1);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t + d / 1000); osc.stop(t + d / 1000 + 0.1);
        });
        break;
      }
      case "rabbit": {
        // Soft hop boing
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(450, t + 0.06);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.15);
        osc.frequency.exponentialRampToValueAtTime(500, t + 0.22);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.3);
        break;
      }
      case "bear": {
        // Low grumble
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.35);
        const lfo = ctx.createOscillator();
        const lG = ctx.createGain();
        lfo.frequency.value = 12; lG.gain.value = 25;
        lfo.connect(lG); lG.connect(osc.frequency);
        lfo.start(t); lfo.stop(t + 0.4);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.45);
        break;
      }
      default: {
        // Generic cute chirp
        playTone(400, 0.15, "sine", 0.1);
        break;
      }
    }
  } catch {}
}