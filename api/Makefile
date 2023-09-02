dump-requirements:
	pip freeze > requirements.txt;
	echo Dumped requirements from pip into requirements.txt

start:
	python3 -m flask --app app --debug run --host=0.0.0.0

venv:
	python3 -m venv ./api/.venv

test:
	PYTHONPATH=$(pwd):$PYTHONPATH python3 -m pytest $(ARGS)

seed:
	PYTHONPATH=$(pwd):$PYTHONPATH python3 mock/seed.py

coverage:
	PYTHONPATH=$(pwd):$PYTHONPATH python3 -m coverage run --source=app -m pytest $(ARGS)
	coverage report -m
	coverage html
