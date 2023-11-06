import { defineStore } from "pinia"
import { Task } from "../types/types"
import { db, collection, addDoc, updateDoc, deleteDoc, doc, query, getDocs } from "../config/firebaseConfig";

const tasksCollection = collection(db, "tasks")

type FirestoreTask = {
    [key: string]: any
}

export const taskStore = defineStore("task", {
    state: (): Task => ({
        id: "",
        name: "",
        date: "",
        completed: false  
    }),
    actions: {
        async fetchAll() {
            const tasksQuery = query(tasksCollection);
            const tasksSnapshot = await getDocs(tasksQuery);
            const tasks = tasksSnapshot.docs.map(doc => doc.data() as Task);
            console.log(tasks);
            return tasks;
        },
        async add(task: Task) {
            await addDoc(tasksCollection, task);
        },
        async update(task: Task) {
            const firestoreTask: FirestoreTask = {
                id: task.id,
                name: task.name,
                date: task.date,
                completed: task.completed
            }
            const taskRef = doc(db, "tasks", task.id);
            await updateDoc(taskRef, firestoreTask);
        },
        async remove(task: Task) {
            const taskRef = doc(db, "tasks", task.id);
            await deleteDoc(taskRef);
        }
    }
})