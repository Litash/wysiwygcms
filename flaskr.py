# -*- coding: utf-8 -*-
####
# Flask program for Litash content management system
# Author: Yichen LU
# Date: 2-Oct-2015
####

# all the imports
import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, send_from_directory, jsonify, json
from contextlib import closing
import logging
import uuid  # for CAS
import datetime  # for CAS
from werkzeug import secure_filename  # for uploading files
from flask.ext.autoindex import AutoIndex

# create our little application
app = Flask(__name__)

BASE_URL = ""
SITE_NAME = "" # second part of current url
SITE_TITLE = ""
MENU = "" # current selected menu item
MENU_LIST = [] # list of all menu items
UPLOAD_FOLDER = app.root_path + '/uploads'
ALLOWED_EXTENSIONS = set(['txt', 'TXT', 'pdf', 'PDF',
                          'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF',
                          'doc', 'DOC', 'docx', 'DOCX', 'ppt', 'PPT'])


# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'flaskr.db'),
    DEBUG=True,
    SECRET_KEY='Yooo!',
    UPLOAD_FOLDER=UPLOAD_FOLDER,
    MAX_CONTENT_LENGTH=10 * 1024 * 1024
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


@app.route('/site')
def show_sites():
    if not isAuthenticated():
        global BASE_URL
        BASE_URL = request.base_url
        logging.info('-------------- request.base_url = ',request.base_url)
        return login()
    cur = g.db.execute('SELECT id, name, url FROM Site;')
    sites = [dict(id=row[0], name=row[1], url=row[2]) for row in cur.fetchall()]

    return render_template('my_sites.html', sites=sites)


@app.route('/site/<siteName>')
def show_root(siteName):
    # if isAuthenticated():

    # update global variables
    global SITE_NAME
    # global MENU_LIST
    SITE_NAME = siteName
    logging.info("---------------- show_root SITE_NAME = %s", SITE_NAME)
    # MENU_LIST = menuList
    return redirect(url_for('show_home', siteName=SITE_NAME, menu='home'))


@app.route('/site/<siteName>/<menu>')
def show_home(siteName, menu):
    global SITE_NAME
    global MENU
    SITE_NAME = siteName
    MENU = menu
    username = "null"
    if isAuthenticated():
        if session.get('username'):
            # uncomment following line and comment out above
            # to only allow staff to login
            # if session.get('username') and session['usercategory']=='staff':
            username = session['fullname']
    else:
        session["logged_in"] = False
        # return login()

    url = '/site/'+siteName+'/'+menu
    # logging.info('---------------- url = %s', url)
    # get site title
    cur = g.db.execute('SELECT title from Site where name= ?', [siteName])
    # logging.info("------------- site title = %s", cur.fetchall())
    siteTitle = [dict(title=row[0]) for row in cur.fetchall()]
    logging.info("--------------- siteTitle = %s", siteTitle)

    if len(siteTitle) == 0:
        abort(404)

    # get content
    cur = g.db.execute('SELECT content,url FROM Content WHERE url=?;', [url])
    content = [dict(text=row[0], url=row[1], siteName=siteName, menu=menu) for row in cur.fetchall()]
    # logging.info('---------------- content = %s', content)
    # get menu item for this site
    cur = g.db.execute('SELECT idx, item, url FROM Menu WHERE siteName = ? ORDER BY idx;'
        , [siteName])
    menuList = [dict(idx=row[0], item=row[1], url=row[2]) for row in cur.fetchall()]
    # get side panel state
    cur = g.db.execute('SELECT state, title FROM SidePanelState WHERE url = ?',[url])
    sideState = [dict(state=row[0], title=row[1]) for row in cur.fetchall()]
    logging.info("------------ side state = %s", sideState)

    # get side panel items
    cur = g.db.execute('SELECT id, url, item FROM SidePanelItem WHERE url= ? ORDER BY id DESC;',
        [url])
    sideItem = [dict(id=row[0], url=row[1], item=row[2]) for row in cur.fetchall()]

    # update global variables
    global SITE_TITLE
    global MENU_LIST
    SITE_TITLE = siteTitle
    MENU_LIST = menuList
    # logging.info("------------- MENU_LIST = %s", MENU_LIST)
    logging.info("------------- SITE_NAME = %s", SITE_NAME)

    return render_template('home.html', title=SITE_TITLE, content=content,
        sideItem=sideItem, username=username, menuItem=MENU_LIST, sideState=sideState)


