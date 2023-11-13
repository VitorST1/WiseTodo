<template>
	<div class="flex flex-col gap-4">
		{{ remainingTasks }}
		{{ remainingTasks == 1 ? "Tarefa restante" : "Tarefas restantes" }}
		<div v-for="task in tasks" :key="task.id">
			<UserTask
				:task="task"
				@update:date="updateTaskDate"
				@update:completed="updateTaskCompleted"
				@removeTask="removeTask"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { taskStore as tStore } from "../stores/taskStore"
import UserTask from "./UserTask.vue"
import { ref, onMounted, inject, watch, Ref, computed } from "vue"
import { Task } from "../types/types"

const taskStore = tStore()

const tasks = ref<Task[]>([])

const addedTask = inject<Ref<Task | null>>("addedTask", ref(null))
const tip = inject<Ref<any | null>>("tip", ref(null))
const difficulty = inject<Ref<any | null>>("difficulty", ref(null))

const remainingTasks = computed(() => {
	return tasks.value.filter((el) => !el.completed).length
})

onMounted(() => {
	getTasks()
})

watch(addedTask, (task) => {
	if (task) {
		// getTasks()
		tasks.value.push({
			id: task.id,
			name: task.name,
			date: task.date,
			completed: task.completed,
			tip: task.tip,
			userId: task.userId,
			loadingTip: !task.tip,
			loadingDifficulty: true,
			difficulty: task.difficulty,
		})
		tasks.value = tasks.value.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		)
	}
})

watch(tip, (tip) => {
	if (tip) {
		const taskIndex = tasks.value.findIndex((t) => t.id === tip.taskId)
		if (taskIndex !== -1) {
			const updatedTask = {
				...tasks.value[taskIndex],
				tip: tip.newTip,
				loadingTip: false,
			}
			tasks.value[taskIndex] = updatedTask
		}
	}
})

watch(difficulty, (difficulty) => {
	if (difficulty) {
		const taskIndex = tasks.value.findIndex((t) => t.id === difficulty.taskId)
		if (taskIndex !== -1) {
			const updatedTask = {
				...tasks.value[taskIndex],
				difficulty: difficulty.newDifficulty,
				loadingDifficulty: false,
			}
			tasks.value[taskIndex] = updatedTask
		}
	}
})

const getTasks = async () => {
	tasks.value = await taskStore.fetchAll()
}

const updateTaskDate = async ({ task, newDate }: { task: Task; newDate: string }) => {
	task.date = newDate
	try {
		const newDifficulty = await taskStore.generateDifficulty(task)
		const taskIndex = tasks.value.findIndex((t) => t.id === task.id)
		if (taskIndex !== -1) {
			const updatedTask = {
				...tasks.value[taskIndex],
				date: newDate,
				difficulty: newDifficulty,
				loadingDifficulty: false,
			}
			tasks.value[taskIndex] = updatedTask
		}
		// tasks.value = tasks.value.sort(
		// 	(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		// )
	} catch (error) {
		console.error(error)
	}
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

const removeTask = async (task: Task) => {
	try {
		await taskStore.remove(task)
		tasks.value = tasks.value.filter((t) => t.id !== task.id)
	} catch (error) {
		console.error(error)
	}
}
</script>
