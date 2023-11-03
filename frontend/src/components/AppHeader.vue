<template>
	<button @click.prevent="logout">Deslogar</button>
</template>

<script setup lang="ts">
import { userStore as uStore } from "../stores/userStore"
import router from "../router"

const userStore = uStore()

const logout = () => {
	userStore.logOut()
	router.push({ name: "Login" })
}
</script>
