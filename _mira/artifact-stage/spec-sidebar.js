
/* ── Sidebar · Option 2: PIN, GROUP and FILTER on the chat list (request, 20 Nov 2026) ───────────────────────────────
   Option 1 is the page as it is. Option 2 keeps the page's own chat rows - in the DOM, hidden, so the page's own click /
   delete / search keep working - and paints a second list from them. A MutationObserver on the hidden list repaints this
   one, so the two never disagree.
   LAYOUT, from Mobbin (Claude, ChatGPT, Sana, Lindy, Dropbox Dash - 20 Nov 2026, "fix the alignment, padding"):
   - ONE text edge: the Chats header, every section label, every chat title and the filter line start at the same x.
   - THREE TIERS ("show the difference between the group, the chat and the group title"): section titles are small
     uppercase labels, groups are medium with a folder and a count pill, chats are regular and - inside a group - hang
     off a guide line under the folder icon.
   - Filter: Show = Pinned only, Time; no divider between them.
   GROUPS, INLINE (request, 20 Nov 2026: Topology's Create Custom View › View Group flow - then "we do not need the
   [drawer]; it will be set inside the sidebar without opening one"). Topology's View Groups behaviour, in the list itself:
   - New group: a name row with ✓ / ✕ at the top of Groups (Enter / Esc too), Topology's error messages.
   - Hover a group: rename (in place, ✓ / ✕) and ⋯ (Ungroup; Delete when empty). Groups are ONE level - Add child group
     was removed on request (20 Nov 2026: "we can't create a group inside a group").
   - ⋯ › Move to group on a chat: the list goes into MOVE MODE - a strip at the top ("Move <chat> · pick a group",
     Cancel · Move), groups become pickable, the picked one previews the chat inside it, everything else dims. Nothing
     moves until Move; Move is off until a different group is picked. Double-click a group moves at once.
   The Select (multi-select) button was REMOVED on request (20 Nov 2026).
   Icons: Tabler via build_stage.py (free-icons, never hand-drawn). Colours: the page's --mira-* tokens. */
var MXS_ICO=/*MXS_ICONS*/{};
/* groups: {id, name, parent (id or null), open}; MXS.of[chatId] = the group id it is filed in.
   ed = the open name row: {k:'add', par:null|gid} or {k:'ren', id:chatOrGroupId}; mv = move mode {chat, sel} */
var MXS={fold:{pinned:false,groups:false,recent:false},on:false,pin:{},groups:[],of:{},filter:{show:'all',time:'any'},ed:null,err:'',val:'',mv:null,gseq:0,menu:null};
function mxsI(n,c){ return '<span class="mxs-ic'+(c?' '+c:'')+'" aria-hidden="true">'+(MXS_ICO[n]||'')+'</span>'; }
function mxsRows(){ return $$('.mira-recents-list > li.mira-recent').map(function(li){ var a=$('a.mira-side-row.is-chat',li); if(!a) return null; var id=a.getAttribute('data-mx-chat');
    return {li:li,a:a,id:id,name:$('.mira-recent-name',a).textContent.trim(),t:MX.at[id]||Date.now(),hid:li.classList.contains('mx-hide')||li.style.display==='none'}; }).filter(Boolean); }
function mxsG(id){ return MXS.groups.filter(function(g){ return g.id===id; })[0]||null; }
/* groups list A-Z until someone reorders them (Move up / Move down, request 23 Nov 2026); from then on by MXS order,
   and a group made later goes to the end */
function mxsKids(pid){ return MXS.groups.filter(function(g){ return (g.parent||null)===(pid||null); }).sort(function(a,b){
  if(MXS.gord){ var ao=a.ord==null?1e9:a.ord, bo=b.ord==null?1e9:b.ord; if(ao!==bo) return ao-bo; } return a.name.localeCompare(b.name); }); }
function mxsGMoveTo(gid,j){ var g=mxsG(gid); if(!g) return false; var sib=mxsKids(g.parent||null), i=sib.indexOf(g); if(i<0||j<0||j>=sib.length||i===j) return false;
  sib.splice(j,0,sib.splice(i,1)[0]); sib.forEach(function(x,k){ x.ord=k; }); MXS.gord=true; return true; }
function mxsGMove(gid,d){ var g=mxsG(gid); if(!g) return; var i=mxsKids(g.parent||null).indexOf(g); if(!mxsGMoveTo(gid,i+d)) return; mxsMenuClose(); mxsPaint();
  /* the menu stays open on the group, so it can be moved again */
  var nb=$('.mxs [data-mxs="gmenu"][data-g="'+gid+'"]'); if(nb) mxsGroupMenu(nb,gid); }
function mxsUnder(gid,anc){ for(var g=mxsG(gid);g;g=mxsG(g.parent)) if(g.id===anc) return true; return false; }
function mxsPath(gid){ var p=[]; for(var g=mxsG(gid);g;g=mxsG(g.parent)) p.unshift(g.name); return p.join(' › '); }
function mxsDeep(gid){ var n=0; Object.keys(MXS.of).forEach(function(c){ var g=MXS.of[c]; if(g===gid||mxsUnder(g,gid)) n++; }); return n; }
function mxsFiltered(){ var f=MXS.filter; return f.show!=='all'||f.time!=='any'; }
/* EVERY filter style carries the same actions (request, 23 Nov 2026): Show · Last activity · Group by · Sort by · Reset to
   defaults · New group. Reset puts all four back. */
function mxsDefault(){ return !mxsFiltered()&&(MXS.sort||'new')==='new'&&(MXS.gby||'none')==='none'; }
function mxsResetAll(){ MXS.filter={show:'all',time:'any'}; MXS.sort='new'; MXS.gby='none'; }
var MXS_GBY=[['none','None'],['date','Date'],['group','Group']], MXS_SORT=[['new','Newest first'],['old','Oldest first'],['name','Name (A\u2013Z)']];
function mxsPass(r){ var f=MXS.filter, age=(Date.now()-r.t)/864e5;
  if(f.show==='pinned'&&!MXS.pin[r.id]) return false;
  if(f.time==='today'&&bandOf(r.t)!=='Today') return false; if(f.time==='7d'&&age>7) return false; if(f.time==='30d'&&age>30) return false; return !r.hid; }
var MXS_SHOW=[['pinned','Pinned']], MXS_TIME=[['any','Any time'],['today','Today'],['7d','Last 7 days'],['30d','Last 30 days']];
function mxsLab(list,v){ return (list.filter(function(x){ return x[0]===v; })[0]||[])[1]||''; }
/* the inline name row - Topology's add row: a field, ✓ (primary) and ✕, and the error under the field */
function mxsNameRow(icon,ph,val,pad,d){ return '<li class="mxs-li'+(d!=null?' is-kid':'')+'"'+(d!=null?' style="--d:'+d+'"':'')+'><div class="mxs-nr" style="padding-left:'+pad+'px">'+(icon?mxsI(icon):'')+
    '<div class="mxs-nf"><input class="mxs-in'+(MXS.err?' is-err':'')+'" value="'+esc(val)+'" placeholder="'+esc(ph)+'" aria-label="'+esc(ph)+'" aria-invalid="'+!!MXS.err+'">'+
    (MXS.err?'<div class="mxs-err">'+esc(MXS.err)+'</div>':'')+'</div><button type="button" class="mxs-ok" data-mxs="edok" title="Save" aria-label="Save">'+(MXS_ICO.check||'')+'</button>'+
    '<button type="button" class="mxs-no" data-mxs="edx" title="Cancel" aria-label="Cancel">'+(MXS_ICO.x||'')+'</button></div></li>'; }
/* the section titles open and close (request, 20 Nov 2026: "Pinned, Groups and Recent will expand / collapse", ChatGPT's
   "Pinned ⌄ / Pinned ›"): the title is a button - its name, then a small chevron AFTER it, down when open and right when
   closed. Collapsing hides that section's rows; the title stays. */
/* Section titles (Pinned · Groups · Recent) fold their section from the title (chevron on hover). "Sections without collapse"
   (request, 23 Nov 2026, added as its own option: MXS.nofold, state o2-nofold) makes them plain labels, every section open. */
function mxsSec(k,label,tail){
  if(MXS.nofold) return '<li class="mxs-h'+(tail?' has-act':'')+'" data-sec="'+k+'"><span class="mxs-ht">'+esc(label)+'</span>'+(tail||'')+'</li>';
  var open=!MXS.fold[k]; return '<li class="mxs-h'+(tail?' has-act':'')+'" data-sec="'+k+'"><button type="button" class="mxs-hb" data-mxs="sec" data-k="'+k+'" aria-expanded="'+open+'">'+esc(label)+
    '<span class="mxs-hc" aria-hidden="true">'+(MXS_ICO[open?'chevron-down':'chevron-right']||'')+'</span></button>'+(tail||'')+'</li>'; }
/* GROUP ACTION ON THE SECTION TITLE (request, 20 Nov 2026: "the create group action will show on the Groups line, right side,
   as a new option"): New group leaves the Chats header and sits at the right end of the Groups title, where the thing it
   makes will appear. The Groups title then shows even with no groups, so the action is always reachable. Picked by
   MXS.gpos = 'sec' (the stage's "Option 2 · Group action on title"); the header button stays the default. */
function mxsGAct(){ var on=MXS.ed&&MXS.ed.k==='add'&&!MXS.ed.par;
  return '<button type="button" class="mxs-ha'+(on?' is-open':'')+'" data-mxs="newgroup" title="New group" aria-label="New group">'+(MXS_ICO['folder-plus']||'')+'</button>'; }
/* the filter button; with MXS.fpos = 'sec' (Sections without collapse, request 23 Nov 2026) it sits at the right end of the
   Recent title instead of the Chats header, the way New group sits on the Groups title */
function mxsFBtn(cls,filt,mv){ return '<button type="button" class="'+cls+(filt?' is-on':'')+(MXS.menu&&MXS.menu.f||MXS.fopt==='3'&&MXS.fbar?' is-open':'')+'" data-mxs="filter" title="Filter chats" aria-label="Filter chats'+(filt?' (filtered)':'')+'" aria-haspopup="menu"'+(mv?' disabled':'')+'>'+(MXS_ICO.filter||'')+(filt?'<i class="mxs-dot" aria-hidden="true"></i>':'')+'</button>'; }
function mxsRowHTML(r,depth,moving){ var on=r.a.classList.contains('is-active'), menu=MXS.menu&&MXS.menu.id===r.id, pad=depth==null?8:32+depth*16;
  if(MXS.ed&&MXS.ed.k==='ren'&&MXS.ed.id===r.id) return mxsNameRow('','Chat name',MXS.val||r.name,pad,depth);
  return '<li class="mxs-li'+(depth!=null?' is-kid':'')+(menu?' is-menu':'')+'"'+(depth!=null?' style="--d:'+depth+'"':'')+'>'+
    '<a href="#" class="mxs-row'+(on&&!moving?' is-active':'')+(moving?' is-moving':'')+'" data-mxs="row" data-id="'+r.id+'" title="'+esc(r.name)+'"'+(on?' aria-current="page"':'')+' style="padding-left:'+pad+'px">'+
      '<span class="mxs-name">'+esc(r.name)+'</span>'+(moving?'<span class="mxs-tag">Moving</span>':'')+'</a>'+
    (MXS.mv?'':'<button type="button" class="mxs-more" data-mxs="rmenu" data-id="'+r.id+'" title="More" aria-label="More actions for '+esc(r.name)+'" aria-haspopup="menu" aria-expanded="'+menu+'">'+(MXS_ICO.dots||'')+'</button>')+'</li>'; }
