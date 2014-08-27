project = 'Noat'

def _npm_bower(command):
	strap.run('npm {}'.format(command))
	with strap.root('main'):
		strap.run('bower {}'.format(command))

def clean():
	_npm_bower('prune')
	_npm_bower('cache clean')

def generate_app_yaml():
	import getpass
	import hashlib
	with open('dist/app.yaml', 'r+') as f:
		data = f.read() \
			.replace('{{ appname }}', raw_input('App name: ')) \
			.replace('{{ appkey }}', hashlib.sha256(getpass.getpass('App key: ')).hexdigest())
		f.seek(0)
		f.write(data)
		f.truncate()

def server():
	strap.run('node_modules/.bin/http-server dist')

def gae_server():
	strap.run('~/appengine/dev_appserver.py dist/')

def gae_upload():
	strap.run('~/appengine/appcfg.py update dist/')

def build():
	strap.run(['grunt', generate_app_yaml])

def install():
	_npm_bower('install')

def default():
	pass
