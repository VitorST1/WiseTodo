<template>
	<div class="flex rounded-md bg-slate-300 dark:bg-slate-700">
		<div class="w-2 rounded-s-md transition duration-700" :class="difficultyColor"></div>
		<div class="flex w-full flex-col gap-3 p-3">
			<div class="flex w-full items-center justify-between">
				<div class="line-clamp-2 text-lg font-bold" :class="{ 'line-through': task.completed }">
					{{ task.name }}
				</div>
				<div class="flex items-center gap-2">
					<input
						type="checkbox"
						class="dark:checkbox-neutral checkbox ring-1 ring-inset ring-slate-400 checked:checkbox-success checked:dark:checkbox-success checked:ring-0"
						:checked="task.completed"
						@input="completionChanged"
					/>
				</div>
			</div>
			<div class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
				<div class="flex">
					<span class="loading loading-spinner loading-md" v-if="loadingDifficulty"></span>
					<span class="sm:tooltip sm:tooltip-bottom" data-tip="Dificuldade" v-else>
						<div class="flex items-center gap-3" :class="{ 'line-through': task.completed }">
							<div class="h-2 w-2 rounded-full" :class="difficultyColor"></div>
							<div class="line-clamp-2 w-max text-sm">
								{{ difficultyText }}
							</div>
						</div>
					</span>
				</div>
				<div class="flex w-full flex-col items-stretch justify-end gap-3 sm:flex-row">
					<button
						class="inline-flex items-center gap-1 rounded bg-red-500 p-2 text-slate-200 sm:tooltip sm:tooltip-bottom hover:bg-red-700"
						data-tip="Remover"
						@click="setModalRemoveTaskIsOpen(true)"
					>
						<Icon class="text-xl" icon="bi:trash-fill" role="button" />
						<div class="sm:hidden">Remover</div>
					</button>
					<button
						class="inline-flex items-center gap-1 rounded bg-blue-500 p-2 text-slate-200 sm:tooltip sm:tooltip-bottom hover:bg-blue-700"
						data-tip="Dica"
						@click="setModalTipIsOpen(true)"
					>
						<Icon class="text-xl" icon="ci:bulb" role="button" />
						<div class="sm:hidden">Dica</div>
					</button>
					<div
						class="flex"
						:class="{
							'tooltip tooltip-bottom':
								(new Date(task.date).toDateString() === new Date(today).toDateString() ||
									new Date(task.date) < new Date()) &&
								!task.completed,
						}"
						:data-tip="dateTip"
					>
						<input
							type="date"
							title=""
							class="w-full rounded bg-slate-700 p-2 text-slate-300 invalid:ring invalid:ring-red-500 dark:bg-slate-300 dark:text-slate-700 sm:w-auto sm:py-1"
							:class="{
								'ring ring-yellow-400':
									new Date(task.date).toDateString() === new Date(today).toDateString() &&
									!task.completed,
							}"
							@input="dateChanged"
							:min="today"
							:disabled="task.completed"
							v-model="inputDate"
						/>
					</div>
				</div>
			</div>
		</div>
		<Dialog :open="ModalTipIsOpen" @close="setModalTipIsOpen" class="relative z-50">
			<!-- The backdrop, rendered as a fixed sibling to the panel container -->
			<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

			<!-- Full-screen container to center the panel -->
			<div class="fixed inset-0 flex w-screen items-center justify-center p-4">
				<!-- The actual dialog panel -->
				<DialogPanel class="w-full max-w-sm rounded-lg bg-slate-100 dark:bg-slate-600">
					<DialogTitle
						class="flex items-center justify-between border-b p-4 text-slate-600 dark:border-b-slate-400 dark:text-slate-200"
					>
						<div class="font-semibold">Dica</div>
						<Icon
							class="text-xl text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-400"
							icon="ph:x-bold"
							@click="setModalTipIsOpen(false)"
							role="button"
						></Icon>
					</DialogTitle>
					<div
						class="flex max-h-[90dvh] flex-col gap-4 overflow-y-auto p-4 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-900 dark:scrollbar-track-slate-500"
					>
						<div
							class="whitespace-pre-line break-words text-slate-500 dark:text-inherit"
							v-if="taskTip"
						>
							{{ taskTip }}
						</div>
						<button
							class="mt-1 flex w-full items-center justify-center gap-3 rounded-md bg-indigo-600 p-2 text-slate-100 shadow hover:bg-indigo-700 disabled:bg-indigo-400"
							:disabled="loadingTip || task.completed"
							@click="generateTip"
						>
							<span class="loading loading-spinner loading-md" v-if="loadingTip"></span>
							<div>
								{{ taskTip ? "Gerar Novamente" : "Gerar Dica" }}
							</div>
						</button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
		<Dialog :open="ModalRemoveTaskIsOpen" @close="setModalRemoveTaskIsOpen" class="relative z-50">
			<!-- The backdrop, rendered as a fixed sibling to the panel container -->
			<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

			<!-- Full-screen container to center the panel -->
			<div class="fixed inset-0 flex w-screen items-center justify-center p-4">
				<!-- The actual dialog panel -->
				<DialogPanel class="w-full max-w-sm rounded-lg bg-slate-100 dark:bg-slate-600">
					<DialogTitle
						class="flex items-center justify-between border-b p-4 text-slate-600 dark:border-b-slate-400 dark:text-slate-200"
					>
						<div class="font-semibold">Remover Tarefa</div>
						<Icon
							class="text-xl text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-400"
							icon="ph:x-bold"
							@click="setModalRemoveTaskIsOpen(false)"
							role="button"
						></Icon>
					</DialogTitle>
					<div class="p-4">
						<form class="flex flex-col gap-3" @submit.prevent="remove">
							<div class="text-slate-500 dark:text-inherit">
								<div>Tem certeza de que deseja remover essa tarefa?</div>
								<div>Os dados serão apagados permanentemente!</div>
							</div>
							<div class="flex gap-3">
								<button
									type="button"
									class="mt-1 w-full rounded-md border border-slate-400 bg-transparent p-2 text-slate-600 shadow hover:brightness-50 dark:border-slate-400 dark:text-slate-100 dark:hover:brightness-200"
									@click="setModalRemoveTaskIsOpen(false)"
								>
									Cancelar
								</button>
								<button
									type="submit"
									class="mt-1 w-full rounded-md bg-red-500 p-2 text-slate-100 shadow hover:bg-red-700"
								>
									Remover
								</button>
							</div>
						</form>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js"
