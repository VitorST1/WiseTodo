<template>
	<div class="dark">
		<router-view />
	</div>
</template>

<script setup lang="ts">
import { userStore as uStore } from "./stores/userStore"

const userStore = uStore()

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
