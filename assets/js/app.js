// Variaveis globais
let indexUrl = "file:///C:/Users/DOMINGOS%20NKULA%20PEDRO/Desktop/repo/contact_page/index.html";




let contactList = []

// F: serve para pegar os dados iniciais presentes no armazenamento local

const init = () => {

	contactList = JSON.parse(localStorage.getItem('contact-list')) || []

}

init()

// F: serve para filtrar os contatos por `nome e número`

const filterContact = (query) => {

	const user = contactList.filter((user) => {

		if (query == user.tel) {
			return user;
		}

		if (typeof query != 'number') {

			if (user.name.toLowerCase().search(query.toLowerCase()) >= 0) {
				return user;
			}
		}
	})


	return user;
}

const filterContactById = (id) => {

	const user = contactList.filter((user) => {

		if (id == user.id) {
			return user;
		}
	})


	return user;
}

// F: serve para adicionar contatos na lista telefónica

const addContact = (userContact) => {

	const user = {
		id: userContact.id || Math.random(),
		name: userContact.name,
		cod: userContact.cod,
		tel: userContact.tel,
		img: userContact.img
	}

	contactList = [...contactList, user]

	// Gravar no armazenamento local a lista atualizada

	saveDateInLocalStorage(contactList)
}

// F: serve para eliminar contacto na lista telefónica

const deleteContact = (id) => {

	const newList = contactList.filter((user) => {

		/* 
		Se não for igual ao `id` que estamos a procura, 
		então retorne este usuario para a lista dos que
		não serão eliminados.
		*/

		if (user.id != id) {
			return user;
		}

	})

	contactList = newList

	// Salvando no armazenamento local

	saveDateInLocalStorage(contactList)
}

// F: serve para editar um contato na lista telefónica

const updateContact = (id, newData) => {

	// Localizar o usuario a ser eliminado por `id`

	const user = contactList.filter((user) => {
		return user.id == id;
	})

	// Reorganizando os dados antigos e inserir os novos dados

	const data = {
		id: user[0].id,
		name: user[0].name,
		tel: user[0].tel,
		cod: user[0].cod,
		img: user[0].img,

		...newData
	}

	// Eliminar o seu registo antigo

	deleteContact(id)

	// Inserir novamente o registo, mas com os novos dados atualizados. Sem alterar o id.

	addContact(data)

	// Salvando as alterações no armazenamento local

	saveDateInLocalStorage(contactList)
}


// F: serve para salvar os dados atualizados no armazenamento local

const saveDateInLocalStorage = (data) => {

	localStorage.setItem('contact-list', JSON.stringify(data))

}


// HTML 


function addNewContact(event){
	event.preventDefault();

	const formData = document.querySelectorAll('.contact-input')

	const userData = {
		name:formData[0].value,
		cod: formData[1].value,
		tel: formData[2].value,
		img: formData[3].value,
	}

	addContact(userData)

	formData[0].value = ""
	formData[1].value = ""
	formData[2].value = ""
	formData[3].value = ""

	window.location = `${indexUrl}`
}

function contactGetDataUser(event){

	const urlSearch = new URLSearchParams(window.location.search)

	const idUser = urlSearch.get('id')

	const userEdit = filterContactById(idUser)

	const formData = document.querySelectorAll('.contact-input')

	formData[0].value = userEdit[0].name
	formData[1].value = userEdit[0].cod
	formData[2].value = userEdit[0].tel
	formData[3].value = userEdit[0].img
}

function editContact(event){
	event.preventDefault();

	const urlSearch = new URLSearchParams(window.location.search)

	const idUser = urlSearch.get('id')

	const formData = document.querySelectorAll('.contact-input')

	const userData = {
		name:formData[0].value,
		cod: formData[1].value,
		tel: formData[2].value,
		img: formData[3].value,
	}

	updateContact(idUser, userData)

	window.location = `${indexUrl}`
}




function deleteContactInStorage(event){

	const id = event.target.getAttribute('data-id-delete')

	if(id.length == 0) return false;

	deleteContact(id)

	getAllUsers()
}

function getAllUsers(){


	let tagAllGroups  = document.querySelector('.all-groups')

	tagAllGroups.innerHTML = "";

	const localUsers = JSON.parse(localStorage.getItem('contact-list')) || [];

	if(localUsers.length == 0){

		tagAllGroups.innerHTML = "<p class='none'>Lista vazia</p>"
		return false;

	}

	localUsers.forEach(user => {

		tagAllGroups.innerHTML += `

			<div class="group" data-id="${user.id}">
              <span class="item">A</span>
              <div class="contacts item">
                <img src="${user.img}" alt="${user.name}" />
                <div class="contacts-details">
                  <strong>${user.name}</strong>
                  <p>(${user.cod}) ${user.tel}</p>
                </div>
              </div>
            </div>

		`

	})


	const allGroup = document.querySelectorAll('.group')

	allGroup.forEach(group => {

		group.onclick = (event) => {
			
			const classGroup = event.target

			// true
			const status = classGroup.classList.toggle('selected')

			if(status){
				document.querySelectorAll('.selected').forEach(element => {element.classList.remove('selected')})
			}

			// Elemento foi obrigatoriamente selecionado

			classGroup.classList.add('selected')
			const id = classGroup.getAttribute('data-id')

			document.querySelector('[data-id-delete]').setAttribute('data-id-delete', id)


			const link = document.querySelector('[data-id-edit]')
			const linkValue = link.getAttribute('href')

			if(linkValue.includes('?')){

				const posParam = linkValue.indexOf('?')
				const resetLink = linkValue.slice(0, posParam)

				link.setAttribute('href', `${resetLink}?id=${id}`)
				return false;

			}

			link.setAttribute('href', `${linkValue}?id=${id}`)
		
		}

	})
}

function getUserSearch(usersFind){

	let tagAllGroups  = document.querySelector('.all-groups')

	tagAllGroups.innerHTML = "";

		usersFind.forEach(user => {

		tagAllGroups.innerHTML += `

			<div class="group" data-id="${user.id}">
              <span class="item">A</span>
              <div class="contacts item">
                <img src="${user.img}" alt="${user.name}" />
                <div class="contacts-details">
                  <strong>${user.name}</strong>
                  <p>(${user.cod}) ${user.tel}</p>
                </div>
              </div>
            </div>

		`

	})


	const allGroup = document.querySelectorAll('.group')

	allGroup.forEach(group => {

		group.onclick = (event) => {
			
			const classGroup = event.target

			// true
			const status = classGroup.classList.toggle('selected')

			if(status){
				document.querySelectorAll('.selected').forEach(element => {element.classList.remove('selected')})
			}

			// Elemento foi obrigatoriamente selecionado

			classGroup.classList.add('selected')
			const id = classGroup.getAttribute('data-id')

			document.querySelector('[data-id-delete]').setAttribute('data-id-delete', id)


			const link = document.querySelector('[data-id-edit]')
			const linkValue = link.getAttribute('href')

			if(linkValue.includes('?')){

				const posParam = linkValue.indexOf('?')
				const resetLink = linkValue.slice(0, posParam)

				link.setAttribute('href', `${resetLink}?id=${id}`)
				return false;

			}

			link.setAttribute('href', `${linkValue}?id=${id}`)
		
		}

	})

}


function searchContact(event){

	const query = event.target.value;

	const user = filterContact(query);

	getUserSearch(user)


}