# Generated by Django 3.0.2 on 2020-09-23 08:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0003_user_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='profile_picture',
        ),
    ]
