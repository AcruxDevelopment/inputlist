// SUPLIERS

function IListNumberSuplier(name)
{
    return createElementFromString(`<input type="numer" name="${name}">`);
}

function IListPhoneNumberSuplier(name)
{
    return createElementFromString(`<input type="numer" name="${name}" placeholder="Numero de Telefono">`);
}

function IListMateriasSuplier(name)
{
    return createElementFromString(
        `
        <select name="${name}">
            <option>Programacion</option>
            <option>Ciberseguridad</option>
            <option>Ingles</option>
        </select>
        `
    );
}

function IListSuplier(name)
{
    return createElementFromString(`<input type="numer" name="${name}" placeholder="Numero de Telefono">`);
}

//

function createElementFromString(htmlString)
{
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlString;

    const createdElement = tempContainer.firstElementChild;
    return createdElement;
}

function generateIListSkeleton(title)
{
    return createElementFromString(
        `
        <div>
            <h3>${title}</h3>
            <div name="container">
                <div name="input-container"></div>
                <button name="button-add">+</button>
            </div>
        </div>
        `
    );
}

function generateIListInputDiv(input)
{
    const name = crypto.randomUUID();
    const inputDiv = createElementFromString(
        `
        <div name="${name}">
            <button name="button-delete">X</button>
        </div>
        `
    );

    inputDiv.prepend(input);

    const buttonDelete = inputDiv.querySelector("[name='button-delete']");
    buttonDelete.onclick = () => {
        inputDiv.remove();
    };

    return inputDiv;
}

function generateIList(placeholderDiv)
{
    const suplier = placeholderDiv.getAttribute("ilist-suplier");
    const title = placeholderDiv.getAttribute("ilist-title");
    const inputsName = placeholderDiv.getAttribute("ilist-inames");

    const ilist = generateIListSkeleton(title);
    const inputContainer = ilist.querySelector("[name='input-container']");
    const buttonAdd = ilist.querySelector("[name='button-add']");

    buttonAdd.onclick = () => {
        const generated = window[suplier](inputsName);
        const inputDiv = generateIListInputDiv(generated);
        inputContainer.append(inputDiv);
    };

    placeholderDiv.appendChild(ilist);
}