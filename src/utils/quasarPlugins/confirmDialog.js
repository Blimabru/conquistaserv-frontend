import { Dialog } from 'quasar';
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue';

// Uso: confirmDialog({ title, message, detail, confirmLabel, variant }).onOk(() => {...})
export default function confirmDialog({
  title,
  message,
  detail,
  confirmLabel,
  cancelLabel,
  variant,
} = {}) {
  return Dialog.create({
    component: ConfirmDialog,
    componentProps: { title, message, detail, confirmLabel, cancelLabel, variant },
  });
}
