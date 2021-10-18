from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import serializers


class User(AbstractUser):
    account_types = (
        ("bank","bank"),
        ("personal","personal"),
        ("foreign","foreign"),
        ("business","business"),
        ("gorvenment","gorvenment"),
    )
    account_type = models.CharField(max_length=64,choices=account_types)
    balance = models.FloatField(default=0)
    image = models.ImageField(upload_to=r"profile_pictures",blank=True,null=True)


class Transaction(models.Model):
    transactions_descriptions = [('deposit','deposit')]
    creditor = models.ForeignKey("User", on_delete=models.CASCADE, related_name="credit_transactions")
    debtor = models.ForeignKey("User", on_delete=models.CASCADE, related_name="debit_transactions")
    amount = models.FloatField(default=0)
    time = models.TimeField(auto_now=False, auto_now_add=True)
    date = models.DateField(auto_now=False, auto_now_add=True)
    description = models.TextField(null=True,blank=True,max_length=1000, choices=transactions_descriptions)
    creditorBalance = models.FloatField(default=0)
    debtorBalance = models.FloatField(default=0)
    charges = models.FloatField(default=0)

    class Meta:
        verbose_name = ("Transaction")
        verbose_name_plural = ("Transactions")

    def __str__(self):
        return f"{self.amount} from {self.creditor} to {self.debtor}"

    def get_absolute_url(self):
        return reverse("Transaction_detail", kwargs={"pk": self.pk})


#  model functions
def calculate_charge(amount):
    if amount<5:
        return round(0.15*amount,2)
    elif amount<10:
        return round(0.14*amount,2)
    elif amount<50:
        return round(0.12*amount,2)
    elif amount<500:
        return round(0.10*amount,2)
    elif amount<1000:
        return round(0.09*amount,2)
    elif amount<10000:
        return round(0.08*amount,2)
    elif amount<10000:
        return round(0.6*amount,2)
    elif amount<100000:
        return round(0.05*amount,2)
    elif amount<1000000:
        return round(0.04*amount,2)
    elif amount<1000000:
        return round(0.03*amount,2)
    else:
        return round(0.015*amount,2)
