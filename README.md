# Weather Almanac 2.0

An editorial weather almanac inspired by classic broadsheet newspaper layouts — designed to be read, not just glanced at. It strips away modern web design clichés like rounded cards, gradients, complex icons, and heavy drop shadows, replacing them with clean typography, hairline rules, and structured prose.

## The Story Behind This Project

This project is deeply personal. Looking back at my very first weather app—which was also my very first GitHub project—I wanted to rebuild the concept from scratch using the knowledge, engineering practices, and architectural patterns I have today. It serves as a benchmark for how far I have come as a software developer.

This also marks a transitional point in my journey. It will likely be my last web-focused React project for a while as I shift my focus, study habits, and personal roadmap toward cloud engineering and computing architecture.

## Features

* **Editorial Presentation**: Built using an elegant Georgia serif type system with small-caps variant accents and clean, responsive column splits.
* **Dynamic Location Handling**: Attempts automated geolocation on mount with built-in fallback reverse-geocoding via the BigDataCloud API, plus an integrated geocoding city search bar.
* **Prose Weather Conditions**: Converts standard WMO interpretation codes into descriptive textual sentences rather than abstract icons.
* **Leaflet RainViewer Integration**: Displays a real-time precipitation radar layer synced with CartoDB Positron base maps, complete with automatic dark mode tile-switching.
* **Performance-First Stack**: Bundled on Vite 8 and Rolldown, with structural linting provided by Oxlint.

## Technical Architecture

* **Framework**: React 19 (Functional components, Custom hooks, `useCallback` optimization)
* **Build Tooling**: Vite 8 + Rolldown
* **Linting**: Oxlint
* **Mapping**: Leaflet API + RainViewer API
* **Weather Service**: Open-Meteo API

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/coco1oco/weather_2.0.git](https://github.com/coco1oco/weather_2.0.git)
   cd weather_2.0