function mxsDimLi(html,dim){ return dim?html.replace('class="','class="mxs-dim '):html; }
function mxsPaint(){ var host=$('.mira-recents'); if(!host||!MXS.on) return; var box=$('.mxs',host);
  if(!box){ box=document.createElement('div'); box.className='mxs'; host.appendChild(box); }
  var ae=document.activeElement, hadIn=ae&&ae.classList.contains('mxs-in');
  var rows=mxsRows(), byId={}, pass=rows.filter(mxsPass), f=MXS.filter, filt=mxsFiltered(), mv=MXS.mv, h='';
  rows.forEach(function(r){ byId[r.id]=r; });
  box.classList.toggle('is-moving',!!mv); box.classList.toggle('is-cdrag',!!MXS.cdragId);
  h+='<div class="mxs-bar"><span class="mxs-t">Chats</span>'+
    (MXS.fpos==='sec'?'':mxsFBtn('mxs-ib',filt,mv))+
    (MXS.gpos==='sec'?'':'<button type="button" class="mxs-ib'+(MXS.ed&&MXS.ed.k==='add'&&!MXS.ed.par?' is-open':'')+'" data-mxs="newgroup" title="New group" aria-label="New group">'+(MXS_ICO['folder-plus']||'')+'</button>')+'</div>';
  if(mv){ var mr=byId[mv.chat], from=MXS.of[mv.chat]||null, ok=mv.sel&&mv.sel!==from;
    h+='<div class="mxs-mv" role="status"><div class="mxs-mvt">Move <b>'+esc(mr?mr.name:'chat')+'</b></div><div class="mxs-mvd">'+(mv.sel?'To '+esc(mxsPath(mv.sel)):'Pick a group below')+(from?' · now in '+esc(mxsPath(from)):'')+'</div>'+
      '<div class="mxs-mvb"><button type="button" class="mxs-btn" data-mxs="mvcancel">Cancel</button><button type="button" class="mxs-btn is-pri" data-mxs="mvgo"'+(ok?'':' disabled')+'>Move</button></div></div>'; }
  if(MXS.fopt==='3'&&MXS.fbar&&!mv&&MXS.fpos!=='sec') h+=mxsFilterBar();
  if(false&&filt&&!mv&&MXS.fopt!=='3') h+='<div class="mxs-fs"><span>'+[mxsLab(MXS_SHOW,f.show==='all'?'':f.show),mxsLab(MXS_TIME,f.time==='any'?'':f.time)].filter(Boolean).join(' · ')+' · '+pass.length+' of '+rows.length+'</span><button type="button" data-mxs="clear">Clear</button></div>';
  h+='<ul class="mxs-list">';
  var isMv=function(id){ return !!(mv&&mv.chat===id); }, moved=function(id){ return isMv(id)&&!!mv.sel; };
  /* in move mode the moving chat leaves its place and shows (previewed) under the picked group */
  var pins=pass.filter(function(r){ return MXS.pin[r.id]&&!moved(r.id); });
  if(!pins.length&&MXS.cdragId) h+=mxsSec('pinned','Pinned')+'<li class="mxs-li mxs-dz">Drop here to pin</li>';
  if(pins.length){ h+=mxsDimLi(mxsSec('pinned','Pinned'),!!mv); if(!MXS.fold.pinned) pins.forEach(function(r){ h+=mxsDimLi(mxsRowHTML(r,null,isMv(r.id)),mv&&!isMv(r.id)); }); }
  var fileOf=function(id){ return moved(id)?mv.sel:MXS.of[id]; };
  /* a pinned chat stays listed in its group too: pin and group are independent (request, 23 Nov 2026) */
  var own=function(g){ var a=pass.filter(function(r){ return fileOf(r.id)===g.id; }), co=MXS.cord||{};
    return a.map(function(r,i){ return [r,i]; }).sort(function(x,y){ var p=co[x[0].id], q=co[y[0].id]; p=p==null?1e9+x[1]:p; q=q==null?1e9+y[1]:q; return p-q; }).map(function(x){ return x[0]; }); };
  var any=function(g){ return own(g).length||mxsKids(g.id).some(any); };
  var gHTML='';
  if(MXS.ed&&MXS.ed.k==='add'&&!MXS.ed.par) gHTML+=mxsNameRow('folder','Group name',MXS.val,8);
  var walk=function(g,d){ if(filt&&!mv&&!any(g)) return; var menu=MXS.menu&&MXS.menu.g===g.id, pad=8+d*16, n=mxsDeep(g.id), open=g.open||!!(mv&&mv.sel&&(mv.sel===g.id||mxsUnder(mv.sel,g.id)));
    if(mv&&mv.sel){ var fr=MXS.of[mv.chat]; n=n-(fr&&(fr===g.id||mxsUnder(fr,g.id))?1:0)+(mv.sel===g.id||mxsUnder(mv.sel,g.id)?1:0); }
    if(MXS.ed&&MXS.ed.k==='ren'&&MXS.ed.id===g.id) gHTML+=mxsNameRow(open?'folder-open':'folder','Group name',MXS.val||g.name,pad,d?d-1:null);
    else { var picked=!!(mv&&mv.sel===g.id);
      gHTML+='<li class="mxs-li mxs-g'+(open?' is-open':'')+(menu?' is-menu':'')+(picked?' is-picked':'')+(d?' is-kid':'')+'"'+(d?' style="--d:'+(d-1)+'"':'')+'>'+
      '<button type="button" class="mxs-row mxs-grow" data-mxs="'+(mv?'gpick':'gtoggle')+'" data-g="'+g.id+'" '+(MXS.gdrag&&!mv?'title="Drag to reorder · Alt + ↑ / ↓" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown" ':'')+(mv?'aria-pressed="'+picked+'"':'aria-expanded="'+!!open+'"')+' style="padding-left:'+pad+'px">'+
      (MXS.gdrag&&!mv&&!MXS.cdrag?'<span class="mxs-gi">'+mxsI(open?'folder-open':'folder')+mxsI('grip-vertical','is-grip')+'</span>':mxsI(open?'folder-open':'folder'))+'<span class="mxs-name">'+esc(g.name)+'</span>'+(picked?mxsI('check','is-ck'):n?'<span class="mxs-gn" aria-label="'+n+' chats">'+n+'</span>':'')+'</button>'+
      (mv?'':'<span class="mxs-gact"><button type="button" class="mxs-gb" data-mxs="gren" data-g="'+g.id+'" title="Rename group" aria-label="Rename group '+esc(g.name)+'">'+(MXS_ICO.pencil||'')+'</button>'+
        /* no Add child group: groups are ONE level (request, 20 Nov 2026: "we can't create a group inside a group") */
        '<button type="button" class="mxs-gb" data-mxs="gmenu" data-g="'+g.id+'" title="More" aria-label="More actions for group '+esc(g.name)+'" aria-haspopup="menu" aria-expanded="'+menu+'">'+(MXS_ICO.dots||'')+'</button></span>')+'</li>'; }
    if(!open) return;
    if(MXS.ed&&MXS.ed.k==='add'&&MXS.ed.par===g.id) gHTML+=mxsNameRow('folder','Child group name',MXS.val,8+(d+1)*16,d);
    mxsKids(g.id).forEach(function(k){ walk(k,d+1); }); own(g).forEach(function(r){ gHTML+=mxsRowHTML(r,d,isMv(r.id)); });
    if(!filt&&!own(g).length&&!mxsKids(g.id).length&&!(MXS.ed&&MXS.ed.par===g.id)) gHTML+='<li class="mxs-li mxs-gempty is-kid" style="--d:'+d+';padding-left:'+(32+d*16)+'px">Empty</li>'; };
  mxsKids(null).forEach(function(g){ walk(g,0); });
  if(MXS.gpos==='sec'&&!mv){ if(gHTML||!filt) h+=mxsSec('groups','Groups',mxsGAct())+(MXS.fold.groups?'':gHTML); }
  else if(gHTML) h+=mxsSec('groups','Groups')+(MXS.fold.groups?'':gHTML);
  /* three sections - 1 Pinned, 2 Groups, 3 RECENT (request, 20 Nov 2026: "Recent - in this show all chats"): Recent is every
     chat, newest first, so a pinned or grouped chat is listed in its section AND here. It replaced the date bands. */
  /* Recent lists only the chats that are neither pinned nor in a group (request, 23 Nov 2026) - a pinned or grouped chat
     is shown in Pinned / its group, not a second time here */
  var srt=MXS.sort||'new', recent=pass.filter(function(r){ return !MXS.pin[r.id]&&!fileOf(r.id); }).sort(function(a,b){ return srt==='old'?a.t-b.t:srt==='name'?a.name.localeCompare(b.name):b.t-a.t; });
  var fbLi=MXS.fpos==='sec'&&MXS.fopt==='3'&&MXS.fbar&&!mv?'<li class="mxs-fbli">'+mxsFilterBar()+'</li>':'';
  if(MXS.fpos==='sec'&&!recent.length) h+=mxsDimLi(mxsSec('recent','Recent',mxsFBtn('mxs-ha',filt,mv)),!!mv)+fbLi;   /* the filter must stay reachable */
  /* Group by (Filter · Nested menu, 23 Nov 2026): Recent split by Date (Today · Yesterday · Last 7 days · Last 30 days · Older)
     or by Group (each group's name, then No group); None is one list. Sort by orders the rows inside each heading. */
  var gby=MXS.gby||'none', bucket=function(r){ if(gby==='group'){ var g=MXS.of[r.id]&&mxsG(MXS.of[r.id]); return g?g.name:'No group'; }
    var age=(Date.now()-r.t)/864e5; return bandOf(r.t)==='Today'?'Today':age<2?'Yesterday':age<=7?'Last 7 days':age<=30?'Last 30 days':'Older'; };
  var BK=gby==='date'?['Today','Yesterday','Last 7 days','Last 30 days','Older']:gby==='group'?mxsKids(null).map(function(g){ return g.name; }).concat(['No group']):null;
  if(recent.length){ h+=mxsDimLi(mxsSec('recent','Recent',MXS.fpos==='sec'?mxsFBtn('mxs-ha',filt,mv):''),!!mv)+fbLi;
    if(!MXS.fold.recent){ if(!BK) recent.forEach(function(r){ h+=mxsDimLi(mxsRowHTML(r,null,false),!!mv); });
      else BK.forEach(function(k){ var rs=recent.filter(function(r){ return bucket(r)===k; }); if(!rs.length) return;
        h+='<li class="mxs-sub">'+esc(k)+'</li>'; rs.forEach(function(r){ h+=mxsDimLi(mxsRowHTML(r,null,false),!!mv); }); }); } }
  h+='</ul>';
  if(!pass.length) h+='<div class="mxs-empty">No chats match these filters. <button type="button" data-mxs="clear">Clear filters</button></div>';
  box.innerHTML=h;
  var inp=$('.mxs-in',box); if(inp){ inp.focus(); inp.setSelectionRange(inp.value.length,inp.value.length); if(!hadIn&&MXS.ed&&MXS.ed.k==='ren') inp.select(); } }
function mxsRepaint(){ cancelAnimationFrame(MXS.raf); MXS.raf=requestAnimationFrame(mxsPaint); }

/* ── menus: one at a time on <body>, anchored to the button ── */
function mxsMenuClose(){ $$('.mxs-menu').forEach(function(m){ m.remove(); }); if(MXS.menu){ MXS.menu=null; mxsPaint(); } }
function mxsPlace(m,r){ var w=m.offsetWidth, hh=m.offsetHeight, x=Math.max(8,Math.min(r.left,window.innerWidth-w-8)), y=r.bottom+4; if(y+hh>window.innerHeight-8) y=Math.max(8,r.top-4-hh); m.style.left=x+'px'; m.style.top=y+'px'; }
function mxsMenu(btn,html,key){ $$('.mxs-menu').forEach(function(x){ x.remove(); }); MXS.menu=key; var m=document.createElement('div'); m.className='mxs-menu'; m.setAttribute('role','menu'); m.innerHTML=html;
  document.body.appendChild(m); mxsPlace(m,btn.getBoundingClientRect()); mxsPaint(); }
function mxsMI(act,label,icon,attr,cls,tail){ return '<button type="button" role="menuitem" class="mxs-mi'+(cls?' '+cls:'')+'" data-mxs="'+act+'"'+(attr||'')+'>'+mxsI(icon||'')+'<span class="mxs-ml">'+label+'</span>'+(tail||'')+'</button>'; }
/* MOVE TO GROUP is a submenu (request, 20 Nov 2026: "when I hover Move to group, show every group name; I pick one and it
   moves") - it replaced the move-mode strip with Cancel · Move. Hover (or click / → on) the item: every group, the current
   one ticked, then New group… (names a group in the list and files the chat in it) and Remove from group when it is in one.
   Picking a group moves the chat at once. */
function mxsSub(item,id){ $$('.mxs-menu.is-sub').forEach(function(x){ x.parentNode.removeChild(x); }); $$('.mxs-mi.is-open').forEach(function(x){ x.classList.remove('is-open'); x.setAttribute('aria-expanded','false'); });
  var cur=MXS.of[id]||null, h='';
  mxsKids(null).forEach(function(g){ var on=g.id===cur; h+=mxsMI('mmto',esc(g.name),'folder',' data-id="'+id+'" data-g="'+g.id+'"'+(on?' aria-current="true"':''),on?'is-on':'',on?'<span class="mxs-ic is-tail" aria-hidden="true">'+(MXS_ICO.check||'')+'</span>':''); });
  if(!MXS.groups.length) h+='<div class="mxs-mnone">No groups yet</div>';
  h+='<div class="mxs-ms" role="separator"></div>'+mxsMI('mnewg','New group…','folder-plus',' data-id="'+id+'"')+(cur?mxsMI('mungroup','Remove from group','folder-off',' data-id="'+id+'"'):'');
  var m=document.createElement('div'); m.className='mxs-menu is-sub'; m.setAttribute('role','menu'); m.innerHTML=h; document.body.appendChild(m);
  var r=item.getBoundingClientRect(), w=m.offsetWidth, hh=m.offsetHeight, x=r.right+4, y=r.top-5; if(x+w>innerWidth-8) x=r.left-w-4; if(y+hh>innerHeight-8) y=Math.max(8,innerHeight-hh-8);
  m.style.left=Math.max(8,x)+'px'; m.style.top=y+'px'; item.classList.add('is-open'); item.setAttribute('aria-expanded','true'); }
function mxsRowMenu(btn,id){ var p=!!MXS.pin[id];
  mxsMenu(btn,mxsMI('mpin',p?'Unpin':'Pin',p?'pinned-off':'pin',' data-id="'+id+'"')+mxsMI('mmove','Move to group','folder-symlink',' data-id="'+id+'" aria-haspopup="menu" aria-expanded="false"','','<span class="mxs-ic is-tail" aria-hidden="true">'+(MXS_ICO['chevron-right']||'')+'</span>')+
    mxsMI('mren','Rename','pencil',' data-id="'+id+'"')+'<div class="mxs-ms" role="separator"></div>'+mxsMI('mdel','Delete','trash',' data-id="'+id+'"','is-danger'),{id:id}); }
function mxsGroupMenu(btn,gid){ var empty=!mxsDeep(gid), g=mxsG(gid), sib=mxsKids(g&&g.parent||null), gi=sib.indexOf(g);
  mxsMenu(btn,mxsMI('gup','Move up','arrow-up',' data-g="'+gid+'"'+(gi<=0?' disabled':''))+mxsMI('gdown','Move down','arrow-down',' data-g="'+gid+'"'+(gi<0||gi>=sib.length-1?' disabled':''))+
    '<div class="mxs-ms" role="separator"></div>'+mxsMI('gungroup','Ungroup','folder-off',' data-g="'+gid+'"')+(empty?'<div class="mxs-ms" role="separator"></div>'+mxsMI('gdel','Delete group','trash',' data-g="'+gid+'"','is-danger'):''),{g:gid}); }
/* FILTER OPTION 2 (request, 20 Nov 2026: "on this filter create Option 2; the current option is not removed"). Option 1 is the
   list menu below and stays the default. Option 2 is the Mobbin-based popover (Wise, Sketch, Mercury, Wix): a title with
   Reset, Pinned only as a SWITCH, the date range as ONE segmented row, and a live "N of M chats" line; it applies as you
   click and stays open. Picked by MXS.fopt = '2' (the stage's "Option 2 · Filter · Option 2"). */
var MXS_TCHIP=[['any','Any time'],['today','Today'],['7d','7 days'],['30d','30 days']];
function mxsFilterHTML(){ var f=MXS.filter, rows=mxsRows(), n=rows.filter(mxsPass).length, on=f.show==='pinned', set=mxsFiltered();
  var seg=function(cls,lab,val,opts){ return '<div class="mxf-l">'+lab+'</div><obs-radio class="'+cls+'" as-button size="small" aria-label="'+lab+'" value="'+val+'" options=\''+JSON.stringify(opts.map(function(x){ return {value:x[0],label:x[2]||x[1]}; }))+'\'></obs-radio>'; };
  return '<div class="mxf-h"><span>Filter chats</span><button type="button" class="mxf-reset" data-mxs="clear"'+(mxsDefault()?' disabled':'')+'>Reset</button></div>'+

    '<div class="mxf-l" id="mxfDate">Last activity</div>'+
    '<obs-radio class="mxf-seg" as-button size="small" aria-label="Date" value="'+f.time+'" options=\''+JSON.stringify(MXS_TCHIP.map(function(x){ return {value:x[0],label:x[1]}; }))+'\'></obs-radio>'+
    seg('mxf-gby','Group by',MXS.gby||'none',MXS_GBY)+seg('mxf-sort','Sort by',MXS.sort||'new',[['new','','Newest'],['old','','Oldest'],['name','','Name']])+
    '<div class="mxf-n" aria-live="polite">'+(set?n+' of '+rows.length+' chats':'All '+rows.length+' chats')+'</div>'+
    '<div class="mxf-ft"><button type="button" class="mxs-mi" data-mxs="newgroup">'+mxsI('folder-plus')+'<span class="mxs-ml">New group</span></button></div>'; }
