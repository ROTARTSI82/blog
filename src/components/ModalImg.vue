<script>
export default {
  props: {
    src: String,
    alt: String,
    bigSrc: String,
  }
}

</script>

<script setup>
import {ref} from "vue";

let showModal = ref(false);
</script>

<template>
<!--  <span v-html="src + alt +bigSrc"/>-->
  <div>
    <img @click="showModal = true" id="mainImage" :src="src" :alt="alt" />
    <div @click="showModal = false" v-if="showModal" id="modal">
      <img :src="bigSrc || src" :alt="alt"/>
    </div>
  </div>
</template>

<style scoped>
#modal {
  z-index: 1;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

#mainImage {
  cursor: pointer;
}

#mainImage:hover {
  scale: 102%;
}

#modal > img {
  margin: 1rem auto;
  max-height: 90vh;
}

</style>