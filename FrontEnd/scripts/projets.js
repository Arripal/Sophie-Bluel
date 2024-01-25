import { toggleModal } from './modal.js';

const projets = await fetch('http://localhost:5678/api/works').then((projets) =>
	projets.json()
);

export function getIdentificationToken() {
	const token = window.localStorage.getItem('token_identification');
	return token ? JSON.parse(token) : null;
}

function changeLoginLink() {
	const login_link = document.querySelector('.login-link');
	login_link.innerText = 'logout';
	login_link.href = 'index.html';
	login_link.style.fontWeight = 'bold';
	login_link.style.color = '#000000';
	return login_link;
}

export function creerProjet(projet) {
	const figure = document.createElement('figure');

	const image = document.createElement('img');
	image.src = projet.imageUrl;
	figure.appendChild(image);

	const figcaption = document.createElement('figcaption');
	figcaption.innerText = projet.title;
	figure.appendChild(figcaption);

	return figure;
}

function errorMessage(errorString, parentElement) {
	const error = document.createElement('span');
	error.classList.add('message');
	error.innerText = `${errorString}`;

	parentElement.appendChild(error);
}
export function afficherProjets(projets, gallery, creerProjetFn) {
	try {
		gallery.innerHTML = '';
		const projets_array = Array.from(projets);
		if (projets_array.length < 1) {
			errorMessage('Aucun projet a afficher pour le moment.', gallery);
		}
		projets_array.map((projet) => {
			gallery.appendChild(creerProjetFn(projet));
		});
	} catch (error) {
		errorMessage(
			"Impossible d'afficher les projets, veuillez essayer à nouveau dans quelques minutes.",
			gallery
		);
	}
}
const token_identification = getIdentificationToken();
//window.localStorage.removeItem('token_identification');

const gallery = document.querySelector('.gallery');

function afficherAdminPage() {
	//Affichage du mode édition

	const edition_header = document.querySelector('.admin-edition');
	edition_header.style.top = '0';
	document.querySelector('body').style.marginTop = '85px';

	afficherProjets(projets, gallery, creerProjet);

	//Suppression des filtres et ajout du lien de modification
	const filtres_parent = document.querySelector('.filtres');
	filtres_parent.style.display = 'none';
	//Création du lien  pour ouvrir la fenêtre modale
	const modifier_projets = document.createElement('div');
	modifier_projets.classList.add('lien-modal-container');

	const logo = document.createElement('div');
	logo.classList.add('logo');

	const lien_modale = document.createElement('span');
	lien_modale.classList.add('lien-modal');
	lien_modale.classList.add('trigger-modal');

	lien_modale.innerText = 'modifier';

	modifier_projets.appendChild(lien_modale);
	modifier_projets.appendChild(logo);

	const portfolio_title = document.querySelector('.portfolio-title');
	portfolio_title.style.marginBottom = '99px';
	portfolio_title.appendChild(modifier_projets);
	toggleModal();
	const logout = changeLoginLink();
	logout.addEventListener('click', () =>
		window.localStorage.removeItem('token_identification')
	);

	//Deconnexion
}

token_identification
	? afficherAdminPage()
	: afficherProjets(projets, gallery, creerProjet);

// Mise en place du filtrage

const filtres = document.querySelectorAll('.filtre');

function filtrerProjets(projets, id) {
	const projets_filtres = projets.filter((projet) => projet.categoryId === id);

	return projets_filtres;
}

filtres.forEach((filtre) => {
	filtre.addEventListener('click', () => {
		gallery.innerHTML = '';

		document.querySelector('.active')?.classList.remove('active');
		filtre.classList.add('active');

		const id = Number(filtre.dataset.id);
		const projets_filtres = filtrerProjets(projets, id);
		const projets_a_afficher = id === 0 ? projets : projets_filtres;
		afficherProjets(projets_a_afficher, gallery, creerProjet);
	});
});
