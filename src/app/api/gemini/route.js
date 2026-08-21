import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, context } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        response: "[SIMULATED AI RESPONSE] Based on current data, I recommend prioritizing shelter and medical resources. The Assam Relief Foundation (Trust Score: 91%) has 500 food kits available and is 1.1km from the affected area. Health First India can provide medical support within 30 minutes. For shelter, coordinate with Shelter Now India—they have 80 beds and 25 tents ready for deployment. Critical action: Transport remains at only 17% coverage. Consider requesting additional vehicles from neighboring districts.",
        simulated: true
      });
    }

    const systemPrompt = 'You are Sankalp AI, a disaster relief coordination assistant for India. You help District Collectors make informed decisions during disasters by analyzing resource gaps, suggesting NGO assignments, and providing situation summaries. Be concise, data-driven, and action-oriented.\n\n';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt + "Context: " + (context || '') + "\n\nUser: " + prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response: text, simulated: false });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request.' },
      { status: 500 }
    );
  }
}
