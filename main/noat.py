import os
import urllib
import json
import datetime

from json import JSONEncoder

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
	return os.environ['APP_KEY']

def auth_redirect(f):
	def check_auth(self, *args, **kwargs):
		if self.request.method != 'GET':
			self.abort(400, detail='Auth redirection can only be used for GET requests.')

		cookie = self.request.cookies.get('noat', None)
		if cookie is None or cookie != get_app_key():
			return self.redirect('/auth')

		f(self, *args, **kwargs)

	return check_auth

def get_valid_properties(request):
	d = json.loads(request.body)
	d.pop('id', None)
	d.pop('date', None)  # Don't allow date modification!
	return d


class Note(ndb.Model):
	'''Models a single note that can be added to Noat'''
	title = ndb.StringProperty(indexed=False)
	date = ndb.DateTimeProperty(auto_now_add=True)
	favorited = ndb.BooleanProperty()
	deleted = ndb.BooleanProperty()
	content = ndb.TextProperty()

	def to_dict(self):
		result = super(Note, self).to_dict()
		result['id'] = self.key.id()
		return result


class NoteEncoder(JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime.datetime):
			return obj.isoformat()
		return JSONEncoder.default(self, obj)


class RequestHandler(webapp2.RequestHandler):

	def rest(self, content):
		self.response.headers['Content-Type'] = 'application/json'
		json.dump(content, self.response.out, cls=NoteEncoder)

	def template(self, name, content={}):
		self.response.write(JINJA_ENVIRONMENT.get_template(name).render(content))


class AuthPage(RequestHandler):

	def get(self):
		self.template('auth.html')

	def post(self):
		auth = self.request.get('auth')
		if auth != get_app_key():
			return self.redirect('/auth')

		expires = datetime.datetime.now() + datetime.timedelta(30)
		cookie = Cookie.SimpleCookie()
		cookie['noat'] = get_app_key()
		cookie['noat']['expires'] = expires.strftime('%a, %d %b %Y %H:%M:%S')
		cookie['noat']['path'] = '/'
		self.response.headers.add_header('Set-Cookie', cookie['noat'].OutputString())
		return self.redirect('/')


class AppHandler(RequestHandler):

	@auth_redirect
	def get(self):
		self.template('index.html')


class NoteListHandler(RequestHandler):

	def get(self):
		'''Get all notes'''
		notes = Note.query().order(-Note.date).fetch(100)
		self.rest([n.to_dict() for n in notes])


class NoteHandler(RequestHandler):

	def get(self, nid):
		'''Get a single note'''
		note = Note.get_by_id(int(nid))
		self.rest(note.to_dict())

	def post(self, nid):
		'''Create a new note'''
		note = Note(**get_valid_properties(self.request))
		note.put()
		self.rest(note.to_dict())

	def put(self, nid):
		'''Edit a note'''
		note = Note.get_by_id(int(nid))
		note.populate(**get_valid_properties(self.request))
		note.put()
		self.rest(note.to_dict())

	def delete(self, nid):
		'''Delete a note permanently'''
		note = Note.get_by_id(int(nid))
		note.key.delete()
		self.rest(note.to_dict())


application = webapp2.WSGIApplication([
	('/', AppHandler),
	('/index.html', AppHandler),
	('/auth', AuthPage),
	('/notes', NoteListHandler),
	('/notes/(\d+)', NoteHandler),
], debug=True)
