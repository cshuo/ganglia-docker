FROM ubuntu:14.04
MAINTAINER cshuo

RUN mkdir /code
ADD . /code
COPY ./sources.list /etc/apt/

RUN apt-get update && apt-get install -y --force-yes \
	python \
	ganglia-monitor 

RUN sed -i 's/name = "unspecified"/name = "my_cluster"/g' /etc/ganglia/gmond.conf && sed -i 's/mcast_join/#mcast_join/g' /etc/ganglia/gmond.conf && sed -i '/bind = 239.2.11.71/{N;s/$/\n*\//}' /etc/ganglia/gmond.conf && sed -i 's/udp_recv_channel/\/*udp_recv_channel/g' /etc/ganglia/gmond.conf 

WORKDIR /code
