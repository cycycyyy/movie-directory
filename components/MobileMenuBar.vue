<template>
  <ClientOnly>
    <div
      class="sidebar bg-black/5 flex items-center justify-between gap-5 py-5 px-5"
      :class="!props.useAsHeader ? 'lg:w-[75px] lg:flex-col lg:gap-20' : ''"
    >
      <span
        class="flex items-center gap-2 text-primary text-2xl uppercase font-bold"
        :class="!props.useAsHeader ? 'lg:-rotate-90' : ''"
        ><UIcon name="i-lucide-film" class="w-5 h-5" /> CineNest</span
      >
      <UButton
        :icon="
          isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
        "
        color="black"
        variant="ghost"
        aria-label="Theme"
        @click="isDark = !isDark"
      />
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { _backgroundColor } from "#tailwind-config/theme";


// For Color Mode
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const props = defineProps<{
  useAsHeader?: boolean;
}>();
</script>

<style></style>
