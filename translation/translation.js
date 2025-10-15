// Variable global donde se guardará el contenido del archivo JSON del idioma
window.langText = null;
window.translationApiCache = {};

async function getApiTranslatedText(spanishText) {
	if (window.translationApiCache[spanishText]) {
		// Either a finished translation (string) or a pending promise
		return await window.translationApiCache[spanishText];
	}

	const sourceLang = 'es';
	const targetLang = 'en';
	const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(spanishText)}`;

	// Create a promise and store it immediately to prevent duplicates
	const translationPromise = (async () => {
		try {
			const response = await fetch(url);
			const data = await response.json();
			const englishText = data[0][0][0];

			// Replace the promise with the final string result
			window.translationApiCache[spanishText] = englishText;
			return englishText;
		} catch (error) {
			console.error('Translation failed:', error, " original text returned instead.");
			delete window.translationApiCache[spanishText]; // allow retry next time
			return spanishText;
		}
	})();

	window.translationApiCache[spanishText] = translationPromise;
	return await translationPromise;
}

// ------------------------------------------------------------
// FUNCION: getTranslatedText
// ------------------------------------------------------------
// Esta función recibe una "ruta" (como 'home/welcome')
// y busca dentro del objeto del idioma (langText)
// el texto traducido correspondiente.
function getTranslatedText(elementLangKey) {
	// Divide la ruta por cada '/' para obtener las partes
	// Ejemplo: "home/welcome" → ["home", "welcome"]
	const elementLangKeyParts = elementLangKey.split('/');

	// Comienza desde el objeto completo del idioma
	let text = window.langText;

	// Recorre cada parte de la ruta paso a paso
	// Para llegar al texto final dentro del JSON
	try {
		elementLangKeyParts.forEach(langKeyPart => {
			text = text[langKeyPart];
		});
	}
	catch {
		text = elementLangKey;
	}

	// Devuelve el texto traducido que se encontró
	return text;
}

// ------------------------------------------------------------
// FUNCION: setLang
// ------------------------------------------------------------
// Esta función carga el archivo del idioma elegido (por ejemplo "en.json")
// y cambia el texto de todos los elementos HTML que tengan el atributo "tlang"
// por su traducción correspondiente.
async function setLang(lang) {
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

		// Obtiene donde se encuentra el texto en el elemento:
		// - inner: dentro de la etiqueta -> <a>TEXTO</a>
		// - value: dentro del atributo value <input value="TEXTO">
		// En caso que no sea especificado, el predeterminado es inner.
		const elementTextLocation = translatableElement.getAttribute("tlang-loc") ?? 'inner';

		// Busca la traducción correspondiente en el archivo JSON
		const translatedText = getTranslatedText(elementLangKey);

		// Cambia el texto interno del elemento por la traducción encontrada
		if (elementTextLocation == 'inner') translatableElement.innerText = translatedText;
		else if (elementTextLocation == 'value') translatableElement.value = translatedText;
	});
}

// ------------------------------------------------------------
// LLAMADA INICIAL
// ------------------------------------------------------------
// Se llama a la función para establecer el idioma inicial de la página.
// En este caso, 'en' (inglés).
setLang('en');
