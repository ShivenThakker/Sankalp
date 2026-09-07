import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Demo fallback if no API key
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return NextResponse.json({
        text: 'Hum 12 log hain, khana chahiye aur paani bhi. Bahut mushkil hai yahan.',
        language: 'hindi',
        duration: 5.2,
        simulated: true
      });
    }

    const groq = new Groq({ apiKey });

    // Send audio to Groq Whisper — NO language parameter = auto-detect
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: 'whisper-large-v3-turbo',
      response_format: 'verbose_json',
      temperature: 0.0,
    });

    return NextResponse.json({
      text: transcription.text || '',
      language: transcription.language || 'unknown',
      duration: transcription.duration || 0,
      simulated: false
    });

  } catch (error) {
    console.error('Transcribe Error:', error);

    // Return a graceful fallback so the SOS flow doesn't break
    return NextResponse.json({
      text: '',
      language: 'unknown',
      duration: 0,
      error: error.message,
      simulated: true
    });
  }
}

// Increase body size limit for audio files (default is 1MB, audio can be up to 25MB)
export const config = {
  api: {
    bodyParser: false,
  },
};
