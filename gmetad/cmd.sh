service ganglia-monitor restart
service gmetad restart
service apache2 restart
python manage.py runserver 0.0.0.0:8000

