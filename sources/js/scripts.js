const url = 'http://localhost:5000/'

document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault()

    const username = document.querySelector('#loginForm [name = "user_name_login"]').value;
    const password = document.querySelector('#loginForm [name = "password_login"]').value;

    if (username.value === '' !== password.value === '') {
        alert('Complete los campos para continuar')
        return
    }

    loginWithUsernameAndPassword(username, password)

    document.querySelector('#loginForm [name = "user_name_login"]').value = '';
    document.querySelector('#loginForm [name = "password_login"]').value = '';
})

const loginWithUsernameAndPassword = async (username, password) => {
    const userData = { username, password }
    const options = { method: 'POST', body: JSON.stringify(userData), headers: { 'Content-Type': 'application/json' } }

    try {
        const response = await fetch(`${url}users/login`, options)
        if (response.status === 200) {
            return window.location.href = './sources/private/dashboard.html'
        } else {
            throw new Error('No se encontro el usuario.')
        }
    }
    catch (err) {
        throw new Error(err)
    }
}