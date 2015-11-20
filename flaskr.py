# all the imports
import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from contextlib import closing
import logging


# create our little application :)
app = Flask(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'flaskr.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='admin'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)


def connect_db():
    return sqlite3.connect(app.config['DATABASE'])


def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


@app.before_request
def before_request():
    g.db = connect_db()


@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()


@app.route('/')
# show_entries() <--- old class name
def show_root():
    # cur = g.db.execute('select title, text from entries order by id desc')
    # entries = [dict(title=row[0], text=row[1]) for row in cur.fetchall()]
    # return render_template('home.html', entries=entries)
    cur = g.db.execute('SELECT content,url FROM contents WHERE url="/home";')
    content = [dict(text=row[0], url=row[1]) for row in cur.fetchall()]

    cur = g.db.execute('SELECT item,id FROM sidepanel ORDER BY id DESC;')
    sideitem = [dict(item=row[0], id=row[1]) for row in cur.fetchall()]
    return render_template('home.html', content=content, sideitem=sideitem)


@app.route('/home')
def show_home():
    cur = g.db.execute('SELECT content,url FROM contents WHERE url="/home";')
    content = [dict(text=row[0], url=row[1]) for row in cur.fetchall()]

    cur = g.db.execute('SELECT item,id FROM sidepanel ORDER BY id DESC;')
    sideitem = [dict(item=row[0], id=row[1]) for row in cur.fetchall()]
    return render_template('home.html', content=content, sideitem=sideitem, username=app.config['USERNAME'])


@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    g.db.execute('insert into entries (title, text) values (?, ?)',
                 [request.form['title'], request.form['text']])
    g.db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('show_home'))


@app.route('/update', methods=['GET', 'POST', 'PUT'])
def update_content():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    logContent = request.args['content']
    logUrl = request.args['url']
    logging.warning('update content -------- %s', logContent)
    logging.warning('update URL -------- %s', logUrl)
    g.db.execute('UPDATE contents SET content = ? WHERE url = ?;',
                [logContent, logUrl])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home'))

@app.route('/createside', methods=['GET', 'POST', 'PUT'])
def create_side():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    logItem = request.args['item']

    logging.warning('update item -------- %s', logItem)

    g.db.execute('INSERT INTO sidepanel (item) VALUES (?);',
                [logItem])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home'))

@app.route('/updateside', methods=['GET', 'POST', 'PUT'])
def update_side():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    logItem = request.args['item']
    logID = request.args['id']
    logging.warning('update item -------- %s', logItem)
    logging.warning('update id -------- %s', logID)
    g.db.execute('UPDATE sidepanel SET item = ? WHERE id = ?;',
                [logItem, logID])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home'))


@app.route('/deleleside', methods=['GET', 'POST', 'PUT'])
def delete_side():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    logID = request.args['id']
    logging.warning('update content -------- %s', logID)
    g.db.execute('DELETE FROM sidepanel WHERE id = ?;',
                [logID])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('show_home'))
    return render_template('login-n.html', error=error)


@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_root'))

if __name__ == '__main__':
    # logging.basicConfig(filename='postcontent.log',level=logging.WARNING)
    app.run(host='178.62.125.116')