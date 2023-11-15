<template>
	<main
		class="grid min-h-screen place-items-center bg-slate-200 px-4 py-24 dark:bg-slate-800 sm:py-32 lg:px-8"
	>
		<div class="text-center">
			<p class="text-base font-semibold text-indigo-600 dark:text-indigo-300">404</p>
			<h1
				class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-300 sm:text-5xl"
			>
				Página não encontrada
			</h1>
			<p class="mt-6 text-base leading-7 text-gray-600 dark:text-slate-100">
				A página acessada não existe
			</p>
			<div class="mt-8 flex items-center justify-center gap-x-6">
				<router-link
					to="/"
					class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white/90 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					Início
				</router-link>
			</div>
		</div>
	</main>
</template>
