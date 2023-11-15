<template>
	<div class="min-h-screen bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
		<router-view />
	</div>
</template>

<script setup lang="ts">
import { userStore as uStore } from "./stores/userStore"
import { useDark } from "@vueuse/core"

const userStore = uStore()
useDark()

const loggedInJSON = localStorage.getItem("loggedIn")
const userJSON = localStorage.getItem("user")

if (loggedInJSON && userJSON) {
	let loggedIn = JSON.parse(loggedInJSON)
	let user = JSON.parse(userJSON)

	if (!loggedIn || Date.now() > user.stsTokenManager?.expirationTime) {
		loggedIn = false
		user = null
	}

	userStore.setLoggedIn(loggedIn)
	userStore.setUser(user)
}
</script>
