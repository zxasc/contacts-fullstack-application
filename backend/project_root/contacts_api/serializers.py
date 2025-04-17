from rest_framework import serializers
from .models import Contact, ContactStatusChoices

class ContactSerializer(serializers.ModelSerializer):
    status = serializers.SlugRelatedField(slug_field='current_status', queryset=ContactStatusChoices.objects.all())

    class Meta:
        model = Contact
        fields = '__all__'
        extra_kwargs = {
            'phone_number': {'required': True},
            'email': {'required': True},
        }