document.addEventListener('change',function(e){ var r=e.target, cl=r&&r.classList; if(!cl||!(cl.contains('mxf-seg')||cl.contains('mxf-gby')||cl.contains('mxf-sort'))) return;
  var v=Array.isArray(e.detail)?e.detail[0]:e.detail; if(v==null) return; v=String(v);
  if(cl.contains('mxf-gby')) MXS.gby=v; else if(cl.contains('mxf-sort')) MXS.sort=v; else MXS.filter.time=v; mxsPaint();
  var m=$('.mxs-menu.mxf'); if(!m) return; var rows=mxsRows(), n=rows.filter(mxsPass).length, set=mxsFiltered(), c=m.querySelector('.mxf-n'), rs=m.querySelector('.mxf-reset');
  if(c) c.textContent=set?n+' of '+rows.length+' chats':'All '+rows.length+' chats'; if(rs) rs.disabled=mxsDefault(); },true);
function mxsFilterRefresh(){ var m=$('.mxs-menu.mxf'); if(m) m.innerHTML=mxsFilterHTML(); }
/* FILTER OPTION 3 (request, 20 Nov 2026: "create Option 3; the current options are not removed"): no popover - the funnel
   opens a row of CHIPS inside the sidebar, under the Chats header: Pinned (on / off) and Today · 7 days · 30 days (one at a
   time; click the picked one again to drop it), then Clear when anything is on. The list updates as you click; the funnel
   closes the row. Picked by MXS.fopt = '3' (the stage's "Option 2 · Filter · Option 3"). */
function mxsFilterBar(){ var f=MXS.filter, c=function(k,label,on){ return '<button type="button" class="mxs-fc'+(on?' is-on':'')+'" data-mxs="fb" data-k="'+k+'" aria-pressed="'+on+'">'+label+'</button>'; };
  return '<div class="mxs-fb" role="group" aria-label="Filter chats">'+c('today','Today',f.time==='today')+c('7d','7 days',f.time==='7d')+c('30d','30 days',f.time==='30d')+
    ['gby','sort'].map(function(k){ var d=MXS_F4[k], v=mxsF4Val(k), o=d.o.filter(function(x){ return x[0]===v; })[0]||d.o[0], dv=v!==(k==='gby'?'none':'new');
      return '<button type="button" class="mxs-fc mxs-fcd'+(dv?' is-on':'')+'" data-mxs="f4row" data-k="'+k+'" aria-haspopup="menu">'+(k==='gby'?'Group':'Sort')+': '+o[2]+'<span class="mxs-ic" aria-hidden="true">'+(MXS_ICO['chevron-down']||'')+'</span></button>'; }).join('')+
    (mxsDefault()?'':'<button type="button" class="mxs-fx" data-mxs="clear">Reset</button>')+'</div>'; }
function mxsFilterMenu(btn){ if(MXS.fopt==='3'){ MXS.fbar=!MXS.fbar; mxsPaint(); return; }
  if(MXS.fopt==='4'){ mxsF4Menu(btn); return; }
  if(MXS.fopt==='2'){ mxsMenu(btn,mxsFilterHTML(),{f:1}); var m=$('.mxs-menu'); if(m) m.classList.add('mxf'); return; }
  /* the list scrolls in a short box; Reset and New group stay pinned under it (request, 23 Nov 2026: "small, the rest scrollable") */
  var f=MXS.filter, h='<div class="mxs-msc">', gb=MXS.gby||'none', so=MXS.sort||'new';   /* no "Show" title over Pinned (request, 23 Nov 2026) */
  h+='<div class="mxs-mh">Last activity</div>';   /* no Pinned item (request, 24 Nov 2026) */   /* no divider between Show and Time (request, 20 Nov 2026) */
  MXS_TIME.forEach(function(x){ var on=f.time===x[0]; h+=mxsMI('ftime',x[1],on?'check':'',' data-v="'+x[0]+'" role="menuitemradio" aria-checked="'+on+'"',on?'is-on':''); });
  h+='<div class="mxs-ms" role="separator"></div><div class="mxs-mh">Group by</div>';
  MXS_GBY.forEach(function(x){ var on=gb===x[0]; h+=mxsMI('fgby',x[1],on?'check':'',' data-v="'+x[0]+'" role="menuitemradio" aria-checked="'+on+'"',on?'is-on':''); });
  h+='<div class="mxs-mh">Sort by</div>';
  MXS_SORT.forEach(function(x){ var on=so===x[0]; h+=mxsMI('fsort',x[1],on?'check':'',' data-v="'+x[0]+'" role="menuitemradio" aria-checked="'+on+'"',on?'is-on':''); });
  h+='</div><div class="mxs-ms" role="separator"></div>'+mxsMI('clear','Reset to defaults','x',mxsDefault()?' disabled':'')+mxsMI('newgroup','New group','folder-plus');
  mxsMenu(btn,h,{f:1});
  var sc=$('.mxs-menu .mxs-msc'), on=sc&&sc.querySelector('.mxs-mi.is-on'); if(on&&on.offsetTop>sc.clientHeight-40) sc.scrollTop=on.offsetTop-sc.clientHeight/2; }
/* FILTER · NESTED MENU (request, 23 Nov 2026, Claude's chat-list filter as the reference): no section titles - each filter is
   ONE row with its current value on the right and a submenu (Show · Last activity, then Sort by), then Reset to defaults and
   New group (Claude's "New section"). Picking a value applies it and closes the menu. MXS.fopt = '4', state o2-filter4. */
var MXS_F4={ show:{t:'Show',o:[['all','All chats','All'],['pinned','Pinned','Pinned']]},
  time:{t:'Last activity',o:[['any','Any time','Any'],['today','Today','Today'],['7d','Last 7 days','7 days'],['30d','Last 30 days','30 days']]},
  gby:{t:'Group by',o:[['none','None','None'],['date','Date','Date'],['group','Group','Group']]},
  sort:{t:'Sort by',o:[['new','Newest first','Newest'],['old','Oldest first','Oldest'],['name','Name (A\u2013Z)','Name']]} };
function mxsF4Val(k){ return k==='sort'?(MXS.sort||'new'):k==='gby'?(MXS.gby||'none'):MXS.filter[k]; }
function mxsF4Row(k){ var d=MXS_F4[k], v=mxsF4Val(k), o=d.o.filter(function(x){ return x[0]===v; })[0]||d.o[0];
  return '<button type="button" role="menuitem" class="mxs-mi mxs-f4r" data-mxs="f4row" data-k="'+k+'" aria-haspopup="menu" aria-expanded="false"><span class="mxs-ml">'+d.t+'</span><span class="mxs-fv">'+o[2]+'</span><span class="mxs-ic is-tail" aria-hidden="true">'+(MXS_ICO['chevron-right']||'')+'</span></button>'; }
function mxsF4Menu(btn){ var dflt=!mxsFiltered()&&(MXS.sort||'new')==='new'&&(MXS.gby||'none')==='none';
  var h=mxsF4Row('time')   /* no Show row (request, 24 Nov 2026) */+'<div class="mxs-ms" role="separator"></div>'+mxsF4Row('gby')+mxsF4Row('sort')+'<div class="mxs-ms" role="separator"></div>'+
    mxsMI('f4reset','Reset to defaults','',dflt?' disabled':'')+'<div class="mxs-ms" role="separator"></div>'+mxsMI('newgroup','New group','');
  mxsMenu(btn,h,{f:1}); var m=$('.mxs-menu'); if(m) m.classList.add('mxf4'); }
function mxsF4Sub(item,k){ $$('.mxs-menu.is-sub').forEach(function(x){ x.parentNode.removeChild(x); }); $$('.mxs-mi.is-open').forEach(function(x){ x.classList.remove('is-open'); x.setAttribute('aria-expanded','false'); });
  var d=MXS_F4[k], v=mxsF4Val(k), h='';
  d.o.forEach(function(x){ var on=x[0]===v; h+=mxsMI('f4set',x[1],'',' data-k="'+k+'" data-v="'+x[0]+'" role="menuitemradio" aria-checked="'+on+'"',on?'is-on':'',on?'<span class="mxs-ic is-tail" aria-hidden="true">'+(MXS_ICO.check||'')+'</span>':''); });
  if(!MXS.menu) MXS.menu={fsub:1};
  var m=document.createElement('div'); m.className='mxs-menu is-sub mxf4'; m.setAttribute('role','menu'); m.innerHTML=h; document.body.appendChild(m);
  var r=item.getBoundingClientRect(), w=m.offsetWidth, hh=m.offsetHeight, x=r.right+4, y=r.top-5; if(x+w>innerWidth-8) x=r.left-w-4; if(y+hh>innerHeight-8) y=Math.max(8,innerHeight-hh-8);
  m.style.left=Math.max(8,x)+'px'; m.style.top=y+'px'; item.classList.add('is-open'); item.setAttribute('aria-expanded','true'); }
/* A switch + date-chips popover (Wise / Sketch / Mercury / Wix on Mobbin) was built and REVERTED on request, 20 Nov 2026 -
   the list menu above is the one to keep. */

/* ── the name row: save / cancel (Topology's grpAddSave rules) ── */
function mxsOrig(id){ return $('.mira-recents-list a.mira-side-row.is-chat[data-mx-chat="'+id+'"]'); }
function mxsEdCancel(){ MXS.ed=null; MXS.err=''; MXS.val=''; mxsPaint(); }
function mxsEdSave(){ var inp=$('.mxs .mxs-in'), ed=MXS.ed; if(!inp||!ed) return; var v=inp.value.replace(/›/g,'').trim(); MXS.val=inp.value;
  var g=ed.k==='ren'?mxsG(ed.id):null;
  if(ed.k==='ren'&&!g){ MXS.ed=null; MXS.val=''; MXS.err='';   /* a chat */
    if(v){ var a=mxsOrig(ed.id); if(a){ $('.mira-recent-name',a).textContent=v; a.title=v; var p=MX.panes[ed.id], c=p&&$('.mira-crumb.is-current',p); if(c){ c.textContent=v; c.title=v; } if(MX.cur===ed.id) hdPaint($('#mxPane').firstElementChild,ed.id); } }
    mxsPaint(); return; }
  if(!v){ MXS.err='Group Name is required'; mxsPaint(); return; }
  var par=ed.k==='add'?(ed.par||null):(g.parent||null);
  if(MXS.groups.some(function(x){ return (x.parent||null)===par&&x.name.toLowerCase()===v.toLowerCase()&&(!g||x.id!==g.id); })){ MXS.err='A group with this name already exists here'; mxsPaint(); return; }
  if(g) g.name=v;
  else { var ng={id:'g'+(++MXS.gseq),name:v,parent:par,open:true}; MXS.groups.push(ng); if(par) mxsG(par).open=true; if(MXS.mv) MXS.mv.sel=ng.id; if(ed.move){ MXS.of[ed.move]=ng.id; toast('Group “'+v+'” created, chat moved in'); } else toast('Group “'+v+'” created'); }
  MXS.ed=null; MXS.err=''; MXS.val=''; mxsPaint(); }


/* ── the HOVER CARD (request, 20 Nov 2026: "remove the date or time; show it when I hover, like Ask AI") ───────────────
   Ask AI's chat-history preview (index.html: aiChatPeek / .aihov): after a 260ms beat, a 330px card beside the list -
   the chat's name, what it did, then "N messages · Today 6 mins ago" under a hairline. A recorded chat is summarised
   from its own thread (Ask AI's aiChatSummary fallback: the first question, then how many answers); the three demo
   chats added for Option 2 carry a line of their own. It sits in <body>, fixed, so the sidebar cannot clip it. */
var MXS_SUM={'Disk usage on Linux hosts':['Ranked the Linux hosts by disk used and flagged the two over 90%.',3],
  'Interface flaps on core-sw-01':['Traced the flapping to Gi1/0/24 on core-sw-01 and listed the up/down events.',4],
  'Monthly SLA report':['Summarised October availability per service against the 99.5% target.',2]};
function mxsThreadOf(id){ var p=MX.panes[id], t=p&&$('.mira-thread-list',p); if(t&&t.children.length) return t; var tp=tpl(id); return tp?$('.mira-thread-list',tp.content):null; }
function mxsSummary(id,name){ if(MXS_SUM[name]) return {s:MXS_SUM[name][0],n:MXS_SUM[name][1]};
  var t=mxsThreadOf(id), us=t?$$('.mira-message.is-user',t):[], as=t?$$('.mira-message.is-assistant',t):[], q=us[0]&&$('.mira-user-bubble',us[0]);
  q=q?q.textContent.replace(/\s+/g,' ').trim():''; if(q.length>80) q=q.slice(0,78).replace(/\s+\S*$/,'')+'…';
  return {s:q?'Started with “'+q+'”'+(as.length?' — '+as.length+' answer'+(as.length===1?'':'s')+' so far.':'.'):'No questions asked in this chat yet.',n:us.length}; }
function mxsWhen(t){ var mins=Math.round((Date.now()-t)/6e4), d=new Date(t);
  if(bandOf(t)==='Today'){ if(mins<1) return 'just now'; if(mins<60) return mins+' min'+(mins===1?'':'s')+' ago'; var hr=Math.round(mins/60); return hr+' hour'+(hr===1?'':'s')+' ago'; }
  var h=d.getHours(), ap=h>=12?'pm':'am'; h=h%12||12; return h+':'+String(d.getMinutes()).padStart(2,'0')+' '+ap; }
function mxsHovOff(){ clearTimeout(MXS.hovT); var c=$('.mxs-hov'); if(c) c.parentNode.removeChild(c); MXS.hovFor=null; }
function mxsHovOn(row){ var id=row.getAttribute('data-id'); if(MXS.hovFor===id) return; mxsHovOff(); MXS.hovFor=id;
  MXS.hovT=setTimeout(function(){ if(MXS.mv||MXS.menu||!document.contains(row)) return; var r=mxsRows().filter(function(x){ return x.id===id; })[0]; if(!r) return;
    var sm=mxsSummary(id,r.name), el=document.createElement('div'); el.className='mxs-hov'; el.setAttribute('role','tooltip');
    el.innerHTML='<b>'+esc(r.name)+'</b><p>'+esc(sm.s)+'</p><div class="mxs-hovf">'+sm.n+' message'+(sm.n===1?'':'s')+' · '+esc(bandOf(r.t))+' '+esc(mxsWhen(r.t))+'</div>';
    document.body.appendChild(el); var as=$('aside.mira-sidebar'), sr=as?as.getBoundingClientRect():{right:0}, rr=row.getBoundingClientRect(), w=el.offsetWidth;
    el.style.left=Math.min(innerWidth-w-8,sr.right+8)+'px'; el.style.top=Math.max(8,Math.min(rr.top-6,innerHeight-el.offsetHeight-8))+'px'; },260); }
