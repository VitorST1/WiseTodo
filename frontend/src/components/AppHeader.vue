<template>
	<div class="flex items-center justify-between bg-indigo-600 px-5 py-4 text-slate-100">
		<div>
			<RouterLink to="/">
				<AppLogo class="text-slate-100" />
			</RouterLink>
		</div>
		<div class="flex items-center gap-3">
			<Icon
				class="text-xl hover:text-slate-300"
				:icon="isDark ? 'ri:moon-fill' : 'lucide:sun'"
				role="button"
				@click="toggleDark()"
			/>
			<Popover class="relative">
				<PopoverButton class="rounded">
					<img
						class="inline-block h-8 w-8 rounded-full bg-slate-200 ring-2 ring-inset ring-slate-200"
						:src="userStore.data?.photoURL || 'assets/user.svg'"
						alt="User avatar"
					/>
				</PopoverButton>
				<PopoverPanel
					class="absolute -start-2 z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 flex-col gap-3 rounded border border-slate-300 bg-slate-200 p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800"
				>
					<button
						class="w-full rounded text-slate-500 hover:text-slate-800 dark:text-slate-200 dark:hover:text-slate-400"
						@click="logout"
					>
						Deslogar
					</button>
				</PopoverPanel>
			</Popover>
		</div>
	</div>
</template>

<script setup lang="ts">
import { userStore as uStore } from "../stores/userStore"
import router from "../router"
import { Icon } from "@iconify/vue"
import { useDark, useToggle } from "@vueuse/core"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue"
import AppLogo from "./AppLogo.vue"

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
