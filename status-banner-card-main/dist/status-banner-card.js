function t(t,e,i,s){var o,n=arguments.length,a=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,f=globalThis,g=f.trustedTypes,_=g?g.emptyScript:"",m=f.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,m?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,S=w.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,R="?"+k,M=`<${R}>`,T=document,P=()=>T.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,U="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,H=/>/g,z=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,F=/"/g,j=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,J=T.createTreeWalker(T,129);function Y(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",a=L;for(let e=0;e<i;e++){const i=t[e];let r,c,l=-1,h=0;for(;h<i.length&&(a.lastIndex=h,c=a.exec(i),null!==c);)h=a.lastIndex,a===L?"!--"===c[1]?a=D:void 0!==c[1]?a=H:void 0!==c[2]?(j.test(c[2])&&(o=RegExp("</"+c[2],"g")),a=z):void 0!==c[3]&&(a=z):a===z?">"===c[0]?(a=o??L,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,r=c[1],a=void 0===c[3]?z:'"'===c[3]?F:B):a===F||a===B?a=z:a===D||a===H?a=L:(a=z,o=void 0);const d=a===z&&t[e+1].startsWith("/>")?" ":"";n+=a===L?i+M:l>=0?(s.push(r),i.slice(0,l)+E+i.slice(l)+k+d):i+k+(-2===l?e:d)}return[Y(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const a=t.length-1,r=this.parts,[c,l]=K(t,e);if(this.el=Z.createElement(c,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[n++],i=s.getAttribute(t).split(k),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?et:"?"===a[1]?it:"@"===a[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(r.push({type:6,index:o}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),J.nextNode(),r.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===R)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)r.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===W)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=N(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);J.currentNode=s;let o=J.nextNode(),n=0,a=0,r=i[0];for(;void 0!==r;){if(n===r.index){let e;2===r.type?e=new X(o,o.nextSibling,this,t):1===r.type?e=new r.ctor(o,r.name,r.strings,this,t):6===r.type&&(e=new ot(o,this,t)),this._$AV.push(e),r=i[++a]}n!==r?.index&&(o=J.nextNode(),n++)}return J.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),N(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Z(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new X(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=G(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let a,r;for(t=o[0],a=0;a<o.length-1;a++)r=G(this,s[i+a],e,a),r===W&&(r=this._$AH[a]),n||=!N(r)||r!==this._$AH[a],r===V?t=V:t!==V&&(t+=(r??"")+o[a+1]),this._$AH[a]=r}n&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends tt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??V)===W)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(Z,X),(w.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;class rt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new X(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}rt._$litElement$=!0,rt.finalized=!0,at.litElementHydrateSupport?.({LitElement:rt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:rt}),(at.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},dt=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ut({...t,state:!0,attribute:!1})}function ft(t,e){return t&&"string"==typeof t?t.includes("{{")?t.replace(/\{\{\s*(.+?)\s*\}\}/g,(t,i)=>{try{return function(t,e){const i=t.split("|").map(t=>t.trim());let s=gt(i[0],e);for(let t=1;t<i.length;t++)s=_t(s,i[t],e);return String(s??"")}(i.trim(),e)}catch(t){return console.warn(`[status-banner-card] Failed to evaluate expression: ${i}`,t),""}}):t:t??""}function gt(t,e){if("state"===t)return e.state;if(t.startsWith("attr.")){const i=t.substring(5);return e.attr[i]}const i=t.match(/^states\(['"](.+)['"]\)$/);if(i)return e.hass.states[i[1]]?.state??"unknown";const s=t.match(/^state_attr\(['"](.+)['"],\s*['"](.+)['"]\)$/);if(s)return e.hass.states[s[1]]?.attributes[s[2]];const o=t.match(/^as_timestamp\((.+)\)$/);if(o){const t=gt(o[1].trim(),e),i=new Date(String(t));return isNaN(i.getTime())?0:i.getTime()/1e3}const n=t.match(/^['"](.+)['"]$/);if(n)return n[1];const a=parseFloat(t);return isNaN(a)?t:a}function _t(t,e,i){const s=e.match(/^(\w+)(?:\((.+)\))?$/);if(!s)return t;const[,o,n]=s,a=String(t??"");switch(o){case"upper":return a.toUpperCase();case"lower":return a.toLowerCase();case"capitalize":return a.charAt(0).toUpperCase()+a.slice(1).toLowerCase();case"title":return a.replace(/\b\w/g,t=>t.toUpperCase());case"replace":{const[t,e]=mt(n);return a.replace(new RegExp(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(t),"g"),e??"")}case"default":{const[t]=mt(n);return a&&"unknown"!==a&&"unavailable"!==a?a:t??""}case"color_map":return i.colorMap?.[a]??i.colorMap?.default??a;case"timestamp_custom":{const[e]=mt(n),i="number"==typeof t?t:parseFloat(a);if(isNaN(i))return a;return function(t,e){const i=(t,e=2)=>String(t).padStart(e,"0"),s={"%Y":String(t.getFullYear()),"%y":String(t.getFullYear()).slice(-2),"%m":i(t.getMonth()+1),"%d":i(t.getDate()),"%H":i(t.getHours()),"%M":i(t.getMinutes()),"%S":i(t.getSeconds()),"%I":i(t.getHours()%12||12),"%p":t.getHours()>=12?"PM":"AM","%j":i(vt(t),3),"%w":String(t.getDay()),"%a":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][t.getDay()],"%A":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][t.getDay()],"%b":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()],"%B":["January","February","March","April","May","June","July","August","September","October","November","December"][t.getMonth()],"%%":"%"};let o=e;for(const[t,e]of Object.entries(s))o=o.replace(new RegExp(t,"g"),e);return o}(new Date(1e3*i),e??"%H:%M")}case"round":{const[e]=mt(n),i="number"==typeof t?t:parseFloat(a);if(isNaN(i))return a;const s=parseInt(e??"0",10);return i.toFixed(s)}case"int":{const e="number"==typeof t?t:parseFloat(a);return isNaN(e)?0:Math.floor(e)}case"float":{const t=parseFloat(a);return isNaN(t)?0:t}default:return console.warn(`[status-banner-card] Unknown filter: ${o}`),t}}function mt(t){if(!t)return[];const e=[];let i="",s=!1,o="";for(let n=0;n<t.length;n++){const a=t[n];'"'!==a&&"'"!==a||s?a===o&&s?(s=!1,o=""):","!==a||s?i+=a:(e.push(i.trim()),i=""):(s=!0,o=a)}return i.trim()&&e.push(i.trim()),e.map(t=>t.replace(/^['"]|['"]$/g,""))}function vt(t){const e=new Date(t.getFullYear(),0,0),i=t.getTime()-e.getTime();return Math.floor(i/864e5)}const bt={show_pattern:!0,show_status:!0,show_footer:!0,header_height:"120px",icon_size:"54px",border_radius:"16px",variant:"full",timestamp_attribute:"last_triggered",status_label:"Status",color_map:{blue:"#2196F3",green:"#4CAF50",purple:"#9C27B0",black:"#686868",red:"#F44336",orange:"#FF9800",yellow:"#FFEB3B",default:"#9E9E9E"}},$t={title:"Entity Not Found",subtitle:"Check configuration",icon:"mdi:alert-circle",color:"#F44336",statusText:"The configured entity could not be found."},yt={title:"Unknown State",subtitle:"",icon:"mdi:information",color:"#9E9E9E",status_text:""},xt="status-banner-card",wt="Status Banner Card",At="A flexible status card with banner design for any entity",St="https://github.com/johnneerdael/status-banner-card";function Ct(t,e,i){if(void 0!==t.state)if(t.state.startsWith("/")&&t.state.endsWith("/")){if(!new RegExp(t.state.slice(1,-1)).test(e))return!1}else if(t.state.startsWith("~")){if(t.state.slice(1).toLowerCase()!==e.toLowerCase())return!1}else if(t.state!==e)return!1;if(t.attribute){const e=String(i[t.attribute.name]??"");if(t.attribute.value.startsWith("/")&&t.attribute.value.endsWith("/")){if(!new RegExp(t.attribute.value.slice(1,-1)).test(e))return!1}else if(e!==t.attribute.value)return!1}return!0}function Et(t,e,i,s,o,n){const a=t.states[e];if(!a)return{...$t,subtitle:e,statusLabel:n||"Status"};const r=a.state,c=a.attributes,l={hass:t,entity:e,state:r,attr:c,colorMap:o},h=i?function(t,e,i){for(const s of i)if(Ct(s,t,e))return s;return null}(r,c,i):null,d=h||s||yt;return{title:ft(d.title||r,l),subtitle:ft(d.subtitle||"",l),icon:ft(d.icon||"mdi:information",l),color:ft(d.color||"#9E9E9E",l),statusText:ft(d.status_text||"",l),statusLabel:ft(n||"Status",l)}}const kt=a`
  :host {
    --sbc-card-bg: var(--card-background-color, #fff);
    --sbc-primary-text: var(--primary-text-color, #212121);
    --sbc-secondary-text: var(--secondary-text-color, #727272);
    --sbc-secondary-bg: var(--secondary-background-color, #f5f5f5);
    --sbc-divider: var(--divider-color, #e0e0e0);
  }

  ha-card {
    background: none !important;
    box-shadow: none !important;
    border: none !important;
    overflow: hidden;
    cursor: pointer;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius, 16px);
    overflow: hidden;
    background: var(--sbc-card-bg);
    box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.1));
  }

  /* ═══════════════════════════════════════════════════════════════
     HEADER
     ═══════════════════════════════════════════════════════════════ */

  .header {
    position: relative;
    min-height: var(--header-height, 120px);
    display: flex;
    align-items: center;
    width: 100%;
  }

  .header-accent {
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
    background-color: var(--accent-color);
    clip-path: polygon(0 0, 0% 100%, 100% 0);
    z-index: 0;
    transition: background-color 0.3s ease;
  }

  .header-accent.with-pattern {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px;
  }

  .header-content {
    position: relative;
    z-index: 10;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0 24px 0 16px;
  }

  .header-text {
    display: flex;
    flex-direction: column;
    text-align: right;
    margin-right: 20px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 0.05em;
    color: var(--sbc-primary-text);
    word-break: break-word;
  }

  .subtitle {
    font-size: 1.125rem;
    font-weight: 500;
    opacity: 0.6;
    margin-top: 4px;
    color: var(--sbc-secondary-text);
  }

  .header-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    flex-shrink: 0;
  }

  /* ═══════════════════════════════════════════════════════════════
     BODY
     ═══════════════════════════════════════════════════════════════ */

  .body {
    padding: 0 24px;
    background: var(--sbc-card-bg);
  }

  .status-box {
    font-size: 1rem;
    line-height: 1.6;
    padding: 16px;
    background: var(--sbc-secondary-bg);
    border-radius: 12px;
    border: 1px solid var(--sbc-divider);
  }

  .status-label {
    font-weight: 700;
  }

  .status-text {
    opacity: 0.9;
  }

  /* ═══════════════════════════════════════════════════════════════
     FOOTER
     ═══════════════════════════════════════════════════════════════ */

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--sbc-card-bg);
  }

  .timestamp {
    font-size: 0.75rem;
    font-family: var(--paper-font-code-family, monospace);
    opacity: 0.4;
    color: var(--sbc-primary-text);
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: none;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: white;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-family: inherit;
  }

  .action-btn:hover {
    opacity: 0.85;
  }

  .action-btn:active {
    transform: scale(0.95);
  }

  .action-btn ha-icon {
    --mdc-icon-size: 18px;
  }

  /* ═══════════════════════════════════════════════════════════════
     VARIANTS
     ═══════════════════════════════════════════════════════════════ */

  /* Header Only Variant */
  .card-container.header-only .header {
    border-radius: var(--border-radius, 16px);
  }

  /* Compact Variant */
  .card-container.compact .header {
    min-height: 80px;
  }

  .card-container.compact .title {
    font-size: 1.25rem;
  }

  .card-container.compact .subtitle {
    font-size: 1rem;
  }

  .card-container.compact .body {
    padding: 0 16px;
  }

  .card-container.compact .status-box {
    padding: 12px;
    font-size: 0.875rem;
  }

  .card-container.compact .footer {
    padding: 12px 16px;
  }

  /* ═══════════════════════════════════════════════════════════════
     ANIMATIONS
     ═══════════════════════════════════════════════════════════════ */

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  .loading {
    animation: pulse 1.5s infinite ease-in-out;
  }

  /* ═══════════════════════════════════════════════════════════════
     RESPONSIVE
     ═══════════════════════════════════════════════════════════════ */

  @media (max-width: 400px) {
    .title {
      font-size: 1.25rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .header-content {
      padding: 0 16px;
    }

    .body,
    .footer {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
`;let Rt=class extends rt{setConfig(t){if(!t.entity)throw new Error("You need to define an entity");this._config={...bt,...t,color_map:{...bt.color_map,...t.color_map}}}getCardSize(){return"compact"===this._config?.variant||"header-only"===this._config?.variant?2:3}shouldUpdate(t){if(t.has("_config"))return!0;if(t.has("hass")){const e=t.get("hass");if(!e)return!0;const i=this._config.entity;return e.states[i]!==this.hass.states[i]||(!(!this._config.timestamp_entity||e.states[this._config.timestamp_entity]===this.hass.states[this._config.timestamp_entity])||!(!this._config.secondary_info_entity||e.states[this._config.secondary_info_entity]===this.hass.states[this._config.secondary_info_entity]))}return!0}static getConfigElement(){return document.createElement("status-banner-card-editor")}static getStubConfig(){return{entity:"",rules:[{state:"on",title:"Active",subtitle:"System is running",icon:"mdi:check-circle",color:"#4CAF50"},{state:"off",title:"Inactive",subtitle:"System is idle",icon:"mdi:power-standby",color:"#9E9E9E"}],default:{title:"{{ state | upper }}",subtitle:"",icon:"mdi:information",color:"#2196F3"}}}render(){if(!this._config||!this.hass)return I``;const t=Et(this.hass,this._config.entity,this._config.rules,this._config.default,this._config.color_map,this._config.status_label),e=this._config.variant||"full",i=!1!==this._config.show_status&&"header-only"!==e,s=!1!==this._config.show_footer&&"header-only"!==e;return I`
      <ha-card @click=${this._handleCardClick}>
        <div
          class="card-container ${e}"
          style="--border-radius: ${this._config.border_radius}"
        >
          ${this._renderHeader(t)}
          ${i&&t.statusText?this._renderStatusBox(t):V}
          ${s?this._renderFooter(t):V}
        </div>
      </ha-card>
    `}_renderHeader(t){const e=!1!==this._config.show_pattern;return I`
      <div class="header" style="--header-height: ${this._config.header_height}">
        <div
          class="header-accent ${e?"with-pattern":""}"
          style="--accent-color: ${t.color}"
        ></div>

        <div class="header-content">
          <div class="header-text">
            <div class="title">${t.title}</div>
            ${t.subtitle?I`<div class="subtitle">${t.subtitle}</div>`:V}
          </div>

          <ha-icon
            class="header-icon"
            .icon=${t.icon}
            style="--mdc-icon-size: ${this._config.icon_size}; color: ${t.color}"
          ></ha-icon>
        </div>
      </div>
    `}_renderStatusBox(t){return I`
      <div class="body">
        <div class="status-box">
          <span class="status-label" style="color: ${t.color}">${t.statusLabel}:</span>
          <span class="status-text">${t.statusText}</span>
        </div>
      </div>
    `}_renderFooter(t){const e=this._getTimestamp(),i=this._config.button_actions?.[0];return e||i?I`
      <div class="footer">
        ${e?I` <div class="timestamp">Last Check: ${e}</div> `:I`<div></div>`}
        ${i?this._renderButton(i,t):V}
      </div>
    `:I``}_renderButton(t,e){const i=this.hass.states[this._config.entity],s={hass:this.hass,entity:this._config.entity,state:i?.state||"",attr:i?.attributes||{},colorMap:this._config.color_map},o=t.label?ft(t.label,s):"Update";return I`
      <button
        class="action-btn ${t.selector?.replace(".","")||"update-btn"}"
        style="background-color: ${e.color}"
        @click=${e=>this._handleButtonClick(e,t)}
      >
        ${t.icon?I`<ha-icon icon="${t.icon}"></ha-icon>`:V}
        <span>${o}</span>
      </button>
    `}_getTimestamp(){if(!this._config.timestamp_entity)return null;const t=this.hass.states[this._config.timestamp_entity];if(!t)return null;const e=this._config.timestamp_attribute||"last_triggered",i=t.attributes[e]||t.state;if(!i||"unknown"===i||"unavailable"===i)return null;try{const t=new Date(i);return isNaN(t.getTime())?null:t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return null}}_handleCardClick(){this._config.tap_action&&"more-info"!==this._config.tap_action.action?this._executeAction(this._config.tap_action):this._showMoreInfo()}_handleButtonClick(t,e){t.stopPropagation(),e.tap_action&&this._executeAction(e.tap_action)}_executeAction(t){if(t)switch(t.action){case"more-info":this._showMoreInfo();break;case"call-service":{if(!t.service)break;const[e,i]=t.service.split(".");this.hass.callService(e,i,{...t.service_data,...t.target||{}});break}case"navigate":t.navigation_path&&(window.history.pushState(null,"",t.navigation_path),window.dispatchEvent(new Event("location-changed")));break;case"url":t.url_path&&window.open(t.url_path,"_blank")}}_showMoreInfo(){const t=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this._config.entity}});this.dispatchEvent(t)}};Rt.styles=kt,t([ut({attribute:!1})],Rt.prototype,"hass",void 0),t([pt()],Rt.prototype,"_config",void 0),Rt=t([lt("status-banner-card")],Rt),window.customCards=window.customCards||[],window.customCards.push({type:xt,name:wt,description:At,preview:!0,documentationURL:St}),console.info("%c  STATUS-BANNER-CARD  %c  v1.0.0  ","color: white; background: #2196F3; font-weight: bold;","color: #2196F3; background: white; font-weight: bold;");let Mt=class extends rt{constructor(){super(...arguments),this._expandedRule=null}setConfig(t){this._config=t}render(){return this.hass&&this._config?I`
      <div class="editor-container">
        ${this._renderEntitySection()} ${this._renderRulesSection()} ${this._renderDefaultSection()}
        ${this._renderColorMapSection()} ${this._renderFooterSection()}
        ${this._renderLayoutSection()}
      </div>
    `:I``}_renderEntitySection(){return I`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:database"></ha-icon>
          <span>Entity</span>
        </div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity||""}
          .label=${"Primary Entity (required)"}
          @value-changed=${t=>this._valueChanged("entity",t.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.timestamp_entity||""}
          .label=${"Timestamp Entity (optional)"}
          .includeDomains=${["automation","script","sensor"]}
          @value-changed=${t=>this._valueChanged("timestamp_entity",t.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-textfield
          .value=${this._config.timestamp_attribute||"last_triggered"}
          .label=${"Timestamp Attribute"}
          @input=${t=>this._valueChanged("timestamp_attribute",t.target.value)}
        ></ha-textfield>
      </div>
    `}_renderRulesSection(){const t=this._config.rules||[];return I`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>State Rules</span>
        </div>

        <div class="rules-list">
          ${t.map((t,e)=>this._renderRule(t,e))}
        </div>

        <button class="add-btn" @click=${this._addRule}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add Rule
        </button>
      </div>
    `}_renderRule(t,e){const i=this._expandedRule===e;return I`
      <div class="rule-card ${i?"expanded":""}">
        <div class="rule-header" @click=${()=>this._toggleRule(e)}>
          <div class="rule-summary">
            <span class="rule-state">${t.state||"Any State"}</span>
            <span class="rule-title">${t.title||"No title"}</span>
          </div>
          <div class="rule-actions">
            <ha-icon-button
              .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${t=>this._removeRule(t,e)}
            ></ha-icon-button>
            <ha-icon icon="mdi:chevron-${i?"up":"down"}"></ha-icon>
          </div>
        </div>

        ${i?this._renderRuleDetails(t,e):V}
      </div>
    `}_renderRuleDetails(t,e){return I`
      <div class="rule-details">
        <ha-textfield
          .value=${t.state||""}
          .label=${"State Value (exact or /regex/)"}
          @input=${t=>this._updateRule(e,"state",t.target.value)}
        ></ha-textfield>

        <ha-textfield
          .value=${t.title||""}
          .label=${"Title (supports {{ templates }})"}
          @input=${t=>this._updateRule(e,"title",t.target.value)}
        ></ha-textfield>

        <ha-textfield
          .value=${t.subtitle||""}
          .label=${"Subtitle (supports {{ templates }})"}
          @input=${t=>this._updateRule(e,"subtitle",t.target.value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .value=${t.icon||""}
          .label=${"Icon"}
          @value-changed=${t=>this._updateRule(e,"icon",t.detail.value)}
        ></ha-icon-picker>

        <div class="color-input">
          <label>Color</label>
          <div class="color-input-row">
            <input
              type="color"
              .value=${t.color?.startsWith("#")?t.color:"#9E9E9E"}
              @input=${t=>this._updateRule(e,"color",t.target.value)}
            />
            <ha-textfield
              .value=${t.color||""}
              .label=${"Color or template"}
              @input=${t=>this._updateRule(e,"color",t.target.value)}
            ></ha-textfield>
          </div>
        </div>

        <ha-textfield
          .value=${t.status_text||""}
          .label=${"Status Text (supports {{ templates }})"}
          @input=${t=>this._updateRule(e,"status_text",t.target.value)}
        ></ha-textfield>
      </div>
    `}_renderDefaultSection(){const t=this._config.default||{};return I`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:cog-outline"></ha-icon>
          <span>Default Display</span>
        </div>
        <p class="section-description">Used when no rules match</p>

        <ha-textfield
          .value=${t.title??""}
          .label=${"Default Title"}
          @input=${t=>this._updateDefault("title",t.target.value)}
        ></ha-textfield>

        <ha-textfield
          .value=${t.subtitle??""}
          .label=${"Default Subtitle"}
          @input=${t=>this._updateDefault("subtitle",t.target.value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .value=${t.icon??""}
          .label=${"Default Icon"}
          @value-changed=${t=>this._updateDefault("icon",t.detail.value)}
        ></ha-icon-picker>

        <div class="color-input">
          <label>Default Color</label>
          <input
            type="color"
            .value=${t.color?.startsWith("#")?t.color:"#9E9E9E"}
            @input=${t=>this._updateDefault("color",t.target.value)}
          />
        </div>

        <ha-textfield
          .value=${t.status_text??""}
          .label=${"Default Status Text"}
          @input=${t=>this._updateDefault("status_text",t.target.value)}
        ></ha-textfield>
      </div>
    `}_renderColorMapSection(){const t=this._config.color_map||bt.color_map||{};return I`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:palette"></ha-icon>
          <span>Color Mapping</span>
        </div>
        <p class="section-description">Use with {{ attr.name | color_map }}</p>

        <div class="color-map-list">
          ${Object.entries(t).map(([t,e])=>I`
              <div class="color-map-item">
                <ha-textfield
                  .value=${t}
                  .label=${"Key"}
                  @input=${i=>this._updateColorMapKey(t,i.target.value,e)}
                ></ha-textfield>
                <input
                  type="color"
                  .value=${e}
                  @input=${e=>this._updateColorMap(t,e.target.value)}
                />
                <ha-icon-button
                  .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                  @click=${()=>this._removeColorMap(t)}
                ></ha-icon-button>
              </div>
            `)}
        </div>

        <button class="add-btn" @click=${this._addColorMap}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add Color
        </button>
      </div>
    `}_renderFooterSection(){const t=this._config.button_actions?.[0];return I`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
          <span>Button Action</span>
        </div>

        <ha-textfield
          .value=${t?.label||""}
          .label=${"Button Label"}
          @input=${t=>this._updateButtonAction("label",t.target.value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .value=${t?.icon||""}
          .label=${"Button Icon"}
          @value-changed=${t=>this._updateButtonAction("icon",t.detail.value)}
        ></ha-icon-picker>

        <ha-textfield
          .value=${t?.tap_action?.service||""}
          .label=${"Service (e.g., input_button.press)"}
          @input=${t=>this._updateButtonTapAction("service",t.target.value)}
        ></ha-textfield>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${t?.tap_action?.target?.entity_id||""}
          .label=${"Target Entity"}
          @value-changed=${t=>this._updateButtonTapAction("target",t.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>
      </div>
    `}_renderLayoutSection(){return I`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:page-layout-body"></ha-icon>
          <span>Layout Options</span>
        </div>

        <div class="toggle-row">
          <span>Show Diagonal Pattern</span>
          <ha-switch
            .checked=${!1!==this._config.show_pattern}
            @change=${t=>this._valueChanged("show_pattern",t.target.checked)}
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <span>Show Status Box</span>
          <ha-switch
            .checked=${!1!==this._config.show_status}
            @change=${t=>this._valueChanged("show_status",t.target.checked)}
          ></ha-switch>
        </div>

        <ha-textfield
          .value=${this._config.status_label||"Status"}
          .label=${"Status Label (Status/Strategy/Whatever)"}
          @input=${t=>this._valueChanged("status_label",t.target.value)}
        ></ha-textfield>

        <div class="toggle-row">
          <span>Show Footer</span>
          <ha-switch
            .checked=${!1!==this._config.show_footer}
            @change=${t=>this._valueChanged("show_footer",t.target.checked)}
          ></ha-switch>
        </div>

        <ha-textfield
          .value=${this._config.header_height||"120px"}
          .label=${"Header Height"}
          @input=${t=>this._valueChanged("header_height",t.target.value)}
        ></ha-textfield>

        <ha-textfield
          .value=${this._config.icon_size||"54px"}
          .label=${"Icon Size"}
          @input=${t=>this._valueChanged("icon_size",t.target.value)}
        ></ha-textfield>

        <ha-textfield
          .value=${this._config.border_radius||"16px"}
          .label=${"Border Radius"}
          @input=${t=>this._valueChanged("border_radius",t.target.value)}
        ></ha-textfield>

        <ha-select
          .value=${this._config.variant||"full"}
          .label=${"Card Variant"}
          @selected=${t=>this._valueChanged("variant",t.target.value)}
        >
          <mwc-list-item value="full">Full</mwc-list-item>
          <mwc-list-item value="header-only">Header Only</mwc-list-item>
          <mwc-list-item value="compact">Compact</mwc-list-item>
        </ha-select>
      </div>
    `}_valueChanged(t,e){if(!this._config)return;const i={...this._config,[t]:e};this._fireConfigChanged(i)}_updateRule(t,e,i){const s=[...this._config.rules||[]];s[t]={...s[t],[e]:i},this._fireConfigChanged({...this._config,rules:s})}_addRule(){const t=[...this._config.rules||[]];t.push({state:"",title:"",subtitle:"",icon:"mdi:information",color:"#9E9E9E"}),this._fireConfigChanged({...this._config,rules:t}),this._expandedRule=t.length-1}_removeRule(t,e){t.stopPropagation();const i=[...this._config.rules||[]];i.splice(e,1),this._fireConfigChanged({...this._config,rules:i}),this._expandedRule===e&&(this._expandedRule=null)}_toggleRule(t){this._expandedRule=this._expandedRule===t?null:t}_updateDefault(t,e){const i={...this._config.default||{},[t]:e};this._fireConfigChanged({...this._config,default:i})}_updateColorMap(t,e){const i={...this._config.color_map||{},[t]:e};this._fireConfigChanged({...this._config,color_map:i})}_updateColorMapKey(t,e,i){if(t===e)return;const s={...this._config.color_map||{}};delete s[t],s[e]=i,this._fireConfigChanged({...this._config,color_map:s})}_addColorMap(){const t={...this._config.color_map||{},new_color:"#9E9E9E"};this._fireConfigChanged({...this._config,color_map:t})}_removeColorMap(t){const e={...this._config.color_map||{}};delete e[t],this._fireConfigChanged({...this._config,color_map:e})}_updateButtonAction(t,e){const i=[...this._config.button_actions||[{selector:".update-btn",tap_action:{action:"none"}}]];i[0]||(i[0]={selector:".update-btn",tap_action:{action:"none"}}),i[0][t]=e,this._fireConfigChanged({...this._config,button_actions:i})}_updateButtonTapAction(t,e){const i=[...this._config.button_actions||[]];if(i[0]||(i[0]={selector:".update-btn",tap_action:{action:"call-service",service:"",target:{}}}),i[0].tap_action||(i[0].tap_action={action:"call-service",service:"",target:{}}),"target"===t)i[0].tap_action={...i[0].tap_action,target:{entity_id:e}};else{const s=i[0].tap_action;s[t]=e,"service"===t&&(s.action="call-service")}this._fireConfigChanged({...this._config,button_actions:i})}_fireConfigChanged(t){const e=new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0});this.dispatchEvent(e)}static get styles(){return a`
      .editor-container {
        padding: 16px;
      }

      .section {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .section:last-child {
        border-bottom: none;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .section-header ha-icon {
        color: var(--primary-color);
      }

      .section-description {
        font-size: 0.875rem;
        color: var(--secondary-text-color);
        margin: -8px 0 12px 0;
      }

      ha-entity-picker,
      ha-textfield,
      ha-icon-picker,
      ha-select {
        display: block;
        margin-bottom: 12px;
      }

      /* Rules */
      .rules-list {
        margin-bottom: 12px;
      }

      .rule-card {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        margin-bottom: 8px;
        overflow: hidden;
      }

      .rule-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        cursor: pointer;
        background: var(--secondary-background-color);
      }

      .rule-header:hover {
        background: var(--primary-background-color);
      }

      .rule-summary {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .rule-state {
        font-weight: 500;
        font-size: 0.875rem;
      }

      .rule-title {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
      }

      .rule-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .rule-details {
        padding: 16px;
        background: var(--card-background-color);
        border-top: 1px solid var(--divider-color);
      }

      /* Color Input */
      .color-input {
        margin-bottom: 12px;
      }

      .color-input label {
        display: block;
        font-size: 0.875rem;
        color: var(--secondary-text-color);
        margin-bottom: 8px;
      }

      .color-input-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .color-input input[type='color'] {
        width: 48px;
        height: 48px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        padding: 0;
      }

      .color-input-row ha-textfield {
        flex: 1;
        margin-bottom: 0;
      }

      /* Color Map */
      .color-map-list {
        margin-bottom: 12px;
      }

      .color-map-item {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;
      }

      .color-map-item ha-textfield {
        flex: 1;
        margin-bottom: 0;
      }

      .color-map-item input[type='color'] {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        padding: 0;
      }

      /* Toggle Row */
      .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
      }

      /* Add Button */
      .add-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: 1px dashed var(--divider-color);
        border-radius: 8px;
        background: transparent;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 0.875rem;
        width: 100%;
        justify-content: center;
      }

      .add-btn:hover {
        background: var(--secondary-background-color);
      }
    `}};t([ut({attribute:!1})],Mt.prototype,"hass",void 0),t([pt()],Mt.prototype,"_config",void 0),t([pt()],Mt.prototype,"_expandedRule",void 0),Mt=t([lt("status-banner-card-editor")],Mt);export{Rt as StatusBannerCard,Mt as StatusBannerCardEditor};
//# sourceMappingURL=status-banner-card.js.map
