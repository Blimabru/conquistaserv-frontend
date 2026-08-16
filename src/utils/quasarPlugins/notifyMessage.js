import { Notify } from 'quasar';

// Ícone por tipo: reforça a mensagem sem depender só da cor (WCAG 1.4.1).
const ICONES = {
  positive: 'check_circle',
  negative: 'error',
  warning: 'warning',
  info: 'info',
};

export default function showNotification(type, message, position, timeout) {
  Notify.create({
    type: type,
    message: message,
    position: position,
    timeout: timeout,
    icon: ICONES[type],
  });
}
