function w(n){return{on:(e,c)=>{n[e]||(n[e]=[]),n[e].push(c)},off:(e,c)=>{let p=[],i=n[e];if(i&&c){let s=0,o=i.length;for(;s<o;s++)i[s]!==c&&p.push(i[s])}p.length?i[e]=p:delete i[e]},emit:(e,c,p)=>{let i=n[e]||[],s=i.length,o=null;for(let f=0;f<s;f++){let d=i[f].apply(c,[p]);o===null&&d===!1&&(o=!0)}return o}}}function h(n,u){let{config:t}=n,{classes:l}=t;return e=>{let c=i=>{if(typeof i!="number")return n.active!==e.number&&(n.active=e.number),e;if(n.folds[i])return n.active=e.number,n.folds[i];throw new TypeError(`No fold exists at index: ${i}`)},p=i=>{i.button.ariaDisabled="false",i.button.ariaExpanded="false",i.button.classList.remove(l.opened),i.content.classList.remove(l.expanded),i.expanded=!1,i.content.style.maxHeight="0"};e.open=i=>{let s=c(i);s.expanded||s.disabled||(s.close(),s.button.ariaDisabled="true",s.button.ariaExpanded="true",s.button.classList.add(l.opened),s.content.classList.add(l.expanded),s.content.style.maxHeight=`${s.content.scrollHeight}px`,s.expanded=!0,s.disable(),u.emit("expand",n,s))},e.focus=()=>{n.active=e.number,e.button.classList.add(l.focused),u.emit("focus",n,e)},e.blur=()=>e.button.classList.remove(l.focused),e.enable=i=>{let s=c(i);s.disabled&&(s.disabled=!1,s.button.ariaDisabled="false",s.button.classList.remove(l.disabled))},e.disable=i=>{let s=c(i);s.disabled||(s.expanded?t.persist&&(s.disabled=!0,s.button.ariaDisabled="true"):(s.close(),s.disabled=!0,s.button.ariaDisabled="true",s.button.classList.add(l.disabled)))},e.close=i=>{let s=c(i);if(t.multiple&&s.expanded)p(s);else for(let o of n.folds)if(o.expanded){if(t.persist&&o.number===s.number)break;p(o),s=o;break}s.enable(),u.emit("collapse",n,s)},e.toggle=()=>{if(!u.emit("toggle",n,e))return e.expanded?e.close():e.open()},e.destroy=(i=!1)=>{e.close(),e.button.removeEventListener("click",e.toggle),e.button.removeEventListener("focus",e.focus),e.button.removeEventListener("blur",e.blur),i&&(n.element.removeChild(e.content),n.element.removeChild(e.button))},e.button.addEventListener("click",e.toggle),e.button.addEventListener("focus",e.focus),e.button.addEventListener("blur",e.blur),n.folds.push(e)}}var L=n=>{let u=n.trim();if(!/true|false/.test(u))throw new TypeError(`Invalid value. Boolean expected, received: ${u}`);return u==="true"},E=(n,u)=>{typeof n!="object"&&(n=Object.create(null));let t=Object.create(null),l=Object.create(null);l.initial="initial",l.opened="opened",l.disabled="disabled",l.expanded="expanded",l.focused="focused","classes"in n&&Object.assign(l,n.classes),t.classes=l,t.persist=!0,t.multiple=!1,t.schema="data-relapse",typeof n=="object"&&Object.assign(t,n);let e=/^(?:persist|multiple)$/,c=t.schema===null?5:t.schema.length+1;for(let{nodeName:p,nodeValue:i}of u){let s=p.slice(c);e.test(s)&&(t[s]=L(i))}return t};function m(n,u){window.relapse instanceof Map||(window.relapse=new Map);let t=Object.create(null);t.folds=[],t.events=Object.create(null),t.element=typeof n=="string"?document.body.querySelector(n):n,t.id=`A${window.relapse.size}`,t.config=E(u,t.element.attributes);let l=t.element.getAttribute("data-relapse"),e=t.element.getAttribute("id");if(l===null&&e===null)l=t.id;else if(l!==null&&e!==null){if(window.relapse.has(e)||window.relapse.has(l))throw new TypeError(`An existing instance is using id "${l}"`)}else l===null&&e!==null&&(l=e);if(window.relapse.has(l))throw new TypeError(`An existing instance is using id "${l}"`);t.element.ariaMultiSelectable=`${t.config.multiple}`;let c=t.element.children,p=c.length,i=w(t.events),s=h(t,i),{classes:o}=t.config;for(let d=0;d<p;d=d+2){let a=c[d],b=c[d+1],r=Object.create(null);r.number=t.folds.length;let v=a.classList.contains(o.initial),x=a.classList.contains(o.opened),g=a.classList.contains(o.disabled),y=b.classList.contains(o.expanded);a.ariaExpanded==="true"||x||y||v?(x?a.ariaExpanded="true":a.classList.add(o.opened),y||b.classList.add(o.expanded),g||a.classList.add(o.disabled),v||a.classList.remove(o.initial),a.ariaDisabled="true",r.expanded=!0,r.disabled=!0):a.ariaDisabled==="true"||g?(g?a.ariaDisabled="false":a.classList.add(o.disabled),b.classList.remove(o.expanded),a.classList.remove(o.opened),a.ariaExpanded="false",r.expanded=!1,r.disabled=!0):(r.expanded=!1,r.disabled=!1,a.ariaExpanded="false",a.ariaDisabled="false"),a.id&&(r.id=a.id),b.id&&(r.id=b.id),"id"in r||(r.id=`${t.id}F${r.number}`,a.id=`B${r.id}`,b.id=`C${r.id}`),a.setAttribute("aria-controls",r.id),b.setAttribute("aria-labelledby",a.id),b.setAttribute("role","region"),r.button=a,r.content=b,r.expanded&&(r.content.style.maxHeight=`${r.content.scrollHeight}px`),s(r)}let f=(d,a,b=!1)=>{if(typeof a=="number")return d.charCodeAt(0)===100?t.folds[a][d](b):t.folds[a][d]();if(typeof a=="string"){for(let r of t.folds)if(r.button.dataset[`${t.config.schema}-fold`]===a)return d.charCodeAt(0)===100?r[d](b):r[d]()}throw new TypeError(`Fold does not exist: "${a}"`)};return t.on=i.on,t.off=i.off,t.collapse=d=>f("close",d),t.expand=d=>f("open",d),t.destroy=(d,a=!1)=>{if(typeof d=="undefined")for(let b of t.folds)b.destroy();else f("destroy",d,a);t.element.removeAttribute("aria-multiselectable"),i.emit("destroy",t),window.relapse.delete(l)},window.relapse.set(l,t),t}m.get=n=>n?window.relapse.get(n):window.relapse;m.load=()=>{document.readyState==="loading"&&setTimeout(m.load,50);let n=document.querySelectorAll("[data-relapse]");for(let u of n)u.getAttribute("data-relapse")!==""&&m(u)};var $=m;export{w as $events,$ as default};
