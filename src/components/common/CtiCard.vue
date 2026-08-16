<template>
  <PageCard :icon="icon" :icon-name="iconName" :title="title">
    <slot />
  </PageCard>
</template>

<script setup>
import PageCard from './PageCard.vue';

defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconName: { type: String, default: '' },
});
</script>
