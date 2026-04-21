export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', 'true');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    const wasCopied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return wasCopied;
  } catch {
    return false;
  }
};
