import time 
import os 

i = 0;

while True:
    if i < 5:
        os.system("service ganglia-monitor restart")
        os.system("service gmetad restart")
        os.system("service apache2 restart")
    i += 1
    time.sleep(100)

