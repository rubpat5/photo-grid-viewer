# Photo Grid Viewer

A photo gallery app with a responsive masonry grid layout and detailed photo view.

## What it does

- Displays photos in a beautiful masonry grid layout
- Implements virtualization for smooth scrolling through hundreds of images
- Offers a detailed view for each photo

## Tech stack

- React with TypeScript
- Vite for builds
- React Router for navigation
- Styled Components for styling
- Pexels API for photo data

## Performance optimizations

I spent a fair amount of time making sure this app stays smooth even with hundreds of images. Here's what I did:

- Implemented virtualization to render only visible images, drastically reducing DOM nodes
- Used React's lazy loading and code splitting to minimize initial bundle size
- Applied proper image loading strategies with responsive sizes and lazy loading

Ran into some tricky issues with scroll jank initially, but solved it by calculating and pre-positioning grid items before they enter the viewport.

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## Deployment

The app is deployed on GitHub Pages at https://rubpat5.github.io/photo-grid-viewer

To deploy a new version:
```bash
npm run deploy
```