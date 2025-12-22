import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // If no API key, return a helpful message
        if (!groq) {
            return NextResponse.json({
                content: "I apologize, but the AI assistant is currently unavailable. Please contact us directly at contact@sygma-consult.com or call +33 7 52 03 47 86."
            });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are 'Sygma AI', a professional, polite, and helpful virtual assistant for 'Sygma Consult', a prestigious consulting firm in Paris and Tunis.
          
          Our specialty: Strategic Consulting, Legal & Fiscal compliance, Company Formation (France/Tunisia), and Digital Transformation.
          Tone: Professional, Corporate ("Quiet Luxury"), Helpful, and Concise.
          Languages: You can reply in English, French, or Arabic depending on the user's language.

          Services to mention if asked:
          - Company Formation (SAS, SARL, SUARL)
          - Visas (Passeport Talent, Business)
          - Tax Optimization
          - M&A
          
          Do not make up fake prices. Ask them to 'Book a Consultation' for specific quotes.`
                },
                ...messages
            ],
            model: 'llama3-8b-8192',
        });

        return NextResponse.json({
            content: completion.choices[0]?.message?.content || "Sincere apologies, I could not process that."
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
