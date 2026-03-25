const twa = () => window.Telegram?.WebApp;

export const tgAlert = (msg) => {
  twa()?.showAlert ? twa().showAlert(msg) : alert(msg);
};

export const tgOpenLink = (url) => {
  twa()?.openLink ? twa().openLink(url) : (window.location.href = url);
};
