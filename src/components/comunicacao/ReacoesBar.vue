<template>
  <div class="flex flex-nowrap items-center gap-4 w-full">
    
    <div class="relative group inline-block">
      
      <div
        class="absolute bottom-full left-0 pb-2 hidden group-hover:block z-30"
      >
        
        <div class="flex flex-nowrap items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100">
          <button
            v-for="r in tipos"
            :key="r.tipo"
            type="button"
            class="group/btn flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-125 focus:outline-none"
            :title="r.label"
            @click.stop="escolher(r.tipo)"
          >
            <q-icon
              :name="r.icone"
              size="20px"
              :color="r.cor"
              class="transition-transform duration-100 group-hover/btn:scale-125"
            />
          </button>

          <button
            v-if="minhaReacao"
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 focus:outline-none ml-1"
            title="Remover reação"
            @click.stop="remover"
          >
            <q-icon name="close" size="16px" />
          </button>
        </div>
      </div>

      
      <button
        type="button"
        class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none"
        :class="minhaDef ? 'text-primary bg-primary/10 hover:bg-primary/20' : 'text-gray-600 hover:bg-gray-100'"
        @click="cliquePadrao"
      >
        <q-icon
          :name="minhaDef ? minhaDef.icone : 'thumb_up'"
          size="18px"
          :color="minhaDef ? minhaDef.cor : ''"
        />
        <span>{{ minhaDef ? minhaDef.label : 'Curtir' }}</span>
      </button>
    </div>

    
    <div v-if="total > 0" class="flex items-center text-xs text-gray-500">
      <button
        type="button"
        class="flex items-center gap-1 hover:underline focus:outline-none cursor-pointer"
        @click="$emit('ver-reacoes')"
      >
        <div class="inline-flex">
          <span
            v-for="r in presentes"
            :key="r.tipo"
            class="-ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] first:ml-0 shadow-sm border border-white"
          >
            <q-icon :name="r.icone" size="13px" :color="r.cor" />
          </span>
        </div>
        <span class="font-medium text-gray-600 ml-1">{{ total }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  TIPOS_REACAO,
  MAPA_REACAO,
  reacoesPresentes,
  totalReacoes,
} from 'src/helpers/comunicacao/reacoes';

const props = defineProps({
  reacoes: { type: Object, default: () => ({}) },
  minhaReacao: { type: String, default: null },
});

const emit = defineEmits(['reagir', 'remover', 'ver-reacoes']);

const tipos = TIPOS_REACAO;
const total = computed(() => totalReacoes(props.reacoes));
const presentes = computed(() => reacoesPresentes(props.reacoes).slice(0, 5));
const minhaDef = computed(() =>
  props.minhaReacao ? MAPA_REACAO[props.minhaReacao] : null,
);

function cliquePadrao() {
  if (props.minhaReacao) {
    emit('remover');
  } else {
    emit('reagir', 'curtir');
  }
}

function escolher(tipo) {
  if (tipo === props.minhaReacao) {
    emit('remover');
  } else {
    emit('reagir', tipo);
  }
}

function remover() {
  emit('remover');
}
</script>
