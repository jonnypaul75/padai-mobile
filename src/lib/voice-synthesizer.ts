export class VoiceSynthesizer {
  private synth = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voiceName?: string;
  public isPaused = false;
  public isSpeaking = false;

  constructor(voiceName?: string) {
    this.voiceName = voiceName;
  }

  speak({
    text,
    lang = "en-US",
    rate = 1,
    pitch = 1,
    volume = 1,
    onStart,
    onEnd,
  }: {
    text: string;
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }) {
    if (!text.trim()) return;

    this.cancel(); // stop any ongoing speech

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = rate;
    this.utterance.pitch = pitch;
    this.utterance.volume = volume;

    const voices = this.synth.getVoices();
    if (this.voiceName) {
      const matched = voices.find((v) => v.name === this.voiceName);
      if (matched) this.utterance.voice = matched;
    }

    this.utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      onStart?.();
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      onEnd?.();
    };

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPaused = true;
      this.isSpeaking = true;
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
      this.isSpeaking = true;
    }
  }

  cancel() {
    this.synth.cancel();
    this.isPaused = false;
    this.isSpeaking = false;
  }
}

export function extractVisibleTextFromHTML(htmlString: string): string {
  if (!htmlString.trim()) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Remove elements that don't contribute to visible text
  doc
    .querySelectorAll("script, style, noscript, iframe, head, meta, link")
    .forEach((el) => el.remove());

  // Return only the visible text
  return doc.body?.innerText.trim() || "";
}
