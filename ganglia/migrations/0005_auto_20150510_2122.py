# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ganglia', '0004_resource_res_related'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('host', models.CharField(max_length=200)),
                ('res_name', models.CharField(max_length=200)),
                ('mtc_type', models.CharField(max_length=200)),
                ('time', models.CharField(max_length=200)),
                ('log_info', models.CharField(max_length=2000)),
            ],
        ),
        migrations.RemoveField(
            model_name='resource',
            name='res_related',
        ),
    ]
