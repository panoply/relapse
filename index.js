var L=class extends Array{constructor(){super(...arguments);this.refs=Object.create(null);}get(a){let n=typeof a;if(n==="number")return this[a];if(n==="string"){if(a in this.refs)return this[this.refs[a]];throw new Error(`Relapse: No fold using an id value of: ${a}`)}else if(n==="undefined")return this}};function N(t){function s(u,o,e){let i=t[u]||[],c=i.length,m=null;for(let b=0;b<c;b++){let h=i[b].apply(o,[e]);m===null&&h===!1&&(m=!0);}return m}function a(u,o){t[u]||(t[u]=[]),t[u].push(o);}function n(u,o){let e=[],i=t[u];if(i&&o)for(let c=0,m=i.length;c<m;c++)i[c]!==o&&e.push(i[c]);e.length?i[u]=e:delete i[u];}return {on:a,off:n,emit:s}}function A(t,s){let{classes:a}=t.config;return function(n){let u=e=>{if(typeof e!="number")return t.active!==n.index&&(t.active=n.index),n;if(t.folds.get(e))return t.active=n.index,t.folds.get(e);throw new Error(`relapse: No fold exists at index: ${e}`)},o=e=>{e.button.ariaDisabled="false",e.button.ariaExpanded="false",e.element.classList.remove(a.expanded),e.expanded=!1,e.button.classList.contains(a.initial)&&e.button.classList.remove(a.initial),e.element.style.setProperty("max-height","0"),t.parent!==null&&t.parent.style.setProperty("max-height",`${t.parent.scrollHeight-e.height}px`),t.folds.length-1===e.index?e.element.addEventListener("transitionend",function i(){e.expanded||(e.element.style.setProperty("opacity","0"),e.element.style.setProperty("visibility","hidden"),e.button.classList.remove(a.opened)),e.element.removeEventListener("transitionend",i);}):(e.element.style.setProperty("opacity","0"),e.element.style.setProperty("visibility","hidden"),e.button.classList.remove(a.opened));};n.open=function(e){let i=u(e);i.expanded||(i.close(),i.height=i.element.scrollHeight,i.button.ariaDisabled="true",i.button.ariaExpanded="true",i.button.classList.add(a.opened),i.element.classList.add(a.expanded),i.element.style.setProperty("max-height",`${i.height}px`),i.element.style.setProperty("opacity","1"),i.element.style.setProperty("visibility","visible"),t.parent!==null&&t.parent.style.setProperty("max-height",`${t.parent.scrollHeight+i.height}px`),i.expanded=!0,i.disable(),t.count=t.folds.filter(({expanded:c})=>c).length,s.emit("expand",t,i));},n.close=function(e){let i=u(e);if(t.config.multiple)(t.config.persist===!1||t.config.persist&&t.count>1)&&o(i);else for(let c of t.folds.values())if(c.expanded===!0){if(t.config.persist&&c.index===i.index)break;o(c),i=c;break}i.enable(),t.count=t.folds.filter(({expanded:c})=>c).length,s.emit("collapse",t,i);},n.focus=function(){t.active=n.index,n.button.classList.add(a.focused),s.emit("focus",t,n);},n.blur=function(){n.button.classList.remove(a.focused);},n.enable=function(e){let i=u(e);i.disabled&&(i.disabled=!1,i.button.ariaDisabled="false",i.button.classList.remove(a.disabled));},n.disable=function(e){let i=u(e);i.disabled||(i.expanded?t.config.persist&&(i.disabled=!0,i.button.ariaDisabled="true"):(i.close(),i.disabled=!0,i.button.ariaDisabled="true",i.button.classList.add(a.disabled)));},n.toggle=function(){if(s.emit("toggle",t,n)!==!1)return n.expanded?n.close():n.open()},n.destroy=function(e=!1){n.close(),n.button.removeEventListener("click",n.toggle),n.button.removeEventListener("focus",n.focus),n.button.removeEventListener("blur",n.blur),e&&(t.element.removeChild(n.element),t.element.removeChild(n.button));},n.button.addEventListener("click",n.toggle),n.button.addEventListener("focus",n.focus),n.button.addEventListener("blur",n.blur),n.element.hasAttribute("id")?(t.folds.push(n),t.folds.refs[n.element.id]=t.folds.length-1):t.folds.push(n);}}var I=t=>{let s=Object.create(null);if(s.persist=!0,s.multiple=!1,s.parent=null,s.schema="data-relapse",s.duration=225,s.classes=Object.create(null),s.classes.initial="initial",s.classes.opened="opened",s.classes.disabled="disabled",s.classes.expanded="expanded",s.classes.focused="focused",typeof t=="object")for(let a in t)if(a==="classes")for(let n in t[a])s.classes[n]=t[a][n];else s[a]=t[a];return s};function S(t,s){let a=t.schema.length+1;for(let{nodeName:n,nodeValue:u}of s){if(!n.startsWith(t.schema))continue;let o=n.slice(a),e=u.trim();if(o==="persist"||o==="multiple")if(e==="true"||e==="false")t[o]=e==="true";else throw new TypeError(`relapse: Invalid ${n} attribute value. Boolean expected, received: ${e}`);else if(o==="duration"){if(isNaN(+e))throw new TypeError(`relapse: Invalid ${n} attribute value. Number expected, received: ${e}`);t[o]=+e;}}return t}function M(t){let s=t.duration/2;return `will-change:visibility,opacity,max-height;overflow:hidden;transition:visibility ${s}ms linear,opacity ${s}ms linear,max-height ${t.duration}ms ease-in-out;`}var $=function t(s,a){let n=typeof s=="string"||typeof s=="object"&&"tagName"in s;if(n&&s instanceof NodeList)throw TypeError("relapse: Invalid selector, NodeList is not supported, pass string or Element");let u=I(n?a:s),o=null;if(n)typeof s=="string"?o=document.body.querySelector(s):o=s;else for(let d of document.body.querySelectorAll(`[${u.schema}]`))t(d,a);if(o===null)return;window.relapse instanceof Map||(window.relapse=new Map);let e=Object.create(null);e.events=Object.create(null),e.folds=new L,e.element=o,e.id=`R${window.relapse.size}`,e.count=0,e.config=S(u,e.element.attributes),e.parent=e.config.parent;let i=null;o.hasAttribute(e.config.schema)?i=o.getAttribute(e.config.schema):"id"in o&&(i=o.id),i===null&&window.relapse.has(i)===!0&&(i=Math.random().toString(36).slice(2)),e.element.ariaMultiSelectable=`${e.config.multiple}`;let c=o.children,m=c.length,b=N(e.events),h=A(e,b),{classes:p}=e.config,g=isNaN(e.config.duration)||e.config.duration===-1?null:M(e.config);for(let d=0;d<m;d=d+2){let l=c[d],f=c[d+1],r=Object.create(null);r.index=e.folds.length;let w=l.classList.contains(p.initial),v=l.classList.contains(p.opened),x=l.classList.contains(p.disabled),E=f.classList.contains(p.expanded);l.ariaExpanded==="true"||v||E||w?(v?l.ariaExpanded="true":l.classList.add(p.opened),w||l.classList.remove(p.initial),E||f.classList.add(p.expanded),x&&(l.classList.add(p.disabled),l.ariaDisabled="true",r.disabled=!0),r.expanded=!0):l.ariaDisabled==="true"||x?(r.disabled=!0,x?l.ariaDisabled="true":l.classList.add(p.disabled),E?(r.expanded=!0,l.ariaExpanded="true"):(r.expanded=!1,l.ariaExpanded="false"),v&&l.classList.remove(p.opened)):(r.expanded=!1,r.disabled=!1,l.ariaExpanded="false",l.ariaDisabled="false"),"id"in l&&(r.id=l.id),"id"in f&&(r.id=f.id),"id"in r||(r.id=`${e.id}F${r.index}`,l.id=`B${r.id}`,f.id=`C${r.id}`),l.setAttribute("aria-controls",r.id),f.setAttribute("aria-labelledby",l.id),f.setAttribute("role","region"),Object.defineProperties(r,{button:{get(){return l}},element:{get(){return f}}}),r.expanded?(e.count=e.count+1,r.element.style.cssText=g!==null?`max-height:${r.element.scrollHeight}px;opacity:1;visibility:visible;${g}`:`max-height:${r.element.scrollHeight}px;opacity:1;visibility:visible;`):r.element.style.cssText=g!==null?`max-height:0px;opacity:0;visibility:hidden;${g}`:"max-height:0px;opacity:0;visibility:hidden;",h(r),window.relapse.set(i,null);for(let O of r.element.querySelectorAll(`[${e.config.schema}]`))t(O,{parent:r.element});}let y=(d,l,f=!1)=>{if(typeof l=="number")return d.charCodeAt(0)===100?e.folds[l][d](f):e.folds[l][d]();if(typeof l=="string"){for(let r of e.folds.values())if(r.button.dataset[`${e.config.schema}-fold`]===l)return d.charCodeAt(0)===100?r[d](f):r[d]()}throw new Error(`relapse: Fold does not exist: "${l}"`)};return e.on=b.on,e.off=b.off,e.collapse=d=>y("close",d),e.expand=d=>y("open",d),e.destroy=(d,l=!1)=>{if(typeof d=="undefined")for(let f of e.folds.values())f.destroy();else y("destroy",d,l);e.element.removeAttribute("aria-multiselectable"),b.emit("destroy",e),window.relapse.delete(i);},window.relapse.set(i,e),n?e:Array.from(window.relapse.values())};$.get=t=>t?window.relapse.get(t):window.relapse;var T=$;

export { T as default };
