# Makhan Run — Janmashtami 3D

A mobile-friendly, original 3D endless runner inspired by the genre of lane-running games, set in a festive Janmashtami night in Vrindavan.

## Run locally

1. Open this folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` and choose **Open with Live Server**.

This project includes `.vscode/settings.json`, which tells Live Server to use the local Wi-Fi address. Stop and start Live Server once after opening the project so it reads that setting.

Or from the VS Code terminal (no extension needed):

```powershell
npm start
```

Then open `http://localhost:5173`.

## Publish on GitHub Pages

1. Create a GitHub repository and upload all files in this folder.
2. On GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Run the `Deploy to GitHub Pages` workflow from the **Actions** tab, or push another change to `main`.
5. Open the Pages URL shown by GitHub. The game is entirely static and does not need Node.js on GitHub.

## Controls

- Phone: swipe left/right, swipe up to jump.
- Keyboard: arrow keys; Space or Up Arrow jumps.

## Goal

Collect makhan pots to increase your score. Change lanes to avoid carts and tall crates. Jump over decorated bamboo hurdles. The run ends when Krishna collides with an obstacle.

## Phone and browser support

The game uses standard HTML, CSS, JavaScript, WebGL, and touch events. It works in current Chrome, Safari, Firefox, Edge, and Samsung Internet browsers. For phones on your Wi-Fi, start `npm start`, copy the printed **Makhan Run phone** address, and open it on the phone. For a public link, use the GitHub Pages URL.

## Notes

The game needs an internet connection when it loads because it uses the Three.js library from the jsDelivr CDN. All gameplay code, visual scene design, and audio effects are in this project.
