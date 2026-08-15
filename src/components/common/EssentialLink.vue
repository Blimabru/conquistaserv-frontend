<template>
  <!-- Item Principal sem Submenu -->
  <q-item
    v-if="!linksListSubMenu"
    clickable
    tag="router-link"
    :to="link"
    exact
    :active="isActive(link)"
    class="text-white"
    active-class="bg-primary text-white"
    style="border-radius: 10px"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>

  <!-- Item com Submenu -->
  <q-expansion-item
    v-else
    :icon="icon"
    :label="title"
    class="text-white"
    header-class="text-white"
  >
    <q-list class="q-pl-lg">
      <q-item
        v-for="linkSubmenu in linksListSubMenu"
        :key="linkSubmenu.link"
        clickable
        tag="router-link"
        :to="linkSubmenu.link"
        exact
        :active="isActive(linkSubmenu.link)"
        class="text-white"
        active-class="bg-primary text-white"
        style="border-radius: 10px"
      >
        <q-item-section v-if="linkSubmenu.icon" avatar>
          <q-icon :name="linkSubmenu.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ linkSubmenu.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '#',
  },
  icon: {
    type: String,
    default: '',
  },
  linksListSubMenu: {
    type: Array,
    required: false,
  },
});

function isActive(link) {
  if (!link || link === '#') return false;
  return route.path === link || route.path.startsWith(link + '/');
}
</script>