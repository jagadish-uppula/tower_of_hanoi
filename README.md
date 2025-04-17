# Tower of Hanoi Game

![Game Screenshot](screenshot.png) <!-- Add screenshot later -->

An interactive Tower of Hanoi puzzle game built with Flask, HTML, CSS, and JavaScript.

## Features

- Click-based disk movement with smooth animations
- Progressive difficulty (increases disks after each win)
- Responsive design works on desktop and mobile
- Visual feedback for valid/invalid moves
- Win detection and level progression

## How to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/tower-of-hanoi.git
   cd tower-of-hanoi
2. Install Requirements:
   ```bash
   pip install -r requirements.txt

4. Run the flask application:
   ```bash
   python app.py

5. Open your browser to:
   ```text
   http://localhost:5000


# Game Rules

1. Only one disk can be moved at a time
2. Each move consists of taking the upper disk from one stack and placing it on another stack
3. No disk may be placed on top of a smaller disk
4. The goal is to move all disks from the leftmost tower to the rightmost tower

# Technologies Used

- Python (Flask)
- HTML5
- CSS3
- JavaScript
