import { useState, useMemo } from "react";
import Contact from "./Contact";

export default function ContactList({ contacts }) {
  const [sortType, setSortType] = useState("bySurname");

  const sortContacts = {
    bySurname: (a, b) => a.surname.localeCompare(b.surname),
    byDate: (a, b) => new Date(a.added_date) - new Date(b.added_date),
  };

  const sortedContacts = useMemo(() => {
    const copy = [...contacts];
    return copy.sort(sortContacts[sortType]);
  }, [contacts, sortType]);

  return (
    <>
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="bySurname">Surname</option>
          <option value="byDate">Date Added</option>
        </select>
      </div>

      {sortedContacts.map((contact) => (
        <Contact key={contact.id} contact={contact} />
      ))}
    </>
  );
}
