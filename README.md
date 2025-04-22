# 📩 Kontakty

## Opis projektu
Aplikacja webowa do zarządzania kontaktami zintegrowana z API pogodowym. Umożliwia dodawanie, edycję, usuwanie oraz sortowanie kontaktów z aktualnymi informacjami o pogodzie dla danego miasta.

## Funkcjonalności
- Dodawanie/edycja/usuwanie kontaktów
- Sortowanie po nazwisku lub dacie dodania
- Wyświetlanie aktualnej temperatury i warunków pogodowych dla miasta kontaktu
- Walidacja danych (unikalny adres email i numer telefonu)
- Responsywny interfejs

## Technologie
- **Backend**: Django, Django REST Framework
- **Frontend**: React, Tailwind, Yup
- **Baza danych**: SQLite
- **Integracje**: API Open-Meteo, Nominatim

## Wymagania
- Python 3.11+
- Node.js 18+
- npm 9+

## Instalacja
1. Sklonuj repozytorium:\
`git clone https://github.com/zxasc/contacts-fullstack-application.git`

### Przy użyciu skryptu
2. Zmień zezwolenia skryptu:\
`chmod +x kontakty.sh`

3. Uruchom skrypt:\
`./kontakty.sh`

### Manualnie
2. Backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # bash/zsh
source .venv/bin/activate.fish  # fish
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
```

3. Frontend:
```bash
cd frontend
npm install
```

## Uruchamianie

### Przy użyciu skryptu
1. Uruchom skrypt:\
`./kontakty.sh`

### Manualnie
1. Backend
```bash
cd backend
python manage.py runserver
```

2. Frontend
```bash
cd frontend
npm run dev
```

3. Przeglądarka\
W przeglądarce otwórz adres: http://localhost:5173/ aby rozpocząć korzystanie z aplikacji.