import { Task } from "../types/types"
import { ref, Ref, computed, watch } from "vue"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue"
import { taskStore as tStore } from "../stores/taskStore"

const taskStore = tStore()

const props = defineProps<{ task: Task }>()
const task = computed(() => props.task)
const emit = defineEmits(["update:date", "update:completed", "removeTask"])

let inputDate = task.value.date
let taskTip: Ref<string | undefined> = ref(task.value.tip)
let loadingTip: Ref<boolean | undefined> = ref(task.value.loadingTip)
let taskDifficulty: Ref<number | undefined> = ref(task.value.difficulty)
let loadingDifficulty: Ref<boolean | undefined> = ref(task.value.loadingDifficulty)

const today = new Date().toISOString().split("T")[0]

const ModalTipIsOpen = ref(false)
const ModalRemoveTaskIsOpen = ref(false)

const difficultyColor = computed(() => {
	if (task.value.completed || loadingDifficulty.value) return ""
	switch (taskDifficulty.value) {
		case 1:
			return "bg-green-500"
		case 2:
			return "bg-yellow-500"
		case 3:
			return "bg-red-600"
		case 4:
			return "bg-black"
		default:
			return ""
	}
})

const difficultyText = computed(() => {
	if (task.value.completed || loadingDifficulty.value) return ""
	switch (taskDifficulty.value) {
		case 1:
			return "Passeio no parque"
		case 2:
			return "Pequeno desafio"
		case 3:
			return "Escalada ao Everest"
		case 4:
			return "Além da realidade"
		default:
			return ""
	}
})

const dateTip = computed(() => {
	if (task.value.completed) return ""

	const date = new Date(inputDate).getTime()
	const todayDate = new Date(today).getTime()

	if (date < todayDate) {
		return "Tarefa atrasada"
	}

	return "Tarefa para hoje"
})

watch(
	() => props.task,
	(newValue) => {
		taskTip.value = newValue.tip
		loadingTip.value = newValue.loadingTip
		taskDifficulty.value = newValue.difficulty
		loadingDifficulty.value = newValue.loadingDifficulty
	},
)

const setModalTipIsOpen = (value: boolean) => {
	ModalTipIsOpen.value = value
}

const setModalRemoveTaskIsOpen = (value: boolean) => {
	ModalRemoveTaskIsOpen.value = value
}

const dateChanged = (e: Event) => {
	loadingDifficulty.value = true
	const inputElement = e.target as HTMLInputElement
	const date = new Date(inputDate)
	if (isNaN(date.getTime())) {
		inputElement.setCustomValidity("Invalid date")
	} else {
		emit("update:date", { task: task.value, newDate: inputDate })
		inputElement.setCustomValidity("")
	}
}

const completionChanged = (e: Event) => {
	emit("update:completed", {
		task: task.value,
		newCompleted: (e.target as HTMLInputElement).checked,
	})
}

const generateTip = async () => {
	try {
		loadingTip.value = true
		taskTip.value = await taskStore.generateTip(task.value)
		loadingTip.value = false
	} catch (error) {
		console.error(error)
	}
}

const remove = async () => {
	emit("removeTask", task.value)
	setModalRemoveTaskIsOpen(false)
}
</script>
