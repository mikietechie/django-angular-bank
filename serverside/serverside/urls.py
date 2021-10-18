"""serverside URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from bank.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('transactions/<str:transaction_type>/<int:_id>',TransactionAPIView.as_view()),
    #    path('transactions/<int:_id>',TransactionAPIViewDetails.as_view()),
    path('users/',UserAPIView.as_view()),
    path('users/<int:_id>',UserAPIViewDetails.as_view())
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