/* ── actions ── */
function mxsMoveGo(){ var mv=MXS.mv; if(!mv||!mv.sel||mv.sel===(MXS.of[mv.chat]||null)) return; MXS.of[mv.chat]=mv.sel; for(var q=mxsG(mv.sel);q;q=mxsG(q.parent)) q.open=true;
  var nm=(mxsRows().filter(function(r){ return r.id===mv.chat; })[0]||{}).name||'Chat'; MXS.mv=null; MXS.ed=null; toast('“'+nm+'” moved to '+mxsPath(mv.sel)); mxsPaint(); }
function mxsAct(b){ var a=b.getAttribute('data-mxs'), id=b.getAttribute('data-id'), gid=b.getAttribute('data-g'), g=gid&&mxsG(gid);
  if(a==='edok'){ mxsEdSave(); return; }
  if(a==='edx'){ mxsEdCancel(); return; }
  if(a==='row'){ if(MXS.mv) return; var o=mxsOrig(id); if(o) o.click(); mxsRepaint(); return; }
  if(a==='filter'){ if(MXS.menu&&MXS.menu.f){ mxsMenuClose(); return; } mxsFilterMenu(b); return; }
  if(a==='rmenu'){ if(MXS.menu&&MXS.menu.id===id){ mxsMenuClose(); return; } mxsRowMenu(b,id); return; }
  if(a==='gmenu'){ if(MXS.menu&&MXS.menu.g===gid){ mxsMenuClose(); return; } mxsGroupMenu(b,gid); return; }
  if(a==='gup'||a==='gdown'){ mxsGMove(gid,a==='gup'?-1:1); return; }
  if(a==='mvgo'){ mxsMoveGo(); return; }
  if(a==='mmove'){ mxsSub(b,id); return; }
  if(a==='f4row'){ mxsF4Sub(b,b.getAttribute('data-k')); return; }
  if(a==='f4set'||a==='f4reset'){ if(a==='f4reset'){ MXS.filter={show:'all',time:'any'}; MXS.sort='new'; MXS.gby='none'; } else { var fk=b.getAttribute('data-k'), fv=b.getAttribute('data-v'); if(fk==='sort') MXS.sort=fv; else if(fk==='gby') MXS.gby=fv; else MXS.filter[fk]=fv; }
    mxsMenuClose(); mxsPaint(); return; }
  if(a==='mmto'){ mxsMenuClose(); var tg=mxsG(gid), nm=(mxsRows().filter(function(r){ return r.id===id; })[0]||{}).name||'Chat';
    if(MXS.of[id]===gid){ toast('“'+nm+'” is already in '+tg.name); return; } MXS.of[id]=gid; tg.open=true; toast('“'+nm+'” moved to '+tg.name); mxsPaint(); return; }
  if((a==='fshow'||a==='ftime'||a==='clear')&&b.closest('.mxs-menu.mxf')){ if(a==='fshow') MXS.filter.show=MXS.filter.show==='pinned'?'all':'pinned'; else if(a==='ftime') MXS.filter.time=b.getAttribute('data-v'); else mxsResetAll(); mxsPaint(); mxsFilterRefresh(); return; }
  if(b.closest('.mxs-menu')){ $$('.mxs-menu').forEach(function(x){ x.remove(); }); MXS.menu=null; }
  MXS.err='';
  if(a==='sec'){ var k=b.getAttribute('data-k'); MXS.fold[k]=!MXS.fold[k]; mxsPaint(); return; }
  if(a==='newgroup'){ MXS.fold.groups=false; }
  if(a==='newgroup'){ MXS.ed=MXS.ed&&MXS.ed.k==='add'&&!MXS.ed.par?null:{k:'add',par:null}; MXS.val=''; }
  else if(a==='mnewg'){ MXS.ed={k:'add',par:null,move:id}; MXS.val=''; }
  else if(a==='gren'||a==='mren'){ MXS.ed={k:'ren',id:gid||id}; MXS.val=''; }
  else if(a==='gpick'){ MXS.mv.sel=gid; }
  else if(a==='mvcancel'){ MXS.mv=null; MXS.ed=null; }
  else if(a==='mpin'){ if(MXS.pin[id]){ delete MXS.pin[id]; toast('Unpinned'); } else { MXS.pin[id]=1; toast('Pinned'); } }
  else if(a==='mdel'){ delete MXS.of[id]; delete MXS.pin[id]; del(id); }
  else if(a==='gtoggle') g.open=!g.open;
  else if(a==='gungroup'||a==='gdel'){ var drop=MXS.groups.filter(function(x){ return x.id===gid||mxsUnder(x.id,gid); }).map(function(x){ return x.id; }), n=0;
    Object.keys(MXS.of).forEach(function(c){ if(drop.indexOf(MXS.of[c])>=0){ delete MXS.of[c]; n++; } }); MXS.groups=MXS.groups.filter(function(x){ return drop.indexOf(x.id)<0; });
    toast(a==='gdel'?'Group deleted':'Ungrouped · '+n+' chat'+(n===1?'':'s')+' back in the list'); }
  else if(a==='fb'){ var k=b.getAttribute('data-k'); if(k==='pinned') MXS.filter.show=MXS.filter.show==='pinned'?'all':'pinned'; else MXS.filter.time=MXS.filter.time===k?'any':k; }
  else if(a==='fshow') MXS.filter.show=MXS.filter.show===b.getAttribute('data-v')?'all':b.getAttribute('data-v');
  else if(a==='ftime') MXS.filter.time=b.getAttribute('data-v');
  else if(a==='fgby') MXS.gby=b.getAttribute('data-v');
  else if(a==='fsort') MXS.sort=b.getAttribute('data-v');
  else if(a==='clear') mxsResetAll();
  mxsPaint(); }

/* geometry: .mxs has a 4px side inset and rows 8px inner padding, so every text starts on one x; a folder's icon is
   16px + 8px gap, so its chats indent to the folder NAME; each level adds 16px. Rows 32px, 2px apart, 6px radius. */
