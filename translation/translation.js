// Variable global donde se guardará el contenido del archivo JSON del idioma
window.langText = null;

async function translateSpanishToEnglish(text) {
  const sourceLang = 'es';
  const targetLang = 'en';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // The translated text is nested like: data[0][0][0]
    return data[0][0][0];
  } catch (error) {
    console.error('Translation failed:', error);
    return null;
  }
}

// ------------------------------------------------------------
// FUNCION: getTranslatedText
// ------------------------------------------------------------
// Esta función recibe una "ruta" (como 'home/welcome')
// y busca dentro del objeto del idioma (langText)
// el texto traducido correspondiente.
function getTranslatedText(elementLangKey)
{
    // Divide la ruta por cada '/' para obtener las partes
    // Ejemplo: "home/welcome" → ["home", "welcome"]
    const elementLangKeyParts = elementLangKey.split('/');

    // Comienza desde el objeto completo del idioma
    let text = window.langText;

    // Recorre cada parte de la ruta paso a paso
    // Para llegar al texto final dentro del JSON
    elementLangKeyParts.forEach(langKeyPart => {
        text = text[langKeyPart];
    });

    // Devuelve el texto traducido que se encontró
    return text;
}

// ------------------------------------------------------------
// FUNCION: setLang
// ------------------------------------------------------------
// Esta función carga el archivo del idioma elegido (por ejemplo "en.json")
// y cambia el texto de todos los elementos HTML que tengan el atributo "tlang"
// por su traducción correspondiente.
async function setLang(lang)
{
    // Carga el archivo JSON del idioma según el valor de 'lang'
    // Por ejemplo: si lang = "en", se carga "lang/en.json"
    window.langText = await fetch(`lang/${lang}.json`);

    // Convierte el archivo JSON en un objeto de JavaScript
    window.langText = await langText.json();

    // Busca en el documento HTML todos los elementos
    // que tengan el atributo personalizado "tlang"
    const translatableElements = document.querySelectorAll('[tlang]');

    // Recorre todos los elementos que se pueden traducir
    translatableElements.forEach(translatableElement => {
        // Obtiene el valor del atributo "tlang" del elemento
        // Ejemplo: <p tlang="home/welcome"></p> → "home/welcome"
        const elementLangKey = translatableElement.getAttribute("tlang");

        // Busca la traducción correspondiente en el archivo JSON
        const translatedText = getTranslatedText(elementLangKey);

        // Cambia el texto interno del elemento por la traducción encontrada
        translatableElement.innerText = translatedText;
    });
}

// ------------------------------------------------------------
// LLAMADA INICIAL
// ------------------------------------------------------------
// Se llama a la función para establecer el idioma inicial de la página.
// En este caso, 'en' (inglés).
setLang('en');
