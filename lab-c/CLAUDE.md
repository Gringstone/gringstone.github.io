# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A minimal static web boilerplate for an "AI LAB C" class exercise. It is plain HTML/CSS/JS with no build step, package manager, linter, or test suite.

- `index.html` is the single entry point. It loads `styles.css` and `scripts.js` (with `defer`, so the script runs after the DOM is parsed and doesn't need a `DOMContentLoaded` wrapper).
- `assets/` is empty and meant for images and other static files, referenced by relative paths.
- The `<title>` holds a placeholder, `Imie Nazwisko (00000)` (Polish for "First Last (student ID)"). The student fills in their own name and ID; don't change it unless asked.

## Running

Open `index.html` directly in a browser, or serve the folder (e.g. `npx serve .` or `python -m http.server`) if a feature needs an HTTP origin (fetch, ES modules). `scripts.js` logs through `console.debug`, so the browser console's "Verbose" level has to be enabled to see it.

## Conventions (from `.editorconfig`)

- LF line endings, UTF-8, trailing newline, no trailing whitespace, spaces only.
- Indent: 2 spaces for `.css` and `.js`, 4 spaces for `.html`.
- `.idea/` (JetBrains) is gitignored.
