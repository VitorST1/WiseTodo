<template>
	<div class="absolute end-4 top-5 flex items-center gap-3 rounded-md bg-red-400 p-3 text-gray-50">
		<Icon class="h-8 w-8" :icon="iconValue" />
		<div>{{ msg }}</div>
	</div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { computed } from "vue"

const props = defineProps<{ msg: string; type: string }>()

const iconValue = computed(() => {
	if (props.type === "error") {
		return "clarity:error-solid"
	}
	return ""
})
</script>
