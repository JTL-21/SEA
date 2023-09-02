start:
	./.venv/bin/python3 -m flask --app app --debug run --host=0.0.0.0
	
dump-requirements:
	./.venv/bin/python3 -m pip freeze > requirements.txt;
	echo Dumped requirements from pip into requirements.txt

venv:
	python3 -m venv ./.venv

test:
	PYTHONPATH=$(pwd):$(PYTHONPATH) ./.venv/bin/python3 -m pytest $(ARGS)

seed:
	PYTHONPATH=$(pwd):$(PYTHONPATH) ./.venv/bin/python3 mock/seed.py

coverage:
	PYTHONPATH=$(pwd):$(PYTHONPATH) ./.venv/bin/python3 -m coverage run --source=app -m pytest $(ARGS)
	coverage report -m
	coverage html
