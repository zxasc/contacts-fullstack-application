from django.db import migrations

def create_default_statuses(apps, schema_editor):
    status = apps.get_model('contacts_api', 'ContactStatusChoices')
    status.objects.bulk_create([
        status(current_status='nowy'),
        status(current_status='w trakcie'),
        status(current_status='zagubiony'),
        status(current_status='nieaktualny'),
    ])


class Migration(migrations.Migration):
    dependencies = [
        ('contacts_api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_statuses),
    ]