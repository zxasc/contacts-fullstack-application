from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ContactStatusChoices
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    #filterset_fields = ['status__current_status']

@api_view(['GET'])
def get_status_options(request):
    statuses = ContactStatusChoices.objects.values_list('current_status', flat=True)
    return Response(list(statuses))
