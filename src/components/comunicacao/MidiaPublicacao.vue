<template>
  <div v-if="midias.length">
    
    <template v-if="modo === 'preview'">
      <div v-if="midias.length === 1" class="relative">
        <q-img
          v-if="primeira.tipo === 'imagem'"
          :src="primeira.url"
          :alt="alt"
          :ratio="16 / 9"
        />

        <q-img
          v-else
          :src="primeira.poster || placeholder"
          :alt="alt"
          :ratio="16 / 9"
        >
          <div class="absolute inset-0 flex flex-nowrap items-center justify-center bg-black/25">
            <q-icon name="play_circle" color="white" size="64px" />
          </div>
        </q-img>
      </div>

      <!-- Mais de uma mídia: arrasta pro lado, estilo Instagram -->
      <div v-else class="relative" style="aspect-ratio: 16 / 9">
        <q-carousel
          v-model="slide"
          animated
          swipeable
          infinite
          height="100%"
          class="absolute inset-0 rounded-none"
        >
          <q-carousel-slide
            v-for="(m, i) in midias"
            :key="i"
            :name="i"
            class="p-0"
          >
            <q-img
              v-if="m.tipo === 'imagem'"
              :src="m.url"
              :alt="`${alt} (${i + 1})`"
              :ratio="16 / 9"
              class="fit"
            />
            <q-img
              v-else
              :src="m.poster || placeholder"
              :alt="`${alt} (${i + 1})`"
              :ratio="16 / 9"
              class="fit"
            >
              <div class="absolute inset-0 flex flex-nowrap items-center justify-center bg-black/25">
                <q-icon name="play_circle" color="white" size="64px" />
              </div>
            </q-img>
          </q-carousel-slide>
        </q-carousel>

        <q-badge
          color="dark"
          class="absolute right-2 top-2 opacity-80"
          :label="`${slide + 1}/${midias.length}`"
        />

        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          <span
            v-for="(m, i) in midias"
            :key="i"
            class="h-1.5 w-1.5 rounded-full transition-all"
            :class="i === slide ? 'bg-white w-3' : 'bg-white/50'"
          />
        </div>
      </div>
    </template>

    <!-- MODO FULL (detalhe): renderiza tudo -->
    <template v-else>
      
      <div v-if="midias.length === 1">
        <q-img
          v-if="primeira.tipo === 'imagem'"
          :src="primeira.url"
          :alt="alt"
          fit="contain"
          class="max-h-[460px] w-full rounded-lg bg-black"
        />
        <video
          v-else
          controls
          playsinline
          :poster="primeira.poster || placeholder"
          class="block max-h-[460px] w-full rounded-lg bg-black"
        >
          <source :src="primeira.url" />
          Seu navegador não suporta vídeo.
        </video>
      </div>

      
      <q-carousel
        v-else
        v-model="slide"
        animated
        arrows
        navigation
        infinite
        swipeable
        control-color="primary"
        class="rounded-lg bg-black"
        height="420px"
      >
        <q-carousel-slide
          v-for="(m, i) in midias"
          :key="i"
          :name="i"
          class="flex flex-col flex-nowrap items-center justify-center p-0"
        >
          <q-img
            v-if="m.tipo === 'imagem'"
            :src="m.url"
            :alt="`${alt} (${i + 1})`"
            fit="contain"
            class="fit"
          />
          <video
            v-else
            controls
            playsinline
            :poster="m.poster || placeholder"
            class="block max-h-[460px] w-full rounded-lg bg-black"
          >
            <source :src="m.url" />
          </video>
        </q-carousel-slide>
      </q-carousel>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  midias: { type: Array, default: () => [] },
  modo: { type: String, default: 'preview' }, 
  alt: { type: String, default: 'Mídia da publicação' },
});

const slide = ref(0);
const primeira = computed(() => props.midias[0] || {});
const placeholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="#045DA5"/></svg>',
  );
</script>
