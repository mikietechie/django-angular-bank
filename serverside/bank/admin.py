from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
    "id","username","first_name","last_name","balance","account_type"
    ]
    list_editable = []
    list_filter = ["account_type"]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        'id',"creditor","debtor","amount","time","date"
    ]
    list_editable = []
    list_filter = [
        "date"
    ]
