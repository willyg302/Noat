project = 'Noat'

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
	ok.run('~/appengine/dev_appserver.py dist/')

def gae_upload():
	'''Upload Noat to App Engine'''
	ok.run('~/appengine/appcfg.py update dist/')

def build():
	'''Build Noat'''
	ok.node('gulp', module=True).run(generate_app_yaml)

def install():
	ok.npm('install').bower('install', root='main')

def default():
	ok.run(build)
