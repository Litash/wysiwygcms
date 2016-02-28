# -*- coding: utf-8 -*-
# all the imports
import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, send_from_directory, jsonify
from contextlib import closing
import logging
import uuid  # for CAS
import time  # for CAS
from werkzeug import secure_filename  # for uploading files
from flask.ext.autoindex import AutoIndex

# create our little application
app = Flask(__name__)


UPLOAD_FOLDER = app.root_path + '/uploads'
ALLOWED_EXTENSIONS = set(['txt', 'TXT', 'pdf', 'PDF',
                          'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF',
                          'doc', 'DOC', 'docx', 'DOCX'])


# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'flaskr.db'),
    DEBUG=True,
    SECRET_KEY='Yooo!',
    UPLOAD_FOLDER=UPLOAD_FOLDER,
    MAX_CONTENT_LENGTH=16 * 1024 * 1024
))
#     USERNAME='admin',
#     PASSWORD='admin'
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
    if isAuthenticated():
        return redirect(url_for('show_home'))
    cur = g.db.execute('SELECT content,url FROM contents WHERE url="/home";')
    content = [dict(text=row[0], url=row[1]) for row in cur.fetchall()]

    cur = g.db.execute('SELECT item,id FROM sidepanel ORDER BY id DESC;')
    sideitem = [dict(item=row[0], id=row[1]) for row in cur.fetchall()]
    return render_template('home.html', content=content, sideitem=sideitem)


@app.route('/home')
def show_home():

    if session.get('username'):
        # uncomment following line and comment out above
        # to only allow staff to login
        # if session.get('username') and session['usercategory']=='staff':
        username = session['fullname']
    else:
        username = "SoooooSad"

    cur = g.db.execute('SELECT content,url FROM contents WHERE url="/home";')
    content = [dict(text=row[0], url=row[1]) for row in cur.fetchall()]

    cur = g.db.execute('SELECT item,id FROM sidepanel ORDER BY id DESC;')
    sideitem = [dict(item=row[0], id=row[1]) for row in cur.fetchall()]

    return render_template('home.html', content=content, sideitem=sideitem, username=username)


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
    logging.info('---------- update content -------- %s', logContent)
    logging.info('---------- update URL -------- %s', logUrl)
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

    logging.info('---------- update item -------- %s', logItem)

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
    logging.info('---------- update item -------- %s', logItem)
    logging.info('---------- update id -------- %s', logID)
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
    logging.info('---------- update content -------- %s', logID)
    g.db.execute('DELETE FROM sidepanel WHERE id = ?;',
                 [logID])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    # Validate the user.
    # If the user is already authenticated return.
    if isAuthenticated():
        logging.warning("----- isAuthenticated -----")
        session['logged_in'] = True
        # recordAuthenticatedUser()
        return redirect(url_for('show_home'))

    # Else if the GET parameter csticket is empty this is a new user who
    # we need to send for authentication.
    elif not request.args.get('csticket'):
        url = sendForAuthentication()
        return redirect(url)

    # Else if the GET parameter csticket is populated but doesn't match
    # the session csticket send the user for authentication.
    elif request.args.get('csticket') != session['csticket']:
        url = sendForAuthentication()
        return redirect(url)

    else:
        recordAuthenticatedUser()
        session['logged_in'] = True
        return redirect(url_for('show_home'))

# =================================
# ============== CAS ==============
# =================================

# program requiring authentication.
DEVELOPER_URL = "http://178.62.125.116:5000/login"
# Define the location of the service on the Computer Science server.
AUTH_SERVICE_URL = "http://studentnet.cs.manchester.ac.uk/authenticate/"
# Define the location of CAS's logtout service on the Computer Science server.
AUTH_LOGOUT_URL = "http://studentnet.cs.manchester.ac.uk/systemlogout.php"
studylevel = False


def isAuthenticated():
    """
    A function to determine whether a user is already authenticated.
    @return boolean (true if authenticated, false if not)
    """
    # When a user is authenticated the session["authenticated"] is
    # populated with a timestamp. If a numerical value is held return true.
    authenticatedtimestamp = getTimeAuthenticated()

    if authenticatedtimestamp != "False":
        return True
    else:
        return False


def sendForAuthentication():
    """
    A function to send a user to the authentication service.
    """
    # Generate a unique ticket.
    csticket = str(uuid.uuid4())

    # Save the ticket so we can confirm the same user is returning from
    # the authentication service.
    session["csticket"] = csticket

    # Send the user to the School of Computer Science's server to validate.
    # Append to the url the GET parameters 'url' which tells the
    # authentication service where to return and append the csticket which
    # will be used to confirm that the same user is returning.
    url = AUTH_SERVICE_URL + "?url=" + \
        DEVELOPER_URL + "&csticket=" + csticket

    logging.warning(url + "\n\nredirecting\n")
    return url


def recordAuthenticatedUser():
    """
    A function to record that a user is authenticated.
    """
    # Record the time authenticated.
    session["authenticated"] = str(time.time())
    logging.warning(
        "----- authenticated timestamp " + session["authenticated"] + " -----")

    # Record the user's username.
    session["username"] = request.args["username"]

    # Record the user's full name.
    session["fullname"] = request.args["fullname"]

    # Record the users's category.
    session["usercategory"] = request.args["usercategory"]

    # Record the users's department.
    session["department"] = request.args["dept"]

    # Record the users's study level. Note this is only available
    # if the developer has called requireStudyLevel(). TODO: studylevel
    # if (isset(request.args["studylevel"]))
    #     session["studylevel"] = request.args["studylevel"]

# @return string


def getTimeAuthenticated():
    """
    A function to get the timestamp when the user authenticated.
    """
    if session.get("authenticated"):
        return session["authenticated"]
    else:
        return "False"


def rejectUser():
    """
    A function to reject a user who has failed to authenticate.
    """
    logging.warning("----- reject -----")
    # sys.exit("Authentication failure")
    redirect(url_for("show_root"))


@app.route('/logout')
def logout():
    # logging.info('---------- Logging out %s ----------', session['username'])
    session.clear()
    return redirect(AUTH_LOGOUT_URL)

# =================================
# ========== File upload ==========
# =================================


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    function for uploading files
    """
    if not session.get('logged_in'):
        abort(401)
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        logging.warning("----------------------------- uploading")
        return redirect(url_for('uploaded_file', filename=filename))
        # return render_template('uploaded_img.html',)
    return redirect(url_for('show_home'))


@app.route('/uploadajax', methods=['POST'])
def upload_file_ajax():
    """
    function for uploading files
    """
    if not session.get('logged_in'):
        abort(401)
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        updir = app.config['UPLOAD_FOLDER']
        file.save(os.path.join(updir, filename))
        file_size = os.path.getsize(os.path.join(updir, filename))
        return jsonify(name=filename, size=file_size)
    return jsonify(name="invalid file", size=0)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """
    function for serving uploaded files
    """
    if not session.get('logged_in'):
        abort(401)
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


# make /uploads visible using AutoIndex
idx = AutoIndex(app, app.config['UPLOAD_FOLDER'], add_url_rules=True)
idx.add_icon_rule('page_white_acrobat.png', ext=['pdf', 'PDF'])


@app.route('/uploads')
def uploaded_files():
    """
    function for serving uploaded files
    """
    return idx.render_autoindex('/', show_hidden=None, sort_by='name')


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(host='178.62.125.116')
