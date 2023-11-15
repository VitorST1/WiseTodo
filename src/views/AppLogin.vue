<template>
	<div class="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
		<AppAlert :msg="errorMessage" type="error" v-if="error" />
		<div class="text-center">
			<AppLogo class="text-2xl text-slate-800 dark:text-slate-300 md:text-4xl" />
			<div class="text-lg leading-9 tracking-tight text-slate-500 dark:text-slate-100 md:text-2xl">
				Entre com sua rede social
			</div>
		</div>
		<form class="flex w-full max-w-sm flex-col gap-5 rounded-md border border-slate-400/50 p-5">
			<button
				class="flex w-full items-center gap-3 rounded-md bg-indigo-700 px-4 py-3 text-slate-100 shadow-sm hover:bg-indigo-900 focus:outline focus:outline-indigo-300 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-300 dark:focus:outline-slate-900"
				@click.prevent="loginWithGoogle"
			>
				<img src="assets/google.svg" class="h-8 w-8" alt="Google logo" />
				<span class="text font-semibold">Logar com Google</span>
			</button>
			<button
				class="flex w-full items-center gap-3 rounded-md bg-indigo-700 px-4 py-3 text-slate-100 shadow-sm hover:bg-indigo-900 focus:outline focus:outline-indigo-300 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-300 dark:focus:outline-slate-900"
				@click.prevent="loginWithGithub"
			>
				<img src="assets/github.svg" class="h-8 w-8 invert dark:invert-0" alt="Github logo" />
				<span class="text font-semibold">Logar com Github</span>
			</button>
			<button
				class="flex w-full items-center gap-3 rounded-md bg-indigo-700 px-4 py-3 text-slate-100 shadow-sm hover:bg-indigo-900 focus:outline focus:outline-indigo-300 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-300 dark:focus:outline-slate-900"
				@click.prevent="loginWithMicrosoft"
			>
				<img src="assets/microsoft.svg" class="h-8 w-8" alt="Microsoft logo" />
				<span class="text font-semibold">Logar com Microsoft</span>
			</button>
			<button
				class="flex w-full items-center gap-3 rounded-md border bg-black/75 px-4 py-3 text-slate-100 hover:bg-slate-800 focus:outline focus:outline-slate-600 dark:border-slate-100"
				@click.prevent="loginAnonymously"
			>
				<Icon class="h-8 w-8" icon="ooui:user-anonymous" />
				<span class="text font-semibold">Login Anônimo</span>
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import AppLogo from "../components/AppLogo.vue"
import { userStore as uStore } from "../stores/userStore"
import router from "../router"
import { Icon } from "@iconify/vue"
import { ref } from "vue"
import AppAlert from "../components/AppAlert.vue"

const userStore = uStore()
const error = ref(false)
let errorMessage = ""

const login = async (provider: string) => {
	let resp: any
	switch (provider) {
		case "google": {
			resp = await userStore.loginWithGoogle()
			break
		}
		case "github": {
			resp = await userStore.loginWithGithub()
			break
		}
		case "microsoft": {
			resp = await userStore.loginWithMicrosoft()
			break
		}
		case "anonymous": {
			resp = await userStore.loginAnonymously()
			break
		}
	}

	if (resp) {
		if (resp.error) {
			error.value = true
			errorMessage = resp.message
		} else {
			router.push("/")
			error.value = false
			errorMessage = ""
		}
	} else {
		error.value = true
		errorMessage = "Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde."
	}
}

const loginWithGoogle = async (event: Event) => {
	event.preventDefault()
	await login("google")
}

const loginWithGithub = async (event: Event) => {
	event.preventDefault()
	await login("github")
}

const loginWithMicrosoft = async (event: Event) => {
	event.preventDefault()
	await login("microsoft")
}

const loginAnonymously = async (event: Event) => {
	event.preventDefault()
	await login("anonymous")
}
</script>
