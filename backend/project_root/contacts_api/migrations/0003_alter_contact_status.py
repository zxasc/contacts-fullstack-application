# Generated by Django 5.2 on 2025-04-19 21:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts_api', '0002_add_default_statuses'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='status', to='contacts_api.contactstatuschoices'),
        ),
    ]
