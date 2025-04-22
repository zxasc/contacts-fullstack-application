from rest_framework import serializers
from .models import Contact, ContactStatusChoices
from django.core.validators import validate_email, RegexValidator
from rest_framework.validators import UniqueValidator

class ContactSerializer(serializers.ModelSerializer):
    status = serializers.SlugRelatedField(
        slug_field='current_status',
        queryset=ContactStatusChoices.objects.all()
    )
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=Contact.objects.all(),
                message="Email already exists"
            )
        ]
    )
    phone_number = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Contact.objects.all(),
                message="Phone number already exists"
            ),
            RegexValidator(
                regex=r'^\+?[0-9\s]{0,3}?[0-9]{9}$',
                message="Phone number must be 9-12 digits with optional country code"
            )
        ]
    )

    class Meta:
        model = Contact
        fields = '__all__'
        extra_kwargs = {
            'phone_number': {'required': True},
            'email': {'required': True},
        }

    def validate_email(self, value):
        validate_email(value)
        return value
