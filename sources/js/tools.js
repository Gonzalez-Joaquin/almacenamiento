const url = 'http://localhost:5000/'

const buttons = document.querySelectorAll('.subroute')
const articles = document.querySelectorAll('.article')

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
        <tr>
            <td>
                <span>${params.name}</span>
            </td> 
            <td class="stock">
                <span>${params.stock}</span>
            </td> 
            <td>
                <span class="buttons">
                    <button onClick="deleteTool(${params.id})">
                        <i class="fi fi-br-trash"></i>
                    </button>
                    <button>
                        <i class="fi fi-br-pencil"></i>
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

    const name = document.querySelector('#addToolForm [name = "newToolName"]').value;
    const stock = document.querySelector('#addToolForm [name = "newToolStock"]').value;

    if (name.value === '' !== stock.value === '') {
        alert('Complete los campos para continuar')
        return
    }

    const data = { name, stock }
    const options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }

    document.querySelector('#addToolForm [name = "newToolName"]').value = '';
    document.querySelector('#addToolForm [name = "newToolStock"]').value = '';

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

document.addEventListener('DOMContentLoaded', () => {
    getData()
})

const deleteTool = (id) => {
    const options = {
        method: 'DELETE'
    }

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