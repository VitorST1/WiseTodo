import { defineStore } from "pinia"
import { Task } from "../types/types"
import { db, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, serverTimestamp, orderBy } from "../config/firebaseConfig"
import { userStore as uStore } from "./userStore"
import openai from "../services/openai"
import date from "../utils/date"

const tasksCollection = collection(db, "tasks")

let retriesCount = 0
const RETRIES_LIMIT = 3

type FirestoreTask = {
    [key: string]: any
}

export const taskStore = defineStore("task", {
    state: (): Task => ({
        id: "",
        name: "",
        date: "",
        completed: false,
        tip: "",
        userId: "",
        difficulty: 0
    }),
    actions: {
        async fetchAll() {
            const userStore = uStore()
            const userId = userStore.data!.uid
            const tasksQuery = query(tasksCollection, where("userId", "==", userId), orderBy("date", "asc"))
            const tasksSnapshot = await getDocs(tasksQuery)
            const tasks:Task[] = []
            tasksSnapshot.forEach((doc) => {
                tasks.push(
                    {
                        id: doc.id,
                        name: doc.data().name,
                        date: doc.data().date,
                        completed: doc.data().completed,
                        tip: doc.data().tip,
                        userId: doc.data().userId,
                        difficulty: doc.data().difficulty
                    }
                )
            })
            return tasks
        },
        async add(task: Task) {
            const userStore = uStore()
            task.userId = userStore.data!.uid
            try {
                const resp = await addDoc(tasksCollection, { ...task, createdAt: serverTimestamp() })
                task.id = resp.id
                const tipPromise = this.generateTip(task)
                const difficultyPromise = this.generateDifficulty(task)
                return { task, tipPromise, difficultyPromise }
            } catch(error) {
                console.log({error})
                return false
            }
        },
        async update(task: Task) {
            const firestoreTask: FirestoreTask = {
                name: task.name,
                date: task.date,
                completed: task.completed,
                tip: task.tip,
                userId: task.userId,
                difficulty: task.difficulty
            }

            function removeUndefinedProperties(obj:any) {
                Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});
                return obj;
            }
            
            const taskRef = doc(db, "tasks", task.id!)
            await updateDoc(taskRef, removeUndefinedProperties(firestoreTask))
        },
        async remove(task: Task) {
            const taskRef = doc(db, "tasks", task.id!)
            await deleteDoc(taskRef);
        },
        async generateTip(task: Task) {
            const systemPrompt = `
                Você atuará como um orientador para um aplicativo de gerenciamento de tarefas.
                O usuário fornecerá uma tarefa.
                Sua função é exclusivamente gerar dicas úteis diretamente para ajudar o usuário a concluir a tarefa.
                A dica deve ser concisa, ter no máximo uma linha e estar correta ortográficamente.
                Não deixe de lado informações importantes.
                Sua resposta deve estar em português brasileiro.
                Certifique-se de que sua escrita esteja de acordo com a ortografia brasileira.
            `
            let resp = await openai.completion(systemPrompt, `${task.name}. A dica é:`)
            if(resp) {
                resp = resp.split("---")[0].trim().replace(/^"(.+(?="$))"(\.)?$/, "$1")
                task.tip = resp
                task.difficulty = undefined
                this.update(task)
            }
            return resp || undefined
        },
        async generateDifficulty(task: Task, retries: number = 0): Promise<number> {
            let resp: string | null
            if(new Date(task.date).setUTCHours(27, 0, 0, 0) < new Date().getTime()) {
                resp = "4"
            } else {
                const systemPrompt = `Você atuará como um orientador para um aplicativo de gerenciamento de tarefas. O usuario fornecerá a descrição de uma tarefa e um prazo no formato yyyy-mm-dd. Leve em consideração que a data atual é ${date.getCurrentDate("yyyy-mm-dd")}. Com base nessas informações, você deve avaliar a dificuldade de realizar a tarefa no prazo definido, classificando-a numericamente. Use '1' para tarefas fáceis, '2' para tarefas de dificuldade média, '3' para tarefas difíceis. Não há problema se o limite for igual à data atual. Sua resposta deve conter apenas 1 caractere.`
                resp = await openai.completion(systemPrompt, `${task.name}${task.date}. A resposta é:`)
                if(!resp) {
                    if(retries >= RETRIES_LIMIT) {
                        retriesCount = 0
                        return 2
                    }
                    retriesCount++
                    return this.generateDifficulty(task, retriesCount)
                }
                console.log({resp})
            }
            task.difficulty = parseInt(resp, 10)
            if(Number.isNaN(task.difficulty) || ![1, 2, 3, 4].includes(task.difficulty)) {
                if(retries >= RETRIES_LIMIT) {
                    retriesCount = 0
                    return 2
                }
                retriesCount++
                return this.generateDifficulty(task, retriesCount)
            }
            task.tip = undefined
            this.update(task)
            return task.difficulty
        },
        async generateSuggestion(): Promise<string> {
            const tasks = await this.fetchAll()

            let systemPrompt = ""
            let userPrompt = ""

            if(tasks.length) {
                const tasksNames = tasks.map(task => task.name)
                systemPrompt = "Você atuará como um orientador para um aplicativo de gerenciamento de tarefas. Baseado em uma lista de tarefas, você deve sugerir uma nova tarefa única para o usuário. Sua resposta deve estar em português brasileiro e conter apenas a sugestão. A lista recebida será um array em que cada posição é a descrição de uma tarefa."
                userPrompt = `${JSON.stringify(tasksNames)}. A sugestão é:`
            } else {
                systemPrompt = "Você atuará como um orientador para um aplicativo de gerenciamento de tarefas. Sugira uma tarefa única simples para o usuário fazer. Assegure-se de que sua sugestão seja clara, prática e fácil de implementar. Sua resposta deve estar em português brasileiro, estar no infinitivo e deve conter exclusivamente a sugestão da tarefa, sem qualquer outra informação adicional. Certifique-se de que sua resposta esteja no infinitivo."
                userPrompt = "Sugira-me uma tarefa. A tarefa é:"
            }

            const suggestion = await openai.completion(systemPrompt, userPrompt)
            if(!suggestion) {
                return this.generateSuggestion()
            }
            console.log({suggestion})
            
            return suggestion.split("\n")[0].trim().replace(/^"(.+(?="$))"(\.)?$/, "$1")
        }
    }
})