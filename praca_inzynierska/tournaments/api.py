from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import TournamentSerializer
from .models import Tournament


class CreateTournamentAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = TournamentSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['organizer'] = self.request.user
        serializer.save()

        return Response({
            "message": "Turniej został utworzony"
        })


class TournamentAPI(generics.ListAPIView):
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.order_by('-id')

    def get_object(self):
        serializer = self.get_serializer(self.queryset)
        return serializer.data