var MXS_CSS='.mxs-on .mira-recents-list{display:none!important}'+
 '.mxs{--mxs-in:8px;position:relative;display:flex;flex-direction:column;min-height:0;padding:0 4px 12px}'+
 '.mxs-gi{position:relative;display:inline-grid}.mxs-gi .is-grip{position:absolute;inset:0;opacity:0}'+
 '.mxs-g:not(.is-kid)>.mxs-grow:hover .mxs-gi>.mxs-ic:first-child,.mxs-g.is-drag .mxs-gi>.mxs-ic:first-child{opacity:0}'+
 '.mxs-g:not(.is-kid)>.mxs-grow:hover .mxs-gi .is-grip,.mxs-g.is-drag .mxs-gi .is-grip{opacity:1;color:var(--mira-text-toned)}'+
 '.mxs-g:not(.is-kid)>.mxs-grow:has(.mxs-gi){cursor:grab}'+
 '.mxs-g.is-drag{position:relative;z-index:5;border-radius:6px;background:var(--mira-surface-raised);box-shadow:0 0 0 1px var(--mira-accent-25);pointer-events:none}'+
 'body.mxs-dragging,body.mxs-dragging *{cursor:grabbing!important;user-select:none}'+
 '.mxs-row.is-src{opacity:.4}'+
 '.mxs-ghost{position:fixed;z-index:7000;display:flex;align-items:center;gap:6px;max-width:220px;height:28px;padding:0 10px;border:1px solid var(--mira-panel-edge);border-radius:6px;background:var(--mira-surface-raised);box-shadow:var(--mira-menu-shadow);color:var(--mira-text-strong);font-size:12.5px;pointer-events:none;opacity:.92}'+
 '.mxs-ghost span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mxs-ghost .mxs-ic{color:var(--mira-text-muted)}.mxs-ghost.is-ok{border-color:var(--mira-accent)}'+
 '.mxs-list>li.is-drop{border-radius:6px;background:var(--mira-accent-08);box-shadow:inset 0 0 0 1px var(--mira-accent-25)}.mxs-list>li.mxs-h.is-drop{color:var(--mira-name)}'+
 '.mxs-dz{margin:2px 0 4px;padding:8px var(--mxs-in);border:1px dashed var(--mira-panel-edge);border-radius:6px;font-size:12px;color:var(--mira-text-muted);list-style:none}.mxs-dz.is-drop{border-color:var(--mira-accent)}'+
 '.mxs-drop{position:absolute;z-index:6;left:8px;right:8px;height:2px;border-radius:1px;background:var(--mira-accent);pointer-events:none}'+
 '.mxs-g.is-landed>.mxs-grow{background:var(--mira-accent-08);transition:background .6s}'+
 '.mxs-bar{display:flex;align-items:center;gap:2px;height:32px;margin:4px 0 2px;padding:0 2px 0 var(--mxs-in)}'+
 '.mxs-t{flex:1;min-width:0;font-size:13px;font-weight:600;color:var(--mira-text-strong)}'+
 '.mxs-ib{position:relative;display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:var(--mira-row-hover);color:var(--mira-text-toned);cursor:pointer}'+
 '.mxs-ib:hover:not(:disabled),.mxs-ib.is-open{color:var(--mira-text-strong);background:var(--mira-surface-raised)}.mxs-ib.is-on{color:var(--mira-name)}.mxs-ib:disabled{opacity:.35;cursor:default}.mxs-ib svg{width:16px;height:16px}'+
 '.mxs button:focus-visible,.mxs-row:focus-visible,.mxs-mi:focus-visible{outline:2px solid var(--mira-accent);outline-offset:-2px}'+
 '.mxs-dot{position:absolute;top:5px;right:5px;width:6px;height:6px;border-radius:50%;background:var(--mira-accent)}'+
 '.mxs-fs{display:flex;align-items:baseline;gap:8px;padding:0 var(--mxs-in) 4px;font-size:12px;color:var(--mira-text-muted)}.mxs-fs span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
 '.mxs-fs button,.mxs-empty button{padding:0;border:0;background:none;color:var(--mira-name);font:inherit;font-weight:500;cursor:pointer}.mxs-fs button:hover,.mxs-empty button:hover{text-decoration:underline}'+
 '.mxs-ic{display:inline-grid;place-items:center;flex:0 0 16px;width:16px;height:16px;color:inherit}.mxs-ic svg{width:16px;height:16px}'+
 '.mxs-list{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}'+
 /* section titles (Pinned · Groups · Recent): REGULAR weight, sentence case, and a size of their own - 12px against the
    chats' 13.5px - so a title never reads as a row (request, 20 Nov 2026). They were 11px bold capitals. */
 '.mxs-h{padding:16px var(--mxs-in) 6px;font-size:12px;font-weight:400;line-height:16px;letter-spacing:0;text-transform:none;color:var(--mira-text-muted);list-style:none}.mxs-h:first-child{padding-top:8px}'+
 '.mxs-hb{display:inline-flex;align-items:center;gap:4px;margin:-2px -6px;padding:2px 6px;border:0;border-radius:4px;background:none;color:inherit;font:inherit;line-height:inherit;cursor:pointer}'+
 '.mxs-hb:hover{color:var(--mira-text-strong)}.mxs-hc{display:inline-grid;place-items:center;width:12px;height:12px;opacity:0;transition:opacity .12s}.mxs-hc svg{width:12px;height:12px}'+
 /* the chevron shows ONLY while the title is hovered or focused (request, 20 Nov 2026); it keeps its 12px so the title never shifts */
 '.mxs-h:hover .mxs-hc,.mxs-hb:focus-visible .mxs-hc{opacity:1}'+
 '.mxs-h.has-act{display:flex;align-items:center;justify-content:space-between;padding-right:2px}'+
 '.mxs-ha{position:relative;display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;margin:-6px 0;padding:0;border:0;border-radius:6px;background:var(--mira-row-hover);color:var(--mira-text-toned);cursor:pointer}'+
 '.mxs-ha svg{width:16px;height:16px}.mxs-ha:hover,.mxs-ha.is-open{color:var(--mira-text-strong);background:var(--mira-surface-raised)}'+
 '.mxs-fbli{list-style:none}.mxs-sub{list-style:none;padding:8px var(--mxs-in) 2px;font-size:11px;line-height:16px;color:var(--mira-text-muted);opacity:.8}'+
 '.mxs-h .mxs-ha{opacity:0;transition:opacity .12s}'+
 '.mxs-h:hover .mxs-ha,.mxs-h:focus-within .mxs-ha,.mxs-ha.is-open{opacity:1}'+
 '.mxs-ha.is-on{color:var(--mira-name)}.mxs-ha:disabled{opacity:.35;cursor:default}'+
 '.mxs-li{position:relative;list-style:none}'+
 '.mxs-li.is-kid::before{content:"";position:absolute;left:calc(var(--d,0) * 16px + 15.5px);top:-2px;bottom:-2px;width:1px;background:var(--mira-border);pointer-events:none}'+
 '.mxs-row{display:flex;align-items:center;gap:8px;width:100%;height:32px;padding:0 var(--mxs-in);border:0;border-radius:6px;background:none;color:var(--mira-text-toned);font:inherit;font-size:.84375rem;line-height:20px;text-align:left;text-decoration:none;cursor:pointer}'+
 '.mxs-row:hover,.mxs-li.is-menu>.mxs-row{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxs-row.is-active{color:var(--mira-text-strong);font-weight:500;background:var(--mira-row-on)}'+
 '.mxs-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
 '.mxs-age{flex:0 0 auto;min-width:24px;font-size:11.5px;font-weight:400;font-variant-numeric:tabular-nums;text-align:right;color:var(--mira-text-muted)}'+
 '.mxs-grow{font-weight:500;color:var(--mira-text-strong)}.mxs-grow .mxs-ic{color:var(--mira-text-muted)}.mxs-g.is-open>.mxs-grow .mxs-ic{color:var(--mira-name)}'+
 '.mxs-gn{flex:0 0 auto;min-width:20px;height:18px;padding:0 6px;border-radius:9px;background:var(--mira-row-on);font-size:11px;font-weight:500;line-height:18px;text-align:center;font-variant-numeric:tabular-nums;color:var(--mira-text-muted)}'+
 '.mxs-more{position:absolute;top:4px;right:4px;display:grid;place-items:center;width:24px;height:24px;padding:0;border:0;border-radius:5px;background:none;color:var(--mira-text-muted);opacity:0;cursor:pointer}'+
 '.mxs-more svg{width:16px;height:16px}.mxs-more:hover{color:var(--mira-text-strong);background:var(--mira-row-on)}'+
 /* the ⋯ gets its OWN slot, as ChatGPT's does (request, 20 Nov 2026: the name's ellipsis ran into the dots): while a row is
    hovered or its menu is open, the row's right padding grows to the button's width + an 8px gap, so the name truncates
    before the ⋯ instead of under it. Group rows reserve room for their two buttons the same way. */
 '.mxs-li:hover>.mxs-row,.mxs-li.is-menu>.mxs-row,.mxs-li:focus-within>.mxs-row{padding-right:36px!important}'+
 '.mxs-g:hover>.mxs-grow,.mxs-g.is-menu>.mxs-grow,.mxs-g:focus-within>.mxs-grow{padding-right:62px!important}'+
 '.mxs-more{background:var(--mira-row-on)}'+
 '.mxs-li:hover>.mxs-more,.mxs-li.is-menu>.mxs-more,.mxs-more:focus-visible{opacity:1}.mxs-li:hover>.mxs-row .mxs-age,.mxs-li.is-menu>.mxs-row .mxs-age{visibility:hidden}'+
 /* group hover actions - Topology's rename / add child, plus ⋯ (Ungroup, Delete when empty) */
 '.mxs-gact{position:absolute;top:4px;right:4px;display:flex;gap:1px;opacity:0}.mxs-g:hover>.mxs-gact,.mxs-g.is-menu>.mxs-gact,.mxs-gact:focus-within{opacity:1}'+
 '.mxs-g:hover>.mxs-grow .mxs-gn,.mxs-g.is-menu>.mxs-grow .mxs-gn,.mxs-g:focus-within>.mxs-grow .mxs-gn{visibility:hidden}'+
 '.mxs-gb{display:grid;place-items:center;width:24px;height:24px;padding:0;border:0;border-radius:5px;background:none;color:var(--mira-text-muted);cursor:pointer}.mxs-gb:hover{color:var(--mira-text-strong);background:var(--mira-row-on)}.mxs-gb svg{width:14px;height:14px}'+
 '.mxs-gempty{display:flex;align-items:center;height:26px;font-size:12px;color:var(--mira-text-muted)}'+
 /* the inline name row: field + ✓ (primary) + ✕, error under the field (Topology's add row) */
 '.mxs-nr{display:flex;align-items:flex-start;gap:6px;padding:2px 2px 2px var(--mxs-in)}.mxs-nr>.mxs-ic{margin-top:6px;color:var(--mira-name)}.mxs-nf{flex:1;min-width:0}'+
 '.mxs-in{width:100%;height:28px;padding:0 8px;border:1px solid var(--mira-accent);border-radius:6px;background:var(--mira-surface);outline:0;color:var(--mira-text-strong);font:inherit;font-size:13px}.mxs-in.is-err{border-color:var(--mira-ask-danger)}.mxs-in::placeholder{color:var(--mira-text-dimmed)}'+
 '.mxs-err{margin:4px 0 2px;font-size:11.5px;line-height:1.4;color:var(--mira-ask-danger)}'+
 '.mxs-ok,.mxs-no{display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;padding:0;border:0;border-radius:6px;cursor:pointer}.mxs-ok svg,.mxs-no svg{width:15px;height:15px}'+
 '.mxs-ok{background:var(--mira-accent);color:var(--mira-on-accent)}.mxs-ok:hover{filter:brightness(1.08)}.mxs-no{background:var(--mira-row-on);color:var(--mira-text-toned)}.mxs-no:hover{color:var(--mira-text-strong)}'+
 /* move mode: the strip, the pickable groups, the moving chat, and everything else dimmed */
 '.mxs-mv{margin:2px 0 6px;padding:10px 10px 10px 12px;border:1px solid var(--mira-accent-28);border-radius:8px;background:var(--mira-accent-08)}'+
 '.mxs-mvt{font-size:12.5px;line-height:18px;color:var(--mira-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mxs-mvt b{font-weight:600;color:var(--mira-text-strong)}'+
 '.mxs-mvd{margin-top:2px;font-size:11.5px;line-height:16px;color:var(--mira-text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
 '.mxs-mvb{display:flex;justify-content:flex-end;gap:6px;margin-top:8px}'+
 '.mxs-btn{display:inline-flex;align-items:center;justify-content:center;height:28px;padding:0 12px;border:1px solid var(--mira-kbd-edge);border-radius:6px;background:none;color:var(--mira-text-strong);font:inherit;font-size:12.5px;cursor:pointer}'+
 '.mxs-btn:hover:not(:disabled){background:var(--mira-row-hover)}.mxs-btn.is-pri{background:var(--mira-accent);border-color:var(--mira-accent);color:var(--mira-on-accent)}.mxs-btn.is-pri:hover:not(:disabled){filter:brightness(1.08)}.mxs-btn:disabled{opacity:.45;cursor:default}'+
 '.mxs.is-moving .mxs-dim{opacity:.4;pointer-events:none}'+
 '.mxs-g.is-picked>.mxs-grow,.mxs-g.is-picked>.mxs-grow:hover{background:var(--mira-row-on);box-shadow:inset 0 0 0 1px var(--mira-accent-45)}.mxs-g.is-picked .is-ck{color:var(--mira-name)}'+
 '.mxs-row.is-moving,.mxs-row.is-moving:hover{color:var(--mira-text-strong);background:var(--mira-accent-08);cursor:default}'+
 '.mxs-tag{flex:0 0 auto;padding:0 6px;border-radius:4px;background:var(--mira-accent-12);color:var(--mira-name);font-size:10.5px;font-weight:500;line-height:18px}'+
 '.mxs-hov{position:fixed;z-index:6050;width:330px;max-width:calc(100vw - 24px);padding:13px 14px;border:1px solid var(--mira-panel-edge);border-radius:10px;background:var(--mira-surface-raised);box-shadow:var(--mira-menu-shadow);pointer-events:none;animation:mxsHovIn .13s ease-out}'+
 '@keyframes mxsHovIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.mxs-hov{animation:none}}'+
 '.mxs-hov b{display:block;margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:600;color:var(--mira-text-strong)}'+
 '.mxs-hov p{margin:0;font-size:12px;line-height:1.55;color:var(--mira-text-toned)}'+
 '.mxs-hovf{margin-top:9px;padding-top:8px;border-top:1px solid var(--mira-hairline);font-size:11px;color:var(--mira-text-muted)}'+
 '.mxs-empty{padding:12px var(--mxs-in);font-size:12.5px;line-height:1.5;color:var(--mira-text-muted)}'+
 '.mxs-menu.mxf4{min-width:224px}.mxf4 .mxs-mi>.mxs-ic:first-child:empty{display:none}.mxf4 .mxs-mi{padding:0 10px}'+
 '.mxs-fv{flex:0 0 auto;margin-left:12px;font-size:12px;color:var(--mira-text-muted)}.mxf4 .mxs-mi:disabled{opacity:.4;cursor:default}'+
 '.mxs-msc{max-height:256px;overflow-y:auto;margin:-4px -4px 0;padding:4px;scrollbar-width:thin;scrollbar-color:var(--mira-panel-edge) transparent}'+
 '.mxs-menu{position:fixed;z-index:6000;min-width:188px;max-width:240px;padding:4px;border:1px solid var(--mira-panel-edge);border-radius:10px;background:var(--mira-surface-raised);box-shadow:var(--mira-menu-shadow)}'+
 '.mxs-mi{display:flex;align-items:center;gap:10px;width:100%;height:32px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--mira-text);font:inherit;font-size:13px;text-align:left;cursor:pointer}'+
 '.mxs-mi .mxs-ic{color:var(--mira-text-muted)}.mxs-ml{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
 '.mxs-mi .is-tail{flex:0 0 14px;width:14px;height:14px;color:var(--mira-text-muted)}.mxs-mi .is-tail svg{width:14px;height:14px}.mxs-mi.is-on .is-tail{color:var(--mira-name)}'+
 '.mxs-mi.is-open{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxs-mnone{padding:6px 8px;font-size:12px;color:var(--mira-text-muted)}'+
 '.mxs-mi:disabled{opacity:.4;cursor:default}.mxs-mi:disabled:hover{color:var(--mira-text);background:none}'+
 '.mxs-mi:hover,.mxs-mi:focus-visible{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxs-mi.is-on,.mxs-mi.is-on .mxs-ic{color:var(--mira-name)}'+
 '.mxs-mi.is-danger,.mxs-mi.is-danger .mxs-ic{color:var(--mira-ask-danger)}.mxs-mi.is-danger:hover{background:var(--mira-ask-danger-soft)}'+
 '.mxs-fb{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:2px var(--mxs-in) 8px}'+
 '.mxs-fc{height:26px;padding:0 9px;border:1px solid var(--mira-kbd-edge);border-radius:13px;background:none;color:var(--mira-text-toned);font:inherit;font-size:12px;cursor:pointer;white-space:nowrap}'+
 '.mxs-fc:hover{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxs-fc.is-on,.mxs-fc.is-on:hover{border-color:var(--mira-accent-45);background:var(--mira-accent-12);color:var(--mira-name);font-weight:500}'+
 '.mxs-fx{height:26px;padding:0 4px;border:0;background:none;color:var(--mira-name);font:inherit;font-size:12px;font-weight:500;cursor:pointer}.mxs-fx:hover{text-decoration:underline}'+
 '.mxs-menu.mxf{width:272px;max-width:272px;padding:12px}'+
 '.mxf-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px;font-weight:600;color:var(--mira-text-strong)}'+
 '.mxf-reset{padding:0;border:0;background:none;color:var(--mira-name);font:inherit;font-size:12px;font-weight:500;cursor:pointer}.mxf-reset:hover:not(:disabled){text-decoration:underline}.mxf-reset:disabled{color:var(--mira-text-dimmed);cursor:default}'+
 '.mxf-sw{display:flex;align-items:center;justify-content:space-between;gap:10px;width:calc(100% + 16px);height:36px;margin:0 -8px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--mira-text);font:inherit;font-size:13px;cursor:pointer}'+
 '.mxf-sw:hover{background:var(--mira-row-hover);color:var(--mira-text-strong)}.mxf-swl{display:flex;align-items:center;gap:8px}.mxf-swl .mxs-ic{color:var(--mira-text-muted)}'+
 '.mxf-tr{position:relative;flex:0 0 28px;width:28px;height:16px;border-radius:8px;background:var(--mira-row-on);box-shadow:inset 0 0 0 1px var(--mira-kbd-edge);transition:background .15s}'+
 '.mxf-tr i{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--mira-text-muted);transition:transform .15s,background .15s}'+
 '.mxf-tr.is-on{background:var(--mira-accent);box-shadow:none}.mxf-tr.is-on i{transform:translateX(12px);background:var(--mira-on-accent)}'+
 '.mxf-h+.mxf-l{margin-top:4px}.mxf-l{margin:12px 0 8px;font-size:12px;font-weight:500;color:var(--mira-text-muted)}'+
 '.mxf-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:2px;border:1px solid var(--mira-kbd-edge);border-radius:8px}'+
 '.mxf-chip{height:26px;padding:0 2px;border:0;border-radius:6px;background:none;color:var(--mira-text-toned);font:inherit;font-size:12px;cursor:pointer;white-space:nowrap}'+
 '.mxf-chip:hover{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxf-chip.is-on,.mxf-chip.is-on:hover{background:var(--mira-accent-12);box-shadow:inset 0 0 0 1px var(--mira-accent-45);color:var(--mira-name);font-weight:500}'+
 '.mxf-seg,.mxf-gby,.mxf-sort{display:block}.mxf-ft{margin:10px -8px -4px;padding-top:4px;border-top:1px solid var(--mira-panel-edge)}'+
 '.mxs-fcd{display:inline-flex;align-items:center;gap:2px;padding-right:6px}.mxs-fcd .mxs-ic{width:14px;height:14px}.mxs-fcd .mxs-ic svg{width:14px;height:14px}'+
 '.mxf-n{margin-top:12px;font-size:11.5px;font-variant-numeric:tabular-nums;color:var(--mira-text-muted)}'+
 '.mxs-menu.mxf button:focus-visible{outline:2px solid var(--mira-accent);outline-offset:1px}'+
 '.mxs-mh{padding:8px 8px 4px 34px;font-size:12px;font-weight:500;color:var(--mira-text-muted)}.mxs-ms{height:1px;margin:4px -4px;background:var(--mira-hairline)}';

/* REORDER GROUPS · OPTION 2 - DRAG (request, 23 Nov 2026: "I can click the group and easily move it up or down"; the menu's
   Move up / Move down stays as Option 1). MXS.gdrag, state o2-gdrag. Press a group row and drag: the row follows the pointer,
   a line shows where it will land, release drops it there. A press without movement is still a click (open / close).
   Keyboard: Alt + Up / Down on a focused group row. */
