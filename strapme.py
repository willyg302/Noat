project = 'Noat'

def generate_app_yaml():
	with open('main/app.yaml', 'r') as inf:
		with open('dist/app.yaml', 'w') as outf:
			outf.write(inf.read().replace('{{ appname }}', raw_input('App name: ')))

def install():
	strap.run('npm install')
	with strap.root('main'):
		strap.run('bower install')

def build():
	strap.run(['grunt', generate_app_yaml])

def default():
	pass
