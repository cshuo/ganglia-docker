from django.contrib import admin
from ganglia.models import Resource,Metric,Host,Log

# Register your models here.

class MetricInline(admin.TabularInline):
	model = Metric
class ResInline(admin.TabularInline):
	model = Resource

class HostAdmin(admin.ModelAdmin):
	fieldsets = [
	  ('hostname',	{'fields':['host_name']}),
	  ('host_ip',	{'fields':['host_ip']}),
	]
	inlines = [ResInline]
	list_display = ('host_name','host_ip')


class ResAdmin(admin.ModelAdmin):
	fieldsets = [
	   ('name',	{'fields':['res_name']}),
	   ('type',	{'fields':['res_type'],'classes':['collapse']}),
	   ('hostname',	{'fields':['res_hostname'],'classes':['collapse']}),
	]
	inlines = [MetricInline]
	list_display = ('res_name','res_type','res_hostname')

class LogAdmin(admin.ModelAdmin):
	fieldsets = [
		('host_name',{'fields':['host']}),
		('res_name',{'fields':['res_name']}),
		('mtc_name',{'fields':['mtc_type']}),
		('log_info',{'fields':['log_info']}),
		('time',{'fields':['time']}),
	]
	list_display = ('host','res_name','mtc_type','log_info','time')


admin.site.register(Resource,ResAdmin)
admin.site.register(Host,HostAdmin)
admin.site.register(Log,LogAdmin)