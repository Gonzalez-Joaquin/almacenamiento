const url = 'http://localhost:5000/'

let actualyData = []
let toolsSelected = []

const buttons = document.querySelectorAll('.subroute')
const articles = document.querySelectorAll('.article')
const popUp = document.getElementById('popUp')
const popUpInside = document.getElementById('containerPopUp')
const popUpTitle = document.getElementById('titlePopUp')

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
                <span class="name">${params.name}</span>
                <input type="text" class="edit-name" value="${params.name}" style="display: none;">
            </td>
            <td class="stock">
                <span class="stock-value">${params.stock}</span>
                <input type="text" class="edit-stock" value="${params.stock}" style="display: none;">
            </td> 
            <td>
                <span class="buttons normal">
                    <button onClick="editTool(${params.id})">
                        <i class="fi fi-br-pencil"></i>
                    </button>
                    <button onClick="deleteTool(${params.id})">
                        <i class="fi fi-br-trash"></i>
                    </button>
                </span>
                <span class="buttons edit" style="display: none;">
                    <button onClick="cancelToolEdit(${params.id})">
                        <i class="fi fi-br-cross"></i>
                    </button>
                    <button onClick="confirmEditTool(${params.id})">
                        <i class="fi fi-br-check"></i>
                    </button>
                </span>
            </td>
        </tr>
    `)
}

const tbody = document.getElementById("tbodyHerramientas")

const mapData = (data) => {
    tbody.innerHTML = ''
    data.forEach(item => {
        const itemHtml = generateItem(item);
        tbody.insertAdjacentHTML('beforeend', itemHtml)
    })
}

const getData = () => {
    const options = {
        method: 'GET'
    }
    fetch(`${url}tools`, options)
        .then(response => {
            return response.json()
        })
        .then(data => {
            actualyData = data
            sessionStorage.setItem('toolsData', JSON.stringify(data))
            mapData(data)
        })
        .catch(err => {
            throw new Error('Surgió un error: ', err)
        });
}

document.getElementById('addToolForm').addEventListener('submit', event => {
    event.preventDefault()

    const name = document.querySelector('#addToolForm [name = "newToolName"]').value
    const stock = document.querySelector('#addToolForm [name = "newToolStock"]').value

    if (name.value === '' !== stock.value === '') {
        alert('Complete los campos para continuar')
        return
    }

    const data = { name, stock }
    const options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }

    document.querySelector('#addToolForm [name = "newToolName"]').value = ''
    document.querySelector('#addToolForm [name = "newToolStock"]').value = ''

    fetch(`${url}tools`, options)
        .then(response => {
            if (response.status === 200) {
                getData()
            }
        })
        .catch(err => {
            throw new Error('Surgió un error: ', err)
        });
})

const deleteTool = (id) => {
    const options = { method: 'DELETE' }
    fetch(`${url}tools/${id}`, options)
        .then(response => {
            if (response.status === 200) {
                getData()
            }
        })
        .catch(err => {
            throw new Error('Surgió un error: ', err)
        });
}

const editTool = id => {
    document.querySelector(`#tool_${id} .name`).style.display = 'none';
    document.querySelector(`#tool_${id} .stock-value`).style.display = 'none';
    document.querySelector(`#tool_${id} .buttons.normal`).style.display = 'none';

    document.querySelector(`#tool_${id} .edit-name`).style.display = 'inline-block';
    document.querySelector(`#tool_${id} .edit-stock`).style.display = 'inline-block';
    document.querySelector(`#tool_${id} .buttons.edit`).style.display = 'inline-block';
}

const cancelToolEdit = id => {
    document.querySelector(`#tool_${id} .name`).style.display = 'inline-block';
    document.querySelector(`#tool_${id} .stock-value`).style.display = 'inline-block';
    document.querySelector(`#tool_${id} .buttons.normal`).style.display = 'flex';

    document.querySelector(`#tool_${id} .edit-name`).style.display = 'none';
    document.querySelector(`#tool_${id} .edit-stock`).style.display = 'none';
    document.querySelector(`#tool_${id} .buttons.edit`).style.display = 'none';
}

