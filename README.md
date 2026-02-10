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
Testy obejmują:

- komponenty UI

- interakcje użytkownika

- widoki aplikacji (np. ConvertPage)

- zachowanie aplikacji w zależności od stanu

Testy nie sprawdzają implementacji hooków ani szczegółów technicznych, skupiają się na zachowaniu aplikacji z perspektywy użytkownika.

## Co zostało zrobione

Projekt znajduje się w zaawansowanym stanie realizacji.

### Strona startowa
Zaimplementowano **stronę startową**, która umożliwia użytkownikowi rozpoczęcie pracy z aplikacją oraz zapoznanie się z jej funkcjonalnością.  

### Konweter obrazów
Gotowa jest również strona **konwersji obrazów**, pozwalająca na wgrywanie wielu plików jednocześnie, wybór formatów docelowych oraz pobieranie wyników w formie archiwum ZIP.

W ramach konwertera użytkownik może dodatkowo **skalować obrazy**, zmieniać ich rozmiar ręcznie lub korzystać z **gotowych presetów rozdzielczości i proporcji**, co ułatwia szybkie dopasowanie obrazu do różnych zastosowań.

### Edytor obrazów

W aplikacji zaimplementowano rozbudowany **edytor obrazów**, który umożliwia użytkownikowi pracę z obrazem w czasie rzeczywistym.

Użytkownik może dynamicznie **zmieniać parametry kolorów i efektów**, takich jak jasność, kontrast czy nasycenie, a wszystkie zmiany są widoczne natychmiast na podglądzie obrazu. Edytor pozwala również **rysować bezpośrednio po obrazie**, wybierając grubość oraz kolor pędzla.

Dostępne są narzędzia do **przybliżania i oddalania obrazu**, a także funkcja **kadrowania**, umożliwiająca precyzyjne dopasowanie widocznego obszaru.

Edytor został dodatkowo rozszerzony o **narzędzia oparte o sztuczną inteligencję**, takie jak:
- usuwanie tła z obrazu,
- powiększanie obrazu (upscaling) z zachowaniem jakości.

Podczas edycji wyświetlane są również **szczegółowe informacje o obrazie**, w tym:
- aktualny format pliku,
- rozmiar pliku,
- rozdzielczość obrazu.


### Testy
Obecnie trwają prace nad **testami frontendowymi oraz backendowymi**, których celem jest sprawdzenie poprawności działania widoków oraz interakcji użytkownika. 

## **Technologie**

- **Frontend:** React, TypeScript, TailwindCSS, Framer Motion

- **Backend:** FastAPI, Pillow

- **Testy:** Vitest, React Testing Library

- **Konteneryzacja:** Docker