function mxsGDragWire(){ if(mxsGDragWire.on) return; mxsGDragWire.on=1; var D=null;
  var slots=function(){ var heads=$$('.mxs .mxs-g:not(.is-kid)'), ys=heads.map(function(li){ return li.getBoundingClientRect().top; }), last=heads[heads.length-1], end=null, n=last;
    while(n&&(n=n.nextElementSibling)){ if(n.classList.contains('mxs-h')){ end=n.getBoundingClientRect().top; break; } }
    if(end==null&&last){ var lr=last; while(lr.nextElementSibling&&!lr.nextElementSibling.classList.contains('mxs-h')) lr=lr.nextElementSibling; end=lr.getBoundingClientRect().bottom; }
    ys.push(end); return { heads:heads, ys:ys }; };
  document.addEventListener('pointerdown',function(e){ if(!MXS.gdrag||MXS.mv||e.button!==0) return; var b=e.target.closest('.mxs .mxs-g:not(.is-kid)>.mxs-grow'); if(!b) return;
    D={ b:b, li:b.parentNode, g:b.getAttribute('data-g'), y0:e.clientY, on:false }; },true);
  document.addEventListener('pointermove',function(e){ if(!D) return; var dy=e.clientY-D.y0;
    if(!D.on){ if(Math.abs(dy)<4) return; D.on=true; var S=slots(); D.S=S; D.from=S.heads.indexOf(D.li); mxsMenuClose();
      D.li.classList.add('is-drag'); document.body.classList.add('mxs-dragging'); D.ln=document.createElement('div'); D.ln.className='mxs-drop'; $('.mxs').appendChild(D.ln); }
    D.li.style.transform='translateY('+dy+'px)';
    var ys=D.S.ys, best=0, bd=1e9; ys.forEach(function(y,i){ var d=Math.abs(e.clientY-y); if(d<bd){ bd=d; best=i; } }); D.slot=best;
    var box=$('.mxs').getBoundingClientRect(), same=best===D.from||best===D.from+1; D.ln.style.top=(ys[best]-box.top-1)+'px'; D.ln.hidden=same; },true);
  var end=function(){ if(!D) return; var d=D; D=null; if(!d.on) return;
    d.li.classList.remove('is-drag'); d.li.style.transform=''; document.body.classList.remove('mxs-dragging'); if(d.ln) d.ln.remove();
    /* the click that ends a drag must not also open / close the group */
    var eat=function(ev){ ev.stopPropagation(); ev.preventDefault(); window.removeEventListener('click',eat,true); }; window.addEventListener('click',eat,true); setTimeout(function(){ window.removeEventListener('click',eat,true); },0);
    var to=d.slot>d.from?d.slot-1:d.slot; if(d.slot!=null&&mxsGMoveTo(d.g,to)){ mxsPaint(); var nb=$('.mxs [data-mxs="gtoggle"][data-g="'+d.g+'"]'); if(nb){ var li=nb.parentNode; li.classList.add('is-landed'); setTimeout(function(){ li.classList.remove('is-landed'); },700); } } };
  document.addEventListener('pointerup',end,true); document.addEventListener('pointercancel',end,true);
  document.addEventListener('keydown',function(e){ if(!MXS.gdrag||!e.altKey||(e.key!=='ArrowUp'&&e.key!=='ArrowDown')) return; var b=e.target.closest&&e.target.closest('.mxs .mxs-g:not(.is-kid)>.mxs-grow'); if(!b) return;
    e.preventDefault(); e.stopPropagation(); var gid=b.getAttribute('data-g'), g=mxsG(gid), i=mxsKids(null).indexOf(g);
    if(mxsGMoveTo(gid,i+(e.key==='ArrowUp'?-1:1))){ mxsPaint(); var nb=$('.mxs [data-mxs="gtoggle"][data-g="'+gid+'"]'); if(nb) nb.focus(); } },true); }
/* DRAG A CHAT INTO PINNED OR A GROUP (request, 23 Nov 2026: "click and hold any chat, then easily move it into the Pin section
   or a group section - every chat"). MXS.cdrag, state o2-cdrag. Press a chat row (in Pinned, a group or Recent) and drag: a
   chip with its name follows the pointer and the target lights up - the Pinned section pins it, a group row (or any chat
   inside that group) files it there, the Recent section takes it out of its group and unpins it. Release to drop; Esc
   cancels. A press without movement is still a click (opens the chat). */
function mxsCDropAt(x,y){ var el=document.elementFromPoint(x,y), li=el&&el.closest&&el.closest('.mxs-list>li'); if(!li) return null;
  if(li.classList.contains('mxs-g')){ var gb=li.querySelector('[data-g]'); return gb?{g:gb.getAttribute('data-g'),li:li}:null; }
  for(var n=li;n;n=n.previousElementSibling){
    if(n.classList.contains('mxs-g')&&li.classList.contains('is-kid')){ var b2=n.querySelector('[data-g]'); if(!b2) return null;
      var ra=li.querySelector('a.mxs-row[data-id]'), rr=li.getBoundingClientRect();
      return ra?{g:b2.getAttribute('data-g'),li:n,ref:ra.getAttribute('data-id'),after:y>rr.top+rr.height/2,row:li}:{g:b2.getAttribute('data-g'),li:n}; }
    if(n.classList.contains('mxs-h')){ var k=n.getAttribute('data-sec'); return k==='pinned'?{pin:1,li:n}:k==='recent'?{out:1,li:n}:null; } }
  return null; }
function mxsCDragWire(){ if(mxsCDragWire.on) return; mxsCDragWire.on=1; var D=null;
  var clear=function(){ $$('.mxs .is-drop').forEach(function(x){ x.classList.remove('is-drop'); }); };
  var stop=function(drop){ if(!D) return; var d=D; D=null; if(d.gh) d.gh.remove(); if(d.ln) d.ln.remove(); document.body.classList.remove('mxs-dragging'); clear(); MXS.cdragId=null;
    if(!d.on){ return; }
    var eat=function(ev){ ev.stopPropagation(); ev.preventDefault(); window.removeEventListener('click',eat,true); }; window.addEventListener('click',eat,true); setTimeout(function(){ window.removeEventListener('click',eat,true); },0);
    var t=drop?d.t:null, id=d.id, nm=d.name;
    if(t&&t.pin){ if(MXS.pin[id]) toast('“'+nm+'” is already pinned'); else { MXS.pin[id]=1; toast('“'+nm+'” pinned'); } }
    else if(t&&t.g){ var g=mxsG(t.g), inG=MXS.of[id]===t.g;
      if(t.ref){ /* a position inside the group: the members in their shown order, this chat put before / after the one under it */
        var ids=d.order[t.g].filter(function(x){ return x!==id; }), at=ids.indexOf(t.ref); if(at<0) at=ids.length; else if(t.after) at++;
        var same=inG&&d.order[t.g].indexOf(id)===at; ids.splice(at,0,id); MXS.cord=MXS.cord||{}; ids.forEach(function(x,i){ MXS.cord[x]=i; });
        MXS.of[id]=t.g; g.open=true; if(!same) toast(inG?'Order updated in '+g.name:'“'+nm+'” moved to '+g.name); }
      else if(inG) toast('“'+nm+'” is already in '+g.name); else { MXS.of[id]=t.g; g.open=true; toast('“'+nm+'” moved to '+g.name); } }
    else if(t&&t.out){ var src=d.src||{};
      if(src.pin&&MXS.pin[id]){ delete MXS.pin[id]; toast('“'+nm+'” unpinned'); }
      else if(src.g&&MXS.of[id]){ var was=mxsG(MXS.of[id]); delete MXS.of[id]; toast('“'+nm+'” taken out of '+(was?was.name:'its group')); }
      else toast('“'+nm+'” is already in Recent'); }
    mxsPaint(); };
  document.addEventListener('dragstart',function(e){ if(MXS.cdrag&&e.target.closest&&e.target.closest('.mxs a.mxs-row')) e.preventDefault(); },true);
  document.addEventListener('pointerdown',function(e){ if(!MXS.cdrag||MXS.mv||e.button!==0) return; var a=e.target.closest('.mxs a.mxs-row[data-id]'); if(!a) return;
    var sr=a.getBoundingClientRect(); D={ id:a.getAttribute('data-id'), name:(a.querySelector('.mxs-name')||a).textContent, x0:e.clientX, y0:e.clientY, on:false, src:mxsCDropAt(sr.left+4,sr.top+sr.height/2) }; },true);
  document.addEventListener('pointermove',function(e){ if(!D) return;
    if(!D.on){ if(Math.abs(e.clientX-D.x0)+Math.abs(e.clientY-D.y0)<5) return; D.on=true; mxsMenuClose(); if(MXS.hovFor) mxsHovOff();
      D.order={}; $$('.mxs .mxs-g:not(.is-kid)').forEach(function(h){ var gb=h.querySelector('[data-g]'), ids=[]; if(!gb) return;
        for(var n=h.nextElementSibling;n&&n.classList.contains('is-kid');n=n.nextElementSibling){ var a=n.querySelector('a.mxs-row[data-id]'); if(a) ids.push(a.getAttribute('data-id')); }
        D.order[gb.getAttribute('data-g')]=ids; });
      MXS.cdragId=D.id; mxsPaint(); document.body.classList.add('mxs-dragging'); $$('.mxs a.mxs-row[data-id="'+D.id+'"]').forEach(function(x){ x.classList.add('is-src'); });
      D.gh=document.createElement('div'); D.gh.className='mxs-ghost'; D.gh.innerHTML=mxsI('message')+'<span>'+esc(D.name)+'</span>'; document.body.appendChild(D.gh); }
    D.gh.style.left=(e.clientX+12)+'px'; D.gh.style.top=(e.clientY+10)+'px';
    clear(); D.t=mxsCDropAt(e.clientX,e.clientY); if(D.t) D.t.li.classList.add('is-drop');
    if(D.t&&D.t.ref===D.id) D.t.ref=null;   /* over itself: no line */
    if(!D.ln){ D.ln=document.createElement('div'); D.ln.className='mxs-drop'; $('.mxs').appendChild(D.ln); }
    if(D.t&&D.t.ref){ var bx=$('.mxs').getBoundingClientRect(), rr=D.t.row.getBoundingClientRect(); D.ln.style.top=((D.t.after?rr.bottom:rr.top)-bx.top-1)+'px'; D.ln.style.left='28px'; D.ln.hidden=false; } else D.ln.hidden=true;
    D.gh.classList.toggle('is-ok',!!D.t); },true);
  document.addEventListener('pointerup',function(){ stop(true); },true);
  document.addEventListener('pointercancel',function(){ stop(false); },true);
  document.addEventListener('keydown',function(e){ if(D&&D.on&&e.key==='Escape'){ e.stopPropagation(); stop(false); } },true); }
function mxsWire(){ if(mxsWire.on) return; mxsWire.on=1; var st=document.createElement('style'); st.id='mxs-css'; st.textContent=MXS_CSS; document.head.appendChild(st);
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-mxs]'), inMenu=e.target.closest('.mxs-menu');
    if(!b){ if(!inMenu&&MXS.menu) mxsMenuClose(); return; } if(!b.closest('.mxs')&&!inMenu) return; e.preventDefault(); e.stopPropagation(); mxsAct(b); },true);
  document.addEventListener('mouseover',function(e){ var row=e.target.closest&&e.target.closest('.mxs a.mxs-row[data-id]'); if(row){ mxsHovOn(row); return; }
    if(MXS.hovFor&&!(e.target.closest&&e.target.closest('.mxs-li'))) mxsHovOff(); });
  document.addEventListener('mouseleave',function(){ mxsHovOff(); });
  document.addEventListener('scroll',function(){ if(MXS.hovFor) mxsHovOff(); },true);
  document.addEventListener('pointerdown',function(){ if(MXS.hovFor) mxsHovOff(); },true);
  document.addEventListener('mouseover',function(e){ var it=e.target.closest&&e.target.closest('.mxs-menu:not(.is-sub) .mxs-mi'); if(!it) return;
    if(it.getAttribute('data-mxs')==='mmove'){ if(!it.classList.contains('is-open')) mxsSub(it,it.getAttribute('data-id')); }
    else if(it.getAttribute('data-mxs')==='f4row'){ if(!it.classList.contains('is-open')) mxsF4Sub(it,it.getAttribute('data-k')); }
    else { $$('.mxs-menu.is-sub').forEach(function(x){ x.parentNode.removeChild(x); }); $$('.mxs-mi.is-open').forEach(function(x){ x.classList.remove('is-open'); x.setAttribute('aria-expanded','false'); }); } });
  document.addEventListener('keydown',function(e){ var r4=e.target.closest&&e.target.closest('.mxs-menu [data-mxs="f4row"]'); if(r4&&e.key==='ArrowRight'){ e.preventDefault(); mxsF4Sub(r4,r4.getAttribute('data-k')); var f4=$('.mxs-menu.is-sub .mxs-mi'); if(f4) f4.focus(); } },true);
  document.addEventListener('keydown',function(e){ var it=e.target.closest&&e.target.closest('.mxs-menu [data-mxs="mmove"]'); if(it&&e.key==='ArrowRight'){ e.preventDefault(); mxsSub(it,it.getAttribute('data-id')); var f=$('.mxs-menu.is-sub .mxs-mi'); if(f) f.focus(); } },true);
  document.addEventListener('dblclick',function(e){ var b=MXS.mv&&e.target.closest('.mxs [data-mxs="gpick"]'); if(!b) return; MXS.mv.sel=b.getAttribute('data-g'); mxsMoveGo(); },true);
  document.addEventListener('input',function(e){ if(e.target.classList&&e.target.classList.contains('mxs-in')){ MXS.val=e.target.value; if(MXS.err){ MXS.err=''; e.target.classList.remove('is-err'); var er=$('.mxs-err'); if(er) er.remove(); } } },true);
  document.addEventListener('keydown',function(e){ var t=e.target;
    if(t.classList&&t.classList.contains('mxs-in')){ if(e.key==='Enter'){ e.preventDefault(); mxsEdSave(); } else if(e.key==='Escape'){ e.preventDefault(); mxsEdCancel(); } e.stopPropagation(); return; }
    if(e.key==='Escape'&&MXS.menu){ e.stopPropagation(); mxsMenuClose(); return; }
    if(e.key==='Escape'&&MXS.mv){ e.stopPropagation(); MXS.mv=null; mxsPaint(); } },true); }
/* seed: three more chats so pin, group and filter have something to work on (Option 2 only), then the first state */
function mxsInit(v){ mxsWire(); MXS.on=true; var as=$('aside.mira-sidebar'); if(as) as.classList.add('mxs-on'); var D=864e5, now=Date.now();
  [['Disk usage on Linux hosts',3*D+4*36e5],['Interface flaps on core-sw-01',5*D+2*36e5],['Monthly SLA report',12*D+7*36e5]].forEach(function(s){ var id=fileChat(s[0]); MX.at[id]=now-s[1]; MXS[s[0]]=id; });
  bandPaint(); show('new');
  var disk=MXS['Disk usage on Linux hosts'], net=MXS['Interface flaps on core-sw-01'];
  /* the filter lives on the Recent title in EVERY Option 2 state, shown on hover of that title (request, 23 Nov 2026) */
  MXS.fpos='sec';
  /* ...and New group lives on the Groups title in every Option 2 state, shown on hover of that title (request, 23 Nov 2026) */
  MXS.gpos='sec';
  MXS.pin.c3=1; MXS.groups=[{id:'g1',name:'Runbooks',parent:null,open:true},{id:'g2',name:'Network',parent:null,open:false}]; MXS.gseq=2;
  MXS.of={c1:'g1',c2:'g1'}; MXS.of[net]='g2';
  try{ new MutationObserver(mxsRepaint).observe($('.mira-recents-list'),{childList:true,subtree:true,attributes:true,characterData:true,attributeFilter:['class','style','title']}); }catch(e){}
  mxsPaint();
  setTimeout(function(){ if(v==='o2-menu'){ var b=$('.mxs [data-mxs="rmenu"][data-id="'+disk+'"]'); if(b) mxsRowMenu(b,disk); }
    else if(v==='o2-nofold'){ MXS.nofold=true; MXS.fold={}; MXS.gpos='sec'; MXS.fpos='sec'; mxsPaint(); }   /* + New group on the Groups title (23 Nov 2026) */
    else if(v==='o2-cdrag'){ MXS.cdrag=true; mxsCDragWire(); MXS.gdrag=true; mxsGDragWire(); mxsPaint(); }   /* groups drag up / down here too (23 Nov 2026) */
    else if(v==='o2-gdrag'){ MXS.gdrag=true; mxsGDragWire(); mxsPaint(); }
    else if(v==='o2-gorder'){ var gb=$('.mxs [data-mxs="gmenu"][data-g="g1"]'); if(gb) mxsGroupMenu(gb,'g1'); }   /* Runbooks' menu: Move up / Move down */
    else if(v==='o2-gsec'){ MXS.gpos='sec'; mxsPaint(); }
    else if(v==='o2-gsec-new'){ MXS.gpos='sec'; MXS.ed={k:'add',par:null}; mxsPaint(); }
    else if(v==='o2-filter3'){ MXS.fopt='3'; MXS.fbar=true; MXS.filter.time='7d'; mxsPaint(); }
    else if(v==='o2-filter4'){ MXS.fopt='4'; MXS.filter.time='7d'; mxsPaint(); var f4=$('.mxs [data-mxs="filter"]'); if(f4){ mxsF4Menu(f4); var r4=$('.mxs-menu [data-mxs="f4row"][data-k="time"]'); if(r4) mxsF4Sub(r4,'time'); } }
    else if(v==='o2-filter2'){ MXS.fopt='2'; MXS.filter.time='7d'; mxsPaint(); var f2=$('.mxs [data-mxs="filter"]'); if(f2) mxsFilterMenu(f2); }
    else if(v==='o2-filter'){ MXS.filter.time='7d'; mxsPaint(); var f=$('.mxs [data-mxs="filter"]'); if(f) mxsFilterMenu(f); }
    else if(v==='o2-move'){ var rb=$('.mxs [data-mxs="rmenu"][data-id="'+disk+'"]'); if(rb){ mxsRowMenu(rb,disk); var it=$('.mxs-menu [data-mxs="mmove"]'); if(it) mxsSub(it,disk); } }
    else if(v==='o2-newgroup'){ MXS.ed={k:'add',par:null}; mxsPaint(); } },300); }

