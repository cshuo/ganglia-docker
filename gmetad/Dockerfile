FROM ubuntu:14.04
MAINTAINER cshuo

RUN mkdir /code
COPY ./sources.list /etc/apt/

RUN apt-get update && apt-get install -y --force-yes \
	python \
    ganglia-monitor \ 
    rrdtool \
    gmetad \
    ganglia-webfrontend

RUN apt-get install -y python-pip && pip install virtualenv && pip install Django

#install fuxi for ontology 
RUN pip install http://cheeseshop.python.org/packages/source/p/pyparsing/pyparsing-1.5.5.tar.gz
RUN pip install http://114.212.189.132/layercake-python.tar.bz2
RUN pip install https://pypi.python.org/packages/source/F/FuXi/FuXi-1.4.1.production.tar.gz

#configure gmetad and gmond 
RUN cp /etc/ganglia-webfrontend/apache.conf /etc/apache2/sites-enabled/ganglia.conf &&	sed -i 's/data_source "my cluster" localhost/data_source "my_cluster" localhost gmond1 gmond2 gmond3 gmond4/g' /etc/ganglia/gmetad.conf && sed -i 's/name = "unspecified"/name = "my_cluster"/g' /etc/ganglia/gmond.conf && sed -i 's/mcast_join = 239.2.11.71/#mcast_join = 239.2.11.71/g' /etc/ganglia/gmond.conf && sed -i '/udp_send_channel {/a\	host = 127.0.0.1' /etc/ganglia/gmond.conf && sed -i 's/bind = 239.2.11.71/#bind = 239.2.11.71/g' /etc/ganglia/gmond.conf && sed -i '$a ServerName localhost' /etc/apache2/apache2.conf

WORKDIR /code
