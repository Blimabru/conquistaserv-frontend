<template>
  <div class="vitoria-audio-player">
    <button class="vitoria-audio-player__btn" @click="togglePlay" aria-label="Play ou Pause">
      <q-icon :name="isPlaying ? 'pause' : 'play_arrow'" />
    </button>
    <div class="vitoria-audio-player__timeline">
      <input 
        type="range" 
        class="vitoria-audio-player__slider" 
        min="0" 
        :max="duration" 
        step="0.01"
        v-model="currentTime"
        @input="onSeek"
      />
      <div class="vitoria-audio-player__time">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
    <audio 
      ref="audioEl" 
      :src="src" 
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      class="hidden"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  }
});

const audioEl = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

function formatTime(time) {
  if (isNaN(time) || !isFinite(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function togglePlay() {
  if (isPlaying.value) {
    audioEl.value.pause();
  } else {
    audioEl.value.play();
  }
  isPlaying.value = !isPlaying.value;
}

function onTimeUpdate() {
  currentTime.value = audioEl.value.currentTime;
}

function onLoadedMetadata() {
  // O navegador pode não saber a duração de blobs dinâmicos imediatamente
  duration.value = audioEl.value.duration === Infinity ? 0 : audioEl.value.duration;
  
  // Workaround para blobs do MediaRecorder que as vezes retornam Infinity
  if (duration.value === 0 && audioEl.value.readyState > 0) {
    audioEl.value.currentTime = 10000000;
    setTimeout(() => {
      duration.value = audioEl.value.duration;
      audioEl.value.currentTime = 0;
    }, 100);
  }
}

function onEnded() {
  isPlaying.value = false;
  currentTime.value = 0;
}

function onSeek(e) {
  const time = Number(e.target.value);
  audioEl.value.currentTime = time;
  currentTime.value = time;
}

onUnmounted(() => {
  if (audioEl.value) {
    audioEl.value.pause();
  }
});
</script>

<style lang="scss" scoped>
.vitoria-audio-player {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f0f4;
  padding: 8px 16px;
  border-radius: 24px;
  min-width: 200px;
  max-width: 260px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  &__btn {
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 50%;
    background: #E2007A; /* Rosa da Vitória */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
    font-size: 18px;
    flex-shrink: 0;
    padding: 0;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__timeline {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  &__slider {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: #d0d0d8;
    border-radius: 2px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #E2007A;
      cursor: pointer;
      transition: transform 0.1s;
    }

    &::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
  }

  &__time {
    font-size: 11px;
    color: #808080;
    font-family: 'Poppins', sans-serif;
    user-select: none;
  }

  .hidden {
    display: none;
  }
}
</style>
