from django.db import models

class ContactStatusChoices(models.Model):
    current_status = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.current_status

class Contact(models.Model):
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=9, unique=True)
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=40)
    status = models.ForeignKey(ContactStatusChoices, on_delete=models.PROTECT)
    added_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-added_date']
        app_label = 'contacts_api'
