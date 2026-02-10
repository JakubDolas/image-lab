# Image Lab

Aplikacja webowa do **konwersji i edycji obrazów**.

Oferuje **edytor obrazów**, który umożliwia pracę z obrazem w czasie rzeczywistym. Użytkownik może zmieniać parametry kolorów i efektów, rysować bezpośrednio po obrazie, przybliżać i oddalać widok oraz kadrować obraz.

Dostępne są również narzędzia oparte o sztuczną inteligencję, takie jak usuwanie tła oraz powiększanie obrazu (upscaling). Podczas edycji wyświetlane są informacje o obrazie, w tym jego format, rozmiar pliku oraz rozdzielczość.

Aplikacja umożliwia wgrywanie wielu plików jednocześnie, wybór formatów docelowych oraz pobieranie wyników konwersji w formie archiwum ZIP.

---

## Uruchomienie

### Backend (Docker)

```bash
docker compose up --build
```

Backend będzie dostępny pod adresem:
http://localhost:8000

### Endpointy
Dwa główne endpointy: 
- **`/convert`** – endpoint odpowiedzialny za konwersję obrazów 
- **`/editor`** – endpoint obsługujący operacje edycji obrazu

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm install lucide-react react-icons
npm run dev
```
Frontend będzie dostępny pod adresem:
http://localhost:5173

### Testy
Testy frontendowe zostały napisane z użyciem Vitest oraz React Testing Library.

Aby uruchomić testy:

```bash
cd frontend
npm run test
```


## **Technologie**

- **Frontend:** React, TypeScript, TailwindCSS, Framer Motion

- **Backend:** FastAPI, Pillow

- **Testy:** Vitest, React Testing Library

- **Konteneryzacja:** Docker


