(()=>{function L(n){return{on:(e,c)=>{n[e]||(n[e]=[]),n[e].push(c)},off:(e,c)=>{let f=[],i=n[e];if(i&&c){let s=0,r=i.length;for(;s<r;s++)i[s]!==c&&f.push(i[s])}f.length?i[e]=f:delete i[e]},emit:(e,c,f)=>{let i=n[e]||[],s=i.length,r=null;for(let p=0;p<s;p++){let d=i[p].apply(c,[f]);r===null&&d===!1&&(r=!0)}return r}}}function h(n,u){let{config:t}=n,{classes:l}=t;return e=>{let c=i=>{if(typeof i!="number")return n.active!==e.number&&(n.active=e.number),e;if(n.folds[i])return n.active=e.number,n.folds[i];throw new TypeError(`No fold exists at index: ${i}`)},f=i=>{i.button.ariaDisabled="false",i.button.ariaExpanded="false",i.button.classList.remove(l.opened),i.content.classList.remove(l.expanded),i.expanded=!1,i.content.style.maxHeight="0"};e.open=i=>{let s=c(i);s.expanded||s.disabled||(s.close(),s.button.ariaDisabled="true",s.button.ariaExpanded="true",s.button.classList.add(l.opened),s.content.classList.add(l.expanded),s.content.style.maxHeight=`${s.content.scrollHeight}px`,s.expanded=!0,s.disable(),u.emit("expand",n,s))},e.focus=()=>{n.active=e.number,e.button.classList.add(l.focused),u.emit("focus",n,e)},e.blur=()=>e.button.classList.remove(l.focused),e.enable=i=>{let s=c(i);s.disabled&&(s.disabled=!1,s.button.ariaDisabled="false",s.button.classList.remove(l.disabled))},e.disable=i=>{let s=c(i);s.disabled||(s.expanded?t.persist&&(s.disabled=!0,s.button.ariaDisabled="true"):(s.close(),s.disabled=!0,s.button.ariaDisabled="true",s.button.classList.add(l.disabled)))},e.close=i=>{let s=c(i);if(t.multiple&&!s.expanded)f(s);else for(let r of n.folds)if(r.expanded){if(t.persist&&r.number===s.number)break;f(r),s=r;break}s.enable(),u.emit("collapse",n,s)},e.toggle=()=>{if(!u.emit("toggle",n,e))return e.expanded?e.close():e.open()},e.destroy=(i=!1)=>{e.close(),e.button.removeEventListener("click",e.toggle),e.button.removeEventListener("focus",e.focus),e.button.removeEventListener("blur",e.blur),i&&(n.element.removeChild(e.content),n.element.removeChild(e.button))},e.button.addEventListener("click",e.toggle),e.button.addEventListener("focus",e.focus),e.button.addEventListener("blur",e.blur),n.folds.push(e)}}var E=n=>{let u=n.trim();if(!/true|false/.test(u))throw new TypeError(`Invalid value. Boolean expected, received: ${u}`);return u==="true"},$=(n,u)=>{typeof n!="object"&&(n=Object.create(null));let t=Object.create(null),l=Object.create(null);l.initial="initial",l.opened="opened",l.disabled="disabled",l.expanded="expanded",l.focused="focused","classes"in n&&Object.assign(l,n.classes),t.classes=l,t.persist=!0,t.multiple=!1,t.schema="data-relapse",typeof n=="object"&&Object.assign(t,n);let e=/^(?:persist|multiple)$/,c=t.schema===null?5:t.schema.length+1;for(let{nodeName:f,nodeValue:i}of u){let s=f.slice(c);e.test(s)&&(t[s]=E(i))}return t};function m(n,u){window.relapse instanceof Map||(window.relapse=new Map);let t=Object.create(null);t.folds=[],t.events=Object.create(null),t.element=typeof n=="string"?document.body.querySelector(n):n,t.id=`A${window.relapse.size}`,t.config=$(u,t.element.attributes);let l=t.element.getAttribute("data-relapse"),e=t.element.getAttribute("id");if(l===null&&e===null)l=t.id;else if(l!==null&&e!==null){if(window.relapse.has(e)||window.relapse.has(l))throw new TypeError(`An existing instance is using id "${l}"`)}else l===null&&e!==null&&(l=e);if(window.relapse.has(l))throw new TypeError(`An existing instance is using id "${l}"`);t.element.ariaMultiSelectable=`${t.config.multiple}`;let c=t.element.children,f=c.length,i=L(t.events),s=h(t,i),{classes:r}=t.config;for(let d=0;d<f;d=d+2){let a=c[d],b=c[d+1],o=Object.create(null);o.number=t.folds.length;let x=a.classList.contains(r.initial),y=a.classList.contains(r.opened),g=a.classList.contains(r.disabled),w=b.classList.contains(r.expanded);a.ariaExpanded==="true"||y||w||x?(y?a.ariaExpanded="true":a.classList.add(r.opened),w||b.classList.add(r.expanded),g||a.classList.add(r.disabled),x||a.classList.remove(r.initial),a.ariaDisabled="true",o.expanded=!0,o.disabled=!0):a.ariaDisabled==="true"||g?(g?a.ariaDisabled="false":a.classList.add(r.disabled),b.classList.remove(r.expanded),a.classList.remove(r.opened),a.ariaExpanded="false",o.expanded=!1,o.disabled=!0):(o.expanded=!1,o.disabled=!1,a.ariaExpanded="false",a.ariaDisabled="false"),a.id&&(o.id=a.id),b.id&&(o.id=b.id),"id"in o||(o.id=`${t.id}F${o.number}`,a.id=`B${o.id}`,b.id=`C${o.id}`),a.setAttribute("aria-controls",o.id),b.setAttribute("aria-labelledby",a.id),b.setAttribute("role","region"),o.button=a,o.content=b,s(o)}let p=(d,a,b=!1)=>{if(typeof a=="number")return d.charCodeAt(0)===100?t.folds[a][d](b):t.folds[a][d]();if(typeof a=="string"){for(let o of t.folds)if(o.button.dataset[`${t.config.schema}-fold`]===a)return d.charCodeAt(0)===100?o[d](b):o[d]()}throw new TypeError(`Fold does not exist: "${a}"`)};return t.on=i.on,t.off=i.off,t.collapse=d=>p("close",d),t.expand=d=>p("open",d),t.destroy=(d,a=!1)=>{if(typeof d=="undefined")for(let b of t.folds)b.destroy();else p("destroy",d,a);t.element.removeAttribute("aria-multiselectable"),i.emit("destroy",t),window.relapse.delete(l)},window.relapse.set(l,t),t}m.get=n=>n?window.relapse.get(n):window.relapse;m.load=()=>{document.readyState==="loading"&&setTimeout(m.load,50);let n=document.querySelectorAll("[data-relapse]");for(let u of n)u.getAttribute("data-relapse")!==""&&m(u)};var v=m;document.readyState!=="loading"?v.load():document.addEventListener("DOMContentLoaded",v.load);})();
