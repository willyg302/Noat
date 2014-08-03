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

def rest_response(response, content):
	response.headers['Content-Type'] = 'application/json'
	json.dump(content, response.out)


class Note(ndb.Model):
	'''Models a single note that can be added to Noat'''
	title = ndb.StringProperty(indexed=False)
	date = ndb.DateTimeProperty(auto_now_add=True)
	favorited = ndb.BooleanProperty()
	deleted = ndb.BooleanProperty()
	content = ndb.TextProperty()


class MainPage(webapp2.RequestHandler):

	def get(self):
		self.response.write('')


class AppHandler(webapp2.RequestHandler):

	def get(self):
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render(None))


class NoteListHandler(webapp2.RequestHandler):

	def get(self):
		'''Get all notes'''
		notes = Note.query().order(-Note.date).fetch(100)
		rest_response(self.response, [n.toDict() for n in notes])


class NoteHandler(webapp2.RequestHandler):

	def get(self, nid):
		'''Get a single note'''
		note = Note.get_by_id(int(nid))
		rest_response(self.response, note.toDict())

	def post(self, nid):
		'''Create a new note'''
		note = Note(**json.loads(self.request.body))
		note.put()
		rest_response(self.response, note.toDict())

	def put(self, nid):
		'''Edit a note'''
		note = Note.get_by_id(int(nid))
		note.populate(**json.loads(self.request.body))
		note.put()
		rest_response(self.response, note.toDict())

	def delete(self, nid):
		Note.get_by_id(int(nid)).key.delete()
		rest_response(self.response, {'success': True})


application = webapp2.WSGIApplication([
	('/', MainPage),
	('/index.html', MainPage),
	('/opensesame', AppHandler),
	('/notes', NoteListHandler),
	('/notes/(\d+)', NoteHandler),
], debug=True)