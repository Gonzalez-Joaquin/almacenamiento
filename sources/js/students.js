const url = 'http://localhost:5000/'
let currentStudentId = null;
const buttons = document.querySelectorAll('.subroute')
const articles = document.querySelectorAll('.article')
const tbody = document.getElementById('tboodyStudents')
const editContainer = document.getElementById('editEntry')
const containerEditEntry = document.getElementById('containerEditEntry')

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
                <span class="group">${params.workshop_group}</span>
            </td> 
            <td>
                <span>${params.cooperator === 0 ? 'No' : 'Si'}</span>
            </td> 
            <td>
                <span>${params.cooperator_receipt === 0 ? '-' : params.cooperator_receipt}</span>
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

const sendData = async (data) => {
    const options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }

    try {
        const response = await fetch(`${url}students`, options)

        if (response.status === 200) {
            getData()
        } else {
            throw new Error('La solicitud no fue exitosa')
        }
    } catch (error) {
        throw new Error('Surgió un error: ' + error.message)
    }
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

const fetchStudent = async (id) => {
    const options = { method: 'GET' }

    try {
        const response = await fetch(`${url}students/${id}`, options)
        const data = await response.json()
        return data[0]
    } catch (err) {
        throw new Error(err)
    }
}

const updateStudent = async (body) => {
    const options = { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }

    try {
        const response = await fetch(`${url}students/${currentStudentId}`, options)
        if (response.status === 200) {
            getData()
        } else {
            throw new Error('Algo falló en la operación')
        }
    }
    catch (err) { throw new Error(err) }
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

const generateEditForm = (param) => {
    return (`
        <div class="container flex">
            <div class="ctn-inputs flex">
                <div class="ctn-input">
                    <label for="editStudentName" class="label">Nombre</label>
                    <input type="text" name="editStudentName" id="editStudentName" class="input" value="${param.name}">
                </div>
                <div class="ctn-input">
                    <label for="editStudentSurname" class="label">Apellido</label>
                    <input type="text" name="editStudentSurname" id="editStudentSurname" class="input" value="${param.surname}">
                </div>
            </div>
            <div class="ctn-inputs flex">
                    <div class="ctn-input">
                        <label for="editStudentDocs" class="label">Documento</label>
                        <input type="number" name="editStudentDocs" id="editStudentDocs" onchange="validateNumber()"
                            class="input" value="${param.document}">
                    </div>
                    <div class="ctn-inputs-course flex">
                        <div class="ctn-input">
                            <label for="editStudentCourse" class="label">Curso</label>
                            <input type="number" name="editStudentCourse" id="editStudentCourse"
                                onchange="validateNumber()" class="input" value="${param.course}">
                        </div>
                        <div class="ctn-input">
                            <label for="editStudentDivision" class="label">División</label>
                            <input type="number" name="editStudentDivision" id="editStudentDivision"
                                onchange="validateNumber()" class="input" value="${param.division}">
                        </div>
                    </div>
                </div>
                <div class="ctn-inputs flex">
                    <div class="ctn-input">
                        <label for="editStudentGroup" class="label">Grupo</label>
                        <input type="text" maxlength="1" name="editStudentGroup" id="editStudentGroup" class="input" value="${param.workshop_group}">
                    </div>
                    <div class="ctn-input">
                        <label for="editStudentCicle" class="label">Ciclo</label>
                        <input type="number" name="editStudentCicle" id="editStudentCicle" onchange="validateNumber()"
                            class="input" value="${param.school_year}">
                    </div>
                </div>
                    <div class="ctn-input">
                        <label for="editStudentReceipt">Número de recibo:</label>
                        <input type="number" name="editStudentReceipt" onchange="validateNumber()"id="editStudentReceipt" value="${param.cooperator_receipt === 0 ? '' : param.cooperator_receipt}" class="input">
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
    containerEditEntry.insertAdjacentHTML('beforeend', generateEditForm(await fetchStudent(id)))
}

const closeEdit = () => {
    editContainer.classList.remove('active')
    containerEditEntry.innerHTML = ''
}

document.getElementById('editEntryForm').addEventListener('submit', event => {
    event.preventDefault()

    const receipt = document.querySelector('#editEntryForm [name="editStudentReceipt"]').value

    const data = {
        name: document.querySelector('#editEntryForm [name="editStudentName"]').value,
        surname: document.querySelector('#editEntryForm [name="editStudentSurname"]').value,
        document: document.querySelector('#editEntryForm [name="editStudentDocs"]').value,
        course: document.querySelector('#editEntryForm [name="editStudentCourse"]').value,
        division: document.querySelector('#editEntryForm [name="editStudentDivision"]').value,
        workshop_group: document.querySelector('#editEntryForm [name="editStudentGroup"]').value,
        school_year: document.querySelector('#editEntryForm [name="editStudentCicle"]').value,
        cooperator: receipt === '' || receipt === 0 ? false : true,
        cooperator_receipt: document.querySelector('#editEntryForm [name="editStudentReceipt"]').value
    }

    updateStudent(data)
    closeEdit()
})

document.addEventListener('DOMContentLoaded', () => {
    const inputElements = document.querySelectorAll('input')
    inputElements.forEach((input) => { if (input.type === 'number') { input.addEventListener('input', validateNumber) } })

    getData()
})