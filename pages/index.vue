<script setup lang="ts">
import { useDayjs } from "#dayjs";
const dayjs = useDayjs();
const router = useRouter();

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
  () => {
    const API_URL = useRuntimeConfig().public.TMDB_API_URL;
    const API_KEY = useRuntimeConfig().public.TMDB_API_KEY;
    return $fetch(
      `${API_URL}/trending/movie/day?language=en-US&api_key=${API_KEY}`
    );
  }
);

TRENDING_MOVIES.value = trendingMovies.value as MovieResponse;
</script>

<template class="">
  <ClientOnly>
    <div class="lg:flex relative shadow-lg shadow-yellow-400">
      <!-- <span class="absolute z-20 bottom-0 right-0 p-10 text-2xl font-bold shadow-xl" :class="isDark ? 'text-white' : 'text-primary'">Popular Movies 2024</span> -->
      <MenuBar :useAsHeader="false"/>
      <div class="relative">
        <div v-if="TRENDING_MOVIES" class="flex flex-wrap w-full">
          <div
            v-for="(movie, index) in TRENDING_MOVIES.results.slice(0, 10)"
            :key="index"
            class="flex flex-col flex-grow xl:basis-[calc(100%/5)] lg:basis-[calc(100%/4)] sm:basis-[calc(100%/3)] basis-[calc(100%/2)] movie-poster-card"
            v-motion-slide-visible-top
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
                  @click="
                    () => {
                      router.push({
                        path: '/movie-information',
                        query: {
                          id: movie.id,
                        },
                      });
                    }
                  "
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
                      ><UIcon name="i-lucide-calendar" />

                      {{ dayjs(movie.release_date).format("YYYY") }}</span
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
