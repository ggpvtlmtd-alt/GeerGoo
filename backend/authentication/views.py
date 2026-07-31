from django.http import JsonResponse

def hello(request):
    return JsonResponse({
        "message": "Welcome to GeerGoo API"
    })
    