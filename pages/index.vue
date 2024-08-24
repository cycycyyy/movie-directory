<script setup lang="ts">
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

interface Movie {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MovieResponse {
  page: number;
  results: Movie[];
}

const TRENDING_MOVIES = ref({} as MovieResponse); // For Trending Movies

const { data: trendingMovies, error } = await useAsyncData(
  "trending-movies",
  () =>
    $fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmQ0YzU4ZTA0ZDA5MjFjMTU1ZGE4NzM2MzBkMGUyMiIsIm5iZiI6MTcyNDQxODE3OC45MDM3MDksInN1YiI6IjY2YzZmYTdhNTRmYjFmZjA0YTkxOGI0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EyrGfAWpyIqq-Z5wdXCsednIyO1q57RW0Z9jWvpKLw0",
      },
    })
);

TRENDING_MOVIES.value = trendingMovies.value as MovieResponse;

const searchQuery = ref("");
const showSearch = ref(false);
</script>

<template class="">
  <ClientOnly>
    <div class="lg:flex relative shadow-lg shadow-yellow-400">
      <!-- <span class="absolute z-20 bottom-0 right-0 p-10 text-2xl font-bold shadow-xl" :class="isDark ? 'text-white' : 'text-primary'">Popular Movies 2024</span> -->
      <div
        class="sidebar lg:w-[75px] bg-black/5 flex lg:flex-col items-center justify-center gap-5 lg:gap-20 py-5"
      >
        <UButton
          :icon="!showSearch ? 'i-lucide-x' : 'i-lucide-search'"
          color="black"
          variant="ghost"
          aria-label="Theme"
          @click="showSearch = !showSearch"
        />
        <span
          class="lg:-rotate-90 flex items-center gap-2 text-primary text-2xl uppercase font-bold"
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
      <div class="relative">
        <div
          class="search absolute z-20 top-2 flex justify-center w-full transition-all"
          :class="showSearch ? '-top-40' : 'top-2'"
        >
          <!-- Add 'loading' prop for loading state in Input -->
          <UInput
            v-model="searchQuery"
            color="gray"
            variant="outline"
            class="max-w-[500px] w-full mx-5 transition-all delay-200"
            placeholder="Search something awesome..."
            size="xl"
            icon="i-heroicons-magnifying-glass-20-solid"
            autocomplete="off"
            :ui="{
              icon: { trailing: { pointer: '' } },
              color: {
                gray: {outline: 'dark:bg-black/80 dark:ring-black/80'}
              },
            }"
          >
            <template #trailing>
              <UButton
                v-show="searchQuery !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click="searchQuery = ''"
              /> </template
          ></UInput>
        </div>
        <div v-if="TRENDING_MOVIES" class="flex flex-wrap w-full">
          <div
            v-for="(movie, index) in TRENDING_MOVIES.results.slice(0, 10)"
            :key="index"
            class="flex flex-col flex-grow xl:basis-[calc(100%/5)] lg:basis-[calc(100%/4)] sm:basis-[calc(100%/3)] basis-[calc(100%/2)] movie-poster-card"
          >
            <div class="h-[50vh] w-full relative transition-all">
              <img
                :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`"
                class="h-full w-full object-cover transition-all"
                :class="isDark ? 'filter brightness-75' : ''"
              />
              <div
                class="absolute inset-0 py-8 px-6 flex flex-col items-start justify-start movie-information text-left transition-all delay-75 shadow-inner"
                :class="isDark ? 'bg-black/90' : 'bg-white/90'"
              >
                <span
                  class="font-semibold uppercase text-lg text-primary hover:underline cursor-pointer"
                  >{{ movie.title }}</span
                >
                <div
                  class="flex flex-col gap-3"
                  :class="isDark ? 'text-gray-200' : ''"
                >
                  <div class="flex divide-x-2 pb-4">
                    <span class="text-xs pr-2 flex items-center gap-1"
                      ><UIcon name="i-lucide-star" />{{
                        movie.vote_count
                      }}</span
                    >
                    <span class="text-xs pl-2 flex items-center gap-1"
                      ><UIcon name="i-lucide-calendar" />{{
                        movie.release_date
                      }}</span
                    >
                  </div>
                  <span class="text-xs">{{ movie.overview }}</span>
                  <!-- <span class="text-xs font-bold cursor-pointer flex items-center gap-1 uppercase hover:underline"
                    >View Movie</span
                  > -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>Loading...</div>
      </div>
    </div>

    <div class="py-8 flex items-center justify-center">
      <div class="flex items-center gap-3">
        <span
          class="flex items-center gap-2 text-primary text-2xl uppercase font-bold"
          ><UIcon name="i-lucide-film" class="w-5 h-5" /> CineNest</span
        >
        <span>{{ new Date().getFullYear() }}</span>
      </div>
    </div>
  </ClientOnly>
</template>

<style>
.movie-poster-card .movie-information {
  display: none;
  transition: all 0;
}

.movie-poster-card:hover .movie-information {
  display: flex;
}
</style>
