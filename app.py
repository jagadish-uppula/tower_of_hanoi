from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_game():
    player_name = request.form.get('player_name')
    if not player_name:
        return redirect('/')
    return render_template('game.html', player_name=player_name)

# For local development
if __name__ == '__main__':
    app.run(debug=True)
else:
    # For Vercel
    application = app
