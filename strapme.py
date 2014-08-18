project = 'Noat'

def _npm_bower(command):
	strap.run('npm {}'.format(command))
	with strap.root('main'):
		strap.run('bower {}'.format(command))

def clean():
	_npm_bower('prune')
	_npm_bower('cache clean')

def generate_app_yaml():
	with open('dist/app.yaml', 'r+') as f:
		data = f.read().replace('{{ appname }}', raw_input('App name: '))
		f.seek(0)
		f.write(data)
		f.truncate()

def server():
	with strap.root('node_modules/.bin'):
		strap.run('http-server ../../dist')

def build():
	strap.run(['grunt', generate_app_yaml, server])

def install():
	_npm_bower('install')

def default():
	pass
