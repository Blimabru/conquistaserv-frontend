
export function suportaNotificacao() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function permissaoAtual() {
  if (!suportaNotificacao()) return 'unsupported';
  return Notification.permission; 
}

export async function pedirPermissao() {
  if (!suportaNotificacao()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return 'denied';
  }
}

export function notificar({ titulo, corpo, tag, onClick } = {}) {
  if (!suportaNotificacao() || Notification.permission !== 'granted') {
    return false;
  }
  try {
    const n = new Notification(titulo || 'ConquistaServ', {
      body: corpo || '',
      tag,
    });
    if (onClick) {
      n.onclick = () => {
        window.focus();
        onClick();
        n.close();
      };
    }
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  suportaNotificacao,
  permissaoAtual,
  pedirPermissao,
  notificar,
};
