import { render } from 'preact';

import preactLogo from './assets/preact.svg';
import './style.css';
import Card from './components/Card.jsx';
import {useState} from "react";
import Form from "./components/Form.jsx";

export function App() {
	const [counter, setCounter] = useState(0);
	function clickHandler() {
		console.log('clicked');
		setCounter(counter + 1);
	}

	function fetchContacts() {
		fetch('http://localhost:8000/api/contacts')
			.then(res => res.json())
			.then(json => console.log(json))
	}

	return (
		<div>
			<Card
				number={counter}
				onClick={clickHandler}
			/>
			<Card
				number='just fetching some api'
				onClick={fetchContacts}
			/>
			<section>
				<Form />
			</section>
		</div>
	);
}

function Resource(props) {
	return (
		<a href={props.href} target="_blank" class="resource">
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	);
}

render(<App />, document.getElementById('app'));
