import os
import urllib
import json

import jinja2
import webapp2

from google.appengine.ext import ndb


JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape']
)






def login_required(handler_method):
    """A decorator to require that a user be logged in to access a handler.

    To use it, decorate your get() method like this::

        @login_required
        def get(self):
            user = users.get_current_user(self)
            self.response.out.write('Hello, ' + user.nickname())

    We will redirect to a login page if the user is not logged in. We always
    redirect to the request URI, and Google Accounts only redirects back as
    a GET request, so this should not be used for POSTs.
    """
    def check_login(self, *args, **kwargs):
        if self.request.method != 'GET':
            self.abort(400, detail='The login_required decorator '
                'can only be used for GET requests.')

        user = users.get_current_user()
        if not user:
            return self.redirect(users.create_login_url(self.request.url))
        else:
            handler_method(self, *args, **kwargs)

    return check_login



def auth_redirect(f):
	def check_auth(self, *args, **kwargs):
		






class Note(ndb.Model):
	'''Models a single note that can be added to Noat'''
	title = ndb.StringProperty(indexed=False)
	date = ndb.DateTimeProperty(auto_now_add=True)
	favorited = ndb.BooleanProperty()
	deleted = ndb.BooleanProperty()
	content = ndb.TextProperty()


class RequestHandler(webapp2.RequestHandler):

	def rest(self, content):
		self.response.headers['Content-Type'] = 'application/json'
		json.dump(content, self.response.out)

	def template(self, name, content=None):
		self.response.write(JINJA_ENVIRONMENT.get_template(name).render(content))


class MainPage(RequestHandler):

	def get(self):
		self.template('auth.html')

	def post(self):
		auth = self.request.get('auth')
		# @TODO


class AppHandler(RequestHandler):

	def get(self):
		self.template('index.html')


class NoteListHandler(RequestHandler):

	def get(self):
		'''Get all notes'''
		notes = Note.query().order(-Note.date).fetch(100)
		self.rest([n.toDict() for n in notes])


class NoteHandler(RequestHandler):

	def get(self, nid):
		'''Get a single note'''
		note = Note.get_by_id(int(nid))
		self.rest(note.toDict())

	def post(self, nid):
		'''Create a new note'''
		note = Note(**json.loads(self.request.body))
		note.put()
		self.rest(note.toDict())

	def put(self, nid):
		'''Edit a note'''
		note = Note.get_by_id(int(nid))
		note.populate(**json.loads(self.request.body))
		note.put()
		self.rest(note.toDict())

	def delete(self, nid):
		'''Delete a note'''
		Note.get_by_id(int(nid)).key.delete()
		self.rest({'success': True})


application = webapp2.WSGIApplication([
	('/', MainPage),
	('/index.html', MainPage),
	('/opensesame', AppHandler),
	('/notes', NoteListHandler),
	('/notes/(\d+)', NoteHandler),
], debug=True)