import { defineStore } from "pinia"
import { User } from "../types/types"
import {
	auth,
	signInWithPopup,
	signInAnonymously,
	googleProvider,
	githubProvider,
	microsoftProvider,
	signOut,
	User as FirebaseUser,
	AuthProvider,
	fetchSignInMethodsForEmail,
	db,
	setDoc,
	updateDoc,
	getDoc,
	doc,
} from "../config/firebaseConfig"

export const userStore = defineStore("user", {
	state: (): User => ({
		loggedIn: false,
		data: null,
	}),
	getters: {
		user: (state) => state,
	},
	actions: {
		async login(provider: AuthProvider) {
			try {
				const res = await signInWithPopup(auth, provider)
				this.setLoggedIn(true)
				this.setUser(res.user)
				if (res.user.metadata.creationTime == res.user.metadata.lastSignInTime) {
					if (!res.user.isAnonymous) {
						const userRef = doc(db, "users", res.user.uid)
						await setDoc(
							userRef,
							{
								userId: res.user.uid,
								darkMode: false,
							},
							{ merge: true },
						)
					}
				}
				return res
			} catch (error: any) {
				console.log("error", { error })
				if (error.code === "auth/account-exists-with-different-credential") {
					const email = error.customData?.email
					if (email) {
						const methods = await fetchSignInMethodsForEmail(auth, email)
						console.log({ methods })
						if (methods[0] == "microsoft.com") {
							return {
								error: true,
								message:
									"Você já possui vínculo com uma conta Microsoft.\n Por favor, faça login com essa conta.",
							}
						} else if (methods[0] == "google.com") {
							return {
								error: true,
								message:
									"Você já possui vínculo com uma conta Google.\n Por favor, faça login com essa conta.",
							}
						} else if (methods[0] == "github.com") {
							return {
								error: true,
								message:
									"Você já possui vínculo com uma conta Github.\n Por favor, faça login com essa conta.",
							}
						}
					}
				}
				return null
			}
		},
		async loginWithGoogle() {
			try {
				return this.login(googleProvider)
			} catch (error) {
				console.log({ error })
				return null
			}
		},
		async loginWithGithub() {
			try {
				return this.login(githubProvider)
			} catch (error) {
				console.log({ error })
				return null
			}
		},
		async loginWithMicrosoft() {
			try {
				return this.login(microsoftProvider)
			} catch (error) {
				console.log({ error })
				return null
			}
		},
		async loginAnonymously() {
			try {
				const res = await signInAnonymously(auth)
				// console.log({res})
				this.setLoggedIn(true)
				this.setUser(res.user)
				return res
			} catch (error) {
				console.log({ error })
				return null
			}
		},
		async logOut() {
			await signOut(auth)
			this.setLoggedIn(false)
			this.setUser(null)
		},
		async fetchUser(user: FirebaseUser | null) {
			this.setLoggedIn(user !== null)
			if (user) {
				this.setUser(user)
			} else {
				this.setUser(null)
			}
		},
		async fetchDarkMode() {
			if (this.user.data?.isAnonymous) return undefined
			const userRef = doc(db, "users", this!.user!.data!.uid)
			const userData = await getDoc(userRef)
			return userData.data()?.darkMode ?? false
		},
		async updateDarkMode(darkMode: boolean) {
			if (!this.user.data?.isAnonymous) {
				const userRef = doc(db, "users", this!.user!.data!.uid)
				await updateDoc(userRef, { darkMode })
			}
		},
		setLoggedIn(loggedIn: boolean) {
			this.loggedIn = loggedIn
			localStorage.setItem("loggedIn", JSON.stringify(loggedIn))
		},
		setUser(data: FirebaseUser | null) {
			this.data = data
			localStorage.setItem("user", JSON.stringify(data))
		},
	},
})
