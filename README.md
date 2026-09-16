# Configurator

A school project in three.js, React & Vite, showcasting a real-time 3D product configurator.

## Overview

This single-page configurator allows users/customers to:

- Toggle between different product variants
- View a live 3D model rendered in Three.js
- Display or hide product dimensions depending on the selected model
- Interact with the model via preset camera angles and UI controls
- 2D image slideshow as an alternate view alongside the 3D model
- Collapsible configurator panel that expands the 3D viewer and slideshow to fullscreen

## Features

- Real-time 3D rendering using Three.js
- GLB model loading with variant-based configuration
- React component architecture with clean separation
- Vite dev server for fast iteration
- Deployed on Vercel
- Material variant switching driven by the glTF KHR_materials_variants extension

## Tech stack

- React 19
- Three.js 19
- Vite 8
- Three-gltf-extensions for KHR_materials_variants support
- Vercel deployment
- Vercel Blob storage

## Installation

Clone project:
git clone https://github.com/LKotlinska/configurator.git

Navigate:
cd configurator

Install dependencies:
npm install

Run development server:
npm run dev

Then open:
http://localhost:5173

## Deployment

https://configurator-pi-rouge.vercel.app/

## Project structure

- `src/components/` - reusable UI (accordion, swatches, buttons etc.)
- `src/sections/` - page-level blocks composed in App.jsx
  ...

## License

MIT license
