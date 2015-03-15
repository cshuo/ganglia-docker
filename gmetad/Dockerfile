FROM ubuntu:14.04
MAINTAINER cshuo

COPY ./sources.list /etc/apt/

RUN apt-get update && apt-get install -y --force-yes \
	python \
    ganglia-monitor \ 
    rrdtool \
    gmetad \
    ganglia-webfrontend

#configure gmetad and gmond 
RUN cp /etc/ganglia-webfrontend/apache.conf /etc/apache2/sites-enabled/ganglia.conf &&	sed -i 's/data_source "my cluster" localhost/data_source "my_cluster" localhost gmond1 gmond2 gmond3 gmond4/g' /etc/ganglia/gmetad.conf && sed -i 's/name = "unspecified"/name = "my_cluster"/g' /etc/ganglia/gmond.conf && sed -i 's/mcast_join = 239.2.11.71/#mcast_join = 239.2.11.71/g' /etc/ganglia/gmond.conf && sed -i '/udp_send_channel {/a\	host = 127.0.0.1' /etc/ganglia/gmond.conf && sed -i 's/bind = 239.2.11.71/#bind = 239.2.11.71/g' /etc/ganglia/gmond.conf && sed -i '$a ServerName localhost' /etc/apache2/apache2.conf

RUN apt-get install -y openssh-server 
RUN mkdir /var/run/sshd
RUN echo "root:cs" | chpasswd
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config
# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

EXPOSE 22
ENTRYPOINT service ganglia-monitor restart && service gmetad restart && service apache2 restart && /usr/sbin/sshd -D
