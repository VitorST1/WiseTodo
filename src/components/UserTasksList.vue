<template>
	<div class="flex flex-col items-center gap-4">
		<span class="loading loading-spinner loading-lg py-5" v-if="loadingTasks"></span>
		<div class="flex w-full flex-col gap-4" v-else-if="tasks.length">
			<div v-for="task in tasks" :key="task.id">
				<UserTask
					:task="task"
					@update:date="updateTaskDate"
					@update:completed="updateTaskCompleted"
					@removeTask="removeTask"
				/>
			</div>
		</div>
		<div class="text-slate-500" v-else>Adicione uma tarefa para continuar</div>
	</div>
</template>

<script setup lang="ts">
import { taskStore as tStore } from "../stores/taskStore"
import UserTask from "./UserTask.vue"
import { ref, onMounted, inject, watch, Ref, computed } from "vue"
import { Task } from "../types/types"

const taskStore = tStore()

const tasks = ref<Task[]>([])
const loadingTasks = ref(false)

const addedTask = inject<Ref<Task | null>>("addedTask", ref(null))
const tip = inject<Ref<any | null>>("tip", ref(null))
const difficulty = inject<Ref<any | null>>("difficulty", ref(null))
const tasksRemoved = inject<Ref<boolean>>("tasksRemoved", ref(false))

const emit = defineEmits(["remainingTasks"])

const remainingTasks = computed(() => {
	return tasks.value.filter((el) => !el.completed).length
})

onMounted(() => {
	loadingTasks.value = true
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

watch(tasksRemoved, () => {
	getTasks()
})

watch(remainingTasks, (t) => {
	emit("remainingTasks", t)
})

const getTasks = async () => {
	tasks.value = await taskStore.fetchAll()
	loadingTasks.value = false
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
