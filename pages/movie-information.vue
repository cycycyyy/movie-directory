<template>
  <UContainer v-if="isLoading" v-motion-fade>
    <div class="flex items-center justify-center h-screen m-auto">
      <span
        class="flex items-center gap-2 text-primary text-2xl uppercase font-bold animate-bounce"
        ><UIcon name="i-lucide-film" class="w-5 h-5" /> CineNest</span
      >
    </div>
  </UContainer>

  <MenuBar :useAsHeader="true" v-if="!isLoading" />
  <div
    class="relative flex h-full w-full bg-no-repeat bg-cover bg-center"
    :style="{
      backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieData.backdrop_path})`,
    }"
    v-if="!isLoading"
    v-motion-fade
  >
    <!-- Overlay for background opacity -->
    <div
      class="absolute inset-0 dark:bg-black dark:opacity-70 z-10 bg-white opacity-80"
    ></div>

    <UContainer class="w-full">
      <span class="relative pt-5 z-30 flex"
        ><div
          class="cursor-pointer items-center gap-2 text-sm font-semibold hover:text-primary transition-all"
          @click="
            () => {
              router.push('/');
            }
          "
        >
          <UIcon name="i-lucide-step-back" />
          Back to Home
        </div></span
      >
      <!-- Content with z-index to stay above the overlay -->
      <div class="relative lg:flex py-5 gap-3 space-y-4 z-30">
        <div class="h-full max-w-60">
          <img
            :src="`https://image.tmdb.org/t/p/original/${movieData.poster_path}`"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex flex-col justify-end w-full gap-3 transition-all">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 cursor-pointer">
              <span class="h-full text-3xl font-bold hover:text-primary">{{
                movieData.title
              }}</span
              ><span class="dark:text-gray-200/70 text-xl text-gray-600"
                >({{ dayjs(movieData.release_date).format("YYYY") }})</span
              >
            </div>
            <span class="italic dark:text-gray-200/80 text-gray-600">{{
              movieData.tagline
            }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-bold">Overview</span>
            <span class="w-full text-sm">{{ movieData.overview }}</span>
          </div>
        </div>
        <div class="flex"></div></div
    ></UContainer>
  </div>
  <!-- <UContainer>
    <div class="flex flex-wrap w-full">
      <div
        class="flex flex-grow basis-[calc(100%/4)]"
        v-for="cast in movieCredits.cast"
      >
        <div class="flex flex-col items-center max-w-20">
          <div class="w-20">
            <img
              :src="`https://image.tmdb.org/t/p/w500/${cast.profile_path}`"
              class="h-full w-full object-cover"
            />
          </div>
          <span>{{ cast.name }}</span>
        </div>
      </div>
    </div>
  </UContainer> -->
  <!-- {{ movieImages }} -->
  <UContainer class="py-5" v-if="!isLoading">
    <span class="font-bold text-lg flex items-center gap-2"
      >Backdrops <span class="text-sm text-gray-200/80"></span
    ></span>
    <div class="flex flex-wrap py-5 gap-3">
      <div
        class="flex flex-col flex-grow lg:basis-[calc(100%/5)] basis-[calc(100%/3)] hover:rotate-3 hover:scale-110 transition-all hover:shadow"
        v-for="image in movieImages.backdrops"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w500/${image.file_path}`"
          class="w-full h-full object-cover rounded"
        />
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import type { _backgroundImage } from "#tailwind-config/theme";
import { useRoute } from "vue-router";
import { useDayjs } from "#dayjs";
import { useMovieStore, type Movie, type MovieCast, type MovieImages } from "@/stores/movieStore";
const dayjs = useDayjs();

const router = useRouter();
const route = useRoute();
const movieStore = useMovieStore();
const movieID = ref();
const movieData = ref({} as Movie);
const movieCredits = ref({} as MovieCast);
const movieImages = ref({} as MovieImages);
const isLoading = ref();

onMounted(async () => {
  isLoading.value = true;
  movieID.value = route.query.id;

  // Set Timeout to simulate loading
  setTimeout(async () => {
    movieData.value = (await movieStore.fetchMovieByID(movieID.value)) as Movie;
    movieCredits.value = (await movieStore.fetchCreditsByID(movieID.value)) as MovieCast;
    movieImages.value = (await movieStore.fetchImagesByID(movieID.value)) as MovieImages;
    isLoading.value = false;
  }, 500);
});

watch(
  () => route.query.id,
  async (newID) => {
    isLoading.value = true;

    movieID.value = String(newID);
    // Set Timeout to simulate loading
    setTimeout(async () => {
      movieData.value = (await movieStore.fetchMovieByID(movieID.value)) as Movie;
      movieCredits.value = (await movieStore.fetchCreditsByID(movieID.value)) as MovieCast;
      movieImages.value = (await movieStore.fetchImagesByID(movieID.value)) as MovieImages;
      isLoading.value = false;
    }, 500);
  }
);
</script>

<style></style>
