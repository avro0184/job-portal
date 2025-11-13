from django import forms
from django.contrib.postgres.forms import SimpleArrayField

class ArraySelectMultiple(SimpleArrayField):
    def __init__(self, base_field, choices, **kwargs):
        widget = forms.SelectMultiple(choices=choices)
        super().__init__(base_field=base_field, widget=widget, **kwargs)
