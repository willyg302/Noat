import os
import urllib
import json
import datetime
import hashlib

import jinja2
import webapp2

import Cookie
from google.appengine.ext import ndb


JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	# To avoid clash with Angular
	variable_start_string='((',
	variable_end_string='))',
	autoescape=True
)


def get_app_key():
	return hashlib.sha256(os.environ['APP_KEY']).hexdigest()


def auth_redirect(f):
	def check_auth(self, *args, **kwargs):
		if self.request.method != 'GET':
			self.abort(400, detail='Auth redirection can only be used for GET requests.')

		cookie = self.request.cookies.get('noat', None)
		if cookie is None or cookie != get_app_key():
			return self.redirect('/')

		f(self, *args, **kwargs)

	return check_auth


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

	def template(self, name, content={}):
		self.response.write(JINJA_ENVIRONMENT.get_template(name).render(content))


class MainPage(RequestHandler):

	def get(self):
		self.template('auth.html')

	def post(self):
		auth = self.request.get('auth')
		if auth != get_app_key():
			return self.redirect('/')

		expires = datetime.datetime.now() + datetime.timedelta(30)
		cookie = Cookie.SimpleCookie()
		cookie['noat'] = get_app_key()
		cookie['noat']['expires'] = expires.strftime('%a, %d %b %Y %H:%M:%S')
		cookie['noat']['path'] = '/'
		self.response.headers.add_header('Set-Cookie', cookie['noat'].OutputString())
		return self.redirect('/opensesame')


class AppHandler(RequestHandler):

	@auth_redirect
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
		# @TODO: Handle first delete vs. permanent deletion
		Note.get_by_id(int(nid)).key.delete()
		self.rest({'success': True})


application = webapp2.WSGIApplication([
	('/', MainPage),
	('/index.html', MainPage),
	('/opensesame', AppHandler),
	('/notes', NoteListHandler),
	('/notes/(\d+)', NoteHandler),
], debug=True)