/* COLLAPSE IN THE SIDEBAR (request, 20 Nov 2026: "the expand / collapse icon will show on the left side, in the sidebar"):
   a new option beside the current one, where the button sits in the chat header before the chat name. Here the
   COLLAPSE button lives in the sidebar's own top row, at the right end of the Mira mark (ChatGPT / Claude), so it goes
   away with the column it closes; the chat header loses its copy while the sidebar is open. Once collapsed, the
   EXPAND button comes back in the chat header - the only place left to put it. The button carries data-mx-hd="hist",
   so mira.html's own handler toggles the sidebar and repaints the header; it travels with the sidebar's children when
   sideTog() parks and restores them. States: tog (Option 1), o2-tog (Option 2), tog-col (collapsed). */
function mxsTog(v){ document.body.classList.add('mxs-tog');
  if(!document.getElementById('mxs-tog-css')){ var st=document.createElement('style'); st.id='mxs-tog-css';
    st.textContent='body.mxs-tog:not(:has(aside.mira-sidebar.is-collapsed)) .mira-crumbs .mx-hdb[data-mx-hd="hist"]{display:none}'+
      'body.mxs-tog .mira-sidebar-head{display:flex;align-items:center}'+
      'body.mxs-tog .mxs-stog{margin-left:auto}';
    document.head.appendChild(st); }
  var head=$('aside.mira-sidebar:not(.is-collapsed) .mira-sidebar-head');
  if(head&&!head.querySelector('.mxs-stog')) head.insertAdjacentHTML('beforeend','<button type="button" class="mx-hdb mxs-stog" data-mx-hd="hist" aria-label="Collapse sidebar" data-mx-tip="Collapse sidebar">'+HD_SB(true)+'</button>');
  if(v==='tog-col') setTimeout(function(){ sideTog(); hdPaint($('#mxPane').firstElementChild,MX.cur); },350); }

/* ═══ CHAT SWITCHER · OPTIONS 2-5 (request, 20 Nov 2026: "suggest better ideas for new options using Mobbin, AI-related
   screens, 3 or 4 ideas"). Option 1 is mira.html's own menu (hdMenu) and stays the default; each option below replaces
   hdMenu for its stage only. References:
   · Option 2 PREVIEWS        - Klarna "Previous chats", Dropbox Dash "Chat sessions": every row carries a one-line summary
                                of what the chat found, so you choose by content, not by a title you may not remember.
   · Option 3 COMMAND PALETTE - Klaviyo Composer, Langdock, n8n: a centred palette over a dimmed page - actions on this chat
                                AND every chat in one searchable list, keyboard first (↑ ↓ ↵ Esc), footer hints (Intercom).
   · Option 4 RECENT | PINNED - Canva AI Library (Chats / Starred chats tabs): two tabs, a pin on every row, so the few chats
                                you return to are one click away however old they are.
   · Option 5 SMART SEARCH    - ElevenLabs conversation history ("Keyword" / "Smart search"): typing searches the chat NAMES
                                and, separately, what was said INSIDE each chat, with the matching words highlighted.
   Everything is mxc*; colours are --mira-* tokens; icons are the Tabler set already injected as MXS_ICO. */
var MXC={opt:null,pin:{},tab:'recent',hi:0};
function mxcI(n){ return '<span class="mxc-ic" aria-hidden="true">'+(MXS_ICO[n]||'')+'</span>'; }
function mxcChats(){ return hdChats().map(function(c){ var s=mxsSummary(c.id,c.n); return {id:c.id,n:c.n,t:c.t,s:s.s,m:s.n,pin:!!MXC.pin[c.id]}; }); }
function mxcRx(q){ return q?new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'):null; }
function mxcMark(txt,rx){ var t=esc(txt); if(!rx) return t; return t.replace(new RegExp('('+rx.source.replace(/&/g,'&amp;')+')','ig'),'<mark>$1</mark>'); }
function mxcBands(list,row){ var out='',bd=null; list.forEach(function(c){ var g=bandOf(c.t); if(g!==bd){ bd=g; out+='<div class="mxc-g">'+esc(g)+'</div>'; } out+=row(c); }); return out; }
function mxcActs(c){ return '<span class="mxc-ac"><i data-mxc="ren" data-id="'+c.id+'" data-mx-tip="Rename">'+HD_I.pen+'</i><i class="dl" data-mxc="del" data-id="'+c.id+'" data-mx-tip="Delete">'+HD_I.bin+'</i></span>'; }
function mxcSearch(ph){ return '<label class="mxc-s">'+HD_I.srch+'<input type="text" data-mxc-q placeholder="'+ph+'" aria-label="'+ph+'" autocomplete="off"></label>'; }

/* Option 2 - previews */
function mxc2List(q){ var rx=mxcRx(q), l=mxcChats().filter(function(c){ return !rx||rx.test(c.n)||rx.test(c.s); });
  if(!l.length) return '<div class="mxc-e">No chat matches “'+esc(q)+'”.</div>';
  return mxcBands(l,function(c){ return '<div class="mxc-r mxc-pv'+(c.id===MX.cur?' on':'')+'" role="menuitem" tabindex="0" data-mxc="open" data-id="'+c.id+'">'+
    '<span class="mxc-cb">'+HD_I.chat+'</span><span class="mxc-tx"><span class="mxc-l1"><span class="mxc-nm">'+mxcMark(c.n,rx)+'</span><span class="mxc-wh">'+esc(mxsWhen(c.t))+'</span>'+mxcActs(c)+'</span>'+
    '<span class="mxc-sm">'+mxcMark(c.s,rx)+'</span></span></div>'; }); }
/* Option 3 - command palette */
function mxc3Items(q){ var rx=mxcRx(q), acts=[['new','plus','New chat','Start a fresh conversation']];
  if(MX.cur&&MX.cur!=='new') acts.push(['renc','pencil','Rename this chat',''],['delc','trash','Delete this chat','']);
  acts=acts.filter(function(a){ return !rx||rx.test(a[2]); });
  var chats=mxcChats().filter(function(c){ return !rx||rx.test(c.n); }).slice(0,8), out='', i=0;
  if(acts.length){ out+='<div class="mxc-g">Actions</div>'; acts.forEach(function(a){ out+='<div class="mxc-r mxc-pi'+(i===MXC.hi?' hi':'')+(a[0]==='delc'?' is-danger':'')+'" role="option" data-i="'+(i++)+'" data-mxc="'+a[0]+'">'+mxcI(a[1])+'<span class="mxc-nm">'+mxcMark(a[2],rx)+'</span>'+(a[3]?'<span class="mxc-wh">'+a[3]+'</span>':'')+'</div>'; }); }
  if(chats.length){ out+='<div class="mxc-g">Chats</div>'; chats.forEach(function(c){ out+='<div class="mxc-r mxc-pi'+(i===MXC.hi?' hi':'')+(c.id===MX.cur?' on':'')+'" role="option" data-i="'+(i++)+'" data-mxc="open" data-id="'+c.id+'"><span class="mxc-cb">'+HD_I.chat+'</span><span class="mxc-nm">'+mxcMark(c.n,rx)+'</span><span class="mxc-wh">'+esc(bandOf(c.t)==='Today'?mxsWhen(c.t):bandOf(c.t))+'</span></div>'; }); }
  MXC.n=i; return out||'<div class="mxc-e">Nothing matches “'+esc(q)+'”.</div>'; }
/* Option 4 - Recent | Pinned */
function mxc4List(q){ var rx=mxcRx(q), all=mxcChats(), l=all.filter(function(c){ return (MXC.tab!=='pinned'||c.pin)&&(!rx||rx.test(c.n)); });
  if(!l.length) return '<div class="mxc-e">'+(MXC.tab==='pinned'&&!q?'No pinned chats yet. Hover a chat and click '+mxcI('pin')+' to keep it here.':'No chat matches “'+esc(q)+'”.')+'</div>';
  var row=function(c){ return '<div class="mxc-r'+(c.id===MX.cur?' on':'')+(c.pin?' is-pin':'')+'" role="menuitem" tabindex="0" data-mxc="open" data-id="'+c.id+'"><span class="mxc-cb">'+HD_I.chat+'</span><span class="mxc-nm">'+mxcMark(c.n,rx)+'</span>'+
    '<span class="mxc-wh">'+esc(mxsWhen(c.t))+'</span><button type="button" class="mxc-pn" data-mxc="pin" data-id="'+c.id+'" aria-pressed="'+c.pin+'" data-mx-tip="'+(c.pin?'Unpin':'Pin')+'">'+(MXS_ICO[c.pin?'pinned':'pin']||'')+'</button></div>'; };
  return MXC.tab==='pinned'?l.map(row).join(''):mxcBands(l,row); }
function mxc4Tabs(){ var all=mxcChats(), np=all.filter(function(c){ return c.pin; }).length, t=function(k,l,n){ return '<button type="button" role="tab" class="mxc-tab'+(MXC.tab===k?' on':'')+'" aria-selected="'+(MXC.tab===k)+'" data-mxc="tab" data-k="'+k+'">'+l+'<span class="mxc-tn">'+n+'</span></button>'; };
  return '<div class="mxc-tabs" role="tablist">'+t('recent','Recent',all.length)+t('pinned','Pinned',np)+'</div>'; }
/* Option 5 - smart search: names, then INSIDE the conversations */
function mxc5List(q){ var rx=mxcRx(q), all=mxcChats();
  if(!q) return '<div class="mxc-tip">'+mxcI('sparkles')+'<span>Search finds words <b>inside</b> your chats too — try “disk” or “SLA”.</span></div>'+mxcBands(all.slice(0,6),function(c){ return '<div class="mxc-r'+(c.id===MX.cur?' on':'')+'" role="menuitem" tabindex="0" data-mxc="open" data-id="'+c.id+'"><span class="mxc-cb">'+HD_I.chat+'</span><span class="mxc-nm">'+esc(c.n)+'</span><span class="mxc-wh">'+esc(mxsWhen(c.t))+'</span></div>'; });
  var names=all.filter(function(c){ return rx.test(c.n); }), inside=all.filter(function(c){ return rx.test(c.s)&&!rx.test(c.n); }), out='';
  out+='<div class="mxc-g">Chat names <span class="mxc-gn">'+names.length+'</span></div>'+(names.length?names.map(function(c){ return '<div class="mxc-r" role="menuitem" tabindex="0" data-mxc="open" data-id="'+c.id+'"><span class="mxc-cb">'+HD_I.chat+'</span><span class="mxc-nm">'+mxcMark(c.n,rx)+'</span><span class="mxc-wh">'+esc(mxsWhen(c.t))+'</span></div>'; }).join(''):'<div class="mxc-e is-sm">No chat is called that.</div>');
  out+='<div class="mxc-g">'+mxcI('sparkles')+'Inside conversations <span class="mxc-gn">'+inside.length+'</span></div>'+(inside.length?inside.map(function(c){ return '<div class="mxc-r mxc-pv" role="menuitem" tabindex="0" data-mxc="open" data-id="'+c.id+'"><span class="mxc-cb">'+HD_I.chat+'</span><span class="mxc-tx"><span class="mxc-l1"><span class="mxc-nm">'+esc(c.n)+'</span><span class="mxc-wh">'+esc(bandOf(c.t))+'</span></span><span class="mxc-sm is-q">'+mxcMark(c.s,rx)+'</span></span></div>'; }).join(''):'<div class="mxc-e is-sm">Mira found it in no conversation.</div>');
  return out; }

function mxcBody(q){ return MXC.opt==='o2'?mxc2List(q):MXC.opt==='o3'?mxc3Items(q):MXC.opt==='o4'?mxc4List(q):mxc5List(q); }
function mxcRefresh(keepTabs){ var m=$('.mxc'); if(!m) return; var q=$('[data-mxc-q]',m), l=$('.mxc-l',m); if(l) l.innerHTML=mxcBody(q?q.value.trim():''); if(MXC.opt==='o4'){ var tb=$('.mxc-tabs',m); if(tb) tb.outerHTML=mxc4Tabs(); } }
function mxcMenu(btn){ var open=btn.classList.contains('open'); closePops(); if(open) return; MXC.hi=0;
  var m=document.createElement('div'); m.className='mx-pop mxc mxc-'+MXC.opt; m.setAttribute('role',MXC.opt==='o3'?'dialog':'menu');
  var ph=MXC.opt==='o3'?'Search chats or type a command…':MXC.opt==='o5'?'Search chat names and conversations…':'Search AI chats…';
  var top=MXC.opt==='o4'?mxc4Tabs():'', foot=MXC.opt==='o3'?'<div class="mxc-ft"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div>':
    (MXC.opt==='o2'?'<button type="button" class="mxc-new" data-mxc="new">'+mxcI('plus')+'New chat</button>':'');
  m.innerHTML=(MXC.opt==='o3'?'<div class="mxc-scrim" data-mxc="close"></div><div class="mxc-pal">':'')+mxcSearch(ph)+top+'<div class="mxc-l" role="'+(MXC.opt==='o3'?'listbox':'presentation')+'">'+mxcBody('')+'</div>'+foot+(MXC.opt==='o3'?'</div>':'');
  document.body.appendChild(m); mxcPlace(m,btn);
  btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); MX.pop=m; MX.popFor=btn; hdTipHide(); var q=$('[data-mxc-q]',m); if(q) q.focus(); }
