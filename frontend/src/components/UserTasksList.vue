<template>
	<div class="flex flex-col gap-4">
		<div v-for="task in tasks" :key="task.id">
			<UserTask
				:task="task"
				@update:date="updateTaskDate"
				@update:completed="updateTaskCompleted"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { taskStore as tStore } from "../stores/taskStore"
import UserTask from "./UserTask.vue"
import { ref, onMounted, inject, watch, Ref } from "vue"
import { Task } from "../types/types"

const taskStore = tStore()

const tasks = ref<Task[]>([])

const addedTask = inject<Ref<Task | null>>("addedTask", ref(null))

onMounted(() => {
	getTasks()
})

watch(addedTask, (task) => {
	if (task) {
		getTasks()
		// console.log("received", task)
		// tasks.value.push({
		// 	id: task.id,
		// 	name: task.name,
		// 	date: task.date,
		// 	completed: task.completed,
		// 	tip: task.tip,
		// 	userId: task.userId,
		// })
	}
})

const getTasks = async () => {
	tasks.value = await taskStore.fetchAll()
}

const updateTaskDate = async ({ task, newDate }: { task: Task; newDate: string }) => {
	task.date = newDate
	await taskStore.update(task)
}

const updateTaskCompleted = async ({
	task,
	newCompleted,
}: {
	task: Task
	newCompleted: boolean
}) => {
	task.completed = newCompleted
	await taskStore.update(task)
}
</script>
