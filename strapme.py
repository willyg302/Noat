project = 'Noat'

def _npm_bower(command):
	strap.npm(command)
	strap.bower(command, root='main')

def clean():
	_npm_bower('prune')
	_npm_bower('cache clean')

def generate_app_yaml():
	'''Generate production app.yaml'''
	import getpass
	import hashlib
	with open('dist/app.yaml', 'r+') as f:
		data = f.read() \
			.replace('{{ appname }}', raw_input('App name: ')) \
			.replace('{{ appkey }}', hashlib.sha256(getpass.getpass('App key: ')).hexdigest())
		f.seek(0)
		f.write(data)
		f.truncate()

def gae_server():
	'''Run local App Engine server'''
	strap.run('~/appengine/dev_appserver.py dist/')

def gae_upload():
	'''Upload Noat to App Engine'''
	strap.run('~/appengine/appcfg.py update dist/')

def build():
	'''Build Noat'''
	strap.node('gulp', module=True).run(generate_app_yaml)

def install():
	_npm_bower('install')

def default():
	strap.run(build)
