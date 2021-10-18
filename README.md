Dear Harvard CS50 Web programming with python and JavaScript staff

# Mobile Banking System Prototype

## Description
My project is a prototype of a mobile banking system. Users can deposit by visiting the bank or an ATM in this case these two are denoted by the admin where deposits can be made. From there on they can make transactions these transactions are subject to charges which are proportional to the amount in transit. These features are only available for logged in users. Inside of their account view, users are presented with a ledger view where they can track all their transactions, make new transactions and update their profiles. Adding users and making deposits can only be done at the admin or bank teller view since if these features are accessible to all ordinary users it will be a security breach. My banking system frontend is an Angular 10 Progressive Web Application which consumes the backend services which are provided by my serverside i.e. Django backend APIs. The banking system is fairly secure using both frontend and backend security. The backend app is called serverside and the frontend is called clientside. please not that you need understanding of **`djangorestframework`** i.e. rest_framework and **`angular 10`** to undeerstand the logic.

## Django backend and JavaScript frontend
My app has two Django models User and Transaction and it uses JavaScript Angular 10 framework for the frontend.

## File contents
Taking capstone file as the root of the project and assuming that your system uses the "\" file path separator. Please note that directories do not have file format extensions file => file.extension, folder => folder. Period i.e. "." denotes root directory.

### Serverside i.e. Django Project

###### .\serverside
Root folder for the backend section ie Django project.

###### .\serverside\db.sqlite3

Sqlite3 database for storing users and transactions data.


###### .\serverside\manage.py

File for command line operations in the backend it is auto created by the django-admin startapp project folder.

###### .\serverside\uploaded_media

Folder containing user uploaded profile pictures

###### .\serverside\static
Idle and empty folder would have been useful if i intended to store other static files which is a topic for the future.

###### .\serverside\serverside
Django auto created folder when i ran the commmand ```django-admin startproject serverside``` in my terminal inside the capstone directory. It contains the project configurations. Note worth in this folder is the **settings.py** and **urls.py** file.

###### .\serverside\serverside\settings.py
In __settings.py__ I have created a property configuring MEDIA_ROOT and MEDIA_URL, I added my bank app alongside two other third party apps **rest_framework** and **corsheaders** to the INSTALLED_APPS property array, I added a property for the CORS headers __CORS_ORIGIN_WHITELIST__ and finally I added __'corsheaders.middleware.CorsMiddleware'__ in the MIDDLEWARE property array.

###### .\serverside\serverside\urls.py
In the __urls.py__ file I added the bank app URLs which map to views I have defined in the .\bank\views.py. I added them here because creating them in the bank app was throwing some "redirecting cross origin requests forbidden errors". I also added medial files configurations.

###### .\serverside\bank
My bank app folder. Contains all the banking system logic.

###### .\serverside\bank\admin.py
It is the admin interface configuration file for models defined in *.\serverside\bank\models.py*. Inside i created two classes inheriting from ```admin.ModelAdmin```, one for the **User Model** and the other for the **Transaction Model**.

###### .\serverside\bank\models.py
It stores the model or entity declaration for my banking system i.e. User and Transaction. **User Model** inherits from ```django.contrib.auth.models.AbstractUser``` . It has two three other properties:
- account_type
- balance
- image: i.e. profile picture

**Transaction Model** inherits from ```models.Model```.

Inside the models file is also a **charges** function for calculating bank charges.

###### .\serverside\bank\serializers.py
A file that contains serializer classes for my system models in *.\serverside\bank\models.py*.


###### .\serverside\bank\views.py
A file containing my url views constructed as classes it mostly depends on ```rest_frameworks``` functions and classes. These views return JSON Responses or are RESTFUL in nature. Their responses are serialized JSON objects thanks to the classes in *.\serverside\bank\serializers.py*.

It has two four classes for the two models. Each model has two classes one for ```get requests and post requests``` and the other for ```get, put and delete```.These views inherit from  ```rest_framework.views.APIView```. It is important to note that i finnaly commented out the logic for **deleting and creating users** since these are to be only executed from the bank tellers desk or admin view. I also commented out the logic for **updating and deleting posts** since it would result in loss of integrity if users could delete or update transactions.

### Clientside i.e. Angular 10 project
**NB the files are too many to all be referenced hence i will mention a few but if you have a basic understanding of Angular 7+ they are self documenting**

###### .\clientside\package.json
NodeJS file for storing project mete data.

###### .\clientside\angular.json
Angular project meta data and configurations

###### .\clientside\src
Folder containing the clientside application its logic factory (*app folder contents*), the root *index.html*, base styles *styles.css*.

###### .\clientside\src\environments
A folder containing *clientside\src\environments\environment.ts* which contains some global environment data. Not to be edited.

###### .\clientside\src\assets
A folder images for my home page carousel it also contains the *font-awesome* and *ionicons* libraries. Do not edit.

###### .\clientside\src\app
Main work place contains all that is rendered on the users screen. It has two *angular modules*: ```app module``` and ```material module```.

**material module's** role is to provide an angular10 material globally accessible environment which it exports from its *.\clientside\src\app\material\material.module.ts*.

**app module** bundles up every thing else and it is the one that is booted.

###### .\clientside\src\app\app-routing.module.ts
File containing clientside route definations`.

###### .\clientside\src\app\pipes
Contains a pipe for formating serverside media urls. Used in application for user profile picture `img url`.

###### .\clientside\src\app\services
Contains two services. **.\clientside\src\app\services\auth.service.ts** and **clientside\src\app\services\item.service.ts**. The first one is for global authentication and the later is a shared service for exchanging data with server's or Django Backend REST API's.

###### .\clientside\src\app\interfaces
Interfaces contains a class or interface declaration file **.\clientside\src\app\interfaces\user.ts**. It is never read because i ruled out he logic for users registering themselves on their own.

###### .\clientside\src\app\home
A beautiful landing page.

###### .\clientside\src\app\account
Folder with main component **\.clientside\src\app\account\account.component** for displaying a logged in users bank dash board view. Contains subcomponents for **updating user profile, makink transactions, view profile, view transaction, view full ledger view dibit transactions and view credit transactions**. It is only accessible if you are logged in or else you will be redirected to home view where you can login from there

## Passwords and credentials
To log into the bank account view you use your account number which corresponds to your user id and your password
#### System Admin
id: 1

username: mikez

password: 1234

#### System All the other users
id: 2-6

username: varies plus it is not need for authentication purposes

password: 1234



## Requirements satisfaction
1. It contains more than  one model in the Python backend models.
2. It uses JavaScript for the front end in fact it uses a JavaScript framework Angular 10.
3. My applications UI is responsive to different screen sizes thanks to bootstrap and angular material libraries.
4. It is fairly distinct from all the other CS50 course projects.