function mxcPlace(m,btn){ var r=btn.getBoundingClientRect();
  if(MXC.opt==='o3'){ var c=($('.mira-chat')||document.body).getBoundingClientRect(), w=Math.min(520,c.width-32), p=$('.mxc-pal',m); p.style.width=w+'px';
    /* mira.html opens it as a DROPDOWN under the chat name, with no dimmed / blurred page (request, 24 Nov 2026) - MXC.drop; the artifact
       keeps the centred palette */
    if(MXC.drop){ m.classList.add('is-drop'); p.style.left=Math.round(Math.max(8,Math.min(r.left,window.innerWidth-w-8)))+'px'; p.style.top=Math.round(r.bottom+6)+'px'; return; }
    p.style.left=Math.round(c.left+(c.width-w)/2)+'px'; p.style.top=Math.round(r.bottom+18)+'px'; return; }
  m.style.left=r.left+'px'; m.style.top=(r.bottom+6)+'px'; }
function mxcGo(id){ closePops(); show(id); }
function mxcPaletteKey(e){ var m=$('.mxc-o3'); if(!m) return; if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); MXC.hi=(MXC.hi+(e.key==='ArrowDown'?1:-1)+MXC.n)%Math.max(MXC.n,1);
    $$('.mxc-pi',m).forEach(function(r){ var on=+r.getAttribute('data-i')===MXC.hi; r.classList.toggle('hi',on); if(on) r.scrollIntoView&&(r.parentNode.scrollTop=Math.max(0,r.offsetTop-r.parentNode.clientHeight/2)); }); }
  else if(e.key==='Enter'){ e.preventDefault(); var r=$('.mxc-pi.hi',m); if(r) mxcAct(r); } }
function mxcAct(b){ var a=b.getAttribute('data-mxc'), id=b.getAttribute('data-id');
  if(a==='open') mxcGo(id); else if(a==='new'){ closePops(); show('new'); } else if(a==='close') closePops();
  else if(a==='renc'){ closePops(); hdRename(MX.cur); } else if(a==='delc'){ closePops(); hdDel(MX.cur); }
  else if(a==='tab'){ MXC.tab=b.getAttribute('data-k'); mxcRefresh(); }
  else if(a==='pin'){ if(MXC.pin[id]) delete MXC.pin[id]; else MXC.pin[id]=1; toast(MXC.pin[id]?'Pinned':'Unpinned'); mxcRefresh(); }
  else if(a==='ren') mxcRen(b.closest('.mxc-r'),id);
  else if(a==='del'){ var ra=hdRow(id); if(id===MX.cur){ closePops(); hdDel(id); return; } if(ra) ra.closest('li').remove(); delete MX.panes[id]; delete MXC.pin[id]; bandPaint(); toast('Chat deleted'); mxcRefresh(); } }
/* rename IN PLACE (Ask AI's rule, as Option 1): the row's name becomes a field; Enter / click-away saves, Esc keeps the old name */
function mxcRen(row,id){ var nm=$('.mxc-nm',row), old=nm.textContent, inp=document.createElement('input'); inp.className='mxc-in'; inp.value=old; row.classList.add('is-ren'); nm.replaceWith(inp); inp.focus(); inp.select();
  var done=function(ok){ inp.onblur=null; var v=(ok&&inp.value.trim())||old, a=hdRow(id); if(a){ $('.mira-recent-name',a).textContent=v; a.title=v; } if(id===MX.cur){ var h=$('#mxPane .mx-hdn'); if(h) h.textContent=v; } mxcRefresh(); };
  inp.onkeydown=function(e){ e.stopPropagation(); if(e.key==='Enter') done(true); else if(e.key==='Escape') done(false); }; inp.onblur=function(){ done(true); }; }
function mxcInit(v){ MXC.opt=v;
  var D=864e5, now=Date.now(); [['Disk usage on Linux hosts',3*D+4*36e5],['Interface flaps on core-sw-01',5*D+2*36e5],['Monthly SLA report',12*D+7*36e5]].forEach(function(s){ var id=fileChat(s[0]); MX.at[id]=now-s[1]; MXC[s[0]]=id; }); bandPaint(); show('new');
  MXC.pin.c3=1; MXC.pin[MXC['Monthly SLA report']]=1;
  mxcWire(v); }
/* the switcher's wiring alone (no demo chats) - mira.html turns on Option 3, the command palette, by default with this (24 Nov 2026) */
function mxcWire(v){ MXC.opt=v; if(mxcWire.on) return; mxcWire.on=1;
  hdMenu=mxcMenu;
  if(v==='o5') setTimeout(function(){ var q=$('.mxc [data-mxc-q]'); if(q){ q.value='90%'; mxcRefresh(); } },700);
  if(!document.getElementById('mxc-css')){ var st=document.createElement('style'); st.id='mxc-css'; st.textContent=MXC_CSS; document.head.appendChild(st); }
  window.addEventListener('click',function(e){ var t=e.target, m=t.closest&&t.closest('.mxc'); if(!m) return; e.stopPropagation();
    var b=t.closest('[data-mxc]'); if(b&&b.tagName!=='LABEL') mxcAct(b); },true);
  document.addEventListener('input',function(e){ if(e.target.matches&&e.target.matches('.mxc [data-mxc-q]')){ MXC.hi=0; mxcRefresh(); } },true);
  document.addEventListener('keydown',function(e){ if(!$('.mxc')) return; if(MXC.opt==='o3') mxcPaletteKey(e); else if(e.key==='Enter'){ var r=e.target.closest&&e.target.closest('.mxc [data-mxc="open"]'); if(r){ e.preventDefault(); mxcGo(r.getAttribute('data-id')); } } },true); }
var MXC_CSS='.mxc-o3.is-drop{pointer-events:none}.mxc-o3.is-drop .mxc-pal{pointer-events:auto}.mxc-o3.is-drop .mxc-scrim{background:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:auto}'+
'.mxc{position:fixed;z-index:3000;width:360px;max-height:72vh;display:flex;flex-direction:column;padding:8px;background:var(--mira-surface-raised);border:1px solid var(--mira-panel-edge);border-radius:10px;box-shadow:var(--mira-ask-shadow);color:var(--mira-text-strong);font-size:13px}'+
 '.mxc-ic{display:inline-grid;place-items:center;flex:0 0 16px;width:16px;height:16px;color:var(--mira-text-muted)}.mxc-ic svg{width:16px;height:16px}'+
 '.mxc-s{display:flex;align-items:center;gap:8px;flex:0 0 auto;height:34px;margin:0 0 6px;padding:0 10px;border:1px solid var(--mira-panel-edge);border-radius:7px;background:var(--mira-surface)}'+
 '.mxc-s svg{flex:0 0 15px;width:15px;height:15px;fill:none;stroke:var(--mira-text-muted);stroke-width:2;stroke-linecap:round}.mxc-s:focus-within{border-color:var(--mira-accent)}'+
 '.mxc-s input{flex:1;min-width:0;border:0;background:transparent;color:var(--mira-text-strong);font:inherit;font-size:13px;outline:none}'+
 '.mxc-l{flex:1;min-height:0;overflow:auto}'+
 '.mxc-g{display:flex;align-items:center;gap:6px;padding:10px 8px 4px;font-size:12px;font-weight:600;color:var(--mira-text-muted)}.mxc-g .mxc-ic{width:14px;height:14px;flex-basis:14px;color:var(--mira-name)}.mxc-g .mxc-ic svg{width:14px;height:14px}'+
 '.mxc-gn{font-weight:500;font-variant-numeric:tabular-nums;color:var(--mira-text-dimmed)}'+
 '.mxc-r{position:relative;display:flex;align-items:center;gap:9px;min-height:34px;padding:7px 8px;border-radius:6px;cursor:pointer}'+
 '.mxc-r:hover,.mxc-r.hi{background:var(--mira-row-hover)}.mxc-r.on .mxc-nm{font-weight:600}.mxc-r:focus-visible{outline:2px solid var(--mira-accent);outline-offset:-2px}'+
 '.mxc-cb{flex:0 0 16px;width:16px;height:16px;display:grid;place-items:center;color:var(--mira-text-muted)}.mxc-cb svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'+
 '.mxc-r.on .mxc-cb{color:var(--mira-text-strong)}.mxc-r.on .mxc-cb svg{fill:currentColor}'+
 '.mxc-nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
 '.mxc-wh{flex:0 0 auto;font-size:12px;color:var(--mira-text-muted);white-space:nowrap}'+
 '.mxc mark{background:var(--mira-accent-25);color:var(--mira-text-strong);border-radius:3px;padding:0 1px}'+
 '.mxc-e{padding:16px 8px;font-size:12.5px;line-height:1.5;color:var(--mira-text-muted)}.mxc-e.is-sm{padding:4px 8px 8px 33px}.mxc-e .mxc-ic{vertical-align:-3px;width:14px;height:14px}'+
 '.mxc-in{flex:1;min-width:0;padding:2px 6px;border:1px solid var(--mira-accent);border-radius:5px;background:transparent;color:var(--mira-text-strong);font:inherit;font-size:13px;outline:none}.mxc-r.is-ren .mxc-ac,.mxc-r.is-ren .mxc-wh{display:none!important}'+
 '.mxc-ac{position:absolute;top:5px;right:6px;display:flex;gap:2px;visibility:hidden}.mxc-r:hover .mxc-ac,.mxc-r:focus-within .mxc-ac{visibility:visible}.mxc-r:hover .mxc-l1 .mxc-wh,.mxc-r:focus-within .mxc-l1 .mxc-wh{visibility:hidden}'+
 '.mxc-ac i{width:24px;height:24px;display:grid;place-items:center;border-radius:5px;color:var(--mira-text-muted)}.mxc-ac i:hover{background:var(--mira-panel-edge);color:var(--mira-text-strong)}.mxc-ac i.dl:hover{color:var(--mira-ask-danger)}'+
 '.mxc-ac svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'+
 /* option 2 */
 '.mxc-o2{width:380px}.mxc-pv{align-items:flex-start}.mxc-pv .mxc-cb{margin-top:2px}.mxc-tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.mxc-l1{display:flex;align-items:center;gap:8px;min-height:20px}'+
 '.mxc-sm{font-size:12px;line-height:17px;color:var(--mira-text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mxc-sm.is-q{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}'+
 '.mxc-new{display:flex;align-items:center;gap:9px;flex:0 0 auto;margin:6px 0 0;padding:9px 8px 3px;border:0;border-top:1px solid var(--mira-panel-edge);border-radius:0;background:none;color:var(--mira-text-strong);font:inherit;font-size:13px;font-weight:500;cursor:pointer;text-align:left}.mxc-new:hover{color:var(--mira-name)}'+
 /* option 3 */
 '.mxc-o3{inset:0;width:auto;max-height:none;padding:0;border:0;border-radius:0;background:none;box-shadow:none}'+
 '.mxc-scrim{position:absolute;inset:0;background:var(--mira-backdrop)}'+
 '.mxc-pal{position:fixed;display:flex;flex-direction:column;max-height:70vh;padding:0;background:var(--mira-surface-raised);border:1px solid var(--mira-panel-edge);border-radius:12px;box-shadow:var(--mira-ask-shadow);overflow:hidden}'+
 '.mxc-o3 .mxc-s{height:48px;margin:0;padding:0 16px;border:0;border-bottom:1px solid var(--mira-panel-edge);border-radius:0;background:none}.mxc-o3 .mxc-s input{font-size:14.5px}.mxc-o3 .mxc-s:focus-within{border-color:var(--mira-panel-edge)}'+
 '.mxc-o3 .mxc-l{padding:4px 8px 8px}.mxc-pi .mxc-ic{color:var(--mira-text-toned)}.mxc-pi.is-danger .mxc-nm,.mxc-pi.is-danger .mxc-ic{color:var(--mira-ask-danger)}'+
 '.mxc-ft{display:flex;gap:16px;flex:0 0 auto;padding:9px 16px;border-top:1px solid var(--mira-panel-edge);font-size:11.5px;color:var(--mira-text-muted)}'+
 '.mxc-ft kbd{display:inline-grid;place-items:center;min-width:18px;height:18px;margin-right:3px;padding:0 4px;border:1px solid var(--mira-kbd-edge);border-radius:4px;font:inherit;font-size:11px;color:var(--mira-text-toned)}'+
 /* option 4 */
 '.mxc-tabs{display:flex;gap:16px;flex:0 0 auto;margin:0 0 4px;padding:0 8px;border-bottom:1px solid var(--mira-panel-edge)}'+
 '.mxc-tab{display:flex;align-items:center;gap:6px;height:34px;margin-bottom:-1px;padding:0;border:0;border-bottom:2px solid transparent;background:none;color:var(--mira-text-muted);font:inherit;font-size:13px;font-weight:500;cursor:pointer}'+
 '.mxc-tab:hover{color:var(--mira-text-strong)}.mxc-tab.on{color:var(--mira-text-strong);border-bottom-color:var(--mira-accent)}'+
 '.mxc-tn{min-width:18px;height:16px;padding:0 5px;border-radius:8px;background:var(--mira-row-on);font-size:11px;line-height:16px;text-align:center;font-variant-numeric:tabular-nums;color:var(--mira-text-muted)}'+
 '.mxc-pn{display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px;margin:-4px -4px -4px 0;padding:0;border:0;border-radius:5px;background:none;color:var(--mira-text-muted);opacity:0;cursor:pointer}.mxc-pn svg{width:15px;height:15px}'+
 '.mxc-r:hover .mxc-pn,.mxc-pn:focus-visible,.mxc-r.is-pin .mxc-pn{opacity:1}.mxc-r.is-pin .mxc-pn{color:var(--mira-name)}.mxc-pn:hover{background:var(--mira-panel-edge);color:var(--mira-text-strong)}'+
 /* option 5 */
 '.mxc-o5{width:380px}.mxc-tip{display:flex;align-items:flex-start;gap:8px;margin:0 0 4px;padding:8px 10px;border-radius:7px;background:var(--mira-accent-08);font-size:12px;line-height:17px;color:var(--mira-text-toned)}.mxc-tip .mxc-ic{color:var(--mira-name);margin-top:1px}.mxc-tip b{color:var(--mira-text-strong);font-weight:600}';
