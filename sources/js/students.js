const url = 'http://localhost:5000/'

const buttons = document.querySelectorAll('.subroute')
const articles = document.querySelectorAll('.article')
const tbody = document.getElementById('tboodyStudents')

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
                <span>${params.surname}</span> 
            </td>
            <td> 
                <span>${params.document}</span> 
            </td> 
            <td>
                <span>${params.course}°${params.division}</span>
            </td> 
            <td>
                <span>${params.workshop_group}</span>
            </td> 
            <td>
                <span>${params.cooperator}</span>
            </td> 
            <td>
                <span>${params.cooperator_receipt}</span>
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

const handleChangeCheckbox = () => document.querySelector('.receipt-input').classList.toggle('active')

const validateNumber = event => {
    if (event) {
        const inputValue = event.target.value;

        if (!/^[0-9]+$/.test(inputValue)) {
            event.target.value = inputValue.replace(/[^0-9]/g, '')
        }
    }
}

const getData = () => {
    const options = { method: 'GET' }

    fetch(`${url}students`, options)
        .then(response => response.json())
        .then(data => {
            mapData(data)
        })
        .catch(err => {
            throw new Error(err)
        })
}

const sendData = (data) => {
    const options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }

    fetch(`${url}students`, options)
        .then(response => {
            if (response.status === 200) {
                getData()
            }
        })
        .catch(err => {
            throw new Error('Surgió un error: ', err)
        })
}

const deleteEntry = (id) => {
    const options = { method: 'DELETE' }

    fetch(`${url}students/${id}`, options)
        .then(response => {
            if (response.status === 200) {
                getData()
            }
        })
        .catch(err => {
            throw new Error(err)
        })
}

document.getElementById('addStudentsForm').addEventListener('submit', event => {
    event.preventDefault();

    const name = document.querySelector('#addStudentsForm [name="newStudentName"]').value
    const surname = document.querySelector('#addStudentsForm [name="newStudentSurname"]').value
    const doc = document.querySelector('#addStudentsForm [name="newStudentDocs"]').value
    const course = document.querySelector('#addStudentsForm [name="newStudentCourse"]').value
    const division = document.querySelector('#addStudentsForm [name="newStudentDivision"]').value
    const workshop_group = document.querySelector('#addStudentsForm [name="newStudentGroup"]').value
    const school_year = document.querySelector('#addStudentsForm [name="newStudentCicle"]').value
    const cooperator = document.querySelector('#addStudentsForm [name="newStudentCooperator"]')
    const cooperator_receipt = document.querySelector('#addStudentsForm [name="newStudentReceipt"]').value

    if (!name || !surname || !doc || !course || !division || !workshop_group || !school_year) return alert('Complete los campos para continuar')

    if (cooperator.checked) {
        if (!cooperator_receipt) return alert('Complete el recibo para continuar')

        const data = { name, surname, document: doc, course, division, workshop_group, school_year, cooperator: true, cooperator_receipt }

        return sendData(data)
    }

    const data = { name, surname, document: doc, course, division, workshop_group, school_year, cooperator: false, cooperator_receipt: 0 }

    return sendData(data)
})

const openEdit = () => {
    const editContainer = document.getElementById('editEntry')
}

document.addEventListener('DOMContentLoaded', () => {
    const inputElements = document.querySelectorAll('input')
    inputElements.forEach((input) => { if (input.type === 'number') { input.addEventListener('input', validateNumber) } })

    getData()
})