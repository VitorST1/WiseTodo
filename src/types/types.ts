import { User as FirebaseUser } from "../config/firebaseConfig"

export interface User {
	loggedIn: boolean
	data: FirebaseUser | null
}

export interface Task {
	id?: string
	name: string
	date: string
	completed: boolean
	tip?: string
	userId: string
	loadingTip?: boolean
	loadingDifficulty?: boolean
	difficulty?: number
}
