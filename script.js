// Deklarerar variabler
const form = document.querySelector('#todoForm');
const input = document.querySelector('#todoInput');
const output = document.querySelector('#output');
const error = document.querySelector('.error');

// Array som håller flera Todo
let todos = [];

// En funktion som hämtar JSON objekt från JSONplaceholder
const fetchTodos = () => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
    .then(res => res.json())
    .then(data => {
        todos = data;
        listTodos();
    })
}
fetchTodos();

// Arrowfunction som skapar HTMLelement
const newTodo = (todo) => {

    let card = document.createElement('div');
    card.classList.add('card', 'p-3', 'my-3', 'todo');
// Skapar ett id i syfte för deleteknappen
    card.setAttribute('id', `${todo.id}`);
// Kollar om Todon är completed (ändrar styling i css)
    if(todo.completed) {
        card.classList.add('complete');
    } else {
        card.classList.remove('complete');
    }

    let innerCard = document.createElement('div');
    innerCard.classList.add('d-flex', 'justify-content-between', 'align-items-center');

// Box håller title och checkknappen
    let box = document.createElement('div');
    box.classList.add('d-flex', 'align-items-center');

    let btnCheck = document.createElement('button');
    btnCheck.classList.add('btn', 'btnCheck');
    btnCheck.innerText = 'Check';
// Om Todo är sant så läggs en ny klass till som ändrar färg på knappen
    if(todo.completed) {
        btnCheck.classList.add('btnComplete');
    } else {
        btnCheck.classList.remove('btnComplete');
    }
// Eventlistener ändrar värdet på todo.completed
    btnCheck.addEventListener('click', () => {
        if(todo.completed) {
            todo.completed = false
        } else {
            todo.completed = true
        }
// Skriver ut arrayen på nytt för att visuellt visa förändringar (mitt problem, glömmer lista om!)
        listTodos();
    })

    let title = document.createElement('h3');
    title.classList.add('title');
    title.innerText = todo.title;

    let btnDelete = document.createElement('button');
    btnDelete.classList.add('btnDelete', 'displayNone');
    btnDelete.innerText = 'X';
// Tar bort deleteknappen när ett objekt är falskt och lägger till när ett objekt är sant
    if(todo.completed) {
        btnDelete.classList.remove('displayNone');
    } else {
        btnDelete.classList.add('displayNone');
    }
// Eventlistener som gör att man tar bort en Todo som jag klickar på
    btnDelete.addEventListener('click', (e) => {
        todos = todos.filter(todo => todo.id != e.target.parentNode.parentNode.id);
        listTodos();
    })

// Sätter struktur på elementen som skapats
    box.appendChild(btnCheck);
    box.appendChild(title);
    innerCard.appendChild(box);
    innerCard.appendChild(btnDelete);
    card.appendChild(innerCard);
    output.appendChild(card);
}

// Arrayen är fylld med JSONobjekt som inte syns. Därför tas arrayen och körs i en forEach(loop) och skriver ut varje objekt(en Todo)
// Skriver ut hela listan (Todos) på sidan
const listTodos = () => {
    output.innerHTML = '';
    todos.forEach(todo => {
        newTodo(todo);
    })
}

// Arrowfunction som visar hur ett nytt objekt ska se ut
const createTodo = (title) => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            title,
            completed: false
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
// Lägger till ett nytt objekt överst i listan
        todos.unshift(data);
// Skriva ut listan igen för att det nya objektet ska bli synligt
        listTodos();
    })

}

// Validering
const validate = () => {
    if(input.value === '') {
        error.innerText = ('You have to write something..');
        input.classList.add('is-invalid');
    } else {
        error.innerText = '';
        input.classList.remove('is-invalid');
        return true
    }
}


// Eventlistener som lyssnar efter Submit
form.addEventListener('submit', e => {
    e.preventDefault();
// Om valideringen är sann, skapas en ny Todo
    if(validate()) {
        createTodo(input.value);
        input.value = '';
    }

})