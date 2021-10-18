from . models import *
from . serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db.models import Q

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


### Please note that the implementation of authentication is wrong because I was still a beginner ###

#	Create your views here.
class TransactionAPIView(APIView):
	def get(self,request ,transaction_type, _id):
		try:
			user = User.objects.get(id=_id)
			transactions = Transaction.objects.filter(Q(debtor=user) | Q(creditor=user)).order_by('-date')
			return JsonResponse([serializeTransaction(transaction) for transaction in transactions], safe=False)
		except:
			return Response(status=status.HTTP_404_NOT_FOUND)
		#	now obsolete 
		#	if transaction_type == "credit":
		#		transactions = user.credit_transactions.all().order_by('-id')
		#		return JsonResponse([serializeTransaction(transaction) for transaction in transactions], safe=False)
		#
		#	elif transaction_type == "debit":
		#		transactions = user.debit_transactions.all().order_by('-date')
		#		return JsonResponse([serializeTransaction(transaction) for transaction in transactions], safe=False)

		#	elif transaction_type == "all":
		#		transactions = Transaction.objects.filter(Q(debtor=user) | Q(creditor=user)).order_by('-date')
		#		return JsonResponse([serializeTransaction(transaction) for transaction in transactions], safe=False)
		#		serialized_transactions = TransactionSerializer(transactions,many=True)
		#		return Response(serialized_transactions.data)
	def post(self,request ,transaction_type, _id):
		data = request.data
		request_password = data.get('password')
		data.__delitem__('password')
		try:
			serialized_transaction = TransactionSerializer(data=data)
			if serialized_transaction.is_valid():
				#   We first run a test to check if the the prospective creditor has suffficient funds to cover bank charges and pay the amount to the recieving party
				creditor = serialized_transaction.validated_data['creditor']
				#   if (request.validated_data.get('description') == 'deposit') and (request.validated_data.get('debtor').id == 1):
				#	to be thought
				if creditor.password != request_password:
					return Response("Fraud detected",status=status.HTTP_400_BAD_REQUEST)
				if creditor.balance < (serialized_transaction.validated_data['amount'] +calculate_charge(serialized_transaction.validated_data['amount'])):
					return Response("Insufficient funds",status=status.HTTP_400_BAD_REQUEST)
				bank = User.objects.get(id=1)
				bank.balance += round(calculate_charge(serialized_transaction.validated_data['amount']),2)
				serialized_transaction.validated_data['charges'] = calculate_charge(serialized_transaction.validated_data['amount'])
				bank.save()
				creditor.balance -= round((serialized_transaction.validated_data['amount'] + calculate_charge(serialized_transaction.validated_data['amount'])),2)
				serialized_transaction.validated_data['creditorBalance'] = creditor.balance
				creditor.save()
				debtor = serialized_transaction.validated_data['debtor']
				debtor.balance += round(serialized_transaction.validated_data['amount'],2)
				serialized_transaction.validated_data['debtorBalance'] = debtor.balance
				debtor.save()
				serialized_transaction.save()
				return Response(serialized_transaction.data,status=status.HTTP_201_CREATED)
			else:
				return Response(serialized_transaction.errors,status=status.HTTP_400_BAD_REQUEST)
		except expression as identifier:
			return Response(status=status.HTTP_404_NOT_FOUND)
		


'''

class TransactionAPIViewDetails(APIView):

	def get_item(self,_id):
		try:
			transaction = Transaction.objects.get(pk=_id)
			return transaction
		except:
			return Response(status=status.HTTP_404_NOT_FOUND)

	def get(self,request,_id):
		transaction = self.get_item(_id)
		serialized_transaction = TransactionSerializer(transaction)
		return Response(serialized_transaction.data)

	# NOTE: the methods below are commented aout because transactions never have to be updated or deleted
	#   def put(self,request,_id):
	#   	transaction = self.get_item(_id)
	#   	serialized_update_transaction = TransactionSerializer(transaction,data=request.data)
	#   	if serialized_update_transaction.is_valid():
	#   		serialized_update_transaction.save()
	#   		return Response(serialized_update_transaction.data)
	#   	return Response(serialized_update_transaction.errors,status=status.HTTP_400_BAD_REQUEST)

	#   def delete(self,request,_id):
	#   	transaction = self.get_item(_id)
	#   	transaction.delete()
	#   	return Response(status=status.HTTP_204_NO_CONTENT)

'''


class UserAPIView(APIView):
	def get(self, request):
		users = User.objects.all()
		serialized_users = UserMiniSerializer(users,many=True)
		return Response(serialized_users.data)
'''
No need to create users from API they are created from admin view
	def post(self, request):
		data = request.data
		print(data)
		if data.get('image') is not None:
			print(data.get('image'))
			data['image'] = None
		serialized_user = UserFullSerializer(data=data)
		if serialized_user.is_valid():
			serialized_user.save()
			return Response(serialized_user.data,status=status.HTTP_201_CREATED)
		return Response(serialized_user.errors,status=status.HTTP_400_BAD_REQUEST)
'''
'''
	def post(self, request):
		if request.data.get('image') is not None:
			print(request.data.get('image'))
			request.data['image'] = None
		serialized_user = UserFullSerializer(data=request.data)
		if serialized_user.is_valid():
			serialized_user.save()
			return Response(serialized_user.data,status=status.HTTP_201_CREATED)
		return Response(serialized_user.errors,status=status.HTTP_400_BAD_REQUEST)
'''

class UserAPIViewDetails(APIView):

	def get_item(self,_id):
		try:
			user = User.objects.get(pk=_id)
			return user
		except:
			return Response(status=status.HTTP_404_NOT_FOUND)
	
	#	method commented out becauseit is unsafe
	#def get(self,request,_id):
	#	user = self.get_item(_id)
	#	serialized_user = UserFullSerializer(user)
	#	return Response(serialized_user.data)

	#   method to authenticate a user
	def post(self,request,_id):
		#	_id is just a placeholder to satisfy parameter requirements it is currently never read.
		#	But will be changed later.
		try:
			user = User.objects.get(id=request.data.get('id'),password=request.data.get('password'))
			serialized_user = UserFullSerializer(user)
			return Response(serialized_user.data)
		except Exception as e:
			return Response(status=status.HTTP_404_NOT_FOUND)

	def put(self,request,_id):
		if request.data.get('id') != _id:
			#	something is phishy
			return Response(status=status.HTTP_404_NOT_FOUND)
		user = self.get_item(_id)
		if request.data.get('oldPassword') != user.password:
		#	something is phishy
			return Response(status=status.HTTP_404_NOT_FOUND)
		try:
			user.email = request.data.get('email')
			user.password = request.data.get('password')
			#	print(f"new email is {user.email}")
			#	print(f"password is {user.password}")
			user.save()
			serialized_user = UserFullSerializer(user)
			return Response(serialized_user.data)
		except expression as identifier:
			return Response(serialized_update_user.errors,status=status.HTTP_400_BAD_REQUEST)
		#    serialized_update_user = UserFullSerializer(user,data=request.data)
		#    if serialized_update_user.is_valid():
		#    	serialized_update_user.save()
		#    	return Response(serialized_update_user.data)
		#return Response(serialized_update_user.errors,status=status.HTTP_400_BAD_REQUEST)

	# commented out because it is unsafe
	#def delete(self,request,_id):
	#	user = self.get_item(_id)
	#	user.delete()
	#	return Response(status=status.HTTP_204_NO_CONTENT)
