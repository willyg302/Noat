import os, urllib, jinja2, webapp2
from google.appengine.ext import ndb


JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'])

DEFAULT_AUTHOR_NAME = 'anonymous'
DEFAULT_AUTHOR_PASS = 'password'


class Author(ndb.Model):
	author_name = ndb.StringProperty()
	author_pass = ndb.StringProperty()


class Note(ndb.Model):
	"""Models a single note that can be added to Noat"""
	note_title = ndb.StringProperty(indexed=False)
	note_content = ndb.TextProperty()
	note_type = ndb.StringProperty()
	date = ndb.DateTimeProperty(auto_now_add=True)


def get_author_info(request):
	author = None
	author_name = request.get('n', DEFAULT_AUTHOR_NAME)
	author_pass = request.get('p', DEFAULT_AUTHOR_PASS)
	if author_name != DEFAULT_AUTHOR_NAME and author_pass != DEFAULT_AUTHOR_PASS:
		author = Author.query().filter(Author.author_name == author_name).filter(Author.author_pass == author_pass).get()
	return author, author_name, author_pass


class MainPage(webapp2.RequestHandler):

	def get(self):
		self.response.write('')


class ReadNote(webapp2.RequestHandler):

	def get(self):
		notes = []
		author, author_name, author_pass = get_author_info(self.request)

		if author != None:
			notes = Note.query(ancestor=author.key).order(-Note.date).fetch(50)

		template_values = {
			'notes': notes,
			'author_name': author_name,
			'author_pass': author_pass,
		}
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render(template_values))


# Either Creates or Updates a note, based on whether a unique note ID is given
class EditNote(webapp2.RequestHandler):

	def post(self):
		author, author_name, author_pass = get_author_info(self.request)

		if author != None:
			key_id = self.request.get('k', '')
			note_title = self.request.get('title')
			note_content = self.request.get('content')
			note_type = self.request.get('type').lower()
			if key_id:
				oldnote = Note.get_by_id(int(key_id), parent=author.key)
				oldnote.populate(note_title=note_title, note_content=note_content, note_type=note_type)
				oldnote.put()
			else:
				newnote = Note(parent=author.key, note_title=note_title, note_content=note_content, note_type=note_type)
				newnote.put()

		query_params = {
			'n': author_name,
			'p': author_pass,
		}
		self.redirect('/rnote?' + urllib.urlencode(query_params))


class DeleteNote(webapp2.RequestHandler):

	def post(self):
		author, author_name, author_pass = get_author_info(self.request)

		if author != None:
			key_id = self.request.get('k', '')
			if key_id:
				Note.get_by_id(int(key_id), parent=author.key).key.delete()

		query_params = {
			'n': author_name,
			'p': author_pass,
		}
		self.redirect('/rnote?' + urllib.urlencode(query_params))


application = webapp2.WSGIApplication([
	('/', MainPage),
	('/index.html', MainPage),
	('/rnote', ReadNote),
	('/enote', EditNote),
	('/dnote', DeleteNote),
], debug=True)