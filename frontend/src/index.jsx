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
				const error = await response.json();
				console.error(error);
			}
			const contacts = await response.json();
			return contacts;
		} catch (e) {
			console.error("Error occurred: ", e);
		}
	}

	const addContact = (contact) => {
		setContactsList([...contactsList, contact]);
	}

	return (
		<>
			<header className="px-6 py-8 bg-eminence-400">
				<h1 className="text-2xl font-semibold">📩 Kontakty</h1>
			</header>
			<section className="
				grid grid-flow-row justify-items-center grid-cols-1 sm:grid-cols-2
				lg:grid-cols-3 xl:grid-cols-4 gap-3 w-[95%] mx-auto
			">
				<div className="flex flex-row justify-center col-span-full py-2 w-full sticky top-0 bg-eminence-50">
					<label>
						Sortowanie:
						<select
							defaultValue={"byDateDesc"}
							value={sortType}
							onChange={(e) => setSortType(e.target.value)}
						>
							<option value="bySurnameAsc">Nazwisko (A → Z)</option>
							<option value="bySurnameDesc">Nazwisko (Z → A)</option>
							<option value="byDateDesc">Od najnowszego</option>
							<option value="byDateAsc">Od najstarszego</option>
						</select>
					</label>
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
			<footer className="mt-4 px-6 py-4 bg-eminence-200">
				<p className="text-right text-sm">Made with 💜 by <a className="underline decoration-eminence-950" href="https://github.com/zxasc" target="_blank" rel="noopener noreferrer">Paweł</a></p>
			</footer>
		</>
	);
}

render(<App />, document.getElementById('app'));
