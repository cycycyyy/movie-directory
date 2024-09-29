<script setup lang="ts">
import { useDayjs } from "#dayjs";
import { useMovieStore, type Movie } from "@/stores/movieStore";

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

const movieStore = useMovieStore();
const isLoading = ref(false);
const TRENDING_MOVIES = ref({} as Movie[]); // For Trending Movies

onMounted(async () => {
  isLoading.value = true;
  const movies = await movieStore.fetchTrendingMovies();
  if (movies) {
    TRENDING_MOVIES.value = movies.slice(0, 10);
  } else {
    TRENDING_MOVIES.value = [];
  }

  isLoading.value = false;
});
</script>

<template class="">
  <ClientOnly v-if="!isLoading">
    <div class="lg:flex relative lg:shadow-lg lg:shadow-yellow-400 hidden">
      <!-- <span class="absolute z-20 bottom-0 right-0 p-10 text-2xl font-bold shadow-xl" :class="isDark ? 'text-white' : 'text-primary'">Popular Movies 2024</span> -->
      <MenuBar :useAsHeader="false" />
      <div class="relative">
        <div class="flex flex-wrap w-full">
          <div
            v-for="(movie, index) in TRENDING_MOVIES"
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
                class="absolute inset-0 py-8 px-6 flex flex-col items-start justify-between movie-information text-left transition-all delay-75 shadow-inner"
                :class="isDark ? 'bg-black/90' : 'bg-white/90'"
              >
                <div>
                  <span
                    class="font-semibold uppercase text-primary hover:underline cursor-pointer text-lg"
                    @click="
                      () => {
                        router.push({
                          path: `/movie-information`,
                          query: {
                            id: movie.id,
                          },
                        });
                      }
                    "
                    >{{ movie.title }}</span
                  >
                  <span class="text-xs flex items-center gap-1"
                    ><UIcon name="i-lucide-calendar" />

                    {{ dayjs(movie.release_date).format("YYYY") }}</span
                  >
                  <span class="text-xs py-3 italic text-gray-500">{{
                    movie.tagline
                  }}</span>
                </div>
                <div
                  class="self-end flex flex-col gap-3"
                  :class="isDark ? 'text-gray-200' : ''"
                >
                  <div class="flex flex-col items-end">
                    <span class="text-xl font-bold flex items-center gap-1"
                      ><UIcon name="i-lucide-star" />{{
                        Math.round(movie.vote_average * 10)
                      }}%</span
                    >
                    <span class="text-xs">User Score</span>
                  </div>
                  <span
                    @click="
                      () => {
                        router.push({
                          path: `/movie-information`,
                          query: {
                            id: movie.id,
                          },
                        });
                      }
                    "
                    class="text-xs font-bold cursor-pointer flex items-center gap-1 uppercase hover:underline"
                    >View Movie</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MobileMenuBar :useAsHeader="true" class="lg:hidden" />
    <div class="lg:hidden h-[calc(100vh-72px-96px)] flex items-center justify-center transition-all">
      <div
        class="flex flex-col justify-center gap-5 items-center px-5"
      >
        <span class="text-3xl relative text-center"
          >Your <span class="font-bold text-primary">one stop</span> movie
          directory.</span
        >
        <MobileSearchBar class="absolute" />
      </div>
    </div>
    <div
      class="py-8 flex items-center justify-center sticky bottom-0 lg:hidden w-full"
    >
      <div class="flex items-center gap-3">
        <span
          class="flex items-center gap-2 text-primary text-2xl uppercase font-bold"
          ><UIcon name="i-lucide-film" class="w-5 h-5" /> CineNest</span
        >
        <span>{{ new Date().getFullYear() }}</span>
      </div>
    </div>
  </ClientOnly>

  <LoadingScreen v-if="isLoading" />
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
