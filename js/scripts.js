document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault()

    const email = document.querySelector('#loginForm [name = "user_name_login"]').value;
    const password = document.querySelector('#loginForm [name = "password_login"]').value;

    if (email.value === '' !== password.value === '') {
        alert('Complete los campos para continuar')
        return
    }

    loginWithEmailAndPassword(email, password)

    document.querySelector('#loginForm [name = "user_name_login"]').value = '';
    document.querySelector('#loginForm [name = "password_login"]').value = '';
})

const loginWithEmailAndPassword = async (email, password) => {
    
}