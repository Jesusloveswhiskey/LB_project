class ForceUTF8Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        content_type = response.get('Content-Type', '')
        if content_type.startswith('application/json'):
            response['Content-Type'] = 'application/json; charset=utf-8'
        return response