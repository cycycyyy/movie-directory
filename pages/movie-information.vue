<template>
  <UContainer>
    <span>{{ movieID }}</span>
  </UContainer>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
const movieID = route.query.id;

const fetchMovieByID = async (id: string) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=86d4c58e04d0921c155da873630d0e22&language=en-US`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchMovieByID(movieID as string);
});
</script>

<style></style>
