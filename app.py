from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_game():
    player_name = request.form.get('player_name')
    if not player_name:
        return redirect(url_for('index'))
    return render_template('game.html', player_name=player_name)

if __name__ == '__main__':
    app.run(debug=True)