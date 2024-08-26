<template>
  <div
    class="search absolute z-20 flex flex-col items-center justify-center w-full transition-all px-5"
    :class="!showSearch ? '-top-40' : 'lg:top-2 top-5'"
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
          gray: { outline: 'dark:bg-black/80 dark:ring-black/80' },
        },
      }"
      :loading="isLoading"
    >
      <template #trailing>
        <UButton
          v-show="searchQuery !== ''"
          color="gray"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          @click="() => {
            searchQuery = '';
            searchResults = {} as MovieResponse;
          }"
        /> </template
    ></UInput>
    <div
      class="max-w-[500px] w-full max-h-[50vh] h-full overflow-y-scroll flex-col flex dark:bg-black/80 bg-white rounded-b-lg"
      v-if="searchResults.total_results > 0"
      v-motion-fade
    >
      <div
        class="p-2 hover:bg-primary/60 transition-all cursor-pointer hover:font-semibold"
        v-for="result in searchResults.results"
        @click="
          () => {
            router.push({
              path: '/movie-information',
              query: {
                id: result.id,
              },
            });
          }
        "
      >
        <div class="flex items-center gap-3">
          <div class="w-11 h-full flex justify-center items-center">
            <img
              :src="`https://image.tmdb.org/t/p/w500/${result.poster_path}`"
              v-if="result.poster_path"
              class="w-11 h-full object-cover"
            />
            <UIcon
              name="i-lucide-film text-primary"
              class="w-8 h-10"
              v-if="!result.poster_path"
            />
          </div>
          <div class="flex flex-col w-full h-full">
            <span class="w-full"> {{ result.title }}</span>
            <span class="text-xs">{{
              dayjs(result.release_date).format("YYYY")
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-white dark:bg-black/80 max-w-[500px] w-full py-5 text-center rounded-b-lg"
      v-if="searchResults.total_results < 1"
      v-motion-fade
    >
      <span>No results found</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDayjs } from "#dayjs";
const dayjs = useDayjs();
const router = useRouter();

interface MovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MovieResponse {
  page: number;
  results: MovieResult[];
  total_pages: number;
  total_results: number;
}

const searchQuery = ref("");

defineProps({
  showSearch: Boolean,
});

const searchResults = ref({} as MovieResponse);
const includeAdult = ref(false);
const language = ref("en-US");
const isLoading = ref(false);

const searchMovies = async (query: string) => {
  try {
    /* const apiUrl = useRuntimeConfig().public.apiURL; */
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=${includeAdult}&language=${language}&page=1`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmQ0YzU4ZTA0ZDA5MjFjMTU1ZGE4NzM2MzBkMGUyMiIsIm5iZiI6MTcyNDQxODE3OC45MDM3MDksInN1YiI6IjY2YzZmYTdhNTRmYjFmZjA0YTkxOGI0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EyrGfAWpyIqq-Z5wdXCsednIyO1q57RW0Z9jWvpKLw0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`'Unknown error'}`);
    }

    const data = await response.json();

    return data as MovieResponse;
  } catch (error) {
    return Promise.reject(error);
  }
};

const clearSearchResults = () => {
  searchResults.value = {} as MovieResponse;
};

watch(searchQuery, async () => {
  if (searchQuery.value.length > 0) {
    searchResults.value = {} as MovieResponse;
    isLoading.value = true;
    searchResults.value = (await searchMovies(
      searchQuery.value
    )) as MovieResponse;
    isLoading.value = false;
  } else {
    searchResults.value = {} as MovieResponse;
  }
});
</script>

<style></style>
