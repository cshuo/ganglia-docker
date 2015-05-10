from django.db import models

# Create your models here.
class Host(models.Model):
	host_name = models.CharField(max_length=200)
	host_ip = models.CharField(max_length=200)
	def __unicode__(self):
		return self.host_name

class Resource(models.Model):
	host = models.ForeignKey(Host)
	res_hostname = models.CharField(max_length=200)
	res_name = models.CharField(max_length=200)
	res_type = models.CharField(max_length=200)
	def __unicode__(self):
		return self.res_name

class Metric(models.Model):
	resource = models.ForeignKey(Resource)
	metric_name = models.CharField(max_length=200)
	mtr_hostname = models.CharField(max_length=200)
	def __unicode__(self):
		return self.metric_name


class Log(models.Model):
	host = models.CharField(max_length=200)
	res_name = models.CharField(max_length=200)
	mtc_type = models.CharField(max_length=200)
	time = models.DateTimeField('date of log')
	log_info = models.CharField(max_length=2000)
	def __unicode__(self):
		return self.res_name + "_log"

	
	
