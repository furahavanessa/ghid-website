/* Apply the saved language (EN/FR) before the page draws, to avoid a flash. */
try{var l=localStorage.getItem('ghid-lang');if(l==='fr'){document.documentElement.setAttribute('data-lang','fr');document.documentElement.lang='fr'}}catch(e){}
