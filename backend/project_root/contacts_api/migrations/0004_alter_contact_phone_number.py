# Generated by Django 5.2 on 2025-04-22 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts_api', '0003_alter_contact_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='phone_number',
            field=models.CharField(max_length=12, unique=True),
        ),
    ]
