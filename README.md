# Image Lab

Aplikacja do **konwersji obrazów** — frontend w React + Vite, backend w FastAPI (Docker).  
Pozwala wgrywać wiele plików, wybrać docelowy format i pobrać wynik jako ZIP.

---

## Uruchomienie

### Backend (Docker)

```bash
docker compose up --build
```
Backend uruchomi się pod adresem: http://localhost:8000

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Aplikacja dostępna pod adresem: http://localhost:5173


# Co zostało zrobione: (20.10.2025)

## Frontend
- Dodano interfejs do wgrywania wielu plików jednocześnie.

- Możliwość wyboru formatu docelowego spośród wszystkich obsługiwanych przez bibliotekę Pillow.

- Suwak do ustawienia jakości (dla formatów stratnych, np. JPEG, WEBP).

- Możliwość pobrania wyników w formacie ZIP po konwersji.

## Backend

- Dodano logikę konwersji obrazów z wykorzystaniem biblioteki Pillow.

- Zaimplementowano obsługę wielu formatów.

- Dodano możliwość przesyłania wielu plików oraz ich pakowania do ZIP.

- API oparte o FastAPI, z endpointami do konwersji i pobierania listy wspieranych formatów.

## **Technologie

- **Frontend:** React, TypeScript, TailwindCSS, Framer Motion

- **Backend:** FastAPI, Pillow

- **Konteneryzacja:** Docker