####
# Site management
####
@app.route('/add_site', methods=['POST'])
def add_site():
    """
    function for add a new site.
    When new site is created, create empty content for Home menu
    """
    if not session.get('logged_in'):
        abort(401)

    logging.info('--------------- NEW SITE: method = %s', request.method)
    logging.info(request)
    siteTitle = request.form['siteTitle']
    siteName = request.form['siteName']
    # siteURL = request.form['siteURL']
    siteURL = "/site/"+siteName.strip()
    # TODO: if exist, add; then fail
    logging.info('---------- NEW SITE: siteName = %s, siteURL = %s', siteName, siteURL)

    # logging.info(existSites)
    g.db.execute('INSERT INTO Site (name, title, url) values (?, ?, ?);',[siteName, siteTitle, siteURL])
    g.db.execute('INSERT INTO Menu (siteName, idx, item, url) values (?, ?, ?, ?);',[siteName, 0, "Home", siteURL+"/home"])
    g.db.execute('INSERT INTO Content (content, url) values ("", ?);',[siteURL+"/home"])
    g.db.execute('INSERT INTO SidePanelState (url, state, title) values(?, 1, "undefined")',[siteURL+"/home"])
    g.db.commit()

    # return jsonify(status=201, name=siteName, url=siteURL)
    return redirect(url_for('show_sites'))


@app.route('/delete_site', methods=['POST'])
def delete_site():
    if not session.get('logged_in'):
        abort(401)
    # siteName = request.form['siteName']
    siteURL = request.form['url']

    g.db.execute('DELETE FROM Site WHERE url=?', [siteURL])
    g.db.execute('DELETE FROM Menu WHERE url LIKE ?', [siteURL+'%'])
    g.db.execute('DELETE FROM Content WHERE url LIKE ?', [siteURL+'%'])
    g.db.execute('DELETE FROM SidePanelItem WHERE url LIKE ?', [siteURL+'%'])
    g.db.execute('DELETE FROM SidePanelState WHERE url LIKE ?', [siteURL+'%'])
    g.db.commit()
    return redirect(url_for('show_sites'))


@app.route('/update_site_title', methods=['POST'])
def update_site_title():
    if not session.get('logged_in'):
        abort(401)
    # siteName = request.form['siteName']
    siteTitle = request.form['title']
    siteURL = "/site/"+SITE_NAME
    g.db.execute('UPDATE Site SET title = ? WHERE url = ?', [siteTitle, siteURL])
    g.db.commit()
    return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))


####
# menu item management
####
@app.route('/add_menu_item', methods=['POST'])
def add_menu_item():
    if not session.get('logged_in'):
        abort(401)

    idx = request.form['idx']
    item = request.form['item']
    siteName = SITE_NAME
    url = "/site/"+siteName+"/"+item.strip().lower()
    # url = request.form['url']
    logging.info("-------------- new menu item = %s", item)
    logging.info("-------------- new menu idx = %s", idx)
    logging.info("-------------- new menu url = %s", url)
    if item.strip():
        g.db.execute('INSERT INTO Menu (siteName, idx, item, url) values (?, ?, ?, ?);',
            [siteName, idx, item, url])
        g.db.execute('INSERT INTO Content (content, url) values ("<br><br><br><br><br><br>", ?);',
            [url])
        g.db.execute('INSERT INTO SidePanelState (url, state, title) values(?, 1, "undefined")',
            [url])
        g.db.commit()

    return redirect(url_for('show_home', siteName=SITE_NAME, menu=item.strip().lower()))


@app.route('/remove_menu_item', methods=['POST'])
def remove_menu_item():
    if not session.get('logged_in'):
        abort(401)

    item = request.form['item']
    url = request.form['url']

    # get menu item for this site
    cur = g.db.execute('SELECT idx, item, url FROM Menu WHERE siteName = ? ORDER BY idx;'
        , [SITE_NAME])
    menuList = [dict(idx=row[0], item=row[1], url=row[2]) for row in cur.fetchall()]
    # logging.info("------------- menuList = %s", menuList)
    firstMenu = menuList[0]['item']

    g.db.execute('DELETE FROM Menu WHERE siteName=? AND item=? AND url=?;',
        [SITE_NAME, item, url])
    g.db.execute('DELETE FROM Content WHERE url=?;', [url])
    g.db.execute('DELETE FROM SidePanelItem WHERE url=?;', [url])
    g.db.execute('DELETE FROM SidePanelState WHERE url=?;', [url])
    g.db.commit()

    return redirect(url_for('show_home', siteName=SITE_NAME, menu=firstMenu.lower()))


