import { render } from 'preact';

import './style.css';
import {useState, useEffect} from "react";
import Form from "./components/Form.jsx";
import Contact from './components/Contact.jsx';

export function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [contactsList, setContactsList] = useState([])
	useEffect(() => {
		fetchContacts().then((contacts) => setContactsList(contacts));
		setIsLoading(!isLoading);
	}, []);

	const fetchContacts = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('http://localhost:8000/api/contacts');
			if (!response.ok) {
				throw new Error('Could not fetch contacts.');
			}
			const contacts = await response.json();
			console.log("Contacts fetched!");
			console.log(contacts);
			return contacts;
		} catch (e) {
			throw Error(e);
		}
	}

	return (
		<main>
			<section>
				{!isLoading && contactsList.map((contact) => (
					<Contact
						contact={contact}
						key={contact.id}
					/>
				))}
			</section>
			<section>
				<Form
					contact={{
						name: "",
						surname: "",
						phone_number: "",
						email: "",
						city: "",
						added_date: "",
					}}
					isEditing={false}
				/>
			</section>
		</main>
	);
}

render(<App />, document.getElementById('app'));
