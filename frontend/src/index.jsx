import { render } from 'preact';

import './style.css';
import {useState, useEffect, useMemo} from "react";
import Form from "./components/Form.jsx";
import Contact from './components/Contact.jsx';

export function App() {
	const [sortType, setSortType] = useState('surname')
	const [isLoading, setIsLoading] = useState(true);
	const [contactsList, setContactsList] = useState([])
	useEffect(() => {
		const loadContacts = async () => {
			setIsLoading(true);
			try {
				const contacts = await fetchContacts();
				setContactsList(contacts);
			} finally {
				setIsLoading(false);
			}
		};
		loadContacts();
	}, []);

	const sortContacts = {
	  bySurnameAsc: (a, b) => a.surname.localeCompare(b.surname),
	  bySurnameDesc: (a, b) => b.surname.localeCompare(a.surname),
	  byDateAsc: (a, b) => new Date(a.added_date) - new Date(b.added_date),
	  byDateDesc: (a, b) => new Date(b.added_date) - new Date(a.added_date),
	}

	const sortedContacts = useMemo(() => {
		return [...contactsList].sort(sortContacts[sortType]);
	}, [contactsList, sortType]);

	const fetchContacts = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('http://localhost:8000/api/contacts');
			if (!response.ok) {
				throw Error(response.statusText);
			}
			const contacts = await response.json();
			return contacts;
		} catch (e) {
			throw Error(e);
		}
	}

	const addContact = (contact) => {
		setContactsList([...contactsList, contact]);
	}

	return (
		<>
			<main className="contacts-app">
				<h1>Contacts App</h1>
				<select
					value={sortType}
					onChange={(e) => setSortType(e.target.value)}
				>
					<option value="bySurnameAsc">Surname (A → Z)</option>
					<option value="bySurnameDesc">Surname (Z → A)</option>
					<option value="byDateDesc">Date added (Newest First)</option>
					<option value="byDateAsc">Date added (Oldest First)</option>
				</select>
				<section className="contacts-table">
					<div className="contacts-row">
						<div><p>Name</p></div>
						<div><p>Phone number</p></div>
						<div><p>Email</p></div>
						<div><p>City | Temp | Weather</p></div>
						<div><p>Status</p></div>
						<div><p>Edit</p></div>
					</div>
					{!isLoading && sortedContacts.map((contact) => (
						<Contact
							contact={contact}
							key={contact.id}
						/>
					))}
					<Form
						contact={{
							name: "",
							surname: "",
							phone_number: "",
							email: "",
							city: "",
							status: "",
							added_date: "",
						}}
						isEditing={false}
						addContact={addContact}
					/>
				</section>
			</main>
		</>
	);
}

render(<App />, document.getElementById('app'));
