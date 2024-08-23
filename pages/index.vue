<script setup lang="ts">
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

const TRENDING_MOVIES = ref(); // For Trending Movies

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
</script>

<template>
  <!-- <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly> -->

  <div class="">
    <div v-if="TRENDING_MOVIES" class="grid grid-cols-4 lg:grid-cols-6">
      <div
        v-for="(movie, index) in TRENDING_MOVIES.results"
        :key="index"
        class="flex flex-col gap-1"
      >
        <div class="h-[50vh] w-full">
          <img
            :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`"
            class="h-full object-cover"
          />
        </div>
        <!-- <span class="font-bold">{{ movie.title }}</span> -->
        <!-- <span>{{ movie.overview }}</span> -->
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>
