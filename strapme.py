project = 'Noat'

def generate_app_yaml():
	with open('dist/app.yaml', 'r+') as f:
		data = f.read().replace('{{ appname }}', raw_input('App name: '))
		f.seek(0)
		f.write(data)
		f.truncate()

def build():
	strap.run(['grunt', generate_app_yaml])

def install():
	strap.run('npm install')
	with strap.root('main'):
		strap.run('bower install')

def default():
	pass
