const login_form = document.querySelector('#Login-form');
const login_link = document.querySelector('.login-link');

login_link.style.fontWeight = 'bold';

login_form.addEventListener('submit', async function (event) {
	event.preventDefault();
	try {
		let form_data = new FormData(login_form);
		form_data = Object.fromEntries(form_data);

		const reponse = await fetch('http://localhost:5678/api/users/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form_data),
		});

		if (reponse.status === 200) {
			const token = await reponse.json();
			window.localStorage.setItem(
				'token_identification',
				JSON.stringify(token)
			);
			window.location.href = 'http://localhost:5500/FrontEnd/index.html';
		} else {
			document.querySelector('.mauvais-identifiants').innerText =
				'Les identifiants renseignés sont incorrects.';
		}

		// Gestion d'erreur du fetch
	} catch (error) {
		console.log('error : ', error);
	}
});
