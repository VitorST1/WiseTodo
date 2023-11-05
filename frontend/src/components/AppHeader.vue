<template>
	<div class="flex items-center justify-between bg-indigo-600 p-3 text-slate-100">
		<div></div>
		<div class="flex items-center gap-3">
			<Icon
				class="text-lg hover:text-slate-300"
				:icon="isDark ? 'ri:moon-fill' : 'lucide:sun'"
				role="button"
				@click.prevent="toggleDark()"
			/>
			<button class="hover:text-slate-300" @click.prevent="logout">Deslogar</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { userStore as uStore } from "../stores/userStore"
import router from "../router"
import { Icon } from "@iconify/vue"
import { useDark, useToggle } from "@vueuse/core"

const userStore = uStore()

let isDarkValue: boolean

const isDark = useDark({
	onChanged(dark) {
		if (isDarkValue !== undefined) {
			console.log(dark)
			// save to firebase
		}
		isDarkValue = dark
	},
})

const toggleDark = useToggle(isDark)

const logout = () => {
	userStore.logOut()
	router.push({ name: "Login" })
}
</script>