const confirmEditTool = id => {
    const name = document.querySelector(`#tool_${id} .edit-name`).value
    const stock = document.querySelector(`#tool_${id} .edit-stock`).value

    const data = { name, stock }
    const options = { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }

    fetch(`${url}tools/${id}`, options)
        .then(response => {
            if (response.status === 200) {
                getData()
            }
        })
        .catch(err => {
            throw new Error('Surgió un error: ', err)
        });

    cancelToolEdit(id)
}

const fetchTool = async (id) => {
    const options = { method: 'GET' }
    try {
        const response = await fetch(`${url}tools/${id}`, options)
        const data = await response.json()
        return data[0]
    }
    catch (err) { throw new Error(err) }
}

const validateNumber = event => {
    if (event) {
        const inputValue = event.target.value;

        if (!/^[0-9]+$/.test(inputValue)) {
            event.target.value = inputValue.replace(/[^0-9]/g, '')
        }
    }
}

const option = body => {
    if (body) {
        return (`
            <div class="search_option flex" id="search_${body.id}" onclick="addToolForRetiro(${body.id})">
                <span>${body.name}</span>
                <span>${body.stock}</span>
            </div>
        `)
    }
}

const searchOptions = param => {
    const container = document.getElementById('search_options');
    if (param === '') return container.innerHTML = ''

    const newData = actualyData.filter(item => item.name.toUpperCase().includes(param.toUpperCase()))

    if (!newData) return `<div class="search_option flex"><span>No se encontraron herramientas</span></div>`

    container.innerHTML = ''

    newData.forEach(tool => container.insertAdjacentHTML('beforeend', option(tool)))
}

const addToolForRetiro = async (id) => {
    if (!toolsSelected.find(item => item.id === id)) {
        const body = await fetchTool(id)
        toolsSelected = [...toolsSelected, { id: body.id, name: body.name, stock: body.stock, value: 0 }]
        return mapRetiro()
    } else {
        toolsSelected = toolsSelected.filter(item => id !== item.id)
        return mapRetiro()
    }
}

const mapRetiro = () => {
    const container = document.getElementById('container_retiro')
    container.innerHTML = ''

    toolsSelected.map(body => {
        const newObject = (`
            <div class="item flex">
                <label for="toolMount_${body.id}" >${body.name}</label>
                <input type="text" class="input" name="toolMount_${body.id}" id="toolMount_${body.id}" value={${body.value}}>
                <button type="button" onClick="deleteToolSelected(${body.id})"><i class="fi fi-br-cross"></i></button>
            </div>
            `)
        container.insertAdjacentHTML('beforeend', newObject)
    })

}

const generateRetiro = () => {
    return (`
    <div class="containerInsidePopUp flex">
        <div class="search_container">
            <div class="search_field">
                <input type="text" class="input" id="searchForRetiro" placeholder="Buscar..." autocomplete="off">
                <i class="fi fi-br-search"></i>
            </div>
            <div class="flex" id="search_options"></div>
        </div>
        <div class="flex" id="container_retiro"></div>
    </div>
    <div class="containerButtons flex">
        <button type="reset" onclick="closePopUp()" class="btn-popUp red">
            Cancelar
        </button>
        <button type="submit" class="btn-popUp">
            Agregar
        </button>
    </div>
    `)
}

const deleteToolSelected = id => { toolSelected = toolSelected.filter(item => item.id !== id); mapRetiro() }

const openPopUp = (type) => {
    popUp.classList.add('active')
    if (type === 'retiro') {
        popUpTitle.innerHTML = 'Retiro de herramientas'
        popUpInside.insertAdjacentHTML('beforeend', generateRetiro())
        const search = document.getElementById('searchForRetiro')

        if (!search) return

        search.addEventListener('input', e => searchOptions(e.target.value))

        return
    }
}

const closePopUp = () => {
    popUp.classList.remove('active')
    popUpInside.innerHTML = ''
}

document.addEventListener('DOMContentLoaded', () => {
    const inputElements = document.querySelectorAll('input')
    inputElements.forEach((input) => { if (input.type === 'number') { input.addEventListener('input', validateNumber) } })

    const storedData = sessionStorage.getItem('toolsData')

    if (storedData) {
        actualyData = JSON.parse(storedData)
        mapData(actualyData)
    } else {
        getData()
    }
})