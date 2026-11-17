# builds the Option 1 rail (template content: <style> + <aside>) for mira.html's shadow root
import re,json
S='/private/tmp/claude-501/-Users-kishanpatel-ObseverOps-Dashboard-with-AI-Chat/d5e5e607-76dd-4593-be33-8c0f8aa3307a/scratchpad/'
def conv_sel(sel):
    out=[]
    for p in [x.strip() for x in re.split(r',(?![^()]*\))',sel)]:
        hc=[]; rest=p
        m=re.match(r'^(?::root|html)((?:\[data-theme="light"\])?)((?:\.[\w-]+)*)(?=\s|$|:)',rest)
        if m:
            if m.group(1): hc.append('.light')
            hc+= re.findall(r'\.[\w-]+',m.group(2)); rest=rest[m.end():].lstrip()
        m=re.match(r'^body((?:\.[\w-]+)*)(?=\s|$|:|\[)',rest)
        if m:
            hc+= re.findall(r'\.[\w-]+',m.group(1)); rest=rest[m.end():].lstrip()
        if rest.startswith(':') and not rest.startswith('::') and hc==[] and p.startswith(('html','body',':root')): pass
        host=':host'+('('+''.join(hc)+')' if hc else '') if (p.startswith(('html','body',':root'))) else ''
        if host and rest.startswith(':not('): rest=rest  # rare
        out.append((host+' '+rest).strip() if host else rest)
    return ', '.join(out)
def conv(css):
    res=[]
    def rule(sel,body):
        s=sel.strip()
        if s.startswith('@'): return None
        if re.fullmatch(r'body|html',s):
            keep=[d for d in body.split(';') if re.match(r'\s*(--|font|color|-webkit-font-smoothing|line-height|letter-spacing)',d)]
            if not keep: return ''
            body=';'.join(keep)
        return conv_sel(s)+' {'+body+'}'
    # rules are one per line from cssText (nested @media blocks contain lines)
    out=[]
    for line in css.split('\n'):
        m=re.match(r'^(\s*)([^{}@][^{]*)\{(.*)\}\s*$',line)
        if m:
            r=rule(m.group(2),m.group(3))
            if r is not None: out.append(m.group(1)+r); continue
        out.append(line)
    return '\n'.join(out)
css=conv(open(S+'sb.css').read())
o=json.load(open(S+'sb.json')); h=o['html']
h=re.sub(r'<!--.*?-->','',h,flags=re.S)
h=re.sub(r'\son[a-z]+="[^"]*"','',h)
h=re.sub(r"\son[a-z]+='[^']*'",'',h)
h=re.sub(r'\n\s*\n','\n',h)
# Mira lit, Dashboard not
h=h.replace('class="sitem on"','class="sitem"',1)
h=h.replace('class="sitem" id="sbMira"','class="sitem on" id="sbMira"').replace('id="sbMira" class="sitem"','id="sbMira" class="sitem on"')
assert 'sitem on" id="sbMira"' in h or 'id="sbMira" class="sitem on"' in h, 'mira lit'
extra=''':host{display:block;position:relative;flex:0 0 0;width:0;height:100vh;z-index:60}
'''
open(S+'o1rail.html','w').write('<style>'+css+'\n'+extra+'</style>'+open(S+'aidefs.html').read()+h)
print(len(css),len(h))
bad=[l for l in css.split('\n') if re.search(r'(^|[ ,])(html|body|:root)\b',l) and not l.strip().startswith('@')]
print('leftover html/body selectors:',len(bad)); [print(' ',b[:140]) for b in bad[:6]]
