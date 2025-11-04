import { useState } from 'react'

function AuthPage() {
    let token = localStorage.getItem('token')

    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);

    const [registerBtn, setRegisterBtn] = useState('Sign up')
    const [headerTxt, setHeaderTxt] = useState('Log In')
    const [registerQuestionTxt, setRegisterQuestionTxt] = useState('Don\'t have an account?')
    const [authBtn, setAuthBtn] = useState('Submit')

    let selectedTab = 'All'
    let todos = []

    const apiBase = '/api/'

    // elements
    const nav = document.querySelector('nav')
    const header = document.querySelector('header')
    const main = document.querySelector('main')
    const navElements = document.querySelectorAll('.tab-button')
    const authContent = document.getElementById('auth')
    const textError = document.getElementById('error')
    const email = document.getElementById('emailInput')
    const password = document.getElementById('passwordInput')
    const addTodoBtn = document.getElementById('addTodoBtn')
    // const deleteBtn = document.getElementById('')
    // const updateBtn = 

    // PAGE RENDERING LOGIC
    async function showDashboard() {
        nav.style.display = 'block'
        header.style.display = 'flex'
        main.style.display = 'flex'
        authContent.style.display = 'none'

        await fetchTodos()
    }

    function updateHeaderText() {
        const todosLength = todos.length
        const newString = todos.length === 1 ?
            `You have 1 open task.` :
            `You have ${todosLength} open tasks.`
        header.querySelector('h1').innerText = newString
    }

    function updateNavCount() {
        navElements.forEach(ele => {
            const btnText = ele.innerText.split(' ')[0]

            // filter todos in here
            const count = todos.filter(val => {
                if (btnText === 'All') {
                    return true
                }
                return btnText === 'Complete' ?
                    val.completed :
                    !val.completed
            }).length

            // target inside space and update value
            ele.querySelector('span').innerText = `(${count})`
        })
    }

    function changeTab(tab) {
        selectedTab = tab
        navElements.forEach(val => {
            if (val.innerText.includes(tab)) {
                val.classList.add('selected-tab')
            } else {
                val.classList.remove('selected-tab')
            }
        })
        renderTodos()
    }

    function renderTodos() {
        // need to add filtering logic in here

        updateNavCount()
        updateHeaderText()

        let todoList = ``
        todos.filter(val => {
            return selectedTab === 'All' ? true : selectedTab === 'Complete' ? val.completed : !val.completed
        }).forEach((todo, todoIndex) => {
            const taskIndex = todo.id
            todoList += `
            <div class="card todo-item">
                <p>${todo.task}</p>
                <div class="todo-buttons">
                    <button onClick="updateTodo(${taskIndex})" ${todo.completed ? 'disabled' : ''}>
                        <h6>Done</h6>
                    </button>
                    <button onClick="deleteTodo(${taskIndex})">
                        <h6>Delete</h6>
                    </button>
                </div>
            </div>
            `
        })
        todoList += `
        <div class="input-container">
            <input id="todoInput" placeholder="Add task" />
            <button onClick="addTodo()">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
        `
        main.innerHTML = todoList
    }

    // showDashboard()

    // AUTH LOGIC

    async function toggleIsRegister() {
        setIsRegistration(prev => !prev)

        setRegisterBtn(prev => (prev === 'Sign in' ? 'Sign up' : 'Sign in'));
        setHeaderTxt(prev => (prev === 'Log In' ? 'Sign up' : 'Log In'));
        setRegisterQuestionTxt(prev => (prev === 'Don\'t have an account?' ? 'Already have an account?' : 'Don\'t have an account?'));
    }

    async function authenticate() {
        // access email and pass values
        const emailVal = email.value
        const passVal = password.value

        // guard clauses... if authenticating, return
        if (
            isLoading ||
            isAuthenticating ||
            !emailVal ||
            !passVal ||
            passVal.length < 6 ||
            !emailVal.includes('@')
        ) { return }

        // reset error and set isAuthenticating to true
        error.style.display = 'none'
        setIsAuthenticating(true)
        
        setAuthBtn('Authenticating...')

        try {
            let data
            if (isRegistration) {
                // register an account
                const response = await fetch(apiBase + 'auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: emailVal, password: passVal })
                })
                data = await response.json()
            } else {
                // login an account
                const response = await fetch(apiBase + 'auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: emailVal, password: passVal })
                })
                data = await response.json()
            }

            if (data.token) {
                token = data.token
                localStorage.setItem('token', token)

                // authenicating into loading
                setAuthBtn('Loading...')

                // fetch todos
                await fetchTodos()

                // show dashboard
                showDashboard()
            } else {
                throw Error('❌ Failed to authenticate...')
            }

        } catch (err) {
            console.log(err.message)
            error.innerText = err.message
            error.style.display = 'block'
        } finally {
            setAuthBtn('Submit')
            setIsAuthenticating(false)
        }


    }

    function logout() {
        // wipe states and clear cached token
    }

    return (
        <>
            <section id="auth">
                <div>
                    <h2 className="sign-up-text">{headerTxt}</h2>
                    <p></p>
                </div>

                <p id="error" style={{ display: 'none' }}></p>
                <input id="emailInput" placeholder="Email" />
                <input id="passwordInput" placeholder="********" type="password" />
                <button id="authBtn" onClick={() => authenticate()}>
                    {authBtn}
                </button>
                <hr />
                <div className="register-content">
                    <p>{registerQuestionTxt}</p>
                    <button onClick={() => toggleIsRegister()} id="registerBtn">{registerBtn}</button>
                </div>
            </section>
            <header style={{ display: 'none' }}>
                <h1 className="text-gradient">You have 0 open tasks.</h1>
            </header>
            <nav style={{ display: 'none' }} className="tab-container">
                <button onClick={() => changeTab('All')} className="tab-button  selected-tab">
                    <h4>All <span>(0)</span></h4>
                </button>
                <button onClick={() => changeTab('Open')} className="tab-button  ">
                    <h4>Open <span>(0)</span></h4>
                </button>
                <button onClick={() => changeTab('Complete')} className="tab-button  ">
                    <h4>Complete <span>(0)</span></h4>
                </button>
                <hr />
            </nav>

        </>
    )
}

export default AuthPage;