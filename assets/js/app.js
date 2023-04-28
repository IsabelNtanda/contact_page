// Variaveis globais
let indexUrl = "/";
let contactList = []

// F: serve para pegar os dados iniciais presentes no armazenamento local
export const init = () => { contactList = JSON.parse(localStorage.getItem('contact-list')) || [] }
init()

// F: serve para filtrar os contatos por `nome e número`
export const filterContact = (query) => {
	const user = contactList.filter((user) => {

		if (query == user.tel){ return user };

		if (typeof query != 'number') {
			if (user.name.toLowerCase().search(query.trim().toLowerCase()) >= 0) { return user;}
		}
	})
	return user;
}

export const filterContactById = (id) => {
	const user = contactList.filter((user) => {
		if (id == user.id) { return user; }
	})

	return user;
}

// F: serve para adicionar contatos na lista telefónica
export const addContact = (userContact) => {
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
export const deleteContact = (id) => {
	const newList = contactList.filter((user) => {
		if (user.id != id) {return user;}
	})

	contactList = newList

	// Salvando no armazenamento local
	saveDateInLocalStorage(contactList)
}

// F: serve para editar um contato na lista telefónica
export const updateContact = (id, newData) => {
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
export const saveDateInLocalStorage = (data) => {localStorage.setItem('contact-list', JSON.stringify(data))}