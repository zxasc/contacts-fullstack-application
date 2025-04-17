import requests
from django.http import JsonResponse

def get_weather_data(request, city):
    headers = {'User-Agent': 'SupraBrokersBackend/1.0'}

    try:
        # Nominatim API call
        nominatim_response = requests.get(
            f'https://nominatim.openstreetmap.org/search?q={city}&format=json&limit=1',
            headers=headers,
            timeout=5
        )
        nominatim_response.raise_for_status()

        if not nominatim_response.json():
            return JsonResponse({'error': 'City not found'}, status=404)

        lat = nominatim_response.json()[0]['lat']
        lon = nominatim_response.json()[0]['lon']

        # Open-Meteo API call
        meteo_response = requests.get(
            f'https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true',
            timeout=5
        )
        meteo_response.raise_for_status()

        return JsonResponse(meteo_response.json()['current_weather'])

    except requests.exceptions.RequestException as e:
        return JsonResponse({
            'error': f'API request failed: {str(e)}',
            'type': type(e).__name__
        }, status=500)