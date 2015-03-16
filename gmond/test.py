import time 
import os 

i = 0
while True:
    time.sleep(150)
    if(i<1):
        os.system("service ganglia-monitor restart")
    i += 1
