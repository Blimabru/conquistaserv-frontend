<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="bg-white rounded-2xl w-full" style="max-width: 420px;">
      <div class="flex flex-col items-center text-center px-6 pt-8 pb-6">
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          :class="variantStyles.iconBg"
        >
          <q-icon :name="variantStyles.icon" size="28px" :class="variantStyles.iconColor" />
        </div>

        <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ title }}</h3>
        <p class="text-sm text-gray-600" v-if="message">{{ message }}</p>
        <p class="text-xs text-gray-400 mt-2" v-if="detail">{{ detail }}</p>
      </div>

      <div class="flex justify-center gap-3 px-6 pb-6">
        <q-btn
          :label="cancelLabel"
          flat
          color="grey-7"
          class="rounded-lg font-medium px-4 flex-1 hover:bg-gray-50"
          @click="onCancelClick"
        />
        <q-btn
          :label="confirmLabel"
          unelevated
          :color="variantStyles.buttonColor"
          class="rounded-lg font-medium px-4 flex-1"
          @click="onOKClick"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';

const props = defineProps({
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, default: '' },
  detail: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  // 'danger' (excluir/irreversível), 'warning' ou 'primary' (ação neutra)
  variant: { type: String, default: 'danger' },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const VARIANTS = {
  danger: {
    icon: 'delete_outline',
    iconBg: 'bg-red-50',
    iconColor: 'text-negative',
    buttonColor: 'negative',
  },
  warning: {
    icon: 'warning_amber',
    iconBg: 'bg-orange-50',
    iconColor: 'text-warning',
    buttonColor: 'warning',
  },
  primary: {
    icon: 'help_outline',
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
    buttonColor: 'primary',
  },
};

const variantStyles = computed(() => VARIANTS[props.variant] || VARIANTS.danger);

function onOKClick() {
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
