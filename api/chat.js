import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res){
    if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { message } = req.body || {};
    if(!message) return res.status(400).json({ error: 'No message provided' });

    const systemPrompt = `You are "IdealBot", a friendly but sarcastic chatbot for Ideal College.
- Answer in Bangla or English depending on the user's message.
- Use light-hearted roast humor.
- Keep answers short (1-3 sentences).
- If question asks for private info, refuse politely.`;

    try{
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages:[
                { role:'system', content: systemPrompt },
                { role:'user', content: message }
            ],
            temperature:0.8,
            max_tokens:300
        });

        const reply = completion.choices?.[0]?.message?.content || 'No response';
        return res.status(200).json({ reply });
    }catch(err){
        console.error('OpenAI error', err);
        return res.status(500).json({ error: 'OpenAI request failed' });
    }
}
