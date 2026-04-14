const twa = () => window.Telegram?.WebApp;

export const tgAlert = (msg) => {
  twa()?.showAlert ? twa().showAlert(msg) : alert(msg);
};

export const tgOpenLink = (url) => {
  twa()?.openLink ? twa().openLink(url) : (window.location.href = url);
};

// ── Haptic Feedback ───────────────────────────────────────────────────────────

/** Лёгкий тактильный отклик (для кнопок, навигации) */
export const hapticLight  = () => twa()?.HapticFeedback?.impactOccurred('light');

/** Средний тактильный отклик (для приветствия, акцентных действий) */
export const hapticMedium = () => twa()?.HapticFeedback?.impactOccurred('medium');

/** Успех — зелёная нотификация */
export const hapticSuccess = () => twa()?.HapticFeedback?.notificationOccurred('success');

/** Ошибка */
export const hapticError  = () => twa()?.HapticFeedback?.notificationOccurred('error');

// ── Telegram Native Payment ───────────────────────────────────────────────────

/**
 * Открывает нативный платёжный экран Telegram.
 * invoiceUrl — ссылка вида https://t.me/$invoiceName, полученная с бэкенда.
 * onDone(status) — колбэк: 'paid' | 'cancelled' | 'failed' | 'pending'
 */
export const openInvoice = (invoiceUrl, onDone) => {
  const webApp = twa();
  if (webApp?.openInvoice) {
    webApp.openInvoice(invoiceUrl, onDone);
  } else {
    // Fallback: открываем как обычную ссылку
    window.open(invoiceUrl, '_blank');
  }
};
