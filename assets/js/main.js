// Importando funções de outro arquivo
import functionInitial, { filterContact, filterContactById, addContact, deleteContact, updateContact } from './app.js';
let indexUrl = "/";

functionInitial

window.addNewContact = (event) => {
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

window.contactGetDataUser = (event) => {
	const urlSearch = new URLSearchParams(window.location.search);
	const idUser = urlSearch.get('id');
	const userEdit = filterContactById(idUser);
	const formData = document.querySelectorAll('.contact-input');

	formData[0].value = userEdit[0].name
	formData[1].value = userEdit[0].cod
	formData[2].value = userEdit[0].tel
	formData[3].value = userEdit[0].img
}

window.editContact = (event) =>{
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

window.deleteContactInStorage = (event) => {
	const id = event.target.getAttribute('data-id-delete')

	if(id.length == 0) return false;

	deleteContact(id)
	getAllUsers()
}

window.getAllUsers = () => {
	const localUsers = JSON.parse(localStorage.getItem('contact-list')) || [];

	// Enviando os dados do usuario para serem apresentados no HTML
	renderHTML(localUsers)
	selectContact()
}

window.getUserSearch = (usersFind) => {
	renderHTML(usersFind);
	selectContact()
}

window.searchContact = (event) => {
	const query = event.target.value;
	const user = filterContact(query);

	getUserSearch(user)
}

function renderHTML(users){

	let tagAllGroups  = document.querySelector('.all-groups');
	tagAllGroups.innerHTML = "";

	if(users.length == 0){
		tagAllGroups.innerHTML = "<p class='none'>Lista vazia</p>"
		return false;
	}

	users.sort((a, b) => {
		return a.name > b.name ? 1 : -1;
	})

	users.forEach(user => {
		let firstLetter = user.name.charAt(0).toUpperCase();

		const ifExistLetter = document.querySelector(`[data-first-letter="${firstLetter}"]`)
		
		if(ifExistLetter){ firstLetter = "repeate";}

		tagAllGroups.innerHTML += `
			<div data-first-letter="${firstLetter}" class="group" data-id="${user.id}">
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
}

function selectContact(){
	const allGroup = document.querySelectorAll('.group')

	allGroup.forEach(group => {
		group.onclick = (event) => {
			
			const classGroup = event.target
			const status = classGroup.classList.toggle('selected')

			if(status){
				document.querySelectorAll('.selected').forEach(element => {element.classList.remove('selected')})
			}

			// Elemento foi obrigatoriamente selecionado
			classGroup.classList.add('selected')

			// Habilitando os botons de editar e eliminar porque o usuario já foi selecionado
			document.querySelectorAll('.link-disable').forEach(link => {
				link.classList.remove('link-disable')
			})

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