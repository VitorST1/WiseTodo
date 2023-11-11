import OpenAI from "openai"
const openai = new OpenAI({ apiKey: "123", baseURL: "http://127.0.0.1:8000/v1" })

async function completion(systemPrompt: string, userPrompt: string) {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: ""
    })
    return completion
}

export default { completion }