# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ganglia', '0005_auto_20150510_2122'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log',
            name='time',
            field=models.DateTimeField(verbose_name=b'date of log'),
        ),
    ]
