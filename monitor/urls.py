from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^ganglia/', include('ganglia.urls',namespace="ganglia")),
    url(r'^admin/', include(admin.site.urls)),
)
