const url = 'http://localhost:5000/'

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

const validateNumber = event => {
    if (event) {
        const inputValue = event.target.value;

        if (!/^[0-9]+$/.test(inputValue)) {
            event.target.value = inputValue.replace(/[^0-9]/g, '')
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inputElements = document.querySelectorAll('input')
    inputElements.forEach((input) => { if (input.type === 'number') { input.addEventListener('input', validateNumber) } })

    getData()
})

const openPopUp = (type) => {
    popUp.classList.add('active')
    if (type === 'retiro') {
        popUpTitle.innerHTML = 'Retiro de herramientas'
        return
    }
}

const closePopUp = () => {
    popUp.classList.remove('active')
    popUpInside.innerHTML = ''
}