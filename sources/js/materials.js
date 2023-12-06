const url = 'http://localhost:5000/'
let currentStudentId = null;
const buttons = document.querySelectorAll('.subroute')
const articles = document.querySelectorAll('.article')
const editContainer = document.getElementById('editEntry')
const containerEditEntry = document.getElementById('containerEditEntry')
const tbody = document.getElementById('tboodyMaterials')

buttons.forEach((button, idxButton) => {
    button.addEventListener('click', () => {
        articles.forEach((article, idxArticle) => {
            if (idxButton === idxArticle) {
                article.classList.add('active')
                return
            }
            article.classList.remove('active')
        })
    })
})

const generateItem = params => {
    return (`
        <tr id="tool_${params.id}">
            <td> 
                <span>${params.name}</span> 
            </td> 
            <td> 
                <span>${params.stock}</span> 
            </td>
            <td>
                <span>${params.category === undefined || params.category === '' ? '-' : params.category}</span>
            </td>
            <td> 
                <span>${params.limit_materials}</span> 
            </td>
            <td>
                <span class="buttons normal">
                    <button onClick="openEdit(${params.id})">
                        <i class="fi fi-br-pencil"></i>
                    </button>
                    <button onClick="deleteEntry(${params.id})">
                        <i class="fi fi-br-trash"></i>
                    </button>
                </span>
            </td>
        </tr>
    `)
}

const mapData = (data) => {
    tbody.innerHTML = ''
    data.forEach(item => {
        const itemHtml = generateItem(item);
        tbody.insertAdjacentHTML('beforeend', itemHtml)
    })
}

const validateNumber = event => {
    if (event) {
        const inputValue = event.target.value;

        if (!/^[0-9]+$/.test(inputValue)) {
            event.target.value = inputValue.replace(/[^0-9]/g, '')
        }
    }
}

const getData = async () => {
    const options = { method: 'GET' }

    try {
        const response = await fetch(`${url}materials`, options)
        const data = await response.json()
        sessionStorage.setItem('materialsData', JSON.stringify(data))
        mapData(data)
    }
    catch (err) { throw new Error(err) }
}
const sendEntry = async (body) => {
    const options = { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }

    try {
        const response = await fetch(`${url}materials`, options)
        if (response.status === 200) {
            getData()
        } else {
            throw new Error(`Error de tipo: ${response.status}`)
        }
    }
    catch (err) { throw new Error(err) }
}

const fetchEntry = async (id) => {
    const options = { method: 'GET' }
    try {
        const response = await fetch(`${url}materials/${id}`)
        const data = await response.json()
        return data[0]
    }
    catch (err) { throw new Error(err) }
}

const deleteEntry = async (id) => {
    const options = { method: 'DELETE' }
    try {
        const response = await fetch(`${url}materials/${id}`, options)
        if (response.status === 200) {
            getData()
        } else {
            throw new Error('Ups! algo salio mal', response.status)
        }
    }
    catch (err) { throw new Error(err) }
}

const generateEditForm = (param) => {
    return (`
        <div class="container flex">
            <div class="ctn-input">
                <label for="editMaterialName" class="label">Nombre</label>
                <input type="text" name="editMaterialName" id="editMaterialName" class="input" value="${param.name}">
            </div>
            <div class="ctn-input">
                <label for="editMaterialStock" class="label">Stock</label>
                <input type="text" name="editMaterialStock" id="editMaterialStock" class="input" value="${param.stock}">
            </div>
            <div class="ctn-input">
                <label for="editMaterialLimit" class="label">Limite por estudiante</label>
                <input type="text" name="editMaterialLimit" id="editMaterialLimit" class="input" value="${param.limit_materials}">
            </div>
            <div class="containerButtons flex">
                <button type="reset" onclick="closeEdit()" class="btn-popUp red">
                    Cancelar
                </button>
                <button type="submit" class="btn-popUp">
                    Agregar
                </button>
            </div>
        </div>
    `)
}

const openEdit = async id => {
    currentStudentId = id
    editContainer.classList.add('active')
    containerEditEntry.innerHTML = ''
    containerEditEntry.insertAdjacentHTML('beforeend', generateEditForm(await fetchEntry(id)))
}

const closeEdit = () => {
    editContainer.classList.remove('active')
    containerEditEntry.innerHTML = ''
}

document.getElementById('addMaterialForm').addEventListener('submit', e => {
    e.preventDefault()

    const data = {
        name: e.target.newMaterialName.value,
        stock: e.target.newMaterialStock.value,
        category: document.querySelector('#newMaterialCategory span').textContent,
        limit_materials: e.target.newMaterialLimit.value
    }

    console.log(data.category)

    if (!data.name || !data.stock || data.category === 'Seleccione categoría') return alert('Complete los campos para continuar')

    articles.forEach((item, idx) => {
        idx === 1 ? item.classList.add('active') : item.classList.remove('active')
    })

    sendEntry(data)
})

document.addEventListener('DOMContentLoaded', () => {
    const inputElements = document.querySelectorAll('input')
    inputElements.forEach((input) => { if (input.type === 'number') { input.addEventListener('input', validateNumber) } })

    const storedData = sessionStorage.getItem('materialsData')

    if (storedData) {
        actualyData = JSON.parse(storedData)
        mapData(actualyData)
    } else {
        getData()
    }
})