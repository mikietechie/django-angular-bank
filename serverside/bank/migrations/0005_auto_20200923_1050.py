# Generated by Django 3.0.2 on 2020-09-23 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0004_remove_user_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='uploaded_media/profile_pictures'),
        ),
    ]
