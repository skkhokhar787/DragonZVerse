const translationCache = {};

export async function translateToEnglish(text) {
  if (!text) return "";
  if (translationCache[text]) return translationCache[text];
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`,
    );
    const data = await response.json();
    if (data && data[0]) {
      const translated = data[0].map((item) => item[0]).join("");
      translationCache[text] = translated;
      return translated;
    }
    return text;
  } catch (e) {
    console.error("Translation error:", e);
    return text;
  }
}
