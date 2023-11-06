<template>
	<AppHeader />
	<!-- <HelloWorld msg="Vite + Vue" /> -->
	<div class="flex flex-col p-5">
		<div class="flex gap-4">
			<button
				class="flex items-center gap-2 rounded-md bg-indigo-600 p-2 text-slate-100 hover:bg-indigo-700 focus:outline focus:outline-indigo-300"
				@click="setModalAddTaskIsOpen(true)"
			>
				<Icon class="text-lg" icon="fluent:add-circle-24-filled" />
				<span>Nova Tarefa</span>
			</button>
			<button
				class="flex items-center gap-2 rounded-md p-2 hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300"
				@click="setModalFilterIsOpen(true)"
			>
				<Icon class="text-lg" icon="bi:filter" />
				<span>Filtrar</span>
			</button>
		</div>
		<Dialog :open="ModalAddTaskIsOpen" @close="setModalAddTaskIsOpen" class="relative z-50">
			<!-- The backdrop, rendered as a fixed sibling to the panel container -->
			<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

			<!-- Full-screen container to center the panel -->
			<div class="fixed inset-0 flex w-screen items-center justify-center p-4">
				<!-- The actual dialog panel -->
				<DialogPanel class="w-full max-w-sm rounded-lg bg-slate-100 dark:bg-slate-600">
					<DialogTitle
						class="flex items-center justify-between border-b p-4 dark:border-b-slate-400 dark:text-slate-200"
					>
						<div class="font-semibold">Nova Tarefa</div>
						<Icon
							class="text-xl text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-400"
							icon="ph:x-bold"
							@click="setModalAddTaskIsOpen(false)"
							role="button"
						></Icon>
					</DialogTitle>
					<div class="p-4">
						<form class="flex flex-col gap-3">
							<div>
								<label for="taskName" class="dark:text-slate-200">Tarefa:</label>
								<input id="taskName" class="w-full rounded-md border p-2" type="text" />
							</div>
							<div>
								<label for="taskDate" class="dark:text-slate-200">Data limite:</label>
								<input id="taskDate" class="w-full rounded-md border p-2" type="date" />
							</div>
							<button
								class="mt-1 w-full rounded-md bg-indigo-600 p-2 text-slate-100 shadow hover:bg-indigo-700"
							>
								Cadastrar
							</button>
						</form>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
		<UserTasksList />
	</div>
</template>

<script setup lang="ts">
// import HelloWorld from "../components/HelloWorld.vue"
import AppHeader from "../components/AppHeader.vue"
import { Icon } from "@iconify/vue/dist/iconify.js"
import UserTasksList from "../components/UserTasksList.vue"
import { ref } from "vue"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue"

const ModalAddTaskIsOpen = ref(false)
const ModalFilterIsOpen = ref(false)

function setModalAddTaskIsOpen(value: boolean) {
	ModalAddTaskIsOpen.value = value
}

function setModalFilterIsOpen(value: boolean) {
	ModalFilterIsOpen.value = value
}
</script>
