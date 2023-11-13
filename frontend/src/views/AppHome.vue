<template>
	<AppHeader />
	<AppAlert :msg="errorMessage" type="error" v-if="error" />
	<div class="flex flex-col gap-4 p-5">
		<div class="flex gap-4">
			<button
				class="flex items-center gap-2 rounded-md bg-indigo-600 p-2 text-slate-100 hover:bg-indigo-700 focus:outline focus:outline-indigo-300"
				@click="setModalAddTaskIsOpen(true)"
			>
				<Icon class="text-lg" icon="fluent:add-circle-24-filled" />
				<span>Nova Tarefa</span>
			</button>
		</div>
		<UserTasksList />
		<Dialog :open="ModalAddTaskIsOpen" @close="setModalAddTaskIsOpen" class="relative z-50">
			<!-- The backdrop, rendered as a fixed sibling to the panel container -->
			<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

			<!-- Full-screen container to center the panel -->
			<div class="fixed inset-0 flex w-screen items-center justify-center p-4">
				<!-- The actual dialog panel -->
				<DialogPanel class="w-full max-w-sm rounded-lg bg-slate-100 dark:bg-slate-600">
					<DialogTitle
						class="flex items-center justify-between border-b p-4 text-slate-600 dark:border-b-slate-400 dark:text-slate-200"
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
						<form class="flex flex-col gap-3" @submit.prevent="addTask">
							<button
								class="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 p-2 text-slate-100 shadow hover:bg-blue-700 disabled:bg-blue-300"
								:disabled="loadingSuggestion"
								@click.prevent="getSuggestion"
							>
								<span class="loading loading-spinner loading-md" v-if="loadingSuggestion"></span>
								<div>Obter Sugestão</div>
							</button>
							<div>
								<label for="taskName" class="text-slate-500 dark:text-slate-200">Tarefa:</label>
								<input
									id="taskName"
									class="w-full rounded-md border bg-slate-300 p-[9px] text-slate-700 dark:border-0 dark:bg-slate-500 dark:text-slate-200"
									type="text"
									v-model="newTask.name"
									placeholder="Tarefa"
									required
									autofocus
								/>
							</div>
							<div>
								<label for="taskDate" class="text-slate-500 dark:text-slate-200"
									>Data limite:</label
								>
								<input
									id="taskDate"
									class="w-full rounded-md border bg-slate-300 p-[8px] dark:border-0 dark:bg-slate-500"
									:class="{ 'text-slate-700 dark:text-slate-200': newTask.date.length }"
									type="date"
									:min="today"
									v-model="newTask.date"
									required
								/>
							</div>
							<button
								type="submit"
								class="mt-1 w-full rounded-md bg-indigo-600 p-2 text-slate-100 shadow hover:bg-indigo-700"
							>
								Cadastrar
							</button>
						</form>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import AppHeader from "../components/AppHeader.vue"
import { Icon } from "@iconify/vue/dist/iconify.js"
import UserTasksList from "../components/UserTasksList.vue"
import { provide, ref } from "vue"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue"
import { taskStore as tStore } from "../stores/taskStore"
import AppAlert from "../components/AppAlert.vue"

const taskStore = tStore()

const ModalAddTaskIsOpen = ref(false)

const error = ref(false)
let errorMessage = ""

const newTask = ref({
	name: "",
	date: "",
	completed: false,
	tip: "",
	userId: "",
})

let loadingSuggestion = ref(false)

const today = new Date().toISOString().split("T")[0]

const addedTask = ref<any | null>(null)
provide("addedTask", addedTask)

const tip = ref<any | null>(null)
provide("tip", tip)

const difficulty = ref<any | null>(null)
provide("difficulty", difficulty)

const setModalAddTaskIsOpen = (value: boolean) => {
	ModalAddTaskIsOpen.value = value
	if (!value && loadingSuggestion) loadingSuggestion.value = false
}

const addTask = async () => {
	const task = {
		...newTask.value,
		completed: false,
		tip: "",
		userId: "",
		difficulty: 0,
		loadingDifficulty: true,
	}
	const success = await taskStore.add(task)
	if (success) {
		addedTask.value = { ...success.task }
		newTask.value = {
			name: "",
			date: "",
			completed: false,
			tip: "",
			userId: "",
		}
		success.tipPromise.then((newTip) => {
			tip.value = { taskId: addedTask.value.id, newTip }
		})
		success.difficultyPromise.then((newDifficulty) => {
			difficulty.value = { taskId: addedTask.value.id, newDifficulty }
		})
	} else {
		error.value = true
		errorMessage = "Ocorreu um erro!"
	}

	setModalAddTaskIsOpen(false)
}

const getSuggestion = async () => {
	try {
		loadingSuggestion.value = true
		const suggestion = await taskStore.generateSuggestion()
		newTask.value.name = suggestion
		loadingSuggestion.value = false
	} catch (error) {
		console.error(error)
	}
}
</script>
