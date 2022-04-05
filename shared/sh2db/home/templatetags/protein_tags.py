from django import template

import re

register = template.Library()

@register.filter
def authors_short( objs ):
    authors = objs.split(',')
    if len(authors)>4:
        return ', '.join(authors[:2])+' ... '+', '.join(authors[-2:])
    else:
        return objs

@register.filter
def short_gn( obj ):
	if obj!='':
		return '.'+obj
	else:
		return ''