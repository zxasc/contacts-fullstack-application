# Generated by Django 5.2 on 2025-04-15 22:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ContactStatusChoices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_status', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('surname', models.CharField(max_length=30)),
                ('phone_number', models.CharField(max_length=9, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('city', models.CharField(max_length=40)),
                ('added_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='contacts_api.contactstatuschoices')),
            ],
            options={
                'ordering': ['-added_date'],
            },
        ),
    ]
