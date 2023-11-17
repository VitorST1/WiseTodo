import OpenAI from "openai"
const openai = new OpenAI({ apiKey: "123", baseURL: import.meta.env.VITE_OPENAI_BASEURL, dangerouslyAllowBrowser: true })

async function completion(systemPrompt: string, userPrompt: string) {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: ""
    })
    return completion.choices[0].message.content
}

export default { completion }