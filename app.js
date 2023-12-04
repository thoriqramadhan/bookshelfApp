const storageKey = 'KEY_BOOK'
const uncompleteKey = 'UNCO_KEY'
const completedKey = 'COMP_KEY'

window.addEventListener('load',()=>{
    checker()
})
if(typeof Storage !== null){
    document.addEventListener('DOMContentLoaded',()=>{
        const form = document.getElementById('form')
        form.addEventListener('submit',(e)=>{
            e.preventDefault()
            addBooks()
            checker()
        })
    })
}else{
    alert('Your Browser didnt support LocalStorage!')
}

// adding data to localStorage first
function addBooks(){
    let dataStorage = []
    if(localStorage.getItem(storageKey) !== null){
        dataStorage = JSON.parse(localStorage.getItem(storageKey))
    }
    const inputTitle = document.getElementById('title').value
    const inputAuthor = document.getElementById('author').value
    const inputPublishAt = parseInt(document.getElementById('publish_at').value)
    const doneReading = document.getElementById('doneReading').checked
    const id = +new Date

    const booksData = {
        id:id,
        title:inputTitle,
        author:inputAuthor,
        publish:inputPublishAt,
        isComplete: false
    }

    for(const datas of dataStorage){
        if(datas.title.toUpperCase() == booksData.title.toUpperCase()){
            alert("You can't add same title!")
            return 
        }
    }
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('publish_at').value = ''
    document.getElementById('doneReading').checked = false

    if(doneReading == true){
        booksData.isComplete = true
    }

    dataStorage.push(booksData)

    localStorage.setItem(storageKey,JSON.stringify(dataStorage))
}
function getData(){
    return JSON.parse(localStorage.getItem(storageKey))
}

function makeTodo(object){
    const card = document.createElement('div')
    const textContainer = document.createElement('div')

    const bookTitle = document.createElement('h2')
    bookTitle.classList.add('title')
    const bookAuthorContain = document.createElement('p')
    bookAuthorContain.classList.add('author')
    const publishedAtContain = document.createElement('p')
    publishedAtContain.classList.add('publish')

    const status = document.createElement('span')
    const bookAuthor = document.createElement('span')
    const publishAt = document.createElement('span')

    card.classList.add('card')
    textContainer.classList.add('textContainer')

    bookAuthor.classList.add('authorList')
    bookAuthor.innerText = object.author
    bookAuthorContain.innerText = 'Author : '
    bookAuthorContain.appendChild(bookAuthor)

    publishAt.classList.add('publishAt')
    publishAt.innerText = object.publish
    publishedAtContain.innerText = 'Published At : '
    publishedAtContain.appendChild(publishAt)


    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete','btn')
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener('click',()=>{
        deleteBook(object.id)
    })

    if (object.isComplete === false) {
        status.classList.add('processStatus', 'status')
        status.innerText = 'Process'
        bookTitle.innerText = object.title
        bookTitle.appendChild(status)

        const doneButton = document.createElement('button')
        doneButton.innerText = 'Done'
        doneButton.classList.add('done','btn')
        doneButton.addEventListener('click',()=>{
            finishBook(object.id)
        })

        const editButton = document.createElement('button')
        editButton.innerText = 'Edit'
        editButton.classList.add('btn','edit')
        editButton.addEventListener('click',()=>{
            editBook(object.id)
        })

        buttonContainer.append(doneButton,editButton,deleteButton)
    } else {
        status.classList.add('finishedStatus', 'status')
        status.innerText = 'Finished'
        bookTitle.innerText = object.title
        bookTitle.appendChild(status)

        const redoButton = document.createElement('button')
        redoButton.innerText = 'Redo'
        redoButton.classList.add('redo', 'btn')
        redoButton.addEventListener('click',()=>{
            redoBook(object.id)
        })
        buttonContainer.append(redoButton,deleteButton)
    }
    textContainer.append(bookTitle, bookAuthorContain, publishedAtContain)
    card.append(textContainer,buttonContainer)

    return card
}

function checker(){
    countUncomplete()
    countcompleted()
    if(localStorage.getItem(storageKey) !== null){
        const bookStrg = getData()
        const uncompleteList = document.querySelector('.uncomplete-list')
        uncompleteList.innerHTML = ''

        const finishedList = document.querySelector('.complete-list')
        finishedList.innerHTML = ''

        for (const object of bookStrg) {
            let element = makeTodo(object)
            if (object.isComplete == false) {
                uncompleteList.appendChild(element)
            } else {
                finishedList.appendChild(element)
            }
        }
    }
    else{
        return 
    }
}

function findIdObject(id){
    const bookData = getData()
    for(const bookObject of bookData){
        if(bookObject.id === id){
            return bookObject
        }
    }
}


