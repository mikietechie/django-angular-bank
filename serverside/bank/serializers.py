from rest_framework import serializers
from .models import *


class UserFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ "id", "password", "username", "first_name", "last_name", "email", "account_type", "image", "balance","is_staff"]

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ "id", "username", "account_type", "image"]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"


def serializeTransaction(transaction):
    return {
        "transactionID": transaction.id,
        "creditor": {"id":transaction.creditor.id, "username":transaction.creditor.username, "account_type":transaction.creditor.account_type, "image":transaction.creditor.image.url},
        "debtor": {"id":transaction.debtor.id, "username":transaction.debtor.username, "account_type":transaction.debtor.account_type, "image":transaction.debtor.image.url},
        "amount": transaction.amount,
        "time": transaction.time,
        "date": transaction.date.strftime("%b %d, %Y"),
        "description": transaction.description,
        "creditorBalance": transaction.creditorBalance,
        "debtorBalance": transaction.debtorBalance,
        "charges": transaction.charges
    }
