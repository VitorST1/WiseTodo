import { defineStore } from "pinia"
import { Task } from "../types/types"
import { db, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "../config/firebaseConfig"
import { userStore as uStore } from "./userStore"

const tasksCollection = collection(db, "tasks")

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
        userId: ""
    }),
    actions: {
        async fetchAll() {
            const userStore = uStore()
            const userId = userStore.data!.uid
            const tasksQuery = query(tasksCollection, where("userId", "==", userId))
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
                        userId: doc.data().userId
                    }
                )
            })
            // const tasks = tasksSnapshot.docs.map(doc => doc.data() as Task)
            // console.log(tasks)
            return tasks
        },
        async add(task: Task) {
            const userStore = uStore()
            task.userId = userStore.data!.uid
            // console.log({task})
            try {
                const resp = await addDoc(tasksCollection, task)
                console.log({resp})
                return resp
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
                userId: task.userId
            }
            const taskRef = doc(db, "tasks", task.id!)
            await updateDoc(taskRef, firestoreTask)
        },
        async remove(task: Task) {
            const taskRef = doc(db, "tasks", task.id!)
            await deleteDoc(taskRef);
        }
    }
})

// taskStore.$onAction(({ after, onError }: any) => {
//     after((resolvedValue: any) => {
//         console.log("Action completed!", resolvedValue)
//     })
//     onError((error: any) => {
//         console.log("Action failed!", error)
//     })
// })