function finishBook(id){
    const bookArray = getData()

    for(const bookObject of bookArray){
        if(bookObject.id === id){
            bookObject.isComplete = true
            localStorage.setItem(storageKey,JSON.stringify(bookArray))
        }
    }
    checker()
}
function redoBook(id){
    const bookArray = getData()
    for (const bookObject of bookArray) {
        if (bookObject.id === id) {
            bookObject.isComplete = false
            localStorage.setItem(storageKey, JSON.stringify(bookArray))
        }
    }
    checker()
}
function deleteBook(id){
    const bookArray = getData()
    const indexNo = findIndex(id)

    bookArray.splice(indexNo,1)
    localStorage.setItem(storageKey,JSON.stringify(bookArray))
    checker()
}
function findIndex(id){
    const bookArray = getData()

    for(const index in bookArray){
        if(bookArray[index].id === id){
            return index
        }
    }
}
function editBook(id){
    const outerModal = document.querySelector('.editModal')
    outerModal.classList.toggle('hideModal')
    const closeButton = document.querySelector('.closeBtn')

    closeButton.addEventListener('click', () => {
        outerModal.classList.add('hideModal')
        clearInput()
    })
    const editForm = document.querySelector('.editForm')
    editForm.addEventListener('submit', (e) => {
        e.preventDefault()
        outerModal.classList.add('hideModal')
        editCard(id)
    })

}

function clearInput(){
    document.getElementById('editTitle').value = ''
    document.getElementById('editAuthor').value = ''
    document.getElementById('editPublish').value = ''
}

function editCard(id){
    const editForm = document.querySelector('.editForm')

    const newTitle = editForm['editTitle'].value
    const newAuthor = editForm['editAuthor'].value
    const newPublish = parseInt(editForm['editPublish'].value) 
    console.log(typeof newPublish)

    const bookArray = getData()

    for(const newObject of bookArray){
        if(newObject.id === id){
            newObject.title = newTitle
            newObject.author = newAuthor
            newObject.publish = newPublish
            localStorage.setItem(storageKey, JSON.stringify(bookArray))
            checker()
            return
        }
    }

}

function countUncomplete(){
    const bookArray = getData()
    const uncompleteCount = document.querySelector('.uncompleteCount')

    let count = 0
    localStorage.setItem(uncompleteKey, JSON.stringify(count))

    if(localStorage.getItem(uncompleteKey) !== null){
        count = JSON.parse(localStorage.getItem(uncompleteKey))
        for (const i of bookArray) {
            if (i.isComplete === false) {
                ++count
            }
        }
    }
    if(localStorage.getItem(storageKey) == null){
        count = 0
    }
    uncompleteCount.innerText = `Total : ${count}`
    localStorage.setItem(uncompleteKey,JSON.stringify(count))
}
function countcompleted() {
    const bookArray = getData()
    const completedCount = document.querySelector('.completedCount')

    let count = 0
    localStorage.setItem(completedKey, JSON.stringify(count))

    if (localStorage.getItem(completedKey) !== null) {
        count = JSON.parse(localStorage.getItem(completedKey))
        for (const i of bookArray) {
            if (i.isComplete === true) {
                ++count
            }
        }
    }
    if (localStorage.getItem(storageKey) == null) {
        count = 0
    }
    completedCount.innerText = `Total : ${count}`
    localStorage.setItem(completedKey, JSON.stringify(count))
}

function search(){
    const searchContainer = document.querySelector('.searchlist')
    searchContainer.innerHTML = ''
    let data = getData()
    let input = document.getElementById('search')
    let filter = input.value.toUpperCase()

    for(let datas of data){
        if(datas.title.toUpperCase() == filter){
            console.log(datas)
            let element = makeFromSearch(datas)
            searchContainer.appendChild(element)
            return 
        }
    }
}

function makeFromSearch(object){
    const card = document.createElement('div')
    const textContainer = document.createElement('div')

    const bookTitle = document.createElement('h2')
    bookTitle.classList.add('title')
    const bookAuthorContain = document.createElement('p')
    bookAuthorContain.classList.add('author')
    const publishedAtContain = document.createElement('p')
    publishedAtContain.classList.add('publish')

    const status = document.createElement('span')
    const bookAuthor = document.createElement('span')
    const publishAt = document.createElement('span')

    card.classList.add('card')
    textContainer.classList.add('textContainer')

    bookAuthor.classList.add('authorList')
    bookAuthor.innerText = object.author
    bookAuthorContain.innerText = 'Author : '
    bookAuthorContain.appendChild(bookAuthor)

    publishAt.classList.add('publishAt')
    publishAt.innerText = object.publish
    publishedAtContain.innerText = 'Published At : '
    publishedAtContain.appendChild(publishAt)

    if (object.isComplete === false) {
        status.classList.add('processStatus', 'status')
        status.innerText = 'Process'
        bookTitle.innerText = object.title
        bookTitle.appendChild(status)
    } else {
        status.classList.add('finishedStatus', 'status')
        status.innerText = 'Finished'
        bookTitle.innerText = object.title
        bookTitle.appendChild(status)
    }

    textContainer.append(bookTitle,bookAuthorContain,publishedAtContain)
    card.append(textContainer)
    return card
}