# 🔐 BruteForce.io

> **A Cyber Security & Password Entropy Simulator** > *Visualizing the mathematics behind password strength with a cyberpunk aesthetic.*

![Project Status](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS-yellow)

---

## 🚀 Live Demo
### [👉 Click here to launch the Simulator](https://bruteforce-io.netlify.app/)

---

## 📖 About The Project

**BruteForce.io** is an interactive web-based tool designed to demonstrate the importance of password complexity. Unlike standard strength checkers, this tool visualizes the "hacking" process in real-time.

It uses **client-side JavaScript** to calculate the **Entropy (bits)** of a password and estimates the time required to crack it using modern GPU arrays.

### 🎥 Visual Experience
The UI is heavily inspired by retro-futuristic and cyberpunk aesthetics, featuring:
* **Matrix Digital Rain:** A dynamic background of falling code.
* **CRT Monitor Effects:** Scanlines, screen flickering, and digital artifact glitches.
* **Interactive 3D Tilt:** The interface responds to mouse movement (Desktop).
* **Audio Feedback:** Immersive sound effects for processing and access success.

---

## ✨ Key Features

### 🛡️ Core Functionality
* **Real-Time Brute Force:** Actually attempts to crack short passwords (≤ 4 chars) in the browser.
* **Theoretical Simulation:** For long passwords, it calculates math-based metrics to simulate the attack without freezing the browser.
* **Dictionary Attack Detection:** Instantly recognizes common weak passwords (e.g., "admin", "123456").
* **Algorithm Selector:** Compare cracking speeds across different hashing algorithms:
    * **MD5** (Fast & Insecure)
    * **SHA-256** (Standard)
    * **Bcrypt** (Slow & Secure)

### 📊 Metrics Displayed
* **Entropy:** The true measure of randomness (in bits).
* **Combinations:** Total possible permutations ($N = S^L$).
* **Time to Crack:** Estimated time based on selected algorithm speed (e.g., 2 Billion guesses/sec).

---

## 🧮 How It Works

The tool calculates the **Search Space ($N$)** using the formula:

$$N = S^L$$

Where:
* **$S$ (Pool Size):** The number of unique characters available (Lowercase=26, +Upper=52, +Numbers=62, +Symbols=94).
* **$L$ (Length):** The number of characters in the password.

**Entropy ($E$)** is then calculated to determine cryptographic strength:

$$E = \log_2(N)$$

---

## 🛠️ Installation (Run Locally)

If you want to run this project on your local machine:

1.  **Clone the repository** (or download files):
    ```bash
    git clone [https://github.com/your-username/bruteforce-io.git](https://github.com/your-username/bruteforce-io.git)
    ```
2.  **Navigate to the folder:**
    ```bash
    cd bruteforce-io
    ```
3.  **Run the project:**
    * Simply double-click `index.html` to open in your browser.
    * *Note:* For audio to work correctly without browser blocking, it is recommended to use **Live Server** (VS Code Extension) or a local Python server:
        ```bash
        python -m http.server
        ```

---

## 📂 Project Structure

```text
/bruteforce-io
│
├── index.html       # Main HTML structure
├── style.css        # Cyberpunk styling & animations
├── script.js        # Logic for math, simulation, and DOM manipulation
├── README.md        # Documentation
└── /sounds          # Audio assets
     ├── scan.mp3
     └── success.mp3