<template>
	<div class="flex rounded-md bg-slate-300 dark:bg-slate-700">
		<div
			class="w-2 rounded-s-md transition duration-700"
			:class="{ 'bg-red-600': !task.completed }"
		></div>
		<div class="flex w-full flex-col gap-3 p-3">
			<div class="flex w-full items-center justify-between">
				<div :class="{ 'line-through': task.completed }">
					{{ task.name }}
				</div>
				<div class="flex items-center gap-2">
					<input
						type="checkbox"
						class="checkbox dark:checkbox-neutral checked:checkbox-success checked:dark:checkbox-success"
						:checked="task.completed"
						@input="completionChanged"
					/>
				</div>
			</div>
			<div class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
				<input
					type="date"
					class="ring-in w-full rounded bg-slate-700 px-1 text-slate-300 invalid:ring invalid:ring-red-500 dark:bg-slate-300 dark:text-slate-700 sm:w-auto"
					@input="dateChanged"
					v-model="inputDate"
				/>
				<div class="sm:order-first">
					<div class="flex items-center gap-3" :class="{ 'line-through': task.completed }">
						<div class="h-2 w-2 rounded-full bg-red-600"></div>
						<div class="text-sm">Pouco tempo para realizar tarefa</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// import { Icon } from "@iconify/vue/dist/iconify.js"
import { Task } from "../types/types"

const props = defineProps<{ task: Task }>()
const task = props.task
const emit = defineEmits(["update:date", "update:completed", "taskAdded"])

let inputDate = task.date

const dateChanged = (e: Event) => {
	const inputElement = e.target as HTMLInputElement
	const date = new Date(inputDate)
	if (isNaN(date.getTime())) {
		inputElement.setCustomValidity("Invalid date")
	} else {
		emit("update:date", { task: task, newDate: inputDate })
		inputElement.setCustomValidity("")
	}
}

const completionChanged = (e: Event) => {
	emit("update:completed", {
		task: task,
		newCompleted: (e.target as HTMLInputElement).checked,
	})
}
</script>
