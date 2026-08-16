<template>
  <q-card flat bordered class="m-4 rounded-xl">
    <div class="flex items-center gap-2 px-5 pt-4 pb-3">
      <q-icon :name="icon || iconName" size="28px" class="text-primary" />
      <span class="text-lg font-medium text-gray-800">{{ title }}</span>
    </div>

    <q-separator />

    <div class="p-5">
      <slot />
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  // Alias — algumas páginas usam "iconName" em vez de "icon"
  iconName: {
    type: String,
    default: '',
  },
});
</script>
