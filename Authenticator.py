# This class will enable the developer to authenticate that their users
# have a valid University of Manchester account.

# @author Yichen Lu (yichen.lu529@gmail.com)
# Transfer from Iain Hart's (iain@cs.man.ac.uk) PHP code into Python
# @date 2nd Feb 2016

from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
import uuid
import logging
import sys
import time

# program requiring authentication.
DEVELOPER_URL = "http://178.62.125.116:5000/home"

# Define the location of the service on the Computer Science server.
AUTHENTICATION_SERVICE_URL = "http://studentnet.cs.manchester.ac.uk/authenticate/"

# Define the location of CAS's logtout service on the Computer Science server.
AUTHENTICATION_LOGOUT_URL = "http://studentnet.cs.manchester.ac.uk/systemlogout.php"

class Authenticator(object):

    def __init__(self, studylevel=False):
        super(Authenticator, self).__init__()
        self.studylevel = studylevel


    def validateUser(self):
        """
        A static function to validate that a user has a University of Manchester
        account. If the user is not authenticated the program will exit.
        """
        # If the user is already authenticated return.
        if self.isAuthenticated():
            logging.warning("----- isAuthenticated -----")
            return True

        # Else if the GET parameter csticket is empty this is a new user who
        # we need to send for authentication.
        elif not request.args.get('csticket'):
            logging.warning("----- 1 -----")
            self.sendForAuthentication()

        # Else if the GET parameter csticket is populated but doesn't match
        # the session csticket send the user for authentication.
        elif request.args.get('csticket')!= session['csticket']:
            self.sendForAuthentication()

        else:
            self.recordAuthenticatedUser()


    def isAuthenticated(self):
        """
        A static function to determine whether a user is already authenticated.
        @return boolean (true if authenticated, false if not)
        """
        # When a user is authenticated the session["authenticated"] is
        # populated with a timestamp. If a numerical value is held return true.
        authenticatedtimestamp = self.getTimeAuthenticated()

        if len(authenticatedtimestamp)!=0 and authenticatedtimestamp.isdigit():
            return True
        else:
            return False


    # A static function to send a user to the authentication service.
    def sendForAuthentication(self):
        logging.warning("----- 2 -----")
        # Generate a unique ticket.
        csticket = str(uuid.uuid1())

        # Save the ticket so we can confirm the same user is returning from
        # the authentication service.
        session["csticket"] = csticket

        # Send the user to the School of Computer Science's server to validate.
        # Append to the url the GET parameters 'url' which tells the
        # authentication service where to return and append the csticket which
        # will be used to confirm that the same user is returning.
        url = AUTHENTICATION_SERVICE_URL+"?url="+DEVELOPER_URL+"&csticket="+csticket

        # See if the developer requires the study level of the user.
        if (self.studylevel):
            url += "&studylevel=true"

        logging.warning(url)
        redirect(url)
        # sys.exit() # TODO: is this correct?
        # Respons(status=500)



    # A static function to call if the developer requires the user's level
    # of study. Note that this must be called before validateUser()
    def requireStudyLevel(self):
        self.studylevel = True



    # A static function to reject a user who has failed to authenticate.
    def rejectUser():
        logging.warning("----- reject -----")
        # sys.exit("Authentication failure")
        redirect("http://178.62.125.116:5000")




    # A static function to record that a user is authenticated.
    def recordAuthenticatedUser():
        # Record the time authenticated.
        session["authenticated"] = int(time.time())

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



    # A static function to get the timestamp when the user authenticated.
    # @return string
    def getTimeAuthenticated(self):
        if session.get("authenticated"):
            return session["authenticated"]
        else:
            return false





    # A static function to get the user's username as returned by the
    # authentication service.
    # @return string
    def getUsername(self):
        return session["username"]



    # A static function to get the user's department as returned by the
    # authentication service.
    # @return string
    def getUserDepartment(self):
        return session["department"]



    # A static function to get the user's year of study if the developer
    # has called requireStudyLevel() before validating the user.
    # @return string
    def getStudyLevel(self):
        if len(session["studylevel"])==0:
            return "Unknown"
        return session["studylevel"]




    # A static function to get the user's full name as returned by the
    # authentication service.
    # @return string
    def getFullName(self):
        return session["fullname"]



    # A static function to invalidate a user. This function will remove the
    # data from the global variable session
    def invalidateUser(self):
        session.clear()
        redirect(AUTHENTICATION_LOGOUT_URL)



    # A static function to get the user's category. Options are staff, student,
    # unknown.
    # @return string
    def getUserCategory():
        return session["usercategory"]


