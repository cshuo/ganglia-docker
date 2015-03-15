import time 
import os 


i = 0
while True:
    if i<3:
        os.system("service ganglia-monitor restart")
    i += 1
    time.sleep(100)

