FROM ubuntu:14.04
MAINTAINER cshuo

COPY ./sources.list /etc/apt/

RUN apt-get update && apt-get install -y --force-yes \
		python \
		ganglia-monitor 

RUN sed -i 's/name = "unspecified"/name = "my_cluster"/g' /etc/ganglia/gmond.conf && sed -i 's/mcast_join/#mcast_join/g' /etc/ganglia/gmond.conf && sed -i '/bind = 239.2.11.71/{N;s/$/\n*\//}' /etc/ganglia/gmond.conf && sed -i 's/udp_recv_channel/\/*udp_recv_channel/g' /etc/ganglia/gmond.conf 

RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo "root:cs" | chpasswd 
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config
# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

EXPOSE 22
