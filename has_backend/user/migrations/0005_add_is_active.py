# Generated manually: add is_active field to user_tbl
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_alter_user_tbl_email_alter_user_tbl_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_tbl',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
