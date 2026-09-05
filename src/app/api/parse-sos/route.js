import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { transcript, lat, lng, language } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    // If no API key, return a smart fallback for demo
    if (!apiKey) {
      return NextResponse.json({
        needs: ['food', 'rescue'],
        people: 5,
        urgency: 'high',
        location_description: 'Unknown area',
        message: transcript,
        simulated: true
      });
    }

    const systemPrompt = `You are Sankalp SOS Parser. A disaster victim has spoken a voice message asking for help. The message may be in ANY Indian language including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu, or English. The detected language code is: ${language || 'unknown'}.

Your job: understand what they said regardless of language, and extract structured relief data.

Return ONLY valid JSON (no markdown, no backticks, no explanation) with exactly these fields:
{
  "needs": [],
  "people": 0,
  "urgency": "",
  "location_description": "",
  "message": ""
}

Rules:
- "needs" must be an array containing ONLY values from this list: "food", "medical", "shelter", "rescue", "water", "transport", "animal_rescue", "other"
- Map common words in any language: "khana/bhoj/khabar/sadam/anna" = "food", "dawai/marundhu/oshadh" = "medical", "ghar/aasra/vedu" = "shelter", "bachao/uddhaar/raksha" = "rescue", "paani/jal/thanni/neeru" = "water"
- "people" must be a number. If they say "parivar/kudumbam/family", assume 5. If they say "gaon/gramam/village", assume 100. If unclear, use 1.
- "urgency" must be exactly one of: "low", "medium", "high". If they mention danger, drowning, trapped, fire, bleeding, or any life-threatening words in any language (doob rahe hain, aag, khoon, phasein hain, mahapralayam), use "high". Default to "high" for SOS calls.
- "location_description" should capture any place names, landmarks, addresses, or area descriptions. Transliterate to English if in another script.
- "message" should be a cleaned-up ENGLISH summary of what they said (1-2 sentences max), regardless of input language.

Examples:
- "Hum 12 log chhat pe fase hain paani badh raha hai khana chahiye" -> {"needs":["food","rescue"],"people":12,"urgency":"high","location_description":"Not specified","message":"12 people stranded on rooftop, water rising, need food"}
- "Amader bari te jol dhukechhe, 20 jon aachhe, doctor dorkar" -> {"needs":["medical","rescue"],"people":20,"urgency":"high","location_description":"Not specified","message":"Home flooded, 20 people present, need a doctor"}
- "Engal gramathil vellam pugunthatu, unavum thanni thevai, 50 per irukkom" -> {"needs":["food","water"],"people":50,"urgency":"high","location_description":"Not specified","message":"Village flooded, 50 people need food and water"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + '\n\nVictim voice message transcript:\n"' + transcript + '"'
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean the response - remove markdown code blocks if present
    let cleanedText = rawText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleanedText);

    // Validate and sanitize the parsed output
    const validNeeds = ['food', 'medical', 'shelter', 'rescue', 'water', 'transport', 'animal_rescue', 'other'];
    const sanitized = {
      needs: Array.isArray(parsed.needs)
        ? parsed.needs.filter(n => validNeeds.includes(n))
        : ['rescue'],
      people: typeof parsed.people === 'number' && parsed.people > 0
        ? parsed.people
        : 1,
      urgency: ['low', 'medium', 'high'].includes(parsed.urgency)
        ? parsed.urgency
        : 'high',
      location_description: typeof parsed.location_description === 'string'
        ? parsed.location_description
        : 'Not specified',
      message: typeof parsed.message === 'string'
        ? parsed.message
        : transcript,
      simulated: false
    };

    if (sanitized.needs.length === 0) {
      sanitized.needs = ['rescue'];
    }

    return NextResponse.json(sanitized);

  } catch (error) {
    console.error('SOS Parse Error:', error);

    return NextResponse.json({
      needs: ['rescue'],
      people: 1,
      urgency: 'high',
      location_description: 'Not specified',
      message: 'Voice message could not be fully parsed. Emergency help requested.',
      simulated: true,
      error: error.message
    });
  }
}
