import os 
os.system("service ganglia-monitor restart");
os.system("service gmetad restart");
os.system("service apache2 restart");
os.system("python manage.py runserver 0.0.0.0:8000");