####
# Content update
####
@app.route('/update_content', methods=['POST'])
def update_content():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    newContent = request.form['content']
    url = request.form['url']
    logging.info('---------- update content -------- %s', newContent)
    logging.info('---------- update URL -------- %s', url)
    g.db.execute('UPDATE Content SET content = ? WHERE url = ?;',
                 [newContent, url])
    g.db.commit()
    # flash('')
    # return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))
    return json.dumps({'status':'OK','newContent':newContent,'url':url})


####
#  side panel item management
####
@app.route('/update_side_state', methods=['POST'])
def update_side_state():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    state = request.form['state']
    url = request.form['url']
    logging.info('---------- update side panel state = %s', state)
    g.db.execute('UPDATE SidePanelState SET state = ? WHERE url = ?;',
                 [state, url])
    g.db.commit()
    # flash('')
    return json.dumps({'status':'OK','panelState':state,'url':url});


@app.route('/update_side_title', methods=['POST'])
def update_side_title():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    title = request.form['title']
    url = request.form['url']
    logging.info('---------- update side panel title = %s', title)
    g.db.execute('UPDATE SidePanelState SET title = ? WHERE url = ?;',
                 [title, url])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))


@app.route('/create_side_item', methods=['POST'])
def create_side_item():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    item = request.form['item']
    url = request.form['url']

    logging.info('---------- update item -------- %s', item)

    g.db.execute('INSERT INTO SidePanelItem (item, url) VALUES (?, ?);',
                 [item, url])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))


@app.route('/update_side_item', methods=['POST'])
def update_side_item():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    logItem = request.form['item']
    logID = request.form['id']
    logging.info('---------- update item -------- %s', logItem)
    logging.info('---------- update id -------- %s', logID)
    g.db.execute('UPDATE SidePanelItem SET item = ? WHERE id = ?;',
                 [logItem, logID])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))


@app.route('/delete_side_item', methods=['POST'])
def delete_side_item():
    if not session.get('logged_in'):
        abort(401)
    # if request.method == 'GET':
    logID = request.form['id']
    logging.info('---------- update content -------- %s', logID)
    g.db.execute('DELETE FROM SidePanelItem WHERE id = ?;',
                 [logID])
    g.db.commit()
    # flash('')
    return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))


####
# Login
####
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Validate the user.
    # If the user is already authenticated return.
    if isAuthenticated():
        logging.info("----- isAuthenticated -----")
        session['logged_in'] = True
        # recordAuthenticatedUser()
        # return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))
        return redirect(BASE_URL)

    # Else if the GET parameter csticket is empty this is a new user who
    # we need to send for authentication.
    elif not request.args.get('csticket'):
        logging.info("--------------- new user, need to send for authentication")
        url = sendForAuthentication()
        logging.info(url + "\n\nredirecting\n")
        return redirect(url)

    # Else if the GET parameter csticket is populated but doesn't match
    # the session csticket send the user for authentication.
    elif request.args.get('csticket') != session['csticket']:
        logging.info("------------------ request.args.get('csticket') = %s", request.args.get('csticket'))
        logging.info("------------------ session['csticket'] = %s", session['csticket'])
        url = sendForAuthentication()
        logging.info(url + "\n\nnot valid csticket\n=============\nredirecting\n")
        return redirect(url)

    else:
        recordAuthenticatedUser()
        logging.info("------------------ Authenticated user recorded.\nfullname = %s\nusercategory = %s\ndepartment = %s\ntime = %s",
            session["fullname"],session["usercategory"],session["department"],session["authenticated"])
        session['logged_in'] = True
        return redirect(url_for('show_home', siteName=SITE_NAME, menu=MENU))

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

    logging.warning(url + "\n\nsend for authentication\n")
    return url


def recordAuthenticatedUser():
    """
    A function to record that a user is authenticated.
    """
    # Record the time authenticated.
    session["authenticated"] = str(datetime.datetime.now())
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
        # example of time string in session = 2016-03-10 08:31:44.809080
        # sessionTime = datetime.datetime.strptime(session["authenticated"], '%Y-%m-%d %H:%M:%S.%f')
        # nowTime = datetime.datetime.now()
        # expirePeriod = datetime.timedelta(seconds=10)
        # logging.info("------------- sessionTime = %s", sessionTime)
        # logging.info("------------- nowTime = %s", nowTime)
        # # check if time expired
        # if (nowTime - sessionTime ) > expirePeriod:
        #     logging.info("------------- session expired")
        #     session.clear()
        #     return "False"
        # else:
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
    logging.info('---------- Logging out %s ----------', session['fullname'])
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
    app.run(host='0.0.0.0', port=5000)